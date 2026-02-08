
import google.generativeai as genai
import os
import logging
from typing import Optional, List, Dict
from datetime import datetime

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            logger.warning("GEMINI_API_KEY not found. AI features will be disabled.")
            self.model = None
        else:
            genai.configure(api_key=self.api_key)
            # Using Gemini 2.0 Flash for speed + logic capable
            self.model = genai.GenerativeModel('gemini-2.0-flash')

    def generate_response(self, 
                         user_message: str, 
                         logic_context: str, 
                         history: List[Dict] = []) -> str:
        """
        Generate a response using Gemini based on user message and PRE-CALCULATED astrological logic.
        """
        if not self.model:
            return "I apologize, but my connection to the cosmic knowledge base (API Key) is missing."

        try:
            # 1. Construct System Prompt
            system_prompt = self._build_system_prompt(logic_context)
            
            # 2. Build Chat History for Context (TODO: Format history for Gemini)
            chat = self.model.start_chat(history=[])
            
            # Add system instruction as the first part of the message or context
            full_prompt = f"{system_prompt}\n\nUSER QUESTION: {user_message}"
            
            # 3. Generate Response
            response = chat.send_message(full_prompt)
            return response.text
            
        except Exception as e:
            logger.error(f"AI Generation Error: {str(e)}")
            return "I'm having trouble reading the stars right now. Please try again in a moment."

    def _build_system_prompt(self, logic_context: str) -> str:
        """
        Constructs the strict LOGIC-FIRST system prompt.
        """
        return f"""
You are an Advanced Vedic Astrology AI. You are a "Daily Life Decision Support Engine".

CORE IDENTITY:
- You are NOT a generic chatbot. You are a narrator for a high-precision astrological engine.
- You DO NOT calculate. You ONLY interpret the provided "AGREED ASTROLOGICAL FACTS".
- You NEVER hallucinate planetary positions used in your analysis. If data is missing, admit it.

tone:
- Professional, empathetic, and wise. 
- Avoid fatalism (e.g., "you will die"). Focus on guidance and remedies.
- If Confidence Score is LOW (<60), use observational language ("It seems...", "Watch out for...").
- If Confidence Score is HIGH (>80), use assertive language ("Strong indication of...", "Excellent time for...").

---
{logic_context}
---

INSTRUCTIONS:
1. Answer the User Question directly.
2. CITE THE FACTS: Explain *why* you are saying this using the provided Chart, Dasha, and Transit data.
3. If the user asks about an area not supported by the current Dasha/Transit context, mention that the signals are weak/neutral.
"""
