
from typing import Dict, List, Optional
from datetime import datetime, date
from astro_app.backend.astrology.utils import get_zodiac_sign

class TransitAnalyzer:
    """
    Analyzes daily planetary transits.
    - Moon Sign & Nakshatra (Primary Trigger)
    - Transit Aspects to Natal Planets
    - Fast Planet Activity (Sun, Mercury, Venus, Mars)
    """

    def analyze(self, chart_data: Dict) -> Dict:
        """
        Analyze current transits against the birth chart.
        """
        # In a real implementation, we would call an ephemeris service here.
        # For this engine, we assume the 'chart_data' might already include
        # a pre-calculated 'current_transits' block from the Orchestrator,
        # OR we calculate it on the fly if we had the ephemeris library available in this context.
        
        # Taking 'transits' from the input for now (Engine will inject it)
        transits = chart_data.get("transits", {})
        
        # 1. Moon Analysis (The Daily Driver)
        moon = transits.get("Moon", {})
        moon_sign = moon.get("sign", "Unknown")
        moon_nakshatra = moon.get("nakshatra", "Unknown")
        
        # 2. Key Planet Triggers (Saturn, Jupiter, Rahu/Ketu)
        heavy_hitters = {
            "Saturn": transits.get("Saturn", {}),
            "Jupiter": transits.get("Jupiter", {}),
            "Rahu": transits.get("Rahu", {}),
            "Ketu": transits.get("Ketu", {})
        }
        
        return {
            "moon": {
                "sign": moon_sign,
                "nakshatra": moon_nakshatra,
                "current_house": self._calculate_transit_house(moon, chart_data)
            },
            "major_transits": heavy_hitters
        }

    def _calculate_transit_house(self, planet: Dict, chart_data: Dict) -> int:
        """
        Calculate which house a transiting planet is currently in (relative to Natal Ascendant).
        """
        if not planet or not chart_data: return 0
        
        # Simple Whole Sign Logic for speed
        # Natal Ascendant Sign ID (1-12)
        asc_sign = chart_data.get("ascendant", {}).get("sign_id", 1)
        
        # Transit Planet Sign ID (1-12)
        # Assuming 'sign_id' is provided or derived from 'sign' name
        p_sign_name = planet.get("sign", "Aries")
        p_sign_id = self._get_sign_id(p_sign_name)
        
        # Calculation: (Transit - Asc + 12) % 12
        # Example: Asc Aries (1), Transit Taurus (2) -> (2 - 1) + 1 = 2nd House
        house = (p_sign_id - asc_sign) + 1
        if house <= 0: house += 12
        
        return house

    def _get_sign_id(self, sign_name: str) -> int:
        SIGNS = [
            "Aries", "Taurus", "Gemini", "Cancer", 
            "Leo", "Virgo", "Libra", "Scorpio", 
            "Sagittarius", "Capricorn", "Aquarius", "Pisces"
        ]
        try:
            return SIGNS.index(sign_name) + 1
        except ValueError:
            return 1
