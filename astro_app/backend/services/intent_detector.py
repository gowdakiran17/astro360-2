"""
Intent Detection Service for AI Vedic Astrology Chatbot

Classifies user questions into astrological intents:
- Career / Work
- Marriage / Relationship  
- Finance / Wealth
- Health / Wellness
- Education / Learning
- Travel / Relocation
- Timing (When?)
- Yes/No Decision
- Daily Guidance
"""

import re
from typing import Dict, List, Tuple, Optional
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class AstroIntent(Enum):
    """Astrological question intents"""
    CAREER = "career"
    MARRIAGE = "marriage"
    FINANCE = "finance"
    HEALTH = "health"
    EDUCATION = "education"
    TRAVEL = "travel"
    TIMING = "timing"
    YES_NO = "yes_no"
    DAILY_GUIDANCE = "daily_guidance"
    GENERAL = "general"
    UNCLEAR = "unclear"


# Intent to relevant house mappings (KP system)
INTENT_HOUSE_MAP = {
    AstroIntent.CAREER: [2, 6, 10, 11],        # Job, promotion, success
    AstroIntent.MARRIAGE: [2, 7, 11],          # Marriage, partnership
    AstroIntent.FINANCE: [2, 6, 11],           # Wealth, income
    AstroIntent.HEALTH: [1, 6, 8, 12],         # Vitality, illness
    AstroIntent.EDUCATION: [4, 5, 9],          # Learning, higher ed
    AstroIntent.TRAVEL: [3, 9, 12],            # Movement, foreign
    AstroIntent.TIMING: [],                     # Determined by context
    AstroIntent.YES_NO: [],                     # Determined by context
    AstroIntent.DAILY_GUIDANCE: [1, 5, 9],     # General well-being
    AstroIntent.GENERAL: [1, 5, 9, 10],        # Broad life
}


# Keyword patterns for intent detection
INTENT_KEYWORDS = {
    AstroIntent.CAREER: [
        r'\b(job|career|work|promotion|boss|office|salary|hike|business|profession|employment|resign|fired|interview|offer|joining)\b',
        r'\b(company|corporate|manager|colleague|team|project|deadline)\b',
        r'\b(entrepreneur|startup|venture|partnership|deal|contract)\b',
    ],
    AstroIntent.MARRIAGE: [
        r'\b(marriage|marry|wedding|spouse|husband|wife|partner|relationship|love|romance)\b',
        r'\b(engaged|engagement|proposal|dating|boyfriend|girlfriend|divorce|separation)\b',
        r'\b(compatibility|match|matchmaking|kundli|horoscope matching)\b',
    ],
    AstroIntent.FINANCE: [
        r'\b(money|wealth|finance|income|savings|investment|profit|loss|debt|loan)\b',
        r'\b(property|house|land|real estate|rent|buy|sell|assets)\b',
        r'\b(stock|shares|mutual fund|crypto|trading|business profit)\b',
    ],
    AstroIntent.HEALTH: [
        r'\b(health|illness|disease|sick|hospital|doctor|surgery|recovery|pain)\b',
        r'\b(mental health|stress|anxiety|depression|therapy|wellness)\b',
        r'\b(energy|vitality|fitness|weight|diet|medicine|treatment)\b',
    ],
    AstroIntent.EDUCATION: [
        r'\b(education|study|exam|test|degree|college|university|school|learn)\b',
        r'\b(competitive exam|entrance|admission|scholarship|research|phd|masters)\b',
        r'\b(course|certification|training|skill|knowledge)\b',
    ],
    AstroIntent.TRAVEL: [
        r'\b(travel|trip|journey|abroad|foreign|overseas|visa|immigration|relocation)\b',
        r'\b(settle|migration|move|shift|transfer|posting)\b',
        r'\b(vacation|holiday|tour|pilgrimage)\b',
    ],
    AstroIntent.TIMING: [
        r'\b(when|timing|time|period|date|month|year|soon|how long)\b',
        r'\b(best time|auspicious|muhurta|favorable period)\b',
    ],
    AstroIntent.YES_NO: [
        r'^(will|can|should|is|does|am|are|do)\s',
        r'\b(possible|happen|get|receive|achieve|succeed|win|lose)\b',
    ],
    AstroIntent.DAILY_GUIDANCE: [
        r'\b(today|tomorrow|this week|daily|day|guidance|advice|predict)\b',
        r'\b(horoscope|forecast|outlook|energy|vibe)\b',
    ],
}


class IntentDetector:
    """
    Detects astrological intent from user questions.
    Uses keyword matching with confidence scoring.
    """
    
    def __init__(self):
        self._compiled_patterns = self._compile_patterns()
    
    def _compile_patterns(self) -> Dict[AstroIntent, List[re.Pattern]]:
        """Pre-compile regex patterns for efficiency"""
        compiled = {}
        for intent, patterns in INTENT_KEYWORDS.items():
            compiled[intent] = [re.compile(p, re.IGNORECASE) for p in patterns]
        return compiled
    
    def detect(self, question: str) -> Dict:
        """
        Detect intent from a user question.
        
        Returns:
            {
                "primary_intent": AstroIntent,
                "secondary_intents": List[AstroIntent],
                "confidence": float (0-1),
                "relevant_houses": List[int],
                "is_timing_question": bool,
                "is_yes_no": bool,
                "extracted_topics": List[str]
            }
        """
        if not question or len(question.strip()) < 3:
            return self._build_result(AstroIntent.UNCLEAR, 0.0)
        
        question = question.strip().lower()
        
        # Score each intent
        intent_scores: Dict[AstroIntent, float] = {}
        matched_topics: Dict[AstroIntent, List[str]] = {}
        
        for intent, patterns in self._compiled_patterns.items():
            score, topics = self._score_intent(question, patterns)
            if score > 0:
                intent_scores[intent] = score
                matched_topics[intent] = topics
        
        if not intent_scores:
            return self._build_result(AstroIntent.GENERAL, 0.3)
        
        # Sort by score
        sorted_intents = sorted(intent_scores.items(), key=lambda x: x[1], reverse=True)
        primary = sorted_intents[0]
        secondary = [i[0] for i in sorted_intents[1:3] if i[1] > 0.3]
        
        # Check for timing/yes-no qualifiers
        is_timing = AstroIntent.TIMING in intent_scores and intent_scores[AstroIntent.TIMING] > 0.3
        is_yes_no = AstroIntent.YES_NO in intent_scores and intent_scores[AstroIntent.YES_NO] > 0.3
        
        # If timing or yes_no is secondary, keep the primary topic
        if primary[0] in [AstroIntent.TIMING, AstroIntent.YES_NO] and len(sorted_intents) > 1:
            # Find actual topic
            for intent, score in sorted_intents[1:]:
                if intent not in [AstroIntent.TIMING, AstroIntent.YES_NO]:
                    primary = (intent, score)
                    break
        
        return self._build_result(
            primary[0],
            min(primary[1], 1.0),
            secondary,
            matched_topics.get(primary[0], []),
            is_timing,
            is_yes_no
        )
    
    def _score_intent(self, question: str, patterns: List[re.Pattern]) -> Tuple[float, List[str]]:
        """Score how well a question matches an intent's patterns"""
        matches = []
        for pattern in patterns:
            found = pattern.findall(question)
            matches.extend(found)
        
        if not matches:
            return 0.0, []
        
        # More matches = higher confidence
        score = min(len(matches) * 0.25, 1.0)
        
        # Boost if multiple unique keywords match
        unique_matches = list(set(matches))
        if len(unique_matches) > 1:
            score = min(score + 0.2, 1.0)
        
        return score, unique_matches
    
    def _build_result(
        self,
        primary: AstroIntent,
        confidence: float,
        secondary: Optional[List[AstroIntent]] = None,
        topics: Optional[List[str]] = None,
        is_timing: bool = False,
        is_yes_no: bool = False
    ) -> Dict:
        """Build the result dictionary"""
        return {
            "primary_intent": primary,
            "intent_name": primary.value,
            "secondary_intents": secondary or [],
            "confidence": round(confidence, 2),
            "relevant_houses": INTENT_HOUSE_MAP.get(primary, []),
            "is_timing_question": is_timing,
            "is_yes_no": is_yes_no,
            "extracted_topics": topics or [],
        }
    
    def get_clarification_question(self, question: str) -> Optional[str]:
        """
        Generate a clarification question if intent is unclear.
        """
        result = self.detect(question)
        
        if result["confidence"] < 0.4:
            return (
                "I'd like to help you better. Could you clarify what area of life "
                "you're asking about? For example:\n"
                "• Career & Work\n"
                "• Marriage & Relationships\n"
                "• Finance & Wealth\n"
                "• Health & Wellness\n"
                "• Education\n"
                "• Travel & Relocation"
            )
        
        return None


# Singleton instance
intent_detector = IntentDetector()
