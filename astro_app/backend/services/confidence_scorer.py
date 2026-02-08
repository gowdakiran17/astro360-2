"""
Confidence Scoring Service for AI Vedic Astrology Chatbot

Calculates prediction confidence based on:
- Dasha alignment (30%)
- Transit support (25%)
- House activation (25%)
- KP confirmation (20%)

Confidence Levels:
- ≥75: Strong (High confidence prediction)
- 60-74: Moderate (Conditional prediction)
- 45-59: Mild (Weak indication)
- <45: No clear indication (Should not predict)
"""

from typing import Dict, List, Optional, Any
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class ConfidenceLevel(Enum):
    """Confidence level classifications"""
    STRONG = "strong"          # ≥75
    MODERATE = "moderate"      # 60-74
    MILD = "mild"              # 45-59
    NO_INDICATION = "none"     # <45


# Weight distribution for confidence calculation
CONFIDENCE_WEIGHTS = {
    "dasha": 0.30,
    "transit": 0.25,
    "house": 0.25,
    "kp": 0.20,
}


class ConfidenceScorer:
    """
    Calculates astrological prediction confidence.
    
    Uses a weighted composite score from:
    - Dasha period alignment
    - Transit support
    - House activation
    - KP sub-lord confirmation
    """
    
    def __init__(self):
        self.weights = CONFIDENCE_WEIGHTS
    
    def calculate(
        self,
        dasha_score: float,
        transit_score: float,
        house_score: float,
        kp_score: float,
        modifiers: Optional[Dict[str, float]] = None
    ) -> Dict:
        """
        Calculate overall confidence score.
        
        Args:
            dasha_score: 0-100 score for dasha alignment
            transit_score: 0-100 score for transit support
            house_score: 0-100 score for house activation
            kp_score: 0-100 score for KP confirmation
            modifiers: Optional dict of adjustment factors
            
        Returns:
            {
                "score": int (0-100),
                "level": ConfidenceLevel,
                "level_name": str,
                "can_predict": bool,
                "breakdown": Dict,
                "interpretation": str
            }
        """
        # Normalize scores to 0-1
        d = min(max(dasha_score / 100, 0), 1)
        t = min(max(transit_score / 100, 0), 1)
        h = min(max(house_score / 100, 0), 1)
        k = min(max(kp_score / 100, 0), 1)
        
        # Calculate weighted composite
        raw_score = (
            d * self.weights["dasha"] +
            t * self.weights["transit"] +
            h * self.weights["house"] +
            k * self.weights["kp"]
        )
        
        # Apply modifiers if any
        modifier_total = 1.0
        modifier_details = {}
        if modifiers:
            for name, factor in modifiers.items():
                modifier_total *= factor
                modifier_details[name] = factor
        
        final_score = int(raw_score * modifier_total * 100)
        final_score = min(max(final_score, 0), 100)
        
        # Determine level
        level = self._get_level(final_score)
        
        return {
            "score": final_score,
            "level": level,
            "level_name": level.value,
            "can_predict": level != ConfidenceLevel.NO_INDICATION,
            "breakdown": {
                "dasha": {
                    "score": int(dasha_score),
                    "weight": self.weights["dasha"],
                    "contribution": round(d * self.weights["dasha"] * 100, 1)
                },
                "transit": {
                    "score": int(transit_score),
                    "weight": self.weights["transit"],
                    "contribution": round(t * self.weights["transit"] * 100, 1)
                },
                "house": {
                    "score": int(house_score),
                    "weight": self.weights["house"],
                    "contribution": round(h * self.weights["house"] * 100, 1)
                },
                "kp": {
                    "score": int(kp_score),
                    "weight": self.weights["kp"],
                    "contribution": round(k * self.weights["kp"] * 100, 1)
                },
                "modifiers": modifier_details
            },
            "interpretation": self._get_interpretation(level, final_score)
        }
    
    def _get_level(self, score: int) -> ConfidenceLevel:
        """Determine confidence level from score"""
        if score >= 75:
            return ConfidenceLevel.STRONG
        elif score >= 60:
            return ConfidenceLevel.MODERATE
        elif score >= 45:
            return ConfidenceLevel.MILD
        else:
            return ConfidenceLevel.NO_INDICATION
    
    def _get_interpretation(self, level: ConfidenceLevel, score: int) -> str:
        """Generate human-readable interpretation"""
        if level == ConfidenceLevel.STRONG:
            return f"Strong astrological support ({score}%). Clear indication present."
        elif level == ConfidenceLevel.MODERATE:
            return f"Moderate support ({score}%). Conditional indication - depends on timing."
        elif level == ConfidenceLevel.MILD:
            return f"Mild indication ({score}%). Weak support - proceed with caution."
        else:
            return f"No clear indication ({score}%). Astrological factors do not strongly support or deny."
    
    def score_dasha_alignment(
        self,
        md_planet: str,
        ad_planet: str,
        relevant_houses: List[int],
        planet_house_map: Dict[str, int],
        planet_strength: Dict[str, float]
    ) -> float:
        """
        Score how well current dasha supports the intent.
        
        Args:
            md_planet: Mahadasha planet name
            ad_planet: Antardasha planet name  
            relevant_houses: Houses relevant to the intent
            planet_house_map: Mapping of planet to house it rules/occupies
            planet_strength: Shadbala or strength percentage
            
        Returns:
            Score 0-100
        """
        score = 0.0
        
        # Check if MD planet rules/occupies relevant houses
        md_house = planet_house_map.get(md_planet, 0)
        if md_house in relevant_houses:
            score += 40
        
        # Check if AD planet rules/occupies relevant houses
        ad_house = planet_house_map.get(ad_planet, 0)
        if ad_house in relevant_houses:
            score += 30
        
        # Factor in planet strength
        md_strength = planet_strength.get(md_planet, 50)
        ad_strength = planet_strength.get(ad_planet, 50)
        
        # Bonus for strong planets
        if md_strength > 60:
            score += 15
        elif md_strength < 30:
            score -= 10
            
        if ad_strength > 60:
            score += 15
        elif ad_strength < 30:
            score -= 10
        
        return max(0, min(100, score))
    
    def score_transit_support(
        self,
        transiting_planets: List[Dict],
        relevant_houses: List[int],
        natal_moon_sign: int
    ) -> float:
        """
        Score transit support for the intent.
        
        Args:
            transiting_planets: List of current transit positions
            relevant_houses: Houses relevant to intent
            natal_moon_sign: Natal moon sign (1-12)
            
        Returns:
            Score 0-100
        """
        score = 0.0
        
        for planet in transiting_planets:
            planet_name = planet.get("name", "")
            transit_house = planet.get("house_from_moon", 0)
            
            # Check if transit is in relevant house from Moon
            if transit_house in relevant_houses:
                # Weight by planet importance
                if planet_name in ["Jupiter", "Saturn"]:
                    score += 25
                elif planet_name in ["Sun", "Mars", "Venus", "Mercury"]:
                    score += 15
                elif planet_name == "Moon":
                    score += 10
                else:
                    score += 5
        
        return min(100, score)
    
    def score_house_activation(
        self,
        relevant_houses: List[int],
        house_strengths: Dict[int, float],
        house_occupants: Dict[int, List[str]]
    ) -> float:
        """
        Score house activation for the intent.
        
        Args:
            relevant_houses: Houses relevant to intent
            house_strengths: Strength of each house
            house_occupants: Planets in each house
            
        Returns:
            Score 0-100
        """
        if not relevant_houses:
            return 50  # Neutral
        
        total_strength = 0.0
        benefic_count = 0
        malefic_count = 0
        
        benefics = ["Jupiter", "Venus", "Mercury", "Moon"]
        malefics = ["Saturn", "Mars", "Rahu", "Ketu", "Sun"]
        
        for house in relevant_houses:
            # Add house strength
            strength = house_strengths.get(house, 50)
            total_strength += strength
            
            # Count benefic/malefic occupants
            occupants = house_occupants.get(house, [])
            for planet in occupants:
                if planet in benefics:
                    benefic_count += 1
                elif planet in malefics:
                    malefic_count += 1
        
        avg_strength = total_strength / len(relevant_houses)
        
        # Adjust based on occupants
        benefic_bonus = benefic_count * 10
        malefic_penalty = malefic_count * 5
        
        score = avg_strength + benefic_bonus - malefic_penalty
        
        return max(0, min(100, score))
    
    def score_kp_confirmation(
        self,
        relevant_houses: List[int],
        cusp_sub_lords: Dict[int, Dict],
        planet_significators: Dict[str, List[int]]
    ) -> float:
        """
        Score KP sub-lord confirmation.
        
        Args:
            relevant_houses: Houses relevant to intent
            cusp_sub_lords: Sub-lord details for each cusp
            planet_significators: House significations for each planet
            
        Returns:
            Score 0-100
        """
        if not relevant_houses or not cusp_sub_lords:
            return 50  # Neutral if no KP data
        
        score = 0.0
        checked = 0
        
        for house in relevant_houses:
            cusp_data = cusp_sub_lords.get(house, {})
            sub_lord = cusp_data.get("sub_lord", "")
            
            if not sub_lord:
                continue
            
            checked += 1
            
            # Check if sub-lord signifies the required houses
            sub_lord_houses = planet_significators.get(sub_lord, [])
            
            # Count how many relevant houses the sub-lord signifies
            matching = len(set(relevant_houses) & set(sub_lord_houses))
            
            if matching > 0:
                # Proportional scoring
                score += (matching / len(relevant_houses)) * 100 / len(relevant_houses)
        
        if checked == 0:
            return 50
        
        return min(100, score)


# Singleton instance
confidence_scorer = ConfidenceScorer()
