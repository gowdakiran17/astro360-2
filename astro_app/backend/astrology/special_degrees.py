
from typing import List, Dict
from astro_app.backend.astrology.utils import normalize_degree, get_zodiac_sign

# Mrtyu Bhaga Degrees (Fatality Points)
# Values are specific degrees in specific signs (Aries to Pisces).
MRTYU_BHAGA = {
    "Sun": [20, 9, 12, 6, 8, 24, 16, 17, 22, 2, 3, 23],
    "Moon": [26, 12, 13, 25, 24, 11, 26, 14, 13, 25, 5, 12],
    "Mars": [19, 28, 25, 23, 29, 28, 14, 21, 2, 15, 11, 6],
    "Mercury": [15, 14, 13, 12, 8, 18, 20, 10, 21, 22, 7, 5],
    "Jupiter": [19, 29, 12, 27, 6, 4, 13, 10, 17, 11, 15, 28],
    "Venus": [28, 15, 11, 17, 10, 13, 4, 6, 27, 12, 29, 19],
    "Saturn": [10, 4, 7, 9, 12, 16, 3, 18, 28, 14, 13, 15],
    "Rahu": [14, 13, 12, 11, 24, 23, 22, 21, 10, 20, 18, 8],
    "Ketu": [8, 18, 20, 10, 21, 22, 23, 24, 11, 12, 13, 14]
}

def check_special_degrees(planets: List[Dict]) -> Dict:
    """
    Checks for special degree-based conditions:
    1. Mrtyu Bhaga (Fatal Degrees)
    2. Pushkara Navamsa (Nourishing Degrees)
    """
    results = {
        "mrtyu_bhaga": [],
        "pushkara_navamsa": []
    }
    
    for p in planets:
        name = p["name"]
        lon = p["longitude"]
        sign_idx = int(lon / 30)
        deg_in_sign = lon % 30
        
        # 1. Check Mrtyu Bhaga
        if name in MRTYU_BHAGA:
            mb_deg = MRTYU_BHAGA[name][sign_idx]
            # Strict orb check (usually < 1 degree is critical)
            if abs(deg_in_sign - mb_deg) < 1.0:
                results["mrtyu_bhaga"].append({
                    "planet": name,
                    "sign": get_zodiac_sign(lon),
                    "degree": round(deg_in_sign, 2),
                    "mb_degree": mb_deg,
                    "orb": round(abs(deg_in_sign - mb_deg), 2),
                    "status": "In Mrtyu Bhaga Zone"
                })
                
        # 2. Check Pushkara Navamsa
        # Fire (1,5,9): 7th (20-23.20) & 9th (26.40-30)
        # Earth (2,6,10): 3rd (6.40-10) & 5th (13.20-16.40)
        # Air (3,7,11): 6th (16.40-20) & 8th (23.20-26.40)
        # Water (4,8,12): 1st (0-3.20) & 3rd (6.40-10)
        
        # Remainder when dividing (sign_idx + 1) by 4 gives element?
        # 1%4=1(Fire), 2%4=2(Earth), 3%4=3(Air), 4%4=0(Water). Correct.
        element_rem = (sign_idx + 1) % 4
        is_pushkara = False
        
        if element_rem == 1: # Fire
            if (20.0 <= deg_in_sign < 23.333) or (26.666 <= deg_in_sign < 30.0): is_pushkara = True
        elif element_rem == 2: # Earth
            if (6.666 <= deg_in_sign < 10.0) or (13.333 <= deg_in_sign < 16.666): is_pushkara = True
        elif element_rem == 3: # Air
            if (16.666 <= deg_in_sign < 20.0) or (23.333 <= deg_in_sign < 26.666): is_pushkara = True
        elif element_rem == 0: # Water
            if (0.0 <= deg_in_sign < 3.333) or (6.666 <= deg_in_sign < 10.0): is_pushkara = True
            
        if is_pushkara:
            results["pushkara_navamsa"].append({
                "planet": name,
                "sign": get_zodiac_sign(lon),
                "degree": round(deg_in_sign, 2),
                "status": "In Pushkara Navamsa"
            })
            
    return results
