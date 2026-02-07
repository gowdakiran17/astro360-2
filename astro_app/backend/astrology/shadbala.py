from typing import List, Dict, Any, Optional
import math
import logging
import swisseph as swe
from datetime import datetime
from astro_app.backend.astrology.utils import get_zodiac_sign, normalize_degree, get_nakshatra_details, get_julian_day, ZODIAC_SIGNS
from astro_app.backend.astrology.varga_service import get_all_shodashvargas

logger = logging.getLogger(__name__)

# --- CONSTANTS ---

# Exaltation Points (Sign Index 0-11, Degree)
EXALTATION_POINTS = {
    "Sun": (0, 10),      # Aries 10
    "Moon": (1, 3),      # Taurus 3
    "Mars": (9, 28),     # Capricorn 28
    "Mercury": (5, 15),  # Virgo 15
    "Jupiter": (3, 5),   # Cancer 5
    "Venus": (11, 27),   # Pisces 27
    "Saturn": (6, 20)    # Libra 20
}

# Natural Relationships (Naisargika Maitri)
# 1: Friend, 0: Neutral, -1: Enemy
NATURAL_FRIENDSHIPS = {
    "Sun":     {"Moon": 1, "Mars": 1, "Jupiter": 1, "Mercury": 0, "Venus": -1, "Saturn": -1},
    "Moon":    {"Sun": 1, "Mercury": 1, "Mars": 0, "Jupiter": 0, "Venus": 0, "Saturn": 0},
    "Mars":    {"Sun": 1, "Moon": 1, "Jupiter": 1, "Venus": 0, "Saturn": 0, "Mercury": -1},
    "Mercury": {"Sun": 1, "Venus": 1, "Mars": 0, "Jupiter": 0, "Saturn": 0, "Moon": -1},
    "Jupiter": {"Sun": 1, "Moon": 1, "Mars": 1, "Saturn": 0, "Mercury": -1, "Venus": -1},
    "Venus":   {"Mercury": 1, "Saturn": 1, "Mars": 0, "Jupiter": 0, "Sun": -1, "Moon": -1},
    "Saturn":  {"Mercury": 1, "Venus": 1, "Jupiter": 0, "Sun": -1, "Moon": -1, "Mars": -1}
}

# Naisargika Bala (Natural Strength) in Virupas
NAISARGIKA_BALA_VALUES = {
    "Sun": 60.0,
    "Moon": 51.43,
    "Mars": 17.14,
    "Mercury": 25.71,
    "Jupiter": 34.29,
    "Venus": 42.86,
    "Saturn": 8.57
}

# Minimum Requirements in Rupas (1 Rupa = 60 Virupas)
SHADBALA_REQUIREMENTS = {
    "Sun": 6.5,
    "Moon": 6.0,
    "Mars": 5.0,
    "Mercury": 7.0,
    "Jupiter": 6.5,
    "Venus": 5.5,
    "Saturn": 5.0
}

# --- CONSTANTS FOR TIME BALA ---
HORA_SEQUENCE = ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"]
WEEKDAY_LORDS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]

PLANET_IDS = {
    "Sun": swe.SUN, "Moon": swe.MOON, "Mars": swe.MARS, "Mercury": swe.MERCURY, 
    "Jupiter": swe.JUPITER, "Venus": swe.VENUS, "Saturn": swe.SATURN
}

# --- HELPER FUNCTIONS ---

def get_planet_sign_index(lon: float) -> int:
    return int(lon / 30)

def get_distance(lon1: float, lon2: float) -> float:
    """Shortest distance between two longitudes on the circle."""
    diff = abs(lon1 - lon2)
    return min(diff, 360 - diff)

def calculate_uchcha_bala(p_name: str, p_lon: float) -> float:
    """
    Exaltation Strength.
    Formula: |Longitude - Debilitation Point| / 3
    """
    if p_name not in EXALTATION_POINTS:
        return 0.0
    
    ex_sign, ex_deg = EXALTATION_POINTS[p_name]
    exaltation_lon = (ex_sign * 30) + ex_deg
    debilitation_lon = normalize_degree(exaltation_lon + 180)
    
    # Distance from debilitation point (0 to 180)
    diff = abs(p_lon - debilitation_lon)
    if diff > 180:
        diff = 360 - diff
        
    return diff / 3.0

def calculate_compound_friendship(p_name: str, p_lon: float, other_planets: List[dict]) -> Dict[str, str]:
    """
    Calculates Panchadha Maitri (Compound Friendship).
    """
    relationships = {}
    p_sign = int(p_lon / 30)
    
    for other in other_planets:
        o_name = other['name']
        if o_name == p_name or o_name in ['Rahu', 'Ketu', 'Ascendant', 'Uranus', 'Neptune', 'Pluto']:
            continue
            
        # 1. Natural Relationship
        natural_rel = NATURAL_FRIENDSHIPS.get(p_name, {}).get(o_name, 0)
        
        # 2. Temporary Relationship (Tatkalika)
        o_sign = int(other['longitude'] / 30)
        
        diff = o_sign - p_sign
        if diff < 0: diff += 12
        relative_house = diff + 1
        
        if relative_house in [2, 3, 4, 10, 11, 12]:
            temp_rel = 1 # Friend
        else:
            temp_rel = -1 # Enemy
            
        # 3. Compound
        total = natural_rel + temp_rel
        
        if total >= 2: relationships[o_name] = "Great Friend"
        elif total == 1: relationships[o_name] = "Friend"
        elif total == 0: relationships[o_name] = "Neutral"
        elif total == -1: relationships[o_name] = "Enemy"
        else: relationships[o_name] = "Great Enemy"
        
    return relationships

def get_varga_bala_score(relationship: str, varga_name: str) -> float:
    """Returns Virupas based on relationship in a varga."""
    if relationship == "Exalted" or relationship == "Moolatrikona": return 45.0
    if relationship == "Own Sign": return 30.0
    if relationship == "Great Friend": return 22.5
    if relationship == "Friend": return 15.0
    if relationship == "Neutral": return 7.5
    if relationship == "Enemy": return 3.75
    if relationship == "Great Enemy": return 1.875
    return 7.5

def calculate_saptavargiya_bala(p_name: str, vargas: Dict[str, Any], compound_rels: Dict[str, str]) -> float:
    """Calculates strength across 7 division charts."""
    required_vargas = ["D1", "D2", "D3", "D7", "D9", "D12", "D30"]
    total_score = 0.0
    
    ZODIAC_LORDS = {
        "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
        "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
        "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
    }
    
    for v_code in required_vargas:
        if v_code not in vargas: continue
        
        v_data = vargas[v_code]
        p_entry = next((x for x in v_data['planets'] if x['name'] == p_name), None)
        if not p_entry: continue
        
        sign_name = p_entry['zodiac_sign']
        lord = ZODIAC_LORDS.get(sign_name)
        
        status = "Neutral"
        
        ex_sign, _ = EXALTATION_POINTS.get(p_name, (-1, -1))
        try:
            sign_idx = ZODIAC_SIGNS.index(sign_name)
        except ValueError:
            sign_idx = -1
        
        if sign_idx == ex_sign:
            status = "Exalted"
        elif lord == p_name:
            status = "Own Sign"
        else:
            if lord in compound_rels:
                status = compound_rels[lord]
            else:
                status = "Neutral"
                
        total_score += get_varga_bala_score(status, v_code)
        
    return total_score

def calculate_ojayugma_bala(p_name: str, d1_lon: float, d9_lon: float) -> float:
    """Odd/Even Sign Strength."""
    score = 0.0
    
    is_female = p_name in ["Moon", "Venus"]
    male_group = ["Sun", "Mars", "Jupiter", "Mercury", "Saturn"]
    
    # Check D1
    d1_sign = int(d1_lon / 30)
    d1_odd = (d1_sign % 2) == 0 # 0=Aries(Odd)
    
    if is_female and not d1_odd: score += 15
    if p_name in male_group and d1_odd: score += 15
    
    # Check D9
    d9_sign = int(d9_lon / 30)
    d9_odd = (d9_sign % 2) == 0
    
    if is_female and not d9_odd: score += 15
    if p_name in male_group and d9_odd: score += 15
    
    return score

def calculate_kendra_bala(p_lon: float, asc_lon: float) -> float:
    """Angle Strength."""
    p_sign = int(p_lon / 30)
    asc_sign = int(asc_lon / 30)
    
    house = (p_sign - asc_sign) % 12 + 1
    
    if house in [1, 4, 7, 10]: return 60.0
    if house in [2, 5, 8, 11]: return 30.0
    return 15.0

def calculate_drekkana_bala(p_name: str, p_lon: float) -> float:
    """Decanate Strength."""
    deg = p_lon % 30
    
    if p_name in ["Sun", "Jupiter", "Mars"]:
        if deg < 10: return 15.0
    elif p_name in ["Moon", "Venus"]:
        if 10 <= deg < 20: return 15.0
    elif p_name in ["Mercury", "Saturn"]:
        if deg >= 20: return 15.0
        
    return 0.0

def calculate_dig_bala(p_name: str, p_lon: float, asc_lon: float) -> float:
    """Directional Strength."""
    if p_name in ["Mercury", "Jupiter"]:
        power_point = asc_lon
    elif p_name in ["Moon", "Venus"]:
        power_point = normalize_degree(asc_lon + 90) # 4th House (Nadir)
    elif p_name == "Saturn":
        power_point = normalize_degree(asc_lon + 180) # 7th House
    elif p_name in ["Sun", "Mars"]:
        power_point = normalize_degree(asc_lon + 270) # 10th House
    else:
        return 0.0
        
    diff = abs(p_lon - power_point)
    if diff > 180: diff = 360 - diff
    
    return (180 - diff) / 3.0

def calculate_day_lords(birth_details: Dict) -> Dict:
    """Calculates Sunrise, Sunset, Vara Lord, Hora Lord."""
    if not birth_details: return {}
    
    try:
        lat = birth_details['latitude']
        lon = birth_details['longitude']
        jd_current = get_julian_day(birth_details['date'], birth_details['time'], birth_details['timezone'])
        
        # Search back 24h and forward 24h to find the enclosing events
        # Start search from approx 24h back
        t_start = jd_current - 1.5
        
        # Find Rises
        rises = []
        t = t_start
        for _ in range(4):
            res = swe.rise_trans(t, swe.SUN, swe.CALC_RISE | swe.BIT_DISC_CENTER, (lon, lat, 0), 0, 0)
            if res[0] == -2: break # Error
            rt = res[1][0]
            rises.append(rt)
            t = rt + 0.01
            
        # Find Sets
        sets = []
        t = t_start
        for _ in range(4):
            res = swe.rise_trans(t, swe.SUN, swe.CALC_SET | swe.BIT_DISC_CENTER, (lon, lat, 0), 0, 0)
            if res[0] == -2: break
            st = res[1][0]
            sets.append(st)
            t = st + 0.01
            
        # Find Rise just before or at current time
        # We look for max rise <= jd_current + epsilon
        sunrise_jd = max([r for r in rises if r <= jd_current + 0.00001], default=None)
        
        # Find Next Rise
        next_sunrise_jd = min([r for r in rises if r > jd_current + 0.00001], default=None)
        
        if not sunrise_jd or not next_sunrise_jd:
            return {}
            
        # Find Sunset between Sunrise and Next Sunrise
        sunset_jd = next((s for s in sets if sunrise_jd < s < next_sunrise_jd), None)
        
        if not sunset_jd:
            return {}
            
        is_day = sunrise_jd <= jd_current < sunset_jd
        
        # Vara Lord (Weekday of Sunrise)
        # 0=Sun, 1=Mon...
        dow = swe.day_of_week(sunrise_jd + 0.001)
        vara_lord = WEEKDAY_LORDS[dow]
        
        # Hora Lord
        start_idx = HORA_SEQUENCE.index(vara_lord)
        
        if is_day:
            duration = sunset_jd - sunrise_jd
            hora_len = duration / 12.0
            elapsed = jd_current - sunrise_jd
            hora_num = int(elapsed / hora_len) # 0-11
        else:
            duration = next_sunrise_jd - sunset_jd
            hora_len = duration / 12.0
            elapsed = jd_current - sunset_jd
            hora_num = 12 + int(elapsed / hora_len) # 12-23
            
        final_hora_idx = (start_idx + hora_num) % 7
        hora_lord = HORA_SEQUENCE[final_hora_idx]
        
        # Tribhaga Part (Day/Night divided into 3 parts)
        # Day: 0=Morning, 1=Noon, 2=Afternoon
        # Night: 0=Evening, 1=Midnight, 2=Dawn
        tribhaga_part = 0
        is_night_tribhaga = not is_day
        
        if is_day:
            day_part_len = (sunset_jd - sunrise_jd) / 3.0
            elapsed = jd_current - sunrise_jd
            tribhaga_part = int(elapsed / day_part_len)
        else:
            night_part_len = (next_sunrise_jd - sunset_jd) / 3.0
            elapsed = jd_current - sunset_jd
            tribhaga_part = int(elapsed / night_part_len)
            
        return {
            "is_day": is_day,
            "vara_lord": vara_lord,
            "hora_lord": hora_lord,
            "tribhaga_part": min(tribhaga_part, 2), # Clamp to 2
            "is_night_tribhaga": is_night_tribhaga
        }
        
    except Exception as e:
        logger.warning(f"Failed day lords calculation: {e}")
        return {}

def calculate_kaala_bala_components(p_name: str, birth_details: Dict, planets_data: List[Dict], day_info: Dict = None) -> Dict[str, float]:
    """Calculates Time strengths."""
    comps = {}
    
    # 1. Natonnata Bala (Day/Night)
    sun = next((p for p in planets_data if p['name'] == "Sun"), None)
    asc = next((p for p in planets_data if p['name'] == "Ascendant"), None)
    
    is_day = False
    if sun and asc:
        sun_h = (int(sun['longitude'] / 30) - int(asc['longitude'] / 30)) % 12 + 1
        if 7 <= sun_h <= 12: is_day = True # Sun in 7th to 12th is Day (roughly)
        
    score = 0.0
    if p_name == "Mercury":
        score = 60.0
    elif is_day:
        if p_name in ["Sun", "Jupiter", "Venus"]: score = 60.0
    else:
        if p_name in ["Moon", "Mars", "Saturn"]: score = 60.0
    comps["Natonnata"] = score
    
    # 2. Paksha Bala (Lunar Phase)
    moon = next((p for p in planets_data if p['name'] == "Moon"), None)
    paksha_val = 30.0
    
    if sun and moon:
        angle = (moon['longitude'] - sun['longitude']) % 360
        if angle > 180: angle = 360 - angle
        
        val = angle / 3.0
        
        is_benefic = p_name in ["Jupiter", "Venus", "Moon"]
        # Mercury is benefic if not with malefics - simplified to benefic
        if p_name == "Mercury": is_benefic = True 
        
        if is_benefic:
            paksha_val = val
        else:
            paksha_val = 60.0 - val
            
    comps["Paksha"] = paksha_val
        
    # 3. Tribhaga Bala (Part of Day/Night)
    # Jupiter always 60
    if p_name == "Jupiter":
        comps["Tribhaga"] = 60.0
    else:
        tribhaga_val = 0.0
        if day_info:
            is_night = day_info.get("is_night_tribhaga", False)
            part = day_info.get("tribhaga_part", 0)
            
            if not is_night:
                # Day Parts: 0=Merc, 1=Sun, 2=Sat
                if part == 0 and p_name == "Mercury": tribhaga_val = 60.0
                elif part == 1 and p_name == "Sun": tribhaga_val = 60.0
                elif part == 2 and p_name == "Saturn": tribhaga_val = 60.0
            else:
                # Night Parts: 0=Moon, 1=Ven, 2=Mars
                if part == 0 and p_name == "Moon": tribhaga_val = 60.0
                elif part == 1 and p_name == "Venus": tribhaga_val = 60.0
                elif part == 2 and p_name == "Mars": tribhaga_val = 60.0
        
        comps["Tribhaga"] = tribhaga_val
        
    # 4. Abda/Masa/Vara/Hora
    lord_val = 0.0
    
    if day_info:
        # Vara Bala (Day Lord) - 45 Virupas
        if day_info.get("vara_lord") == p_name:
            lord_val += 45.0
            
        # Hora Bala (Hour Lord) - 60 Virupas
        if day_info.get("hora_lord") == p_name:
            lord_val += 60.0
            
    # Abda (Year) and Masa (Month) Lords omitted for now (require extensive ephemeris logic)
        
    comps["Lordship"] = lord_val
    
    # 5. Ayana Bala (Declination)
    declination = 0.0
    if birth_details and p_name in PLANET_IDS:
        try:
            jd = get_julian_day(birth_details['date'], birth_details['time'], birth_details['timezone'])
            res = swe.calc_ut(jd, PLANET_IDS[p_name], swe.FLG_SWIEPH | swe.FLG_EQUATORIAL)
            declination = res[0][1] # Index 1 is Declination
        except Exception as e:
            logger.warning(f"Failed declination for {p_name}: {e}")
            
    # Formula
    val = 0.0
    if p_name == "Mercury":
        val = 30.0
    else:
        # Standard Parashara logic
        # Sun, Mars, Jup, Ven: North (+) is strong
        # Moon, Sat: South (-) is strong
        
        # Max declination approx 24
        # Value = (Declination + 24) * 1.25 (range 0-60)
        
        is_north_strong = p_name in ["Sun", "Mars", "Jupiter", "Venus"]
        
        if is_north_strong:
            # If decl is +24, score = (24+24)*1.25 = 60
            # If decl is -24, score = (-24+24)*1.25 = 0
            val = (declination + 24) * 1.25
        else:
            # South strong (Moon, Sat)
            # If decl is -24, score = (24 - (-24))*1.25 = 60
            # If decl is +24, score = (24 - 24)*1.25 = 0
            val = (24 - declination) * 1.25
            
    # Clamp
    val = max(0.0, min(60.0, val))
    comps["Ayana"] = val

    # 6. Yuddha Bala (Planetary War) - Calculated later
    comps["Yuddha"] = 0.0 
    
    return comps

def calculate_chesta_bala(p_name: str, p_speed: float, p_lon: float, sun_lon: float) -> float:
    """Motional Strength."""
    if p_name in ["Sun", "Moon"]:
        # Sun/Moon don't retrograde. Assigned 30 or Ayana logic.
        return 30.0 
        
    if p_speed < 0:
        return 60.0 # Retrograde
    
    # Simplified
    return 15.0 # Direct

def calculate_drik_bala(p_name: str, p_lon: float, all_planets: List[dict]) -> float:
    """Aspect Strength."""
    score = 0.0
    
    for other in all_planets:
        if other['name'] == p_name or other['name'] in ['Rahu', 'Ketu', 'Ascendant']:
            continue
            
        o_name = other['name']
        o_lon = other['longitude']
        
        diff = (o_lon - p_lon) % 360
        
        aspect_val = 0.0
        
        # Full Aspect (7th)
        if 165 < diff < 195: aspect_val = 1.0
        
        # Special Aspects
        if o_name == "Mars":
            if (105 < diff < 135) or (225 < diff < 255): aspect_val = 1.0
            if 80 < diff < 100: aspect_val = 0.75 # 4th
            if 200 < diff < 220: aspect_val = 0.75 # 8th
            
        if o_name == "Saturn":
            if 50 < diff < 70: aspect_val = 0.75 # 3rd
            if 260 < diff < 280: aspect_val = 0.75 # 10th
            
        if o_name == "Jupiter":
            if 110 < diff < 130: aspect_val = 1.0 # 5th
            if 230 < diff < 250: aspect_val = 1.0 # 9th
            
        if aspect_val > 0:
            if o_name in ["Jupiter", "Venus", "Mercury", "Moon"]:
                score += (aspect_val * 15)
            else:
                score -= (aspect_val * 15)
                
    return score

# --- MAIN EXPORT ---

async def calculate_shadbala(planets_data: List[dict], ascendant_sign_idx: int, birth_details: Optional[dict] = None) -> dict:
    """
    Calculates detailed Shadbala (Sixfold Strength).
    """
    # 1. Prepare Data
    vargas = await get_all_shodashvargas(planets_data, birth_details)
    
    asc_p = next((p for p in planets_data if p['name'] == 'Ascendant'), None)
    asc_lon = asc_p['longitude'] if asc_p else 0.0
    
    sun_p = next((p for p in planets_data if p['name'] == 'Sun'), None)
    sun_lon = sun_p['longitude'] if sun_p else 0.0
    
    compound_rels = {}
    for p in planets_data:
        if p['name'] in SHADBALA_REQUIREMENTS:
            compound_rels[p['name']] = calculate_compound_friendship(p['name'], p['longitude'], planets_data)
    
    planet_results = []
    temp_results = {}
    
    # Pre-calculate Day Info for Kaala Bala
    day_info = calculate_day_lords(birth_details)
    
    # Pass 1: Calculate components (except Yuddha)
    for p in planets_data:
        p_name = p['name']
        if p_name not in SHADBALA_REQUIREMENTS:
            continue
            
        p_lon = p['longitude']
        p_speed = p.get('speed', 0.0)
        
        # Sthana
        uchcha = calculate_uchcha_bala(p_name, p_lon)
        saptavarga = calculate_saptavargiya_bala(p_name, vargas, compound_rels.get(p_name, {}))
        
        d9_lon = 0.0
        if "D9" in vargas:
            d9_p = next((x for x in vargas["D9"]["planets"] if x['name'] == p_name), None)
            if d9_p:
                if 'longitude' in d9_p:
                    d9_lon = d9_p['longitude']
                else:
                    try:
                        sign_idx = ZODIAC_SIGNS.index(d9_p['zodiac_sign'])
                        d9_lon = (sign_idx * 30) + 15.0
                    except (ValueError, KeyError):
                        d9_lon = p_lon

        ojayugma = calculate_ojayugma_bala(p_name, p_lon, d9_lon)
        kendra = calculate_kendra_bala(p_lon, asc_lon)
        drekkana = calculate_drekkana_bala(p_name, p_lon)
        
        sthana_total = uchcha + saptavarga + ojayugma + kendra + drekkana
        
        # Dig
        dig = calculate_dig_bala(p_name, p_lon, asc_lon)
        
        # Kaala
        kaala_comps = calculate_kaala_bala_components(p_name, birth_details, planets_data, day_info)
        kaala_total = sum(kaala_comps.values())
        
        # Chesta
        chesta = calculate_chesta_bala(p_name, p_speed, p_lon, sun_lon)
        
        # Naisargika
        naisargika = NAISARGIKA_BALA_VALUES.get(p_name, 0.0)
        
        # Drik
        drik = calculate_drik_bala(p_name, p_lon, planets_data)
        
        temp_results[p_name] = {
            "sthana": sthana_total,
            "dig": dig,
            "kaala_comps": kaala_comps,
            "kaala": kaala_total,
            "chesta": chesta,
            "naisargika": naisargika,
            "drik": drik,
            "p_lon": p_lon,
            "details": {
                "uchcha": uchcha, "saptavarga": saptavarga, "ojayugma": ojayugma,
                "kendra": kendra, "drekkana": drekkana
            }
        }

    # Pass 2: Yuddha Bala (Planetary War)
    # Applied to Total Strength (before Yuddha)
    # If distance < 1 deg, calc difference.
    
    yuddha_adjustments = {name: 0.0 for name in temp_results}
    
    names = list(temp_results.keys())
    for i in range(len(names)):
        for j in range(i+1, len(names)):
            n1 = names[i]
            n2 = names[j]
            
            # Skip Sun/Moon
            if n1 in ["Sun", "Moon"] or n2 in ["Sun", "Moon"]: continue
            
            p1 = temp_results[n1]
            p2 = temp_results[n2]
            
            dist = get_distance(p1["p_lon"], p2["p_lon"])
            if dist < 1.0:
                # War!
                # Winner is usually one with higher total strength? 
                # Or North declination? 
                # Standard: The one with lower longitude (earlier in sign) wins?
                # Or brighter?
                # Simplified: One with higher current total wins.
                
                t1 = p1["sthana"] + p1["dig"] + p1["kaala"] + p1["chesta"] + p1["naisargika"]
                t2 = p2["sthana"] + p2["dig"] + p2["kaala"] + p2["chesta"] + p2["naisargika"]
                
                diff_val = abs(t1 - t2)
                
                if t1 > t2:
                    yuddha_adjustments[n1] += diff_val
                    yuddha_adjustments[n2] -= diff_val
                else:
                    yuddha_adjustments[n2] += diff_val
                    yuddha_adjustments[n1] -= diff_val
                    
    # Final Compilation
    for p_name, res in temp_results.items():
        yuddha = yuddha_adjustments[p_name]
        res["kaala_comps"]["Yuddha"] = yuddha
        # Update Kaala Total (Yuddha usually grouped under Kaala or separate? Often separate but modifies total)
        # We will add it to Kaala total for simplicity or keep separate.
        # BPHS: Yuddha is a correction.
        
        kaala_total = res["kaala"] + yuddha
        
        total_virupas = res["sthana"] + res["dig"] + kaala_total + res["chesta"] + res["naisargika"] + res["drik"]
        if total_virupas < 0: total_virupas = 0
        
        total_rupas = total_virupas / 60.0
        requirement = SHADBALA_REQUIREMENTS[p_name]
        percentage = (total_rupas / requirement) * 100
        
        planet_results.append({
            "name": p_name,
            "components": {
                "Sthana": round(res["sthana"] / 60.0, 2),
                "Dig": round(res["dig"] / 60.0, 2),
                "Kaala": round(kaala_total / 60.0, 2),
                "Cheshta": round(res["chesta"] / 60.0, 2),
                "Naisargika": round(res["naisargika"] / 60.0, 2),
                "Drik": round(res["drik"] / 60.0, 2)
            },
            "breakdown": {
                "sthana": {k: round(v, 1) for k, v in res["details"].items()},
                "kaala": res["kaala_comps"]
            },
            "total_virupas": round(total_virupas, 1),
            "total_rupas": round(total_rupas, 2),
            "requirement_rupas": requirement,
            "percentage": round(percentage, 1),
            "status": "Strong" if percentage >= 100 else "Average" if percentage >= 80 else "Weak"
        })
        
    planet_results.sort(key=lambda x: x['percentage'], reverse=True)
    
    return {
        "planets": planet_results,
        "summary": {
            "strongest": planet_results[0]['name'] if planet_results else None,
            "weakest": planet_results[-1]['name'] if planet_results else None,
            "average_strength": round(sum(p['percentage'] for p in planet_results) / len(planet_results), 1) if planet_results else 0
        }
    }
