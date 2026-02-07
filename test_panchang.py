
import asyncio
import sys
import os

# Add project root to path
sys.path.append(os.getcwd())

from astro_app.backend.routers.panchang import get_live_panchang
from astro_app.backend.schemas import PanchangRequest
from datetime import datetime, timedelta

async def test_panchang_variability():
    print("Testing Panchang Variability...")
    
    # Mock user (not needed for logic, but might be needed for dependency injection if not mocked)
    # The router uses Depends(get_current_user), so calling the function directly bypasses it if we are careful,
    # BUT get_live_panchang signature has it. We can pass None or a mock.
    
    today = datetime.now()
    tomorrow = today + timedelta(days=1)
    
    today_str = today.strftime("%d/%m/%Y")
    tomorrow_str = tomorrow.strftime("%d/%m/%Y")
    
    print(f"Today: {today_str}")
    print(f"Tomorrow: {tomorrow_str}")
    
    req_today = PanchangRequest(
        date=today_str,
        time="12:00",
        timezone="Asia/Kolkata",
        latitude=12.9716,
        longitude=77.5946
    )
    
    req_tomorrow = PanchangRequest(
        date=tomorrow_str,
        time="12:00",
        timezone="Asia/Kolkata",
        latitude=12.9716,
        longitude=77.5946
    )
    
    try:
        # Call the logic directly (bypassing FastAPI dependency injection for user)
        # We need to handle the fact that it's an async function and might depend on other things.
        # Ideally, we should call the underlying service function `calculate_panchang` or `get_live_panchang` logic.
        # But `get_live_panchang` is the controller. Let's look at what it calls.
        # It calls: get_julian_day, get_panchang_data, get_timeline_segments, get_lagna_journey
        
        from astro_app.backend.astrology.utils import get_julian_day
        from astro_app.backend.astrology.panchang import get_panchang_data
        
        # Test Today
        jd_today = get_julian_day(req_today.date, req_today.time, req_today.timezone)
        data_today = get_panchang_data(jd_today, req_today.latitude, req_today.longitude)
        
        # Test Tomorrow
        jd_tomorrow = get_julian_day(req_tomorrow.date, req_tomorrow.time, req_tomorrow.timezone)
        data_tomorrow = get_panchang_data(jd_tomorrow, req_tomorrow.latitude, req_tomorrow.longitude)
        
        print("\n--- RESULTS ---")
        print(f"Today Nakshatra: {data_today.get('nakshatra')}")
        print(f"Tmrw Nakshatra:  {data_tomorrow.get('nakshatra')}")
        
        if data_today.get('nakshatra') != data_tomorrow.get('nakshatra'):
            print("SUCCESS: Nakshatra changed!")
        else:
            # It's possible for Nakshatra to be same if it spans across the time, 
            # but usually at same time next day it should change (Moon moves ~13 deg/day, Nakshatra is 13.20 deg).
            # So it is highly likely to change, but there's a small chance it hasn't if it just started.
            # Let's check Tithi as well.
            print(f"Today Tithi: {data_today.get('tithi')}")
            print(f"Tmrw Tithi:  {data_tomorrow.get('tithi')}")
            
            if data_today.get('tithi') != data_tomorrow.get('tithi'):
                 print("SUCCESS: Tithi changed! (Nakshatra remained same, which is rare but possible)")
            else:
                 print("FAILURE: Data is identical!")

    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_panchang_variability())
