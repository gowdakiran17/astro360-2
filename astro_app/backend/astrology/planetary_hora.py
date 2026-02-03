"""
Planetary Hora (Hour) Calculator
Calculates planetary hours for optimal timing of activities
"""
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
import math
import logging

logger = logging.getLogger(__name__)

# Planetary sequence for day and night horas
DAY_HORA_SEQUENCE = ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"]
NIGHT_HORA_SEQUENCE = ["Moon", "Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury"]

# Planetary hora characteristics
HORA_CHARACTERISTICS = {
    "Sun": {
        "activities": ["Authority", "Power", "Health", "Government work", "Leadership"],
        "color": "#FCA5A5",
        "symbol": "☉"
    },
    "Moon": {
        "activities": ["Emotions", "Relationships", "Home", "Nurturing", "Intuition"],
        "color": "#E9D5FF",
        "symbol": "☽"
    },
    "Mars": {
        "activities": ["Conflict resolution", "Surgery", "Physical work", "Competition"],
        "color": "#FDBA74",
        "symbol": "♂"
    },
    "Mercury": {
        "activities": ["Business", "Communication", "Study", "Trade", "Writing"],
        "color": "#93C5FD",
        "symbol": "☿"
    },
    "Jupiter": {
        "activities": ["Wealth", "Wisdom", "Expansion", "Teaching", "Spirituality"],
        "color": "#FDE047",
        "symbol": "♃"
    },
    "Venus": {
        "activities": ["Love", "Art", "Luxury", "Beauty", "Pleasure"],
        "color": "#86EFAC",
        "symbol": "♀"
    },
    "Saturn": {
        "activities": ["Discipline", "Hard work", "Delays", "Structure", "Karma"],
        "color": "#FDA4AF",
        "symbol": "♄"
    }
}


def calculate_sunrise_sunset(date: datetime, latitude: float, longitude: float) -> Tuple[datetime, datetime]:
    """
    Calculate sunrise and sunset times for a given location and date
    
    This is a simplified calculation. For production, use a library like ephem or astral.
    
    Args:
        date: Date to calculate for
        latitude: Location latitude
        longitude: Location longitude
    
    Returns:
        Tuple of (sunrise, sunset) datetime objects
    """
    # Simplified calculation - for production use astral library
    # This assumes average sunrise at 6 AM and sunset at 6 PM
    # Adjust by latitude (very rough approximation)
    
    # Day of year
    day_of_year = date.timetuple().tm_yday
    
    # Solar declination (simplified)
    declination = 23.45 * math.sin(math.radians((360/365) * (day_of_year - 81)))
    
    # Hour angle (simplified)
    cos_hour_angle = -math.tan(math.radians(latitude)) * math.tan(math.radians(declination))
    
    # Clamp to valid range
    cos_hour_angle = max(-1, min(1, cos_hour_angle))
    
    hour_angle = math.degrees(math.acos(cos_hour_angle))
    
    # Sunrise and sunset in decimal hours
    sunrise_hour = 12 - (hour_angle / 15) - (longitude / 15)
    sunset_hour = 12 + (hour_angle / 15) - (longitude / 15)
    
    # Convert to datetime
    sunrise = date.replace(hour=int(sunrise_hour), minute=int((sunrise_hour % 1) * 60), second=0, microsecond=0)
    sunset = date.replace(hour=int(sunset_hour), minute=int((sunset_hour % 1) * 60), second=0, microsecond=0)
    
    return sunrise, sunset


def calculate_planetary_horas(date: datetime, latitude: float, longitude: float) -> List[Dict]:
    """
    Calculate all 24 planetary horas for a given day
    
    Args:
        date: Date to calculate horas for
        latitude: Location latitude
        longitude: Location longitude
    
    Returns:
        List of hora dictionaries with start_time, end_time, planet, activities
    """
    sunrise, sunset = calculate_sunrise_sunset(date, latitude, longitude)
    
    # Calculate day and night durations
    day_duration = (sunset - sunrise).total_seconds() / 3600  # in hours
    night_duration = 24 - day_duration
    
    # Each hora duration
    day_hora_duration = day_duration / 12  # 12 day horas
    night_hora_duration = night_duration / 12  # 12 night horas
    
    horas = []
    
    # Day horas (sunrise to sunset)
    current_time = sunrise
    day_of_week = date.weekday()  # 0=Monday, 6=Sunday
    
    # Determine starting planet based on day of week
    # Sunday=Sun, Monday=Moon, Tuesday=Mars, Wednesday=Mercury, Thursday=Jupiter, Friday=Venus, Saturday=Saturn
    weekday_to_planet = {
        6: "Sun",    # Sunday
        0: "Moon",   # Monday
        1: "Mars",   # Tuesday
        2: "Mercury",# Wednesday
        3: "Jupiter",# Thursday
        4: "Venus",  # Friday
        5: "Saturn"  # Saturday
    }
    
    starting_planet = weekday_to_planet[day_of_week]
    start_index = DAY_HORA_SEQUENCE.index(starting_planet)
    
    # Calculate 12 day horas
    for i in range(12):
        planet_index = (start_index + i) % 7
        planet = DAY_HORA_SEQUENCE[planet_index]
        
        end_time = current_time + timedelta(hours=day_hora_duration)
        
        horas.append({
            "start_time": current_time,
            "end_time": end_time,
            "planet": planet,
            "symbol": HORA_CHARACTERISTICS[planet]["symbol"],
            "activities": HORA_CHARACTERISTICS[planet]["activities"],
            "color": HORA_CHARACTERISTICS[planet]["color"],
            "is_day": True
        })
        
        current_time = end_time
    
    # Night horas (sunset to next sunrise)
    # Night sequence starts with the 5th planet from the day's starting planet
    night_start_index = (start_index + 4) % 7
    
    for i in range(12):
        planet_index = (night_start_index + i) % 7
        planet = DAY_HORA_SEQUENCE[planet_index]
        
        end_time = current_time + timedelta(hours=night_hora_duration)
        
        horas.append({
            "start_time": current_time,
            "end_time": end_time,
            "planet": planet,
            "symbol": HORA_CHARACTERISTICS[planet]["symbol"],
            "activities": HORA_CHARACTERISTICS[planet]["activities"],
            "color": HORA_CHARACTERISTICS[planet]["color"],
            "is_day": False
        })
        
        current_time = end_time
    
    return horas


def get_current_hora(date: datetime, latitude: float, longitude: float) -> Dict:
    """
    Get the current planetary hora
    
    Args:
        date: Current datetime
        latitude: Location latitude
        longitude: Location longitude
    
    Returns:
        Dict with current hora details
    """
    horas = calculate_planetary_horas(date, latitude, longitude)
    
    for hora in horas:
        if hora["start_time"] <= date < hora["end_time"]:
            return hora
    
    # Fallback to first hora if not found
    return horas[0]


def get_next_favorable_hora(
    current_time: datetime,
    latitude: float,
    longitude: float,
    activity_type: str
) -> Dict:
    """
    Find the next favorable hora for a specific activity type
    
    Args:
        current_time: Current datetime
        latitude: Location latitude
        longitude: Location longitude
        activity_type: Type of activity (career, relations, wellness, business, wealth)
    
    Returns:
        Dict with next favorable hora details
    """
    # Map activity types to favorable planets
    activity_to_planets = {
        "career": ["Sun", "Jupiter", "Saturn"],
        "relations": ["Moon", "Venus"],
        "wellness": ["Sun", "Moon", "Jupiter"],
        "business": ["Mercury", "Jupiter"],
        "wealth": ["Jupiter", "Venus", "Mercury"]
    }
    
    favorable_planets = activity_to_planets.get(activity_type, ["Jupiter"])
    
    horas = calculate_planetary_horas(current_time, latitude, longitude)
    
    # Find next hora with favorable planet
    for hora in horas:
        if hora["start_time"] > current_time and hora["planet"] in favorable_planets:
            return hora
    
    # If no favorable hora found today, return first favorable hora of next day
    next_day = current_time + timedelta(days=1)
    next_day_horas = calculate_planetary_horas(next_day, latitude, longitude)
    
    for hora in next_day_horas:
        if hora["planet"] in favorable_planets:
            return hora
    
    # Fallback
    return horas[0]


def format_hora_time(hora_datetime: datetime) -> str:
    """Format hora time for display"""
    return hora_datetime.strftime("%I:%M %p")
