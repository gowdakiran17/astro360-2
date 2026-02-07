import swisseph as swe
from datetime import datetime
from astro_app.backend.astrology.utils import (
    validate_coordinates, validate_date, validate_time, validate_timezone,
    normalize_degree, get_zodiac_sign, get_nakshatra, ZODIAC_SIGNS, parse_timezone,
    get_nakshatra_details, format_dms, calculate_maitri
)
from astro_app.backend.astrology.jaimini import (
    calculate_jaimini_karakas, calculate_arudha_padas, 
    calculate_chara_dasha, calculate_jaimini_aspects, calculate_karakamsa,
    calculate_argala
)
from astro_app.backend.astrology.yogini_dasha import calculate_yogini_dasha
from astro_app.backend.astrology.special_degrees import check_special_degrees
from astro_app.backend.astrology.avasthas import calculate_avasthas

ZODIAC_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

def calculate_chart(date_str: str, time_str: str, timezone_str: str, latitude: float, longitude: float, ayanamsa_mode: int = swe.SIDM_LAHIRI, house_system: str = 'P'):
    """
    Calculates the astrological chart using pyswisseph (Swiss Ephemeris).
    Returns structured JSON with Ascendant, Planets, and Houses.
    """
    
    # 1. Validation
    if not validate_date(date_str):
        raise ValueError("Invalid date format. Use DD/MM/YYYY or YYYY-MM-DD")
    if not validate_time(time_str):
        raise ValueError("Invalid time format. Use HH:MM")
    if not validate_timezone(timezone_str):
        raise ValueError("Invalid timezone format. Use +HH:MM or -HH:MM")
    if not validate_coordinates(latitude, longitude):
        raise ValueError("Invalid coordinates.")

    # 2. Parse Date and Time
    # Detect format
    date_fmt = "%d/%m/%Y"
    if "-" in date_str:
        date_fmt = "%Y-%m-%d"
        
    dt_str = f"{date_str} {time_str}"
    try:
        naive_dt = datetime.strptime(dt_str, f"{date_fmt} %H:%M")
    except ValueError:
        naive_dt = datetime.strptime(dt_str, f"{date_fmt} %H:%M:%S")
    
    # Parse offset using robust utility
    tz_offset = parse_timezone(timezone_str, naive_dt)
    
    decimal_hour_local = naive_dt.hour + naive_dt.minute / 60.0 + naive_dt.second / 3600.0
    decimal_hour_utc = decimal_hour_local - tz_offset
    
    year = naive_dt.year
    month = naive_dt.month
    day = naive_dt.day
    
    # 3. Calculate Julian Day (UT)
    jd_ut = swe.julday(year, month, day, decimal_hour_utc)
    
    # 4. Set Sidereal Mode (Default: Lahiri, can be overridden for KP)
    swe.set_sid_mode(ayanamsa_mode, 0, 0)
    
    # 5. Calculate Planets
    # Swisseph fallback logic is the primary reliable method now due to VedAstro rate limits
    planets_map = {
        "Sun": swe.SUN,
        "Moon": swe.MOON,
        "Mars": swe.MARS,
        "Mercury": swe.MERCURY,
        "Jupiter": swe.JUPITER,
        "Venus": swe.VENUS,
        "Saturn": swe.SATURN,
        "Rahu": swe.TRUE_NODE,
        "Uranus": swe.URANUS,
        "Neptune": swe.NEPTUNE,
        "Pluto": swe.PLUTO
    }
    
    planets_data = []
    
    # Get Ayanamsa for this time
    ayanamsa = swe.get_ayanamsa_ut(jd_ut)
    
    # Store planet longitudes for house calculation
    planet_longitudes = {}

    for p_name, p_id in planets_map.items():
        # Calculate Sidereal position
        flags = swe.FLG_SWIEPH | swe.FLG_SPEED | swe.FLG_SIDEREAL
        
        res = swe.calc_ut(jd_ut, p_id, flags)
        # res is ((lon, lat, dist, speed_lon, speed_lat, speed_dist), ret_flag)
        
        lon = res[0][0]
        speed = res[0][3]
        is_retro = speed < 0
        
        if p_name == "Rahu":
            # Add Rahu
            nak_details = get_nakshatra_details(lon)
            rahu_data = {
                "name": "Rahu",
                "longitude": lon,
                "degree": lon % 30,
                "formatted_degree": format_dms(lon % 30),
                "sign": get_zodiac_sign(lon),
                "sign_id": int(lon / 30) + 1,
                "zodiac_sign": get_zodiac_sign(lon),
                "rasi_lord": ZODIAC_LORDS.get(get_zodiac_sign(lon)),
                "nakshatra": nak_details["name"],
                "nakshatra_lord": nak_details["lord"],
                "is_retrograde": is_retro,
                "retrograde": is_retro,
                "speed": speed,
                "house": 0 # Will be filled later
            }
            planets_data.append(rahu_data)
            planet_longitudes["Rahu"] = lon
            
            # Calculate Ketu (Always opposite to Rahu)
            ketu_lon = normalize_degree(lon + 180)
            # Ketu speed is same as Rahu
            ketu_speed = speed 
            nak_details = get_nakshatra_details(ketu_lon)
            ketu_data = {
                "name": "Ketu",
                "longitude": ketu_lon,
                "degree": ketu_lon % 30,
                "formatted_degree": format_dms(ketu_lon % 30),
                "sign": get_zodiac_sign(ketu_lon),
                "sign_id": int(ketu_lon / 30) + 1,
                "zodiac_sign": get_zodiac_sign(ketu_lon),
                "rasi_lord": ZODIAC_LORDS.get(get_zodiac_sign(ketu_lon)),
                "nakshatra": nak_details["name"],
                "nakshatra_lord": nak_details["lord"],
                "is_retrograde": is_retro,
                "retrograde": is_retro,
                "speed": ketu_speed,
                "house": 0 # Will be filled later
            }
            planets_data.append(ketu_data)
            planet_longitudes["Ketu"] = ketu_lon

        else:
            nak_details = get_nakshatra_details(lon)
            p_data = {
                "name": p_name,
                "longitude": lon,
                "degree": lon % 30,
                "formatted_degree": format_dms(lon % 30),
                "sign": get_zodiac_sign(lon),
                "sign_id": int(lon / 30) + 1,
                "zodiac_sign": get_zodiac_sign(lon),
                "rasi_lord": ZODIAC_LORDS.get(get_zodiac_sign(lon)),
                "nakshatra": nak_details["name"],
                "nakshatra_lord": nak_details["lord"],
                "is_retrograde": is_retro,
                "retrograde": is_retro,
                "speed": speed,
                "house": 0 # Will be filled later
            }
            planets_data.append(p_data)
            planet_longitudes[p_name] = lon

    # 6. Calculate Ascendant (Lagna)
    # Use specified house system (default Placidus 'P')
    # Encode string to bytes for swisseph
    hs_bytes = house_system.encode('utf-8') if house_system else b'P'
    res_houses = swe.houses(jd_ut, latitude, longitude, hs_bytes) 
    ascendant_tropical = res_houses[1][0]
    ascendant_nirayana = normalize_degree(ascendant_tropical - ayanamsa)
    
    asc_nak_details = get_nakshatra_details(ascendant_nirayana)
    ascendant_data = {
        "longitude": ascendant_nirayana,
        "degree": ascendant_nirayana % 30,
        "formatted_degree": format_dms(ascendant_nirayana % 30),
        "sign": get_zodiac_sign(ascendant_nirayana),
        "sign_id": int(ascendant_nirayana / 30) + 1,
        "zodiac_sign": get_zodiac_sign(ascendant_nirayana),
        "rasi_lord": ZODIAC_LORDS.get(get_zodiac_sign(ascendant_nirayana)),
        "nakshatra": asc_nak_details["name"],
        "nakshatra_lord": asc_nak_details["lord"]
    }

    # 7. Calculate Houses (Respecting Selected System)
    houses_data = [] 
    houses_dict = {}
    
    # Calculate Nirayana Cusps (Sidereal)
    nirayana_cusps = [normalize_degree(c - ayanamsa) for c in res_houses[0]]
    
    # Calculate Ascendant Sign Index (Needed for Planet Rashi House logic)
    asc_sign_index = int(ascendant_nirayana / 30)

    if house_system == 'W':
        # Whole Sign System Logic
        for i in range(12):
            house_num = i + 1
            sign_index = (asc_sign_index + i) % 12
            sign_start_deg = sign_index * 30
            
            h_obj = {
                "house_number": house_num,
                "zodiac_sign": ZODIAC_SIGNS[sign_index],
                "longitude_start": float(sign_start_deg),
                "longitude_end": float(sign_start_deg + 30),
                "lord": ZODIAC_LORDS.get(ZODIAC_SIGNS[sign_index], "Unknown")
            }
            houses_data.append(h_obj)
            houses_dict[str(house_num)] = h_obj
    else:
        # Unequal / Dynamic House Systems (Placidus, Koch, etc.)
        for i in range(12):
            house_num = i + 1
            cusp_start = nirayana_cusps[i]
            cusp_end = nirayana_cusps[(i + 1) % 12]
            
            # Determine sign on the cusp
            sign_index = int(cusp_start / 30)
            
            h_obj = {
                "house_number": house_num,
                "zodiac_sign": ZODIAC_SIGNS[sign_index],
                "longitude_start": float(cusp_start),
                "longitude_end": float(cusp_end),
                "lord": ZODIAC_LORDS.get(ZODIAC_SIGNS[sign_index], "Unknown")
            }
            houses_data.append(h_obj)
            houses_dict[str(house_num)] = h_obj

    def get_house_from_cusps(lon, cusps):
        """Find house number based on planet longitude and house cusps"""
        for i in range(12):
            c1 = cusps[i]
            c2 = cusps[(i + 1) % 12]
            if c1 < c2:
                if c1 <= lon < c2: return i + 1
            else: # Wrap around 360
                if lon >= c1 or lon < c2: return i + 1
        return 0

    house_cusps = [normalize_degree(c - ayanamsa) for c in res_houses[0]]

    # Assign Houses to Planets
    for p in planets_data:
        p_lon = p["longitude"]
        
        # 1. Whole Sign (Natal/Rashi)
        p_sign_index = int(p_lon / 30)
        diff = p_sign_index - asc_sign_index
        if diff < 0: diff += 12
        p["house"] = diff + 1
        
        # 2. Bhav Chalit (KP/Selected System)
        p["kp_house"] = get_house_from_cusps(p_lon, house_cusps)
        
    # 8. Sudarshana Chakra Calculations
    # Wheel 1: Lagna-based houses (already done)
    # Wheel 2: Moon-based houses
    moon_lon = planet_longitudes.get("Moon", 0)
    moon_sign_index = int(moon_lon / 30)
    
    # Wheel 3: Sun-based houses
    sun_lon = planet_longitudes.get("Sun", 0)
    sun_sign_index = int(sun_lon / 30)

    def get_wheel_data(reference_sign_index):
        wheel_houses = []
        for i in range(12):
            sign_index = (reference_sign_index + i) % 12
            wheel_houses.append({
                "house": i + 1,
                "sign": ZODIAC_SIGNS[sign_index],
                "planets": [p["name"] for p in planets_data if int(p["longitude"] / 30) == sign_index]
            })
        return wheel_houses

    # 9. Calculate Special Points (Destiny, Fortune, Yogi, etc.)
    # Destiny Point (Bhrigu Bindu) = (Moon + Rahu) / 2
    moon_l = planet_longitudes.get("Moon", 0)
    rahu_l = planet_longitudes.get("Rahu", 0)
    
    # Midpoint logic:
    # If arc distance > 180, take the other side?
    # Bhrigu Bindu is strictly mathematical midpoint.
    # Usually: (L1 + L2) / 2.
    # Example: Moon 10, Rahu 350. Sum=360. Avg=180.
    # Distance is 20 deg (via 0). Midpoint should be 0.
    # Let's stick to standard summation: (Moon + Rahu) / 2.
    # If Moon < Rahu, sum/2.
    # Wait, Bhrigu Bindu is defined as the midpoint of the arc from Rahu to Moon? Or just midpoint?
    # "Add the longitude of Moon and Rahu and divide by 2." (CS Patel).
    destiny_lon = normalize_degree((moon_l + rahu_l) / 2.0)
    
    # Part of Fortune (Pars Fortuna)
    # Day: Asc + Moon - Sun
    # Night: Asc + Sun - Moon
    sun_l = planet_longitudes.get("Sun", 0)
    asc_l = ascendant_nirayana
    
    # Determine Day/Night based on Sun House (Whole Sign)
    # Sun House 7-12 = Day, 1-6 = Night
    sun_sign_idx = int(sun_l / 30)
    diff = sun_sign_idx - asc_sign_index
    if diff < 0: diff += 12
    sun_house = diff + 1
    
    is_day_birth = 7 <= sun_house <= 12
    
    if is_day_birth:
        fortune_lon = normalize_degree(asc_l + moon_l - sun_l)
    else:
        fortune_lon = normalize_degree(asc_l + sun_l - moon_l)
        
    special_points = [
        {
            "name": "Destiny Point (Bhrigu Bindu)",
            "longitude": destiny_lon,
            "sign": get_zodiac_sign(destiny_lon),
            "nakshatra": get_nakshatra(destiny_lon)
        },
        {
            "name": "Fortune Point (Part of Fortune)",
            "longitude": fortune_lon,
            "sign": get_zodiac_sign(fortune_lon),
            "nakshatra": get_nakshatra(fortune_lon),
            "formula": "Day (Asc+Moon-Sun)" if is_day_birth else "Night (Asc+Sun-Moon)"
        }
    ]
    
    # 10. Badhaka Planet Identification
    # Moveable (1,4,7,10): 11th Lord
    # Fixed (2,5,8,11): 9th Lord
    # Dual (3,6,9,12): 7th Lord
    
    asc_sign_num = asc_sign_index + 1 # 1-12
    badhaka_house_num = 0
    
    if asc_sign_num in [1, 4, 7, 10]: # Moveable
        badhaka_house_num = 11
    elif asc_sign_num in [2, 5, 8, 11]: # Fixed
        badhaka_house_num = 9
    else: # Dual
        badhaka_house_num = 7
        
    # Calculate Badhaka Sign and Lord
    badhaka_sign_idx = (asc_sign_index + badhaka_house_num - 1) % 12
    badhaka_sign = ZODIAC_SIGNS[badhaka_sign_idx]
    badhaka_lord = ZODIAC_LORDS.get(badhaka_sign, "Unknown")
    
    badhaka_info = {
        "ascendant_type": "Moveable" if asc_sign_num in [1,4,7,10] else "Fixed" if asc_sign_num in [2,5,8,11] else "Dual",
        "badhaka_house": badhaka_house_num,
        "badhaka_sign": badhaka_sign,
        "badhaka_lord": badhaka_lord
    }

    # 11. Calculate Jaimini Details
    jaimini_karakas = calculate_jaimini_karakas(planets_data)
    jaimini_padas = calculate_arudha_padas(ascendant_nirayana, planets_data)
    jaimini_dasha = calculate_chara_dasha(ascendant_nirayana, planets_data)
    jaimini_aspects = calculate_jaimini_aspects(planets_data)
    jaimini_karakamsa = calculate_karakamsa(jaimini_karakas)
    jaimini_argala = calculate_argala(get_zodiac_sign(ascendant_nirayana), planets_data)

    # 12. Calculate Yogini Dasha
    # Calculate decimal year for dasha start times
    # Simple approx: year + (day_of_year) / 365.25
    day_of_year = naive_dt.timetuple().tm_yday
    decimal_year = year + (day_of_year - 1) / 365.25 + decimal_hour_local / (24 * 365.25)
    
    yogini_dasha = calculate_yogini_dasha(planet_longitudes.get("Moon", 0), decimal_year)

    # 13. Calculate Special Degrees (Mrtyu Bhaga, Pushkara)
    special_degrees_analysis = check_special_degrees(planets_data)
    
    # 14. Calculate Avasthas
    avasthas = calculate_avasthas(planets_data)

    # 10. Construct Final Response
    result = {
        "birth_details": {
            "date": date_str,
            "time": time_str,
            "timezone": timezone_str,
            "latitude": latitude,
            "longitude": longitude
        },
        "ascendant": ascendant_data,
        "planets": planets_data,
        "houses": houses_data,
        "house_cusps": nirayana_cusps,
        "maitri": calculate_maitri(planets_data),
        "sudarshana_chakra": {
            "lagna_wheel": get_wheel_data(asc_sign_index),
            "moon_wheel": get_wheel_data(moon_sign_index),
            "sun_wheel": get_wheel_data(sun_sign_index)
        },
        "special_points": special_points,
        "badhaka_info": badhaka_info,
        "jaimini": {
            "karakas": jaimini_karakas,
            "karakamsa": jaimini_karakamsa,
            "arudha_padas": jaimini_padas,
            "chara_dasha": jaimini_dasha,
            "aspects": jaimini_aspects,
            "argala": jaimini_argala
        },
        "yogini_dasha": yogini_dasha,
        "special_degrees": special_degrees_analysis,
        "avasthas": avasthas
    }
    
    return result
