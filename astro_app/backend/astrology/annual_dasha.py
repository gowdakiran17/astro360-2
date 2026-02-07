
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from astro_app.backend.astrology.utils import normalize_degree, get_nakshatra_details, NAKSHATRA_LORDS

# Standard Vimshottari Years (Total 120)
VIMSHOTTARI_YEARS = {
    "Sun": 6, "Moon": 10, "Mars": 7, "Rahu": 18, "Jupiter": 16,
    "Saturn": 19, "Mercury": 17, "Ketu": 7, "Venus": 20
}

# Mudda Dasha (120 years = 360 days)
# Factor = 3 (Days per Year of Vimshottari)
MUDDA_DAYS = {k: v * 3 for k, v in VIMSHOTTARI_YEARS.items()}

def calculate_mudda_dasha(
    moon_longitude: float, 
    start_date: str, # "YYYY-MM-DD"
    years_to_calculate: int = 1
) -> List[Dict]:
    """
    Calculates Mudda Dasha for an Annual Chart (Varshphal).
    Period is 1 year (360 days).
    """
    # 1. Calculate Balance Dasha
    # Similar to Vimshottari but scale is 1 year
    
    nak_span = 360.0 / 27.0
    nak_idx = int(moon_longitude / nak_span)
    fraction_passed = (moon_longitude % nak_span) / nak_span
    
    lord = NAKSHATRA_LORDS[nak_idx % 27]
    total_days = MUDDA_DAYS[lord]
    balance_days = total_days * (1.0 - fraction_passed)
    
    # 2. Generate Sequence
    # Sequence is fixed: Sun -> Moon -> Mars -> Rahu -> Jup -> Sat -> Merc -> Ketu -> Ven
    lords_sequence = ["Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury", "Ketu", "Venus"]
    
    # Find start index
    start_idx = lords_sequence.index(lord)
    
    current_date = datetime.strptime(start_date, "%Y-%m-%d") if isinstance(start_date, str) else start_date
    if isinstance(current_date, str):
         # If parsing failed or input was weird
         current_date = datetime.now()

    dasha_list = []
    
    # First Dasha (Balance)
    end_date = current_date + timedelta(days=balance_days)
    dasha_list.append({
        "lord": lord,
        "start": current_date.strftime("%Y-%m-%d"),
        "end": end_date.strftime("%Y-%m-%d"),
        "duration_days": round(balance_days, 2),
        "is_balance": True
    })
    
    current_date = end_date
    
    # Next Dashas
    for i in range(1, 9 * years_to_calculate): # Loop enough times
        idx = (start_idx + i) % 9
        next_lord = lords_sequence[idx]
        duration = MUDDA_DAYS[next_lord]
        
        end_date = current_date + timedelta(days=duration)
        
        dasha_list.append({
            "lord": next_lord,
            "start": current_date.strftime("%Y-%m-%d"),
            "end": end_date.strftime("%Y-%m-%d"),
            "duration_days": duration
        })
        
        current_date = end_date
        
        # Stop if we exceeded 1 year significantly?
        # Usually Mudda is just for that year.
        if i >= 9: break 
        
    return dasha_list

def calculate_patyayini_dasha(
    planets: List[Dict], # [{"name": "Sun", "longitude": 123.4}, ...]
    ascendant_lon: float
) -> List[Dict]:
    """
    Calculates Patyayini Dasha (Tajaka System).
    Based on sorting planets by longitude (Krishnamurti method).
    """
    # 1. Filter relevant bodies (7 planets + Asc)
    relevant = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
    
    items = []
    
    # Add Planets
    for p in planets:
        if p["name"] in relevant:
            items.append({"name": p["name"], "longitude": normalize_degree(p["longitude"])})
            
    # Add Ascendant
    items.append({"name": "Ascendant", "longitude": normalize_degree(ascendant_lon)})
    
    # 2. Sort by Longitude
    items.sort(key=lambda x: x["longitude"])
    
    # 3. Calculate Periods (Difference between consecutive)
    # The period of a planet is the difference between its longitude and the NEXT body's longitude.
    # Scaled to 365 days? Or just degrees?
    # Usually Patyayini is "Years" = Degrees. 360 degrees = 1 year?
    # Yes, typically used for the year.
    
    dasha_list = []
    total_days = 365.25 # Annual
    
    for i in range(len(items)):
        current = items[i]
        next_item = items[(i + 1) % len(items)]
        
        diff = next_item["longitude"] - current["longitude"]
        if diff < 0: diff += 360
        
        # Fraction of circle
        duration_days = (diff / 360.0) * total_days
        
        dasha_list.append({
            "lord": current["name"],
            "longitude": round(current["longitude"], 2),
            "span_degrees": round(diff, 2),
            "duration_days": round(duration_days, 1)
        })
        
    return dasha_list
