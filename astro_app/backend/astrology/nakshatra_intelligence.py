"""
Nakshatra Intelligence Service
Provides Nakshatra-based calculations including Tarabala (star strength)
"""
from typing import Dict, Tuple
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

# 27 Nakshatras with their lords and deities
NAKSHATRAS = [
    {"name": "Ashwini", "lord": "Ketu", "deity": "Ashwini Kumaras", "theme": "Healing & Swift Action"},
    {"name": "Bharani", "lord": "Venus", "deity": "Yama", "theme": "Transformation & Restraint"},
    {"name": "Krittika", "lord": "Sun", "deity": "Agni", "theme": "Purification & Cutting"},
    {"name": "Rohini", "lord": "Moon", "deity": "Brahma", "theme": "Growth & Beauty"},
    {"name": "Mrigashira", "lord": "Mars", "deity": "Soma", "theme": "Seeking & Exploration"},
    {"name": "Ardra", "lord": "Rahu", "deity": "Rudra", "theme": "Storm & Renewal"},
    {"name": "Punarvasu", "lord": "Jupiter", "deity": "Aditi", "theme": "Return & Renewal"},
    {"name": "Pushya", "lord": "Saturn", "deity": "Brihaspati", "theme": "Nourishment & Growth"},
    {"name": "Ashlesha", "lord": "Mercury", "deity": "Nagas", "theme": "Kundalini & Healing"},
    {"name": "Magha", "lord": "Ketu", "deity": "Pitris", "theme": "Royal Recognition"},
    {"name": "Purva Phalguni", "lord": "Venus", "deity": "Bhaga", "theme": "Pleasure & Creativity"},
    {"name": "Uttara Phalguni", "lord": "Sun", "deity": "Aryaman", "theme": "Partnership & Union"},
    {"name": "Hasta", "lord": "Moon", "deity": "Savitar", "theme": "Skill & Craftsmanship"},
    {"name": "Chitra", "lord": "Mars", "deity": "Vishwakarma", "theme": "Beauty & Design"},
    {"name": "Swati", "lord": "Rahu", "deity": "Vayu", "theme": "Independence & Movement"},
    {"name": "Vishakha", "lord": "Jupiter", "deity": "Indra-Agni", "theme": "Goal Achievement"},
    {"name": "Anuradha", "lord": "Saturn", "deity": "Mitra", "theme": "Friendship & Devotion"},
    {"name": "Jyeshtha", "lord": "Mercury", "deity": "Indra", "theme": "Seniority & Protection"},
    {"name": "Mula", "lord": "Ketu", "deity": "Nirriti", "theme": "Root Destruction"},
    {"name": "Purva Ashadha", "lord": "Venus", "deity": "Apas", "theme": "Victory & Expansion"},
    {"name": "Uttara Ashadha", "lord": "Sun", "deity": "Vishvadevas", "theme": "Final Victory"},
    {"name": "Shravana", "lord": "Moon", "deity": "Vishnu", "theme": "Listening & Learning"},
    {"name": "Dhanishta", "lord": "Mars", "deity": "Vasus", "theme": "Wealth & Music"},
    {"name": "Shatabhisha", "lord": "Rahu", "deity": "Varuna", "theme": "Healing & Secrets"},
    {"name": "Purva Bhadrapada", "lord": "Jupiter", "deity": "Aja Ekapada", "theme": "Spiritual Fire"},
    {"name": "Uttara Bhadrapada", "lord": "Saturn", "deity": "Ahir Budhnya", "theme": "Deep Wisdom"},
    {"name": "Revati", "lord": "Mercury", "deity": "Pushan", "theme": "Nourishment & Journey"}
]

# Tarabala: 9-star strength system
TARABALA_SEQUENCE = [
    {"position": 1, "name": "Janma", "strength": 0, "description": "Birth star - Avoid important actions"},
    {"position": 2, "name": "Sampat", "strength": 100, "description": "Wealth - Excellent for financial matters"},
    {"position": 3, "name": "Vipat", "strength": 25, "description": "Danger - Obstacles likely"},
    {"position": 4, "name": "Kshema", "strength": 100, "description": "Well-being - Good for health"},
    {"position": 5, "name": "Pratyak", "strength": 0, "description": "Obstacles - Avoid new ventures"},
    {"position": 6, "name": "Sadhana", "strength": 100, "description": "Achievement - Excellent for goals"},
    {"position": 7, "name": "Naidhana", "strength": 0, "description": "Death - Very unfavorable"},
    {"position": 8, "name": "Mitra", "strength": 100, "description": "Friend - Good for relationships"},
    {"position": 9, "name": "Paramitra", "strength": 100, "description": "Best friend - Maximum success"}
]


def get_nakshatra_from_longitude(longitude: float) -> Tuple[str, int, Dict]:
    """
    Get Nakshatra name, pada, and details from Moon's longitude
    
    Args:
        longitude: Moon's longitude in degrees (0-360)
    
    Returns:
        Tuple of (nakshatra_name, pada, nakshatra_details)
    """
    # Each nakshatra is 13°20' (13.333...)
    nakshatra_span = 360 / 27
    
    # Calculate nakshatra index (0-26)
    nakshatra_index = int(longitude / nakshatra_span)
    
    # Calculate pada (1-4) within the nakshatra
    # Each pada is 3°20' (3.333...)
    pada_span = nakshatra_span / 4
    position_in_nakshatra = longitude % nakshatra_span
    pada = int(position_in_nakshatra / pada_span) + 1
    
    nakshatra_details = NAKSHATRAS[nakshatra_index]
    
    return nakshatra_details["name"], pada, nakshatra_details


def calculate_tarabala(birth_nakshatra_index: int, current_nakshatra_index: int) -> Dict:
    """
    Calculate Tarabala (star strength) based on birth and current nakshatra
    
    Args:
        birth_nakshatra_index: Index of birth nakshatra (0-26)
        current_nakshatra_index: Index of current Moon nakshatra (0-26)
    
    Returns:
        Dict with tarabala position, name, strength, and description
    """
    # Calculate the count from birth star (1-27)
    count = ((current_nakshatra_index - birth_nakshatra_index) % 27) + 1
    
    # Map to 9-star cycle (1-9)
    tarabala_position = ((count - 1) % 9) + 1
    
    tarabala_info = TARABALA_SEQUENCE[tarabala_position - 1]
    
    return tarabala_info


def get_nakshatra_index(nakshatra_name: str) -> int:
    """Get the index (0-26) of a nakshatra by name"""
    for i, nak in enumerate(NAKSHATRAS):
        if nak["name"].lower() == nakshatra_name.lower():
            return i
    return 0


def get_current_moon_nakshatra(moon_longitude: float) -> Dict:
    """
    Get current Moon's nakshatra details
    
    Args:
        moon_longitude: Current Moon longitude in degrees
    
    Returns:
        Dict with nakshatra name, lord, deity, pada, theme
    """
    nakshatra_name, pada, details = get_nakshatra_from_longitude(moon_longitude)
    
    return {
        "name": nakshatra_name,
        "lord": details["lord"],
        "deity": details["deity"],
        "pada": pada,
        "theme": details["theme"]
    }


def calculate_nakshatra_strength_for_activity(
    birth_nakshatra: str,
    current_moon_longitude: float,
    activity_type: str = "general"
) -> Dict:
    """
    Calculate how favorable the current nakshatra is for a specific activity
    
    Args:
        birth_nakshatra: User's birth nakshatra name
        current_moon_longitude: Current Moon longitude
        activity_type: Type of activity (career, relations, wellness, business, wealth)
    
    Returns:
        Dict with tarabala strength and recommendations
    """
    # Get current nakshatra
    current_nak_name, pada, current_details = get_nakshatra_from_longitude(current_moon_longitude)
    
    # Get indices
    birth_index = get_nakshatra_index(birth_nakshatra)
    current_index = get_nakshatra_index(current_nak_name)
    
    # Calculate tarabala
    tarabala = calculate_tarabala(birth_index, current_index)
    
    # Activity-specific adjustments
    activity_boost = 0
    activity_note = ""
    
    # Certain nakshatras are better for specific activities
    if activity_type == "career":
        if current_nak_name in ["Magha", "Uttara Ashadha", "Pushya"]:
            activity_boost = 10
            activity_note = f"{current_nak_name} supports professional recognition"
    elif activity_type == "relations":
        if current_nak_name in ["Uttara Phalguni", "Rohini", "Anuradha"]:
            activity_boost = 10
            activity_note = f"{current_nak_name} favors relationships"
    elif activity_type == "wellness":
        if current_nak_name in ["Ashwini", "Pushya", "Ashlesha"]:
            activity_boost = 10
            activity_note = f"{current_nak_name} supports healing"
    elif activity_type == "business":
        if current_nak_name in ["Hasta", "Chitra", "Purva Ashadha"]:
            activity_boost = 10
            activity_note = f"{current_nak_name} favors commerce"
    elif activity_type == "wealth":
        if current_nak_name in ["Rohini", "Purva Phalguni", "Dhanishta"]:
            activity_boost = 10
            activity_note = f"{current_nak_name} attracts wealth"
    
    final_strength = min(100, tarabala["strength"] + activity_boost)
    
    return {
        "current_nakshatra": current_nak_name,
        "nakshatra_lord": current_details["lord"],
        "deity": current_details["deity"],
        "pada": pada,
        "theme": current_details["theme"],
        "tarabala_position": tarabala["position"],
        "tarabala_name": tarabala["name"],
        "tarabala_strength": final_strength,
        "tarabala_description": tarabala["description"],
        "activity_note": activity_note
    }
