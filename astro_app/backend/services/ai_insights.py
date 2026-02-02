import os
import logging
from typing import Dict, Any, Optional
from openai import OpenAI

logger = logging.getLogger(__name__)

AI_INTEGRATIONS_OPENAI_API_KEY = os.environ.get("AI_INTEGRATIONS_OPENAI_API_KEY")
AI_INTEGRATIONS_OPENAI_BASE_URL = os.environ.get("AI_INTEGRATIONS_OPENAI_BASE_URL")

openai_client = None
if AI_INTEGRATIONS_OPENAI_API_KEY and AI_INTEGRATIONS_OPENAI_BASE_URL:
    openai_client = OpenAI(
        api_key=AI_INTEGRATIONS_OPENAI_API_KEY,
        base_url=AI_INTEGRATIONS_OPENAI_BASE_URL
    )

def generate_daily_insight(chart_data: Dict[str, Any], panchang_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Generate AI-powered daily astrological insight based on chart data."""
    
    if not openai_client:
        return {
            "insight": "Welcome to your cosmic journey! Your stars are aligned for a day of discovery and growth.",
            "mood": "positive",
            "focus_area": "Self-discovery",
            "lucky_elements": {"color": "Gold", "number": 7, "direction": "East"},
            "ai_powered": False
        }
    
    try:
        ascendant = chart_data.get("ascendant", {})
        planets = chart_data.get("planets", [])
        
        moon_data = next((p for p in planets if p.get("name") == "Moon"), {})
        sun_data = next((p for p in planets if p.get("name") == "Sun"), {})
        
        prompt = f"""You are VedaAI, an expert Vedic astrologer. Based on the following birth chart data, provide a brief, inspiring daily insight.

Birth Chart Summary:
- Ascendant: {ascendant.get('sign', 'Unknown')} at {ascendant.get('degree', 0):.1f}°
- Moon Sign: {moon_data.get('sign', 'Unknown')} in House {moon_data.get('house', 'Unknown')}
- Sun Sign: {sun_data.get('sign', 'Unknown')} in House {sun_data.get('house', 'Unknown')}
- Moon Nakshatra: {moon_data.get('nakshatra', 'Unknown')}

Provide a response in this exact JSON format:
{{
    "insight": "A 2-3 sentence inspiring and personalized daily insight",
    "mood": "positive/neutral/cautious",
    "focus_area": "One word or short phrase like Career, Love, Health, Creativity, etc.",
    "lucky_elements": {{
        "color": "A lucky color for today",
        "number": A lucky number (1-9),
        "direction": "A cardinal direction"
    }},
    "power_mantra": "A short empowering phrase or Sanskrit mantra"
}}

Be warm, encouraging, and insightful. Focus on the positive potential."""

        # the newest OpenAI model is "gpt-5" which was released August 7, 2025.
        # do not change this unless explicitly requested by the user
        response = openai_client.chat.completions.create(
            model="gpt-5",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            max_completion_tokens=500
        )
        
        import json
        result = json.loads(response.choices[0].message.content or "{}")
        result["ai_powered"] = True
        return result
        
    except Exception as e:
        logger.error(f"AI insight generation error: {str(e)}")
        return {
            "insight": "The cosmic energies are flowing in your favor today. Trust your intuition and embrace new opportunities.",
            "mood": "positive",
            "focus_area": "Growth",
            "lucky_elements": {"color": "Blue", "number": 3, "direction": "North"},
            "power_mantra": "Om Shanti",
            "ai_powered": False
        }


def generate_quick_predictions(chart_data: Dict[str, Any], dasha_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Generate AI-powered quick predictions for different life areas."""
    
    if not openai_client:
        return get_fallback_predictions()
    
    try:
        ascendant = chart_data.get("ascendant", {})
        planets = chart_data.get("planets", [])
        
        current_dasha = ""
        if dasha_data and dasha_data.get("dashas"):
            dashas = dasha_data["dashas"]
            if dashas:
                current_dasha = f"Current Mahadasha: {dashas[0].get('planet', 'Unknown')}"
        
        planet_summary = ", ".join([f"{p.get('name')} in {p.get('sign')}" for p in planets[:5]])
        
        prompt = f"""You are VedaAI, an expert Vedic astrologer. Based on this birth chart, provide quick predictions for different life areas.

Chart Data:
- Ascendant: {ascendant.get('sign', 'Unknown')}
- Key Planets: {planet_summary}
- {current_dasha}

Provide predictions in this exact JSON format:
{{
    "career": {{
        "score": 75,
        "trend": "up/stable/down",
        "summary": "One sentence prediction"
    }},
    "love": {{
        "score": 80,
        "trend": "up/stable/down",
        "summary": "One sentence prediction"
    }},
    "health": {{
        "score": 70,
        "trend": "up/stable/down",
        "summary": "One sentence prediction"
    }},
    "wealth": {{
        "score": 65,
        "trend": "up/stable/down",
        "summary": "One sentence prediction"
    }},
    "spiritual": {{
        "score": 85,
        "trend": "up/stable/down",
        "summary": "One sentence prediction"
    }},
    "overall_message": "A 2-sentence inspiring overview message"
}}

Scores should be 0-100. Be balanced but encouraging."""

        # the newest OpenAI model is "gpt-5" which was released August 7, 2025.
        # do not change this unless explicitly requested by the user
        response = openai_client.chat.completions.create(
            model="gpt-5",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            max_completion_tokens=600
        )
        
        import json
        result = json.loads(response.choices[0].message.content or "{}")
        result["ai_powered"] = True
        return result
        
    except Exception as e:
        logger.error(f"AI predictions generation error: {str(e)}")
        return get_fallback_predictions()


def get_fallback_predictions() -> Dict[str, Any]:
    """Return fallback predictions when AI is unavailable."""
    return {
        "career": {
            "score": 72,
            "trend": "up",
            "summary": "Professional growth opportunities are emerging on the horizon."
        },
        "love": {
            "score": 78,
            "trend": "stable",
            "summary": "Harmony and understanding flow in your relationships."
        },
        "health": {
            "score": 75,
            "trend": "stable",
            "summary": "Maintain balance with regular self-care practices."
        },
        "wealth": {
            "score": 68,
            "trend": "up",
            "summary": "Financial wisdom guides your decisions today."
        },
        "spiritual": {
            "score": 82,
            "trend": "up",
            "summary": "Inner peace and clarity illuminate your path."
        },
        "overall_message": "The stars favor your journey today. Embrace opportunities with confidence and trust your inner wisdom.",
        "ai_powered": False
    }
