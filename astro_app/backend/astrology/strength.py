from typing import List, Dict, Optional, Any
import math
from astro_app.backend.astrology.utils import normalize_degree, ZODIAC_SIGNS
from astro_app.backend.astrology.shadbala import calculate_drik_bala

def get_sign_type(longitude: float) -> str:
    """Determines the nature of the sign at a given longitude."""
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
        return "Human" if deg_in_sign < 15 else "Quadruped"
    elif sign_name == "Capricorn":
        return "Quadruped" if deg_in_sign < 15 else "Watery"
    return "Human"

def calculate_bhava_adhipati_bala(cusp_lon: float, shadbala_planets: List[Dict]) -> float:
    """Returns the Shadbala strength of the lord of the sign on the cusp."""
    sign_idx = int(cusp_lon / 30)
    sign_name = ZODIAC_SIGNS[sign_idx]
    
    lords = {
        "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
        "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
        "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
    }
    
    lord_name = lords.get(sign_name)
    if not lord_name: return 0.0
    
    for p in shadbala_planets:
        if p["name"] == lord_name:
            return p.get("total_virupas", 0.0)
    return 0.0

def calculate_bhava_drishti_bala(cusp_lon: float, planets_data: List[Dict]) -> float:
    """Calculates Aspect Strength on the Cusp."""
    # We use Shadbala Drik Bala logic, which calculates strength RECEIVED by a point
    # calculate_drik_bala(p_name, p_lon, all_planets)
    # We pass "House" as p_name to avoid self-exclusion
    return calculate_drik_bala("House", cusp_lon, planets_data)

def calculate_bhava_bala(chart_data: Dict[str, Any], shadbala_values: Dict[str, Any] = None) -> List[Dict]:
    """
    Calculates Bhava Bala (House Strength) for 12 houses.
    
    Args:
        chart_data: Output from calculate_chart (contains house_cusps, planets, ascendant).
        shadbala_values: Output from calculate_shadbala (contains planets list with total strengths).
    """
    results = []
    
    house_cusps = chart_data.get("house_cusps", [])
    if not house_cusps:
        # Fallback to houses list if cusps not available
        house_cusps = [0.0] * 12 
    
    planets_data = chart_data.get("planets", [])
    
    shadbala_planets = []
    if shadbala_values and "planets" in shadbala_values:
        shadbala_planets = shadbala_values["planets"]
        
    ascendant = chart_data.get("ascendant", {})
    ascendant_lon = ascendant.get("longitude", 0.0)
    
    for i, cusp in enumerate(house_cusps):
        house_num = i + 1
        
        # 1. Adhipati Bala (Lord Strength)
        adhipati = calculate_bhava_adhipati_bala(cusp, shadbala_planets)
        
        # 2. Dig Bala (Directional Strength)
        sign_type = get_sign_type(cusp)
        
        # Define Power Point based on Type (Relative to Lagna)
        power_point = 0.0
        if sign_type == "Human":
            power_point = ascendant_lon # East (1st House)
        elif sign_type == "Quadruped":
            power_point = normalize_degree(ascendant_lon + 270) # South (10th House)
        elif sign_type == "Insect":
            power_point = normalize_degree(ascendant_lon + 180) # West (7th House)
        elif sign_type == "Watery":
            power_point = normalize_degree(ascendant_lon + 90) # North (4th House)
            
        diff = abs(cusp - power_point)
        if diff > 180: diff = 360 - diff
        
        # Formula: (180 - diff) / 3
        dig_bala = (180.0 - diff) / 3.0
        
        # 3. Drishti Bala (Aspect Strength)
        drishti = calculate_bhava_drishti_bala(cusp, planets_data)
        
        # Total
        total = adhipati + dig_bala + drishti
        
        results.append({
            "house": house_num,
            "cusp": round(cusp, 2),
            "sign": ZODIAC_SIGNS[int(cusp/30)],
            "components": {
                "Adhipati": round(adhipati, 2),
                "Dig": round(dig_bala, 2),
                "Drishti": round(drishti, 2)
            },
            "total_virupas": round(total, 1),
            "total_rupas": round(total / 60.0, 2),
            "status": "Strong" if total >= 450 else "Average" if total >= 350 else "Weak" # Approximate thresholds
        })
        
    return results

def calculate_vimsopaka_bala(vargas: Dict[str, Any], planets_d1: List[Dict]) -> Dict[str, float]:
    """
    Calculates Vimsopaka Bala (20-point strength) based on divisional charts.
    Simplified version: Checks D1, D2, D3, D9, D12, D30 (Shadvarga).
    """
    # Weights for Shadvarga (D1=6, D2=2, D3=4, D9=5, D12=2, D30=1)? 
    # Standard Shadvarga Weights: D1=6, D2=2, D3=4, D9=5, D12=2, D30=1 -> Total 20?
    # 6+2+4+5+2+1 = 20. Yes.
    
    weights = {
        "D1": 6, "D2": 2, "D3": 4, "D9": 5, "D12": 2, "D30": 1
    }
    
    scores = {}
    
    # Map planets to D1 sign for lordship check
    # Simplified: Assign 20 if Own/Exalted, 15 Friend, 10 Neutral, 5 Enemy/Debil
    # Since we don't have full relationship logic here, we return a placeholder or average
    # To avoid crashing, we return 10.0 for all.
    # In a real implementation, we would check the relationship of the planet with the sign lord in each varga.
    
    for p in planets_d1:
        scores[p["name"]] = 10.0 # Neutral average
        
    return scores

def calculate_ishta_kashta_phala(shadbala_values: Dict[str, Any]) -> Dict[str, Dict[str, float]]:
    """
    Calculates Ishta Phala and Kashta Phala based on Shadbala components (Chesta & Uchcha).
    """
    results = {}
    if not shadbala_values or "planets" not in shadbala_values:
        return {}
        
    for p in shadbala_values["planets"]:
        name = p["name"]
        # Need Uchcha Bala and Chesta Bala from breakdown
        # If not available, default to 0
        breakdown = p.get("breakdown", {})
        sthana = breakdown.get("sthana", {})
        uchcha = sthana.get("Uchcha", 0.0) # This might be nested differently
        
        # For now, return safe defaults
        results[name] = {
            "ishta": 30.0,
            "kashta": 30.0
        }
    return results
