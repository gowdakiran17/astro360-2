
from typing import List, Dict, Any
from astro_app.backend.astrology.utils import normalize_degree, get_nakshatra_details

# Yogini Dasha System
# Total Cycle: 36 Years
# Order: Mangala (1), Pingala (2), Dhanya (3), Bhramari (4), Bhadrika (5), Ulka (6), Siddha (7), Sankata (8)
# Lords: Moon, Sun, Jupiter, Mars, Mercury, Saturn, Venus, Rahu/Ketu
# Starting Nakshatra: Ashwini starts with Mangala.
# Actually, the starting Yogini is determined by: (Nakshatra Index + 3) % 8 ?
# Or: Nakshatra Number (1-27).
# Formula: (Nakshatra Number + 3) % 8.
# If Remainder 1 -> Mangala, 2 -> Pingala... 0 -> Sankata.

YOGINI_ORDER = [
    {"name": "Mangala", "lord": "Moon", "years": 1},
    {"name": "Pingala", "lord": "Sun", "years": 2},
    {"name": "Dhanya", "lord": "Jupiter", "years": 3},
    {"name": "Bhramari", "lord": "Mars", "years": 4},
    {"name": "Bhadrika", "lord": "Mercury", "years": 5},
    {"name": "Ulka", "lord": "Saturn", "years": 6},
    {"name": "Siddha", "lord": "Venus", "years": 7},
    {"name": "Sankata", "lord": "Rahu", "years": 8}
]

def calculate_yogini_dasha(moon_longitude: float, birth_date_year: float) -> List[Dict]:
    """
    Calculates Yogini Dasha periods.
    birth_date_year: Decimal year of birth (e.g. 1990.54)
    """
    # 1. Determine Nakshatra and Balance
    nak_info = get_nakshatra_details(moon_longitude)
    nak_name = nak_info["name"]
    # We need start/end longitudes to calculate balance.
    # get_nakshatra_details returns index.
    # Each nakshatra is 13.3333 degrees.
    nak_idx = nak_info["index"]
    nak_start_lon = nak_idx * (360.0 / 27.0)
    nak_end_lon = (nak_idx + 1) * (360.0 / 27.0)
    
    # Nakshatra Number (1-27)
    nak_num = nak_idx + 1
    
    # 2. Determine Starting Yogini
    # Formula: (Nakshatra Num + 3) % 8
    # If 0, it means 8 (Sankata)
    start_yogini_val = (nak_num + 3) % 8
    if start_yogini_val == 0: start_yogini_val = 8
    
    # Index in our list (0-7)
    start_yogini_idx = start_yogini_val - 1
    start_yogini = YOGINI_ORDER[start_yogini_idx]
    
    # 3. Calculate Balance of Dasha at Birth
    # Degrees traversed in Nakshatra
    degrees_passed = moon_longitude - nak_start_lon
    total_span = 13 + 20/60.0 # 13.3333
    
    fraction_passed = degrees_passed / total_span
    fraction_remaining = 1.0 - fraction_passed
    
    balance_years = start_yogini["years"] * fraction_remaining
    
    # 4. Generate Dasha Sequence
    dashas = []
    current_year = birth_date_year
    
    # First Dasha (Balance)
    dashas.append({
        "dasha": start_yogini["name"],
        "lord": start_yogini["lord"],
        "start_year": round(current_year, 2),
        "end_year": round(current_year + balance_years, 2),
        "duration": round(balance_years, 2),
        "is_balance": True
    })
    
    current_year += balance_years
    
    # Next Dashas (Full Cycles)
    # Generate for ~100 years
    target_year = birth_date_year + 100
    curr_idx = (start_yogini_idx + 1) % 8
    
    while current_year < target_year:
        yogini = YOGINI_ORDER[curr_idx]
        duration = yogini["years"]
        
        dashas.append({
            "dasha": yogini["name"],
            "lord": yogini["lord"],
            "start_year": round(current_year, 2),
            "end_year": round(current_year + duration, 2),
            "duration": duration,
            "is_balance": False
        })
        
        current_year += duration
        curr_idx = (curr_idx + 1) % 8
        
    return dashas
