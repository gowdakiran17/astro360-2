import asyncio
from datetime import datetime, timedelta
from astro_app.backend.services.daily_horoscope_engine import DailyHoroscopeEngine
from astro_app.backend.astrology.chart import calculate_chart
from astro_app.backend.horoscope_models import DailyHoroscopeResponse
import logging

# Configure logging to see what's happening
logging.basicConfig(level=logging.INFO)

async def test_horoscope_variability():
    # Mock birth data
    lat, lon = 12.9716, 77.5946 # Bangalore
    birth_date = "15/08/1990"
    birth_time = "10:30"
    tz = "+05:30"
    
    # 1. Calculate Birth Chart
    print("--- Calculating Birth Chart ---")
    birth_chart = calculate_chart(birth_date, birth_time, tz, lat, lon)
    birth_chart["name"] = "Test User"
    
    # 2. Setup Engine
    engine = DailyHoroscopeEngine(ai_provider="Gemini")
    
    # Helper to generate horoscope for a specific date
    def generate_for_date(date_obj, label, period="daily"):
        print(f"\n--- Generating for {label}: {date_obj.strftime('%d/%m/%Y')} (Period: {period}) ---")
        
        # Calculate transits for this date
        # Note: In the actual app, this logic is likely in the router or a service wrapper.
        # We need to simulate how the data changes.
        
        # Calculate transits
        transits_chart = calculate_chart(
            date_obj.strftime("%d/%m/%Y"), 
            date_obj.strftime("%H:%M"), 
            "+00:00", lat, lon # Using UTC for simplicity of transit calc
        )
        current_transits = {p["name"]: p["longitude"] for p in transits_chart["planets"]}
        current_moon = current_transits.get("Moon", 0.0)
        
        # Mock Dasha (should ideally change over long periods, but we'll keep static for day-to-day unless we calc it)
        # For this test, we want to see if TRANSITS (Moon) cause changes.
        dasha_data = {
            "summary": {
                "current_mahadasha": {"lord": "Jupiter"}, 
                "current_antardasha": {"lord": "Saturn"}
            }
        }
        
        try:
            response = engine.generate_daily_horoscopes(
                birth_chart=birth_chart,
                dasha_data=dasha_data,
                current_transits=current_transits,
                current_moon_longitude=current_moon,
                current_time=date_obj,
                latitude=lat,
                longitude=lon,
                period=period
            )
            return response
        except Exception as e:
            print(f"Error generating for {label}: {e}")
            import traceback
            traceback.print_exc()
            return None

    # 3. Generate for Today vs Tomorrow
    today = datetime.now()
    tomorrow = today + timedelta(days=1)
    
    res_today = generate_for_date(today, "TODAY")
    res_tomorrow = generate_for_date(tomorrow, "TOMORROW")
    
    if res_today and res_tomorrow:
        print("\n--- COMPARISON ---")
        print(f"Today Theme: {res_today.overall_theme}")
        print(f"Tmrw Theme:  {res_tomorrow.overall_theme}")
        
        # Compare first card (e.g. Career or Personal)
        card_today = res_today.horoscopes[0]
        card_tomorrow = res_tomorrow.horoscopes[0]
        
        print(f"\n[Life Area: {card_today.life_area}]")
        print(f"Today Content: {card_today.synthesis}")
        print(f"Tmrw Content:  {card_tomorrow.synthesis}")
        
        # Check specific variable fields
        print(f"\nToday Moon Nakshatra: {card_today.nakshatra_context.current_nakshatra}")
        print(f"Tmrw Moon Nakshatra:  {card_tomorrow.nakshatra_context.current_nakshatra}")
        
        if card_today.synthesis != card_tomorrow.synthesis:
            print("\nSUCCESS: Content is different!")
        else:
            print("\nFAILURE: Content is identical.")
            
        if card_today.nakshatra_context.current_nakshatra != card_tomorrow.nakshatra_context.current_nakshatra:
             print("SUCCESS: Moon Nakshatra changed (expected for day-to-day).")
        else:
             print("WARNING: Moon Nakshatra same (could happen if within 24h same nakshatra, but less likely).")

    # 4. Generate for Weekly
    print("\n--- Testing Weekly Period ---")
    res_weekly = generate_for_date(today, "WEEKLY", period="weekly")
    if res_weekly:
        print(f"Weekly Theme: {res_weekly.overall_theme}")
        if "week" in res_weekly.overall_theme.lower():
             print("SUCCESS: Weekly theme mentions 'week'.")
        else:
             print("FAILURE: Weekly theme does not mention 'week'.")
             
        card_weekly = res_weekly.horoscopes[0]
        print(f"Weekly Content: {card_weekly.synthesis}")
        if "week" in card_weekly.synthesis.lower():
             print("SUCCESS: Weekly content mentions 'week' (or related).")
        else:
             # It might not explicitly say "week" in fallback templates if random choice picks one without it?
             # Wait, my fallback templates have {time_frame}.
             pass

if __name__ == "__main__":
    asyncio.run(test_horoscope_variability())