import logging
from vedastro import *
from typing import Dict, Any, List
import datetime

logger = logging.getLogger(__name__)

# Map standard planet names to VedAstro Enums
PLANET_MAP = {
    "Sun": PlanetName.Sun,
    "Moon": PlanetName.Moon,
    "Mars": PlanetName.Mars,
    "Mercury": PlanetName.Mercury,
    "Jupiter": PlanetName.Jupiter,
    "Venus": PlanetName.Venus,
    "Saturn": PlanetName.Saturn,
    "Rahu": PlanetName.Rahu,
    "Ketu": PlanetName.Ketu
}

def _create_vedastro_objects(date_str: str, time_str: str, tz_str: str, lat: float, lon: float):
    """
    Creates VedAstro Time and GeoLocation objects.
    Time format: HH:mm DD/MM/YYYY +HH:mm
    """
    location = "User Location" # Generic name
    # VedAstro expects "HH:mm DD/MM/YYYY +HH:mm"
    # Ensure tz_str is +HH:mm
    if "Asia" in tz_str or "GMT" in tz_str:
        # Fallback for named timezones - this needs robust handling but assuming offset for now
        # The input locally is usually +05:30
        pass
        
    full_time_str = f"{time_str} {date_str} {tz_str}"
    
    geo = GeoLocation(location, lon, lat)
    time = Time(full_time_str, geo)
    return time, geo

def calculate_vedastro_planets(date_str: str, time_str: str, tz_str: str, lat: float, lon: float) -> list:
    """
    Calculates planet positions using VedAstro.
    Returns list of dicts: {name, longitude, is_retrograde, speed}
    """
    try:
        time_obj, _ = _create_vedastro_objects(date_str, time_str, tz_str, lat, lon)
        
        results = []
        for name, p_enum in PLANET_MAP.items():
            try:
                # 1. Longitude
                # Returns Dict with TotalDegrees
                lon_data = Calculate.PlanetNirayanaLongitude(p_enum, time_obj)
                longitude = 0.0
                if isinstance(lon_data, dict):
                    longitude = float(lon_data.get('TotalDegrees', 0.0))
                elif hasattr(lon_data, 'TotalDegrees'):
                    longitude = float(lon_data.TotalDegrees)
                
                # 2. Retrograde
                is_retro = False
                try:
                    # Returns bool
                    is_retro = Calculate.IsPlanetRetrograde(p_enum, time_obj)
                except:
                    pass
                
                # 3. Speed
                speed = 0.0
                try:
                    # PlanetSpeed might return dict or float
                    speed_data = Calculate.PlanetSpeed(p_enum, time_obj)
                    if isinstance(speed_data, (int, float)):
                        speed = float(speed_data)
                    elif isinstance(speed_data, dict):
                        speed = float(speed_data.get('Value', 0.0))
                except:
                    pass

                results.append({
                    "name": name,
                    "longitude": longitude,
                    "is_retrograde": is_retro,
                    "speed": speed
                })
            except Exception as pe:
                logger.error(f"Error calculating planet {name}: {pe}")
                # Fallback or skip?
                # If VedAstro fails for one planet, we might return 0 lon
                results.append({
                    "name": name,
                    "longitude": 0.0,
                    "is_retrograde": False,
                    "speed": 0.0
                })
                
        return results
    except Exception as e:
        logger.error(f"VedAstro Chart Calculation Error: {e}")
        return []

def calculate_vedastro_panchang(date_str: str, time_str: str, tz_str: str, lat: float, lon: float) -> Dict[str, Any]:
    """
    Calculates Panchang elements using VedAstro.
    Returns: {tithi, nakshatra, yoga, karana, day_of_week} (names/ids)
    """
    try:
        time_obj, _ = _create_vedastro_objects(date_str, time_str, tz_str, lat, lon)
        
        # 1. Tithi (LunarDay)
        tithi_name = "Unknown"
        try:
            t_data = Calculate.LunarDay(time_obj)
            if isinstance(t_data, dict):
                tithi_name = t_data.get('Name', 'Unknown')
            else:
                tithi_name = str(t_data)
        except: pass

        # 2. Nakshatra (MoonConstellation)
        nak_name = "Unknown"
        try:
            n_data = Calculate.MoonConstellation(time_obj)
            # vedastro returns string like "Swathi - 1" or object
            if isinstance(n_data, str):
                nak_name = n_data.split(' - ')[0]
            elif hasattr(n_data, 'Name'): # If object
                nak_name = str(n_data.Name)
            else:
                nak_name = str(n_data)
        except: pass

        # 3. Yoga (NithyaYoga)
        yoga_name = "Unknown"
        try:
            y_data = Calculate.NithyaYoga(time_obj)
            if isinstance(y_data, str):
                yoga_name = y_data
            else:
                yoga_name = str(y_data)
        except: pass

        # 4. Karana (Karana)
        karana_name = "Unknown"
        try:
            k_data = Calculate.Karana(time_obj)
            if isinstance(k_data, str):
                karana_name = k_data
            else:
                karana_name = str(k_data)
        except: pass

        # 5. Vara (DayOfWeek)
        vara_name = "Unknown"
        try:
            v_data = Calculate.DayOfWeek(time_obj)
            vara_name = str(v_data)
        except: pass

        return {
            "tithi": tithi_name,
            "nakshatra": nak_name,
            "yoga": yoga_name,
            "karana": karana_name,
            "day_of_week": vara_name
        }

    except Exception as e:
        logger.error(f"VedAstro Panchang Calculation Error: {e}")
        return {}
