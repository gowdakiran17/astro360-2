
import sys
import os
import json

# Add project root to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

from astro_app.backend.astrology.chart import calculate_chart

def verify_outer_planets():
    print("Verifying Outer Planets Calculation...")
    
    # Test Data
    date = "01/01/2024"
    time = "12:00"
    tz = "+05:30"
    lat = 28.6139
    lon = 77.2090
    
    try:
        chart = calculate_chart(date, time, tz, lat, lon)
        planets = chart.get("planets", [])
        
        planet_names = [p["name"] for p in planets]
        print(f"Planets found: {planet_names}")
        
        outer = ["Uranus", "Neptune", "Pluto"]
        missing = [p for p in outer if p not in planet_names]
        
        if not missing:
            print("SUCCESS: All outer planets (Uranus, Neptune, Pluto) are present.")
            for p in planets:
                if p["name"] in outer:
                    print(f"  {p['name']}: {p['formatted_degree']} {p['sign']} (House {p.get('house')})")
        else:
            print(f"FAILURE: Missing outer planets: {missing}")
            
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    verify_outer_planets()
