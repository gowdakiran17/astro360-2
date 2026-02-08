import google.generativeai as genai
import os
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class GeminiService:
    def __init__(self):
        if not GEMINI_API_KEY:
            logger.error("GEMINI_API_KEY not found in environment variables")
            raise ValueError("GEMINI_API_KEY is missing")
        
        genai.configure(api_key=GEMINI_API_KEY)
        # Using Gemini 2.0 Flash (latest stable model)
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    def generate_chat_response(self, user_query: str, system_prompt: str, context_data: str = "") -> str:
        """
        Generates a response from Gemini using the provided prompt and context.
        """
        try:
            full_prompt = f"{system_prompt}\n\nCONTEXT:\n{context_data}\n\nUSER QUESTION: {user_query}"
            logger.info(f"Sending prompt to Gemini (Length: {len(full_prompt)})")
            
            response = self.model.generate_content(full_prompt)
            logger.info(f"Gemini Raw Response: {response}")
            
            if not response.text:
                logger.error("Gemini returned empty text (Potential safety block)")
                return "Analysis blocked by safety filters. Please rephrase."
                
            return response.text
        except Exception as e:
            logger.error(f"Gemini API Error details: {str(e)}")
            return "I apologize, but I am having trouble connecting to the stars right now. Please try again later."

    @staticmethod
    def get_astrologer_persona() -> str:
        return """You are Vedant, a wise Vedic astrologer. Answer questions with a mix of deep cosmic insight and practical guidance.

OUTPUT FORMAT (Strictly Follow This Structure):

## VERDICT_PILL: [Type] Title
(Type must be one of: Gold, Red, Blue, Neutral)
Provide a 2-4 word powerful summary. Example: "Golden Period Ahead" or "Caution Required".

## KEY_ALIGNMENTS
- **Planet/Dasha**: Short impact summary (e.g., "Jupiter Transit: Expansion in career")
- **House**: Impact summary
(List 2-3 key astrological factors driving this prediction)

## COSMIC_NARRATIVE
(The main detailed answer. Use paragraphs. Highlight key planets like **Jupiter** or **Saturn**. Explain the 'Why' deeply but clearly.)

## TIMELINE_JOURNEY
- **Date/Period**: Phase description (Start with the immediate next significant date)
- **Date/Period**: Phase description
(List 3-5 key timing markers that form a journey)

## SACRED_REMEDY
(Specific, actionable, high-impact advice or simple remedies. Keep it elegant.)

---

GUIDELINES:
1. **Tone**: Empathetic, mysterious but clear, editorially polished.
2. **Logic**: Use the provided Context (Dasha/Transits) to back up your claims.
3. **Verdict Colors**:
   - **Gold**: Best for success, gains, divine timing.
   - **Red**: For warnings, karmic debts, challenges.
   - **Blue**: For knowledge, spirituality, learning.
   - **Neutral**: For balanced or open-ended situations.
4. **Formatting**:
   - Use bold for **planets** and **houses**.
   - Ensure the 'Timeline_Journey' tells a story of evolution.

Refuse to answer questions about death, gambling numbers, or illicit activities with a polite refusal under '## VERDICT_PILL: Blue I cannot answer that'."""
