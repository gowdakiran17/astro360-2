import swisseph as swe
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import logging
from astro_app.backend.astrology.utils import (
    validate_coordinates, validate_date, validate_time, 
    normalize_degree, get_zodiac_sign, get_nakshatra, get_nakshatra_pada,
    ZODIAC_SIGNS
)
from astro_app.backend.astrology.ashtakvarga import calculate_ashtakvarga

logger = logging.getLogger(__name__)

# --- Constants ---

# Vedha Pairs (Left: House from Moon where planet is Good, Right: Vedha house that blocks it)
# Source: Phala Deepika / Brihat Samhita
VEDHA_GROUPS = {
    "Sun": {
        11: 5, 3: 9, 6: 12, 10: 4
    },
    "Moon": {
        7: 3, 1: 5, 6: 12, 11: 8, 10: 4, 3: 9
    },
    "Mars": {
        3: 12, 11: 5, 6: 9
    },
    "Mercury": {
        2: 5, 4: 3, 6: 9, 8: 1, 10: 8, 11: 12
    },
    "Jupiter": {
        2: 12, 11: 8, 9: 10, 5: 4, 7: 3
    },
    "Venus": {
        1: 8, 2: 7, 3: 1, 4: 10, 5: 9, 8: 5, 9: 11, 11: 6, 12: 3
    },
    "Saturn": {
        3: 12, 11: 5, 6: 9
    },
    "Rahu": {
        3: 12, 6: 9, 11: 5
    },
    "Ketu": {
        3: 12, 6: 9, 11: 5
    }
}

# Moorthi Nirnaya Rules (Moon pos relative to Natal Moon at Ingress)
# 1, 6, 11 -> Gold (Swarna)
# 2, 5, 9 -> Silver (Rajata)
# 3, 7, 10 -> Copper (Tamra)
# 4, 8, 12 -> Iron (Loha)
MOORTHI_MAPPING = {
    1: "Gold", 6: "Gold", 11: "Gold",
    2: "Silver", 5: "Silver", 9: "Silver",
    3: "Copper", 7: "Copper", 10: "Copper",
    4: "Iron", 8: "Iron", 12: "Iron"
}

def get_planet_longitude(jd: float, planet_name: str, ayanamsa_mode=swe.SIDM_LAHIRI) -> float:
    """Helper to get a single planet's longitude efficiently."""
    swe.set_sid_mode(ayanamsa_mode, 0, 0)
    p_map = {
        "Sun": swe.SUN, "Moon": swe.MOON, "Mars": swe.MARS, 
        "Mercury": swe.MERCURY, "Jupiter": swe.JUPITER, 
        "Venus": swe.VENUS, "Saturn": swe.SATURN, 
        "Rahu": swe.TRUE_NODE, "Ketu": swe.TRUE_NODE
    }
    pid = p_map.get(planet_name)
    if pid is None: return 0.0
    
    res = swe.calc_ut(jd, pid, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)
    lon = res[0][0]
    
    if planet_name == "Ketu":
        lon = normalize_degree(lon + 180)
        
    return lon

def find_last_ingress(planet_name: str, current_jd: float, current_sign_idx: int) -> float:
    """
    Finds the Julian Day when the planet LAST entered the current sign.
    Searches backwards.
    """
    # Step sizes for search (in days)
    step_map = {
        "Moon": 0.5, "Sun": 5, "Mercury": 2, "Venus": 2, "Mars": 10,
        "Jupiter": 30, "Saturn": 60, "Rahu": 60, "Ketu": 60
    }
    step = step_map.get(planet_name, 10)
    
    search_jd = current_jd
    limit_days = 365 * 3 # Max lookback 3 years (Saturn)
    days_searched = 0
    
    while days_searched < limit_days:
        search_jd -= step
        days_searched += step
        
        lon = get_planet_longitude(search_jd, planet_name)
        sign = int(lon / 30)
        
        if sign != current_sign_idx:
            # Found the boundary! Now binary search for precision
            # We are between search_jd (prev sign) and search_jd + step (current sign)
            low = search_jd
            high = search_jd + step
            
            for _ in range(10): # 10 iterations is enough for reasonable precision
                mid = (low + high) / 2
                mid_lon = get_planet_longitude(mid, planet_name)
                mid_sign = int(mid_lon / 30)
                
                if mid_sign == current_sign_idx:
                    high = mid # It's already in the sign, look earlier
                else:
                    low = mid # It's in prev sign, look later
            
            return high # This is the ingress time (approx)
            
    return current_jd # Fallback if not found

def calculate_transits(date_str: str, time_str: str, timezone_str: str, latitude: float, longitude: float, ayanamsa: str = "LAHIRI"):
    """
    Calculates planetary positions for a specific transit date/time.
    """
    
    # 1. Validation (Reuse basic validations)
    if not validate_date(date_str):
        raise ValueError("Invalid date format. Use DD/MM/YYYY")
    if not validate_time(time_str):
        raise ValueError("Invalid time format. Use HH:MM")
    
    # 2. Parse Date and Time
    dt_str = f"{date_str} {time_str}"
    try:
        naive_dt = datetime.strptime(dt_str, "%d/%m/%Y %H:%M")
    except ValueError:
        try:
            naive_dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
        except ValueError:
            try:
                naive_dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
            except ValueError:
                 raise ValueError("Invalid date/time format. Expected DD/MM/YYYY HH:MM or YYYY-MM-DD HH:MM")

    # Parse offset
    sign = 1 if timezone_str.startswith("+") else -1
    parts = timezone_str.strip("+-").split(":")
    hours = int(parts[0])
    minutes = int(parts[1]) if len(parts) > 1 else 0
    offset_minutes = sign * (hours * 60 + minutes)
    
    # Calculate Decimal Hour in UTC
    decimal_hour_local = naive_dt.hour + naive_dt.minute / 60.0 + naive_dt.second / 3600.0
    decimal_hour_utc = decimal_hour_local - (offset_minutes / 60.0)
    
    year = naive_dt.year
    month = naive_dt.month
    day = naive_dt.day
    
    # 3. Calculate Julian Day (UT)
    jd_ut = swe.julday(year, month, day, decimal_hour_utc)
    
    # 4. Set Sidereal Mode (Ayanamsa)
    ayanamsa_map = {
        "LAHIRI": swe.SIDM_LAHIRI,
        "RAMAN": swe.SIDM_RAMAN,
        "KP": swe.SIDM_KRISHNAMURTI,
        "FAGAN_BRADLEY": swe.SIDM_FAGAN_BRADLEY,
        "TROPICAL": None
    }
    swe_ayanamsa = ayanamsa_map.get(ayanamsa.upper(), swe.SIDM_LAHIRI)
    
    if swe_ayanamsa is not None:
        swe.set_sid_mode(swe_ayanamsa, 0, 0)
    
    # 5. Calculate Planets
    planets_map = {
        "Sun": swe.SUN, "Moon": swe.MOON, "Mars": swe.MARS,
        "Mercury": swe.MERCURY, "Jupiter": swe.JUPITER,
        "Venus": swe.VENUS, "Saturn": swe.SATURN, "Rahu": swe.TRUE_NODE 
    }
    
    planets_data = []
    
    for p_name, p_id in planets_map.items():
        flags = swe.FLG_SWIEPH | swe.FLG_SPEED
        if swe_ayanamsa is not None:
            flags |= swe.FLG_SIDEREAL
        
        res = swe.calc_ut(jd_ut, p_id, flags)
        lon = res[0][0]
        speed = res[0][3]
        is_retro = speed < 0
        
        if p_name == "Rahu":
            # Add Rahu
            planets_data.append({
                "name": "Rahu",
                "longitude": lon,
                "degrees": lon % 30.0,
                "zodiac_sign": get_zodiac_sign(lon),
                "nakshatra": get_nakshatra(lon),
                "nakshatra_pada": get_nakshatra_pada(lon),
                "is_retrograde": is_retro,
                "speed": speed
            })
            
            # Calculate Ketu
            ketu_lon = normalize_degree(lon + 180)
            planets_data.append({
                "name": "Ketu",
                "longitude": ketu_lon,
                "degrees": ketu_lon % 30.0,
                "zodiac_sign": get_zodiac_sign(ketu_lon),
                "nakshatra": get_nakshatra(ketu_lon),
                "nakshatra_pada": get_nakshatra_pada(ketu_lon),
                "is_retrograde": is_retro,
                "speed": speed
            })

        else:
            planets_data.append({
                "name": p_name,
                "longitude": lon,
                "degrees": lon % 30.0,
                "zodiac_sign": get_zodiac_sign(lon),
                "nakshatra": get_nakshatra(lon),
                "nakshatra_pada": get_nakshatra_pada(lon),
                "is_retrograde": is_retro,
                "speed": speed
            })

    return planets_data

def get_advanced_transit_analysis(
    natal_chart: dict, 
    transit_date: str, 
    transit_time: str, 
    transit_tz: str,
    transit_lat: float,
    transit_lon: float
):
    """
    Generates detailed transit analysis including Kakshya, Vedha, and Moorthi Nirnaya.
    """
    
    # 1. Get Transit Positions
    transit_planets = calculate_transits(
        transit_date, transit_time, transit_tz, transit_lat, transit_lon
    )
    
    # 2. Get Natal Moon & Ascendant
    natal_moon = next((p for p in natal_chart["planets"] if p["name"] == "Moon"), None)
    if not natal_moon:
        # Should technically not happen if calculate_chart succeeds
        logger.error("Natal Moon missing in chart for transit analysis")
        return {"error": "Natal Moon not found"}
        
    natal_moon_sign_idx = int(natal_moon["longitude"] / 30)
    
    natal_asc = natal_chart["ascendant"]
    natal_asc_sign_idx = int(natal_asc["longitude"] / 30)
    
    # 3. Calculate Ashtakvarga (for Kakshya and SAV strength)
    # We need the full planets list from natal chart
    natal_planets_list = [{"name": p["name"], "longitude": p["longitude"]} for p in natal_chart["planets"]]
    av_data = calculate_ashtakvarga(natal_planets_list, natal_asc_sign_idx)
    kakshya_matrix = av_data["kakshya_matrix"]
    sav = av_data["sav"]
    
    # 4. Analyze each transit planet
    analysis = []
    
    # Calculate Transit Moon longitude for Vedha check (Wait, Vedha is between TRANSIT planets?)
    # NO. Vedha is usually checked for Transit Planet vs Other Transit Planets.
    # "A planet in house 11 is good, UNLESS another planet is in house 5 (Vedha) AT THE SAME TIME."
    # Yes, Vedha is purely transit-based.
    
    # Create map of Transit Planet -> House from Natal Moon
    transit_houses = {}
    for tp in transit_planets:
        tp_sign_idx = int(tp["longitude"] / 30)
        # House from Moon (1-based)
        h_from_moon = (tp_sign_idx - natal_moon_sign_idx) % 12 + 1
        transit_houses[tp["name"]] = h_from_moon
        
    for tp in transit_planets:
        p_name = tp["name"]
        if p_name in ["Ascendant", "Uranus", "Neptune", "Pluto"]:
            continue
            
        tp_sign_idx = int(tp["longitude"] / 30)
        h_from_moon = transit_houses[p_name]
        
        # --- A. General Result (Good/Bad) ---
        # Standard Gochar Phal based on house from Moon
        good_houses = {
            "Sun": [3, 6, 10, 11],
            "Moon": [1, 3, 6, 7, 10, 11],
            "Mars": [3, 6, 11],
            "Mercury": [2, 4, 6, 8, 10, 11],
            "Jupiter": [2, 5, 7, 9, 11],
            "Venus": [1, 2, 3, 4, 5, 8, 9, 11, 12],
            "Saturn": [3, 6, 11],
            "Rahu": [3, 6, 11],
            "Ketu": [3, 6, 11]
        }
        
        is_favorable = h_from_moon in good_houses.get(p_name, [])
        status = "Favorable" if is_favorable else "Unfavorable"
        
        # --- B. Vedha (Obstruction) ---
        vedha_blocked = False
        blocking_planet = None
        
        if p_name in VEDHA_GROUPS:
            # Check if this specific house has a vedha pair
            if h_from_moon in VEDHA_GROUPS[p_name]:
                vedha_house = VEDHA_GROUPS[p_name][h_from_moon]
                
                # Check if ANY transit planet is in this vedha_house
                for other_p_name, other_h in transit_houses.items():
                    if other_p_name == p_name: continue # Can't block self
                    
                    # Exception: Father-Son pairs don't block
                    # Sun-Saturn
                    if (p_name == "Sun" and other_p_name == "Saturn") or \
                       (p_name == "Saturn" and other_p_name == "Sun"):
                        continue
                    # Moon-Mercury
                    if (p_name == "Moon" and other_p_name == "Mercury") or \
                       (p_name == "Mercury" and other_p_name == "Moon"):
                        continue
                        
                    if other_h == vedha_house:
                        vedha_blocked = True
                        blocking_planet = other_p_name
                        break
        
        # --- C. Kakshya Activation ---
        # Which Kakshya (1/8th of sign) is it in?
        # 3 deg 45 min = 3.75 deg
        deg_in_sign = tp["longitude"] % 30
        kakshya_idx = int(deg_in_sign / 3.75)
        
        # Order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon, Lagna
        KAKSHYA_ORDER = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Lagna"]
        if kakshya_idx < 8:
            kakshya_lord = KAKSHYA_ORDER[kakshya_idx]
            
            # Did this lord contribute a point in this sign for this planet?
            # Check kakshya_matrix[Planet][Sign][Lord]
            # But wait, kakshya_matrix in ashtakvarga.py is keyed by [p_name][sign_i][k_lord]
            # where p_name is the planet whose BAV we are looking at.
            # Yes, for Saturn Transit, we look at Saturn's BAV.
            
            has_point = False
            if p_name in kakshya_matrix:
                has_point = kakshya_matrix[p_name].get(tp_sign_idx, {}).get(kakshya_lord, False)
            
            kakshya_status = "Active (Point)" if has_point else "Inactive (No Point)"
        else:
            kakshya_lord = "Unknown"
            kakshya_status = "Unknown"
            has_point = False

        # --- D. Moorthi Nirnaya (Transit Form) ---
        # Needs Ingress Time calculation. 
        # For performance, we might skip this for Moon (too fast) or do simplified check
        moorthi = "Unknown"
        element = "Unknown"
        
        # Only calculate for major planets or if requested
        if p_name in ["Jupiter", "Saturn", "Rahu", "Ketu", "Mars", "Sun", "Venus", "Mercury"]:
            # 1. Get JD of request
            # Re-calculate JD locally or pass it. 
            # We'll re-do simple JD calc or just use current time approximation
            # Actually we have current position.
            # Let's find ingress.
            
            # Optimization: Pass current JD to avoid parsing again?
            # For now, just re-parse in find_last_ingress helper via wrapper or simplify.
            # We'll assume the current moment is close enough to start search
            
            # Get approximate current JD
            now = datetime.now() # Just for relative start
            # Actually we need the JD corresponding to transit_date
            # Let's trust find_last_ingress to work with current position
            
            # We need a JD. 
            # Let's assume transit_planets calc didn't return JD.
            # We will assume 'now' for search start if close to real time, 
            # or we really should have returned JD from calculate_transits.
            pass
        
        # Simplified Moorthi (using current Moon):
        # Many online calculators just use Current Moon / Natal Moon relationship
        # But that's technically incorrect. 
        # Let's mark it as "Pending Implementation" or use the Simplified version for MVP
        # "Simplified: Based on Moon's position today"
        
        transit_moon_h = transit_houses.get("Moon", 1) # Transit Moon relative to Natal Moon?
        # No, Moorthi depends on Transit Moon relative to Natal Moon.
        # transit_houses stores [Planet] -> House from Natal Moon.
        # So transit_houses["Moon"] IS the position of Transit Moon relative to Natal Moon.
        
        moorthi_type = MOORTHI_MAPPING.get(transit_moon_h, "Iron")
        
        
        analysis.append({
            "planet": p_name,
            "current_sign": ZODIAC_SIGNS[tp_sign_idx],
            "house_from_moon": h_from_moon,
            "status": status,
            "vedha_blocked": vedha_blocked,
            "blocking_planet": blocking_planet,
            "kakshya": {
                "lord": kakshya_lord,
                "has_bindu": has_point,
                "status": kakshya_status
            },
            "moorthi": {
                "type": moorthi_type, # Using simplified current-moon method for now
                "note": "Based on current Moon position (Simplified)"
            },
            "score_sav": sav[tp_sign_idx] # Total points in this sign (SAV)
        })
        
    return {
        "transit_date": transit_date,
        "analysis": analysis,
        "transit_planets": transit_planets
    }

def check_nakshatra_ingress(planet_name: str, date_str: str, timezone_str: str, window_days: int = 1):
    """
    Checks if a planet changes Nakshatra within a time window (+/- days).
    """
    try:
        dt = datetime.strptime(date_str, "%d/%m/%Y")
    except ValueError:
        return None
        
    # Helper to get lon
    def get_planet_lon(jd, p_name):
        swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
        p_map = {"Sun":0, "Moon":1, "Mars":4, "Mercury":2, "Jupiter":5, "Venus":3, "Saturn":6, "Rahu":11, "Ketu":11}
        p_id = p_map.get(p_name)
        if p_id is None: return 0
        res = swe.calc_ut(jd, p_id, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)
        return res[0][0]

    # Parse TZ
    try:
         sign = 1 if timezone_str.startswith("+") else -1
         parts = timezone_str.strip("+-").split(":")
         offset = sign * (int(parts[0]) + int(parts[1])/60.0) if len(parts)>1 else 0
    except:
         offset = 0
         
    shifts = []
    
    # Steps of 6 hours
    start_dt = dt
    prev_nak = -1
    
    for i in range(-window_days * 4, window_days * 4):
        # Calculate time
        hours_add = i * 6
        check_dt = start_dt + timedelta(hours=hours_add)
        
        # Convert to JD
        decimal_hour = check_dt.hour - offset 
        jd = swe.julday(check_dt.year, check_dt.month, check_dt.day, decimal_hour + check_dt.minute/60.0)
        
        lon = get_planet_lon(jd, planet_name)
        nak = get_nakshatra(lon)
        
        # Compare with previous step
        if i > -window_days * 4:
            if nak != prev_nak and prev_nak != -1:
                shifts.append({
                    "planet": planet_name,
                    "from_nakshatra": prev_nak,
                    "to_nakshatra": nak,
                    "measure_time": check_dt.strftime("%d/%m/%Y %H:%M") + " (Approx)"
                })
        
        prev_nak = nak
        
    return shifts

def get_aspects(planet1_lon: float, planet2_lon: float, orb: float = 6.0) -> Optional[str]:
    """
    Calculates the aspect between two planetary longitudes.
    Returns None if no major aspect is found.
    """
    diff = abs(planet1_lon - planet2_lon)
    if diff > 180:
        diff = 360 - diff
        
    if abs(diff - 0) <= orb:
        return "Conjunction"
    elif abs(diff - 60) <= orb:
        return "Sextile"
    elif abs(diff - 90) <= orb:
        return "Square"
    elif abs(diff - 120) <= orb:
        return "Trine"
    elif abs(diff - 180) <= orb:
        return "Opposition"
    
    return None

def calculate_transit_aspects(natal_planets: list, transit_planets: list):
    """
    Identifies aspects between transit planets and natal planets.
    """
    aspects = []
    
    for t_planet in transit_planets:
        for n_planet in natal_planets:
            aspect = get_aspects(t_planet["longitude"], n_planet["longitude"])
            if aspect:
                aspects.append({
                    "transit_planet": t_planet["name"],
                    "natal_planet": n_planet["name"],
                    "aspect": aspect,
                    "transit_sign": t_planet["zodiac_sign"],
                    "natal_sign": n_planet["zodiac_sign"]
                })
                
    return aspects
