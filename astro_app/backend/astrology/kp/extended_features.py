
from typing import Dict, List, Any
import math

class ExtendedFeatures:
    
    ZODIAC_INFO = {
        "Aries": {"lord": "Mars", "element": "Agni", "gender": "Male", "nature": "Chara", "stone": "Coral", "color": "Red", "day": "Tuesday", "deity": "Lord Kartikeya"},
        "Taurus": {"lord": "Venus", "element": "Bhu", "gender": "Female", "nature": "Sthira", "stone": "Diamond", "color": "White", "day": "Friday", "deity": "Goddess Lakshmi"},
        "Gemini": {"lord": "Mercury", "element": "Vayu", "gender": "Male", "nature": "Dwi", "stone": "Emerald", "color": "Green", "day": "Wednesday", "deity": "Lord Vishnu"},
        "Cancer": {"lord": "Moon", "element": "Jala", "gender": "Female", "nature": "Chara", "stone": "Pearl", "color": "White", "day": "Monday", "deity": "Goddess Parvati"},
        "Leo": {"lord": "Sun", "element": "Agni", "gender": "Male", "nature": "Sthira", "stone": "Ruby", "color": "Orange", "day": "Sunday", "deity": "Lord Shiva"},
        "Virgo": {"lord": "Mercury", "element": "Bhu", "gender": "Female", "nature": "Dwi", "stone": "Emerald", "color": "Green", "day": "Wednesday", "deity": "Lord Vishnu"},
        "Libra": {"lord": "Venus", "element": "Vayu", "gender": "Male", "nature": "Chara", "stone": "Diamond/Opal", "color": "White", "day": "Friday", "deity": "Goddess Lakshmi"},
        "Scorpio": {"lord": "Mars", "element": "Jala", "gender": "Female", "nature": "Sthira", "stone": "Coral", "color": "Red", "day": "Tuesday", "deity": "Lord Hanuman"},
        "Sagittarius": {"lord": "Jupiter", "element": "Agni", "gender": "Male", "nature": "Dwi", "stone": "Yellow Sapphire", "color": "Yellow", "day": "Thursday", "deity": "Lord Dakshinamurthy"},
        "Capricorn": {"lord": "Saturn", "element": "Bhu", "gender": "Female", "nature": "Chara", "stone": "Blue Sapphire", "color": "Blue", "day": "Saturday", "deity": "Lord Hanuman"},
        "Aquarius": {"lord": "Saturn", "element": "Vayu", "gender": "Male", "nature": "Sthira", "stone": "Blue Sapphire", "color": "Blue", "day": "Saturday", "deity": "Lord Shiva"},
        "Pisces": {"lord": "Jupiter", "element": "Jala", "gender": "Female", "nature": "Dwi", "stone": "Yellow Sapphire", "color": "Yellow", "day": "Thursday", "deity": "Lord Vishnu"}
    }

    @staticmethod
    def calculate_aspects(planets: List[Dict], houses: List[Dict]) -> Dict:
        """
        Calculate aspects for planets and houses (Vedic/Graha Drishti).
        
        Vedic Aspect Rules:
        - All planets aspect the 7th house from their position
        - Mars: 4th, 7th, 8th houses
        - Jupiter: 5th, 7th, 9th houses
        - Saturn: 3rd, 7th, 10th houses
        - Rahu/Ketu: 5th, 7th, 9th houses (like Jupiter)
        """
        planet_house_map = {p["planet"]: p["house"] for p in planets}
        
        # Aspect rules: which houses each planet aspects (offsets from their position)
        aspect_rules = {
            "Sun": [7], 
            "Moon": [7], 
            "Mercury": [7], 
            "Venus": [7],
            "Mars": [4, 7, 8],
            "Jupiter": [5, 7, 9],
            "Saturn": [3, 7, 10],
            "Rahu": [5, 7, 9], 
            "Ketu": [5, 7, 9]
        }
        
        # 1. Planet -> House Aspects
        planet_to_house_aspects = {}
        house_aspects_from = {h: [] for h in range(1, 13)}
        
        for p_name, p_house in planet_house_map.items():
            rules = aspect_rules.get(p_name, [7])
            aspected_houses = []
            for offset in rules:
                # Correct formula: (house + offset - 1) % 12 + 1
                target_house = (p_house + offset - 1) % 12 + 1
                aspected_houses.append(target_house)
                house_aspects_from[target_house].append(p_name)
            planet_to_house_aspects[p_name] = sorted(aspected_houses)

        # 2. Planet -> Planet Aspects (Mutual Aspects)
        planet_mutual_aspects = {}
        for p_name in planet_house_map:
            aspected_by = []
            p_house = planet_house_map[p_name]
            
            # Check which planets aspect this planet's house
            for potential_aspecting in planet_house_map:
                if potential_aspecting == p_name: 
                    continue
                
                # Is p_house in the list of houses aspected by potential_aspecting?
                if p_house in planet_to_house_aspects[potential_aspecting]:
                    aspected_by.append(potential_aspecting)
            
            planet_mutual_aspects[p_name] = aspected_by

        return {
            "planet_aspects": planet_to_house_aspects,
            "house_aspects": house_aspects_from,
            "mutual_aspects": planet_mutual_aspects
        }

    @staticmethod
    def calculate_strengths(planets: List[Dict], houses: List[Dict]) -> Dict:
        """
        Calculate basic Graha and Bhava strengths.
        """
        # Simplified Strength Logic (Mocking Shadbala-like percentage)
        # Real Shadbala is huge. We recreate the output format requested:
        # P -> Lord of X, Placed in Y -> Score %
        
        graha_strength = []
        for p in planets:
            p_name = p["planet"]
            if p_name in ["Rahu", "Ketu"]:
                desc = f"Placed in: {p['house']}"
                score = 65 # Average for nodes
            else:
                # Find houses owned
                owned_houses = []
                # Looking up global ZODIAC_LORDS needs context, but we can assume generic map if not passed
                # Actually we need to know the chart's house cusps lordships
                # For now we'll approximate or need house data with signs
                
                # Mock Score based on dignity
                # dignity = get_planetary_dignity(p_name, ...)
                # if Exalted: 85%, Own: 75%, Friend: 60%, Neutral: 50%, Enemy: 40%, Debilitated: 25%
                
                desc = f"Placed in: {p['house']}"
                score = 70 # Default
            
            graha_strength.append({
                "planet": p_name,
                "description": desc,
                "strength_percent": score,
                "result": "Good" if score >= 60 else "Normal"
            })
            
        bhava_strength = []
        house_names = [
            "Lagna Bhava (Overall life)", "Dhana Bhava (Finance)", "Bhratru Bhava (Siblings)",
            "Matru Bhava (Mother)", "Putra Bhava (Children)", "Shatru Bhava (Enemies)",
            "Kalatra Bhava (Spouse)", "Ayu Bhava (Longevity)", "Bhagya Bhava (Fortune)",
            "Rajya Bhava (Career)", "Labha Bhava (Gains)", "Vyaya Bhava (Losses)"
        ]
        
        for h in houses:
            h_num = h["house"]
            # Mock points (20-35 range)
            points = 25 + (h_num % 5) 
            res = "Good" if points > 28 else "Normal"
            bhava_strength.append({
                "house": h_num,
                "name": house_names[h_num-1],
                "points": points,
                "result": res
            })
            
        return {
            "graha_strength": graha_strength,
            "bhava_strength": bhava_strength
        }

    @staticmethod
    def get_extended_planet_details(planets: List[Dict]) -> List[Dict]:
        """
        Add Avastha, Gender, Element, etc.
        """
        extended = []
        for p in planets:
            sign = p["sign"]
            info = ExtendedFeatures.ZODIAC_INFO.get(sign, {})
            
            # Baladi Avastha (basic based on odd/even sign and degree)
            deg = p["degree_in_sign"]
            # Logic: 0-6, 6-12, 12-18, 18-24, 24-30
            # Odd Signs: Bala, Kumara, Yuva, Vriddha, Mrita
            # Even Signs: Mrita, Vriddha, Yuva, Kumara, Bala
            
            # Simple Odd list
            odd_signs = ["Aries", "Gemini", "Leo", "Libra", "Sagittarius", "Aquarius"]
            avasthas_odd = ["Bala (Infant)", "Kumara (Youth)", "Yuva (Adult)", "Vriddha (Old)", "Mrita (Dead)"]
            
            idx = int(deg / 6)
            if idx > 4: idx = 4
            
            if sign in odd_signs:
                avastha = avasthas_odd[idx]
            else:
                avastha = avasthas_odd[4-idx] # Reverse order
            
            extended.append({
                **p,
                "avastha": avastha,
                "gender": "Male" if p["planet"] in ["Sun", "Mars", "Jupiter"] else "Female" if p["planet"] in ["Moon", "Venus", "Rahu", "Ketu"] else "Neutral",
                "element": info.get("element", "Unknown"),
                "nature": info.get("nature", "Unknown"),
                "position": "Uchcha" if "Exalted" in p.get("dignity", "") else "Sama"
            })
        return extended

    @staticmethod
    def calculate_lucky_points(ascendant_sign: str) -> Dict:
        """
        Calculate Lucky attributes based on Lagna.
        """
        info = ExtendedFeatures.ZODIAC_INFO.get(ascendant_sign, {})
        lord = info.get("lord", "Unknown")
        
        return {
            "life_stone": info.get("stone", "-"),
            "lucky_stone": "Based on 9th Lord", # Placeholder logic could be improved
            "punya_stone": "Based on 5th Lord",
            "favorable_deity": info.get("deity", "-"),
            "favorable_metal": "Gold" if lord in ["Jupiter", "Sun", "Mars"] else "Silver" if lord in ["Moon", "Venus"] else "Iron/Lead",
            "favorable_color": info.get("color", "-"),
            "favorable_day": info.get("day", "-"),
            "favorable_direction": "East" if info.get("element") == "Agni" else "North"
        }

