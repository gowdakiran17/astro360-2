from typing import List, Dict, Optional
import math
from astro_app.backend.astrology.utils import normalize_degree, ZODIAC_SIGNS
from astro_app.backend.astrology.shadbala import calculate_drik_bala

# --- CONSTANTS ---

# Sign Natures for Dig Bala
# 0=Aries, 1=Taurus, ...
# Types: 'Human', 'Quadruped', 'Watery', 'Insect'
# Some signs are split.
# We will use a function to determine type based on longitude.

def get_sign_type(longitude: float) -> str:
    """
    Determines the nature of the sign at a given longitude.
    """
    sign_idx = int(longitude / 30)
    deg_in_sign = longitude % 30
    
    sign_name = ZODIAC_SIGNS[sign_idx]
    
    if sign_name in ["Gemini", "Virgo", "Libra", "Aquarius"]:
        return "Human"
    elif sign_name in ["Aries", "Taurus", "Leo"]:
        return "Quadruped"
    elif sign_name in ["Cancer", "Pisces"]:
        return "Watery"
    elif sign_name == "Scorpio":
        return "Insect"
    elif sign_name == "Sagittarius":
        # 0-15 Human, 15-30 Quadruped
        return "Human" if deg_in_sign < 15 else "Quadruped"
    elif sign_name == "Capricorn":
        # 0-15 Quadruped, 15-30 Watery
        return "Quadruped" if deg_in_sign < 15 else "Watery"
    
    return "Human" # Fallback

def calculate_bhava_dig_bala(cusp_lon: float) -> float:
    """
    Calculates Directional Strength of a House (Bhava Dig Bala).
    Based on the sign on the cusp.
    
    Rules (BPHS):
    - Human Signs strong in East (Lagna/1st House, approx ascendant) -> But here we measure from the 'ideal' angle?
      No, the rule is: 
      - Human signs get full strength (60) if they are in the East (Lagna).
      - Quadruped signs get full strength (60) in South (10th House).
      - Insect signs get full strength (60) in West (7th House).
      - Watery signs get full strength (60) in North (4th House).
      
    If they are elsewhere, strength is reduced proportionally.
    Difference from powerful point / 180 * 60? 
    Or (180 - diff) / 3 ? (Same as Dig Bala for planets).
    
    Points of strength (relative to the BHAVA CHART, i.e., House 1 is East):
    Wait. The strength depends on which HOUSE the sign falls in?
    Or where the sign is relative to the compass?
    
    Interpretation 1: 
    If a Human sign is in the 1st House (Ascendant), it is strong.
    If a Human sign is in the 7th House, it is weak (0 strength).
    
    Interpretation 2:
    The strength is calculated based on the difference between the Cusp Longitude and the "Point of Strength" for that sign type.
    But "East" is defined by the Ascendant (Lagna).
    So East = Ascendant Longitude.
    South = Ascendant - 90 (or +270).
    West = Ascendant + 180.
    North = Ascendant + 90.
    
    So:
    - Human Sign on Cusp: Strength = 60 - (|Cusp - Asc|/3)
    - Quadruped on Cusp: Strength = 60 - (|Cusp - (Asc-90)|/3)
    - Insect on Cusp: Strength = 60 - (|Cusp - (Asc+180)|/3)
    - Watery on Cusp: Strength = 60 - (|Cusp - (Asc+90)|/3)
    
    This matches standard software implementations.
    """
    # We need Ascendant longitude to define East.
    # But this function only takes cusp_lon. 
    # Wait, Bhava Bala is for each House.
    # The "East" is always the Lagna (House 1 Cusp).
    # So I need the Lagna Longitude.
    pass

def calculate_bhava_adhipati_bala(cusp_lon: float, shadbala_results: List[Dict]) -> float:
    """
    Returns the Shadbala strength of the lord of the sign on the cusp.
    """
    sign_idx = int(cusp_lon / 30)
    sign_name = ZODIAC_SIGNS[sign_idx]
    
    # Map Sign to Lord
    lords = {
        "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
        "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
        "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
    }
    
    lord_name = lords.get(sign_name)
    if not lord_name: return 0.0
    
    # Find Lord in Shadbala Results
    # shadbala_results is list of dicts: [{'name': 'Sun', 'total_rupas': ...}, ...]
    # We usually use Rupas or Virupas? 
    # Bhava Bala is usually in Virupas (Total ~400-500).
    # Shadbala total_virupas is available.
    
    for p in shadbala_results:
        if p["name"] == lord_name:
            return p.get("total_virupas", 0.0)
            
    return 0.0

def calculate_bhava_drishti_bala(cusp_lon: float, planets_data: List[Dict]) -> float:
    """
    Calculates Aspect Strength on the Cusp.
    Reuses Shadbala Drik Bala logic.
    """
    # Use dummy name "House" to avoid self-exclusion logic
    return calculate_drik_bala("House", cusp_lon, planets_data)

async def calculate_bhava_bala(
    house_cusps: List[float], 
    planets_data: List[Dict], 
    shadbala_results: List[Dict],
    ascendant_lon: float
) -> List[Dict]:
    """
    Calculates Bhava Bala for all 12 houses.
    
    Args:
        house_cusps: List of 12 longitudes (Bhava Madhya).
        planets_data: Basic planet data (positions).
        shadbala_results: Output from calculate_shadbala (contains total strengths).
        ascendant_lon: Longitude of Ascendant (Lagna) - defines East.
    """
    results = []
    
    for i, cusp in enumerate(house_cusps):
        house_num = i + 1
        
        # 1. Adhipati Bala (Lord Strength)
        adhipati = calculate_bhava_adhipati_bala(cusp, shadbala_results)
        
        # 2. Dig Bala (Directional Strength)
        sign_type = get_sign_type(cusp)
        
        # Define Power Point based on Type
        # East = Ascendant
        power_point = 0.0
        if sign_type == "Human":
            power_point = ascendant_lon # East
        elif sign_type == "Quadruped":
            power_point = normalize_degree(ascendant_lon + 270) # South (10th)
        elif sign_type == "Insect":
            power_point = normalize_degree(ascendant_lon + 180) # West (7th)
        elif sign_type == "Watery":
            power_point = normalize_degree(ascendant_lon + 90) # North (4th)
            
        diff = abs(cusp - power_point)
        if diff > 180: diff = 360 - diff
        
        # Formula: (180 - diff) / 3
        # Max 60, Min 0
        dig_bala = (180.0 - diff) / 3.0
        
        # 3. Drishti Bala (Aspect Strength)
        drishti = calculate_bhava_drishti_bala(cusp, planets_data)
        
        # Total
        total = adhipati + dig_bala + drishti
        
        results.append({
            "house": house_num,
            "cusp": cusp,
            "components": {
                "Adhipati": round(adhipati, 2),
                "Dig": round(dig_bala, 2),
                "Drishti": round(drishti, 2)
            },
            "total": round(total, 2),
            "ratio": round(total / 60.0, 2) # Ratio in Rupas (approx)
        })
        
    return results
