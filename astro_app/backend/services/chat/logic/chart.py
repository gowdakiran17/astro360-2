
from typing import Dict, List, Optional

class ChartProcessor:
    """
    Handles all static chart calculations required by the AI Engine.
    - House Lords
    - Functional Benefic/Malefic analysis
    - KP Cusp details
    - Strength metrics (Shadbala normalization)
    """

    def process(self, chart_data: Dict) -> Dict:
        """
        Enrich raw chart data with mandatory calculated fields.
        """
        # 1. Basic Extraction
        planets = self._normalize_planets(chart_data.get("planets", {}))
        houses = self._normalize_houses(chart_data.get("houses", {}))
        ascendant = chart_data.get("ascendant", {})
        
        # 2. House Lordship & Functional Nature
        asc_sign_id = ascendant.get("sign_id", 1)
        house_details = self._analyze_house_lordships(asc_sign_id)
        
        # 3. KP Integration (if available)
        kp_data = chart_data.get("kp", {})
        
        return {
            "ascendant": ascendant,
            "planets": planets,
            "houses": houses,
            "house_details": house_details, # Enriched with functional nature
            "kp": kp_data,
            "strengths": self._extract_strengths(planets)
        }

    def _normalize_planets(self, raw_planets: Dict) -> Dict:
        # Convert list/dict to standardized dict keyed by planet Name
        normalized = {}
        if isinstance(raw_planets, list):
            for p in raw_planets:
                if isinstance(p, dict) and "name" in p:
                    normalized[p["name"]] = p
        elif isinstance(raw_planets, dict):
            normalized = raw_planets
        return normalized

    def _normalize_houses(self, raw_houses: Dict) -> Dict:
        # Convert to dict keyed by house number (1-12)
        normalized = {}
        if isinstance(raw_houses, list):
            for h in raw_houses:
                if isinstance(h, dict) and "house_number" in h:
                    normalized[str(h["house_number"])] = h
        elif isinstance(raw_houses, dict):
            normalized = raw_houses
        return normalized

    def _analyze_house_lordships(self, asc_sign_id: int) -> Dict:
        """
        Determine lordship and functional nature based on Ascendant.
        """
        # Map: Sign ID -> Lord Name
        SIGN_LORDS = {
            1: "Mars", 2: "Venus", 3: "Mercury", 4: "Moon",
            5: "Sun", 6: "Mercury", 7: "Venus", 8: "Mars",
            9: "Jupiter", 10: "Saturn", 11: "Saturn", 12: "Jupiter"
        }
        
        house_analysis = {}
        
        for house_num in range(1, 13):
            # Calculate sign in house (Whole Sign assumption for simplicity in lordship)
            # Or use explicit house cusp sign if available. 
            # Ideally: Use user's selected system. Here we approximate with Whole Sign lordship logic for Functional Nature.
            sign_in_house = (asc_sign_id + house_num - 2) % 12 + 1
            lord = SIGN_LORDS.get(sign_in_house, "Unknown")
            
            # TODO: Implement complex functional benefic/malefic logic
            # For now, simplistic trine/kendra logic
            is_kendras = house_num in [1, 4, 7, 10]
            is_trines = house_num in [1, 5, 9]
            is_dusthana = house_num in [6, 8, 12]
            
            house_analysis[house_num] = {
                "system_sign_id": sign_in_house,
                "lord": lord,
                "type": "Kendra" if is_kendras else "Trikona" if is_trines else "Dusthana" if is_dusthana else "Neutral"
            }
            
        return house_analysis

    def _extract_strengths(self, planets: Dict) -> Dict:
        # Extract or calculate Shadbala %
        strengths = {}
        for name, data in planets.items():
            # Assume data has 'shadbala' or 'system_strength'
            # Normalize to 0-100 scale
            raw = data.get("strength", 0)
            strengths[name] = min(100, max(0, raw)) # Clamp
        return strengths
