#!/usr/bin/env python3
"""Debug script to test KP chart calculation"""

import sys
import traceback
from astro_app.backend.astrology.kp.kp_service import KPService

# Test birth details
birth_details = {
    "date": "15/08/1990",
    "time": "10:30",
    "timezone": "+05:30",
    "latitude": 13.0827,
    "longitude": 80.2707
}

print("Testing KP Chart Calculation...")
print(f"Birth Details: {birth_details}")
print("-" * 80)

try:
    result = KPService.calculate_complete_kp_chart(birth_details)
    print("✓ SUCCESS!")
    print(f"\nKeys in result: {list(result.keys())}")
    
    if 'aspect_strengths' in result:
        print(f"\nAspect Strengths for Sun: {result['aspect_strengths'].get('Sun', {})}")
    
    if 'extended_aspects' in result:
        print(f"\nExtended Aspects keys: {list(result['extended_aspects'].keys())}")
        
except Exception as e:
    print("✗ FAILED!")
    print(f"\nError: {e}")
    print("\nFull Traceback:")
    traceback.print_exc()
    sys.exit(1)
