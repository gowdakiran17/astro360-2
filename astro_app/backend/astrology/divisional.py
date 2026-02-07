from astro_app.backend.astrology.utils import normalize_degree, get_zodiac_sign, get_nakshatra
from astro_app.backend.astrology.external_api import astrology_api_service
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

# --- Varga Deity Constants ---

D2_DEITIES = ["Deva", "Pitri"]
D3_DEITIES = ["Narada", "Agastya", "Durvasa"]
D7_DEITIES_ODD = ["Kshara", "Ksheera", "Dadhi", "Aajya", "Shakhu", "Ikshu", "Jala"] # Tastes
D7_DEITIES_EVEN = D7_DEITIES_ODD[::-1] # Reverse for even
D16_DEITIES_MOVABLE = ["Brahma", "Vishnu", "Shiva", "Sun"]
D16_DEITIES_FIXED = D16_DEITIES_MOVABLE[::-1] # Reverse? No, usually distinct. Let's use Parashara standard.
# Parashara D16:
# Odd: Brahma, Vishnu, Shiva, Sun
# Even: Sun, Shiva, Vishnu, Brahma
D16_DEITIES_ODD = ["Brahma", "Vishnu", "Shiva", "Sun"]
D16_DEITIES_EVEN = ["Sun", "Shiva", "Vishnu", "Brahma"]

D20_DEITIES_ODD = [
    "Kali", "Gauri", "Jaya", "Lakshmi", "Vijaya", "Vimala", "Sati", "Tara", 
    "Jwalamukhi", "Sveta", "Lalita", "Bagalamukhi", "Pratyangira", "Shachi", 
    "Roudri", "Bhavani", "Varada", "Jaya", "Tripura", "Sumukhi"
]
# Even: Daya, Megha, Chinnashirsha, etc. (Reverse of Odd? Or distinct?)
# BPHS: "For even signs, the deities are reckoned from the end." -> Reverse of Odd.
D20_DEITIES_EVEN = D20_DEITIES_ODD[::-1]

D24_DEITIES_ODD = [
    "Skanda", "Parashurama", "Agni", "Yama", "Varuna", "Indra", "Gandarva", "Poosha", 
    "Karthikeya", "Vayu", "Siva", "Vishnu", "Narasimha", "Vamana", "Trivikrama", 
    "Hayagriva", "Eka", "Durga", "Vayu", "Yama", "Agni", "Parashurama", "Skanda", "Siva"
]
D24_DEITIES_EVEN = D24_DEITIES_ODD[::-1] # Reverse for even signs

D30_DEITIES_ODD = ["Agni", "Vayu", "Indra", "Kubera", "Varuna"] # 5, 5, 8, 7, 5 degrees
D30_DEITIES_EVEN = ["Varuna", "Kubera", "Indra", "Vayu", "Agni"] # Reverse

D60_DEITIES = [
    "Ghora", "Rakshasa", "Deva", "Kubera", "Yaksha", "Kinnara", "Bhrashta", "Kulaghna", 
    "Garala", "Vahni", "Maya", "Purishaka", "Apampathi", "Marutwan", "Kaala", "Sarpa", 
    "Amrita", "Indu", "Mridu", "Komala", "Heramba", "Brahma", "Vishnu", "Maheshwara", 
    "Deva", "Ardra", "Kalinasa", "Kshitisa", "Kamalakara", "Gulika", "Mrityu", "Kaala", 
    "Davagni", "Ghora", "Yama", "Kantaka", "Sudha", "Amrita", "Poornachandra", "Vishadagdha", 
    "Kulanasa", "Vamshakshaya", "Utpata", "Kaala", "Saumya", "Komal", "Sheetala", 
    "Karaladamstra", "Chandramukhi", "Praveena", "Kaalpavaka", "Dhandayudha", "Nirmala", 
    "Soumya", "Krura", "Atisheetala", "Amrita", "Payodhi", "Bhramana", "Chandrarekha"
]

def get_deity(chart: str, part_index: int, sign_index: int, degree: float = 0.0) -> str:
    """Returns the presiding deity for a given varga part."""
    is_odd = (sign_index + 1) % 2 != 0
    
    if chart == "D2":
        # Part 0 (0-15), Part 1 (15-30)
        # Odd: Sun(Deva), Moon(Pitri) -> 0: Deva, 1: Pitri
        # Even: Moon(Pitri), Sun(Deva) -> 0: Pitri, 1: Deva
        if is_odd:
            return D2_DEITIES[part_index]
        else:
            return D2_DEITIES[1 - part_index]
            
    if chart == "D3":
        # 0: Narada, 1: Agastya, 2: Durvasa (Cyclic usually? No, fixed per decan)
        return D3_DEITIES[part_index]

    if chart == "D7":
        if is_odd:
            return D7_DEITIES_ODD[part_index]
        else:
            return D7_DEITIES_EVEN[part_index]
            
    if chart == "D16":
        # Part index 0-15
        idx = part_index % 4
        if is_odd:
            return D16_DEITIES_ODD[idx]
        else:
            return D16_DEITIES_EVEN[idx]

    if chart == "D20":
        if is_odd:
            return D20_DEITIES_ODD[part_index]
        else:
            return D20_DEITIES_EVEN[part_index]

    if chart == "D24":
        if is_odd:
            return D24_DEITIES_ODD[part_index]
        else:
            return D24_DEITIES_EVEN[part_index]
            
    if chart == "D30":
        # Non-linear parts. 
        # Odd: 0-5(Mars), 5-10(Sat), 10-18(Jup), 18-25(Merc), 25-30(Ven)
        # Deities: Agni(Mars), Vayu(Sat), Indra(Jup), Kubera(Merc), Varuna(Ven)
        # We need to determine index based on degree, not just part count
        # But calculate_d30 already does logic.
        # Let's map sign lord to deity?
        # Aries(Mars)->Agni, Aq(Sat)->Vayu, Sag(Jup)->Indra, Gem(Merc)->Kubera, Lib(Ven)->Varuna
        
        # We'll rely on the caller passing the correct derived sign to infer deity
        pass 
        
    if chart == "D60":
        return D60_DEITIES[part_index % 60]
        
    return ""

def calculate_d9_navamsa(longitude: float) -> dict:
    """
    Calculates Navamsa (D9) position.
    Formula: Each sign (30 deg) divided into 9 parts (3 deg 20 min).
    The mapping depends on the element of the sign (Fire, Earth, Air, Water).
    
    Simplified Logic:
    Navamsa = (Longitude * 9) % 360 ? No, that's continuous zodiac mapping.
    Standard Parashara:
    - Fiery signs (1,5,9): Start from Aries
    - Earthy signs (2,6,10): Start from Capricorn
    - Airy signs (3,7,11): Start from Libra
    - Watery signs (4,8,12): Start from Cancer
    """
    normalized_lon = normalize_degree(longitude)
    sign_index = int(normalized_lon / 30) # 0 for Aries, 1 for Taurus...
    degree_in_sign = normalized_lon % 30
    
    # 9 parts per sign
    part_index = min(int(degree_in_sign / (30/9)), 8) # 0 to 8
    
    # Sign number (1-12)
    sign_num = sign_index + 1
    
    # Determine starting sign index (0-11) for the sequence
    # Fire (1,5,9) -> Start Aries (0)
    # Earth (2,6,10) -> Start Capricorn (9)
    # Air (3,7,11) -> Start Libra (6)
    # Water (4,8,12) -> Start Cancer (3)
    
    remainder = sign_num % 4
    if remainder == 1: # 1, 5, 9 (Fire)
        start_sign_idx = 0
    elif remainder == 2: # 2, 6, 10 (Earth)
        start_sign_idx = 9
    elif remainder == 3: # 3, 7, 11 (Air)
        start_sign_idx = 6
    else: # 0 -> 4, 8, 12 (Water)
        start_sign_idx = 3
        
    d9_sign_idx = (start_sign_idx + part_index) % 12
    d9_sign_name = get_zodiac_sign(d9_sign_idx * 30)
    
    # Calculate exact longitude in D9 chart? 
    # Usually Divisional Charts are analyzed by Sign placement. 
    # But if we want longitude: (Longitude * 9) % 360 is strictly continuous, 
    # but the Parashara jump mapping means we place it in the new sign.
    # The degree within the D9 sign:
    # fraction of part = (degree_in_sign % (30/9)) / (30/9)
    # d9_deg = fraction_part * 30
    # absolute_d9_lon = d9_sign_idx * 30 + d9_deg
    
    part_span = 30.0 / 9.0
    fraction = (degree_in_sign % part_span) / part_span
    d9_deg = fraction * 30.0
    absolute_d9_lon = (d9_sign_idx * 30) + d9_deg
    
    return {
        "chart": "D9",
        "longitude": absolute_d9_lon,
        "zodiac_sign": d9_sign_name,
        "nakshatra": get_nakshatra(absolute_d9_lon)
    }

def calculate_d16_shodashamsa(longitude: float) -> dict:
    """
    Calculates Shodashamsa (D16) position.
    Used for vehicles, comforts.
    
    Scheme (Parashara):
    - Movable Signs (1,4,7,10): Start from Aries (1)
    - Fixed Signs (2,5,8,11): Start from Leo (5)
    - Dual Signs (3,6,9,12): Start from Sagittarius (9)
    """
    normalized_lon = normalize_degree(longitude)
    sign_index = int(normalized_lon / 30)
    degree_in_sign = normalized_lon % 30
    
    part_index = min(int(degree_in_sign / (30/16)), 15) # 0 to 15
    sign_num = sign_index + 1
    
    remainder = sign_num % 3
    if remainder == 1: # 1, 4, 7, 10 (Movable)
        start_sign_idx = 0 # Aries
    elif remainder == 2: # 2, 5, 8, 11 (Fixed)
        start_sign_idx = 4 # Leo
    else: # 0 -> 3, 6, 9, 12 (Dual)
        start_sign_idx = 8 # Sagittarius
        
    d16_sign_idx = (start_sign_idx + part_index) % 12
    d16_sign_name = get_zodiac_sign(d16_sign_idx * 30)
    
    part_span = 30.0 / 16.0
    fraction = (degree_in_sign % part_span) / part_span
    d16_deg = fraction * 30.0
    absolute_d16_lon = (d16_sign_idx * 30) + d16_deg
    
    return {
        "chart": "D16",
        "longitude": absolute_d16_lon,
        "zodiac_sign": d16_sign_name,
        "nakshatra": get_nakshatra(absolute_d16_lon),
        "deity": get_deity("D16", part_index, sign_index)
    }

def calculate_d2_hora(longitude: float) -> dict:
    """
    Calculates Hora (D2) - Wealth/Family.
    Parashara Method:
    - Odd Signs: 1st half (0-15) = Sun (Leo), 2nd half (15-30) = Moon (Cancer)
    - Even Signs: 1st half (0-15) = Moon (Cancer), 2nd half (15-30) = Sun (Leo)
    """
    normalized_lon = normalize_degree(longitude)
    sign_index = int(normalized_lon / 30)
    degree_in_sign = normalized_lon % 30
    is_odd = (sign_index + 1) % 2 != 0
    
    if is_odd:
        if degree_in_sign < 15:
            d2_sign_idx = 4 # Leo
        else:
            d2_sign_idx = 3 # Cancer
    else:
        if degree_in_sign < 15:
            d2_sign_idx = 3 # Cancer
        else:
            d2_sign_idx = 4 # Leo
            
    d2_sign_name = get_zodiac_sign(d2_sign_idx * 30)
    
    # Calculate longitude
    # Map 15 deg to 30 deg
    fraction = (degree_in_sign % 15) / 15.0
    d2_deg = fraction * 30.0
    absolute_d2_lon = (d2_sign_idx * 30) + d2_deg
    
    # Determine Deity
    # Odd: 0-15 Deva, 15-30 Pitri
    # Even: 0-15 Pitri, 15-30 Deva
    part_idx = 0 if degree_in_sign < 15 else 1
    deity = get_deity("D2", part_idx, sign_index)
    
    return {
        "chart": "D2",
        "longitude": absolute_d2_lon,
        "zodiac_sign": d2_sign_name,
        "nakshatra": get_nakshatra(absolute_d2_lon),
        "deity": deity
    }

def calculate_d3_drekkana(longitude: float) -> dict:
    """
    Calculates Drekkana (D3) - Siblings/Courage.
    - 0-10: Sign itself (1)
    - 10-20: 5th from sign (5)
    - 20-30: 9th from sign (9)
    """
    normalized_lon = normalize_degree(longitude)
    sign_index = int(normalized_lon / 30)
    degree_in_sign = normalized_lon % 30
    
    part = min(int(degree_in_sign / 10), 2) # 0, 1, 2
    
    if part == 0:
        shift = 0
    elif part == 1:
        shift = 4 # +4 signs = 5th house
    else:
        shift = 8 # +8 signs = 9th house
        
    d3_sign_idx = (sign_index + shift) % 12
    d3_sign_name = get_zodiac_sign(d3_sign_idx * 30)
    
    fraction = (degree_in_sign % 10) / 10.0
    d3_deg = fraction * 30.0
    absolute_d3_lon = (d3_sign_idx * 30) + d3_deg
    
    return {
        "chart": "D3",
        "longitude": absolute_d3_lon,
        "zodiac_sign": d3_sign_name,
        "nakshatra": get_nakshatra(absolute_d3_lon),
        "deity": get_deity("D3", part, sign_index)
    }

def calculate_d4_chaturthamsha(longitude: float) -> dict:
    """
    Calculates Chaturthamsha (D4) - Property/Fortune.
    - 0-7.5: Sign itself (1)
    - 7.5-15: 4th from sign (4)
    - 15-22.5: 7th from sign (7)
    - 22.5-30: 10th from sign (10)
    """
    normalized_lon = normalize_degree(longitude)
    sign_index = int(normalized_lon / 30)
    degree_in_sign = normalized_lon % 30
    
    part = min(int(degree_in_sign / 7.5), 3) # 0, 1, 2, 3
    
    shift = part * 3 # 0->0, 1->3, 2->6, 3->9
    
    d4_sign_idx = (sign_index + shift) % 12
    d4_sign_name = get_zodiac_sign(d4_sign_idx * 30)
    
    fraction = (degree_in_sign % 7.5) / 7.5
    d4_deg = fraction * 30.0
    absolute_d4_lon = (d4_sign_idx * 30) + d4_deg
    
    return {
        "chart": "D4",
        "longitude": absolute_d4_lon,
        "zodiac_sign": d4_sign_name,
        "nakshatra": get_nakshatra(absolute_d4_lon)
    }

def calculate_d7_saptamsha(longitude: float) -> dict:
    """
    Calculates Saptamsha (D7) - Children/Progeny.
    - Odd Signs: Start from Sign itself
    - Even Signs: Start from 7th from Sign
    """
    normalized_lon = normalize_degree(longitude)
    sign_index = int(normalized_lon / 30)
    degree_in_sign = normalized_lon % 30
    
    part_span = 30.0 / 7.0
    part = min(int(degree_in_sign / part_span), 6) # 0-6
    
    is_odd = (sign_index + 1) % 2 != 0
    
    if is_odd:
        start_idx = sign_index
    else:
        start_idx = (sign_index + 6) % 12
        
    d7_sign_idx = (start_idx + part) % 12
    d7_sign_name = get_zodiac_sign(d7_sign_idx * 30)
    
    fraction = (degree_in_sign % part_span) / part_span
    d7_deg = fraction * 30.0
    absolute_d7_lon = (d7_sign_idx * 30) + d7_deg
    
    return {
        "chart": "D7",
        "longitude": absolute_d7_lon,
        "zodiac_sign": d7_sign_name,
        "nakshatra": get_nakshatra(absolute_d7_lon),
        "deity": get_deity("D7", part, sign_index)
    }

def calculate_d10_dashamsha(longitude: float) -> dict:
    """
    Calculates Dashamsha (D10) - Career/Profession.
    - Odd Signs: Start from Sign itself
    - Even Signs: Start from 9th from Sign
    """
    normalized_lon = normalize_degree(longitude)
    sign_index = int(normalized_lon / 30)
    degree_in_sign = normalized_lon % 30
    
    part_span = 30.0 / 10.0
    part = min(int(degree_in_sign / part_span), 9) # 0-9
    
    is_odd = (sign_index + 1) % 2 != 0
    
    if is_odd:
        start_idx = sign_index
    else:
        start_idx = (sign_index + 8) % 12
        
    d10_sign_idx = (start_idx + part) % 12
    d10_sign_name = get_zodiac_sign(d10_sign_idx * 30)
    
    fraction = (degree_in_sign % part_span) / part_span
    d10_deg = fraction * 30.0
    absolute_d10_lon = (d10_sign_idx * 30) + d10_deg
    
    return {
        "chart": "D10",
        "longitude": absolute_d10_lon,
        "zodiac_sign": d10_sign_name,
        "nakshatra": get_nakshatra(absolute_d10_lon)
    }

def calculate_d12_dwadashamsha(longitude: float) -> dict:
    """
    Calculates Dwadashamsha (D12) - Parents/Ancestors.
    - Starts from the Sign itself.
    """
    normalized_lon = normalize_degree(longitude)
    sign_index = int(normalized_lon / 30)
    degree_in_sign = normalized_lon % 30
    
    part_span = 30.0 / 12.0
    part = min(int(degree_in_sign / part_span), 11) # 0-11
    
    d12_sign_idx = (sign_index + part) % 12
    d12_sign_name = get_zodiac_sign(d12_sign_idx * 30)
    
    fraction = (degree_in_sign % part_span) / part_span
    d12_deg = fraction * 30.0
    absolute_d12_lon = (d12_sign_idx * 30) + d12_deg
    
    return {
        "chart": "D12",
        "longitude": absolute_d12_lon,
        "zodiac_sign": d12_sign_name,
        "nakshatra": get_nakshatra(absolute_d12_lon)
    }

def calculate_d20_vimshamsha(longitude: float) -> dict:
    """
    Calculates Vimshamsha (D20) - Spirituality/Upasana.
    - Movable: Start Aries
    - Fixed: Start Sagittarius
    - Dual: Start Leo
    """
    normalized_lon = normalize_degree(longitude)
    sign_index = int(normalized_lon / 30)
    degree_in_sign = normalized_lon % 30
    
    part_span = 30.0 / 20.0
    part = min(int(degree_in_sign / part_span), 19) # 0-19
    sign_num = sign_index + 1
    
    rem = sign_num % 3
    if rem == 1: # Movable
        start_idx = 0 # Aries
    elif rem == 2: # Fixed
        start_idx = 8 # Sagittarius
    else: # Dual
        start_idx = 4 # Leo
        
    d20_sign_idx = (start_idx + part) % 12
    d20_sign_name = get_zodiac_sign(d20_sign_idx * 30)
    
    fraction = (degree_in_sign % part_span) / part_span
    d20_deg = fraction * 30.0
    absolute_d20_lon = (d20_sign_idx * 30) + d20_deg
    
    return {
        "chart": "D20",
        "longitude": absolute_d20_lon,
        "zodiac_sign": d20_sign_name,
        "nakshatra": get_nakshatra(absolute_d20_lon)
    }

def calculate_d24_chaturvimshamsha(longitude: float) -> dict:
    """
    Calculates Chaturvimshamsha (D24) - Knowledge/Education.
    - Odd: Start Leo
    - Even: Start Cancer
    """
    normalized_lon = normalize_degree(longitude)
    sign_index = int(normalized_lon / 30)
    degree_in_sign = normalized_lon % 30
    
    part_span = 30.0 / 24.0
    part = min(int(degree_in_sign / part_span), 23) # 0-23
    is_odd = (sign_index + 1) % 2 != 0
    
    if is_odd:
        start_idx = 4 # Leo
    else:
        start_idx = 3 # Cancer
        
    d24_sign_idx = (start_idx + part) % 12
    d24_sign_name = get_zodiac_sign(d24_sign_idx * 30)
    
    fraction = (degree_in_sign % part_span) / part_span
    d24_deg = fraction * 30.0
    absolute_d24_lon = (d24_sign_idx * 30) + d24_deg
    
    return {
        "chart": "D24",
        "longitude": absolute_d24_lon,
        "zodiac_sign": d24_sign_name,
        "nakshatra": get_nakshatra(absolute_d24_lon),
        "deity": get_deity("D24", part_index, sign_index)
    }

def calculate_d27_saptavimsamsa(longitude: float) -> dict:
    """
    Calculates Saptavimsamsa (D27) - Strengths/Weaknesses/Stamina.
    - Fiery Signs: Start from Aries
    - Earthy Signs: Start from Cancer
    - Airy Signs: Start from Libra
    - Watery Signs: Start from Capricorn
    """
    normalized_lon = normalize_degree(longitude)
    sign_index = int(normalized_lon / 30)
    degree_in_sign = normalized_lon % 30
    
    part_span = 30.0 / 27.0
    part = min(int(degree_in_sign / part_span), 26) # 0-26
    sign_num = sign_index + 1
    
    rem = sign_num % 4
    if rem == 1: # 1, 5, 9 (Fire)
        start_idx = 0 # Aries
    elif rem == 2: # 2, 6, 10 (Earth)
        start_idx = 3 # Cancer
    elif rem == 3: # 3, 7, 11 (Air)
        start_idx = 6 # Libra
    else: # 0 -> 4, 8, 12 (Water)
        start_idx = 9 # Capricorn
        
    d27_sign_idx = (start_idx + part) % 12
    d27_sign_name = get_zodiac_sign(d27_sign_idx * 30)
    
    fraction = (degree_in_sign % part_span) / part_span
    d27_deg = fraction * 30.0
    absolute_d27_lon = (d27_sign_idx * 30) + d27_deg
    
    return {
        "chart": "D27",
        "longitude": absolute_d27_lon,
        "zodiac_sign": d27_sign_name,
        "nakshatra": get_nakshatra(absolute_d27_lon)
    }

def calculate_d30_trimshamsha(longitude: float) -> dict:
    """
    Calculates Trimshamsha (D30) - Misfortune/Evils.
    Odd Signs:
    0-5: Mars (Aries)
    5-10: Saturn (Aquarius)
    10-18: Jupiter (Sagittarius)
    18-25: Mercury (Gemini)
    25-30: Venus (Libra)
    
    Even Signs:
    0-5: Venus (Taurus)
    5-12: Mercury (Virgo)
    12-20: Jupiter (Pisces)
    20-25: Saturn (Capricorn)
    25-30: Mars (Scorpio)
    """
    normalized_lon = normalize_degree(longitude)
    sign_index = int(normalized_lon / 30)
    deg = normalized_lon % 30
    is_odd = (sign_index + 1) % 2 != 0
    
    d30_sign_idx = 0
    
    if is_odd:
        if deg < 5: d30_sign_idx = 0 # Aries
        elif deg < 10: d30_sign_idx = 10 # Aquarius
        elif deg < 18: d30_sign_idx = 8 # Sagittarius
        elif deg < 25: d30_sign_idx = 2 # Gemini
        else: d30_sign_idx = 6 # Libra
    else:
        if deg < 5: d30_sign_idx = 1 # Taurus
        elif deg < 12: d30_sign_idx = 5 # Virgo
        elif deg < 20: d30_sign_idx = 11 # Pisces
        elif deg < 25: d30_sign_idx = 9 # Capricorn
        else: d30_sign_idx = 7 # Scorpio
        
    d30_sign_name = get_zodiac_sign(d30_sign_idx * 30)
    
    # Approx longitude (center of sign)
    absolute_d30_lon = (d30_sign_idx * 30) + 15.0
    
    # Determine Deity
    # Odd: Agni(Mars), Vayu(Sat), Indra(Jup), Kubera(Merc), Varuna(Ven)
    # Even: Varuna(Ven), Kubera(Merc), Indra(Jup), Vayu(Sat), Agni(Mars)
    # Mapping based on the *result* sign, because D30 signs are mapped to these planets
    
    # Sign to Deity Map (Odd Schema)
    # Aries/Scorpio (Mars) -> Agni
    # Aqu/Cap (Saturn) -> Vayu
    # Sag/Pisces (Jup) -> Indra
    # Gem/Virgo (Merc) -> Kubera
    # Lib/Taurus (Ven) -> Varuna
    
    deity = ""
    # Check D30 Sign Lord
    from astro_app.backend.astrology.utils import get_house_lord
    lord = get_house_lord(d30_sign_name)
    
    if lord == "Mars": deity = "Agni"
    elif lord == "Saturn": deity = "Vayu"
    elif lord == "Jupiter": deity = "Indra"
    elif lord == "Mercury": deity = "Kubera"
    elif lord == "Venus": deity = "Varuna"
    
    return {
        "chart": "D30",
        "longitude": absolute_d30_lon,
        "zodiac_sign": d30_sign_name,
        "nakshatra": get_nakshatra(absolute_d30_lon),
        "deity": deity
    }

def calculate_d40_khavedamsha(longitude: float) -> dict:
    """
    Calculates Khavedamsha (D40) - Auspicious/Inauspicious.
    - Odd: Start Aries
    - Even: Start Libra
    """
    normalized_lon = normalize_degree(longitude)
    sign_index = int(normalized_lon / 30)
    degree_in_sign = normalized_lon % 30
    
    part_span = 30.0 / 40.0
    part = min(int(degree_in_sign / part_span), 39)
    is_odd = (sign_index + 1) % 2 != 0
    
    if is_odd:
        start_idx = 0 # Aries
    else:
        start_idx = 6 # Libra
        
    d40_sign_idx = (start_idx + part) % 12
    d40_sign_name = get_zodiac_sign(d40_sign_idx * 30)
    
    fraction = (degree_in_sign % part_span) / part_span
    d40_deg = fraction * 30.0
    absolute_d40_lon = (d40_sign_idx * 30) + d40_deg
    
    return {
        "chart": "D40",
        "longitude": absolute_d40_lon,
        "zodiac_sign": d40_sign_name,
        "nakshatra": get_nakshatra(absolute_d40_lon)
    }

def calculate_d45_akshavedamsha(longitude: float) -> dict:
    """
    Calculates Akshavedamsha (D45) - General strength/integrity.
    - Movable: Start Aries
    - Fixed: Start Leo
    - Dual: Start Sagittarius
    """
    normalized_lon = normalize_degree(longitude)
    sign_index = int(normalized_lon / 30)
    degree_in_sign = normalized_lon % 30
    
    part_span = 30.0 / 45.0
    part = min(int(degree_in_sign / part_span), 44)
    sign_num = sign_index + 1
    
    rem = sign_num % 3
    if rem == 1: # Movable
        start_idx = 0 # Aries
    elif rem == 2: # Fixed
        start_idx = 4 # Leo
    else: # Dual
        start_idx = 8 # Sagittarius
        
    d45_sign_idx = (start_idx + part) % 12
    d45_sign_name = get_zodiac_sign(d45_sign_idx * 30)
    
    fraction = (degree_in_sign % part_span) / part_span
    d45_deg = fraction * 30.0
    absolute_d45_lon = (d45_sign_idx * 30) + d45_deg
    
    return {
        "chart": "D45",
        "longitude": absolute_d45_lon,
        "zodiac_sign": d45_sign_name,
        "nakshatra": get_nakshatra(absolute_d45_lon)
    }

def calculate_d60_shashtiamsha(longitude: float) -> dict:
    """
    Calculates Shashtiamsha (D60) - Past Karma/All Details.
    Standard Parashara Method: "Ignore the sign, multiply degrees by 2, remainder is the sign."
    Formula: (Absolute Longitude * 2) % 360 -> Sign
    Or more simply: (Longitude * 2) -> Map to Zodiac.
    
    Example: 
    Sun 10 deg Aries. 10 * 2 = 20. 20th Sign = Scorpio.
    Sun 10 deg Taurus. (30+10)*2 = 80. 80th Sign = Cancer? 
    Wait: (30+10)*2 = 80. 80 / 30 = 2.66. 
    80 deg absolute.
    80 % 12 signs? No.
    
    Correct Method (JHora/Parashara):
    D60 Sign = (Integer(Longitude * 2)) % 12 + 1 ?
    Let's check parts.
    Each part is 0.5 degrees.
    Total parts = Longitude / 0.5 = Longitude * 2.
    Part Index (0-based) = int(Longitude * 2).
    Sign Index = Part Index % 12.
    """
    normalized_lon = normalize_degree(longitude)
    
    # Each part is 0.5 degrees
    # We ignore the sign placement logic of "Start from X" and just use the continuous zodiac.
    # This is equivalent to "Ignore Sign" method.
    
    part_index = int(normalized_lon * 2) # 0.5 deg parts
    d60_sign_idx = part_index % 12
    
    d60_sign_name = get_zodiac_sign(d60_sign_idx * 30)
    
    # Calculate longitude within the D60 sign
    # degree * 2 % 30 ? No.
    # The D60 longitude expands the 0.5 deg arc to 30 deg.
    # remainder = normalized_lon % 0.5
    # d60_deg = (remainder / 0.5) * 30.0
    
    remainder = normalized_lon % 0.5
    d60_deg = (remainder / 0.5) * 30.0
    absolute_d60_lon = (d60_sign_idx * 30) + d60_deg
    
    return {
        "chart": "D60",
        "longitude": absolute_d60_lon,
        "zodiac_sign": d60_sign_name,
        "nakshatra": get_nakshatra(absolute_d60_lon),
        "deity": get_deity("D60", part_index, 0) # sign_index doesn't matter for D60 deity
    }

async def calculate_divisional_charts(planets_d1: list, birth_details: Optional[Dict[str, Any]] = None) -> dict:
    """
    Calculates Divisional Charts (D1-D60) for a list of planets.
    Now fully local, but keeps structure for potential API fallback if needed in future.
    """
    
    # Initialize all chart lists
    charts = {
        "D2": [], "D3": [], "D4": [], "D7": [], "D9": [], "D10": [],
        "D12": [], "D16": [], "D20": [], "D24": [], "D27": [], "D30": [], "D40": [],
        "D45": [], "D60": []
    }
    
    for p in planets_d1:
        name = p.get("name")
        lon = p.get("longitude")
        
        # Calculate all
        calcs = {
            "D2": calculate_d2_hora(lon),
            "D3": calculate_d3_drekkana(lon),
            "D4": calculate_d4_chaturthamsha(lon),
            "D7": calculate_d7_saptamsha(lon),
            "D9": calculate_d9_navamsa(lon),
            "D10": calculate_d10_dashamsha(lon),
            "D12": calculate_d12_dwadashamsha(lon),
            "D16": calculate_d16_shodashamsa(lon),
            "D20": calculate_d20_vimshamsha(lon),
            "D24": calculate_d24_chaturvimshamsha(lon),
            "D27": calculate_d27_saptavimsamsa(lon),
            "D30": calculate_d30_trimshamsha(lon),
            "D40": calculate_d40_khavedamsha(lon),
            "D45": calculate_d45_akshavedamsha(lon),
            "D60": calculate_d60_shashtiamsha(lon)
        }
        
        for chart_name, res in calcs.items():
            res["name"] = name
            charts[chart_name].append(res)
            
    return charts
