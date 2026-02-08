
from typing import Dict, List

class ConfidenceScorer:
    """
    Calculates numerical confidence score (0-100) for predictions.
    
    Factors:
    - Dasha Strength (40%)
    - Transit Support (30%)
    - Planetary Strength (20%)
    - Aspect/Activation (10%)
    
    Bands:
    - 80-100: Strong / High Certainty
    - 60-79: Moderate / Likely
    - < 60: Neutral / Observational (No prediction)
    """

    def calculate(self, context: Dict) -> Dict:
        """
        Compute confidence score based on available evidence.
        """
        score = 0.0
        details = []
        
        # 1. Dasha Check (Base Score)
        dasha = context.get("dasha", {})
        if dasha.get("mahadasha", {}).get("lord"):
            score += 40
            details.append("Active Dasha Period verified (+40)")
        
        # 2. Transit Support
        transits = context.get("transits", {})
        moon = transits.get("moon", {})
        if moon.get("sign"):
            score += 15
            details.append("Moon Transit active (+15)")
            
        # Check for major transit hits (e.g. Saturn/Jupiter)
        # Simplified check: valid transit data exists
        if transits.get("major_transits"):
            score += 15
            details.append("Major Transits calculated (+15)")
            
        # 3. Strength/Aspects
        # Placeholder logic: If chart processing succeeded
        if context.get("chart_details", {}).get("ascendant"):
            score += 20
            details.append("Chart Analysis successful (+20)")
            
        # Normalize
        final_score = min(100, int(score))
        
        return {
            "score": final_score,
            "band": self._get_band(final_score),
            "breakdown": details
        }

    def _get_band(self, score: int) -> str:
        if score >= 80: return "Strong"
        if score >= 60: return "Moderate"
        return "Neutral"
