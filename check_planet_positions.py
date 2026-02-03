#!/usr/bin/env python3
"""Check actual planet positions from our KP calculation"""

import sys
from astro_app.backend.astrology.kp.kp_service import KPService

birth_details = {
    "date": "15/08/1990",
    "time": "10:30",
    "timezone": "+05:30",
    "latitude": 13.0827,
    "longitude": 80.2707
}

result = KPService.calculate_complete_kp_chart(birth_details)

print("Planet Positions:")
print("=" * 50)
for p in result['planets']:
    print(f"{p['planet']:10s} in House {p['house']}")

print("\n" + "=" * 50)
print("Testing aspect calculation with Method 2:")
print("=" * 50)

def calc_aspect_method2(planet_house, offset):
    """(house + offset - 1) % 12 + 1"""
    return (planet_house + offset - 1) % 12 + 1

aspect_rules = {
    "Sun": [7], "Moon": [7], "Mercury": [7], "Venus": [7],
    "Mars": [4, 7, 8],
    "Jupiter": [5, 7, 9],
    "Saturn": [3, 7, 10],
    "Rahu": [5, 7, 9], "Ketu": [5, 7, 9]
}

for p in result['planets']:
    p_name = p['planet']
    p_house = p['house']
    offsets = aspect_rules.get(p_name, [7])
    
    aspects = sorted([calc_aspect_method2(p_house, o) for o in offsets])
    print(f"{p_name:10s} (House {p_house:2d}) aspects: {aspects}")
