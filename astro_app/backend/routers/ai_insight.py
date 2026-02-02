from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import logging
from astro_app.backend.services.vedastro_client import VedAstroClient
from astro_app.backend.services.ai_formatter import (
    AIResponseFormatter, 
    VEDASTRO_SYSTEM_PROMPT,
    format_vedastro_response
)

logger = logging.getLogger(__name__)

router = APIRouter()

class AIChatRequest(BaseModel):
    user_query: str
    context: str = "natal" # "natal", "guru", "horary"
    chart_data: Optional[Dict[str, Any]] = None
    user_id: str = "guest_user"
    session_id: Optional[str] = None
    book_code: Optional[str] = "PrasnaMarga" # For Guru mode

class AIChatResponse(BaseModel):
    answer: str
    status: str
    session_id: Optional[str] = None
    html_answer: Optional[str] = None
    follow_up_questions: Optional[List[str]] = []

@router.post("/chat", response_model=AIChatResponse)
async def ai_chat(request: AIChatRequest):
    """
    Unified endpoint for AI features using Google Gemini.
    """
    try:
        from astro_app.backend.services.gemini_service import GeminiService
        
        gemini_service = GeminiService()
        system_prompt = GeminiService.get_astrologer_persona()
        
        # Format Context from Chart Data
        context_str = f"Context: {request.context}\n"
        if request.chart_data:
            name = request.chart_data.get("name", "User")
            date = request.chart_data.get("date")
            time = request.chart_data.get("time")
            location = request.chart_data.get("location", "Unknown")
            tz = request.chart_data.get("timezone", "+05:30")
            
            context_str += f"Birth Data: Name: {name}, Date: {date}, Time: {time}, Location: {location}, Timezone: {tz}\n"
            context_str += f"Chart Details: {str(request.chart_data)}\n"
        
        if request.book_code:
            context_str += f"Reference Book: {request.book_code}\n"
            
        # Generate Response
        answer = gemini_service.generate_chat_response(
            user_query=request.user_query,
            system_prompt=system_prompt,
            context_data=context_str
        )
        
        # Extract Follow-up Questions (Simple heuristic or just return empty for now)
        follow_up_questions = [] 
        
        # Simple HTML formatting if Gemini returns markdown (it usually does)
        html_answer = answer.replace("\n", "<br>")
        
        return AIChatResponse(
            answer=answer,
            status="Pass",
            session_id=request.session_id or "gemini-session",
            html_answer=html_answer,
            follow_up_questions=follow_up_questions
        )

    except Exception as e:
        logger.error(f"AI Chat Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/horary-suggestions")
async def get_horary_suggestions(query: str):
    """
    Mock suggestions for now, or use Gemini to generate them.
    """
    return {"Status": "Pass", "Payload": ["Will I get the job?", "When will I get married?", "Is this a good time to invest?"]}


class DailyInsightRequest(BaseModel):
    chart_data: Dict[str, Any]
    panchang_data: Optional[Dict[str, Any]] = None


class QuickPredictionsRequest(BaseModel):
    chart_data: Dict[str, Any]
    dasha_data: Optional[Dict[str, Any]] = None


@router.post("/daily-insight")
async def get_daily_insight(request: DailyInsightRequest):
    """
    Generate AI-powered daily astrological insight.
    """
    try:
        from astro_app.backend.services.ai_insights import generate_daily_insight
        result = generate_daily_insight(request.chart_data, request.panchang_data)
        return {"status": "success", "data": result}
    except Exception as e:
        logger.error(f"Daily insight error: {str(e)}")
        return {
            "status": "success",
            "data": {
                "insight": "The cosmic energies are flowing in your favor today.",
                "mood": "positive",
                "focus_area": "Growth",
                "lucky_elements": {"color": "Gold", "number": 7, "direction": "East"},
                "power_mantra": "Om Shanti",
                "ai_powered": False
            }
        }


@router.post("/quick-predictions")
async def get_quick_predictions(request: QuickPredictionsRequest):
    """
    Generate AI-powered quick predictions for life areas.
    """
    try:
        from astro_app.backend.services.ai_insights import generate_quick_predictions
        result = generate_quick_predictions(request.chart_data, request.dasha_data)
        return {"status": "success", "data": result}
    except Exception as e:
        logger.error(f"Quick predictions error: {str(e)}")
        from astro_app.backend.services.ai_insights import get_fallback_predictions
        return {"status": "success", "data": get_fallback_predictions()}


class ComprehensiveReadingRequest(BaseModel):
    chart_data: Dict[str, Any]
    dasha_data: Optional[Dict[str, Any]] = None


@router.post("/comprehensive-reading")
async def get_comprehensive_chart_reading(request: ComprehensiveReadingRequest):
    """
    Generate a comprehensive AI-powered birth chart reading.
    This provides a full astrologer-style consultation explaining 
    all aspects of the chart like a professional astrologer would.
    """
    try:
        from astro_app.backend.services.ai_predictions import AIPredictionService
        
        ai_service = AIPredictionService()
        result = ai_service.generate_comprehensive_chart_reading(
            request.chart_data,
            request.dasha_data
        )
        
        return {"status": "success", "data": result}
    except Exception as e:
        logger.error(f"Comprehensive reading error: {str(e)}")
        return {
            "status": "error",
            "message": str(e),
            "data": None
        }
