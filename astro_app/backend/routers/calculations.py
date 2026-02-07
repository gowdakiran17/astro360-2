from fastapi import APIRouter, Depends, HTTPException
from functools import lru_cache
from typing import List
from datetime import datetime, timedelta
from astro_app.backend.schemas import (
    BirthDetails, DashaRequest, DivisionalRequest, PeriodRequest,
    ShodashvargaRequest, AshtakvargaRequest, ShadbalaRequest, ShadowPlanetsRequest,
    TransitRequest, AdvancedTransitRequest, AnalysisRequest, LifeTimelineRequest, PredictionRequest, LifePredictorRequest,
    StrengthRequest, KPRequest, MatchRequest, MuhurataRequest, HoraryRequest, RectificationRequest,
    SolarReturnRequest, IngressRequest, MuhurtaSearchRequest
)
from astro_app.backend.auth.router import get_current_user
from astro_app.backend.models import User
from astro_app.backend.monetization.access_control import verify_user_access, Feature
from astro_app.backend.astrology.chart import calculate_chart
from astro_app.backend.astrology.solar_return import calculate_solar_return
from astro_app.backend.astrology.dasha import calculate_vimshottari_dasha
from astro_app.backend.astrology.divisional import calculate_divisional_charts
from astro_app.backend.astrology.period_analysis import get_full_period_analysis
from astro_app.backend.astrology.sade_sati import calculate_sade_sati_details
from astro_app.backend.astrology.varga_service import get_all_shodashvargas
from astro_app.backend.astrology.ashtakvarga import calculate_ashtakvarga
from astro_app.backend.astrology.shadbala import calculate_shadbala
from astro_app.backend.astrology.basics import get_basic_details
from astro_app.backend.astrology.shadow_planets import get_shadow_planets as calculate_shadow_planets_logic
from astro_app.backend.astrology.muhurata import get_muhurata_data
from astro_app.backend.astrology.utils import get_nakshatra_pada, parse_timezone, get_julian_day
from astro_app.backend.astrology.synthesis import get_combined_analysis
from astro_app.backend.astrology.period_analysis.life_predictor import LifePredictorEngine
from astro_app.backend.astrology.panchang import calculate_panchang
from astro_app.backend.astrology.dosha import DoshaEngine
from astro_app.backend.astrology.aspects import AspectEngine
from astro_app.backend.astrology.avkahada import AvkahadaEngine
import swisseph as swe
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/aspects")
async def get_aspects(details: BirthDetails, current_user: User = Depends(get_current_user)):
    """
    Calculate Planetary Aspects (Western & Vedic).
    """
    verify_user_access(current_user, Feature.BASIC_CHART)
    chart = calculate_chart(details.date, details.time, details.timezone, details.latitude, details.longitude)
    
    western = AspectEngine.calculate_western_aspects(chart["planets"])
    vedic = AspectEngine.calculate_vedic_aspects(chart["planets"], chart["houses"])
    
    return {
        "western_aspects": western,
        "vedic_aspects": vedic
    }

@router.post("/avkahada")
async def get_avkahada(details: BirthDetails, current_user: User = Depends(get_current_user)):
    """
    Calculate Avkahada Chakra details.
    """
    verify_user_access(current_user, Feature.BASIC_CHART)
    chart = calculate_chart(details.date, details.time, details.timezone, details.latitude, details.longitude)
    
    # Find Moon
    moon = next((p for p in chart["planets"] if p["name"] == "Moon"), None)
    if not moon:
        raise HTTPException(status_code=500, detail="Moon position could not be calculated")
        
    # Get Nakshatra Pada (Charan) - Usually 1-4 based on degree in Nakshatra
    # Degree in Nakshatra (0-13.33)
    # 0-3.33 = 1, 3.33-6.66 = 2, 6.66-10 = 3, 10-13.33 = 4
    nak_deg = moon["longitude"] % (360/27)
    pada = int(nak_deg / (360/27/4)) + 1
    
    avkahada = AvkahadaEngine.calculate_avkahada(moon["zodiac_sign"], moon["nakshatra"], pada)
    
    return avkahada

@router.post("/dosha")
async def check_doshas(details: BirthDetails, current_user: User = Depends(get_current_user)):
    """
    Check for Doshas (Manglik, Kaal Sarp, Pitra).
    """
    verify_user_access(current_user, Feature.BASIC_CHART)
    
    # Calculate Chart (use defaults)
    chart = calculate_chart(
        details.date, details.time, details.timezone,
        details.latitude, details.longitude
    )
    
    planets = chart["planets"]
    ascendant = chart["ascendant"]
    
    manglik = DoshaEngine.check_manglik_dosha(planets, ascendant)
    kaal_sarp = DoshaEngine.check_kaal_sarp_dosha(planets)
    pitra = DoshaEngine.check_pitra_dosha(planets)
    
    return {
        "manglik": manglik,
        "kaal_sarp": kaal_sarp,
        "pitra": pitra
    }

@router.post("/birth")
async def get_birth_chart(details: BirthDetails, current_user: User = Depends(get_current_user)):
    """
    Calculates the Birth Chart (Rasi D1). Requires Basic Chart access.
    """
    verify_user_access(current_user, Feature.BASIC_CHART)
    try:
        # Extract Settings
        settings = details.settings or {}
        ayanamsa_str = settings.get("ayanamsa", "LAHIRI").upper()
        house_system_str = settings.get("house_system", "P")
        
        # Map Ayanamsa
        ayanamsa_map = {
            "LAHIRI": swe.SIDM_LAHIRI,
            "RAMAN": swe.SIDM_RAMAN,
            "KP": swe.SIDM_KRISHNAMURTI,
            "FAGAN_BRADLEY": swe.SIDM_FAGAN_BRADLEY,
            "TROPICAL": swe.SIDM_LAHIRI # Fallback for now as Tropical requires deeper flag changes
        }
        ayanamsa_mode = ayanamsa_map.get(ayanamsa_str, swe.SIDM_LAHIRI)
        
        # Map House System
        house_map = {
            "PLACIDUS": "P",
            "WHOLE_SIGN": "W",
            "EQUAL": "A",
            "PORPHYRY": "O",
            "KOCH": "K",
            "REGIOMONTANUS": "R",
            "CAMPANUS": "C"
        }
        house_system = house_map.get(house_system_str.upper(), "P") if len(house_system_str) > 1 else house_system_str

        result = calculate_chart(
            details.date,
            details.time,
            details.timezone,
            details.latitude,
            details.longitude,
            ayanamsa_mode=ayanamsa_mode,
            house_system=house_system
        )
        
        # Calculate Avasthas for 7 main planets
        from astro_app.backend.astrology.avasthas import calculate_all_avasthas
        for p in result["planets"]:
            if p["name"] not in ["Rahu", "Ketu", "Ascendant", "Uranus", "Neptune", "Pluto"]:
                p["avasthas"] = calculate_all_avasthas(p["name"], p["longitude"])
                
        # Calculate Special Points
        from astro_app.backend.astrology.utils import calculate_special_points
        
        # Extract needed longitudes
        asc_lon = result["ascendant"]["longitude"]
        sun_lon = next((p["longitude"] for p in result["planets"] if p["name"] == "Sun"), 0)
        moon_lon = next((p["longitude"] for p in result["planets"] if p["name"] == "Moon"), 0)
        rahu_lon = next((p["longitude"] for p in result["planets"] if p["name"] == "Rahu"), 0)
        
        # Determine day/night birth involves calculating sunrise/sunset which calculate_chart might not strictly return
        # But we can infer or default. Ideally integrate `sunrise` in chart result.
        # Check if Sun is in houses 7-12 (Day) or 1-6 (Night) approx relative to Asc.
        # Or just use simple 6am-6pm logic if time available? No, house position is better.
        # House = int((Sun - Asc) / 30). If 7,8,9,10,11,12 -> Day?
        # Actually: Houses 7 to 12 are above horizon (Day), 1 to 6 below (Night).
        # Relative Longitude:
        diff_sun_asc = (sun_lon - asc_lon) % 360
        is_day = 180 < diff_sun_asc < 360 
        
        result["special_points"] = calculate_special_points(asc_lon, sun_lon, moon_lon, rahu_lon, is_day)

        # Note: Jaimini details are now calculated within calculate_chart, so we don't need to re-calculate here.
        # If specific overrides are needed, do them here.

        # Add Enhanced Natal Metadata
        try:
            from astro_app.backend.astrology.utils import (
                get_julian_day as gjd, NAKSHATRA_LORDS, ZODIAC_LORDS as ZL
            )
            jd_ut = gjd(details.date, details.time, details.timezone)
            ayan_val = swe.get_ayanamsa_ut(jd_ut)
            
            natal_panchang = await calculate_panchang(
                details.date,
                details.time,
                details.timezone,
                details.latitude,
                details.longitude
            )
            
            # Find Moon details for lords
            moon_data = next((p for p in result["planets"] if p["name"] == "Moon"), None)
            moon_nak_lord = "-"
            moon_rasi_lord = "-"
            if moon_data:
                moon_nak_lord = moon_data.get("nakshatra_lord", "-")
                moon_rasi_lord = ZL.get(moon_data.get("sign"), "-")

            # Ascendant / Lagna Lord
            asc_lord = ZL.get(result["ascendant"]["sign"], "-")

            # Reformat to match the structure expected by QuickReferenceData (panchang.tithi.name etc)
            formatted_panchang = {
                "tithi": {"name": natal_panchang.get("tithi", "-")},
                "nakshatra": {
                    "name": natal_panchang.get("nakshatra", "-"),
                    "lord": moon_nak_lord
                },
                "yoga": {"name": natal_panchang.get("yoga", "-")},
                "karana": {"name": natal_panchang.get("karana", "-")},
                "vara": {"name": natal_panchang.get("day_of_week", "-")},
                "calendar_day": datetime.strptime(details.date, "%d/%m/%Y").strftime("%A"),
                "sunrise": natal_panchang.get("sunrise", "--:--"),
                "sunset": natal_panchang.get("sunset", "--:--"),
                "julian_day": round(jd_ut, 2),
                "ayanamsa": "Lahiri",
                "ayanamsa_deg": round(ayan_val, 2),
                "rasi": moon_data.get("sign") if moon_data else "-",
                "rasi_lord": moon_rasi_lord,
                "asc_lord": asc_lord,
                "place": getattr(details, "location", "Unknown Location")
            }
            
            # Calculate Balance Dasa
            if moon_data:
                try:
                    from astro_app.backend.astrology.dasha import DASHA_YEARS
                    moon_lon = moon_data["longitude"]
                    nak_span = 360/27
                    fraction_passed = (moon_lon % nak_span) / nak_span
                    nak_idx = int(moon_lon / nak_span)
                    dasha_lord = NAKSHATRA_LORDS[nak_idx]
                    total_years = DASHA_YEARS.get(dasha_lord, 0)
                    rem_years = total_years * (1.0 - fraction_passed)
                    y = int(rem_years)
                    m = int((rem_years - y) * 12)
                    d = int(((rem_years - y) * 12 - m) * 30)
                    formatted_panchang["balance_dasha"] = f"{y}y, {m}m, {d}d"
                except:
                    formatted_panchang["balance_dasha"] = "-"

            result["panchang"] = formatted_panchang
            result["natal_panchang_raw"] = natal_panchang
        except Exception as pe:
            logger.error(f"Error calculating natal details: {pe}", exc_info=True)
            result["panchang"] = None

        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error calculating birth chart: {e}", exc_info=True)
        # Return actual error for debugging
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# --- NEW ENDPOINTS ---

@router.post("/dasha/mudda")
async def get_mudda_dasha(request: SolarReturnRequest, current_user: User = Depends(get_current_user)):
    """
    Calculates Mudda Dasha for Annual Chart (Varshphal).
    """
    verify_user_access(current_user, Feature.SOLAR_RETURN)
    try:
        from astro_app.backend.astrology.annual_dasha import calculate_mudda_dasha
        from astro_app.backend.astrology.solar_return import calculate_solar_return
        
        # 1. Calculate Solar Return Chart to get Moon Longitude
        natal_details = request.birth_details.model_dump()
        sr_chart = calculate_solar_return(natal_details, request.target_year)
        
        # Find Moon
        moon_lon = 0.0
        for p in sr_chart["planets"]:
            if p["name"] == "Moon":
                moon_lon = p["longitude"]
                break
                
        # 2. Calculate Dasha
        # Start date is the Solar Return Date
        sr_date_str = sr_chart["solar_return_date"] # "YYYY-MM-DD HH:MM"
        # We need just YYYY-MM-DD
        start_date = sr_date_str.split(" ")[0]
        
        dasha_list = calculate_mudda_dasha(moon_lon, start_date)
        
        return {
            "year": request.target_year,
            "mudda_dasha": dasha_list
        }
    except Exception as e:
        logger.error(f"Error calculating Mudda Dasha: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tools/nakshatra-pravesha")
async def get_nakshatra_pravesha(request: IngressRequest, current_user: User = Depends(get_current_user)):
    """
    Calculates Nakshatra Entry (Pravesha) for a planet.
    """
    verify_user_access(current_user, Feature.BASIC_CHART)
    try:
        from astro_app.backend.astrology.nakshatra_engine import calculate_nakshatra_pravesha
        from astro_app.backend.astrology.utils import get_julian_day
        
        # Calculate current JD
        # current_date is YYYY-MM-DD? IngressRequest usually has it.
        # Let's assume request.current_date is "YYYY-MM-DD"
        # Time default to 00:00
        jd = get_julian_day(
            datetime.strptime(request.current_date, "%Y-%m-%d").strftime("%d/%m/%Y"),
            "00:00",
            request.timezone
        )
        
        entries = calculate_nakshatra_pravesha(request.planet, jd, request.window_days)
        return {"entries": entries}
    except Exception as e:
        logger.error(f"Error calculating Nakshatra Pravesha: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tools/super-impose")
async def get_super_impose_chart(request: DivisionalRequest, current_user: User = Depends(get_current_user)):
    """
    Calculates Super Impose Chart (Rasi Tulya Amsha).
    Usually D9 on D1.
    """
    verify_user_access(current_user, Feature.DIVISIONAL_CHARTS)
    try:
        from astro_app.backend.astrology.divisional import calculate_divisional_charts, calculate_rasi_tulya_amsa
        
        # 1. Calculate D1
        d1_result = calculate_chart(
            request.birth_details.date,
            request.birth_details.time,
            request.birth_details.timezone,
            request.birth_details.latitude,
            request.birth_details.longitude
        )
        
        d1_planets = [{"name": p["name"], "longitude": p["longitude"], "zodiac_sign": p["sign"]} for p in d1_result["planets"]]
        # Add Asc
        d1_planets.append({
            "name": "Ascendant", 
            "longitude": d1_result["ascendant"]["longitude"],
            "zodiac_sign": d1_result["ascendant"]["sign"] # chart result has 'sign'
        })
        
        # 2. Calculate D-N (e.g. D9)
        # We need to use get_all_shodashvargas or specific calc
        # Let's use the service function to get D9
        planets_input = [{"name": p["name"], "longitude": p["longitude"]} for p in d1_result["planets"]]
        # Ascendant needs to be in input for varga calc usually?
        planets_input.append({"name": "Ascendant", "longitude": d1_result["ascendant"]["longitude"]})
        
        vargas = await calculate_divisional_charts(planets_input)
        d9_data = vargas.get("D9", [])
        
        # 3. Super Impose
        superimposed = calculate_rasi_tulya_amsa(d1_planets, d9_data, "D9")
        
        return {
            "d1_ascendant": d1_result["ascendant"],
            "superimposed_planets": superimposed
        }
    except Exception as e:
        logger.error(f"Error calculating Super Impose: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/panchang")
async def get_daily_panchang(details: BirthDetails, current_user: User = Depends(get_current_user)):
    """
    Calculates detailed Panchang for a specific date and time (used for Daily Quick Reference).
    """
    verify_user_access(current_user, Feature.BASIC_CHART)
    try:
        from astro_app.backend.astrology.utils import (
            get_julian_day as gjd, NAKSHATRA_LORDS, ZODIAC_LORDS as ZL
        )
        
        # 1. Calculate Raw Panchang Data (Tithi, Yoga, Karana, Nakshatra)
        # using the provided date/time (which is "now" from frontend)
        panchang_data = await calculate_panchang(
            details.date,
            details.time,
            details.timezone,
            details.latitude,
            details.longitude
        )

        # 2. Calculate Chart to get Moon & Ascendant details for Lords
        # We need planetary positions to know Rasi & Nakshatra Lords
        chart_result = calculate_chart(
            details.date,
            details.time,
            details.timezone,
            details.latitude,
            details.longitude
        )

        # Find Moon details
        moon_data = next((p for p in chart_result["planets"] if p["name"] == "Moon"), None)
        moon_nak_lord = "-"
        moon_rasi_lord = "-"
        if moon_data:
            moon_nak_lord = moon_data.get("nakshatra_lord", "-")
            moon_rasi_lord = ZL.get(moon_data.get("sign"), "-")

        # Ascendant details
        asc_lord = ZL.get(chart_result["ascendant"]["sign"], "-")

        # 3. Calculate Extra Metadata (Julian Day, Ayanamsa)
        jd_ut = gjd(details.date, details.time, details.timezone)
        ayan_val = swe.get_ayanamsa_ut(jd_ut)

        # 4. Format for Frontend (QuickReferenceData.tsx expects specific nesting)
        formatted_response = {
            "tithi": {"name": panchang_data.get("tithi", "-")},
            "nakshatra": {
                "name": panchang_data.get("nakshatra", "-"),
                "lord": moon_nak_lord
            },
            "yoga": {"name": panchang_data.get("yoga", "-")},
            "karana": {"name": panchang_data.get("karana", "-")},
            "vara": {"name": panchang_data.get("day_of_week", "-")},
            "calendar_day": datetime.strptime(details.date, "%d/%m/%Y").strftime("%A"),
            "sunrise": panchang_data.get("sunrise", "--:--"),
            "sunset": panchang_data.get("sunset", "--:--"),
            "julian_day": round(jd_ut, 2),
            "ayanamsa": "Lahiri",
            "ayanamsa_deg": round(ayan_val, 2),
            "rasi": moon_data.get("sign") if moon_data else "-",
            "rasi_lord": moon_rasi_lord,
            "asc_lord": asc_lord,
            "place": getattr(details, "location", "Unknown Location")
        }

        # 5. Calculate Balance Dasha (Theoretical, based on Moon position at this time)
        if moon_data:
            try:
                from astro_app.backend.astrology.dasha import DASHA_YEARS
                moon_lon = moon_data["longitude"]
                nak_span = 360/27
                fraction_passed = (moon_lon % nak_span) / nak_span
                nak_idx = int(moon_lon / nak_span)
                dasha_lord = NAKSHATRA_LORDS[nak_idx % 27] # Ensure valid index
                total_years = DASHA_YEARS.get(dasha_lord, 0)
                rem_years = total_years * (1.0 - fraction_passed)
                
                y = int(rem_years)
                m = int((rem_years - y) * 12)
                d = int(((rem_years - y) * 12 - m) * 30)
                formatted_response["balance_dasha"] = f"{y}y, {m}m, {d}d"
            except Exception as de:
                logger.warning(f"Failed to calculate balance dasha: {de}")
                formatted_response["balance_dasha"] = "-"
        
        return formatted_response

    except Exception as e:
        logger.error(f"Error calculating daily panchang: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/solar-return")
async def get_solar_return(request: SolarReturnRequest, current_user: User = Depends(get_current_user)):
    """
    Calculates Solar Return (Varshaphal) Chart. Requires Premium Access.
    """
    verify_user_access(current_user, Feature.SOLAR_RETURN)
    try:
        # Prepare natal details
        natal_details = request.birth_details.model_dump()
        
        # Calculate Solar Return
        result = calculate_solar_return(natal_details, request.target_year)
        return result
    except Exception as e:
        logger.error(f"Error calculating solar return: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/dasha")
async def get_dasha_details(request: DashaRequest, current_user: User = Depends(get_current_user)):
    """
    Calculates Vimshottari Mahadasha. Requires Mahadasha access.
    """
    verify_user_access(current_user, Feature.MAHADASHA)
    try:
        result = await calculate_vimshottari_dasha(
            request.birth_details.date,
            request.birth_details.time,
            request.birth_details.timezone,
            request.birth_details.latitude,
            request.birth_details.longitude,
            moon_longitude=request.moon_longitude,
            ayanamsa=request.ayanamsa or "LAHIRI"
        )
        return result
    except Exception as e:
        logger.error(f"Error calculating dasha: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/divisional")
async def get_divisional_charts(request: DivisionalRequest, current_user: User = Depends(get_current_user)):
    """
    Calculates Divisional Charts (D9, D16). Requires Premium Access.
    """
    verify_user_access(current_user, Feature.DIVISIONAL_CHARTS)
    try:
        # Convert Pydantic list to list of dicts for the service
        planets_data = [{"name": p.name, "longitude": p.longitude} for p in request.planets]
        birth_dict = request.birth_details.model_dump() if request.birth_details else None
        result = await calculate_divisional_charts(planets_data, birth_dict)
        return result
    except Exception as e:
        logger.error(f"Error calculating divisional charts: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/period-analysis")
async def get_period_analysis(
    request: PeriodRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Get comprehensive period analysis for a month
    Uses new VedAstro-based orchestrator with event detection and scoring
    """
    verify_user_access(current_user, Feature.BASIC_CHART)
    try:
        # Import new orchestrator
        from astro_app.backend.astrology.period_analysis.orchestrator import (
            PeriodAnalysisOrchestrator
        )
        
        # Create orchestrator
        orchestrator = PeriodAnalysisOrchestrator(
            birth_details=request.birth_details.model_dump(), # Use model_dump() for Pydantic v2
            moon_longitude=request.moon_longitude or 0.0
        )
        
        # Analyze month
        analysis_result = orchestrator.analyze_month(
            year=request.year,
            month=request.month
        )
        
        return analysis_result
        
    except ValueError as e:
        logger.error(f"Validation error in period analysis: {e}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Error in period analysis: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/period/overview")
async def get_period_overview(
    request: AnalysisRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Get Period Analysis Dashboard Overview (Vimsopaka, Shadbala, Dasha, Today's details).
    """
    verify_user_access(current_user, Feature.BASIC_CHART)
    try:
        # 1. Calculate Moon Longitude (since AnalysisRequest doesn't have it)
        # We can use calculate_chart to get it
        chart_result = calculate_chart(
            request.birth_details.date,
            request.birth_details.time,
            request.birth_details.timezone,
            request.birth_details.latitude,
            request.birth_details.longitude
        )
        # Extract Moon Longitude
        moon_lon = 0.0
        for p in chart_result["planets"]:
            if p["name"] == "Moon":
                moon_lon = p["longitude"]
                break
        
        # 2. Initialize Orchestrator
        from astro_app.backend.astrology.period_analysis.orchestrator import PeriodAnalysisOrchestrator
        
        orchestrator = PeriodAnalysisOrchestrator(
            birth_details=request.birth_details.model_dump(),
            moon_longitude=moon_lon
        )
        
        # 3. Get Overview
        result = await orchestrator.get_dashboard_overview(
            target_date_str=request.analysis_date
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Error in period dashboard overview: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/period/month")
async def get_period_month(
    request: PeriodRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Get Period Analysis for a full month (Day-by-day scores).
    """
    verify_user_access(current_user, Feature.BASIC_CHART)
    try:
        # 1. Determine Moon Longitude if missing
        moon_lon = request.moon_longitude
        if moon_lon is None:
            chart_result = calculate_chart(
                request.birth_details.date,
                request.birth_details.time,
                request.birth_details.timezone,
                request.birth_details.latitude,
                request.birth_details.longitude
            )
            for p in chart_result["planets"]:
                if p["name"] == "Moon":
                    moon_lon = p["longitude"]
                    break
        
        # 2. Initialize Orchestrator
        from astro_app.backend.astrology.period_analysis.orchestrator import PeriodAnalysisOrchestrator
        
        orchestrator = PeriodAnalysisOrchestrator(
            birth_details=request.birth_details.model_dump(),
            moon_longitude=moon_lon or 0.0
        )
        
        # 3. Analyze Month
        result = orchestrator.analyze_month(
            month=request.month,
            year=request.year,
            use_parallel=False # Use sync for simplicity/safety
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Error in period month analysis: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/period/life-timeline")
async def get_life_timeline(
    request: LifeTimelineRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Get multi-year life timeline with VedAstro predictions.
    Returns planetary influences, dasha periods, and major events.
    """
    verify_user_access(current_user, Feature.BASIC_CHART)
    try:
        from astro_app.backend.services.vedastro_predictor import VedAstroPredictorClient
        from astro_app.backend.astrology.period_analysis.life_predictor import LifePredictorEngine
        from astro_app.backend.astrology.chart import calculate_chart
        
        # 1. Get Moon longitude and Ascendant
        chart_result = calculate_chart(
            request.birth_details.date,
            request.birth_details.time,
            request.birth_details.timezone,
            request.birth_details.latitude,
            request.birth_details.longitude
        )
        
        moon_lon = 0.0
        for p in chart_result["planets"]:
            if p["name"] == "Moon":
                moon_lon = p["longitude"]
                break
        
        ascendant_sign = int(chart_result["ascendant"]["longitude"] / 30)
        
        # 2. Get VedAstro Dasha Timeline
        start_date = f"01/01/{request.start_year}"
        end_date = f"31/12/{request.end_year}"
        
        vedastro_timeline = VedAstroPredictorClient.get_dasha_timeline(
            request.birth_details.model_dump(),
            start_date,
            end_date
        )
        
        # 3. Generate Life Predictor Timeline (fallback/enhancement)
        predictor = LifePredictorEngine(
            request.birth_details.model_dump(),
            moon_lon,
            ascendant_sign
        )
        
        life_timeline = await predictor.generate_life_timeline(
            request.start_year,
            request.end_year
        )
        
        # 4. Merge VedAstro and internal predictions
        return {
            "vedastro_timeline": vedastro_timeline,
            "life_timeline": life_timeline["timeline"],
            "major_events": life_timeline["events"],
            "narrative": life_timeline["narrative"],
            "start_year": request.start_year,
            "end_year": request.end_year
        }
        
    except Exception as e:
        logger.error(f"Error generating life timeline: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/period/predictions")
async def get_life_predictions(
    request: PredictionRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Get VedAstro life predictions for specific categories.
    Returns probability scores and timing for major life events.
    """
    verify_user_access(current_user, Feature.BASIC_CHART)
    try:
        from astro_app.backend.services.vedastro_predictor import VedAstroPredictorClient
        
        # Get predictions from VedAstro
        predictions = VedAstroPredictorClient.get_life_predictions(
            request.birth_details.model_dump(),
            request.categories
        )
        
        return {
            "predictions": predictions,
            "birth_details": {
                "date": request.birth_details.date,
                "time": request.birth_details.time,
                "location": f"{request.birth_details.latitude}, {request.birth_details.longitude}"
            }
        }
        
    except Exception as e:
        logger.error(f"Error fetching life predictions: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/shodashvarga")
async def get_shodashvargas(request: ShodashvargaRequest, current_user: User = Depends(get_current_user)):
    """
    Calculates all 16 Divisional Charts (Shodashvarga). Requires Premium Access.
    """
    verify_user_access(current_user, Feature.DIVISIONAL_CHARTS)
    try:
        # 1. Calculate Birth Chart (D1) first
        d1_result = calculate_chart(
            request.birth_details.date,
            request.birth_details.time,
            request.birth_details.timezone,
            request.birth_details.latitude,
            request.birth_details.longitude
        )
        
        # 2. Extract planets with longitudes
        planets_d1 = [{"name": p["name"], "longitude": p["longitude"]} for p in d1_result["planets"]]
        # Add Ascendant as a planet for varga calculation
        planets_d1.append({"name": "Ascendant", "longitude": d1_result["ascendant"]["longitude"]})
        
        # 3. Calculate all vargas
        result = await get_all_shodashvargas(planets_d1, request.birth_details.model_dump())
        
        # 4. Include D1 data for convenience
        return {
            "vargas": result,
            "d1_data": d1_result
        }
    except Exception as e:
        logger.error(f"Error calculating shodashvargas: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/ashtakvarga")
async def get_ashtakvarga_strength(request: AshtakvargaRequest, current_user: User = Depends(get_current_user)):
    """
    Calculates Ashtakvarga Strength (BAV & SAV).
    """
    verify_user_access(current_user, Feature.DIVISIONAL_CHARTS) # Using same feature flag for now
    try:
        # 1. Calculate Birth Chart (D1)
        d1_result = calculate_chart(
            request.birth_details.date,
            request.birth_details.time,
            request.birth_details.timezone,
            request.birth_details.latitude,
            request.birth_details.longitude
        )
        
        # 2. Extract planets and ascendant
        planets_d1 = [{"name": p["name"], "longitude": p["longitude"]} for p in d1_result["planets"]]
        ascendant_sign_idx = int(d1_result["ascendant"]["longitude"] / 30)
        
        # 3. Calculate Ashtakvarga
        ashtakvarga_data = calculate_ashtakvarga(planets_d1, ascendant_sign_idx)
        
        return ashtakvarga_data
    except Exception as e:
        logger.error(f"Error calculating ashtakvarga: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/shadbala")
async def get_shadbala_energy(request: ShadbalaRequest, current_user: User = Depends(get_current_user)):
    """
    Calculates Shadbala Strength (6 Sources of Energy).
    """
    verify_user_access(current_user, Feature.DIVISIONAL_CHARTS)
    try:
        # Extract Settings
        settings = request.birth_details.settings or {}
        ayanamsa_str = settings.get("ayanamsa", "LAHIRI").upper()
        house_system_str = settings.get("house_system", "P")
        
        # Map Ayanamsa
        ayanamsa_map = {
            "LAHIRI": swe.SIDM_LAHIRI,
            "RAMAN": swe.SIDM_RAMAN,
            "KP": swe.SIDM_KRISHNAMURTI,
            "FAGAN_BRADLEY": swe.SIDM_FAGAN_BRADLEY,
            "TROPICAL": swe.SIDM_LAHIRI # Fallback
        }
        ayanamsa_mode = ayanamsa_map.get(ayanamsa_str, swe.SIDM_LAHIRI)
        
        # Map House System
        house_map = {
            "PLACIDUS": "P",
            "WHOLE_SIGN": "W",
            "EQUAL": "A",
            "PORPHYRY": "O",
            "KOCH": "K",
            "REGIOMONTANUS": "R",
            "CAMPANUS": "C"
        }
        house_system = house_map.get(house_system_str.upper(), "P") if len(house_system_str) > 1 else house_system_str

        # 1. Calculate Birth Chart (D1)
        d1_result = calculate_chart(
            request.birth_details.date,
            request.birth_details.time,
            request.birth_details.timezone,
            request.birth_details.latitude,
            request.birth_details.longitude,
            ayanamsa_mode=ayanamsa_mode,
            house_system=house_system
        )
        
        # 2. Extract planets and ascendant
        planets_d1 = [{"name": p["name"], "longitude": p["longitude"], "speed": p.get("speed", 0)} for p in d1_result["planets"]]
        ascendant_sign_idx = int(d1_result["ascendant"]["longitude"] / 30)
        
        # 3. Calculate Shadbala
        # Ensure birth_details is a dict
        birth_details_dict = request.birth_details.model_dump()
        shadbala_data = await calculate_shadbala(planets_d1, ascendant_sign_idx, birth_details_dict)
        
        # 4. Calculate Bhava Bala (House Strength)
        from astro_app.backend.astrology.strength import calculate_bhava_bala
        bhava_data = calculate_bhava_bala(d1_result, shadbala_data)
        
        return {
            "shadbala": shadbala_data,
            "bhava_bala": bhava_data
        }
    except Exception as e:
        logger.error(f"Error calculating shadbala: {e}", exc_info=True)
        # Return actual error details for debugging
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.post("/nakshatra")
async def get_nakshatra_analysis(details: BirthDetails, current_user: User = Depends(get_current_user)):
    """
    Calculates detailed Nakshatra Analysis including Deities, Symbols, Attributes, and Tara Bala.
    """
    verify_user_access(current_user, Feature.BASIC_CHART)
    try:
        from astro_app.backend.astrology.nakshatra_engine import (
            get_nakshatra_info, get_navatara_chakra, get_detailed_analysis, 
            calculate_tara_bala, calculate_unequal_nakshatra, calculate_latta
        )
        from astro_app.backend.astrology.utils import get_nakshatra_details
        
        # 1. Calculate Birth Chart (D1) to find Moon
        d1_result = calculate_chart(
            details.date,
            details.time,
            details.timezone,
            details.latitude,
            details.longitude
        )
        
        # 2. Find Moon
        moon_data = next((p for p in d1_result["planets"] if p["name"] == "Moon"), None)
        if not moon_data:
            raise ValueError("Moon position not found in chart")
            
        birth_nakshatra = moon_data["nakshatra"]
        # Need pada - usually chart result has it or we re-calc
        # If chart result has 'nakshatra_pada' or we use longitude
        birth_pada = get_nakshatra_pada(moon_data["longitude"])
        
        # 3. Get Detailed Analysis
        analysis = get_detailed_analysis(birth_nakshatra, birth_pada)
        
        # 4. Get Navatara Chakra
        navatara = get_navatara_chakra(birth_nakshatra)
        
        # 5. Calculate Current Transit Tara (Today's Moon)
        # Calculate current chart for NOW
        now = datetime.now()
        current_chart = calculate_chart(
            now.strftime("%d/%m/%Y"),
            now.strftime("%H:%M"),
            details.timezone, # Use user's timezone
            details.latitude,
            details.longitude
        )
        current_moon = next((p for p in current_chart["planets"] if p["name"] == "Moon"), None)
        current_tara = {}
        if current_moon:
            current_nak = current_moon["nakshatra"]
            current_tara = calculate_tara_bala(birth_nakshatra, current_nak)
            current_tara["current_nakshatra"] = current_nak
            
        # 6. Unequal Nakshatra (Abhijit)
        unequal_info = calculate_unequal_nakshatra(moon_data["longitude"])
        
        # 7. Latta (Kick) - Use current transit planets vs birth star?
        # Usually Latta is checked for specific time (Transit).
        # Here we return the Latta of CURRENT transit planets on the Birth Star?
        # Or Latta of Natal Planets?
        # Usually used in Muhurta/Transit.
        # Let's return Latta of Current Transit Planets hitting the Birth Star or any natal point.
        # But `calculate_latta` returns kicks FROM planets TO stars.
        # So we pass current transit planets.
        
        transit_kicks = calculate_latta(current_chart["planets"])
        # Filter kicks that hit the user's birth star (Janma Nakshatra)
        my_kicks = [k for k in transit_kicks if k["kicked_nakshatra"] == birth_nakshatra]
            
        return {
            "birth_star": birth_nakshatra,
            "birth_pada": birth_pada,
            "analysis": analysis,
            "navatara": navatara,
            "current_transit": current_tara,
            "unequal_nakshatra": unequal_info,
            "latta_kicks": my_kicks
        }
        
    except Exception as e:
        logger.error(f"Error calculating nakshatra analysis: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.post("/yogas")
async def get_yoga_analysis(details: BirthDetails, current_user: User = Depends(get_current_user)):
    """
    Analyzes chart for major Yogas (Raja, Dhana, Gajakesari, Mahapurusha).
    """
    verify_user_access(current_user, Feature.BASIC_CHART)
    try:
        from astro_app.backend.astrology.yoga_engine import calculate_yogas
        
        # 1. Calculate Chart
        d1_result = calculate_chart(
            details.date,
            details.time,
            details.timezone,
            details.latitude,
            details.longitude
        )
        
        # 2. Extract Data
        planets_list = d1_result["planets"]
        asc_data = d1_result["ascendant"]
        
        # 3. Calculate Yogas
        yogas = calculate_yogas(planets_list, asc_data)
        
        return yogas
        
    except Exception as e:
        logger.error(f"Error calculating yogas: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.post("/muhurata")
async def get_muhurata(request: ShadbalaRequest, current_user: User = Depends(get_current_user)):
    """
    Calculates Muhurata (Choghadiya, Hora, etc.).
    """
    verify_user_access(current_user, Feature.BASIC_CHART)
    try:
        jd = get_julian_day(
            request.birth_details.date,
            request.birth_details.time,
            request.birth_details.timezone
        )
        # Use robust parse_timezone
        # tz_offset = parse_timezone(request.birth_details.timezone)
        
        result = get_muhurata_data(
            jd, 
            request.birth_details.latitude, 
            request.birth_details.longitude
        )
        return {"data": result}
    except Exception as e:
        logger.error(f"Error calculating muhurata: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/shadow-planets")
async def get_shadow_planets(request: ShadowPlanetsRequest, current_user: User = Depends(get_current_user)):
    """
    Calculates the 11 Shadow Planets (Aprakasha and Upagrahas).
    Requires Divisional Charts access.
    """
    verify_user_access(current_user, Feature.DIVISIONAL_CHARTS)
    try:
        # We need Sun Longitude. Let's calculate chart.
        chart = calculate_chart(
             request.birth_details.date,
             request.birth_details.time,
             request.birth_details.timezone,
             request.birth_details.latitude,
             request.birth_details.longitude
        )
        sun_lon = next((p["longitude"] for p in chart["planets"] if p["name"] == "Sun"), 0.0)
        
        shadow_planets = calculate_shadow_planets_logic(
             {
                "date": request.birth_details.date,
                "time": request.birth_details.time,
                "timezone": request.birth_details.timezone,
                "latitude": request.birth_details.latitude,
                "longitude": request.birth_details.longitude
            },
            sun_lon
        )
        
        return shadow_planets
    except Exception as e:
        logger.error(f"Error calculating shadow planets: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/basics")
async def get_basic_details_route(details: BirthDetails, current_user: User = Depends(get_current_user)):
    """
    Calculates Basic Details (Person, Avkahada, Favourable, Ghatak).
    Requires Basic Chart access.
    """
    verify_user_access(current_user, Feature.BASIC_CHART)
    try:
        # Convert Pydantic model to dict
        result = get_basic_details(details.model_dump())
        return result
    except Exception as e:
        logger.error(f"Error calculating basic details: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/transits")
async def get_transits(request: TransitRequest, current_user: User = Depends(get_current_user)):
    """
    Calculates the current planetary transits for a given time and location.
    Includes Nakshatra Padas and Retrograde status.
    """
    try:
        # We can reuse calculate_chart as it already handles Lahiri sidereal calculations
        result = calculate_chart(
            request.date,
            request.time,
            request.timezone,
            request.latitude,
            request.longitude
        )
        
        # Add Pada information to planets
        for p in result["planets"]:
            p["pada"] = get_nakshatra_pada(p["longitude"])
            
        result["location_details"] = {
            "name": request.location_name,
            "latitude": request.latitude,
            "longitude": request.longitude
        }
        
        return result
    except Exception as e:
        logger.error(f"Error calculating transits: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/transits/advanced")
async def get_advanced_transits(request: AdvancedTransitRequest, current_user: User = Depends(get_current_user)):
    """
    Calculates detailed transit analysis (Kakshya, Vedha, Moorthi Nirnaya).
    """
    verify_user_access(current_user, Feature.DIVISIONAL_CHARTS)
    try:
        from astro_app.backend.astrology.transits import get_advanced_transit_analysis
        
        # 1. Calculate Natal Chart
        natal_chart = calculate_chart(
            request.birth_details.date,
            request.birth_details.time,
            request.birth_details.timezone,
            request.birth_details.latitude,
            request.birth_details.longitude
        )
        
        # 2. Get Advanced Analysis
        result = get_advanced_transit_analysis(
            natal_chart,
            request.transit_date,
            request.transit_time,
            request.transit_timezone,
            request.transit_latitude,
            request.transit_longitude
        )
        
        return result
    except Exception as e:
        logger.error(f"Error calculating advanced transits: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/comprehensive-analysis")
async def get_comprehensive_analysis(request: AnalysisRequest, current_user: User = Depends(get_current_user)):
    """
    Generates a comprehensive astrological analysis combining Vimshottari Dasha and Transits.
    Requires Detailed Interpretation access.
    """
    verify_user_access(current_user, Feature.DETAILED_INTERPRETATION)
    try:
        result = await get_combined_analysis(
            request.birth_details.model_dump(),
            request.analysis_date or datetime.now().strftime("%Y-%m-%d"),
            ayanamsa=request.ayanamsa or "LAHIRI"
        )
        return result
    except Exception as e:
        logger.error(f"Error calculating comprehensive analysis: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")



@router.post("/sade-sati")
async def get_sade_sati(details: BirthDetails, current_user: User = Depends(get_current_user)):
    """
    Calculates detailed Sade Sati analysis including phases and timelines.
    Requires Basic Chart access.
    """
    verify_user_access(current_user, Feature.BASIC_CHART)
    try:
        # 1. Calculate Birth Chart to get Moon Sign
        chart_result = calculate_chart(
            details.date,
            details.time,
            details.timezone,
            details.latitude,
            details.longitude
        )
        
        # 2. Find Moon's Longitude and Sign Index
        moon_lon = 0.0
        for p in chart_result["planets"]:
            if p["name"] == "Moon":
                moon_lon = p["longitude"]
                break
        
        moon_sign_index = int(moon_lon / 30)
        
        # 3. Calculate Sade Sati Details
        # Note: calculate_sade_sati_details expects a datetime object for birth_date
        # We need to construct it from the input string
        from datetime import datetime
        try:
            birth_dt = datetime.strptime(f"{details.date} {details.time}", "%d/%m/%Y %H:%M")
        except ValueError:
             # Fallback or try ISO format if needed, but assuming schema validation holds
             # If format differs, we might need robust parsing. 
             # Let's try standard format first.
             birth_dt = datetime.now() # Fallback to avoid crash, but should handle error

        result = calculate_sade_sati_details(birth_dt, moon_sign_index)
        return result
    except Exception as e:
        logger.error(f"Error calculating Sade Sati: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")



@router.post("/muhurata/find")
async def find_muhurata_moments(request: MuhurtaSearchRequest, current_user: User = Depends(get_current_user)):
    """
    Search for auspicious Muhurta moments in a date range.
    """
    verify_user_access(current_user, Feature.BASIC_CHART)
    try:
        from astro_app.backend.astrology.muhurata import find_muhurata
        
        # Default target quality if not provided
        quality = request.target_quality if request.target_quality else ["Excellent", "Good"]
        
        results = find_muhurata(
            request.date, 
            request.end_date, 
            request.latitude, 
            request.longitude,
            activity=request.activity
        )
        return {"results": results}
    except Exception as e:
        logger.error(f"Error searching muhurta: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/transits/ingress")
async def check_transit_ingress(request: IngressRequest, current_user: User = Depends(get_current_user)):
    """
    Check for Nakshatra Ingress (change) for a planet around a date.
    """
    verify_user_access(current_user, Feature.BASIC_CHART) # Check plan level
    try:
        from astro_app.backend.astrology.transits import check_nakshatra_ingress
        
        shifts = check_nakshatra_ingress(
            request.planet,
            request.current_date,
            request.timezone,
            request.window_days
        )
        return {"shifts": shifts if shifts else []}
    except Exception as e:
        logger.error(f"Error checking ingress: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/life-predictor")
async def get_life_predictor(
    request: LifePredictorRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Get Advanced Life Predictor timeline with daily favorability and moments.
    Combines VedAstro long-term predictions with high-granularity local scoring.
    """
    verify_user_access(current_user, Feature.BASIC_CHART)
    try:
        from astro_app.backend.services.vedastro_predictor import VedAstroPredictorClient
        from datetime import datetime, timedelta
        
        # 1. Parse dates and details
        start_date = request.start_date
        if start_date is None:
            start_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
        
        end_date = request.end_date
        if end_date is None:
            end_date = (datetime.now() + timedelta(days=365)).strftime("%Y-%m-%d")
        
        # Prepare birth details for Engine
        birth_dict = {
            "date": request.birth_details.date,
            "time": request.birth_details.time,
            "timezone": request.birth_details.timezone,
            "latitude": request.birth_details.latitude,
            "longitude": request.birth_details.longitude,
            "location": getattr(request.birth_details, "location", "Unknown"),
            "gender": getattr(request.birth_details, "gender", "male")
        }

        # 2. Initialize Local Engine
        # We need natal Moon and Ascendant
        natal_chart = calculate_chart(
            birth_dict["date"], birth_dict["time"], birth_dict["timezone"],
            birth_dict["latitude"], birth_dict["longitude"]
        )
        moon_long = natal_chart["ascendant"]["longitude"] # Defaulting? No, let's find Moon.
        for p in natal_chart["planets"]:
            if p["name"] == "Moon":
                moon_long = p["longitude"]
                break
        asc_sign = int(natal_chart["ascendant"]["longitude"] / 30)
        
        engine = LifePredictorEngine(birth_dict, moon_long, asc_sign)
        
        # 3. Generate Local Predictions
        # Timeline (Monthly)
        start_dt = datetime.strptime(start_date, "%Y-%m-%d")
        end_dt = datetime.strptime(end_date, "%Y-%m-%d")
        local_timeline = await engine.generate_life_timeline(start_dt.year, end_dt.year)
        
        # Advanced Today (Daily Moments)
        today_prediction = await engine.get_advanced_day_prediction(datetime.now())

        # 4. Fetch VedAstro Timeline (Optional/Secondary)
        try:
            vedastro_result = VedAstroPredictorClient.get_life_predictor_timeline(
                birth_dict, start_date, end_date, None
            )
        except:
            vedastro_result = {"status": "error"}

        # 5. Merge and Return
        return {
            "status": "success",
            "timeline": local_timeline["timeline"],
            "events": local_timeline["events"],
            "today_advanced": today_prediction,
            "narrative": local_timeline["narrative"],
            "vedastro_raw": vedastro_result.get("Payload") if vedastro_result.get("status") == "success" else None,
            "metadata": {
                "start_date": start_date,
                "end_date": end_date,
                "natal_asc": natal_chart["ascendant"]["zodiac_sign"],
                "natal_moon_nak": [p["nakshatra"] for p in natal_chart["planets"] if p["name"] == "Moon"][0]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error calculating life predictor: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

