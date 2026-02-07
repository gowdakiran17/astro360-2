
from typing import Dict, List, Optional
from astro_app.backend.astrology.nakshatra_data import NAKSHATRA_METADATA
from astro_app.backend.astrology.utils import NAKSHATRAS, NAKSHATRA_LORDS

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
    
    # Special Rules for Cycles?
    # Usually standard meaning applies, but intensity varies.
    # Janma in 2nd cycle (10th star) = Anu Janma.
    # Janma in 3rd cycle (19th star) = Tri Janma.
    
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
    
    # Iterate 1 to 9 (Tara Types)
    for i in range(1, 10):
        tara_type = TARA_MAPPING[i]
        
        # Find stars that fall into this category
        # Logic: Star Index % 9 == i % 9
        # But indices are 0-based in list, 1-based in calculation.
        
        # Easier way: Just calculate tara for all 27 stars and group them.
        pass
        
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
        
    # Add Pada specific traits?
    # Usually Pada 1: Dharma, Pada 2: Artha, Pada 3: Kama, Pada 4: Moksha.
    purushartha = ["Dharma", "Artha", "Kama", "Moksha"][(birth_pada - 1) % 4]
    
    # Varna (Caste) based on Pada? Or Nakshatra?
    # Usually Nakshatra has a caste (Brahmin, Kshatriya, etc.)
    # We can add that to metadata later.
    
    return {
        "basic": meta,
        "pada_analysis": {
            "pada": birth_pada,
            "focus": purushartha,
            "sound": meta.get("lucky_letters", "").split(",")[birth_pada-1] if meta.get("lucky_letters") else "?"
        },
        "compatibility": {
            "most_compatible": "Trine Nakshatras (Same Lord)",
            "challenging": "Naidhana (7th star) and Vipat (3rd star)"
        }
    }
