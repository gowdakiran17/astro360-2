import logging
import json
from typing import List, Dict, Any, Optional
from astro_app.backend.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)

class TransitAIService:
    def __init__(self):
        self.gemini_service = GeminiService()

    def get_system_prompt(self, context: str) -> str:
        """
        Returns the appropriate system prompt based on context.
        """
        base_prompt = """You are VedAstro AI, an expert Vedic Astrologer companion. 
CRITICAL RULE: NEVER calculate planetary positions, dates, or transits. 
You are provided with DETERMINISTIC DATA from an astronomy engine. Your job is ONLY to interpret this data for the user.
Do not hallucinate new transits. Do not change the dates.
Focus on BEHAVIORAL GUIDANCE, PSYCHOLOGICAL INSIGHT, and STRATEGIC TIMING.
Use a calm, grounded, empowering tone. Avoid fear-mongering and fatalism."""

        if context == "daily_summary":
            return base_prompt + "\n\nTask: Generate a 'Cosmic Weather' report for today. Be poetic but practical."
        elif context == "analysis":
            return base_prompt + "\n\nTask: Analyze specific transits deeply. Focus on the 'Why' and 'How'."
        elif context == "timeline":
            return base_prompt + "\n\nTask: Create a narrative story for the upcoming month."
        
        return base_prompt

    def generate_daily_summary(self, chart_data: Dict[str, Any], transits: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generates daily summary, priority ranking, and action guidance.
        Supports Daily Transits 2.0 format.
        """
        system_prompt = self.get_system_prompt("daily_summary")
        
        # Prepare context data
        ascendant = chart_data.get('ascendant', {}).get('sign', 'Unknown')
        moon_sign = chart_data.get('moon_sign', 'Unknown')
        current_dasha = chart_data.get('current_dasha', 'Unknown')
        
        user_prompt = f"""
        Analyze the "Cosmic Weather" for today based on these active transits:
        {json.dumps(transits, indent=2)}
        
        User Context:
        - Ascendant: {ascendant}
        - Moon Sign: {moon_sign} (Interpret transits relative to this mainly for mood/mind)
        - Current Dasha: {current_dasha}
        
        REQUIRED JSON OUTPUT FORMAT:
        {{
            "summary": "A short, 15-word inspirational quote/theme for the day. (e.g. 'Focus on the present moment. The stars support steady progress.')",
            "priority_order": [
                {{
                    "title": "Short Title (e.g. Moon in Leo)",
                    "subtitle": "2-word theme (e.g. Self-expression)",
                    "why": "1 sentence explanation relative to user's chart",
                    "action": "1 specific action to take",
                    "score": 9 (1-10 relevance score)
                }},
                ... (Top 3 most important influences only)
            ],
            "action_guidance": {{
                "do": ["Action 1", "Action 2", "Action 3"],
                "avoid": ["Avoid 1", "Avoid 2", "Avoid 3"]
            }},
            "alignment_practice": {{
                 "morning": "Specific morning ritual",
                 "afternoon": "Focus for the workday",
                 "evening": "Wind-down practice"
            }}
        }}
        """

        try:
            # We enforce JSON output structure via prompt engineering
            response_text = self.gemini_service.generate_chat_response(
                user_query=user_prompt,
                system_prompt=system_prompt + "\n\nOUTPUT MUST BE VALID JSON ONLY. NO MARKDOWN."
            )
            
            # Clean formatting if markdown is included
            cleaned_text = response_text.replace("```json", "").replace("```", "").strip()
            data = json.loads(cleaned_text)
            
            # Ensure we have the top 3 priorities sorted by score
            if "priority_order" in data:
                data["priority_order"] = sorted(data["priority_order"], key=lambda x: x.get('score', 0), reverse=True)[:3]
                
            return data
            
        except Exception as e:
            logger.error(f"Error generating daily summary: {e}")
            # Robust Fallback
            return {
                "summary": "The stars invite you to find balance today. Listen to your intuition.",
                "priority_order": [
                    {
                        "title": f"Moon in {moon_sign}", 
                        "subtitle": "Emotional Focus", 
                        "why": "The Moon rules your mood today.", 
                        "action": "Check in with your feelings.",
                        "score": 10
                    },
                    {
                        "title": "Solar Energy", 
                        "subtitle": "Vitality", 
                        "why": "The Sun powers your actions.", 
                        "action": "Get things done early.",
                        "score": 8
                    },
                    {
                        "title": "General Flow", 
                        "subtitle": "Adaptability", 
                        "why": "Life requires flexibility today.", 
                        "action": "Go with the flow.",
                        "score": 6
                    }
                ],
                "action_guidance": {
                    "do": ["Breathe", "Focus", "Rest"],
                    "avoid": ["Stress", "Haste", "Conflict"]
                },
                "alignment_practice": {
                    "morning": "Deep breathing",
                    "afternoon": "Steady work",
                    "evening": "Calm reflection"
                }
            }

    def explain_transit(self, transit_event: Dict[str, Any], mode: str = "Beginner") -> Dict[str, Any]:
        """
        Explains a specific transit in a specific mode.
        """
        system_prompt = self.get_system_prompt("analysis")
        
        mode_instructions = {
            "Beginner": "Simple, accessible language. Avoid jargon.",
            "Practitioner": "Use technical terms (aspects, dashas). Go deep.",
            "Therapeutic": "Focus on emotional growth and healing.",
            "Strategic": "Focus on business, career, and decision timing."
        }
        
        instruction = mode_instructions.get(mode, mode_instructions["Beginner"])

        user_prompt = f"""
        Explain this transit event detailedly:
        {json.dumps(transit_event, indent=2)}

        Mode: {mode}
        Instruction: {instruction}

        REQUIRED JSON OUTPUT FORMAT:
        {{
            "explanation": "2-paragraph detailed explanation.",
            "why_this_matters": "1-sentence punchy tagline.",
            "strength_rating": 8 (1-10 intensity)
        }}
        """

        try:
            response_text = self.gemini_service.generate_chat_response(
                user_query=user_prompt,
                system_prompt=system_prompt + "\n\nOUTPUT MUST BE VALID JSON ONLY. NO MARKDOWN."
            )
            
            cleaned_text = response_text.replace("```json", "").replace("```", "").strip()
            return json.loads(cleaned_text)
        except Exception as e:
            logger.error(f"Error explaining transit: {e}")
            return {
                "explanation": "This transit highlights a shift in energy. It is a good time to observe changes in this area of life.",
                "why_this_matters": "Awareness leads to better choices.",
                "strength_rating": 5
            }

    def get_timeline_story(self, timeline_events: List[Dict[str, Any]]) -> str:
        """
        Generates a narrative story for the next 30 days.
        """
        system_prompt = self.get_system_prompt("timeline")
        
        user_prompt = f"""
        Create a cohesive narrative story for the next 30 days based on these upcoming events:
        {json.dumps(timeline_events, indent=2)}

        Write it as a single engaging paragraph (max 3-4 sentences).
        Start with "The next month begins with..." or "Upcoming cosmic currents suggest..."
        Highlight the emotional arc of the month.
        """

        try:
            response_text = self.gemini_service.generate_chat_response(
                user_query=user_prompt,
                system_prompt=system_prompt
            )
            return response_text.strip().replace('"', '')
        except Exception as e:
            logger.error(f"Error generating timeline story: {e}")
            return "The coming month brings a series of planetary shifts. Navigate them with awareness and patience."
