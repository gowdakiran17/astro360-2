"""
VedAstro KP API Service
Integrates VedAstro REST API for KP astrology calculations
"""

import requests
import logging
from typing import Dict, List, Any
from datetime import datetime

logger = logging.getLogger(__name__)


class VedAstroKPService:
    """
    Service to interact with VedAstro REST API for KP calculations
    API Documentation: https://vedastro.org/APIBuilder
    """
    
    BASE_URL = "https://api.vedastro.org"
    
    @staticmethod
    def _format_time_for_vedastro(date: str, time: str, timezone: str) -> str:
        """
        Convert our format to VedAstro format: "HH:mm DD/MM/YYYY +HH:mm"
        
        Args:
            date: DD/MM/YYYY
            time: HH:mm
            timezone: +HH:mm or timezone name
        
        Returns:
            VedAstro formatted time string
        """
        # Ensure timezone is in +HH:mm format
        if not timezone.startswith('+') and not timezone.startswith('-'):
            # Default to IST if timezone name given
            timezone = "+05:30"
        
        return f"{time} {date} {timezone}"
    
    @staticmethod
    def _format_location(latitude: float, longitude: float, name: str = "User Location") -> str:
        """
        Format location for VedAstro API
        
        Returns:
            Location string in VedAstro format
        """
        return f"{name},{longitude},{latitude}"
    
    @staticmethod
    def get_all_planet_data(birth_details: Dict) -> Dict:
        """
        Get all planet data from VedAstro including KP details
        
        Args:
            birth_details: {date, time, timezone, latitude, longitude}
        
        Returns:
            Complete planet data with KP information
        """
        try:
            # Parse date and time
            # Input: DD/MM/YYYY, HH:mm, +HH:mm
            date_parts = birth_details["date"].split("/")  # [DD, MM, YYYY]
            time_parts = birth_details["time"].split(":")  # [HH, mm]
            
            # VedAstro URL format: /Time/HH:mm/DD/MM/YYYY/+HH:mm
            # Example: /Time/00:12/04/02/2024/+01:00
            
            url = (
                f"{VedAstroKPService.BASE_URL}/api/Calculate/AllPlanetData"
                f"/PlanetName/All"
                f"/Location/{birth_details['latitude']},{birth_details['longitude']}"
                f"/Time/{birth_details['time']}/{date_parts[0]}/{date_parts[1]}/{date_parts[2]}/{birth_details['timezone']}"
                f"/Ayanamsa/KRISHNAMURTI"
            )
            
            logger.info(f"Calling VedAstro AllPlanetData API: {url}")
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            logger.info("Successfully retrieved planet data from VedAstro")
            return data
            
        except requests.exceptions.RequestException as e:
            logger.error(f"VedAstro API error (AllPlanetData): {e}")
            return {}
        except Exception as e:
            logger.error(f"Error calling VedAstro AllPlanetData: {e}")
            return {}
    
    @staticmethod
    def get_all_house_data(birth_details: Dict) -> Dict:
        """
        Get all house data from VedAstro including KP cusps
        
        Args:
            birth_details: {date, time, timezone, latitude, longitude}
        
        Returns:
            Complete house data with KP cusp information
        """
        try:
            # Parse date and time
            date_parts = birth_details["date"].split("/")
            
            url = (
                f"{VedAstroKPService.BASE_URL}/api/Calculate/AllHouseData"
                f"/HouseNumber/All"
                f"/Location/{birth_details['latitude']},{birth_details['longitude']}"
                f"/Time/{birth_details['time']}/{date_parts[0]}/{date_parts[1]}/{date_parts[2]}/{birth_details['timezone']}"
                f"/Ayanamsa/KRISHNAMURTI"
            )
            
            logger.info(f"Calling VedAstro AllHouseData API: {url}")
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            logger.info("Successfully retrieved house data from VedAstro")
            return data
            
        except requests.exceptions.RequestException as e:
            logger.error(f"VedAstro API error (AllHouseData): {e}")
            return {}
        except Exception as e:
            logger.error(f"Error calling VedAstro AllHouseData: {e}")
            return {}
    
    @staticmethod
    def parse_planet_kp_data(vedastro_planet_data: Dict) -> List[Dict]:
        """
        Parse VedAstro planet data into our KP format
        
        Returns:
            List of planets with KP details
        """
        planets = []
        
        # VedAstro returns data for each planet
        # We need to extract: longitude, sign, nakshatra, star_lord, sub_lord, sub_sub_lord
        
        planet_names = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
        
        for planet_name in planet_names:
            try:
                # VedAstro structure might be: {PlanetName: {data}}
                # We'll need to adapt based on actual API response
                planet_info = vedastro_planet_data.get(planet_name, {})
                
                planets.append({
                    "planet": planet_name,
                    "longitude": planet_info.get("Longitude", 0),
                    "sign": planet_info.get("Sign", ""),
                    "degree_in_sign": planet_info.get("DegreeInSign", 0),
                    "nakshatra": planet_info.get("Nakshatra", ""),
                    "star_lord": planet_info.get("StarLord", ""),
                    "sub_lord": planet_info.get("SubLord", ""),
                    "sub_sub_lord": planet_info.get("SubSubLord", ""),
                    "house": planet_info.get("House", 1),
                    "is_retro": planet_info.get("IsRetrograde", False)
                })
            except Exception as e:
                logger.error(f"Error parsing planet {planet_name}: {e}")
                continue
        
        return planets
    
    @staticmethod
    def parse_house_kp_data(vedastro_house_data: Dict) -> List[Dict]:
        """
        Parse VedAstro house data into our KP format
        
        Returns:
            List of house cusps with KP details
        """
        houses = []
        
        for house_num in range(1, 13):
            try:
                house_key = f"House{house_num}"
                house_info = vedastro_house_data.get(house_key, {})
                
                houses.append({
                    "house": house_num,
                    "longitude": house_info.get("Longitude", 0),
                    "sign": house_info.get("Sign", ""),
                    "degree_in_sign": house_info.get("DegreeInSign", 0),
                    "nakshatra": house_info.get("Nakshatra", ""),
                    "star_lord": house_info.get("StarLord", ""),
                    "sub_lord": house_info.get("SubLord", ""),
                })
            except Exception as e:
                logger.error(f"Error parsing house {house_num}: {e}")
                continue
        
        return houses
    
    @staticmethod
    def calculate_kp_chart_vedastro(birth_details: Dict) -> Dict:
        """
        Main method to calculate complete KP chart using VedAstro API
        
        Args:
            birth_details: {date, time, timezone, latitude, longitude}
        
        Returns:
            Complete KP chart data
        """
        logger.info("Calculating KP chart using VedAstro API")
        
        # Get planet and house data from VedAstro
        planet_data = VedAstroKPService.get_all_planet_data(birth_details)
        house_data = VedAstroKPService.get_all_house_data(birth_details)
        
        if not planet_data or not house_data:
            logger.error("Failed to retrieve data from VedAstro API")
            return {}
        
        # Parse into our format
        planets = VedAstroKPService.parse_planet_kp_data(planet_data)
        houses = VedAstroKPService.parse_house_kp_data(house_data)
        
        return {
            "planets": planets,
            "house_cusps": houses,
            "source": "VedAstro API"
        }
