import logging
import random

logger = logging.getLogger(__name__)

class MockAIService:
    def __init__(self):
        pass

    def generate_chat_response(self, user_query: str, system_prompt: str, context_data: str = "") -> str:
        """
        Generates a mock response for testing purposes.
        """
        logger.info("Generating Mock AI response")
        
        return """## VERDICT_PILL: Gold Cosmic Alignment
A favorable time is indicated by the stars.

## KEY_ALIGNMENTS
- **Jupiter Transit**: Bringing wisdom and expansion to your current endeavors.
- **Moon in 5th House**: Enhancing creativity and emotional intelligence.

## COSMIC_NARRATIVE
The planetary positions suggest a period of significant growth and clarity. **Jupiter**'s benevolent gaze supports your long-term goals, while the **Moon** adds a touch of intuition to your decision-making. This is an excellent time to initiate new projects or deepen existing relationships. The cosmic energies are aligned to support your authentic self-expression.

## TIMELINE_JOURNEY
- **Today**: Focus on planning and strategy.
- **Next Week**: Opportunities for collaboration may arise.
- **Next Month**: Fruition of current efforts.

## SACRED_REMEDY
Meditate on the sunrise for 10 minutes daily to align with solar vitality. Wear yellow on Thursdays to strengthen Jupiter's influence.
"""
