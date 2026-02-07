import swisseph as swe
from datetime import datetime, timedelta
import math
from astro_app.backend.astrology.utils import get_julian_day, normalize_degree, ZODIAC_SIGNS
from astro_app.backend.astrology.chart import calculate_chart

# Constants for Pancha-Vargiya Bala (Strength Calculation) - Placeholder for Phase 2
# We will focus on calculating the Chart, Muntha, and Office Bearers first.

def calculate_solar_return_time(natal_sun_lon: float, target_year: int, birth_month: int, birth_day: int, birth_time: str, timezone: float) -> float:
    """
    Calculates the exact Julian Day (ET/UT) when the Sun returns to the natal longitude 
    in the target year.
    
    Returns:
        float: Julian Day of the solar return.
    """
    # 1. Estimate start time: The birthday in the target year
    # Construct a datetime for the target year birthday
    try:
        # Handle leap year birthday (Feb 29) on non-leap target years
        target_date = datetime(target_year, birth_month, birth_day)
    except ValueError:
        # If Feb 29 and target year is not leap, use Mar 1 or Feb 28. 
        # Usually exact degree match will handle the shift automatically if we start close enough.
        target_date = datetime(target_year, 3, 1)

    # Parse birth time string "HH:MM"
    h, m = map(int, birth_time.split(":"))
    
    # Get Julian Day for the estimate (using noon or birth time as rough start)
    # We use UT for calculations
    jd_start = get_julian_day(target_date.strftime("%Y-%m-%d"), birth_time, timezone)
    
    # 2. Search for the exact moment.
    # We look for the moment Sun's longitude = natal_sun_lon.
    # The Sun moves ~1 degree per day. We can search in a window of +/- 2 days.
    
    # Iterate to find exact crossing
    # Using a simple Newton-Raphson or binary search would be efficient, 
    # but since movement is linear-ish, we can step.
    # Better: Use swisseph's built-in search if possible, or manual iterative approach.
    
    # Let's use a robust iterative approach (Secant method or similar)
    t0 = jd_start - 2.0
    t1 = jd_start + 2.0
    
    # Set flags for sidereal (if natal_sun_lon is sidereal).
    # IMPORTANT: The input natal_sun_lon is usually Sidereal (Lahiri) in this system.
    # However, SwissEph usually works in Tropical. 
    # To find the return, we must match the *coordinate system*.
    # If we want the Sidereal Solar Return (Tajaka), we need the Sun to return to the same 
    # position relative to the stars. 
    # Since Precession applies, the Tropical position will be different.
    # 
    # Approach:
    # 1. Calculate Ayanamsa for the target time.
    # 2. Sidereal Sun = Tropical Sun - Ayanamsa.
    # 3. Target: Sidereal Sun == Natal Sidereal Sun.
    # 
    # Function to minimize: f(t) = (TropicalSun(t) - Ayanamsa(t)) - NatalSiderealSun = 0
    
    # Tolerance: 1 second approx 0.00001 days
    tolerance = 0.00001 
    max_iter = 20
    
    current_jd = jd_start
    
    for _ in range(max_iter):
        # Calculate current position
        swe.set_sid_mode(swe.SIDM_LAHIRI)
        ayanamsa = swe.get_ayanamsa_ut(current_jd)
        
        # Get Tropical Sun
        flags = swe.FLG_SWIEPH | swe.FLG_SPEED
        res = swe.calc_ut(current_jd, swe.SUN, flags)
        trop_sun = res[0][0]
        speed = res[0][3] # degrees per day
        
        # Calculate Sidereal Sun
        sid_sun = normalize_degree(trop_sun - ayanamsa)
        
        # Calculate difference (handling 360 boundary)
        diff = sid_sun - natal_sun_lon
        if diff > 180: diff -= 360
        if diff < -180: diff += 360
        
        # If within tolerance, break
        if abs(diff) < 0.00001: # ~1 arc second
            break
            
        # Estimate time step: dt = -diff / speed
        # Speed is tropical speed (~0.98 deg/day). Ayanamsa change is negligible per day.
        dt = -diff / speed
        current_jd += dt
        
    return current_jd

def calculate_muntha(natal_asc_sign: int, birth_year: int, target_year: int) -> int:
    """
    Calculates the Muntha sign for the target year.
    Formula: (Natal Asc Sign + (Target Year - Birth Year)) % 12
    Note: Signs are 1-12.
    """
    # Difference in years
    years_passed = target_year - birth_year
    
    # Calculate shift
    # Muntha progresses 1 sign per year.
    # Start: Natal Asc Sign
    # Year 0 (Birth year): Natal Asc
    # Year 1: Natal Asc + 1
    
    # 1-based index calculation
    muntha_sign = (natal_asc_sign + years_passed - 1) % 12 + 1
    
    return muntha_sign

def get_year_lord_candidates(chart_data: dict, muntha_sign: int, birth_asc_sign: int, day_birth: bool) -> dict:
    """
    Identifies the 5 Office Bearers (Pancha Adhikaris) for the Year Lord selection.
    
    1. Muntha Pati (Lord of Muntha Sign)
    2. Janma Lagnesha (Lord of Birth Ascendant)
    3. Varsha Lagnesha (Lord of Year Ascendant)
    4. Tri-Rashi Pati (Lord of the Tri-Rashi of the Year Ascendant)
       - Day Birth: Sun(Aries/Leo/Sag), Jupiter(Tau/Vir/Cap), Moon(Gem/Lib/Aq), Mars(Can/Sco/Pis)
       - Night Birth: Jupiter(Aries/Leo/Sag), Sun(Tau/Vir/Cap), Venus(Gem/Lib/Aq), Moon(Can/Sco/Pis)
       - (Note: Need to verify standard Tri-Rashi table for Tajaka)
    5. Din-Ratri Pati (Lord of Day/Night)
       - Day Birth: Sun's sign ruler (at Varsha Pravesh)
       - Night Birth: Moon's sign ruler (at Varsha Pravesh)
       *Correction*: Usually it is Lord of Sun Sign (Day) or Lord of Moon Sign (Night) in the return chart.
    """
    
    # Basic Sign Rulers
    RULERS = {
        1: "Mars", 2: "Venus", 3: "Mercury", 4: "Moon", 5: "Sun", 6: "Mercury",
        7: "Venus", 8: "Mars", 9: "Jupiter", 10: "Saturn", 11: "Saturn", 12: "Jupiter"
    }
    
    varsha_asc_sign = int(chart_data["ascendant"]["sign_id"])
    
    # 1. Muntha Pati
    muntha_lord = RULERS[muntha_sign]
    
    # 2. Janma Lagnesha
    birth_lagna_lord = RULERS[birth_asc_sign]
    
    # 3. Varsha Lagnesha
    varsha_lagna_lord = RULERS[varsha_asc_sign]
    
    # 4. Tri-Rashi Pati
    # Standard Tajaka Tri-Rashi Lords
    # Signs: 1,5,9 (Fire) | 2,6,10 (Earth) | 3,7,11 (Air) | 4,8,12 (Water)
    # Day:   Sun          | Venus           | Saturn          | Mars
    # Night: Jupiter      | Moon            | Mercury         | Venus
    # Note: There are variations. Using standard B.V. Raman / K.N. Rao table.
    # Let's use the standard Tajaka table:
    # Aries, Leo, Sag (Fire): Sun (Day), Jupiter (Night)
    # Tau, Vir, Cap (Earth): Venus (Day), Moon (Night)
    # Gem, Lib, Aq (Air): Saturn (Day), Mercury (Night)
    # Can, Sco, Pis (Water): Mars (Day), Mars (Night) - check this? 
    # Usually Water Night is Venus in some texts, Mars in others. 
    # Let's stick to a common reference. 
    # Ref: Dr. K.S. Charak "A Textbook of Varshaphala":
    # Fire: Sun(D), Jup(N)
    # Earth: Ven(D), Moon(N)
    # Air: Sat(D), Mer(N)
    # Water: Mars(D), Mars(N)
    
    tri_rashi_map = {
        "Fire":  {"Day": "Sun", "Night": "Jupiter"},
        "Earth": {"Day": "Venus", "Night": "Moon"},
        "Air":   {"Day": "Saturn", "Night": "Mercury"},
        "Water": {"Day": "Mars", "Night": "Mars"}
    }
    
    element_map = {
        1: "Fire", 5: "Fire", 9: "Fire",
        2: "Earth", 6: "Earth", 10: "Earth",
        3: "Air", 7: "Air", 11: "Air",
        4: "Water", 8: "Water", 12: "Water"
    }
    
    element = element_map[varsha_asc_sign]
    time_of_day = "Day" if day_birth else "Night" # Need to determine day/night of Varsha Pravesh
    
    tri_rashi_lord = tri_rashi_map[element][time_of_day]
    
    # 5. Din-Ratri Pati
    # Day Birth -> Sun's Sign Lord in Return Chart? No, usually Lord of the Sun sign.
    # Night Birth -> Moon's Sign Lord in Return Chart? No, usually Lord of the Moon sign.
    # Actually, often it's:
    # Day: Sun is Lord of Year (conceptually) -> Look at Sun's position?
    # No, the rule is:
    # If Varsha Pravesh is in Day -> Lord of the sign occupied by Sun.
    # If Varsha Pravesh is in Night -> Lord of the sign occupied by Moon.
    
    if day_birth: # Is it day at return time?
        # Find Sun's sign in return chart
        sun_pos = next(p for p in chart_data["planets"] if p["name"] == "Sun")
        sun_sign = int(sun_pos["sign_id"])
        din_ratri_lord = RULERS[sun_sign]
    else:
        # Find Moon's sign in return chart
        moon_pos = next(p for p in chart_data["planets"] if p["name"] == "Moon")
        moon_sign = int(moon_pos["sign_id"])
        din_ratri_lord = RULERS[moon_sign]

    return {
        "Muntha Lord": muntha_lord,
        "Birth Lagna Lord": birth_lagna_lord,
        "Varsha Lagna Lord": varsha_lagna_lord,
        "Tri-Rashi Lord": tri_rashi_lord,
        "Din-Ratri Lord": din_ratri_lord
    }

def calculate_solar_return(natal_details: dict, target_year: int):
    """
    Main function to generate Solar Return Report.
    """
    # 1. Parse Natal Date if string
    if isinstance(natal_details["date"], str):
        date_str = natal_details["date"]
        if "/" in date_str:
            # Parse DD/MM/YYYY
            d, m, y = map(int, date_str.split("/"))
        elif "-" in date_str:
             # Parse YYYY-MM-DD
            y, m, d = map(int, date_str.split("-"))
        else:
            raise ValueError(f"Unknown date format: {date_str}")
            
        birth_year = y
        birth_month = m
        birth_day = d
    else:
        # Assume datetime object
        birth_year = natal_details["date"].year
        birth_month = natal_details["date"].month
        birth_day = natal_details["date"].day

    # 2. Calculate Return Time
    # Need natal Sun longitude (Sidereal)
    if "sun_longitude" not in natal_details or "asc_sign_id" not in natal_details:
        # Calculate Natal Chart on the fly
        natal_chart = calculate_chart(
            natal_details["date"],
            natal_details["time"],
            natal_details["timezone"],
            natal_details["latitude"],
            natal_details["longitude"]
        )
        # Extract Sun
        sun_pos = next(p for p in natal_chart["planets"] if p["name"] == "Sun")
        natal_sun_lon = sun_pos["longitude"]
        natal_asc_sign = int(natal_chart["ascendant"]["sign_id"])
    else:
        natal_sun_lon = natal_details.get("sun_longitude", 0.0)
        natal_asc_sign = natal_details.get("asc_sign_id", 1)
    
    jd_return = calculate_solar_return_time(
        natal_sun_lon, 
        target_year, 
        birth_month, 
        birth_day, 
        natal_details["time"], 
        natal_details["timezone"]
    )
    
    # Convert JD back to Date/Time string for Chart Calculation
    # swe.revjul returns (year, month, day, hour_decimal)
    y, m, d, h_dec = swe.revjul(jd_return)
    
    # Convert hour decimal to HH:MM:SS
    h = int(h_dec)
    rem = (h_dec - h) * 60
    mins = int(rem)
    secs = int((rem - mins) * 60)
    
    # Format date as YYYY-MM-DD for calculate_chart (which uses datetime.strptime with %Y-%m-%d usually or flexible)
    # Checking calculate_chart implementation in chart.py usually expects YYYY-MM-DD or DD/MM/YYYY.
    # Let's use YYYY-MM-DD as standard ISO.
    return_date_str = f"{d:02d}/{m:02d}/{y:04d}" # Using DD/MM/YYYY to match input format usually
    return_time_str = f"{h:02d}:{mins:02d}:{secs:02d}"
    
    # 3. Calculate Chart for this time
    # Use same location as birth? Or current residence?
    # Standard: Usually current residence, but often birth location is used if residence unknown.
    # We will use birth location for now (as passed in natal_details).
    
    lat = natal_details["latitude"]
    lon = natal_details["longitude"]
    tz = natal_details["timezone"] # Assuming TZ matches location (simplification)
    
    # NOTE: timezone might change due to DST at that location in that year.
    # Ideally need a timezone lookup for that date/loc.
    # For now, we use the passed timezone.
    
    chart = calculate_chart(return_date_str, return_time_str, tz, lat, lon)
    
    # 4. Calculate Muntha
    muntha_sign = calculate_muntha(natal_asc_sign, birth_year, target_year)
    
    # 5. Determine Day/Night of Return
    # Simple check: Is Sun in 7-12 houses (Day) relative to Return Ascendant?
    asc_lon = chart["ascendant"]["longitude"]
    sun_lon = next(p["longitude"] for p in chart["planets"] if p["name"] == "Sun")
    diff = (sun_lon - asc_lon) % 360
    is_day = 180 < diff < 360
    
    # 6. Office Bearers
    bearers = get_year_lord_candidates(chart, muntha_sign, natal_asc_sign, is_day)
    
    # 7. Year Lord Selection (Phase 1 Simplified)
    year_lord = select_year_lord(bearers, chart)
    
    return {
        "year": target_year,
        "return_date": return_date_str,
        "return_time": return_time_str,
        "tajaka_chart": chart, # Renamed to match frontend expectation
        "muntha": {
            "sign": ZODIAC_SIGNS[muntha_sign - 1], # Converted to name
            "house": _get_house_of_sign(muntha_sign, chart["ascendant"]["sign_id"]),
            "lord": bearers["Muntha Lord"]
        },
        "pancha_adhikaris": {
            "muntha_lord": bearers["Muntha Lord"],
            "birth_lagna_lord": bearers["Birth Lagna Lord"],
            "varsha_lagna_lord": bearers["Varsha Lagna Lord"],
            "tri_rashi_pati": bearers["Tri-Rashi Lord"],
            "din_ratri_pati": bearers["Din-Ratri Lord"]
        },
        "year_lord": year_lord,
        "is_day_birth": is_day
    }

def _get_house_of_sign(sign_id: int, asc_sign_id: int) -> int:
    """Calculates house number (1-12) of a sign relative to Ascendant."""
    h = (sign_id - int(asc_sign_id)) % 12 + 1
    return h

def select_year_lord(bearers: dict, chart: dict) -> str:
    """
    Selects the Year Lord (Varsheshwara) from the 5 Office Bearers.
    
    Rules (Simplified Phase 1):
    1. Candidates must aspect the Varsha Lagna.
    2. Strongest among them wins.
    3. If none aspect, Muntha Lord is chosen (simplification).
    """
    candidates = list(set(bearers.values())) # Unique candidates
    
    # 1. Check Aspects to Varsha Lagna
    # Varsha Lagna Sign
    asc_sign = chart["ascendant"]["sign"]
    
    # Get Aspect Map (Sign Based)
    # Using Jaimini/Tajaka Aspects:
    # Movable aspects Fixed (except adj), Fixed aspects Movable (except adj), Dual aspects Dual.
    # Note: Tajaka aspects are actually Planetary (Conjunction, Sextile, Square, Trine, Opposition).
    # But usually "Aspect to Lagna" in Year Lord selection implies the planet aspects the Ascendant point 
    # or the Ascendant Sign.
    # Let's use standard Parasari/Tajaka planetary aspects for simplicity in Phase 1.
    # Or simpler: Is the planet in a house that aspects Lagna?
    # Houses aspecting Lagna (House 1): 1, 4, 7, 10 (Kendras) + 5, 9 (Trines).
    # Tajaka aspects: 3, 5, 9, 11 (Friendly), 1, 4, 7, 10 (Kendra - Enemy/Neutral?).
    # Actually Tajaka aspects are specific (5/9, 3/11, 1/4/7/10).
    # Let's use a simple rule: Is the planet in 1, 4, 7, 10, 5, 9 from Lagna?
    
    eligible = []
    
    planet_positions = {p["name"]: p for p in chart["planets"]}
    
    for planet_name in candidates:
        if planet_name not in planet_positions: continue
        
        p_data = planet_positions[planet_name]
        # Calculate house from Lagna
        # We assume chart["planets"] has "house" calculated or we calculate it.
        # The chart object from calculate_chart usually has house relative to Asc.
        # Let's check chart structure. It has "house" key usually.
        # If not, calculate from sign.
        
        p_sign_id = int(p_data.get("sign_id", 0))
        asc_sign_id = int(chart["ascendant"].get("sign_id", 0))
        
        house = (p_sign_id - asc_sign_id) % 12 + 1
        
        # Check if aspects Lagna
        # Aspects to House 1:
        # - Position in House 1 (Conjunction)
        # - Position in House 7 (Opposition)
        # - Position in House 4, 10 (Square)
        # - Position in House 5, 9 (Trine)
        # - Position in House 3, 11 (Sextile)
        # Basically almost all except 2, 6, 8, 12?
        # Tajaka Aspects:
        # 1 (Conj), 7 (Opp), 4/10 (Square), 5/9 (Trine), 3/11 (Sextile).
        # Houses 2, 6, 8, 12 do NOT aspect Lagna usually.
        
        if house in [1, 3, 4, 5, 7, 9, 10, 11]:
            strength = _calculate_simple_strength(p_data, chart)
            eligible.append((planet_name, strength))
            
    if not eligible:
        return bearers["Muntha Lord"] # Fallback
        
    # Sort by strength descending
    eligible.sort(key=lambda x: x[1], reverse=True)
    
    return eligible[0][0]

def _calculate_simple_strength(planet: dict, chart: dict) -> float:
    """
    Calculates a simple strength score (0-100) for Phase 1.
    Based on Dignity and House placement.
    """
    score = 0
    
    # 1. Dignity (Exaltation, Own, Friend, etc.)
    # We can use the 'is_retrograde' etc.
    # Since we don't have full dignity map here, let's infer from House/Sign.
    # Placeholder: Random-ish based on speed/retro?
    # No, let's use House placement.
    
    house = planet.get("house", 1)
    
    # Kendras (1, 4, 7, 10) -> Strong (+20)
    if house in [1, 4, 7, 10]: score += 20
    # Trikonas (5, 9) -> Good (+15)
    elif house in [5, 9]: score += 15
    # Upachayas (3, 6, 10, 11) -> Okay (+10)
    elif house in [3, 6, 11]: score += 10
    # Dusthanas (6, 8, 12) -> Weak (-10)
    elif house in [8, 12]: score -= 10
    
    # Retrograde -> Strong (+10) (Chesta Bala)
    if planet.get("is_retrograde"): score += 10
    
    # Speed (Fast is usually better?)
    
    return score

