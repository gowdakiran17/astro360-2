
from typing import Dict, List, Set

class AspectAnalyzer:
    """
    Analyzes Vedic planetary aspects (Drishti).
    - Standard 7th House Aspect
    - Special Aspects (Mars 4/8, Jupiter 5/9, Saturn 3/10)
    - Planet -> House Actvations
    """

    def analyze(self, chart_data: Dict) -> Dict:
        """
        Calculate aspects and activations.
        """
        planets = chart_data.get("planets", {})
        activations = {}
        
        for p_name, p_data in planets.items():
            if p_name in ["Rahu", "Ketu", "Uranus", "Neptune", "Pluto"]: continue
            
            p_house = p_data.get("house", 0)
            if not p_house: continue
            
            # Get aspected houses
            aspected = self._get_aspected_houses(p_name, p_house)
            activations[p_name] = aspected
            
        return {
            "planet_aspects": activations,
            "house_activations": self._invert_aspects(activations)
        }

    def _get_aspected_houses(self, planet: str, house: int) -> List[int]:
        """
        Return list of houses aspected by a planet from a given house.
        """
        aspects = [7]  # Everyone aspects 7th
        
        if planet == "Mars":
            aspects.extend([4, 8])
        elif planet == "Jupiter":
            aspects.extend([5, 9])
        elif planet == "Saturn":
            aspects.extend([3, 10])
            
        aspected_houses = []
        for aspect in aspects:
            # (Current + Aspect - 1) % 12 + 1 
            # E.g. Mars in 1 aspects 4: (1 + 4 - 1) = 4
            target = (house + aspect - 1) % 12
            if target == 0: target = 12
            aspected_houses.append(target)
            
        return aspected_houses

    def _invert_aspects(self, planet_aspects: Dict) -> Dict:
        """
        Invert mapping to show which planets impact a specific house.
        Output: { HouseNum: [PlanetName, ...] }
        """
        house_hits = {h: [] for h in range(1, 13)}
        
        for p_name, houses in planet_aspects.items():
            for h in houses:
                house_hits[h].append(p_name)
                
        return house_hits
