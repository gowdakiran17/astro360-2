
from typing import List, Dict, Optional, Union
import math
from astro_app.backend.astrology.utils import (
    normalize_degree, get_zodiac_sign, get_sign_index, 
    ZODIAC_SIGNS, ZODIAC_LORDS
)

# Standard Divisional Charts
VARGAS = {
    "D1": 1, "D2": 2, "D3": 3, "D4": 4, "D7": 7, "D9": 9, "D10": 10,
    "D12": 12, "D16": 16, "D20": 20, "D24": 24, "D27": 27, "D30": 30,
    "D40": 40, "D45": 45, "D60": 60
}

# Sign Categories
MOVABLE = [0, 3, 6, 9] # Aries, Cancer, Libra, Capricorn
FIXED = [1, 4, 7, 10]  # Taurus, Leo, Scorpio, Aquarius
DUAL = [2, 5, 8, 11]   # Gemini, Virgo, Sagittarius, Pisces

FIRE = [0, 4, 8]
EARTH = [1, 5, 9]
AIR = [2, 6, 10]
WATER = [3, 7, 11]

def get_sign_category(sign_idx: int) -> str:
    if sign_idx in MOVABLE: return "Movable"
    if sign_idx in FIXED: return "Fixed"
    return "Dual"

def get_element(sign_idx: int) -> str:
    if sign_idx in FIRE: return "Fire"
    if sign_idx in EARTH: return "Earth"
    if sign_idx in AIR: return "Air"
    return "Water"

def calculate_varga_sign(longitude: float, varga_num: int) -> int:
    """
    Calculates the 0-based sign index for a given divisional chart (D-N).
    """
    norm_lon = normalize_degree(longitude)
    sign_idx = int(norm_lon / 30)
    deg_in_sign = norm_lon % 30
    
    # Generic division index (0 to N-1)
    part_idx = int(deg_in_sign / (30.0 / varga_num))
    
    if varga_num == 1:
        return sign_idx
        
    elif varga_num == 2: # Hora
        # Odd: 0-15 Sun (Leo=4), 15-30 Moon (Cancer=3)
        # Even: 0-15 Moon (Cancer=3), 15-30 Sun (Leo=4)
        is_odd = (sign_idx % 2 == 0) # 0=Aries (Odd)
        is_first_half = (deg_in_sign < 15)
        
        if is_odd:
            return 4 if is_first_half else 3
        else:
            return 3 if is_first_half else 4
            
    elif varga_num == 3: # Drekkana
        # 1: Same, 2: 5th, 3: 9th
        return (sign_idx + part_idx * 4) % 12
        
    elif varga_num == 4: # Chaturthamsa
        # 1: Same, 2: 4th, 3: 7th, 4: 10th
        offsets = [0, 3, 6, 9]
        return (sign_idx + offsets[part_idx]) % 12
        
    elif varga_num == 7: # Saptamsa
        # Odd: Same, Even: 7th
        start_sign = sign_idx if (sign_idx % 2 == 0) else (sign_idx + 6)
        return (start_sign + part_idx) % 12
        
    elif varga_num == 9: # Navamsa
        # Fire: Aries(0), Earth: Cap(9), Air: Lib(6), Water: Can(3)
        element = get_element(sign_idx)
        start_map = {"Fire": 0, "Earth": 9, "Air": 6, "Water": 3}
        start_sign = start_map[element]
        return (start_sign + part_idx) % 12
        
    elif varga_num == 10: # Dasamsa
        # Odd: Same, Even: 9th
        start_sign = sign_idx if (sign_idx % 2 == 0) else (sign_idx + 8)
        return (start_sign + part_idx) % 12
        
    elif varga_num == 12: # Dwadasamsa
        # From same sign
        return (sign_idx + part_idx) % 12
        
    elif varga_num == 16: # Shodasamsa
        # Movable: Aries, Fixed: Leo, Dual: Sag
        cat = get_sign_category(sign_idx)
        start_map = {"Movable": 0, "Fixed": 4, "Dual": 8}
        start_sign = start_map[cat]
        return (start_sign + part_idx) % 12
        
    elif varga_num == 20: # Vimsamsa
        # Movable: Aries, Fixed: Sag, Dual: Leo
        cat = get_sign_category(sign_idx)
        start_map = {"Movable": 0, "Fixed": 8, "Dual": 4}
        start_sign = start_map[cat]
        return (start_sign + part_idx) % 12
        
    elif varga_num == 24: # Chaturvimsamsa
        # Odd: Leo, Even: Cancer
        start_sign = 4 if (sign_idx % 2 == 0) else 3
        return (start_sign + part_idx) % 12
        
    elif varga_num == 27: # Saptavimsamsa
        # Fire: Aries, Earth: Cancer, Air: Libra, Water: Cap
        element = get_element(sign_idx)
        start_map = {"Fire": 0, "Earth": 3, "Air": 6, "Water": 9}
        start_sign = start_map[element]
        return (start_sign + part_idx) % 12
        
    elif varga_num == 30: # Trimsamsa
        # Complex degrees
        # Odd Signs: 0-5 Mars(0), 5-10 Sat(10), 10-18 Jup(8), 18-25 Mer(2), 25-30 Ven(1)
        # Even Signs: 0-5 Ven(1), 5-12 Mer(2), 12-20 Jup(8), 20-25 Sat(10), 25-30 Mars(0)
        is_odd = (sign_idx % 2 == 0)
        d = deg_in_sign
        if is_odd:
            if d < 5: return 0 # Aries
            if d < 10: return 10 # Aquarius
            if d < 18: return 8 # Sagittarius
            if d < 25: return 2 # Gemini
            return 6 # Libra (Venus) - Wait, usually Tau/Lib? 
            # Parasara: Mars(Aries), Sat(Aquarius), Jup(Sag), Merc(Gemini), Venus(Libra)
            # Standard for Odd: 5, 5, 8, 7, 5 degrees.
            # Rulers: Mars, Sat, Jup, Merc, Ven. 
            # Signs: Aries, Aquarius, Sagittarius, Gemini, Libra.
        else:
            # Even: Ven(Tau), Mer(Vir), Jup(Pis), Sat(Cap), Mar(Sco)
            # 0-5 Ven, 5-12 Mer, 12-20 Jup, 20-25 Sat, 25-30 Mars
            if d < 5: return 1 # Taurus
            if d < 12: return 5 # Virgo
            if d < 20: return 11 # Pisces
            if d < 25: return 9 # Capricorn
            return 7 # Scorpio
            
    elif varga_num == 40: # Khavedamsa
        # Odd: Aries, Even: Libra
        start_sign = 0 if (sign_idx % 2 == 0) else 6
        return (start_sign + part_idx) % 12
        
    elif varga_num == 45: # Akshavedamsa
        # Movable: Aries, Fixed: Leo, Dual: Sag
        cat = get_sign_category(sign_idx)
        start_map = {"Movable": 0, "Fixed": 4, "Dual": 8}
        start_sign = start_map[cat]
        return (start_sign + part_idx) % 12
        
    elif varga_num == 60: # Shashtyamsa
        # From same sign? No.
        # "Ignore sign, take degree * 2. Ignore integer part..." 
        # Actually standard D60 is: 
        # Current Sign + Part Index?
        # Standard: Count from the sign itself.
        return (sign_idx + part_idx) % 12
        
    return sign_idx # Fallback

def get_deity(varga: str, part_idx: int, sign_idx: int) -> str:
    """Returns the deity for the varga division."""
    # Placeholder for deities
    return "Deity"

def calculate_d9_navamsa(longitude: float) -> Dict:
    """
    Calculates D9 Sign details for a specific longitude.
    """
    sign_idx = calculate_varga_sign(longitude, 9)
    # Calculate longitude within the D9 sign (0-30)
    # Formula: (Longitude * 9) % 360 -> then within sign? 
    # Actually just (Longitude * 9) % 30 is the degree within the varga sign.
    d9_deg = (longitude * 9) % 30
    
    return {
        "sign": ZODIAC_SIGNS[sign_idx],
        "zodiac_sign": ZODIAC_SIGNS[sign_idx], # Alias for varga_service compatibility
        "sign_id": sign_idx,
        "lord": ZODIAC_LORDS[ZODIAC_SIGNS[sign_idx]],
        "longitude": d9_deg
    }

def calculate_d16_shodashamsa(longitude: float) -> Dict:
    """
    Calculates D16 Sign details for a specific longitude.
    """
    sign_idx = calculate_varga_sign(longitude, 16)
    d16_deg = (longitude * 16) % 30
    return {
        "sign": ZODIAC_SIGNS[sign_idx],
        "zodiac_sign": ZODIAC_SIGNS[sign_idx], # Alias for varga_service compatibility
        "sign_id": sign_idx,
        "lord": ZODIAC_LORDS[ZODIAC_SIGNS[sign_idx]],
        "longitude": d16_deg
    }

async def calculate_divisional_charts(planets: List[Dict]) -> Dict[str, List[Dict]]:
    """
    Calculates all 16 Divisional Charts (Shodashvarga).
    """
    results = {}
    
    # Pre-calculate Ascendant info if present
    asc_planet = next((p for p in planets if p["name"] == "Ascendant"), None)
    
    for v_name, v_num in VARGAS.items():
        chart_planets = []
        
        # Calculate Ascendant for this Varga first
        asc_sign_idx = 0
        if asc_planet:
            asc_sign_idx = calculate_varga_sign(asc_planet["longitude"], v_num)
        
        for p in planets:
            p_lon = p["longitude"]
            v_sign_idx = calculate_varga_sign(p_lon, v_num)
            
            # Calculate House relative to Varga Ascendant
            # House 1 = Asc Sign
            house = (v_sign_idx - asc_sign_idx) % 12 + 1
            
            # For longitude in Varga:
            # Usually we project it into 0-30 degrees of that sign?
            # Or just keep it as sign placement.
            # Let's keep it simple: Sign placement.
            
            chart_planets.append({
                "name": p["name"],
                "sign": ZODIAC_SIGNS[v_sign_idx],
                "house": house,
                "lord": ZODIAC_LORDS[ZODIAC_SIGNS[v_sign_idx]],
                # Deities etc can be added
            })
            
        results[v_name] = chart_planets
        
    return results

def calculate_rasi_tulya_amsa(d1_planets: List[Dict], dn_planets: List[Dict], dn_name: str = "D9") -> List[Dict]:
    """
    Calculates Rasi Tulya Amsha (Planets of D-N placed in D-1 signs)
    or Amsha Tulya Rashi (Planets of D-1 placed in D-N signs).
    
    Standard Request: "Superimpose D9 on D1".
    This means: Take D9 planet positions (Signs) and plot them in D1 chart (which has D1 Ascendant).
    The "House" is determined by D1 Ascendant.
    The "Sign" is determined by D9 position.
    
    Args:
        d1_planets: List of D1 planets (Must include Ascendant).
        dn_planets: List of D-N planets.
        dn_name: Name of the divisional chart (e.g. "D9").
    """
    # 1. Find D1 Ascendant Sign Index
    d1_asc = next((p for p in d1_planets if p["name"] == "Ascendant"), None)
    if not d1_asc:
        return []
        
    # If d1_planets have 'longitude', calculate sign index
    d1_asc_sign_idx = int(d1_asc["longitude"] / 30)
    
    superimposed = []
    
    for p in dn_planets:
        name = p["name"]
        dn_sign = p.get("sign") # D-N Sign Name
        if not dn_sign: continue
        
        dn_sign_idx = get_sign_index(dn_sign)
        
        # Calculate House in D1 (relative to D1 Asc)
        # House = (Sign Index - Asc Index) + 1
        house_num = (dn_sign_idx - d1_asc_sign_idx) % 12 + 1
        
        superimposed.append({
            "planet": name,
            "source_chart": dn_name,
            "sign": dn_sign,
            "house_in_d1": house_num,
            "is_vargottama": False 
        })
        
    # Check Vargottama (if D1 planets provided match names)
    for sp in superimposed:
        d1_p = next((p for p in d1_planets if p["name"] == sp["planet"]), None)
        if d1_p:
            d1_sign_idx = int(d1_p["longitude"] / 30)
            dn_sign_idx = get_sign_index(sp["sign"])
            if d1_sign_idx == dn_sign_idx:
                sp["is_vargottama"] = True
                
    return superimposed
