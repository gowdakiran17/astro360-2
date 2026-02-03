from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import logging
from astro_app.backend.services.vedastro_client import VedAstroClient
from astro_app.backend.services.gemini_service import GeminiService
from astro_app.backend.services.kimi_service import KimiService
import os
from astro_app.backend.geo.service import search_location
from astro_app.backend.astrology.chart import calculate_chart
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize services
# Initialize services based on provider
AI_PROVIDER = os.getenv("AI_PROVIDER", "Gemini")
gemini_service = GeminiService() # Keep Gemini as default/fallback
kimi_service = KimiService() # Initialize KimiService unconditionally for fallback capability

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


async def format_chart_for_ai(chart_data: Dict[str, Any]) -> str:
    """
    Format the calculated chart data into a text summary for the AI context.
    Includes Dasha and House-Planet associations for the new Vedant V2 structure.
    """
    try:
        asc = chart_data.get("ascendant", {})
        planets = chart_data.get("planets", [])
        
        output = "CRITICAL DATA - SOURCE OF TRUTH (MUST USE THESE RESULTS):\n\n"
        output += f"Lagna (Ascendant): {asc.get('zodiac_sign')} at {asc.get('formatted_degree')} in {asc.get('nakshatra')} nakshatra.\n\n"
        
        # 1. Planetary Positions Table
        output += "Planetary Positions:\n"
        output += "| Planet | Sign | Degree | Nakshatra (Lord) | House | Status |\n"
        output += "| :--- | :--- | :--- | :--- | :--- | :--- |\n"
        
        for p in planets:
            name = p.get("name")
            sign = p.get("zodiac_sign")
            deg = p.get("formatted_degree")
            nak = f"{p.get('nakshatra')} ({p.get('nakshatra_lord')})"
            house = p.get("house")
            status = "Retrograde" if p.get("is_retrograde") else "Direct"
            output += f"| {name} | {sign} | {deg} | {nak} | {house} | {status} |\n"
        
        output += "\n"
        
        # 2. House Inventory (Planets per House)
        output += "House Inventory (Zodiac Signs per House):\n"
        houses_planets = {}
        for p in planets:
            h = p.get("house")
            if h not in houses_planets: houses_planets[h] = []
            houses_planets[h].append(p.get("name"))
        
        # We assume 12 houses exist in chart_data['houses']
        chart_houses = chart_data.get("houses", [])
        for i in range(12):
            h_num = i + 1
            h_data = chart_houses[i] if i < len(chart_houses) else {}
            sign_name = h_data.get("zodiac_sign", "Unknown")
            p_list = houses_planets.get(h_num, ["None"])
            output += f"- House {h_num} ({sign_name}): {', '.join(p_list)}\n"
        
        output += "\n"
        
        # 3. Current Dasha Info
        try:
            from astro_app.backend.astrology.dasha import calculate_vimshottari_dasha
            bd = chart_data.get("birth_details", {})
            moon_data = next((p for p in planets if p.get("name") == "Moon"), None)
            
            if moon_data and bd:
                dasha_data = await calculate_vimshottari_dasha(
                    bd.get("date"), bd.get("time"), bd.get("timezone"),
                    bd.get("latitude"), bd.get("longitude"),
                    moon_longitude=moon_data.get("longitude")
                )
                output += "Current Dasha Sequence (Upcoming):\n"
                # First 3 main periods for context from the 'dashas' list
                for d in dasha_data.get('dashas', [])[:3]: 
                     output += f"- {d['lord']} Mahadasha: {d['start_date']} to {d['end_date']}\n"
                
                # Also add specific "Current Dasha" from summary
                summary = dasha_data.get('summary', {})
                md = summary.get('current_mahadasha', {})
                ad = summary.get('current_antardasha', {})
                if md and ad:
                    output += f"\nACTIVE NOW: {md.get('lord')} Mahadasha — {ad.get('lord')} Antardasha. "
                    output += f"Remaining: {ad.get('time_remaining')}\n"
        except Exception as de:
            logger.warning(f"Could not inject Dasha into AI context: {de}")
            
        return output
    except Exception as e:
        logger.error(f"Error formatting chart for AI: {e}")
        return "Critical data unavailable."


def generate_d1_chart_html(chart_data: Dict[str, Any], person_name: str = "User", style: str = "south") -> str:
    """
    Generate HTML representation of D1 birth chart.
    Supports 'north' (Diamond) and 'south' (Grid) styles.
    """
    try:
        planets = chart_data.get("planets", [])
        ascendant = chart_data.get("ascendant", {})
        asc_sign_num = int(ascendant.get("longitude", 0) / 30) + 1
        
        # Dashboard Planet Colors
        PLANET_COLORS = {
            "Sun": "#FCA5A5", "Moon": "#E9D5FF", "Mars": "#FDBA74", 
            "Mercury": "#93C5FD", "Jupiter": "#FDE047", "Venus": "#86EFAC", 
            "Saturn": "#FDA4AF", "Rahu": "#D8B4FE", "Ketu": "#F9A8D4"
        }

        # Mapping for South Indian (Fixed Signs)
        # Signs: 1-Aries, 2-Taurus ... 12-Pisces
        sign_planets = {i: [] for i in range(1, 13)}
        for planet in planets:
            p_lon = planet.get("longitude", 0)
            p_sign_num = int(p_lon / 30) + 1
            if 1 <= p_sign_num <= 12:
                sign_planets[p_sign_num].append(planet.get("name", ""))

        if style == "south":
            def get_box(sign_num):
                ps = sign_planets[sign_num]
                is_asc = sign_num == asc_sign_num
                
                # Format planets with dashboard colors
                planet_html = ""
                for p in ps:
                    color = PLANET_COLORS.get(p, "#CBD5E1")
                    # Use short names (2 chars)
                    p_short = p[:2]
                    planet_html += f'<div style="color: {color}; font-weight: 800; font-size: 14px; margin: 1px 0;">{p_short}</div>'
                
                asc_mark = '<div style="color: #f59e0b; font-weight: 900; font-size: 12px; margin-bottom: 2px;">Asc</div>' if is_asc else ""
                
                return f"""
                <div style="background: rgba(30, 41, 59, 0.4); border: 1.5px solid #f59e0b; padding: 4px; min-height: 85px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
                    {asc_mark}
                    {planet_html}
                </div>
                """

            html = f"""
            <div style="margin: 20px 0; padding: 25px; background: #262c4b; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 15px 35px rgba(0,0,0,0.4); text-align: center;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 20px;">
                    <span style="background: rgba(245,158,11,0.2); color: #f59e0b; padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 900; border: 1px solid rgba(245,158,11,0.3);">D1 ARRAY</span>
                    <h3 style="margin: 0; color: #fff; font-size: 18px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">LAGNA CHART</h3>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; background: #f59e0b; padding: 1.5px; max-width: 360px; margin: 0 auto; border: 2px solid #f59e0b;">
                    {get_box(12)}{get_box(1)}{get_box(2)}{get_box(3)}
                    {get_box(11)}
                    <div style="grid-column: span 2; grid-row: span 2; background: #262c4b; display: flex; align-items: center; justify-content: center; border: 1px solid #f59e0b;">
                        <div>
                             <div style="color: rgba(255,255,255,0.3); font-size: 10px; font-weight: 800; letter-spacing: 2px;">VedaAI</div>
                        </div>
                    </div>
                    {get_box(4)}
                    {get_box(10)}
                    {get_box(5)}
                    {get_box(9)}{get_box(8)}{get_box(7)}{get_box(6)}
                </div>
                
                <p style="margin-top: 20px; color: #94a3b8; font-size: 13px; font-weight: 500;">
                    {person_name}'s horoscope alignment correctly rendered.
                </p>
            </div>
            """
            return html

        else:
            # --- North Indian Style (Diamond) ---
            # Correct Non-Overlapping Geometry (Tiling 12 triangles/diamonds)
            # Houses h1-h12 mapping to signs based on Ascendant
            house_signs = {i: (asc_sign_num + i - 2) % 12 + 1 for i in range(1, 13)}
            
            # Group planets by house
            house_planets = {i: [] for i in range(1, 13)}
            for planet in planets:
                p_lon = planet.get("longitude", 0)
                p_sign_num = int(p_lon / 30) + 1
                diff = p_sign_num - asc_sign_num
                if diff < 0: diff += 12
                h_num = diff + 1
                house_planets[h_num].append(planet.get("name", ""))

            # Centroids and Polygons for all 12 houses (relative to 100x100 box)
            # Format: (HouseNum): (Polygon, CentroidX, CentroidY, SignPosStyle)
            GEOMETRY = {
                1: ("50% 50%, 25% 25%, 50% 0%, 75% 25%", 50, 28, "bottom: 4px;"),
                2: ("0% 0%, 50% 0%, 25% 25%", 25, 12, "top: 2px; right: 4px;"),
                3: ("0% 0%, 0% 50%, 25% 25%", 12, 25, "top: 4px; left: 2px;"),
                4: ("50% 50%, 25% 25%, 0% 50%, 25% 75%", 28, 50, "right: 4px;"),
                5: ("0% 100%, 0% 50%, 25% 75%", 12, 75, "bottom: 4px; left: 2px;"),
                6: ("0% 100%, 50% 100%, 25% 75%", 25, 88, "bottom: 2px; right: 4px;"),
                7: ("50% 50%, 25% 75%, 50% 100%, 75% 75%", 50, 72, "top: 4px;"),
                8: ("100% 100%, 50% 100%, 75% 75%", 75, 88, "bottom: 2px; left: 4px;"),
                9: ("100% 100%, 100% 50%, 75% 75%", 88, 75, "bottom: 4px; right: 2px;"),
                10: ("50% 50%, 75% 25%, 100% 50%, 75% 75%", 72, 50, "left: 4px;"),
                11: ("100% 0%, 100% 50%, 75% 25%", 88, 25, "top: 4px; right: 2px;"),
                12: ("100% 0%, 50% 0%, 75% 25%", 75, 12, "top: 2px; left: 4px;")
            }

            houses_html = ""
            for h_num, (poly, cx, cy, sign_style) in GEOMETRY.items():
                ps = house_planets[h_num]
                sign = house_signs[h_num]
                # Format planet text
                p_text = ""
                if ps:
                    if len(ps) > 2:
                        p_text = f"{ps[0]}, {ps[1]}..."
                    else:
                        p_text = ", ".join(ps)

                houses_html += f"""
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0.5px solid rgba(245,158,11,0.2); clip-path: polygon({poly}); background: rgba(255,255,255,0.02); display: flex; align-items: center; justify-content: center;">
                    <div style="position: absolute; {sign_style} font-size: 10px; color: #f59e0b; font-weight: 800; opacity: 0.8;">{sign}</div>
                    <div style="position: absolute; left: {cx}%; top: {cy}%; transform: translate(-50%, -50%); color: #fff; font-size: 9px; text-align: center; white-space: nowrap; font-weight: 500;">{p_text}</div>
                </div>
                """

            html = f"""
            <div style="margin: 20px 0; padding: 25px; background: #050816; border-radius: 32px; border: 1px solid rgba(245,158,11,0.3); box-shadow: 0 20px 50px rgba(0,0,0,0.8); font-family: 'Inter', sans-serif; overflow: hidden; position: relative;">
                <!-- Subtle Background Glow -->
                <div style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 200px; background: radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%); pointer-events: none;\"></div>

                <h3 style="margin: 0 0 20px 0; color: #f59e0b; font-size: 18px; text-align: center; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">
                    🌌 NATAL CHART: D1 RASI
                </h3>
                
                <div style="position: relative; width: 300px; height: 300px; margin: 0 auto; border: 2px solid rgba(245,158,11,0.5); background: #0a0e1a; box-shadow: inset 0 0 20px rgba(0,0,0,0.5);">
                    {houses_html}
                    
                    <!-- Center Profile Point -->
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: rgba(5,8,22,0.8); border: 1px solid rgba(245,158,11,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 20; backdrop-blur: 4px;">
                        <div style=\"color: #f59e0b; font-weight: 900; font-size: 8px; text-align: center; line-height: 1; text-transform: uppercase; letter-spacing: 1px;\">{person_name.split()[0]}</div>
                    </div>
                </div>

                <div style="margin-top: 25px; display: flex; align-items: center; justify-content: center; gap: 12px; background: rgba(255,255,255,0.03); padding: 12px; border-radius: 16px;">
                    <div style="width: 8px; height: 8px; background: #ec4899; border-radius: 2px;"></div>
                    <div style="color: rgba(255,255,255,0.5); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                        Ascendant: <span style=\"color: #ec4899; font-weight: 900;\">{ascendant.get('zodiac_sign', '')}</span>
                    </div>
                </div>
            </div>
            """
            return html

    except Exception as e:
        logger.error(f"Error generating chart HTML: {e}")
        return f"<div style='color: #ef4444; padding: 20px; border: 1px solid #ef4444; border-radius: 12px; background: rgba(239,68,68,0.1);'>Failed to generate chart visual. Please try again.</div>"

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
                local_chart_html = generate_d1_chart_html(chart_result, person_name, style="south")
                logger.info("Successfully generated local D1 chart (South Indian style matched to dashboard)")
                    
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
            # VedAstro API failed, use fallback with configured Provider
            logger.warning(f"VedAstro API unavailable, using {AI_PROVIDER} fallback")
            
            system_prompt = GeminiService.get_astrologer_persona()
            
            # Format Context from Chart Data
            now = datetime.now()
            current_date_str = now.strftime("%B %d, %Y") # e.g. "February 03, 2026"
            context_str = f"Current Date (Today): {current_date_str}\\n"
            context_str += f"Context: {request.context}\\n"
            data_context = ""
            
            if request.chart_data:
                name = request.chart_data.get("name", "User")
                date = request.chart_data.get("date")
                time = request.chart_data.get("time")
                location = request.chart_data.get("location", "Unknown")
                tz = request.chart_data.get("timezone", "+05:30")
                lat = request.chart_data.get("latitude")
                lon = request.chart_data.get("longitude")
                
                context_str += f"Birth Data: Name: {name}, Date: {date}, Time: {time}, Location: {location}, Timezone: {tz}\\n"
                
                # Fetch calculated chart to provide as SOURCE OF TRUTH
                try:
                    if not lat or not lon:
                        geo = search_location(location)
                        if geo:
                            lat, lon = geo[0]["latitude"], geo[0]["longitude"]
                    
                    if date and time and lat is not None and lon is not None:
                        calc_result = calculate_chart(date, time, tz, float(lat), float(lon))
                        data_context = await format_chart_for_ai(calc_result)
                        logger.info("Successfully injected calculated chart data into AI context")
                except Exception as e:
                    logger.error(f"Failed to calculate chart for AI context: {e}")

            if request.book_code:
                context_str += f"Reference Book: {request.book_code}\\n"
                
            # Combine context with real data
            full_context = context_str
            if data_context:
                full_context += f"\\n{data_context}"

            # Generate Response based on Provider
            if AI_PROVIDER == "Kimi":
                answer = kimi_service.generate_chat_response(
                    user_query=request.user_query,
                    system_prompt=system_prompt,
                    context_data=full_context
                )
            else:
                 # Default to Gemini with Kimi Fallback
                answer = gemini_service.generate_chat_response(
                    user_query=request.user_query,
                    system_prompt=system_prompt,
                    context_data=full_context
                )
                
                # Check for Gemini failure (heuristic based on error message)
                if "I apologize" in answer and "trouble connecting" in answer:
                    logger.warning("Gemini failed, attempting fallback to Kimi...")
                    if kimi_service:
                        answer = kimi_service.generate_chat_response(
                            user_query=request.user_query,
                            system_prompt=system_prompt,
                            context_data=full_context
                        )
                    else:
                        logger.error("Kimi fallback requested but KimiService not initialized")
            
            return AIChatResponse(
                answer=answer,
                status="Pass",
                session_id=request.session_id or f"{AI_PROVIDER.lower()}-session",
                html_answer=local_chart_html,  # Only return HTML if we generated a chart
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


class DailyHoroscopeRequest(BaseModel):
    chart_data: Dict[str, Any]
    dasha_data: Optional[Dict[str, Any]] = None
    current_date: Optional[str] = None  # ISO format datetime


@router.post("/daily-horoscopes")
async def get_daily_horoscopes(request: DailyHoroscopeRequest):
    """
    Generate personalized daily horoscopes for 5 life areas.
    Combines Dasha, Transits, Nakshatra, and AI synthesis.
    """
    try:
        from astro_app.backend.services.daily_horoscope_engine import DailyHoroscopeEngine
        from astro_app.backend.astrology.chart import calculate_chart
        
        # Parse current date or use now
        if request.current_date:
            # Handle 'Z' timezone indicator (replace with '+00:00')
            date_str = request.current_date.replace('Z', '+00:00')
            current_time = datetime.fromisoformat(date_str)
        else:
            current_time = datetime.now()
        
        # Get birth chart data
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
        
        # Calculate birth chart
        birth_chart = calculate_chart(
            date_str,
            time_str,
            timezone_str,
            float(latitude),
            float(longitude)
        )
        
        # Add name to chart
        birth_chart["name"] = request.chart_data.get("name", "User")
        
        # Get Dasha data
        dasha_data = request.dasha_data
        if not dasha_data:
            # Calculate Dasha if not provided
            from astro_app.backend.astrology.dasha import calculate_vimshottari_dasha
            moon_data = next((p for p in birth_chart.get("planets", []) if p.get("name") == "Moon"), None)
            
            if moon_data:
                dasha_data = await calculate_vimshottari_dasha(
                    date_str, time_str, timezone_str,
                    float(latitude), float(longitude),
                    moon_longitude=moon_data.get("longitude")
                )
        
        # Calculate current transits (simplified - using birth chart positions as placeholder)
        # In production, this would fetch real-time ephemeris data
        current_transits = {}
        for planet in birth_chart.get("planets", []):
            current_transits[planet["name"]] = planet["longitude"]
        
        # Get current Moon longitude (placeholder)
        current_moon_longitude = current_transits.get("Moon", 0.0)
        
        # Initialize horoscope engine
        engine = DailyHoroscopeEngine(ai_provider=AI_PROVIDER)
        
        # Generate daily horoscopes
        result = engine.generate_daily_horoscopes(
            birth_chart=birth_chart,
            dasha_data=dasha_data,
            current_transits=current_transits,
            current_moon_longitude=current_moon_longitude,
            current_time=current_time,
            latitude=float(latitude),
            longitude=float(longitude)
        )
        
        return {"status": "success", "data": result.dict()}
        
    except Exception as e:
        logger.error(f"Daily horoscope error: {str(e)}", exc_info=True)
        return {
            "status": "error",
            "message": str(e),
            "data": None
        }

# --- Transit AI Request Models ---

class TransitSummaryRequest(BaseModel):
    chart_data: Dict[str, Any]
    transits: List[Dict[str, Any]]

class TransitExplanationRequest(BaseModel):
    transit_event: Dict[str, Any]
    mode: str = "Beginner"

class TransitTimelineRequest(BaseModel):
    timeline_events: List[Dict[str, Any]]

# --- Transit AI Endpoints ---

@router.post("/transits/daily-insight")
async def get_transit_daily_insight(request: TransitSummaryRequest):
    """
    Get daily core summary, priority ranking, and action guidance for transits.
    """
    try:
        from astro_app.backend.services.transit_ai_service import TransitAIService
        service = TransitAIService()
        result = service.generate_daily_summary(request.chart_data, request.transits)
        return {"status": "success", "data": result}
    except Exception as e:
        logger.error(f"Transit daily insight error: {str(e)}")
        # Fallback
        return {
            "status": "partial_success",
            "data": {
                "summary": "Focus on the present moment. The stars support steady progress.",
                "priority_order": [],
                "action_guidance": {"do": [], "avoid": []}
            }
        }

@router.post("/transits/explain")
async def explain_transit(request: TransitExplanationRequest):
    """
    Get detailed AI explanation for a specific transit in a specific mode.
    """
    try:
        from astro_app.backend.services.transit_ai_service import TransitAIService
        service = TransitAIService()
        result = service.explain_transit(request.transit_event, request.mode)
        return {"status": "success", "data": result}
    except Exception as e:
        logger.error(f"Transit explanation error: {str(e)}")
        return {
            "status": "error",
            "message": "Could not generate explanation."
        }

@router.post("/transits/timeline")
async def get_transit_timeline_story(request: TransitTimelineRequest):
    """
    Get a narrative story for the upcoming transit timeline.
    """
    try:
        from astro_app.backend.services.transit_ai_service import TransitAIService
        service = TransitAIService()
        result = service.get_timeline_story(request.timeline_events)
        return {"status": "success", "data": {"story": result}}
    except Exception as e:
        logger.error(f"Transit timeline error: {str(e)}")
        return {
            "status": "partial_success",
            "data": {"story": "Upcoming trends look balanced."}
        }
