"""
Transit Calculator Service
Calculates current planetary transits and their aspects to natal chart
"""
from typing import Dict, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

# Aspect types and their orbs (degrees of allowance)
ASPECTS = {
    "Conjunction": {"degrees": 0, "orb": 8, "nature": "neutral", "strength": 100},
    "Sextile": {"degrees": 60, "orb": 6, "nature": "harmonious", "strength": 60},
    "Square": {"degrees": 90, "orb": 8, "nature": "challenging", "strength": 80},
    "Trine": {"degrees": 120, "orb": 8, "nature": "harmonious", "strength": 100},
    "Opposition": {"degrees": 180, "orb": 8, "nature": "challenging", "strength": 90}
}

# Planet symbols
PLANET_SYMBOLS = {
    "Sun": "☉",
    "Moon": "☽",
    "Mars": "♂",
    "Mercury": "☿",
    "Jupiter": "♃",
    "Venus": "♀",
    "Saturn": "♄",
    "Rahu": "☊",
    "Ketu": "☋"
}

# Transit speed and importance
TRANSIT_IMPORTANCE = {
    "Jupiter": {"speed": "slow", "importance": 95, "cycle_days": 4333},  # ~12 years
    "Saturn": {"speed": "slow", "importance": 100, "cycle_days": 10759},  # ~29 years
    "Rahu": {"speed": "slow", "importance": 90, "cycle_days": 6798},  # ~18 years
    "Ketu": {"speed": "slow", "importance": 90, "cycle_days": 6798},  # ~18 years
    "Mars": {"speed": "medium", "importance": 70, "cycle_days": 687},  # ~2 years
    "Venus": {"speed": "fast", "importance": 60, "cycle_days": 225},
    "Mercury": {"speed": "fast", "importance": 50, "cycle_days": 88},
    "Sun": {"speed": "fast", "importance": 75, "cycle_days": 365},
    "Moon": {"speed": "very_fast", "importance": 40, "cycle_days": 27}
}


def calculate_aspect_angle(planet1_longitude: float, planet2_longitude: float) -> float:
    """
    Calculate the aspect angle between two planets
    
    Args:
        planet1_longitude: Longitude of first planet (0-360)
        planet2_longitude: Longitude of second planet (0-360)
    
    Returns:
        Aspect angle in degrees (0-180)
    """
    diff = abs(planet1_longitude - planet2_longitude)
    
    # Normalize to 0-180
    if diff > 180:
        diff = 360 - diff
    
    return diff


def identify_aspect(angle: float) -> Optional[Dict]:
    """
    Identify the type of aspect based on angle
    
    Args:
        angle: Angle between planets (0-180)
    
    Returns:
        Dict with aspect details or None if no aspect
    """
    for aspect_name, aspect_info in ASPECTS.items():
        target_angle = aspect_info["degrees"]
        orb = aspect_info["orb"]
        
        if abs(angle - target_angle) <= orb:
            # Calculate exactness (0-100, where 100 is exact)
            exactness = 100 - (abs(angle - target_angle) / orb * 100)
            
            return {
                "name": aspect_name,
                "angle": angle,
                "exactness": exactness,
                "nature": aspect_info["nature"],
                "strength": aspect_info["strength"] * (exactness / 100)
            }
    
    return None


def calculate_transit_to_natal_aspects(
    transit_planets: Dict[str, float],
    natal_planets: Dict[str, float]
) -> List[Dict]:
    """
    Calculate all significant aspects from transiting planets to natal planets
    
    Args:
        transit_planets: Dict of {planet_name: current_longitude}
        natal_planets: Dict of {planet_name: birth_longitude}
    
    Returns:
        List of aspect dictionaries sorted by importance
    """
    aspects = []
    
    for transit_planet, transit_long in transit_planets.items():
        for natal_planet, natal_long in natal_planets.items():
            angle = calculate_aspect_angle(transit_long, natal_long)
            aspect = identify_aspect(angle)
            
            if aspect:
                # Calculate importance score
                transit_importance = TRANSIT_IMPORTANCE.get(transit_planet, {}).get("importance", 50)
                importance_score = (aspect["strength"] + transit_importance) / 2
                
                aspects.append({
                    "transit_planet": transit_planet,
                    "transit_symbol": PLANET_SYMBOLS.get(transit_planet, ""),
                    "natal_planet": natal_planet,
                    "aspect_type": aspect["name"],
                    "aspect_angle": aspect["angle"],
                    "exactness": aspect["exactness"],
                    "nature": aspect["nature"],
                    "strength": aspect["strength"],
                    "importance": importance_score
                })
    
    # Sort by importance (highest first)
    aspects.sort(key=lambda x: x["importance"], reverse=True)
    
    return aspects


def get_transit_house_position(transit_longitude: float, ascendant_longitude: float) -> int:
    """
    Determine which house a transiting planet is in
    
    Args:
        transit_longitude: Current longitude of transiting planet
        ascendant_longitude: Ascendant longitude from birth chart
    
    Returns:
        House number (1-12)
    """
    # Calculate difference from ascendant
    diff = transit_longitude - ascendant_longitude
    
    # Normalize to 0-360
    if diff < 0:
        diff += 360
    
    # Each house is 30 degrees
    house = int(diff / 30) + 1
    
    # Ensure house is 1-12
    if house > 12:
        house = house % 12
        if house == 0:
            house = 12
    
    return house


def calculate_transit_urgency(aspect_exactness: float, transit_speed: str) -> str:
    """
    Determine how urgent/immediate a transit's effect is
    
    Args:
        aspect_exactness: How exact the aspect is (0-100)
        transit_speed: Speed category of the planet
    
    Returns:
        Urgency label: "Peak today", "Building", "Waning", "Approaching"
    """
    if aspect_exactness >= 90:
        return "Peak today"
    elif aspect_exactness >= 70:
        if transit_speed in ["fast", "very_fast"]:
            return "Peak today"
        else:
            return "Building"
    elif aspect_exactness >= 50:
        return "Building"
    else:
        return "Approaching"


def find_most_relevant_transit_for_area(
    aspects: List[Dict],
    life_area: str,
    natal_chart: Dict
) -> Optional[Dict]:
    """
    Find the most relevant transit for a specific life area
    
    Args:
        aspects: List of all current aspects
        life_area: "career", "relations", "wellness", "business", "wealth"
        natal_chart: Complete natal chart data
    
    Returns:
        Most relevant transit aspect or None
    """
    # Define which planets/houses are most relevant for each area
    area_relevance = {
        "career": {
            "planets": ["Sun", "Saturn", "Jupiter", "Mars"],
            "houses": [10, 6, 1],
            "natal_points": ["MC", "Sun", "Saturn"]
        },
        "relations": {
            "planets": ["Venus", "Moon", "Jupiter"],
            "houses": [7, 5, 11],
            "natal_points": ["Venus", "Moon", "7th Lord"]
        },
        "wellness": {
            "planets": ["Sun", "Moon", "Mars"],
            "houses": [1, 6, 12],
            "natal_points": ["Ascendant", "Sun", "Moon"]
        },
        "business": {
            "planets": ["Mercury", "Jupiter", "Mars"],
            "houses": [3, 10, 11],
            "natal_points": ["Mercury", "3rd Lord", "10th Lord"]
        },
        "wealth": {
            "planets": ["Jupiter", "Venus", "Mercury"],
            "houses": [2, 11, 5],
            "natal_points": ["Jupiter", "Venus", "2nd Lord"]
        }
    }
    
    relevance = area_relevance.get(life_area, area_relevance["career"])
    
    # Score each aspect based on relevance
    scored_aspects = []
    for aspect in aspects:
        score = aspect["importance"]
        
        # Boost score if transit planet is relevant
        if aspect["transit_planet"] in relevance["planets"]:
            score += 20
        
        # Boost score if natal planet is relevant
        if aspect["natal_planet"] in relevance["natal_points"]:
            score += 15
        
        scored_aspects.append({
            **aspect,
            "relevance_score": score
        })
    
    # Sort by relevance score
    scored_aspects.sort(key=lambda x: x["relevance_score"], reverse=True)
    
    # Return most relevant
    return scored_aspects[0] if scored_aspects else None


def get_transit_effect_description(
    transit_planet: str,
    aspect_type: str,
    natal_point: str,
    life_area: str
) -> str:
    """
    Generate a description of the transit's effect
    
    Args:
        transit_planet: Name of transiting planet
        aspect_type: Type of aspect
        natal_point: What it's aspecting
        life_area: Life area being analyzed
    
    Returns:
        Description string
    """
    effects = {
        "Jupiter": {
            "Trine": "Expansion and growth",
            "Conjunction": "New opportunities",
            "Square": "Overextension, need for balance"
        },
        "Saturn": {
            "Trine": "Structured progress",
            "Conjunction": "Karmic lessons and maturity",
            "Square": "Delays and obstacles"
        },
        "Mars": {
            "Trine": "Energy and initiative",
            "Conjunction": "Action and courage",
            "Square": "Conflict and impatience"
        },
        "Venus": {
            "Trine": "Harmony and pleasure",
            "Conjunction": "Love and beauty",
            "Sextile": "Social opportunities"
        },
        "Mercury": {
            "Trine": "Clear communication",
            "Conjunction": "Mental clarity",
            "Sextile": "Networking opportunities"
        }
    }
    
    planet_effects = effects.get(transit_planet, {})
    effect = planet_effects.get(aspect_type, "Significant influence")
    
    return effect
