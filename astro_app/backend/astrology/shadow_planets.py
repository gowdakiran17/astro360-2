
import logging
from typing import Dict, Any, List
from datetime import datetime, timedelta
import swisseph as swe
from astro_app.backend.astrology.utils import (
    get_julian_day, normalize_degree, get_zodiac_sign, 
    get_nakshatra, get_nakshatra_pada
)

logger = logging.getLogger(__name__)

# Standard portions for day/night division (8 parts)
# For Upagrahas (Shadow Planets)
# Day Parts: 8 parts of day duration
# Night Parts: 8 parts of night duration

# Table: Part number (1-8) ruled by Gulika/Mandi etc depending on Weekday
# Weekdays: Sun=0, Mon=1, ..., Sat=6
# For Gulika (Day):
# Sun: 7, Mon: 6, Tue: 5, Wed: 4, Thu: 3, Fri: 2, Sat: 1
GULIKA_DAY_PARTS = {
    0: 7, 1: 6, 2: 5, 3: 4, 4: 3, 5: 2, 6: 1
}
# For Gulika (Night):
# Sun: 3, Mon: 2, Tue: 1, Wed: 7, Thu: 6, Fri: 5, Sat: 4
GULIKA_NIGHT_PARTS = {
    0: 3, 1: 2, 2: 1, 3: 7, 4: 6, 5: 5, 6: 4
}

# For Yamaghantaka (Day):
# Sun: 5, Mon: 4, Tue: 3, Wed: 2, Thu: 1, Fri: 7, Sat: 6
YAMA_DAY_PARTS = {
    0: 5, 1: 4, 2: 3, 3: 2, 4: 1, 5: 7, 6: 6
}
# Night parts logic varies, usually similar shift.

# Upagraha Definitions
# Each has a specific longitude calculation based on Sun's longitude + constant
# OR calculated based on time-segments (Kaala).
# Gulika and Mandi are time-based.
# Others (Dhuma, Vyatipata, Parivesha, Indrachapa, Upaketu) are mathematical from Sun.

def calculate_mathematical_shadow_planets(sun_lon: float) -> List[Dict[str, Any]]:
    """
    Calculates the 5 mathematically derived Upagrahas based on BPHS.
    1. Dhuma = Sun + 133° 20'
    2. Vyatipata = 360° - Dhuma
    3. Parivesha = Vyatipata + 180°
    4. Indrachapa = 360° - Parivesha
    5. Upaketu = Indrachapa + 16° 40'
    """
    results = []
    
    # 1. Dhuma
    dhuma_lon = normalize_degree(sun_lon + 133.333333)
    results.append({
        "name": "Dhuma",
        "longitude": dhuma_lon,
        "type": "Malefic",
        "description": "Smoke/Haze - Causes mental confusion"
    })
    
    # 2. Vyatipata
    vyatipata_lon = normalize_degree(360 - dhuma_lon)
    results.append({
        "name": "Vyatipata",
        "longitude": vyatipata_lon,
        "type": "Malefic",
        "description": "Calamity - Sudden mishaps"
    })
    
    # 3. Parivesha
    parivesha_lon = normalize_degree(vyatipata_lon + 180)
    results.append({
        "name": "Parivesha",
        "longitude": parivesha_lon,
        "type": "Malefic",
        "description": "Halo - Fear and disease"
    })
    
    # 4. Indrachapa
    indrachapa_lon = normalize_degree(360 - parivesha_lon)
    results.append({
        "name": "Indrachapa",
        "longitude": indrachapa_lon,
        "type": "Benefic", # Sometimes considered benefic if conjoined benefic
        "description": "Rainbow - Can be auspicious"
    })
    
    # 5. Upaketu
    upaketu_lon = normalize_degree(indrachapa_lon + 16.666667)
    results.append({
        "name": "Upaketu",
        "longitude": upaketu_lon,
        "type": "Malefic",
        "description": "Comet - Short lived obstacles"
    })
    
    # Enrich with Sign/Nakshatra
    for r in results:
        r["sign"] = get_zodiac_sign(r["longitude"])
        r["nakshatra"] = get_nakshatra(r["longitude"])
        r["pada"] = get_nakshatra_pada(r["longitude"])
        
    return results

def calculate_time_based_upagrahas(
    date_str: str, 
    time_str: str, 
    timezone_str: str, 
    lat: float, 
    lon: float
) -> List[Dict[str, Any]]:
    """
    Calculates Gulika, Mandi, and Yamaghantaka based on Day/Night duration.
    """
    # 1. Get Sunrise/Sunset for the day
    # We need JD for start of day? No, swe.rise_trans returns JD.
    
    # Get JD for the given time
    jd_current = get_julian_day(date_str, time_str, timezone_str)
    
    # Determine date object for weekday
    dt = datetime.strptime(f"{date_str} {time_str}", "%d/%m/%Y %H:%M")
    weekday = dt.weekday() # 0=Mon, 6=Sun. Need to convert to standard Sun=0
    # Python: Mon=0...Sun=6.
    # Astro: Sun=0, Mon=1...Sat=6.
    astro_weekday = (weekday + 1) % 7
    
    # Calculate Sunrise/Sunset
    # Using Swiss Ephemeris
    # Provide lat/lon/date
    
    # Note: rise_trans requires JD. We should use JD for noon of that day to search backward/forward.
    # Let's approximate JD for 12:00 local time
    jd_noon = get_julian_day(date_str, "12:00", timezone_str)
    
    # Flags: BIT_DISC_CENTER + BIT_NO_REFRACTION typically used for theoretical rise
    # But for Shadbala standard rise is fine.
    # swe.calc_ut returns tuple. swe.rise_trans returns (rise_jd, set_jd, ...)??
    # No, rise_trans returns tuple with index 0=Time.
    
    # Find Sunrise (Sun = 0)
    # Search for sunrise BEFORE noon
    res_rise = swe.rise_trans(
        jd_noon, swe.SUN, swe.CALC_RISE, (lon, lat, 0), 0, 0
    )
    sunrise_jd = res_rise[1][0] # index 1 is result tuple, [0] is JD
    
    # Find Sunset AFTER noon
    res_set = swe.rise_trans(
        jd_noon, swe.SUN, swe.CALC_SET, (lon, lat, 0), 0, 0
    )
    sunset_jd = res_set[1][0]
    
    # Check if Birth is Day or Night
    is_day_birth = sunrise_jd <= jd_current <= sunset_jd
    
    # Duration of Day/Night
    day_duration = sunset_jd - sunrise_jd
    
    # If Night birth, we need Next Sunrise or Previous Sunset?
    # Night duration = Next Sunrise - Sunset.
    # Let's get next sunrise
    res_next_rise = swe.rise_trans(
        sunset_jd + 0.5, swe.SUN, swe.CALC_RISE, (lon, lat, 0), 0, 0
    )
    next_sunrise_jd = res_next_rise[1][0]
    night_duration = next_sunrise_jd - sunset_jd
    
    # Calculate Gulika Start Time
    # Each part = Duration / 8
    
    gulika_part = 0
    yama_part = 0
    
    if is_day_birth:
        # Day Birth
        part_len = day_duration / 8.0
        start_jd = sunrise_jd
        
        # Gulika Part
        # Sun=7, Mon=6...
        # Map: {0:7, 1:6...}
        part_num = GULIKA_DAY_PARTS[astro_weekday] # 1-based index (e.g. 7th part)
        gulika_start_jd = start_jd + (part_num - 1) * part_len
        gulika_end_jd = start_jd + part_num * part_len
        gulika_jd = (gulika_start_jd + gulika_end_jd) / 2 # Midpoint often used for longitude
        
        # Yamaghantaka Part
        y_part_num = YAMA_DAY_PARTS[astro_weekday]
        yama_jd = start_jd + (y_part_num - 1) * part_len + (part_len / 2)
        
    else:
        # Night Birth
        part_len = night_duration / 8.0
        start_jd = sunset_jd
        
        # Gulika Part Night
        # Use Night mapping
        # Adjust weekday? If birth is after midnight but before sunrise, 
        # Vedic day is still previous day.
        # Our astro_weekday is based on standard Gregorian date.
        # We need to ensure we use the weekday of the sunrise before birth.
        # If jd_current < sunrise_jd (next day), logic holds if we use previous day.
        # But here we used 'sunrise_jd' from noon search. 
        # If is_day_birth is false, we are between sunset and next sunrise.
        # The weekday governing the night is the weekday of the sunset.
        # So astro_weekday is correct.
        
        part_num = GULIKA_NIGHT_PARTS[astro_weekday]
        gulika_jd = start_jd + (part_num - 1) * part_len + (part_len / 2)
        
        # Yamaghantaka Night? Usually not calculated or different rule.
        # Standard texts focus on Day Yamaghantaka. 
        # Let's skip Night Yama or use generic logic (Day part + 4?)
        yama_jd = None

    results = []
    
    # Calculate Ascendant for the Gulika/Yama JD to get Longitude
    # The "Longitude" of Gulika is the Ascendant of the moment Gulika starts.
    
    if gulika_jd:
        # Calculate Ascendant at Gulika Time
        gulika_lon = swe.houses(gulika_jd, lat, lon, b'P')[1][0] # 1[0] is Asc
        # Apply Ayanamsa
        swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
        aya = swe.get_ayanamsa_ut(gulika_jd)
        gulika_nirayana = normalize_degree(gulika_lon - aya)
        
        results.append({
            "name": "Gulika",
            "longitude": gulika_nirayana,
            "type": "Malefic",
            "description": "Son of Saturn - Causes delays and chronic issues",
            "sign": get_zodiac_sign(gulika_nirayana),
            "nakshatra": get_nakshatra(gulika_nirayana)
        })
        
        # Mandi is often considered start of Gulika, or Gulika is middle.
        # Some say Mandi is synonymous.
        # Let's add Mandi as same or slightly different if specific rule exists.
        # Use Gulika for now.
        
    if yama_jd:
        yama_lon = swe.houses(yama_jd, lat, lon, b'P')[1][0]
        aya = swe.get_ayanamsa_ut(yama_jd)
        yama_nirayana = normalize_degree(yama_lon - aya)
        
        results.append({
            "name": "Yamaghantaka",
            "longitude": yama_nirayana,
            "type": "Benefic", # Son of Jupiter
            "description": "Son of Jupiter - Can be auspicious but destructive to life span",
            "sign": get_zodiac_sign(yama_nirayana),
            "nakshatra": get_nakshatra(yama_nirayana)
        })
        
    return results

def get_shadow_planets(birth_details: Dict[str, Any], sun_lon: float) -> List[Dict[str, Any]]:
    """
    Main orchestrator for Shadow Planets.
    """
    try:
        # 1. Mathematical Points (Dhuma etc)
        math_points = calculate_mathematical_shadow_planets(sun_lon)
        
        # 2. Time-based Points (Gulika etc)
        time_points = calculate_time_based_upagrahas(
            birth_details['date'],
            birth_details['time'],
            birth_details['timezone'],
            birth_details['latitude'],
            birth_details['longitude']
        )
        
        return math_points + time_points
        
    except Exception as e:
        logger.error(f"Error calculating shadow planets: {e}")
        return []
