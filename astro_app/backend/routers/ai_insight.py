from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import logging
from astro_app.backend.services.vedastro_client import VedAstroClient
from astro_app.backend.services.gemini_service import GeminiService
from astro_app.backend.geo.service import search_location
from astro_app.backend.astrology.chart import calculate_chart
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize services
gemini_service = GeminiService()

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

def format_birth_time_for_vedastro(date: str, time: str, timezone: str = "+05:30") -> str:
    """
    Convert birth data to VedAstro format: "HH:mm DD/MM/YYYY +HH:mm"
    Input date format: "DD/MM/YYYY" or "YYYY-MM-DD"
    Input time format: "HH:mm" or "HH:mm:ss"
    """
    try:
        # Parse date - handle both formats
        if "/" in date:
            # Already in DD/MM/YYYY format
            formatted_date = date
        else:
            # Convert from YYYY-MM-DD to DD/MM/YYYY
            dt = datetime.strptime(date, "%Y-%m-%d")
            formatted_date = dt.strftime("%d/%m/%Y")
        
        # Parse time - take only HH:mm
        time_parts = time.split(":")
        formatted_time = f"{time_parts[0]}:{time_parts[1]}"
        
        # Combine in VedAstro format
        return f"{formatted_time} {formatted_date} {timezone}"
    except Exception as e:
        logger.error(f"Error formatting birth time: {str(e)}")
        return f"{time} {date} {timezone}"


def generate_d1_chart_html(chart_data: Dict[str, Any], person_name: str = "User") -> str:
    """
    Generate HTML representation of D1 birth chart.
    Creates a visual chart table showing houses and planets.
    """
    try:
        planets = chart_data.get("planets", [])
        houses = chart_data.get("houses", {})
        ascendant = chart_data.get("ascendant", {})
        
        # Create a dictionary to map house numbers to planets
        house_planets = {i: [] for i in range(1, 13)}
        
        for planet in planets:
            house_num = planet.get("house", 1)
            planet_name = planet.get("name", "")
            sign = planet.get("sign", "")
            
            # Format planet info
            planet_info = f"{planet_name}"
            house_planets[house_num].append(planet_info)
        
        # Generate HTML chart (North Indian style)
        html = f"""
        <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <h3 style="margin: 0 0 15px 0; color: #6b46c1; font-size: 16px;">
                🔮 I'm drawing the vedic chart for {person_name}
            </h3>
            
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #cbd5e0; padding: 1px; border-radius: 4px; max-width: 500px;">
                <!-- Row 1 -->
                <div style="background: white; padding: 10px; min-height: 70px; border: 1px solid #cbd5e0;">
                    <div style="font-weight: bold; color: #2d3748; margin-bottom: 4px; font-size: 12px;">12</div>
                    <div style="font-size: 10px; color: #4a5568;">{", ".join(house_planets[12]) if house_planets[12] else ""}</div>
                </div>
                <div style="background: white; padding: 10px; min-height: 70px; border: 1px solid #cbd5e0;">
                    <div style="font-weight: bold; color: #2d3748; margin-bottom: 4px; font-size: 12px;">1</div>
                    <div style="font-size: 10px; color: #4a5568;">
                        <div style="color: #d97706; font-weight: 600; margin-bottom: 2px;">Asc</div>
                        {", ".join(house_planets[1]) if house_planets[1] else ""}
                    </div>
                </div>
                <div style="background: white; padding: 10px; min-height: 70px; border: 1px solid #cbd5e0;">
                    <div style="font-weight: bold; color: #2d3748; margin-bottom: 4px; font-size: 12px;">2</div>
                    <div style="font-size: 10px; color: #4a5568;">{", ".join(house_planets[2]) if house_planets[2] else ""}</div>
                </div>
                <div style="background: white; padding: 10px; min-height: 70px; border: 1px solid #cbd5e0;">
                    <div style="font-weight: bold; color: #2d3748; margin-bottom: 4px; font-size: 12px;">3</div>
                    <div style="font-size: 10px; color: #4a5568;">{", ".join(house_planets[3]) if house_planets[3] else ""}</div>
                </div>
                
                <!-- Row 2 -->
                <div style="background: white; padding: 10px; min-height: 70px; border: 1px solid #cbd5e0;">
                    <div style="font-weight: bold; color: #2d3748; margin-bottom: 4px; font-size: 12px;">11</div>
                    <div style="font-size: 10px; color: #4a5568;">{", ".join(house_planets[11]) if house_planets[11] else ""}</div>
                </div>
                <div style="background: #f7fafc; padding: 10px; min-height: 70px; border: 1px solid #cbd5e0; grid-column: span 2; grid-row: span 2; display: flex; align-items: center; justify-content: center;">
                    <div style="text-align: center; color: #718096; font-size: 11px;">
                        <div style="font-weight: 600; margin-bottom: 4px;">Rasi: D1</div>
                        <div>{person_name}</div>
                    </div>
                </div>
                <div style="background: white; padding: 10px; min-height: 70px; border: 1px solid #cbd5e0;">
                    <div style="font-weight: bold; color: #2d3748; margin-bottom: 4px; font-size: 12px;">4</div>
                    <div style="font-size: 10px; color: #4a5568;">{", ".join(house_planets[4]) if house_planets[4] else ""}</div>
                </div>
                
                <!-- Row 3 -->
                <div style="background: white; padding: 10px; min-height: 70px; border: 1px solid #cbd5e0;">
                    <div style="font-weight: bold; color: #2d3748; margin-bottom: 4px; font-size: 12px;">10</div>
                    <div style="font-size: 10px; color: #4a5568;">{", ".join(house_planets[10]) if house_planets[10] else ""}</div>
                </div>
                <div style="background: white; padding: 10px; min-height: 70px; border: 1px solid #cbd5e0;">
                    <div style="font-weight: bold; color: #2d3748; margin-bottom: 4px; font-size: 12px;">5</div>
                    <div style="font-size: 10px; color: #4a5568;">{", ".join(house_planets[5]) if house_planets[5] else ""}</div>
                </div>
                
                <!-- Row 4 -->
                <div style="background: white; padding: 10px; min-height: 70px; border: 1px solid #cbd5e0;">
                    <div style="font-weight: bold; color: #2d3748; margin-bottom: 4px; font-size: 12px;">9</div>
                    <div style="font-size: 10px; color: #4a5568;">{", ".join(house_planets[9]) if house_planets[9] else ""}</div>
                </div>
                <div style="background: white; padding: 10px; min-height: 70px; border: 1px solid #cbd5e0;">
                    <div style="font-weight: bold; color: #2d3748; margin-bottom: 4px; font-size: 12px;">8</div>
                    <div style="font-size: 10px; color: #4a5568;">{", ".join(house_planets[8]) if house_planets[8] else ""}</div>
                </div>
                <div style="background: white; padding: 10px; min-height: 70px; border: 1px solid #cbd5e0;">
                    <div style="font-weight: bold; color: #2d3748; margin-bottom: 4px; font-size: 12px;">7</div>
                    <div style="font-size: 10px; color: #4a5568;">{", ".join(house_planets[7]) if house_planets[7] else ""}</div>
                </div>
                <div style="background: white; padding: 10px; min-height: 70px; border: 1px solid #cbd5e0;">
                    <div style="font-weight: bold; color: #2d3748; margin-bottom: 4px; font-size: 12px;">6</div>
                    <div style="font-size: 10px; color: #4a5568;">{", ".join(house_planets[6]) if house_planets[6] else ""}</div>
                </div>
            </div>
            
            <p style="margin: 15px 0 0 0; color: #4a5568; font-size: 14px;">
                Ok, I've read the horoscope. 🤔<br>
                Any questions?
            </p>
        </div>
        """
        
        return html
    except Exception as e:
        logger.error(f"Error generating D1 chart HTML: {e}")
        return f"<p>Error generating chart: {str(e)}</p>"

@router.post("/chat", response_model=AIChatResponse)
async def ai_chat(request: AIChatRequest):
    """
    Unified endpoint for AI features using VedAstro API.
    This will call VedAstro's AI Chat which returns HTML with charts.
    """
    try:
        # Determine chat type based on context
        chat_type_map = {
            "natal": "Horoscope",
            "guru": "Teacher",
            "horary": "Horary"
        }
        chat_type = chat_type_map.get(request.context, "Horoscope")
        
        # Check if user is asking for chart display
        chart_keywords = ["chart", "kundli", "horoscope", "birth chart", "show me", "draw"]
        is_chart_request = any(keyword in request.user_query.lower() for keyword in chart_keywords)
        
        # Generate local D1 chart if requested and chart data is available
        local_chart_html = None
        if is_chart_request and request.context == "natal" and request.chart_data:
            try:
                logger.info("Generating local D1 chart")
                
                # Parse birth details
                date_str = request.chart_data.get("date", "")
                time_str = request.chart_data.get("time", "")
                timezone_str = request.chart_data.get("timezone", "+05:30")
                location = request.chart_data.get("location", "")
                
                # Get coordinates
                latitude = request.chart_data.get("latitude")
                longitude = request.chart_data.get("longitude")
                
                if not latitude or not longitude:
                    geo_results = search_location(location)
                    if geo_results and len(geo_results) > 0:
                        latitude = geo_results[0]["latitude"]
                        longitude = geo_results[0]["longitude"]
                    else:
                        latitude = 0.0
                        longitude = 0.0
                
                # Calculate chart
                chart_result = calculate_chart(
                    date_str,
                    time_str,
                    timezone_str,
                    float(latitude),
                    float(longitude)
                )
                    
                # Generate HTML
                person_name = request.chart_data.get("name", "User")
                local_chart_html = generate_d1_chart_html(chart_result, person_name)
                logger.info("Successfully generated local D1 chart")
                    
            except Exception as e:
                logger.error(f"Error generating local chart: {e}", exc_info=True)
        
        # If we have chart data and it's natal mode, submit birth data first
        vedastro_session_id = request.session_id
        
        if request.context == "natal" and request.chart_data and not request.session_id and not local_chart_html:
            # Get coordinates from location name if not provided
            latitude = request.chart_data.get("latitude")
            longitude = request.chart_data.get("longitude")
            location_name = request.chart_data.get("location", "Unknown")
            
            if not latitude or not longitude:
                # Geocode the location
                logger.info(f"Geocoding location: {location_name}")
                geo_results = search_location(location_name)
                if geo_results and len(geo_results) > 0:
                    latitude = geo_results[0]["latitude"]
                    longitude = geo_results[0]["longitude"]
                    logger.info(f"Found coordinates: {latitude}, {longitude}")
                else:
                    # Default to some coordinates if geocoding fails
                    latitude = 0.0
                    longitude = 0.0
                    logger.warning(f"Could not geocode location: {location_name}")
            
            # Format birth time for VedAstro
            formatted_time = format_birth_time_for_vedastro(
                request.chart_data.get("date", ""),
                request.chart_data.get("time", ""),
                request.chart_data.get("timezone", "+05:30")
            )
            
            # Submit birth data to VedAstro
            birth_response = VedAstroClient.submit_birth_data(
                user_id=request.user_id,
                name=request.chart_data.get("name", "User"),
                formatted_time=formatted_time,
                location=location_name,
                longitude=longitude,
                latitude=latitude,
                chat_type=chat_type
            )
            
            # Extract session ID from response
            if birth_response.get("Status") == "Pass":
                payload = birth_response.get("Payload", {})
                vedastro_session_id = payload.get("SessionId")
                logger.info(f"Got VedAstro session ID: {vedastro_session_id}")
        
        # Call appropriate VedAstro endpoint based on context
        if request.context == "guru":
            # AI Teacher mode
            vedastro_response = VedAstroClient.ask_ai_teacher(
                user_id=request.user_id,
                question=request.user_query,
                book_code=request.book_code or "PrasnaMarga",
                session_id=vedastro_session_id
            )
        else:
            # AI Chat mode (natal or horary)
            vedastro_response = VedAstroClient.ask_ai_chat(
                user_id=request.user_id,
                question=request.user_query,
                chat_type=chat_type,
                session_id=vedastro_session_id
            )
        
        # Parse VedAstro response
        if vedastro_response.get("Status") == "Pass":
            payload = vedastro_response.get("Payload", {})
            
            # Extract answer and HTML
            answer_text = payload.get("Answer", "")
            html_answer = payload.get("HtmlAnswer", "")
            
            # Get session ID for next request
            new_session_id = payload.get("SessionId", vedastro_session_id)
            
            # Extract follow-up questions if available
            follow_ups = payload.get("FollowUpQuestions", [])
            
            return AIChatResponse(
                answer=answer_text,
                status="Pass",
                session_id=new_session_id,
                html_answer=html_answer if html_answer else local_chart_html,
                follow_up_questions=follow_ups
            )
        else:
            # VedAstro API failed, use fallback with Gemini
            logger.warning("VedAstro API unavailable, using Gemini fallback")
            from astro_app.backend.services.gemini_service import GeminiService
            
            gemini_service = GeminiService()
            system_prompt = GeminiService.get_astrologer_persona()
            
            # Format Context from Chart Data
            context_str = f"Context: {request.context}\\n"
            if request.chart_data:
                name = request.chart_data.get("name", "User")
                date = request.chart_data.get("date")
                time = request.chart_data.get("time")
                location = request.chart_data.get("location", "Unknown")
                tz = request.chart_data.get("timezone", "+05:30")
                
                context_str += f"Birth Data: Name: {name}, Date: {date}, Time: {time}, Location: {location}, Timezone: {tz}\\n"
            
            if request.book_code:
                context_str += f"Reference Book: {request.book_code}\\n"
                
            # Generate Response
            answer = gemini_service.generate_chat_response(
                user_query=request.user_query,
                system_prompt=system_prompt,
                context_data=context_str
            )
            
            # Simple HTML formatting
            html_answer = answer.replace("\\n", "<br>")
            
            return AIChatResponse(
                answer=answer,
                status="Pass",
                session_id=request.session_id or "gemini-session",
                html_answer=local_chart_html if local_chart_html else html_answer,
                follow_up_questions=[]
            )

    except Exception as e:
        logger.error(f"AI Chat Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/horary-suggestions")
async def get_horary_suggestions(query: str):
    """
    Get horary question suggestions from VedAstro.
    """
    result = VedAstroClient.get_horary_suggestions(query)
    if result.get("Status") == "Pass":
        return {"Status": "Pass", "Payload": result.get("Payload", [])}
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
