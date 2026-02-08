
from typing import Dict, List, Optional
import logging
from datetime import datetime

from astro_app.backend.services.chat.logic.chart import ChartProcessor
from astro_app.backend.services.chat.logic.dasha import DashaAnalyzer
from astro_app.backend.services.chat.logic.transit import TransitAnalyzer
from astro_app.backend.services.chat.logic.aspects import AspectAnalyzer
from astro_app.backend.services.chat.logic.scoring import ConfidenceScorer
from astro_app.backend.services.chat.context_manager import ContextManager
from astro_app.backend.services.ai_service import AIService

logger = logging.getLogger(__name__)

class AstralEngine:
    """
    The Brain of the Operation.
    Orchestrates the entire flow from User Query to AI Response.
    
    Flow:
    1.  Parse User Input & Intent (via ContextManager/AI)
    2.  Run "Mandatory Calculations" (Logic Layer)
    3.  Compute Confidence Score
    4.  Build "Fact Sheet" System Prompt
    5.  Call AI Service for Narrative
    6.  Return Response + Logic Metadata
    """

    def __init__(self):
        self.chart_processor = ChartProcessor()
        self.dasha_analyzer = DashaAnalyzer()
        self.transit_analyzer = TransitAnalyzer()
        self.aspect_analyzer = AspectAnalyzer()
        self.scorer = ConfidenceScorer()
        self.context_manager = ContextManager()
        self.ai_service = AIService()

    def process_query(self, user_query: str, raw_chart_data: Dict, session_id: str) -> Dict:
        """
        Main entry point.
        """
        try:
            # --- PHASE 1: LOGIC LAYER ---
            # 1. Static Chart Analysis
            chart_context = self.chart_processor.process(raw_chart_data)
            
            # 2. Dynamic Period Analysis
            dasha_context = self.dasha_analyzer.analyze(raw_chart_data)
            
            # 3. Transit Triggers
            transit_context = self.transit_analyzer.analyze(raw_chart_data)
            
            # 4. Aspects & Activations
            aspect_context = self.aspect_analyzer.analyze(chart_context)
            
            # 5. Synthesis & Scoring
            full_context = {
                "chart_details": chart_context,
                "dasha": dasha_context,
                "transits": transit_context,
                "aspects": aspect_context
            }
            
            confidence = self.scorer.calculate(full_context)
            
            # --- PHASE 2: NARRATIVE LAYER ---
            # 6. Build Prompt Context
            # We bundle the logic output into a structured string for the LLM
            system_context = self._build_system_context(full_context, confidence)
            
            # 7. Get History
            history = self.context_manager.get_history(session_id)
            
            # 8. Generate Response
            ai_response = self.ai_service.generate_response(
                user_message=user_query,
                logic_context=system_context,
                history=history
            )
            
            # 9. Save Interaction (Fire & Forget in background ideally)
            self.context_manager.save_interaction(session_id, user_query, ai_response, confidence)
            
            return {
                "response": ai_response,
                "logic_metadata": {
                    "confidence": confidence,
                    "dasha": dasha_context,
                    "transits": transit_context
                }
            }
            
        except Exception as e:
            logger.error(f"Engine Error: {str(e)}", exc_info=True)
            return {
                "response": "I encountered a cosmic disturbance while calculating your chart. Please try again.",
                "error": str(e)
            }

    def _build_system_context(self, context: Dict, confidence: Dict) -> str:
        """
        Helper to format the context for the AI.
        """
        # This mirrors the logic in ContextManager but keeps Engine self-contained if needed.
        # Ideally, delegate to ContextManager.
        return self.context_manager.build_system_context({
            "chart_analysis": context.get("chart_details"),
            "dasha_analysis": context.get("dasha"),
            "transit_analysis": context.get("transits"),
            "aspect_analysis": context.get("aspects"),
            "confidence": confidence
        })
