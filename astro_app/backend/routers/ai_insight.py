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
    Unified endpoint for VedAstro AI features.
    """
    try:
        # 1. Handle Natal/Horary Session Initialization
        if not request.session_id and request.context in ["natal", "horary"]:
            if request.chart_data:
                name = request.chart_data.get("name", "User")
                date = request.chart_data.get("date")
                time = request.chart_data.get("time")
                location = request.chart_data.get("location", "Unknown")
                lat = request.chart_data.get("latitude", 0.0)
                lon = request.chart_data.get("longitude", 0.0)
                tz = request.chart_data.get("timezone", "+05:30")
                
                # Format date/time with timezone for VedAstro
                # VedAstro expects "HH:mm DD/MM/YYYY +HH:mm"
                formatted_time = f"{time} {date} {tz}"
                
                chat_type = "Horary" if request.context == "horary" else "Horoscope"
                
                init_result = VedAstroClient.submit_birth_data(
                    user_id=request.user_id,
                    name=name,
                    formatted_time=formatted_time,
                    location=location,
                    longitude=lon,
                    latitude=lat,
                    chat_type=chat_type
                )
                
                if init_result.get("Status") == "Pass":
                    payload = init_result.get("Payload", {})
                    # If user_query is empty, just return the initialization response
                    if not request.user_query or request.user_query.strip() == "":
                        return AIChatResponse(
                            answer=payload.get("Text", "Chart analyzed."),
                            status="Pass",
                            session_id=payload.get("SessionId"),
                            html_answer=payload.get("TextHtml") or payload.get("Html", ""),
                            follow_up_questions=payload.get("FollowUpQuestions", [])
                        )
                    # Otherwise, use the new session_id for the actual question
                    request.session_id = payload.get("SessionId")
            else:
                if request.context == "natal":
                    return AIChatResponse(answer="Please select a chart first.", status="Fail")

        # 2. Call appropriate VedAstro Endpoint
        if request.context == "guru":
            result = VedAstroClient.ask_ai_teacher(
                user_id=request.user_id,
                question=request.user_query,
                book_code=request.book_code,
                session_id=request.session_id
            )
        else:
            # Natal or Horary (VedAstro handles Horary context in chat_type)
            chat_type = "Horary" if request.context == "horary" else "Horoscope"
            result = VedAstroClient.ask_ai_chat(
                user_id=request.user_id,
                question=request.user_query,
                chat_type=chat_type,
                session_id=request.session_id
            )

        if result.get("Status") == "Pass":
            payload = result.get("Payload", {})
            # Payloads can sometimes be strings or objects depending on specific API calls
            if isinstance(payload, str):
                formatted = format_vedastro_response(payload)
                return AIChatResponse(
                    answer=formatted['text'],
                    status="Pass",
                    html_answer=formatted['html'],
                    follow_up_questions=formatted['follow_up_questions']
                )
            
            answer = payload.get("Text", "No response from AI")
            html_answer = payload.get("Html") or payload.get("TextHtml", "")
            session_id = payload.get("SessionId")
            
            # Apply VedAstro-style formatting if HTML is not already provided
            if not html_answer and answer:
                formatter = AIResponseFormatter()
                html_answer = formatter.format_for_html(answer)
            
            # Extract follow-up questions if not provided
            follow_up = payload.get("FollowUpQuestions", [])
            if not follow_up and answer:
                follow_up = AIResponseFormatter.extract_follow_up_questions(answer)
            
            return AIChatResponse(
                answer=answer, 
                status="Pass", 
                session_id=session_id,
                html_answer=html_answer,
                follow_up_questions=follow_up
            )
        else:
            return AIChatResponse(answer=result.get("Payload", "Error from VedAstro"), status="Fail")

    except Exception as e:
        logger.error(f"AI Chat Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/horary-suggestions")
async def get_horary_suggestions(query: str):
    """
    Proxy to VedAstro Horary Suggestions
    """
    return VedAstroClient.get_horary_suggestions(query)


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
