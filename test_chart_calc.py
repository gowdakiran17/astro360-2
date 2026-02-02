import sys
import os
from datetime import datetime
import time

# Add backend to path
sys.path.append(os.getcwd())

try:
    print("Importing calculate_chart...")
    from astro_app.backend.astrology.chart import calculate_chart
    print("Import successful.")

    print("Importing generate_d1_chart_html...")
    from astro_app.backend.routers.ai_insight import generate_d1_chart_html
    print("Import successful.")

    # Test data
    date_str = "17/04/1990"
    time_str = "05:03"
    timezone = "+05:30"
    lat = 13.0
    lon = 77.9
    
    print(f"Calculating chart for {date_str} {time_str}, Lat: {lat}, Lon: {lon}...")
    start_time = time.time()
    chart_result = calculate_chart(
        date_str,
        time_str,
        timezone,
        lat,
        lon
    )
    end_time = time.time()
    print(f"Calculation took {end_time - start_time:.4f} seconds.")
    
    print("Chart data keys:", chart_result.keys())
    
    print("Generating HTML...")
    html = generate_d1_chart_html(chart_result, "Test User")
    print("HTML length:", len(html))
    print("Success!")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
