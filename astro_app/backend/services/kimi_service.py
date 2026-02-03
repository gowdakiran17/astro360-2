import os
import logging
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

KIMI_API_KEY = os.getenv("KIMI_API_KEY")

class KimiService:
    def __init__(self):
        if not KIMI_API_KEY:
            logger.error("KIMI_API_KEY not found in environment variables")
            # We don't raise error here to allow app to start, but methods will fail
            
        self.client = OpenAI(
            api_key=KIMI_API_KEY,
            base_url="https://api.moonshot.ai/v1",
        )
        # Using moonshot-v1-32k as recommended for balanced performance/context
        self.model = "moonshot-v1-32k"

    def generate_chat_response(self, user_query: str, system_prompt: str, context_data: str = "") -> str:
        """
        Generates a response from Kimi AI (Moonshot) using the provided prompt and context.
        """
        try:
            if not KIMI_API_KEY:
                return "Config Error: KIMI_API_KEY is missing. Please check your .env file."

            # Enforce formatting by appending instructions to the user message
            full_system_prompt = f"{system_prompt}\n\nCONTEXT (Astrological Data):\n{context_data}"
            
            enhanced_user_query = (
                f"{user_query}\n\n"
                "**INSTRUCTION:**\n"
                "You must strictly follow the output structure and formatting rules defined in the system prompt.\n"
                "Use the provided planetary data locally as the source of truth.\n"
            )

            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": full_system_prompt},
                    {"role": "user", "content": enhanced_user_query}
                ],
                temperature=0.7,
            )
            
            result = completion.choices[0].message.content.strip()
            return result

        except Exception as e:
            logger.error(f"Kimi API Error: {str(e)}")
            return "I apologize, but I am having trouble connecting to the stars right now (Kimi AI Error). Please try again later."
