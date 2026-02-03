#!/usr/bin/env python3
"""
Test different aspect calculation formulas
"""

def method1(planet_house, offset):
    """Current method: (house - 1 + offset - 1) % 12 + 1"""
    return ((planet_house - 1) + (offset - 1)) % 12 + 1

def method2(planet_house, offset):
    """Alternative: (house + offset - 1) % 12 + 1"""
    return (planet_house + offset - 1) % 12 + 1

def method3(planet_house, offset):
    """Alternative: (house - 1 + offset) % 12 + 1"""
    return ((planet_house - 1) + offset) % 12 + 1

# Test data from reference app
test_cases = [
    ("Jupiter", 2, 5, 10),   # Jupiter in house 2, 5th aspect should be 10? No, expected is 6
    ("Jupiter", 2, 7, 8),    # Jupiter in house 2, 7th aspect should be 8
    ("Jupiter", 2, 9, 12),   # Jupiter in house 2, 9th aspect should be 12? No, expected is 10
]

# Wait, let me recalculate Jupiter's expected aspects
# Jupiter aspects [10, 8, 12] from reference
# If Jupiter is in house 2:
# 5th from 2 = house 6
# 7th from 2 = house 8
# 9th from 2 = house 10

# But reference shows [10, 8, 12]
# So maybe Jupiter is NOT in house 2?

# Let me try all houses for Jupiter
print("Finding Jupiter's house:")
print("=" * 50)

expected_jupiter = [8, 10, 12]

for house in range(1, 13):
    aspects_m1 = sorted([method1(house, o) for o in [5, 7, 9]])
    aspects_m2 = sorted([method2(house, o) for o in [5, 7, 9]])
    aspects_m3 = sorted([method3(house, o) for o in [5, 7, 9]])
    
    if aspects_m1 == expected_jupiter:
        print(f"✓ Method 1: Jupiter in house {house} → {aspects_m1}")
    if aspects_m2 == expected_jupiter:
        print(f"✓ Method 2: Jupiter in house {house} → {aspects_m2}")
    if aspects_m3 == expected_jupiter:
        print(f"✓ Method 3: Jupiter in house {house} → {aspects_m3}")

print("\nFinding Mars's house:")
print("=" * 50)

expected_mars = [3, 6, 7]

for house in range(1, 13):
    aspects_m1 = sorted([method1(house, o) for o in [4, 7, 8]])
    aspects_m2 = sorted([method2(house, o) for o in [4, 7, 8]])
    aspects_m3 = sorted([method3(house, o) for o in [4, 7, 8]])
    
    if aspects_m1 == expected_mars:
        print(f"✓ Method 1: Mars in house {house} → {aspects_m1}")
    if aspects_m2 == expected_mars:
        print(f"✓ Method 2: Mars in house {house} → {aspects_m2}")
    if aspects_m3 == expected_mars:
        print(f"✓ Method 3: Mars in house {house} → {aspects_m3}")

print("\nFinding Saturn's house:")
print("=" * 50)

expected_saturn = [1, 5, 8]

for house in range(1, 13):
    aspects_m1 = sorted([method1(house, o) for o in [3, 7, 10]])
    aspects_m2 = sorted([method2(house, o) for o in [3, 7, 10]])
    aspects_m3 = sorted([method3(house, o) for o in [3, 7, 10]])
    
    if aspects_m1 == expected_saturn:
        print(f"✓ Method 1: Saturn in house {house} → {aspects_m1}")
    if aspects_m2 == expected_saturn:
        print(f"✓ Method 2: Saturn in house {house} → {aspects_m2}")
    if aspects_m3 == expected_saturn:
        print(f"✓ Method 3: Saturn in house {house} → {aspects_m3}")
