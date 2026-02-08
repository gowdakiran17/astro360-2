
from typing import Dict, List, Optional
from datetime import datetime

class DashaAnalyzer:
    """
    Analyzes Vimshottari Dasha periods.
    - Determines current MD/AD/PD
    - Calculates remaining duration
    - Assigns impact weights (MD: 40%, AD: 35%, PD: 25%)
    """

    WEIGHTS = {
        "mahadasha": 0.40,
        "antardasha": 0.35,
        "pratyantardasha": 0.25
    }

    def analyze(self, chart_data: Dict) -> Dict:
        """
        Extract and analyze current dasha state.
        """
        dasha_data = chart_data.get("dasha", {})
        
        # 1. Identify Current Periods
        current = dasha_data.get("current", {})
        
        # Fallback if "current" block is missing but "summary" exists (legacy format support)
        if not current and "summary" in dasha_data:
            summary = dasha_data["summary"]
            current = {
                "mahadasha": summary.get("current_mahadasha", {}),
                "antardasha": summary.get("current_antardasha", {}),
                "pratyantardasha": summary.get("current_pratyantardasha", {})
            }

        # 2. Structure Analysis
        analysis = {
            "mahadasha": {
                "lord": current.get("mahadasha", {}).get("lord", "Unknown"),
                "end_date": current.get("mahadasha", {}).get("end", ""),
                "weight": self.WEIGHTS["mahadasha"]
            },
            "antardasha": {
                "lord": current.get("antardasha", {}).get("lord", "Unknown"),
                "end_date": current.get("antardasha", {}).get("end", ""),
                "weight": self.WEIGHTS["antardasha"]
            },
            "pratyantardasha": {
                "lord": current.get("pratyantardasha", {}).get("lord", "Unknown"),
                "end_date": current.get("pratyantardasha", {}).get("end", ""),
                "weight": self.WEIGHTS["pratyantardasha"]
            }
        }
        
        # 3. Add Interpretive Keys
        # (e.g., is MD lord functional malefic?)
        # This requires ChartProcessor data, which will be merged by the Engine.
        
        return analysis

    def check_activation(self, dasha_lords: Dict, house_lords: Dict) -> List[int]:
        """
        Return list of houses activated by current dasha lords.
        Usage: engine calls this after getting chart + dasha data.
        """
        activated_houses = []
        
        lords = [
            dasha_lords["mahadasha"]["lord"], 
            dasha_lords["antardasha"]["lord"],
            dasha_lords["pratyantardasha"]["lord"]
        ]
        
        for house_num, details in house_lords.items():
            if details["lord"] in lords:
                activated_houses.append(house_num)
                
        return list(set(activated_houses))
