import logging
import json
from typing import Dict, Any, Optional, List
from .gemini_service import GeminiService

logger = logging.getLogger(__name__)

class CryptoAIService:
    def __init__(self):
        try:
            self.gemini = GeminiService()
        except Exception as e:
            logger.error(f"Failed to initialize GeminiService: {e}")
            self.gemini = None

    async def generate_crypto_insight(self, analysis_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Uses Gemini to interpret the deterministic output of the crypto timing engine.
        Follows the Daily Core + Deep Dive interpretation logic.
        """
        if not self.gemini:
            return self._get_fallback_insight(analysis_data)

        system_prompt = """You are a crypto timing analyst using Vedic astrology insights.
Your role is to explain, summarize, and personalize the provided data.
Do NOT change signals, confidence, or timing windows.

Rules:
- Be concise and professional.
- Avoid financial guarantees; use probabilistic language.
- Focus on clarity and risk awareness.
- Output in human-readable, inspiring, yet cautious tone.
- Format the output as a JSON object with 'daily_core', 'deep_dive', and 'caution_note' fields.
- Do NOT provide financial advice.
"""

        user_prompt = f"""Interpret the following crypto timing analysis and create:
1. A 'daily_core' summary (max 2 sentences) highlighting the current bias and recommended action.
2. A 'deep_dive' explanation (max 4-5 core bullet points) explaining why these signals exist based on the planetary influences.
3. A 'caution_note' if any risk periods or negative influences are detected.

ANALYSIS DATA:
{json.dumps(analysis_data, indent=2)}

RESPONSE FORMAT (JSON):
{{
  "daily_core": "sentence...",
  "deep_dive": "bullet points as a single string with \\n...",
  "caution_note": "caution text..."
}}
"""

        try:
            # We use generate_chat_response but it expects a string.
            # Our gemini_service doesn't have a specific json mode in its current generate_chat_response
            # but we can just parse the text.
            response_text = self.gemini.generate_chat_response(
                user_query=user_prompt,
                system_prompt=system_prompt
            )
            
            # Extract JSON from response (handling potential markdown fences)
            clean_json = response_text
            if "```json" in response_text:
                clean_json = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                clean_json = response_text.split("```")[1].split("```")[0].strip()
            
            result = json.loads(clean_json)
            return result
        except Exception as e:
            logger.error(f"Error generating AI crypto insight: {e}")
            return self._get_fallback_insight(analysis_data)

    def _get_fallback_insight(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback when AI fails or is unavailable."""
        signal = data.get("overall_signal", "hold")
        symbol = data.get("crypto_symbol", "Asset")
        
        daily_core = f"{symbol} currently shows a {signal.upper()} signal. Market momentum is evolving; maintain discipline and watch key levels."
        if signal == "buy":
            daily_core = f"Favorable cosmic momentum detected for {symbol}. It is a strong window for strategic accumulation."
        elif signal == "avoid":
            daily_core = f"Planetary pressures suggest caution for {symbol}. Significant volatility or downward pressure is likely; prioritize safety."

        deep_dive = ""
        for inf in data.get("planetary_influences", [])[:3]:
            deep_dive += f"• {inf['planet']} {inf['status']}: {inf['effect']}\n"
            
        caution = ""
        risk_periods = data.get("risk_periods", [])
        if risk_periods:
            caution = risk_periods[0].get("reason", "Technical or planetary pressure detected.")

        return {
            "daily_core": daily_core,
            "deep_dive": deep_dive.strip(),
            "caution_note": caution
        }

# Singleton instance
crypto_ai_service = CryptoAIService()
