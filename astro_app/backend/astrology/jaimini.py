
import swisseph as swe
from astro_app.backend.astrology.utils import get_zodiac_sign, get_sign_index, get_house_lord, ZODIAC_SIGNS
from astro_app.backend.astrology.divisional import calculate_d9_navamsa
from typing import List, Dict, Any

"""
Jaimini Astrology Module (Phase 2)
----------------------------------
Implementation of Jaimini System: Karakas, Arudha Padas, Chara Dasha, and Karakamsa.
Updated with Dual Lordship rules and corrected Chara Dasha logic.
"""

def determine_stronger_lord(sign_name: str, p1_name: str, p2_name: str, planet_details: Dict[str, Any]) -> str:
    """
    Determines the stronger lord for Scorpio (Mars vs Ketu) and Aquarius (Saturn vs Rahu).
    Rules (Simplified for stability):
    1. If one planet is in the sign itself, the other is treated as the effective lord for calculation.
    2. The one conjoined with more planets is stronger.
    3. The one with higher degrees (longitude % 30) is stronger.
    """
    p1 = planet_details.get(p1_name)
    p2 = planet_details.get(p2_name)
    
    if not p1 or not p2:
        return p1_name if p1 else p2_name # Fallback
        
    # 1. Placement in Own Sign
    # If Mars is in Scorpio, Ketu becomes the functional lord for Arudha/Dasha length.
    p1_in_sign = p1['zodiac_sign'] == sign_name
    p2_in_sign = p2['zodiac_sign'] == sign_name
    
    if p1_in_sign and not p2_in_sign: return p2_name
    if p2_in_sign and not p1_in_sign: return p1_name
    
    # 2. Conjunctions (Count planets in same sign)
    # We need full planet list to check this properly, but assuming 'planet_details' has all planets
    # Let's verify 'planet_details' structure. It's usually name->dict.
    # We can count planets in p1['zodiac_sign'] vs p2['zodiac_sign'].
    
    p1_sign = p1['zodiac_sign']
    p2_sign = p2['zodiac_sign']
    
    count_p1 = sum(1 for p in planet_details.values() if p.get('zodiac_sign') == p1_sign)
    count_p2 = sum(1 for p in planet_details.values() if p.get('zodiac_sign') == p2_sign)
    
    if count_p1 > count_p2: return p1_name
    if count_p2 > count_p1: return p2_name
    
    # 3. Degrees (Higher is stronger)
    # Note: For Nodes (Rahu/Ketu), degrees are often reversed (30-deg) in Jaimini?
    # Or raw degrees? Usually raw degrees in standard comparison unless specified.
    # But strictly, AK is highest degree.
    deg1 = p1['longitude'] % 30
    deg2 = p2['longitude'] % 30
    
    if deg1 >= deg2: return p1_name
    return p2_name

def calculate_karakamsa(karakas: dict) -> dict:
    """
    Calculates Karakamsa (Swamsa).
    Karakamsa is the sign occupied by the Atmakaraka (AK) in the Navamsa (D9) chart.
    """
    ak_planet = karakas.get('AK') or karakas.get('Atmakaraka')
    
    if not ak_planet:
        return {"sign": "Unknown", "longitude": 0.0}
        
    ak_lon = ak_planet['longitude']
    d9_pos = calculate_d9_navamsa(ak_lon)
    
    return {
        "sign": d9_pos['zodiac_sign'],
        "longitude": d9_pos['longitude'],
        "chart": "D9"
    }

def calculate_jaimini_karakas(planets: list, scheme: str = '7_karaka') -> dict:
    """
    Calculates Jaimini Karakas based on planet degrees.
    """
    eligible_names = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
    if scheme == '8_karaka':
        eligible_names.append("Rahu")
        
    candidates = []
    for p in planets:
        if p['name'] in eligible_names:
            deg_in_sign = p.get('degree', p['longitude'] % 30)
            
            # For Rahu in 8-Karaka scheme: 30 - deg
            if p['name'] == "Rahu":
                deg_in_sign = 30.0 - deg_in_sign
                
            candidates.append({
                "name": p['name'],
                "degree": deg_in_sign,
                "zodiac_sign": p.get('zodiac_sign', get_zodiac_sign(p['longitude'])),
                "longitude": p['longitude']
            })
            
    candidates.sort(key=lambda x: x['degree'], reverse=True)
    
    karaka_names_7 = ["AK", "AmK", "BK", "MK", "PiK", "GK", "DK"]
    karaka_names_8 = ["AK", "AmK", "BK", "MK", "PiK", "PuK", "GK", "DK"]
    
    names_to_use = karaka_names_8 if scheme == '8_karaka' else karaka_names_7
    
    result = {}
    count = min(len(candidates), len(names_to_use))
    
    for i in range(count):
        k_name = names_to_use[i]
        planet = candidates[i]
        result[k_name] = planet
        
    return result

def calculate_arudha_padas(ascendant_lon: float, planets: list) -> dict:
    """
    Calculates Arudha Padas (A1 to A12) including AL and UL.
    Supports Dual Lordship for Scorpio and Aquarius.
    """
    # Map planets for lookup
    planet_map = {p['name']: p for p in planets}
    # Ensure signs are populated
    for p in planet_map.values():
        if 'zodiac_sign' not in p:
            p['zodiac_sign'] = get_zodiac_sign(p['longitude'])
            
    asc_sign = get_zodiac_sign(ascendant_lon)
    asc_index = get_sign_index(asc_sign)
    
    padas = {}
    
    for h in range(1, 13):
        house_idx = (asc_index + (h - 1)) % 12
        house_sign = ZODIAC_SIGNS[house_idx]
        
        # Determine Lord
        lord_name = get_house_lord(house_sign)
        
        # Handle Dual Lordship
        if house_sign == "Scorpio":
            lord_name = determine_stronger_lord("Scorpio", "Mars", "Ketu", planet_map)
        elif house_sign == "Aquarius":
            lord_name = determine_stronger_lord("Aquarius", "Saturn", "Rahu", planet_map)
            
        if lord_name not in planet_map:
            padas[f"A{h}"] = house_sign
            continue
            
        lord_data = planet_map[lord_name]
        lord_sign = lord_data['zodiac_sign']
        lord_idx = get_sign_index(lord_sign)
        
        # Distance (Steps)
        dist_steps = (lord_idx - house_idx) % 12
        
        # Arudha Position
        arudha_idx = (lord_idx + dist_steps) % 12
        
        # Exceptions (1st or 7th)
        dist_from_house = (arudha_idx - house_idx) % 12
        if dist_from_house == 0 or dist_from_house == 6:
            arudha_idx = (arudha_idx + 9) % 12 # Move 10th
            
        arudha_sign = ZODIAC_SIGNS[arudha_idx]
        
        label = f"A{h}"
        padas[label] = {
            "sign": arudha_sign,
            "house_num": h,
            "lord": lord_name,
            "lord_sign": lord_sign
        }
        
    padas['AL'] = padas['A1']
    padas['UL'] = padas['A12']
    
    return padas

def calculate_chara_dasha(asc_lon: float, planets: list) -> list:
    """
    Calculates Jaimini Chara Dasha (K.N. Rao Method).
    """
    asc_sign = get_zodiac_sign(asc_lon)
    asc_idx = get_sign_index(asc_sign) + 1 # 1-based
    
    # Map planets
    planet_map = {p['name']: p for p in planets}
    for p in planet_map.values():
        if 'zodiac_sign' not in p:
            p['zodiac_sign'] = get_zodiac_sign(p['longitude'])
            
    # Directions: 1 = Forward, -1 = Backward
    # K.N. Rao Scheme
    directions = {
        1: 1, 5: 1, 6: 1, 7: 1, 8: 1, 12: 1,
        2: -1, 3: -1, 4: -1, 9: -1, 10: -1, 11: -1
    }
    
    progression_dir = directions.get(asc_idx, 1)
    
    periods = []
    current_year = 0
    current_sign_idx = asc_idx
    
    for i in range(12):
        sign_num = current_sign_idx
        sign_name = ZODIAC_SIGNS[sign_num - 1]
        
        # Determine Lord
        lord_name = get_house_lord(sign_name)
        if sign_name == "Scorpio":
            lord_name = determine_stronger_lord("Scorpio", "Mars", "Ketu", planet_map)
        elif sign_name == "Aquarius":
            lord_name = determine_stronger_lord("Aquarius", "Saturn", "Rahu", planet_map)
            
        lord_sign = planet_map.get(lord_name, {}).get('zodiac_sign', sign_name)
        lord_sign_num = get_sign_index(lord_sign) + 1
        
        # Years Calculation (Always based on Sign's specific direction)
        count_dir = directions.get(sign_num, 1)
        
        if count_dir == 1:
            count = (lord_sign_num - sign_num)
            if count <= 0: count += 12
        else:
            count = (sign_num - lord_sign_num)
            if count <= 0: count += 12
            
        years = count - 1
        if years == 0: years = 12
        
        periods.append({
            "sign_name": sign_name,
            "lord": lord_name,
            "duration": years,
            "start_year": current_year,
            "end_year": current_year + years
        })
        
        current_year += years
        
        # Next Sign
        current_sign_idx += progression_dir
        if current_sign_idx > 12: current_sign_idx = 1
        if current_sign_idx < 1: current_sign_idx = 12
        
    return periods

def calculate_jaimini_aspects(planets: list) -> dict:
    """
    Calculates Jaimini Rashi Drishti (Sign Aspects).
    """
    aspect_map = {
        "Aries": ["Leo", "Scorpio", "Aquarius"],
        "Cancer": ["Scorpio", "Aquarius", "Taurus"],
        "Libra": ["Aquarius", "Taurus", "Leo"],
        "Capricorn": ["Taurus", "Leo", "Scorpio"],
        "Taurus": ["Cancer", "Libra", "Capricorn"],
        "Leo": ["Libra", "Capricorn", "Aries"],
        "Scorpio": ["Capricorn", "Aries", "Cancer"],
        "Aquarius": ["Aries", "Cancer", "Libra"],
        "Gemini": ["Virgo", "Sagittarius", "Pisces"],
        "Virgo": ["Gemini", "Sagittarius", "Pisces"],
        "Sagittarius": ["Gemini", "Virgo", "Pisces"],
        "Pisces": ["Gemini", "Virgo", "Sagittarius"]
    }
    
    sign_occupants = {sign: [] for sign in aspect_map.keys()}
    for p in planets:
        sign = p.get('zodiac_sign', get_zodiac_sign(p['longitude']))
        if sign in sign_occupants:
            sign_occupants[sign].append(p['name'])
            
    aspects = {}
    for p in planets:
        p_name = p['name']
        p_sign = p.get('zodiac_sign', get_zodiac_sign(p['longitude']))
        
        aspected_signs = aspect_map.get(p_sign, [])
        aspected_planets = []
        
        for s in aspected_signs:
            aspected_planets.extend(sign_occupants[s])
            
        aspects[p_name] = {
            "aspects_signs": aspected_signs,
            "aspects_planets": aspected_planets
        }
        
    return aspects

def calculate_argala(asc_sign: str, planets: list) -> dict:
    """
    Calculates Jaimini Argala (Intervention) and Virodha Argala (Obstruction) for the Ascendant.
    Argala: Planets in 2, 4, 11 (Primary) and 5 (Secondary).
    Obstruction: Planets in 12, 10, 3 (Primary) and 9 (Secondary).
    """
    sign_idx = get_sign_index(asc_sign)
    
    # Map planets to signs
    sign_occupants = {s: [] for s in ZODIAC_SIGNS}
    for p in planets:
        s = p.get('zodiac_sign', get_zodiac_sign(p['longitude']))
        if s in sign_occupants:
            sign_occupants[s].append(p['name'])
            
    # Helper to get count and planets in Nth house from Asc
    def get_house_content(n):
        idx = (sign_idx + n - 1) % 12
        sign = ZODIAC_SIGNS[idx]
        return sign_occupants[sign]

    argalas = []
    
    # Define Pairs: (Argala House, Virodha House, Name)
    pairs = [
        (2, 12, "Dhana Argala"),
        (4, 10, "Sukha Argala"),
        (11, 3, "Labha Argala"),
        (5, 9, "Suta Argala") # Secondary
    ]
    
    for arg_h, obs_h, name in pairs:
        arg_planets = get_house_content(arg_h)
        obs_planets = get_house_content(obs_h)
        
        strength = len(arg_planets) - len(obs_planets)
        status = "Neutral"
        if strength > 0: status = "Strong Argala"
        elif strength < 0: status = "Obstructed"
        elif len(arg_planets) > 0: status = "Balanced" # Both have planets equal
        else: status = "None"
        
        if status != "None":
            argalas.append({
                "type": name,
                "argala_house": arg_h,
                "causing_planets": arg_planets,
                "virodha_house": obs_h,
                "obstructing_planets": obs_planets,
                "status": status,
                "net_strength": strength
            })
            
    return {"ascendant": asc_sign, "argalas": argalas}
