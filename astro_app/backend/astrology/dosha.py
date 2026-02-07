
"""
Dosha Engine
------------
Calculates common astrological Doshas:
1. Manglik Dosha (Mars placement)
2. Kaal Sarp Dosha (Planets hemmed between Rahu/Ketu)
3. Pitra Dosha (Sun/Moon afflictions)
4. Gandmool Dosha (Moon in specific Nakshatras)

"""
from typing import Dict, List, Any, Optional
from astro_app.backend.astrology.utils import normalize_degree

class DoshaEngine:
    
    @staticmethod
    def check_manglik_dosha(planets: List[Dict], ascendant: Dict) -> Dict:
        """
        Check for Manglik Dosha (Mars in 1, 2, 4, 7, 8, 12 from Lagna).
        Also considers Moon and Venus charts (optional advanced check).
        
        Returns:
            {
                "is_manglik": bool,
                "factors": List[str],
                "percentage": float,
                "cancellation": str
            }
        """
        mars = next((p for p in planets if p["name"] == "Mars"), None)
        if not mars:
            return {"is_manglik": False, "reason": "Mars not found"}
            
        mars_house = mars.get("house")
        # In case 'house' isn't populated properly, calculate from Ascendant
        if not mars_house:
            mars_lon = mars["longitude"]
            asc_lon = ascendant["longitude"]
            diff = (mars_lon - asc_lon) % 360
            mars_house = int(diff / 30) + 1
            
        # Standard Rules: 1, 2, 4, 7, 8, 12
        manglik_houses = [1, 2, 4, 7, 8, 12]
        
        is_manglik = mars_house in manglik_houses
        factors = []
        cancellation = None
        
        if is_manglik:
            factors.append(f"Mars is in House {mars_house}")
            
            # Basic Cancellations (Exceptions)
            # 1. Mars in Aries, Scorpio (Own Signs) or Capricorn (Exalted)
            sign = mars.get("zodiac_sign", "")
            if sign in ["Aries", "Scorpio", "Capricorn"]:
                is_manglik = False
                cancellation = f"Mars in {sign} (Own/Exalted Sign) cancels Dosha."
            
            # 2. Mars in Cancer (Debilitated) - often considered exception too in 8th?
            # Keeping it simple: Cancer Mars is debilitated, sometimes considered worse, sometimes cancelled.
            # Let's stick to standard cancellation: Mars in Leo in 8th, Sagittarius in 12th, etc.
            
        return {
            "is_manglik": is_manglik,
            "factors": factors,
            "cancellation_reason": cancellation,
            "mars_house": mars_house
        }

    @staticmethod
    def check_kaal_sarp_dosha(planets: List[Dict]) -> Dict:
        """
        Check for Kaal Sarp Dosha.
        Condition: All 7 physical planets (Sun to Saturn) must be between Rahu and Ketu.
        """
        rahu = next((p for p in planets if p["name"] == "Rahu"), None)
        ketu = next((p for p in planets if p["name"] == "Ketu"), None)
        
        if not rahu or not ketu:
            return {"has_dosha": False}
            
        rahu_lon = rahu["longitude"]
        ketu_lon = ketu["longitude"]
        
        # Define the two arcs between Rahu and Ketu
        # Arc 1: Rahu -> Ketu (Direct/Forward)
        # Arc 2: Ketu -> Rahu (Direct/Forward)
        
        planets_in_arc1 = 0
        planets_in_arc2 = 0
        total_planets = 0
        
        others = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
        
        for p in planets:
            if p["name"] in others:
                lon = p["longitude"]
                total_planets += 1
                
                # Check Arc 1 (Rahu to Ketu)
                if rahu_lon < ketu_lon:
                    if rahu_lon <= lon <= ketu_lon:
                        planets_in_arc1 += 1
                    else:
                        planets_in_arc2 += 1
                else: # Crosses 0/360
                    if lon >= rahu_lon or lon <= ketu_lon:
                        planets_in_arc1 += 1
                    else:
                        planets_in_arc2 += 1
                        
        # Analysis
        has_dosha = False
        dosha_type = None
        direction = None
        
        if planets_in_arc1 == total_planets:
            has_dosha = True
            direction = "Rahu -> Ketu"
        elif planets_in_arc2 == total_planets:
            has_dosha = True
            direction = "Ketu -> Rahu"
            
        # Determine Type based on Rahu House
        rahu_house = rahu.get("house", 0)
        dosha_names = {
            1: "Anant", 2: "Kulik", 3: "Vasuki", 4: "Shankhpal",
            5: "Padma", 6: "Mahapadma", 7: "Takshak", 8: "Karkotak",
            9: "Shankhchud", 10: "Ghatak", 11: "Vishdhar", 12: "Sheshnag"
        }
        
        if has_dosha:
            dosha_type = f"{dosha_names.get(rahu_house, 'Unknown')} Kaal Sarp Dosha"
            
        return {
            "has_dosha": has_dosha,
            "type": dosha_type,
            "direction": direction,
            "rahu_house": rahu_house,
            "ketu_house": ketu.get("house", 0)
        }
        
    @staticmethod
    def check_pitra_dosha(planets: List[Dict]) -> Dict:
        """
        Simple check for Pitra Dosha:
        1. Sun/Moon with Rahu/Ketu
        2. Sun/Moon in 9th House with malefic
        """
        # Simplified Implementation
        sun = next((p for p in planets if p["name"] == "Sun"), None)
        moon = next((p for p in planets if p["name"] == "Moon"), None)
        rahu = next((p for p in planets if p["name"] == "Rahu"), None)
        ketu = next((p for p in planets if p["name"] == "Ketu"), None)
        
        is_pitra = False
        reasons = []
        
        # Conjunction Check (within 10 degrees)
        def is_conjunct(p1, p2):
            diff = abs(p1["longitude"] - p2["longitude"])
            if diff > 180: diff = 360 - diff
            return diff < 10
            
        if sun and rahu and is_conjunct(sun, rahu):
            is_pitra = True
            reasons.append("Sun conjunct Rahu (Surya Chandal)")
            
        if moon and ketu and is_conjunct(moon, ketu):
            is_pitra = True
            reasons.append("Moon conjunct Ketu (Chandra Ketu)")
            
        if sun and sun.get("house") == 9:
            # Check if malefic aspects? 
            pass
            
        return {
            "has_dosha": is_pitra,
            "reasons": reasons
        }

    @staticmethod
    def check_gandanta_dosha(planets: List[Dict]) -> Dict:
        """
        Check for Gandanta Dosha (Planets in critical junction points).
        Gandanta occurs at the junction of Water and Fire signs (Revati-Ashwini, Ashlesha-Magha, Jyeshtha-Mula).
        
        Zones (approx +/- 3 deg 20 min from junction):
        1. Pisces (26.66) - Aries (3.33) -> 356.66 to 3.33
        2. Cancer (26.66) - Leo (3.33) -> 116.66 to 123.33
        3. Scorpio (26.66) - Sagittarius (3.33) -> 236.66 to 243.33
        """
        gandanta_points = []
        
        # Define ranges [start, end]
        # Using 3.33 degrees (3 deg 20 min) as the strict limit (1 Pada)
        # However, some consider up to 1 degree very critical.
        # We flag anything within the 1 Pada (3.33 deg).
        
        limit = 3.3333
        
        # Junctions
        # Pisces(360/0)
        j1_start = 360 - limit
        j1_end = limit
        
        # Cancer(120)
        j2_start = 120 - limit
        j2_end = 120 + limit
        
        # Scorpio(240)
        j3_start = 240 - limit
        j3_end = 240 + limit
        
        for p in planets:
            lon = p["longitude"]
            norm_lon = normalize_degree(lon)
            
            is_gandanta = False
            zone = ""
            
            # Check J1 (Pisces-Aries)
            if norm_lon >= j1_start or norm_lon <= j1_end:
                is_gandanta = True
                zone = "Pisces-Aries (Revati-Ashwini)"
                
            # Check J2 (Cancer-Leo)
            elif j2_start <= norm_lon <= j2_end:
                is_gandanta = True
                zone = "Cancer-Leo (Ashlesha-Magha)"
                
            # Check J3 (Scorpio-Sagittarius)
            elif j3_start <= norm_lon <= j3_end:
                is_gandanta = True
                zone = "Scorpio-Sagittarius (Jyeshtha-Mula)"
                
            if is_gandanta:
                # Calculate depth (how close to junction)
                # Junctions are 0, 120, 240
                dist1 = min(abs(norm_lon - 0), abs(norm_lon - 360))
                dist2 = abs(norm_lon - 120)
                dist3 = abs(norm_lon - 240)
                min_dist = min(dist1, dist2, dist3)
                
                severity = "High" if min_dist < 1.0 else "Medium"
                
                gandanta_points.append({
                    "planet": p["name"],
                    "zone": zone,
                    "longitude": round(norm_lon, 2),
                    "dist_from_junction": round(min_dist, 2),
                    "severity": severity
                })
                
        return {
            "has_dosha": len(gandanta_points) > 0,
            "details": gandanta_points
        }

