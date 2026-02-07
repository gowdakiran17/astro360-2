
from typing import Dict, List, Optional
import swisseph as swe
from datetime import datetime, timedelta
from astro_app.backend.astrology.nakshatra_data import NAKSHATRA_METADATA
from astro_app.backend.astrology.utils import NAKSHATRAS, NAKSHATRA_LORDS, normalize_degree, get_nakshatra

# Tara Bala Mapping (1-9 cycle)
TARA_MAPPING = {
    1: {"name": "Janma", "meaning": "Birth/Danger to Body", "score": 0, "quality": "Negative"},
    2: {"name": "Sampat", "meaning": "Wealth/Prosperity", "score": 1, "quality": "Positive"},
    3: {"name": "Vipat", "meaning": "Danger/Loss", "score": 0, "quality": "Negative"},
    4: {"name": "Kshema", "meaning": "Well-being/Safety", "score": 1, "quality": "Positive"},
    5: {"name": "Pratyak", "meaning": "Obstacles", "score": 0, "quality": "Negative"},
    6: {"name": "Sadhana", "meaning": "Achievement/Success", "score": 1, "quality": "Positive"},
    7: {"name": "Naidhana", "meaning": "Destruction/Death", "score": 0, "quality": "Negative"}, # Vadh
    8: {"name": "Mitra", "meaning": "Friend", "score": 1, "quality": "Positive"},
    9: {"name": "Parama Mitra", "meaning": "Best Friend", "score": 1, "quality": "Positive"}
}

def get_nakshatra_info(name: str) -> Dict:
    """Returns rich metadata for a given Nakshatra name."""
    return NAKSHATRA_METADATA.get(name, {})

def calculate_tara_bala(birth_nakshatra: str, current_nakshatra: str) -> Dict:
    """
    Calculates Tara Bala relationship between Birth Nakshatra (Janma) and another Nakshatra.
    Returns the Tara name, meaning, and beneficial status.
    """
    if birth_nakshatra not in NAKSHATRAS or current_nakshatra not in NAKSHATRAS:
        return {"error": "Invalid Nakshatra Name"}
        
    birth_idx = NAKSHATRAS.index(birth_nakshatra) + 1 # 1-based
    current_idx = NAKSHATRAS.index(current_nakshatra) + 1
    
    # Distance from Birth Nakshatra
    # If current < birth, add 27
    diff = current_idx - birth_idx
    if diff < 0:
        diff += 27
        
    # 1-based distance (count inclusive)
    count = diff + 1
    
    # Divide by 9 and take remainder
    tara_num = count % 9
    if tara_num == 0: tara_num = 9
    
    cycle = (count - 1) // 9 + 1 # 1st, 2nd, or 3rd cycle (Paryaya)
    
    tara_info = TARA_MAPPING[tara_num].copy()
    tara_info["cycle"] = cycle
    
    return tara_info

def get_navatara_chakra(birth_nakshatra: str) -> List[Dict]:
    """
    Generates the full Navatara Chakra table for the birth star.
    Groups all 27 nakshatras into the 9 Tara categories.
    """
    if birth_nakshatra not in NAKSHATRAS:
        return []
        
    chakra = []
    
    # Re-loop through all 27 stars
    for star in NAKSHATRAS:
        tara = calculate_tara_bala(birth_nakshatra, star)
        meta = NAKSHATRA_METADATA.get(star, {})
        
        chakra.append({
            "nakshatra": star,
            "lord": meta.get("lord", "Unknown"),
            "tara": tara["name"],
            "quality": tara["quality"],
            "score": tara["score"],
            "cycle": tara["cycle"]
        })
        
    return chakra

def get_detailed_analysis(birth_nakshatra: str, birth_pada: int) -> Dict:
    """
    Returns comprehensive analysis for the birth star.
    """
    meta = get_nakshatra_info(birth_nakshatra)
    if not meta:
        return {"error": "Unknown Nakshatra"}
        
    # Purushartha based on Pada
    # 1: Dharma, 2: Artha, 3: Kama, 4: Moksha
    purushartha = ["Dharma", "Artha", "Kama", "Moksha"][(birth_pada - 1) % 4]
    
    return {
        "basic": meta,
        "pada_analysis": {
            "pada": birth_pada,
            "focus": purushartha,
            "sound": meta.get("lucky_letters", "").split(",")[birth_pada-1] if meta.get("lucky_letters") and len(meta.get("lucky_letters").split(",")) >= birth_pada else "?"
        },
        "compatibility": {
            "most_compatible": "Trine Nakshatras (Same Lord)",
            "challenging": "Naidhana (7th star) and Vipat (3rd star)"
        }
    }

# --- NEW FEATURES: Unequal Nakshatras, Latta, Pravesha ---

def calculate_unequal_nakshatra(longitude: float) -> Dict:
    """
    Calculates Nakshatra based on the 28-star system (including Abhijit).
    Abhijit Span: 276°40' to 280°53'20" (approx 4°13'20").
    Uttarashada ends at 276°40'.
    Shravana starts at 280°53'20".
    """
    norm_lon = normalize_degree(longitude)
    
    # Define Abhijit range
    abhijit_start = 276.0 + (40.0/60.0) # 276.666...
    abhijit_end = 280.0 + (53.0/60.0) + (20.0/3600.0) # 280.888...
    
    if abhijit_start <= norm_lon < abhijit_end:
        return {
            "name": "Abhijit",
            "lord": "Sun", # Often associated with Sun or Brahma
            "is_unequal": True
        }
        
    # If not Abhijit, it's one of the 27, but spans might be adjusted?
    # Standard logic: If using Abhijit, it steals from U.Ashadha and Shravana.
    # U.Ashadha usually 266°40' to 280°.
    # With Abhijit: U.Ashadha ends at 276°40'.
    # Shravana usually 280° to 293°20'.
    # With Abhijit: Shravana starts at 280°53'20'.
    
    # So if between 266.66 and 276.66 -> U.Ashadha
    # If between 280.88 and 293.33 -> Shravana
    
    standard_name = get_nakshatra(norm_lon)
    
    # Check overlaps
    if standard_name == "Uttara Ashadha" and norm_lon >= abhijit_start:
        # Should have been Abhijit if logic above worked, but strictly U.Ashadha ends at 280 normally.
        # If we are here, we are < 280.
        # If >= 276.66, it is Abhijit.
        pass # Handled by first check
        
    if standard_name == "Shravana" and norm_lon < abhijit_end:
        # Should be Abhijit
        pass # Handled
        
    return {
        "name": standard_name,
        "is_unequal": False
    }

def calculate_latta(planets_data: List[Dict]) -> List[Dict]:
    """
    Calculates Latta (Kick) Aspects.
    Returns a list of kicks: {kicker: Planet, victim_star: Nakshatra, type: Forward/Backward}
    """
    # Map planets to their Nakshatra Index (0-26)
    planet_stars = {}
    for p in planets_data:
        # Calculate nak index from longitude
        idx = int(normalize_degree(p["longitude"]) / (360/27))
        planet_stars[p["name"]] = idx
        
    kicks = []
    
    # Rules (Offsets in Nakshatras)
    # Source: Phala Deepika / JHora
    # Sun: 12th Forward
    # Mars: 3rd Forward
    # Jupiter: 6th Forward
    # Saturn: 8th Forward
    # Mercury: 7th Backward
    # Venus: 5th Forward (Some sources say 5th Backward, let's use standard JHora: Venus 5th Forward? No, JHora says Venus 5th Forward? 
    # Actually most texts: Venus 5th Forward, Mercury 7th Forward? 
    # Let's use:
    # Forward: Sun(12), Mars(3), Jup(6), Sat(8)
    # Backward: Ven(5), Merc(7), Rahu(9), Moon(22)
    
    rules = [
        ("Sun", 12, "Forward"),
        ("Mars", 3, "Forward"),
        ("Jupiter", 6, "Forward"),
        ("Saturn", 8, "Forward"),
        ("Venus", 5, "Backward"),
        ("Mercury", 7, "Backward"),
        ("Rahu", 9, "Backward"),
        ("Moon", 22, "Backward")
    ]
    
    for planet, offset, direction in rules:
        if planet in planet_stars:
            start_idx = planet_stars[planet]
            if direction == "Forward":
                target_idx = (start_idx + offset - 1) % 27 # 12th star means +11 indices? No. 12th from it. 1->12. +11.
                # Usually "12th star from Sun" means Sun is 1, count to 12.
                # So if Sun is at 0, 12th is 11.
                target_idx = (start_idx + offset - 1) % 27
            else:
                target_idx = (start_idx - offset + 1) % 27
                
            kicks.append({
                "kicker": planet,
                "direction": direction,
                "offset": offset,
                "kicked_nakshatra": NAKSHATRAS[target_idx],
                "kicked_nakshatra_id": target_idx
            })
            
    return kicks

def calculate_nakshatra_pravesha(planet_name: str, current_jd: float, limit_days: int = 30) -> List[Dict]:
    """
    Calculates when a planet enters the NEXT Nakshatra.
    Uses Swiss Ephemeris.
    """
    # 1. Get current planet position
    swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
    
    planet_map = {
        "Sun": swe.SUN, "Moon": swe.MOON, "Mars": swe.MARS, 
        "Mercury": swe.MERCURY, "Jupiter": swe.JUPITER, 
        "Venus": swe.VENUS, "Saturn": swe.SATURN, "Rahu": swe.MEAN_NODE # Or TRUE_NODE
    }
    
    if planet_name not in planet_map:
        return []
        
    plist = planet_map[planet_name]
    flags = swe.FLG_SWIEPH | swe.FLG_SIDEREAL
    
    # Current Pos
    res = swe.calc_ut(current_jd, plist, flags)
    current_lon = res[0][0]
    
    nak_span = 360.0 / 27.0
    current_nak_idx = int(current_lon / nak_span)
    next_boundary = (current_nak_idx + 1) * nak_span
    
    # Search for crossing
    # Simple iterative search (coarse then fine)
    # Step: 1 day for slow planets, 1 hour for Moon
    
    step = 1.0 # days
    if planet_name == "Moon": step = 1.0/24.0
    
    t = current_jd
    limit = current_jd + limit_days
    
    entries = []
    
    # Find next crossing
    while t < limit:
        t += step
        res = swe.calc_ut(t, plist, flags)
        lon = res[0][0]
        
        if lon >= next_boundary or (lon < 10 and next_boundary >= 360): # Handle 360 crossing
            # Crossed!
            # Refine time (Binary search)
            left = t - step
            right = t
            for _ in range(10): # 10 iterations -> very precise
                mid = (left + right) / 2
                res_mid = swe.calc_ut(mid, plist, flags)
                lon_mid = res_mid[0][0]
                if lon_mid >= next_boundary or (lon_mid < 10 and next_boundary >= 360):
                    right = mid
                else:
                    left = mid
            
            entry_time = right
            
            # Convert JD to Date
            y, m, d, h = swe.revjul(entry_time)
            dt_str = f"{y}-{m:02d}-{d:02d} {int(h):02d}:{int((h-int(h))*60):02d}"
            
            next_nak_idx = (current_nak_idx + 1) % 27
            entries.append({
                "planet": planet_name,
                "entering_nakshatra": NAKSHATRAS[next_nak_idx],
                "entry_time": dt_str,
                "julian_day": entry_time
            })
            
            # Update for next loop
            current_nak_idx = next_nak_idx
            next_boundary = (current_nak_idx + 1) * nak_span
            if next_boundary > 360: next_boundary -= 360 # Usually 360 is limit
            
            # Stop after 1 entry for now
            break
            
    return entries
