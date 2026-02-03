"""
KP Precision Scoring System
Calculates mathematical percentage scores for Dasha periods based on
favorable vs unfavorable house significators.

Scoring Logic:
- Favorable houses: 1,2,3,4,5,7,9,10,11 (growth, gains, success)
- Unfavorable houses: 6,8,12 (obstacles, losses, expenses)
- Score = (Favorable Hits / Total Hits) × 100
"""

from typing import Dict, List

# House classifications
FAVORABLE_HOUSES = [1, 2, 3, 4, 5, 7, 9, 10, 11]
UNFAVORABLE_HOUSES = [6, 8, 12]


def calculate_period_score(
    planet_name: str,
    significators: Dict[int, Dict[str, List[str]]]
) -> Dict:
    """
    Calculate precision score for a planet's period.
    
    Args:
        planet_name: Name of the planet (Dasha lord)
        significators: Significators dict from kp_significators
        
    Returns:
        Dict with score, rating, and breakdown
    """
    # Get all houses this planet signifies
    signified_houses = []
    for house_num in range(1, 13):
        if planet_name in significators[house_num]["all"]:
            signified_houses.append(house_num)
    
    # Count favorable and unfavorable
    favorable_count = len([h for h in signified_houses if h in FAVORABLE_HOUSES])
    unfavorable_count = len([h for h in signified_houses if h in UNFAVORABLE_HOUSES])
    total_count = len(signified_houses)
    
    # Calculate score
    if total_count == 0:
        score = 50  # Neutral if no significators
    else:
        score = int((favorable_count / total_count) * 100)
    
    # Determine rating
    if score >= 75:
        rating = "EXCELLENT"
        color = "#10b981"  # Green
    elif score >= 60:
        rating = "GOOD"
        color = "#3b82f6"  # Blue
    elif score >= 40:
        rating = "MIXED"
        color = "#f59e0b"  # Amber
    else:
        rating = "WEAK"
        color = "#ef4444"  # Red
    
    return {
        "planet": planet_name,
        "score": score,
        "rating": rating,
        "color": color,
        "favorable_houses": [h for h in signified_houses if h in FAVORABLE_HOUSES],
        "unfavorable_houses": [h for h in signified_houses if h in UNFAVORABLE_HOUSES],
        "total_signified_houses": signified_houses,
        "favorable_count": favorable_count,
        "unfavorable_count": unfavorable_count,
        "total_count": total_count
    }


def calculate_all_period_scores(
    significators: Dict[int, Dict[str, List[str]]]
) -> Dict[str, Dict]:
    """
    Calculate scores for all planets.
    
    Args:
        significators: Significators dict
        
    Returns:
        Dict mapping planet name to score dict
    """
    planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
    
    scores = {}
    for planet in planets:
        scores[planet] = calculate_period_score(planet, significators)
    
    return scores


def get_antardasha_quality(
    mahadasha_lord: str,
    antardasha_lord: str,
    significators: Dict[int, Dict[str, List[str]]]
) -> Dict:
    """
    Calculate quality of an Antardasha period combining both lords.
    
    Args:
        mahadasha_lord: Mahadasha lord
        antardasha_lord: Antardasha lord
        significators: Significators dict
        
    Returns:
        Dict with combined score and quality assessment
    """
    # Get scores for both lords
    md_score = calculate_period_score(mahadasha_lord, significators)
    ad_score = calculate_period_score(antardasha_lord, significators)
    
    # Combined score (weighted average: 40% MD, 60% AD)
    combined_score = int(md_score["score"] * 0.4 + ad_score["score"] * 0.6)
    
    # Determine quality
    if combined_score >= 75:
        quality = "Strong Growth"
        description = "Highly favorable period for progress and success"
    elif combined_score >= 60:
        quality = "Good Results"
        description = "Favorable period with positive outcomes"
    elif combined_score >= 40:
        quality = "Mixed Results"
        description = "Period with both opportunities and challenges"
    else:
        quality = "Caution Period"
        description = "Challenging period requiring patience and care"
    
    return {
        "mahadasha_lord": mahadasha_lord,
        "antardasha_lord": antardasha_lord,
        "mahadasha_score": md_score["score"],
        "antardasha_score": ad_score["score"],
        "combined_score": combined_score,
        "quality": quality,
        "description": description,
        "mahadasha_houses": md_score["total_signified_houses"],
        "antardasha_houses": ad_score["total_signified_houses"]
    }


def calculate_aspect_strengths(
    significators: Dict[int, Dict[str, List[str]]]
) -> Dict[str, Dict[str, int]]:
    """
    Calculate strength of planets on various aspects (Intelligence, Efficiency, etc.)
    using weighted significator levels.
    
    Weights:
    - Level 1 (Star Lord): 15 points
    - Level 2 (Sign Lord): 10 points
    - Level 3 (Aspect/In): 5 points
    - Level 4 (Sub Lord connection): 2 points
    
    Args:
        significators: Significators dict (house_num -> {level_1: [], level_2: [], ...})
        
    Returns:
        Dict mapping planet name to aspect scores
    """
    planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
    
    # Define aspect rules (Positive Houses vs Negative Houses)
    aspect_rules = {
        "Intelligence": {
            "positive": [5, 4, 9, 2],
            "negative": [6, 8, 12],
            "karakas": ["Mercury", "Jupiter"]
        },
        "Efficiency": {
            "positive": [3, 6, 10, 11],
            "negative": [8, 12],
            "karakas": ["Mars", "Saturn"]
        },
        "Love/Family": {
            "positive": [2, 4, 5, 7, 11],
            "negative": [6, 8, 10, 12],
            "karakas": ["Venus", "Moon"]
        },
        "Health": {
            "positive": [1, 5, 9, 11], 
            "negative": [6, 8, 12],    
            "karakas": ["Sun"]
        },
        "Social Life": {
            "positive": [3, 7, 11],
            "negative": [6, 8, 12],
            "karakas": ["Mercury", "Venus"]
        },
        "Career": {
            "positive": [2, 6, 10, 11],
            "negative": [5, 8, 12],
            "karakas": ["Sun", "Saturn"]
        },
        "Finance": {
            "positive": [2, 6, 10, 11, 5, 9],
            "negative": [8, 12],
            "karakas": ["Jupiter", "Venus"]
        }
    }
    
    result = {}
    
    for planet in planets:
        planet_scores = {}
        
        for aspect, rules in aspect_rules.items():
            score = 0
            
            # Calculate score based on weighted signification of houses
            
            # 1. Positive Houses contribution
            for h in rules["positive"]:
                # Check signification strength of this planet for house h
                sig_data = significators.get(h, {})
                
                # We interpret levels as additive or max? Usually max level wins or additive.
                # Let's use additive for richness.
                if planet in sig_data.get("level_1", []): score += 15
                if planet in sig_data.get("level_2", []): score += 10
                if planet in sig_data.get("level_3", []): score += 5
                if planet in sig_data.get("level_4", []): score += 2
                
            # 2. Negative Houses deduction
            for h in rules["negative"]:
                sig_data = significators.get(h, {})
                
                deduction = 0
                if planet in sig_data.get("level_1", []): deduction += 12 # Penalize strongly
                if planet in sig_data.get("level_2", []): deduction += 8
                if planet in sig_data.get("level_3", []): deduction += 4
                if planet in sig_data.get("level_4", []): deduction += 2
                
                score -= deduction

            # 3. Karaka Bonus
            if planet in rules["karakas"]:
                score += 15
                
            # Normalize/Clamp
            # Typical max score could be roughly 100
            # Let's NOT clamp strictly to allow ranges like -30 to 110, but soften extremes
            if score > 100: score = 100
            if score < -50: score = -50
            
            planet_scores[aspect] = int(score)
            
        result[planet] = planet_scores
        
    return result
