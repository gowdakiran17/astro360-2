"""
Daily Horoscope Engine
Synthesizes Dasha, Transits, Nakshatra, and Planetary Strength into daily predictions
"""
from typing import Dict, List, Optional
from datetime import datetime
import logging

from astro_app.backend.horoscope_models import (
    DashaContext, TransitTrigger, NakshatraContext,
    OptimalAction, HoroscopeCard, DailyHoroscopeResponse
)
from astro_app.backend.astrology.nakshatra_intelligence import (
    calculate_nakshatra_strength_for_activity,
    get_current_moon_nakshatra
)
from astro_app.backend.astrology.planetary_hora import (
    get_next_favorable_hora,
    format_hora_time
)
from astro_app.backend.astrology.transit_calculator import (
    calculate_transit_to_natal_aspects,
    find_most_relevant_transit_for_area,
    get_transit_effect_description,
    calculate_transit_urgency,
    TRANSIT_IMPORTANCE
)
from astro_app.backend.services.gemini_service import GeminiService
from astro_app.backend.services.kimi_service import KimiService

logger = logging.getLogger(__name__)

# Life area configurations
LIFE_AREAS = {
    "CAREER": {
        "icon": "💼",
        "houses": [10, 6, 1],
        "planets": ["Sun", "Saturn", "Jupiter", "Mars"],
        "dasha_focus": "strategic professional growth and public recognition",
        "insight_template": "Focus on high-leverage professional tasks. The current alignment favors structured progress in {house_name}."
    },
    "RELATIONS": {
        "icon": "♥",
        "houses": [7, 5, 11],
        "planets": ["Venus", "Moon", "Jupiter"],
        "dasha_focus": "deepening partnerships and emotional resonance",
        "insight_template": "Emotional clarity is key. Strengthen bonds by focusing on {house_name} related interactions."
    },
    "WELLNESS": {
        "icon": "🧘",
        "houses": [1, 6, 12],
        "planets": ["Sun", "Moon", "Mars"],
        "dasha_focus": "holistic physical health and mental equilibrium",
        "insight_template": "Vitality flows through disciplined self-care. Pay attention to the {house_name} activation for recovery."
    },
    "BUSINESS": {
        "icon": "💰",
        "houses": [3, 10, 11],
        "planets": ["Mercury", "Jupiter", "Mars"],
        "dasha_focus": "commercial expansion and innovative enterprise",
        "insight_template": "New ventures require precise communication. Capitalize on the {house_name} activation for deals."
    },
    "WEALTH": {
        "icon": "💎",
        "houses": [2, 11, 5],
        "planets": ["Jupiter", "Venus", "Mercury"],
        "dasha_focus": "manifesting financial abundance and long-term security",
        "insight_template": "Analyze assets with wisdom. Current energy supports wealth accumulation via {house_name}."
    }
}


class DailyHoroscopeEngine:
    def __init__(self, ai_provider: str = "Gemini"):
        self.ai_provider = ai_provider
        if ai_provider == "Kimi":
            self.ai_service = KimiService()
        else:
            self.ai_service = GeminiService()
    
    def extract_dasha_context(
        self,
        dasha_data: Dict,
        life_area: str,
        chart_data: Dict
    ) -> DashaContext:
        """Extract current Dasha context for a life area"""
        try:
            # Get current Mahadasha and Antardasha
            summary = dasha_data.get("summary", {})
            mahadasha = summary.get("current_mahadasha", {})
            antardasha = summary.get("current_antardasha", {})
            
            mahadasha_lord = mahadasha.get("lord", "Unknown")
            antardasha_lord = antardasha.get("lord", "Unknown")
            time_remaining = antardasha.get("time_remaining", "Unknown")
            
            # Determine which house is most activated for this life area
            area_config = LIFE_AREAS.get(life_area, LIFE_AREAS["CAREER"])
            primary_house = area_config["houses"][0]
            house_name = self._get_house_name(primary_house)
            
            # Calculate Dasha strength (simplified - would use Shadbala in production)
            strength = 75.0  # Placeholder
            
            # Generate a more descriptive theme
            theme = area_config["insight_template"].format(house_name=house_name)
            theme += f" Specifically, {antardasha_lord}'s sub-period activates {area_config['dasha_focus']}."
            
            return DashaContext(
                mahadasha=mahadasha_lord,
                antardasha=antardasha_lord,
                pratyantar=None,
                house=primary_house,
                house_name=house_name,
                strength=strength,
                time_remaining=time_remaining,
                theme=theme
            )
        except Exception as e:
            logger.error(f"Error extracting Dasha context: {e}")
            return self._get_fallback_dasha_context(life_area)
    
    def extract_transit_trigger(
        self,
        current_transits: Dict[str, float],
        natal_chart: Dict,
        life_area: str
    ) -> TransitTrigger:
        """Extract most relevant transit for a life area"""
        try:
            # Get natal planet positions
            natal_planets = {}
            for planet in natal_chart.get("planets", []):
                natal_planets[planet["name"]] = planet["longitude"]
            
            # Calculate all aspects
            aspects = calculate_transit_to_natal_aspects(current_transits, natal_planets)
            
            # Find most relevant for this life area
            relevant_transit = find_most_relevant_transit_for_area(
                aspects, life_area.lower(), natal_chart
            )
            
            if relevant_transit:
                # Get transit speed for urgency calculation
                transit_planet = relevant_transit["transit_planet"]
                speed = TRANSIT_IMPORTANCE.get(transit_planet, {}).get("speed", "medium")
                urgency = calculate_transit_urgency(
                    relevant_transit["exactness"],
                    speed
                )
                
                effect = get_transit_effect_description(
                    transit_planet,
                    relevant_transit["aspect_type"],
                    relevant_transit["natal_planet"],
                    life_area.lower()
                )
                
                return TransitTrigger(
                    planet=transit_planet,
                    planet_symbol=relevant_transit["transit_symbol"],
                    aspect_type=relevant_transit["aspect_type"],
                    aspect_degrees=relevant_transit["aspect_angle"],
                    target_point=relevant_transit["natal_planet"],
                    urgency=urgency,
                    effect=effect
                )
            else:
                return self._get_fallback_transit_trigger(life_area)
                
        except Exception as e:
            logger.error(f"Error extracting transit trigger: {e}")
            return self._get_fallback_transit_trigger(life_area)
    
    def extract_nakshatra_context(
        self,
        current_moon_longitude: float,
        birth_nakshatra: str,
        life_area: str
    ) -> NakshatraContext:
        """Extract Nakshatra intelligence for a life area"""
        try:
            nakshatra_data = calculate_nakshatra_strength_for_activity(
                birth_nakshatra,
                current_moon_longitude,
                life_area.lower()
            )
            
            return NakshatraContext(
                current_nakshatra=nakshatra_data["current_nakshatra"],
                nakshatra_lord=nakshatra_data["nakshatra_lord"],
                deity=nakshatra_data["deity"],
                pada=nakshatra_data["pada"],
                tarabala=nakshatra_data["tarabala_position"],
                tarabala_name=nakshatra_data["tarabala_name"],
                tarabala_strength=nakshatra_data["tarabala_strength"],
                theme=nakshatra_data["theme"]
            )
        except Exception as e:
            logger.error(f"Error extracting Nakshatra context: {e}")
            return self._get_fallback_nakshatra_context()
    
    def generate_optimal_action(
        self,
        life_area: str,
        current_time: datetime,
        latitude: float,
        longitude: float,
        synthesis: str
    ) -> OptimalAction:
        """Generate optimal action with timing"""
        try:
            # Get next favorable hora
            favorable_hora = get_next_favorable_hora(
                current_time,
                latitude,
                longitude,
                life_area.lower()
            )
            
            # Generate action based on life area
            actions = {
                "CAREER": "Schedule important meeting or pitch idea",
                "RELATIONS": "Have meaningful conversation or write feelings",
                "WELLNESS": "Practice yoga or meditation",
                "BUSINESS": "Sign contracts or initiate deals",
                "WEALTH": "Review portfolio or meet financial advisor"
            }
            
            action = actions.get(life_area, "Take aligned action")
            timing = format_hora_time(favorable_hora["start_time"])
            hora_name = f"{favorable_hora['planet']} Hora"
            reason = f"Favorable {favorable_hora['planet']} energy for {life_area.lower()}"
            
            # Generate CTA buttons
            cta_buttons = [
                {"label": "🎯 Set Alert", "action": "alert", "time": timing},
                {"label": "💬 Ask AI", "action": "chat", "context": life_area}
            ]
            
            return OptimalAction(
                action=action,
                timing=timing,
                hora=hora_name,
                reason=reason,
                cta_buttons=cta_buttons
            )
        except Exception as e:
            logger.error(f"Error generating optimal action: {e}")
            return self._get_fallback_optimal_action(life_area)
    
    def synthesize_with_ai(
        self,
        life_area: str,
        dasha_context: DashaContext,
        transit_trigger: TransitTrigger,
        nakshatra_context: NakshatraContext,
        user_name: str
    ) -> str:
        """Use AI to synthesize all layers into a coherent prediction"""
        try:
            prompt = self._build_synthesis_prompt(
                life_area, dasha_context, transit_trigger, nakshatra_context, user_name
            )
            
            system_prompt = """You are Vedant, a wise Vedic astrologer. Generate a concise daily horoscope prediction (3-4 sentences) that synthesizes the provided Dasha, Transit, and Nakshatra data.

RULES:
- Be specific and actionable
- Reference the Dasha period and what it activates
- Mention the transit trigger and its effect
- Include Nakshatra influence
- Keep it under 100 words
- Be warm and encouraging"""
            
            if self.ai_provider == "Kimi":
                synthesis = self.ai_service.generate_chat_response(
                    user_query=prompt,
                    system_prompt=system_prompt,
                    context_data=""
                )
            else:
                synthesis = self.ai_service.generate_chat_response(
                    user_query=prompt,
                    system_prompt=system_prompt,
                    context_data=""
                )
            
            # Clean up the response
            synthesis = synthesis.strip()
            
            return synthesis
            
        except Exception as e:
            logger.error(f"Error synthesizing with AI: {e}")
            return self._get_fallback_synthesis(life_area, dasha_context, transit_trigger)
    
    def calculate_favorability_score(
        self,
        dasha_context: DashaContext,
        transit_trigger: TransitTrigger,
        nakshatra_context: NakshatraContext
    ) -> float:
        """Calculate overall favorability score (0-100)"""
        # Weight the components
        dasha_weight = 0.4
        transit_weight = 0.35
        nakshatra_weight = 0.25
        
        # Dasha strength
        dasha_score = dasha_context.strength
        
        # Transit strength (based on nature and strength)
        transit_score = transit_trigger.aspect_degrees  # Simplified
        if transit_trigger.aspect_type in ["Trine", "Sextile"]:
            transit_score = 85
        elif transit_trigger.aspect_type == "Conjunction":
            transit_score = 75
        else:
            transit_score = 60
        
        # Nakshatra strength
        nakshatra_score = nakshatra_context.tarabala_strength
        
        # Weighted average
        total_score = (
            dasha_score * dasha_weight +
            transit_score * transit_weight +
            nakshatra_score * nakshatra_weight
        )
        
        return round(total_score, 1)
    
    def get_favorability_label(self, score: float) -> str:
        """Convert score to label"""
        if score >= 90:
            return "Excellent"
        elif score >= 75:
            return "Favorable"
        elif score >= 60:
            return "Moderate"
        else:
            return "Challenging"
    
    def generate_daily_horoscopes(
        self,
        birth_chart: Dict,
        dasha_data: Dict,
        current_transits: Dict[str, float],
        current_moon_longitude: float,
        current_time: datetime,
        latitude: float,
        longitude: float
    ) -> DailyHoroscopeResponse:
        """Generate complete daily horoscope for all 5 life areas"""
        
        user_name = birth_chart.get("name", "User")
        ascendant = birth_chart.get("ascendant", {}).get("zodiac_sign", "Unknown")
        moon_sign = "Unknown"
        
        # Get Moon sign from planets
        for planet in birth_chart.get("planets", []):
            if planet["name"] == "Moon":
                moon_sign = planet["zodiac_sign"]
                break
        
        # Get birth nakshatra
        birth_nakshatra = "Ashwini"  # Placeholder - should extract from chart
        for planet in birth_chart.get("planets", []):
            if planet["name"] == "Moon":
                birth_nakshatra = planet.get("nakshatra", "Ashwini")
                break
        
        horoscope_cards = []
        
        for life_area, config in LIFE_AREAS.items():
            # Layer 1: Dasha Context
            dasha_context = self.extract_dasha_context(dasha_data, life_area, birth_chart)
            
            # Layer 2: Transit Trigger
            transit_trigger = self.extract_transit_trigger(
                current_transits, birth_chart, life_area
            )
            
            # Layer 3: Nakshatra Context
            nakshatra_context = self.extract_nakshatra_context(
                current_moon_longitude, birth_nakshatra, life_area
            )
            
            # Layer 4: Calculate Favorability
            favorability = self.calculate_favorability_score(
                dasha_context, transit_trigger, nakshatra_context
            )
            
            # Layer 5: AI Synthesis
            synthesis = self.synthesize_with_ai(
                life_area, dasha_context, transit_trigger, nakshatra_context, user_name
            )
            
            # Generate Optimal Action
            optimal_action = self.generate_optimal_action(
                life_area, current_time, latitude, longitude, synthesis
            )
            
            # Create card
            card = HoroscopeCard(
                life_area=life_area,
                icon=config["icon"],
                favorability=favorability,
                favorability_label=self.get_favorability_label(favorability),
                dasha_context=dasha_context,
                transit_trigger=transit_trigger,
                nakshatra_context=nakshatra_context,
                synthesis=synthesis,
                optimal_action=optimal_action,
                ai_confidence=85.0  # Placeholder
            )
            
            horoscope_cards.append(card)
        
        # Generate overall theme
        overall_theme = self._generate_overall_theme(horoscope_cards, user_name)
        
        return DailyHoroscopeResponse(
            date=current_time.strftime("%A, %B %d, %Y"),
            overall_theme=overall_theme,
            power_mantra="Om Shanti",
            primary_focus="Growth",
            harmonic_color="Gold",
            optimal_direction="East",
            horoscopes=horoscope_cards,
            birth_name=user_name,
            ascendant=ascendant,
            moon_sign=moon_sign,
            generated_at=current_time,
            ai_provider=self.ai_provider
        )
    
    # Helper methods
    def _get_house_name(self, house_num: int) -> str:
        house_names = {
            1: "Self", 2: "Wealth", 3: "Courage", 4: "Home",
            5: "Creativity", 6: "Service", 7: "Partnership", 8: "Transformation",
            9: "Wisdom", 10: "Career", 11: "Gains", 12: "Liberation"
        }
        return house_names.get(house_num, "Unknown")
    
    def _build_synthesis_prompt(self, life_area, dasha, transit, nakshatra, name):
        return f"""Generate a daily {life_area} horoscope for {name}.

DASHA: {dasha.mahadasha}-{dasha.antardasha} period activating {dasha.theme}
TRANSIT: {transit.planet} {transit.aspect_type} {transit.target_point} - {transit.effect}
NAKSHATRA: {nakshatra.current_nakshatra} ({nakshatra.theme})

Synthesize these into 3-4 sentences."""
    
    def _generate_overall_theme(self, cards: List[HoroscopeCard], name: str) -> str:
        avg_favorability = sum(c.favorability for c in cards) / len(cards)
        if avg_favorability >= 85:
            return f"The cosmic energies are flowing in your favor today, {name}. Trust your intuition and embrace new opportunities."
        elif avg_favorability >= 70:
            return f"A balanced day ahead, {name}. Focus on areas where the stars align most favorably."
        else:
            return f"Navigate today with patience, {name}. Challenges bring growth opportunities."
    
    def _get_fallback_dasha_context(self, life_area: str) -> DashaContext:
        return DashaContext(
            mahadasha="Venus",
            antardasha="Mercury",
            house=10,
            house_name="Career",
            strength=75.0,
            time_remaining="6 months",
            theme="Professional communication"
        )
    
    def _get_fallback_transit_trigger(self, life_area: str) -> TransitTrigger:
        return TransitTrigger(
            planet="Jupiter",
            planet_symbol="♃",
            aspect_type="Trine",
            aspect_degrees=120.0,
            target_point="MC",
            urgency="Building",
            effect="Expansion and growth"
        )
    
    def _get_fallback_nakshatra_context(self) -> NakshatraContext:
        return NakshatraContext(
            current_nakshatra="Magha",
            nakshatra_lord="Ketu",
            deity="Pitris",
            pada=1,
            tarabala=2,
            tarabala_name="Sampat",
            tarabala_strength=100.0,
            theme="Royal recognition"
        )
    
    def _get_fallback_optimal_action(self, life_area: str) -> OptimalAction:
        return OptimalAction(
            action="Take aligned action",
            timing="11:00 AM",
            hora="Jupiter Hora",
            reason="Favorable timing",
            cta_buttons=[{"label": "Set Alert", "action": "alert"}]
        )
    
    def _get_fallback_synthesis(self, life_area, dasha, transit) -> str:
        return f"Your {dasha.mahadasha}-{dasha.antardasha} period brings opportunities in {life_area.lower()}. {transit.planet}'s {transit.aspect_type} aspect supports {transit.effect}."
