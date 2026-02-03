import sys
import os
import swisseph as swe
from datetime import datetime

# Add project root to path
# Assuming we are in /Users/kirangowda/Downloads/astro360-1/astro360-1/astro_app/backend
# We need to add /Users/kirangowda/Downloads/astro360-1/astro360-1
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

try:
    from astro_app.backend.astrology.shadow_planets import calculate_shadow_planets, get_julian_day
    from astro_app.backend.astrology.utils import parse_timezone
except ImportError:
    # If pathing is different, try adding current dir
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__))))
    from astrology.shadow_planets import calculate_shadow_planets, get_julian_day
    from astrology.utils import parse_timezone

def test_shadow_planets():
    print("Testing shadow planets calculation...")
    
    # Sample data
    date = "25/01/1990"
    time = "10:00"
    timezone = "+05:30"
    lat = 12.9716
    lon = 77.5946
    
    try:
        jd = get_julian_day(date, time, timezone)
        tz_offset = parse_timezone(timezone)
        
        print(f"JD: {jd}, TZ: {tz_offset}")
        
        results = calculate_shadow_planets(jd, lat, lon, tz_offset)
        print("Success! Results:")
        for r in results:
            print(f"- {r['name']}: {r['degree']} in {r['sign']}")
            
    except Exception as e:
        print(f"FAILED with error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_shadow_planets()
