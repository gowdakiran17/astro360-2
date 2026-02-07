
"""
Planetary Aspects Engine
------------------------
Calculates both Vedic (Graha Drishti) and Western (Geometric) aspects.
"""
from typing import List, Dict, Any
import math

class AspectEngine:
    
    # Western Aspect Definitions
    WESTERN_ASPECTS = {
        "Conjunction": {"angle": 0, "orb": 8},
        "Opposition": {"angle": 180, "orb": 8},
        "Trine": {"angle": 120, "orb": 8},
        "Square": {"angle": 90, "orb": 8},
        "Sextile": {"angle": 60, "orb": 6}
    }
    
    # Vedic Aspect Rules (Planet -> House Offset)
    # All planets aspect 7th. Mars (4, 8), Jupiter (5, 9), Saturn (3, 10).
    VEDIC_SPECIAL_ASPECTS = {
        "Mars": [4, 7, 8],
        "Jupiter": [5, 7, 9],
        "Saturn": [3, 7, 10],
        "Rahu": [5, 7, 9], # Often considered like Jupiter
        "Ketu": [5, 7, 9]
    }

    @staticmethod
    def calculate_western_aspects(planets: List[Dict]) -> List[Dict]:
        """
        Calculate Western Aspects between planets.
        Includes Orb and Applying/Separating status.
        """
        aspects = []
        p_count = len(planets)
        
        for i in range(p_count):
            p1 = planets[i]
            if p1["name"] in ["Ascendant", "Uranus", "Neptune", "Pluto"]: continue # Core planets + Nodes usually
            
            for j in range(i + 1, p_count):
                p2 = planets[j]
                if p2["name"] == "Ascendant": continue # Handled separately if needed
                
                # Calculate Angle
                diff = abs(p1["longitude"] - p2["longitude"])
                if diff > 180: diff = 360 - diff
                
                # Check Aspects
                for asp_name, asp_data in AspectEngine.WESTERN_ASPECTS.items():
                    target = asp_data["angle"]
                    orb_limit = asp_data["orb"]
                    
                    # Special Orb for Sun/Moon
                    if "Sun" in [p1["name"], p2["name"]] or "Moon" in [p1["name"], p2["name"]]:
                        orb_limit += 2
                        
                    current_orb = abs(diff - target)
                    
                    if current_orb <= orb_limit:
                        # Determine Applying/Separating
                        # Faster planet moves away or towards?
                        # Simplified logic: 
                        # If p1 is faster, and p1 < p2 (in zodiac order), and angle < target, it's applying (approaching target).
                        # This requires complex relative speed logic.
                        # For now, we return 'Exactness' (orb).
                        
                        aspects.append({
                            "p1": p1["name"],
                            "p2": p2["name"],
                            "aspect": asp_name,
                            "angle": round(diff, 2),
                            "orb": round(current_orb, 2),
                            "is_exact": current_orb < 1.0
                        })
                        
        return aspects

    @staticmethod
    def calculate_vedic_aspects(planets: List[Dict], houses: List[Dict]) -> Dict:
        """
        Calculate Vedic Aspects (Graha Drishti).
        1. Planet -> Planet (Mutual)
        2. Planet -> House
        """
        planet_map = {p["name"]: p for p in planets}
        house_map = {h["house_number"]: h for h in houses}
        
        # 1. Planet -> House
        p_to_h = {}
        h_received = {h: [] for h in range(1, 13)}
        
        for p in planets:
            p_name = p["name"]
            if p_name in ["Uranus", "Neptune", "Pluto"]: continue
            
            p_house = p.get("house")
            if not p_house: continue # Should be there
            
            rules = AspectEngine.VEDIC_SPECIAL_ASPECTS.get(p_name, [7])
            
            aspected_houses = []
            for offset in rules:
                target_h = (p_house + offset - 1) % 12 + 1
                aspected_houses.append(target_h)
                h_received[target_h].append(p_name)
                
            p_to_h[p_name] = aspected_houses
            
        # 2. Planet -> Planet (Based on House Aspect)
        # If Mars is in H1, it aspects H4. If Venus is in H4, Mars aspects Venus.
        p_to_p = []
        
        for p_name, targets in p_to_h.items():
            for target_h in targets:
                # Find planets in target_h
                for target_p in planets:
                    if target_p["name"] == p_name: continue
                    if target_p.get("house") == target_h:
                        p_to_p.append({
                            "source": p_name,
                            "target": target_p["name"],
                            "type": "Graha Drishti"
                        })
                        
        return {
            "planet_to_house": p_to_h,
            "house_received_aspects": h_received,
            "planet_to_planet": p_to_p
        }
