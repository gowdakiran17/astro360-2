#!/usr/bin/env python3
"""
Analyze aspect calculation from reference app data
"""

# Reference app data (from screenshots)
ref_planet_aspects = {
    "Sun": [8],
    "Moon": [4],
    "Mars": [6, 3, 7],
    "Mercury": [8],
    "Jupiter": [10, 8, 12],
    "Venus": [6],
    "Saturn": [5, 1, 8],
    "Rahu": [5, 3, 7],
    "Ketu": [11, 9, 1]
}

# Let's figure out which house each planet is in
# by reverse engineering from the aspects

# All planets aspect 7th from their position
# So if Sun aspects 8, Sun must be in house (8 - 6) % 12 = 2

def find_planet_house_from_7th_aspect(seventh_aspect):
    """Find planet's house given its 7th house aspect"""
    # 7th house is 6 positions ahead (0-indexed)
    # So planet_house + 6 (mod 12) + 1 = seventh_aspect
    # planet_house = (seventh_aspect - 1 - 6 + 12) % 12 + 1
    return (seventh_aspect - 7 + 12) % 12 + 1

print("Reverse Engineering Planet Positions:")
print("=" * 50)

# For planets with only 7th aspect
sun_house = find_planet_house_from_7th_aspect(8)
print(f"Sun aspects 8 → Sun is in house {sun_house}")

moon_house = find_planet_house_from_7th_aspect(4)
print(f"Moon aspects 4 → Moon is in house {moon_house}")

mercury_house = find_planet_house_from_7th_aspect(8)
print(f"Mercury aspects 8 → Mercury is in house {mercury_house}")

venus_house = find_planet_house_from_7th_aspect(6)
print(f"Venus aspects 6 → Venus is in house {venus_house}")

# For Mars (aspects 4th, 7th, 8th)
# Mars aspects [6, 3, 7]
# 7th aspect should be one of these
# If Mars is in house H:
#   4th = (H + 3) % 12 + 1
#   7th = (H + 6) % 12 + 1
#   8th = (H + 7) % 12 + 1

# Let's try: if 7 is the 8th aspect
# (H + 7) % 12 + 1 = 7
# H + 7 = 6 or 18
# H = -1 or 11
# H = 11 (mod 12)
# Nope, let's try 6 as 7th aspect

mars_house = find_planet_house_from_7th_aspect(6)
print(f"\nMars aspects {ref_planet_aspects['Mars']}")
print(f"If 6 is 7th aspect → Mars is in house {mars_house}")
# Verify: 4th = (12 + 3) % 12 + 1 = 3+1 = 4? No, = (15 % 12) + 1 = 3 + 1 = 4
# Wait: (12 - 1 + 3) % 12 + 1 = 14 % 12 + 1 = 2 + 1 = 3 ✓
# 7th = (12 - 1 + 6) % 12 + 1 = 17 % 12 + 1 = 5 + 1 = 6 ✓
# 8th = (12 - 1 + 7) % 12 + 1 = 18 % 12 + 1 = 6 + 1 = 7 ✓

# For Jupiter (aspects 5th, 7th, 9th)
jupiter_house = find_planet_house_from_7th_aspect(8)
print(f"\nJupiter aspects {ref_planet_aspects['Jupiter']}")
print(f"If 8 is 7th aspect → Jupiter is in house {jupiter_house}")
# Verify: 5th = (2 - 1 + 4) % 12 + 1 = 5 % 12 + 1 = 5 + 1 = 6? No
# Let me recalculate...

print("\n" + "=" * 50)
print("Testing aspect calculation formula:")
print("=" * 50)

def calc_aspects(planet_house, offsets):
    """Calculate aspected houses given planet house and offsets"""
    aspects = []
    for offset in offsets:
        # offset is 1-indexed (4th house = offset 4)
        # We need to count offset-1 houses ahead
        aspected = ((planet_house - 1) + (offset - 1)) % 12 + 1
        aspects.append(aspected)
    return sorted(aspects)

# Test with Mars in house 12
print(f"\nMars in house 12, offsets [4, 7, 8]:")
print(f"Calculated: {calc_aspects(12, [4, 7, 8])}")
print(f"Expected: {sorted(ref_planet_aspects['Mars'])}")

# Test with Jupiter in house 2
print(f"\nJupiter in house 2, offsets [5, 7, 9]:")
print(f"Calculated: {calc_aspects(2, [5, 7, 9])}")
print(f"Expected: {sorted(ref_planet_aspects['Jupiter'])}")
