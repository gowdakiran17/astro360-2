"""
Market Timing Intelligence Engine
Implements local calculations for market analysis without external API dependency.
Based on proven financial astrology methods: Bradley Siderograph, Gann Time Cycles, etc.
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import math
from ..astrology.chart import calculate_chart
from ..astrology.utils import parse_timezone
import logging

logger = logging.getLogger(__name__)

# Planetary orbital periods in days (tropical)
ORBITAL_PERIODS = {
    'Sun': 365.25,
    'Moon': 27.32,
    'Mercury': 87.97,
    'Venus': 224.70,
    'Mars': 686.98,
    'Jupiter': 4332.59,  # ~12 years
    'Saturn': 10759.22,  # ~29 years
    'Uranus': 30688.5,   # ~84 years
    'Neptune': 60182,    # ~165 years
    'Pluto': 90560       # ~248 years
}

# Aspect weights for Bradley Siderograph
ASPECT_WEIGHTS = {
    0: 5,    # Conjunction
    180: 4,  # Opposition
    120: 3,  # Trine
    90: 2,   # Square
    60: 1,   # Sextile
}

# Orb tolerance for aspects (degrees)
ASPECT_ORB = 8


def calculate_aspect_angle(pos1: float, pos2: float) -> float:
    """Calculate the shortest angle between two planetary positions."""
    diff = abs(pos1 - pos2)
    if diff > 180:
        diff = 360 - diff
    return diff


def get_aspect_type(angle: float) -> Optional[int]:
    """Determine aspect type from angle."""
    for aspect_angle, weight in ASPECT_WEIGHTS.items():
        if abs(angle - aspect_angle) <= ASPECT_ORB:
            return aspect_angle
    return None


def calculate_bradley_siderograph(transits: dict) -> dict:
    """
    Calculate Bradley Siderograph - composite market stress indicator.
    
    Formula:
    - Longitude aspects: weighted by type and orb
    - Declination peaks: planets at max north/south declination
    - Sign ingresses: planet entering new sign
    
    Returns value from -100 to +100 (higher = more stress/volatility)
    """
    planets = {p['name']: p for p in transits.get('planets', [])}
    
    # 1. Calculate aspect scores
    aspect_score = 0
    aspect_count = 0
    planet_list = list(planets.keys())
    
    for i, p1_name in enumerate(planet_list):
        for p2_name in planet_list[i+1:]:
            if p1_name in ['Rahu', 'Ketu'] or p2_name in ['Rahu', 'Ketu']:
                continue  # Skip nodes for Bradley
                
            p1 = planets[p1_name]
            p2 = planets[p2_name]
            
            angle = calculate_aspect_angle(p1['longitude'], p2['longitude'])
            aspect_type = get_aspect_type(angle)
            
            if aspect_type is not None:
                weight = ASPECT_WEIGHTS[aspect_type]
                orb = abs(angle - aspect_type)
                orb_factor = 1 - (orb / ASPECT_ORB)  # Closer = stronger
                aspect_score += weight * orb_factor
                aspect_count += 1
    
    # 2. Declination peaks (simplified - check if near max declination)
    declination_score = 0
    for name, planet in planets.items():
        if name in ['Rahu', 'Ketu']:
            continue
        # Planets near max declination (±23.5°) add stress
        decl = abs(planet.get('declination', 0))
        if decl > 20:  # Near maximum
            declination_score += 2
    
    # 3. Retrograde stress
    retrograde_score = 0
    for name, planet in planets.items():
        if planet.get('is_retrograde', False):
            if name == 'Mercury':
                retrograde_score += 3
            elif name in ['Mars', 'Venus']:
                retrograde_score += 2
            else:
                retrograde_score += 1
    
    # Combine scores
    total_score = aspect_score + declination_score + retrograde_score
    
    # Normalize to -100 to +100 (simplified scaling)
    # Typical range: 0-50, scale to ±100
    normalized = min(100, max(-100, (total_score - 15) * 4))
    
    # Determine trend direction
    if normalized > 20:
        trend = "rising"
        stress = "high"
    elif normalized < -20:
        trend = "falling"
        stress = "low"
    else:
        trend = "neutral"
        stress = "medium"
    
    return {
        "current_value": round(normalized, 2),
        "trend_direction": trend,
        "market_stress": stress,
        "rating": "bullish" if normalized < 0 else "bearish" if normalized > 30 else "neutral",
        "components": {
            "longitude_aspects": round(aspect_score, 2),
            "declination_maxima": declination_score,
            "retrograde_stress": retrograde_score,
            "aspect_count": aspect_count
        }
    }


def calculate_gann_cycles(transits: dict, reference_date: datetime = None) -> dict:
    """
    Calculate Gann Time Cycles - planetary cycle positions.
    
    W.D. Gann believed planetary cycles influence market timing.
    Returns current position in each planet's cycle.
    """
    if reference_date is None:
        reference_date = datetime(2000, 1, 1)  # J2000 epoch
    
    planets = {p['name']: p for p in transits.get('planets', [])}
    current_date = datetime.now()
    
    active_cycles = []
    
    for planet_name in ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']:
        if planet_name not in planets or planet_name not in ORBITAL_PERIODS:
            continue
            
        period_days = ORBITAL_PERIODS[planet_name]
        days_elapsed = (current_date - reference_date).days
        
        # Calculate position in cycle (0-360 degrees)
        cycle_position = (days_elapsed % period_days) / period_days * 360
        
        # Determine phase
        if cycle_position < 90:
            phase = "First Quarter"
        elif cycle_position < 180:
            phase = "Full"
        elif cycle_position < 270:
            phase = "Last Quarter"
        else:
            phase = "New"
        
        # Days until next turn (90° increment)
        next_turn_deg = (math.ceil(cycle_position / 90) * 90) % 360
        days_to_turn = int(((next_turn_deg - cycle_position) % 360) / 360 * period_days)
        
        active_cycles.append({
            "planet": planet_name,
            "cycle_position": round(cycle_position, 2),
            "phase": phase,
            "next_turn_days": days_to_turn
        })
    
    # Geometric levels (simplified - based on current price if provided)
    geometric_levels = [
        {"type": "support", "level": "Square of 9", "description": "Natural support at 90° intervals"},
        {"type": "resistance", "level": "Square of 144", "description": "Major resistance at 144° intervals"}
    ]
    
    return {
        "active_cycles": active_cycles,
        "geometric_levels": geometric_levels
    }


def calculate_volatility_forecast(transits: dict) -> dict:
    """
    Calculate market volatility forecast based on planetary configurations.
    
    Returns percentage (0-100) and recommendation.
    """
    planets = {p['name']: p for p in transits.get('planets', [])}
    
    base_volatility = 40
    
    # 1. Retrograde planets increase volatility
    if planets.get('Mercury', {}).get('is_retrograde'):
        base_volatility += 20
    if planets.get('Mars', {}).get('is_retrograde'):
        base_volatility += 15
    
    # 2. Hard aspects (Mars-Saturn, Mercury-Uranus, etc.)
    mars = planets.get('Mars', {})
    saturn = planets.get('Saturn', {})
    mercury = planets.get('Mercury', {})
    uranus = planets.get('Uranus', {})
    
    if mars and saturn:
        angle = calculate_aspect_angle(mars['longitude'], saturn['longitude'])
        if get_aspect_type(angle) in [0, 90, 180]:  # Conjunction, Square, Opposition
            base_volatility += 10
    
    if mercury and uranus:
        angle = calculate_aspect_angle(mercury['longitude'], uranus['longitude'])
        if get_aspect_type(angle) in [0, 90]:
            base_volatility += 10
    
    # 3. Moon in fire signs
    moon = planets.get('Moon', {})
    if moon and moon.get('zodiac_sign') in ['Aries', 'Leo', 'Sagittarius']:
        base_volatility += 10
    
    # 4. Void of Course Moon reduces volatility (lack of follow-through)
    # Simplified: check if Moon has no applying aspects (would need aspect calculation)
    
    # Cap at 100
    volatility = min(100, base_volatility)
    
    # Generate recommendation
    if volatility < 40:
        recommendation = "Low volatility - suitable for swing trades and position building"
    elif volatility < 70:
        recommendation = "Moderate volatility - use appropriate position sizing"
    else:
        recommendation = "High volatility - consider hedging or reducing exposure"
    
    return {
        "volatility_percentage": round(volatility, 1),
        "recommendation": recommendation
    }


def calculate_lunar_influence(transits: dict) -> dict:
    """
    Calculate lunar influence on markets.
    
    Returns moon phase, sign, and trading implications.
    """
    planets = {p['name']: p for p in transits.get('planets', [])}
    moon = planets.get('Moon', {})
    sun = planets.get('Sun', {})
    
    if not moon or not sun:
        return {}
    
    # Calculate phase angle
    phase_angle = (moon['longitude'] - sun['longitude']) % 360
    
    # Determine phase
    if phase_angle < 45:
        phase = "New Moon"
        illumination = phase_angle / 45 * 50
        trend = "accumulation"
    elif phase_angle < 135:
        phase = "Waxing"
        illumination = 50 + (phase_angle - 45) / 90 * 50
        trend = "bullish"
    elif phase_angle < 225:
        phase = "Full Moon"
        illumination = 100 - (phase_angle - 135) / 90 * 50
        trend = "distribution"
    else:
        phase = "Waning"
        illumination = 50 - (phase_angle - 225) / 135 * 50
        trend = "bearish"
    
    return {
        "phase": phase,
        "illumination_percent": round(illumination, 1),
        "zodiac_sign": moon.get('zodiac_sign', 'Unknown'),
        "nakshatra": moon.get('nakshatra', 'Unknown'),
        "phase_influence": {
            "volatility": "high" if phase in ["New Moon", "Full Moon"] else "moderate",
            "trend": trend
        }
    }


def calculate_planetary_hours(date: datetime, lat: float, lon: float) -> List[dict]:
    """
    Calculate planetary hours (Hora) for the day.
    Each hour is ruled by a planet, affecting market sentiment.
    """
    # Simplified implementation - would need sunrise/sunset calculation
    # For now, return mock structure
    hours = []
    planets_order = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars']
    
    for i in range(12):  # Day hours
        hour_start = date.replace(hour=6+i, minute=0)
        planet = planets_order[i % 7]
        quality = "favorable" if planet in ['Jupiter', 'Venus', 'Sun'] else "neutral"
        
        hours.append({
            "planet": planet,
            "start": hour_start.strftime("%H:%M"),
            "end": hour_start.replace(hour=hour_start.hour+1).strftime("%H:%M"),
            "quality": quality
        })
    
    return hours


def analyze_sector_rotation(transits: dict) -> dict:
    """
    Analyze which market sectors are strong/weak based on planetary positions.
    
    Planetary sector associations:
    - Jupiter: Finance, Education, Travel
    - Saturn: Real Estate, Mining, Infrastructure
    - Mars: Defense, Energy, Manufacturing
    - Venus: Luxury, Retail, Entertainment
    - Mercury: Technology, Communication, Media
    """
    planets = {p['name']: p for p in transits.get('planets', [])}
    
    strong_sectors = []
    neutral_sectors = []
    weak_sectors = []
    
    # Jupiter in fire signs = bullish for finance/tech
    jupiter = planets.get('Jupiter', {})
    if jupiter.get('zodiac_sign') in ['Aries', 'Leo', 'Sagittarius']:
        strong_sectors.extend(['Finance', 'Technology'])
    elif jupiter.get('is_retrograde'):
        weak_sectors.append('Finance')
    else:
        neutral_sectors.append('Finance')
    
    # Saturn strong = infrastructure/real estate
    saturn = planets.get('Saturn', {})
    if saturn.get('zodiac_sign') in ['Capricorn', 'Aquarius']:
        strong_sectors.append('Real Estate')
    else:
        neutral_sectors.append('Real Estate')
    
    # Mars = energy/defense
    mars = planets.get('Mars', {})
    if mars.get('zodiac_sign') in ['Aries', 'Scorpio']:
        strong_sectors.append('Energy')
    elif mars.get('is_retrograde'):
        weak_sectors.append('Energy')
    else:
        neutral_sectors.append('Energy')
    
    # Mercury = tech/communication
    mercury = planets.get('Mercury', {})
    if not mercury.get('is_retrograde'):
        if 'Technology' not in strong_sectors:
            strong_sectors.append('Technology')
    else:
        weak_sectors.append('Technology')
    
    # Venus = luxury/retail
    venus = planets.get('Venus', {})
    if venus.get('zodiac_sign') in ['Taurus', 'Libra']:
        strong_sectors.append('Consumer Goods')
    else:
        neutral_sectors.append('Consumer Goods')
    
    return {
        "STRONG": list(set(strong_sectors)),
        "NEUTRAL": list(set(neutral_sectors)),
        "WEAKENING": list(set(weak_sectors))
    }


def get_comprehensive_market_analysis(
    date_str: str,
    time_str: str,
    timezone: str,
    lat: float,
    lon: float,
    birth_details: Optional[dict] = None
) -> dict:
    """
    Master function: Generate complete market analysis locally.
    
    Returns same structure as external API for drop-in replacement.
    """
    try:
        # Calculate transit chart
        transits = calculate_chart(date_str, time_str, timezone, lat, lon)
        
        # Run all calculations
        bradley = calculate_bradley_siderograph(transits)
        gann = calculate_gann_cycles(transits)
        volatility = calculate_volatility_forecast(transits)
        lunar = calculate_lunar_influence(transits)
        sectors = analyze_sector_rotation(transits)
        
        # Build response
        result = {
            "success": True,
            "data": {
                "date": datetime.now().isoformat(),
                "bradley_indicator": bradley,
                "gann_time_cycles": gann,
                "volatility_forecast": volatility,
                "lunar_influence": lunar,
                "sector_rotation": sectors,
                "overall_market_bias": bradley['rating']
            }
        }
        
        # Add personal insights if birth details provided
        if birth_details:
            # Would calculate Dasha periods here
            result["data"]["personal_insights"] = {
                "dasha_period": "Jupiter/Saturn",  # Placeholder
                "trading_bias": "Growth-oriented",
                "favorable_sectors": sectors["STRONG"][:2],
                "challenging_periods": []
            }
        
        return result
        
    except Exception as e:
        logger.error(f"Error in local market analysis: {e}", exc_info=True)
        return {"success": False, "error": str(e)}
