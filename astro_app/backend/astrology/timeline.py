from datetime import datetime, timedelta
import swisseph as swe
from astro_app.backend.astrology.utils import get_julian_day

ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

PLANETS_TO_TRACK = {
    0: "Sun",
    1: "Moon", # Moon moves too fast for a 30-day timeline summary usually, but maybe major ingresses? 
               # Actually Moon changes sign every 2.5 days. Too much noise for "Timeline Story"?
               # Let's Skip Moon for the *Main* Timeline Story events unless it's New/Full Moon (which needs Phase calc).
               # For now, let's track Sun, Mercury, Venus, Mars, Jupiter, Saturn, Rahu/Ketu.
    2: "Mercury",
    3: "Venus",
    4: "Mars",
    5: "Jupiter",
    6: "Saturn",
    # Rahu/Ketu are special cases in swiss eph, usually 10/11 or via flags. 
    # Let's stick to main planets for MVP V2.0 stability.
}

def get_planet_sign(planet_id, jd):
    """Returns the zodiac sign index (0-11) for a planet at a given JD."""
    # SIDEREAL CALCULATION
    swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
    flags = swe.FLG_SWIEPH | swe.FLG_SIDEREAL | swe.FLG_SPEED
    pos, _ = swe.calc_ut(jd, planet_id, flags)
    long = pos[0]
    return int(long / 30)

def get_upcoming_events(start_date_str: str, days: int = 30):
    """
    Scans the next `days` for planetary ingresses (Sign changes).
    Returns a list of events.
    """
    events = []
    
    try:
        start_date = datetime.strptime(start_date_str, "%d/%m/%Y")
    except ValueError:
        # Fallback to today if format is wrong (e.g. YYYY-MM-DD passed by accident)
        start_date = datetime.now()

    # Get initial positions
    current_signs = {}
    
    # We use noon time for stability
    jd_start = get_julian_day(start_date.strftime("%d/%m/%Y"), "12:00", "05:30") # approximate TZ
    
    for pid, pname in PLANETS_TO_TRACK.items():
        if pname == "Moon": continue 
        current_signs[pid] = get_planet_sign(pid, jd_start)
    
    # Scan day by day
    for i in range(1, days + 1):
        check_date = start_date + timedelta(days=i)
        check_date_str = check_date.strftime("%b %d") # e.g. "Feb 05"
        
        # Calculate JD for this day
        jd_check = jd_start + i # Approx +1 day
        
        for pid, pname in PLANETS_TO_TRACK.items():
            if pname == "Moon": continue
            
            new_sign_idx = get_planet_sign(pid, jd_check)
            old_sign_idx = current_signs[pid]
            
            if new_sign_idx != old_sign_idx:
                # INGRESS DETECTED
                sign_name = ZODIAC_SIGNS[new_sign_idx]
                
                # Determine impact
                impact = "Medium"
                if pname in ["Sun", "Mars", "Jupiter", "Saturn"]:
                    impact = "High"
                
                events.append({
                    "date": check_date_str,
                    "event": f"{pname} enters {sign_name}",
                    "impact": impact
                })
                
                # Update current sign to avoid duplicate alerts (though loop moves forward anyway)
                current_signs[pid] = new_sign_idx

    return events
