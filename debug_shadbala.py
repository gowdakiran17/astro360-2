
import asyncio
import sys
import os
from datetime import datetime

# Add project root to path
sys.path.append(os.getcwd())

from astro_app.backend.astrology.shadbala import calculate_shadbala
from astro_app.backend.astrology.chart import calculate_chart

async def test_shadbala():
    print("Testing Shadbala Calculation...")
    
    # Mock Birth Details
    date = "01/01/2000"
    time = "12:00"
    tz = "+05:30"
    lat = 12.97
    lon = 77.59
    
    try:
        print("1. Calculating Chart (D1)...")
        d1_result = calculate_chart(date, time, tz, lat, lon)
        print("   Chart calculated.")
        
        planets_d1 = [{"name": p["name"], "longitude": p["longitude"], "speed": p.get("speed", 0)} for p in d1_result["planets"]]
        ascendant_sign_idx = int(d1_result["ascendant"]["longitude"] / 30)
        
        birth_details = {
            "date": date,
            "time": time,
            "timezone": tz,
            "latitude": lat,
            "longitude": lon
        }
        
        print("2. Calculating Shadbala...")
        shadbala = await calculate_shadbala(planets_d1, ascendant_sign_idx, birth_details)
        print("   Shadbala calculated successfully!")
        print(shadbala["summary"])
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_shadbala())
