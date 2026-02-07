
from typing import List, Dict, Any
from astro_app.backend.astrology.utils import get_zodiac_sign

def calculate_all_avasthas(name: str, lon: float) -> Dict:
    """
    Calculates Avasthas for a single planet.
    1. Baladi Avasthas (Age): Infant, Youth, etc.
    2. Jagradadi Avasthas (Consciousness): Awake, Dreaming, Sleeping.
    """
    sign_idx = int(lon / 30)
    deg = lon % 30
    
    # 1. Baladi Avastha (5 States based on 6-degree chunks)
    # Order depends on Odd/Even sign
    # Odd Signs: 1(Ari), 3(Gem), 5(Leo), 7(Lib), 9(Sag), 11(Aqu)
    # Sign Index (0-based): 0, 2, 4, 6, 8, 10 -> Even Index = Odd Sign
    is_odd = (sign_idx % 2) == 0 
    
    state_idx = int(deg / 6) # 0 to 4
    if state_idx > 4: state_idx = 4 # Handle 30.0 edge case
    
    states = ["Bala (Infant)", "Kumara (Youth)", "Yuva (Adult)", "Vriddha (Old)", "Mrita (Dead)"]
    
    if not is_odd:
        # Reverse order for Even signs
        state_idx = 4 - state_idx
        
    baladi = states[state_idx]
    
    # 2. Jagradadi Avastha (3 States)
    # Odd Signs: 0-10 Awake, 10-20 Dreaming, 20-30 Sleeping
    # Even Signs: Reverse
    
    j_states = ["Jagrat (Awake)", "Swapna (Dreaming)", "Sushupti (Sleeping)"]
    j_idx = int(deg / 10) # 0 to 2
    if j_idx > 2: j_idx = 2
    
    if not is_odd:
        j_idx = 2 - j_idx
        
    jagradadi = j_states[j_idx]
    
    return {
        "baladi": baladi,
        "jagradadi": jagradadi
    }

def calculate_avasthas(planets: List[Dict]) -> Dict:
    """
    Calculates Planetary States (Avasthas) for a list of planets.
    """
    results = {}
    for p in planets:
        results[p["name"]] = calculate_all_avasthas(p["name"], p["longitude"])
    return results
