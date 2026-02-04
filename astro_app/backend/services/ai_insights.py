import os
import logging
import json
from typing import Dict, Any, Optional
from openai import OpenAI
from astro_app.backend.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)

# Providers configuration
AI_PROVIDER = os.environ.get("AI_PROVIDER", "Gemini")
AI_INTEGRATIONS_OPENAI_API_KEY = os.environ.get("AI_INTEGRATIONS_OPENAI_API_KEY")
AI_INTEGRATIONS_OPENAI_BASE_URL = os.environ.get("AI_INTEGRATIONS_OPENAI_BASE_URL")

# Clients
openai_client = None
if AI_INTEGRATIONS_OPENAI_API_KEY and AI_INTEGRATIONS_OPENAI_BASE_URL:
    openai_client = OpenAI(
        api_key=AI_INTEGRATIONS_OPENAI_API_KEY,
        base_url=AI_INTEGRATIONS_OPENAI_BASE_URL
    )

gemini_service = None
try:
    gemini_service = GeminiService()
except Exception as e:
    logger.warning(f"GeminiService initialization failed: {e}")

def generate_daily_insight(chart_data: Dict[str, Any], panchang_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Generate AI-powered daily astrological insight based on chart data."""
    
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

Provide a response in this exact JSON format (NO OTHER TEXT):
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

    # Try OpenAI first if configured
    if openai_client:
        try:
            response = openai_client.chat.completions.create(
                model="gpt-5", # the newest OpenAI model is "gpt-5" which was released August 7, 2025.
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                max_completion_tokens=500
            )
            result = json.loads(response.choices[0].message.content or "{}")
            result["ai_powered"] = True
            return result
        except Exception as e:
            logger.error(f"OpenAI daily insight error: {e}")

    # Fallback to Gemini
    if gemini_service:
        try:
            gemini_prompt = prompt + "\n\nCRITICAL: Return ONLY valid raw JSON without markdown code blocks."
            response_text = gemini_service.generate_chat_response(
                user_query=gemini_prompt,
                system_prompt="You are VedaAI, an expert Vedic astrologer returning structured JSON."
            )
            # Clean response text from potential markdown backticks
            clean_json = response_text.replace("```json", "").replace("```", "").strip()
            result = json.loads(clean_json)
            result["ai_powered"] = True
            return result
        except Exception as e:
            logger.error(f"Gemini daily insight error: {e}")

    # Final fallback
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

Provide predictions in this exact JSON format (NO OTHER TEXT):
{{
    "career": {{ "score": 75, "trend": "up/stable/down", "summary": "One sentence prediction" }},
    "love": {{ "score": 80, "trend": "up/stable/down", "summary": "One sentence prediction" }},
    "health": {{ "score": 70, "trend": "up/stable/down", "summary": "One sentence prediction" }},
    "wealth": {{ "score": 65, "trend": "up/stable/down", "summary": "One sentence prediction" }},
    "spiritual": {{ "score": 85, "trend": "up/stable/down", "summary": "One sentence prediction" }},
    "overall_message": "A 2-sentence inspiring overview message"
}}

Scores should be 0-100. Be balanced but encouraging."""

    # Try OpenAI first
    if openai_client:
        try:
            response = openai_client.chat.completions.create(
                model="gpt-5", # the newest OpenAI model is "gpt-5" which was released August 7, 2025.
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                max_completion_tokens=600
            )
            result = json.loads(response.choices[0].message.content or "{}")
            result["ai_powered"] = True
            return result
        except Exception as e:
            logger.error(f"OpenAI quick predictions error: {e}")

    # Fallback to Gemini
    if gemini_service:
        try:
            gemini_prompt = prompt + "\n\nCRITICAL: Return ONLY valid raw JSON without markdown code blocks."
            response_text = gemini_service.generate_chat_response(
                user_query=gemini_prompt,
                system_prompt="You are VedaAI, an expert Vedic astrologer returning structured JSON."
            )
            clean_json = response_text.replace("```json", "").replace("```", "").strip()
            result = json.loads(clean_json)
            result["ai_powered"] = True
            return result
        except Exception as e:
            logger.error(f"Gemini quick predictions error: {e}")

    # Final fallback - make it slightly dynamic at least
    seed = abs(hash(ascendant.get('sign', 'Aries'))) % 20
    return {
        "career": { "score": 72 + (seed % 5), "trend": "up", "summary": "Professional growth opportunities are emerging on the horizon." },
        "love": { "score": 78 - (seed % 3), "trend": "stable", "summary": "Harmony and understanding flow in your relationships." },
        "health": { "score": 75 + (seed % 4), "trend": "stable", "summary": "Maintain balance with regular self-care practices." },
        "wealth": { "score": 68 + (seed % 6), "trend": "up", "summary": "Financial wisdom guides your decisions today." },
        "spiritual": { "score": 82 + (seed % 8), "trend": "up", "summary": "Inner peace and clarity illuminate your path." },
        "overall_message": "The stars favor your journey today. Embrace opportunities with confidence.",
        "ai_powered": False
    }

def get_fallback_predictions() -> Dict[str, Any]:
    # This is now handled inside generate_quick_predictions for consistency
    # but kept for API stability if called directly
    return generate_quick_predictions({"ascendant": {"sign": "Aries"}, "planets": []})
