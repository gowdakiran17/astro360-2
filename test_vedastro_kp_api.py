#!/usr/bin/env python3
"""
Test VedAstro KP API integration
"""

import sys
import json
from astro_app.backend.services.vedastro_kp_service import VedAstroKPService

# Test birth details
birth_details = {
    "date": "15/08/1990",
    "time": "10:30",
    "timezone": "+05:30",
    "latitude": 13.0827,
    "longitude": 80.2707
}

print("Testing VedAstro KP API Integration")
print("=" * 80)
print(f"Birth Details: {birth_details}")
print("=" * 80)

# Test 1: Get All Planet Data
print("\n1. Testing AllPlanetData API...")
planet_data = VedAstroKPService.get_all_planet_data(birth_details)
if planet_data:
    print("✓ Successfully retrieved planet data")
    print(f"   Keys: {list(planet_data.keys())[:10]}...")  # Show first 10 keys
    
    # Save to file for inspection
    with open('/tmp/vedastro_planet_data.json', 'w') as f:
        json.dump(planet_data, f, indent=2)
    print("   Saved to /tmp/vedastro_planet_data.json")
else:
    print("✗ Failed to retrieve planet data")

# Test 2: Get All House Data
print("\n2. Testing AllHouseData API...")
house_data = VedAstroKPService.get_all_house_data(birth_details)
if house_data:
    print("✓ Successfully retrieved house data")
    print(f"   Keys: {list(house_data.keys())[:10]}...")
    
    # Save to file for inspection
    with open('/tmp/vedastro_house_data.json', 'w') as f:
        json.dump(house_data, f, indent=2)
    print("   Saved to /tmp/vedastro_house_data.json")
else:
    print("✗ Failed to retrieve house data")

# Test 3: Calculate Complete KP Chart
print("\n3. Testing Complete KP Chart Calculation...")
try:
    kp_chart = VedAstroKPService.calculate_kp_chart_vedastro(birth_details)
    if kp_chart:
        print("✓ Successfully calculated KP chart")
        print(f"\n   Planets ({len(kp_chart.get('planets', []))}):")
        for p in kp_chart.get('planets', [])[:3]:  # Show first 3
            print(f"      {p.get('planet')}: {p.get('sign')} - Star Lord: {p.get('star_lord')}, Sub Lord: {p.get('sub_lord')}")
        
        print(f"\n   Houses ({len(kp_chart.get('house_cusps', []))}):")
        for h in kp_chart.get('house_cusps', [])[:3]:  # Show first 3
            print(f"      House {h.get('house')}: {h.get('sign')} - Star Lord: {h.get('star_lord')}, Sub Lord: {h.get('sub_lord')}")
        
        # Save complete chart
        with open('/tmp/vedastro_kp_chart.json', 'w') as f:
            json.dump(kp_chart, f, indent=2)
        print("\n   Saved complete chart to /tmp/vedastro_kp_chart.json")
    else:
        print("✗ Failed to calculate KP chart")
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 80)
print("Test Complete")
