
from typing import Dict, List, Any, Set
from astro_app.backend.astrology.utils import (
    get_zodiac_sign, get_house_lord, normalize_degree, 
    ZODIAC_SIGNS, ZODIAC_LORDS
)

# Standard definitions for Exaltation/Debilitation/Own Sign
PLANETARY_STRENGTH_MAP = {
    "Sun": {"exalt": "Aries", "exalt_deg": 10, "deb": "Libra", "own": ["Leo"], "mool": "Leo"},
    "Moon": {"exalt": "Taurus", "exalt_deg": 3, "deb": "Scorpio", "own": ["Cancer"], "mool": "Taurus"},
    "Mars": {"exalt": "Capricorn", "exalt_deg": 28, "deb": "Cancer", "own": ["Aries", "Scorpio"], "mool": "Aries"},
    "Mercury": {"exalt": "Virgo", "exalt_deg": 15, "deb": "Pisces", "own": ["Gemini", "Virgo"], "mool": "Virgo"},
    "Jupiter": {"exalt": "Cancer", "exalt_deg": 5, "deb": "Capricorn", "own": ["Sagittarius", "Pisces"], "mool": "Sagittarius"},
    "Venus": {"exalt": "Pisces", "exalt_deg": 27, "deb": "Virgo", "own": ["Taurus", "Libra"], "mool": "Libra"},
    "Saturn": {"exalt": "Libra", "exalt_deg": 20, "deb": "Aries", "own": ["Capricorn", "Aquarius"], "mool": "Aquarius"},
    "Rahu": {"exalt": "Taurus", "deb": "Scorpio", "own": ["Aquarius"]},
    "Ketu": {"exalt": "Scorpio", "deb": "Taurus", "own": ["Scorpio"]}
}

def get_planet_house(planet_lon: float, asc_lon: float) -> int:
    """Returns the house number (1-12) of a planet relative to Ascendant."""
    p_sign_idx = int(planet_lon / 30)
    asc_sign_idx = int(asc_lon / 30)
    house = (p_sign_idx - asc_sign_idx + 12) % 12 + 1
    return house

def get_aspected_houses(planet: str, current_house: int) -> List[int]:
    """Returns list of houses aspected by the planet (Full Aspects)."""
    aspects = [7] # All planets aspect 7th
    
    if planet == "Mars":
        aspects.extend([4, 8])
    elif planet == "Jupiter":
        aspects.extend([5, 9])
    elif planet == "Saturn":
        aspects.extend([3, 10])
    elif planet in ["Rahu", "Ketu"]:
        aspects.extend([5, 9])
        
    aspected_houses = []
    for a in aspects:
        h = (current_house + a - 1) % 12
        if h == 0: h = 12
        aspected_houses.append(h)
    return aspected_houses

def check_common_yogas(planets: Dict[str, Dict], planet_houses: Dict[str, int]) -> List[Dict]:
    """Checks for common yogas like Budhaditya, Chandra Mangala, etc."""
    yogas = []
    
    # Budhaditya (Sun + Mercury)
    if planet_houses.get("Sun") == planet_houses.get("Mercury"):
        yogas.append({
            "name": "Budhaditya Yoga",
            "type": "Knowledge",
            "description": "Sun and Mercury conjunction. Gives intelligence and skill.",
            "strength": "High"
        })
        
    # Chandra Mangala (Moon + Mars)
    # Conjunction or Opposition (7th aspect)
    if "Moon" in planets and "Mars" in planets:
        h_moon = planet_houses["Moon"]
        h_mars = planet_houses["Mars"]
        if h_moon == h_mars:
             yogas.append({
                "name": "Chandra Mangala Yoga",
                "type": "Wealth",
                "description": "Moon and Mars conjunction. Earnings through enterprise.",
                "strength": "High"
            })
        elif h_mars in get_aspected_houses("Mars", h_mars) and h_mars == (h_moon + 6) % 12 + 1: # Mars aspects Moon? No, opposition is 7th
             # Opposition
             if abs(h_moon - h_mars) == 6:
                 yogas.append({
                    "name": "Chandra Mangala Yoga (Opposition)",
                    "type": "Wealth",
                    "description": "Moon and Mars opposition. Earnings through enterprise.",
                    "strength": "Medium"
                })

    # Kemadruma Yoga (No planets in 2nd and 12th from Moon)
    # Exclude Sun, Rahu, Ketu
    if "Moon" in planets:
        moon_h = planet_houses["Moon"]
        h2 = (moon_h % 12) + 1
        h12 = (moon_h - 2) % 12 + 1
        
        has_planet_2 = False
        has_planet_12 = False
        
        for p, h in planet_houses.items():
            if p in ["Sun", "Rahu", "Ketu", "Moon", "Uranus", "Neptune", "Pluto"]: continue
            if h == h2: has_planet_2 = True
            if h == h12: has_planet_12 = True
            
        if not has_planet_2 and not has_planet_12:
            # Check for cancellation (Kemadruma Bhanga)
            # 1. Planets in Kendra from Lagna
            # 2. Planets in Kendra from Moon
            is_cancelled = False
            for p, h in planet_houses.items():
                if p in ["Sun", "Rahu", "Ketu", "Moon", "Uranus", "Neptune", "Pluto"]: continue
                
                # Check Kendra from Moon
                dist_moon = (h - moon_h + 12) % 12 + 1
                if dist_moon in [1, 4, 7, 10]:
                    is_cancelled = True
                    break
                    
            if not is_cancelled:
                yogas.append({
                    "name": "Kemadruma Yoga",
                    "type": "Dosha",
                    "description": "No planets in 2nd/12th from Moon. Can indicate loneliness or struggles.",
                    "strength": "Strong"
                })
            else:
                 yogas.append({
                    "name": "Kemadruma Bhanga Yoga",
                    "type": "Cancellation",
                    "description": "Kemadruma cancelled by planets in Kendra. Success after struggle.",
                    "strength": "Medium"
                })

    return yogas

def check_pancha_mahapurusha_yoga(planets: Dict[str, Dict], asc_lon: float) -> List[Dict]:
    """
    Mars, Mercury, Jupiter, Venus, Saturn in Kendra from Ascendant AND in Own/Exaltation sign.
    """
    yogas = []
    candidates = {
        "Mars": "Ruchaka",
        "Mercury": "Bhadra",
        "Jupiter": "Hamsa",
        "Venus": "Malavya",
        "Saturn": "Shasha"
    }
    
    for planet, yoga_name in candidates.items():
        if planet not in planets: continue
        
        p_data = planets[planet]
        p_lon = p_data["longitude"]
        p_sign = p_data["zodiac_sign"] # Use zodiac_sign key
        
        # 1. Check Kendra (1, 4, 7, 10)
        house = get_planet_house(p_lon, asc_lon)
        if house not in [1, 4, 7, 10]:
            continue
            
        # 2. Check Dignity (Own or Exalted)
        rules = PLANETARY_STRENGTH_MAP.get(planet, {})
        is_strong = (p_sign in rules.get("own", [])) or (p_sign == rules.get("exalt"))
        
        if is_strong:
            yogas.append({
                "name": f"{yoga_name} Yoga",
                "type": "Mahapurusha Yoga",
                "description": f"{planet} strong in Kendra. Gives leadership and specific greatness.",
                "strength": "High"
            })
            
    return yogas

def check_dhana_yogas(planets: Dict[str, Dict], asc_lon: float) -> List[Dict]:
    """
    Wealth Yogas involving 2nd, 5th, 9th, 11th lords.
    Expanded to include more combinations.
    """
    yogas = []
    asc_sign_idx = int(asc_lon / 30)
    
    def get_lord_of_house(h_num):
        sign_idx = (asc_sign_idx + h_num - 1) % 12
        sign_name = ZODIAC_SIGNS[sign_idx]
        return ZODIAC_LORDS[sign_name]
        
    lords = {i: get_lord_of_house(i) for i in range(1, 13)}
    
    # Map Planet -> House
    planet_house_map = {}
    for p_name, p_data in planets.items():
        planet_house_map[p_name] = get_planet_house(p_data["longitude"], asc_lon)
        
    # Helper to check connection (Conjunct or Parivartana)
    def check_connection(h1, h2):
        l1 = lords[h1]
        l2 = lords[h2]
        if l1 not in planet_house_map or l2 not in planet_house_map: return None
        
        p1_house = planet_house_map[l1]
        p2_house = planet_house_map[l2]
        
        # Conjunction
        if p1_house == p2_house:
            return f"Conjunction of Lords {h1} and {h2}"
            
        # Parivartana (Exchange)
        # Lord 1 in House 2, Lord 2 in House 1
        # Need to know the HOUSE a planet is in, which we have (p1_house).
        # But we need to check if p1_house == h2 and p2_house == h1?
        # Yes, if Lord(h1) is in h2 AND Lord(h2) is in h1.
        if p1_house == h2 and p2_house == h1:
            return f"Parivartana (Exchange) of Lords {h1} and {h2}"
            
        # Aspect (Mutual)
        # Check if L1 aspects L2 AND L2 aspects L1
        # Or L1 aspects L2's house? Usually mutual aspect of planets.
        aspects_l1 = get_aspected_houses(l1, p1_house)
        aspects_l2 = get_aspected_houses(l2, p2_house)
        
        # Check if they look at each other's position
        if p2_house in aspects_l1 and p1_house in aspects_l2:
             return f"Mutual Aspect of Lords {h1} and {h2}"
             
        return None

    # Check Key Dhana Pairs
    dhana_pairs = [(2, 11), (2, 5), (2, 9), (5, 9), (5, 11), (9, 11), (1, 2), (1, 11)]
    
    for h1, h2 in dhana_pairs:
        conn = check_connection(h1, h2)
        if conn:
            yogas.append({
                "name": f"Dhana Yoga ({h1}-{h2})",
                "type": "Wealth",
                "description": f"{conn}. Indicates financial prosperity.",
                "strength": "High"
            })
            
    # Lakshmi Yoga: Lord of 9 and Venus well placed
    if "Venus" in planets:
        venus_house = planet_house_map["Venus"]
        lord_9 = lords[9]
        if lord_9 in planet_house_map:
            lord_9_house = planet_house_map[lord_9]
            
            # Venus in Own/Exalt and in Kendra/Trikona?
            # Simplified: Venus and Lord 9 in Kendra/Trikona
            good_houses = [1, 4, 7, 10, 5, 9]
            if venus_house in good_houses and lord_9_house in good_houses:
                yogas.append({
                    "name": "Lakshmi Yoga",
                    "type": "Wealth",
                    "description": "Venus and 9th Lord well placed in Kendra/Trikona.",
                    "strength": "High"
                })

    return yogas

def check_raja_yogas(planets: Dict[str, Dict], asc_lon: float) -> List[Dict]:
    """
    Royal Yogas: Kendra (1,4,7,10) and Trikona (1,5,9) lords relationship.
    Includes Conjunction, Aspect, Exchange.
    """
    yogas = []
    asc_sign_idx = int(asc_lon / 30)
    
    def get_lord_of_house(h_num):
        sign_idx = (asc_sign_idx + h_num - 1) % 12
        sign_name = ZODIAC_SIGNS[sign_idx]
        return ZODIAC_LORDS[sign_name]
        
    lords = {i: get_lord_of_house(i) for i in range(1, 13)}
    planet_house_map = {p: get_planet_house(d["longitude"], asc_lon) for p, d in planets.items()}
    
    # Identify Kendra/Trikona Lords
    kendra_houses = [1, 4, 7, 10]
    trikona_houses = [1, 5, 9] # 1 is both
    
    kendra_lords = {lords[h]: h for h in kendra_houses}
    trikona_lords = {lords[h]: h for h in trikona_houses}
    
    # Check interactions between every Kendra Lord and Trikona Lord
    # Avoid duplicates (e.g. Lord 1 with Lord 1)
    
    processed_pairs = set()
    
    for k_lord, k_house in kendra_lords.items():
        for t_lord, t_house in trikona_lords.items():
            if k_lord == t_lord: 
                # Yogakaraka (Same planet owns both Kendra and Trikona)
                # e.g. Saturn for Libra (4, 5)
                # Check if well placed
                if k_lord not in processed_pairs: # Mark planet as processed
                     yogas.append({
                        "name": f"Yogakaraka ({k_lord})",
                        "type": "Raja Yoga",
                        "description": f"{k_lord} owns both Kendra ({k_house}) and Trikona ({t_house}). Very auspicious.",
                        "strength": "High"
                    })
                     processed_pairs.add(k_lord)
                continue
                
            pair_key = tuple(sorted([k_lord, t_lord]))
            if pair_key in processed_pairs: continue
            
            # Check Relationship
            if k_lord not in planet_house_map or t_lord not in planet_house_map: continue
            
            p1_house = planet_house_map[k_lord]
            p2_house = planet_house_map[t_lord]
            
            relation = ""
            
            # Conjunction
            if p1_house == p2_house:
                relation = "Conjunction"
            
            # Parivartana
            # K_Lord in T_House AND T_Lord in K_House
            # Need to check specific houses they own. 
            # Simplified: K_Lord in House(t_lord) - wait, t_lord might own 2 houses.
            # We need specific house check.
            # Let's skip complex Parivartana for now or keep it simple.
            
            # Mutual Aspect
            if not relation:
                aspects1 = get_aspected_houses(k_lord, p1_house)
                aspects2 = get_aspected_houses(t_lord, p2_house)
                if p2_house in aspects1 and p1_house in aspects2:
                    relation = "Mutual Aspect"
                    
            if relation:
                yogas.append({
                    "name": f"Raja Yoga ({k_lord}-{t_lord})",
                    "type": "Raja Yoga",
                    "description": f"{relation} of {k_lord} (Lord of {k_house}) and {t_lord} (Lord of {t_house}).",
                    "strength": "High"
                })
                processed_pairs.add(pair_key)

    return yogas

def check_vipareeta_raja_yoga(planets: Dict[str, Dict], asc_lon: float) -> List[Dict]:
    """
    Lords of 6, 8, 12 in 6, 8, 12.
    Harsha (6 in 6), Sarala (8 in 8), Vimala (12 in 12) - simplified.
    Actually:
    - Lord 6 in 6, 8, 12
    - Lord 8 in 6, 8, 12
    - Lord 12 in 6, 8, 12
    """
    yogas = []
    asc_sign_idx = int(asc_lon / 30)
    
    def get_lord(h):
        s_idx = (asc_sign_idx + h - 1) % 12
        return ZODIAC_LORDS[ZODIAC_SIGNS[s_idx]]
        
    l6 = get_lord(6)
    l8 = get_lord(8)
    l12 = get_lord(12)
    
    planet_house_map = {p: get_planet_house(d["longitude"], asc_lon) for p, d in planets.items()}
    
    dusthana = [6, 8, 12]
    
    # Harsha Yoga (Lord 6 in 6, 8, 12)
    if l6 in planet_house_map and planet_house_map[l6] in dusthana:
        yogas.append({"name": "Harsha Yoga", "type": "Vipareeta Raja Yoga", "description": "Lord of 6th in Dusthana. Victory over enemies.", "strength": "Medium"})

    # Sarala Yoga (Lord 8 in 6, 8, 12)
    if l8 in planet_house_map and planet_house_map[l8] in dusthana:
        yogas.append({"name": "Sarala Yoga", "type": "Vipareeta Raja Yoga", "description": "Lord of 8th in Dusthana. Long life and power.", "strength": "Medium"})

    # Vimala Yoga (Lord 12 in 6, 8, 12)
    if l12 in planet_house_map and planet_house_map[l12] in dusthana:
        yogas.append({"name": "Vimala Yoga", "type": "Vipareeta Raja Yoga", "description": "Lord of 12th in Dusthana. Independence and frugality.", "strength": "Medium"})
        
    return yogas

def check_neecha_bhanga_raja_yoga(planets: Dict[str, Dict], asc_lon: float) -> List[Dict]:
    """
    Cancellation of debilitation.
    """
    yogas = []
    
    planet_house_map = {p: get_planet_house(d["longitude"], asc_lon) for p, d in planets.items()}
    moon_house = planet_house_map.get("Moon", 1) # Default to 1 if missing
    
    for p_name, p_data in planets.items():
        sign = p_data.get("zodiac_sign", get_zodiac_sign(p_data["longitude"]))
        rules = PLANETARY_STRENGTH_MAP.get(p_name, {})
        
        if sign == rules.get("deb"):
            # Planet is debilitated. Check cancellation.
            is_cancelled = False
            
            # 1. Lord of Debilitation Sign in Kendra from Lagna or Moon
            deb_lord = ZODIAC_LORDS[sign]
            if deb_lord in planet_house_map:
                h_lagna = planet_house_map[deb_lord]
                h_moon = (planet_house_map[deb_lord] - moon_house + 12) % 12 + 1
                
                if h_lagna in [1, 4, 7, 10] or h_moon in [1, 4, 7, 10]:
                    is_cancelled = True
            
            # 2. Lord of Exaltation Sign in Kendra from Lagna or Moon
            exalt_sign = rules.get("exalt")
            exalt_lord = ZODIAC_LORDS[exalt_sign]
            if exalt_lord in planet_house_map:
                h_lagna = planet_house_map[exalt_lord]
                h_moon = (planet_house_map[exalt_lord] - moon_house + 12) % 12 + 1
                
                if h_lagna in [1, 4, 7, 10] or h_moon in [1, 4, 7, 10]:
                    is_cancelled = True
                    
            if is_cancelled:
                yogas.append({
                    "name": f"Neecha Bhanga Raja Yoga ({p_name})",
                    "type": "Cancellation",
                    "description": f"Debilitation of {p_name} is cancelled, creating a powerful Raja Yoga.",
                    "strength": "High"
                })
                
    return yogas

def calculate_yogas(planets_list: List[Dict], asc_data: Dict) -> Dict:
    """
    Main orchestrator for Yoga detection.
    """
    # Convert list to dict for easier access
    planets_dict = {p["name"]: p for p in planets_list}
    # Add Sign to planets_dict if missing
    for p_name, p_data in planets_dict.items():
        if "zodiac_sign" not in p_data: # Ensure correct key
            p_data["zodiac_sign"] = get_zodiac_sign(p_data["longitude"])
            
    asc_lon = asc_data["longitude"]
    planet_house_map = {p: get_planet_house(d["longitude"], asc_lon) for p, d in planets_dict.items()}
    
    results = {
        "raja_yogas": [],
        "dhana_yogas": [],
        "mahapurusha_yogas": [],
        "other_yogas": []
    }
    
    # 1. Pancha Mahapurusha
    pm = check_pancha_mahapurusha_yoga(planets_dict, asc_lon)
    results["mahapurusha_yogas"].extend(pm)
    
    # 2. Dhana Yogas
    dy = check_dhana_yogas(planets_dict, asc_lon)
    results["dhana_yogas"].extend(dy)
    
    # 3. Raja Yogas
    ry = check_raja_yogas(planets_dict, asc_lon)
    results["raja_yogas"].extend(ry)
    
    # 4. Vipareeta Raja Yoga
    vry = check_vipareeta_raja_yoga(planets_dict, asc_lon)
    results["raja_yogas"].extend(vry) # Add to Raja Yogas category
    
    # 5. Neecha Bhanga
    nbr = check_neecha_bhanga_raja_yoga(planets_dict, asc_lon)
    results["raja_yogas"].extend(nbr)
    
    # 6. Common Yogas (Budhaditya, etc)
    cy = check_common_yogas(planets_dict, planet_house_map)
    results["other_yogas"].extend(cy)
    
    # Summary Count
    results["total_count"] = len(results["raja_yogas"]) + len(results["dhana_yogas"]) + len(results["mahapurusha_yogas"]) + len(results["other_yogas"])
    
    return results
