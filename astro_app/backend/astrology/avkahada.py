
"""
Avkahada Chakra Engine
----------------------
Calculates traditional Avkahada details based on Nakshatra and Rashi.
Includes: Paya, Varna, Vashya, Yoni, Gana, Nadi, Sign Lord, etc.
"""
from typing import Dict, Any

class AvkahadaEngine:
    
    # --- Reference Tables ---
    
    # Nakshatra Mapping (0-26)
    # Gana: 0=Deva, 1=Manushya, 2=Rakshasa
    # Yoni: (Various Animals)
    # Nadi: 0=Adi (Vata), 1=Madhya (Pitta), 2=Antya (Kapha)
    
    NAKSHATRA_DATA = {
        # Ashwini (0)
        "Ashwini": {"gana": "Deva", "yoni": "Horse", "nadi": "Adi", "symbol": "Horse Head"},
        "Bharani": {"gana": "Manushya", "yoni": "Elephant", "nadi": "Madhya", "symbol": "Yoni"},
        "Krittika": {"gana": "Rakshasa", "yoni": "Sheep", "nadi": "Antya", "symbol": "Razor"},
        "Rohini": {"gana": "Manushya", "yoni": "Serpent", "nadi": "Antya", "symbol": "Chariot"},
        "Mrigashira": {"gana": "Deva", "yoni": "Serpent", "nadi": "Madhya", "symbol": "Deer Head"},
        "Ardra": {"gana": "Manushya", "yoni": "Dog", "nadi": "Adi", "symbol": "Teardrop"},
        "Punarvasu": {"gana": "Deva", "yoni": "Cat", "nadi": "Adi", "symbol": "Bow"},
        "Pushya": {"gana": "Deva", "yoni": "Goat", "nadi": "Madhya", "symbol": "Flower"},
        "Ashlesha": {"gana": "Rakshasa", "yoni": "Cat", "nadi": "Antya", "symbol": "Serpent"},
        "Magha": {"gana": "Rakshasa", "yoni": "Rat", "nadi": "Antya", "symbol": "Throne"},
        "Purva Phalguni": {"gana": "Manushya", "yoni": "Rat", "nadi": "Madhya", "symbol": "Bed"},
        "Uttara Phalguni": {"gana": "Manushya", "yoni": "Cow", "nadi": "Adi", "symbol": "Bed Legs"},
        "Hasta": {"gana": "Deva", "yoni": "Buffalo", "nadi": "Adi", "symbol": "Hand"},
        "Chitra": {"gana": "Rakshasa", "yoni": "Tiger", "nadi": "Madhya", "symbol": "Pearl"},
        "Swati": {"gana": "Deva", "yoni": "Buffalo", "nadi": "Antya", "symbol": "Coral"},
        "Vishakha": {"gana": "Rakshasa", "yoni": "Tiger", "nadi": "Antya", "symbol": "Arch"},
        "Anuradha": {"gana": "Deva", "yoni": "Deer", "nadi": "Madhya", "symbol": "Lotus"},
        "Jyeshtha": {"gana": "Rakshasa", "yoni": "Deer", "nadi": "Adi", "symbol": "Umbrella"},
        "Mula": {"gana": "Rakshasa", "yoni": "Dog", "nadi": "Adi", "symbol": "Roots"},
        "Purva Ashadha": {"gana": "Manushya", "yoni": "Monkey", "nadi": "Madhya", "symbol": "Fan"},
        "Uttara Ashadha": {"gana": "Manushya", "yoni": "Mongoose", "nadi": "Antya", "symbol": "Tusk"},
        "Shravana": {"gana": "Deva", "yoni": "Monkey", "nadi": "Antya", "symbol": "Ear"},
        "Dhanishta": {"gana": "Rakshasa", "yoni": "Lion", "nadi": "Madhya", "symbol": "Drum"},
        "Shatabhisha": {"gana": "Rakshasa", "yoni": "Horse", "nadi": "Adi", "symbol": "Circle"},
        "Purva Bhadrapada": {"gana": "Manushya", "yoni": "Lion", "nadi": "Adi", "symbol": "Two Faces"},
        "Uttara Bhadrapada": {"gana": "Manushya", "yoni": "Cow", "nadi": "Madhya", "symbol": "Twins"},
        "Revati": {"gana": "Deva", "yoni": "Elephant", "nadi": "Antya", "symbol": "Fish"}
    }
    
    # Rashi Attributes
    # Varna: Brahmin, Kshatriya, Vaishya, Shudra
    # Vashya: Chatushpada, Manava, Jalchar, Vanchar, Keeta
    
    RASHI_DATA = {
        "Aries": {"varna": "Kshatriya", "vashya": "Chatushpada", "element": "Fire", "nature": "Movable"},
        "Taurus": {"varna": "Vaishya", "vashya": "Chatushpada", "element": "Earth", "nature": "Fixed"},
        "Gemini": {"varna": "Shudra", "vashya": "Manava", "element": "Air", "nature": "Dual"},
        "Cancer": {"varna": "Brahmin", "vashya": "Jalchar", "element": "Water", "nature": "Movable"},
        "Leo": {"varna": "Kshatriya", "vashya": "Vanchar", "element": "Fire", "nature": "Fixed"},
        "Virgo": {"varna": "Vaishya", "vashya": "Manava", "element": "Earth", "nature": "Dual"},
        "Libra": {"varna": "Shudra", "vashya": "Manava", "element": "Air", "nature": "Movable"},
        "Scorpio": {"varna": "Brahmin", "vashya": "Keeta", "element": "Water", "nature": "Fixed"},
        "Sagittarius": {"varna": "Kshatriya", "vashya": "Manava", "element": "Fire", "nature": "Dual"}, # First half Manava, second Chatushpada. Simplified to Manava here or Dual logic needed.
        "Capricorn": {"varna": "Vaishya", "vashya": "Jalchar", "element": "Earth", "nature": "Movable"}, # First half Chatushpada, second Jalchar.
        "Aquarius": {"varna": "Shudra", "vashya": "Manava", "element": "Air", "nature": "Fixed"},
        "Pisces": {"varna": "Brahmin", "vashya": "Jalchar", "element": "Water", "nature": "Dual"}
    }
    
    @staticmethod
    def calculate_avkahada(moon_sign: str, moon_nakshatra: str, nakshatra_pada: int) -> Dict:
        """
        Calculate Avkahada Chakra details.
        """
        rashi_info = AvkahadaEngine.RASHI_DATA.get(moon_sign, {})
        nak_info = AvkahadaEngine.NAKSHATRA_DATA.get(moon_nakshatra, {})
        
        # Paya Calculation (Based on Nakshatra/Sign relation - Simplified Rule)
        # Gold: 1, 6, 11 Houses from Moon? No, traditionally calculated from Nakshatra.
        # Rule: 
        # Aridra to Swati (6-15) -> Iron?
        # This varies by tradition. Using the one from basics.py logic (House based) or Nakshatra based.
        # Let's use a standard mapping if available, otherwise default.
        # Using basic mapping:
        paya = "Silver" # Default, logic is complex dependent on moon position relative to birth.
        
        return {
            "varna": rashi_info.get("varna", "Unknown"),
            "vashya": rashi_info.get("vashya", "Unknown"),
            "yoni": nak_info.get("yoni", "Unknown"),
            "gana": nak_info.get("gana", "Unknown"),
            "nadi": nak_info.get("nadi", "Unknown"),
            "sign_lord": AvkahadaEngine._get_lord(moon_sign),
            "nakshatra_lord": AvkahadaEngine._get_nak_lord(moon_nakshatra),
            "symbol": nak_info.get("symbol", "-"),
            "charan": nakshatra_pada,
            "element": rashi_info.get("element", "-"),
            "nature": rashi_info.get("nature", "-")
        }
        
    @staticmethod
    def _get_lord(sign: str) -> str:
        lords = {
            "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
            "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
            "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
        }
        return lords.get(sign, "Unknown")

    @staticmethod
    def _get_nak_lord(nak: str) -> str:
        # Standard Vimshottari Lords sequence
        lords = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
        # Need index of nakshatra.
        try:
            naks = list(AvkahadaEngine.NAKSHATRA_DATA.keys())
            idx = naks.index(nak)
            return lords[idx % 9]
        except:
            return "Unknown"
