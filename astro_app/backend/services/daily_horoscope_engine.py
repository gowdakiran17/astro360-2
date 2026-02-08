"""
Daily Horoscope Engine
Synthesizes Dasha, Transits, Nakshatra, and Planetary Strength into daily predictions
"""
import logging
from typing import Any, List, Dict, Optional, Tuple
from datetime import datetime

from astro_app.backend.horoscope_models import (
    ActivationTrace,
    ConfidenceGate,
    DashaContext, TransitTrigger, NakshatraContext,
    KPConfirmation,
    LogicTrace,
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
from astro_app.backend.astrology.kp.kp_significators import ASPECTS as VEDIC_ASPECTS, get_planet_house
from astro_app.backend.astrology.kp.kp_significators import analyze_event_potential
from astro_app.backend.services.gemini_service import GeminiService
from astro_app.backend.services.kimi_service import KimiService
from astro_app.backend.astrology.utils import ZODIAC_SIGNS, ZODIAC_LORDS

logger = logging.getLogger(__name__)

# Life area configurations
LIFE_AREAS = {
    "CAREER": {
        "icon": "",
        "houses": [10, 6, 1],
        "planets": ["Sun", "Saturn", "Jupiter", "Mars"],
        "dasha_focus": "strategic professional growth and public recognition",
        "insight_template": "Focus on high-leverage professional tasks. The current alignment favors structured progress in {house_name}."
    },
    "RELATIONSHIPS": {
        "icon": "",
        "houses": [7, 5, 11],
        "planets": ["Venus", "Moon", "Jupiter"],
        "dasha_focus": "deepening partnerships and emotional resonance",
        "insight_template": "Emotional clarity is key. Strengthen bonds by focusing on {house_name} related interactions."
    },
    "WELLNESS": {
        "icon": "",
        "houses": [1, 6, 12],
        "planets": ["Sun", "Moon", "Mars"],
        "dasha_focus": "holistic physical health and mental equilibrium",
        "insight_template": "Vitality flows through disciplined self-care. Pay attention to the {house_name} activation for recovery."
    },
    "BUSINESS": {
        "icon": "",
        "houses": [3, 10, 11],
        "planets": ["Mercury", "Jupiter", "Mars"],
        "dasha_focus": "commercial expansion and innovative enterprise",
        "insight_template": "New ventures require precise communication. Capitalize on the {house_name} activation for deals."
    },
    "WEALTH": {
        "icon": "",
        "houses": [2, 11, 5],
        "planets": ["Jupiter", "Venus", "Mercury"],
        "dasha_focus": "manifesting financial abundance and long-term security",
        "insight_template": "Analyze assets with wisdom. Current energy supports wealth accumulation via {house_name}."
    },
    "EMOTIONAL": {
        "icon": "",
        "houses": [4, 1, 12],
        "planets": ["Moon", "Venus", "Saturn"],
        "dasha_focus": "emotional regulation, inner stability, and recovery",
        "insight_template": "Emotional tone is shaped by {house_name} activation; keep responses proportional and grounded."
    },
    "DECISIONS": {
        "icon": "",
        "houses": [1, 10, 6],
        "planets": ["Mercury", "Jupiter", "Saturn"],
        "dasha_focus": "decision quality, judgement, and timing discipline",
        "insight_template": "Decision-making benefits from structured thinking; verify assumptions before committing to {house_name} actions."
    }
}

TRIKONA_HOUSES = {1, 5, 9}
KENDRA_HOUSES = {1, 4, 7, 10}
DUSTHANA_HOUSES = {6, 8, 12}
UPACHAYA_HOUSES = {3, 6, 10, 11}


def _build_house_signs(asc_sign: str) -> List[str]:
    if asc_sign not in ZODIAC_SIGNS:
        return ZODIAC_SIGNS[:]
    start = ZODIAC_SIGNS.index(asc_sign)
    return [ZODIAC_SIGNS[(start + i) % 12] for i in range(12)]


def _compute_house_owners(asc_sign: str) -> Dict[int, str]:
    house_signs = _build_house_signs(asc_sign)
    return {house_num: ZODIAC_LORDS.get(house_signs[house_num - 1], "Unknown") for house_num in range(1, 13)}


def _compute_planet_house_ownerships(asc_sign: str) -> Dict[str, List[int]]:
    owners = _compute_house_owners(asc_sign)
    planet_houses: Dict[str, List[int]] = {}
    for house_num, lord in owners.items():
        planet_houses.setdefault(lord, []).append(house_num)
    return planet_houses


def _functional_nature_for_planet(planet: str, owned_houses: List[int]) -> Dict[str, Any]:
    kendra = sorted([h for h in owned_houses if h in KENDRA_HOUSES])
    trikona = sorted([h for h in owned_houses if h in TRIKONA_HOUSES])
    dusthana = sorted([h for h in owned_houses if h in DUSTHANA_HOUSES])

    yogakaraka = bool(kendra) and bool([h for h in trikona if h != 1])
    score = 0.0
    notes: List[str] = []

    for h in owned_houses:
        if h in {5, 9}:
            score += 2.0
        elif h in {1, 4, 7, 10}:
            score += 1.0
        elif h in {6, 8, 12}:
            score -= 2.0
        elif h in {3, 11}:
            score -= 1.0
        elif h == 2:
            score -= 0.5

    if yogakaraka:
        score += 2.5
        notes.append("Yogakaraka (kendra+trikona lordship)")

    if dusthana and score > 0:
        notes.append("Mixed functional outcomes (dusthana lordship present)")

    if score >= 2.5:
        nature = "functional_benefic"
    elif score <= -2.0:
        nature = "functional_malefic"
    else:
        nature = "neutral"

    return {
        "planet": planet,
        "owned_houses": sorted(owned_houses),
        "kendra_houses": kendra,
        "trikona_houses": trikona,
        "dusthana_houses": dusthana,
        "yogakaraka": yogakaraka,
        "functional_nature": nature,
        "score": round(score, 2),
        "notes": notes
    }


def compute_functional_planets(asc_sign: str) -> Dict[str, Dict[str, Any]]:
    ownerships = _compute_planet_house_ownerships(asc_sign)
    planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
    out: Dict[str, Dict[str, Any]] = {}
    for p in planets:
        out[p] = _functional_nature_for_planet(p, ownerships.get(p, []))
    return out


def _strength_percent_to_0_100(pct: Optional[float]) -> float:
    if pct is None:
        return 50.0
    return max(0.0, min(100.0, float(pct)))

def _angular_diff(a: float, b: float) -> float:
    diff = abs((a % 360.0) - (b % 360.0))
    return diff if diff <= 180.0 else 360.0 - diff


def _sign_index(lon: float) -> int:
    return int((lon % 360.0) // 30)


def _vedic_aspect(transit_planet: str, transit_lon: float, target_lon: float) -> Optional[Tuple[str, float, float]]:
    diff = _angular_diff(transit_lon, target_lon)
    if diff <= 8.0:
        return ("Conjunction", diff, 100.0 - (diff / 8.0 * 100.0))
    offsets = VEDIC_ASPECTS.get(transit_planet)
    if not offsets:
        return None
    t_sign = _sign_index(transit_lon)
    x_sign = _sign_index(target_lon)
    distance = ((x_sign - t_sign) % 12) + 1
    if distance in offsets:
        return (f"Drishti({distance})", diff, 70.0)
    return None


PLANET_SYMBOLS = {
    "Sun": "☉",
    "Moon": "☽",
    "Mars": "♂",
    "Mercury": "☿",
    "Jupiter": "♃",
    "Venus": "♀",
    "Saturn": "♄",
    "Rahu": "☊",
    "Ketu": "☋"
}


def _is_fast_planet(name: str) -> bool:
    return name in {"Sun", "Mars", "Mercury", "Venus"}


def _transit_priority(name: str) -> int:
    if name == "Moon":
        return 100
    if name in {"Saturn", "Jupiter", "Rahu", "Ketu"}:
        return 85
    if name in {"Sun", "Mars"}:
        return 65
    if name in {"Mercury", "Venus"}:
        return 55
    return 40


def _get_natal_planet_house(natal_chart: Dict, planet_name: str) -> Optional[int]:
    for p in natal_chart.get("planets", []):
        if p.get("name") == planet_name:
            try:
                return int(p.get("house"))
            except Exception:
                return None
    return None


def _build_activation_trace(
    life_area: str,
    natal_chart: Dict,
    dasha_context: DashaContext,
    transit_trigger: TransitTrigger,
    current_transits: Dict[str, float]
) -> ActivationTrace:
    area_config = LIFE_AREAS.get(life_area, LIFE_AREAS["CAREER"])
    relevant_houses = set(area_config.get("houses") or [])
    asc_sign = natal_chart.get("ascendant", {}).get("zodiac_sign", "Unknown")
    ownerships = _compute_planet_house_ownerships(asc_sign)

    reasons: List[str] = []
    triggers: Dict[str, Any] = {"relevant_houses": sorted(relevant_houses)}

    dasha_hits: List[Dict[str, Any]] = []
    for lord in [dasha_context.mahadasha, dasha_context.antardasha, dasha_context.pratyantar]:
        if not lord or lord == "Unknown":
            continue
        owned = set(ownerships.get(lord, []))
        placed = _get_natal_planet_house(natal_chart, lord)
        overlap_owned = sorted(list(owned & relevant_houses))
        placed_hit = placed in relevant_houses if placed else False
        if overlap_owned or placed_hit:
            dasha_hits.append(
                {
                    "lord": lord,
                    "owned_hits": overlap_owned,
                    "placed_house": placed
                }
            )
    if dasha_hits:
        reasons.append("Dasha lords connect to relevant houses")
        triggers["dasha_hits"] = dasha_hits

    asc_lon = float(natal_chart.get("ascendant", {}).get("longitude") or 0.0)
    transit_lon = float(current_transits.get(transit_trigger.planet) or 0.0)
    transit_house = get_planet_house(transit_lon, asc_lon)
    transit_hit = transit_house in relevant_houses
    triggers["transit"] = {
        "planet": transit_trigger.planet,
        "house": transit_house,
        "aspect_type": transit_trigger.aspect_type,
        "target_point": transit_trigger.target_point
    }

    if transit_hit:
        reasons.append("Transit planet activates a relevant house")
    if transit_trigger.aspect_type != "Transit":
        reasons.append("Transit planet aspects a key point")

    activated = bool(dasha_hits) or transit_hit or (transit_trigger.aspect_type != "Transit")
    if not activated:
        reasons.append("No strong dasha-transit activation detected")

    return ActivationTrace(activated=activated, reasons=reasons, triggers=triggers)

KP_AREA_RULES: Dict[str, Dict[str, Any]] = {
    "CAREER": {"cusps": [10], "event_houses": [2, 6, 10, 11]},
    "WEALTH": {"cusps": [2], "event_houses": [2, 11]},
    "RELATIONSHIPS": {"cusps": [7], "event_houses": [5, 7, 11]},
    "WELLNESS": {"cusps": [6], "event_houses": [1, 6, 8, 12]},
    "BUSINESS": {"cusps": [10], "event_houses": [3, 10, 11]},
    "EMOTIONAL": {"cusps": [4], "event_houses": [1, 4, 12]},
    "DECISIONS": {"cusps": [1], "event_houses": [1, 6, 10]}
}


def _kp_confirm_for_area(life_area: str, kp_context: Optional[Dict[str, Any]]) -> Optional[KPConfirmation]:
    if not kp_context:
        return None
    rules = KP_AREA_RULES.get(life_area)
    if not rules:
        return None
    cusps = kp_context.get("house_cusps") or []
    significators = kp_context.get("significators") or {}
    best: Optional[Dict[str, Any]] = None
    for cusp_house in rules["cusps"]:
        if cusp_house - 1 < 0 or cusp_house - 1 >= len(cusps):
            continue
        cusp = cusps[cusp_house - 1]
        cusp_sub = cusp.get("sub_lord")
        if not cusp_sub:
            continue
        analysis = analyze_event_potential(rules["event_houses"], cusp_sub, significators)
        if best is None or (analysis.get("potential") == "YES" and best.get("potential") != "YES"):
            best = analysis
            best["cusp_house"] = cusp_house
            best["cusp_sub_lord"] = cusp_sub
    if not best:
        return KPConfirmation(confirmed=False, potential="NO", reason="KP data unavailable for confirmation", favorable_houses=[])
    potential = best.get("potential", "NO")
    reason = best.get("reason", "")
    favorable = best.get("favorable_houses") or []
    return KPConfirmation(
        confirmed=potential == "YES",
        potential=potential,
        reason=f"Cusp {best.get('cusp_house')}: {reason}",
        favorable_houses=favorable
    )

def _confidence_band(score: float) -> str:
    if score >= 80:
        return "CLEAR"
    if score >= 60:
        return "SUGGESTIVE"
    return "OBSERVATIONAL"


def _transit_factor(urgency: str) -> float:
    if urgency == "Peak":
        return 85.0
    if urgency == "Building":
        return 70.0
    return 55.0


def _compute_confidence(
    dasha_context: DashaContext,
    transit_trigger: TransitTrigger,
    nakshatra_context: NakshatraContext,
    activation: ActivationTrace,
    kp_confirmation: Optional[KPConfirmation]
) -> ConfidenceGate:
    notes: List[str] = []
    score = 0.0

    score += dasha_context.strength * 0.45
    score += nakshatra_context.tarabala_strength * 0.20
    score += _transit_factor(transit_trigger.urgency) * 0.20

    if activation.activated:
        score += 12.0
    else:
        score -= 18.0
        notes.append("No strong dasha-transit activation")

    if kp_confirmation:
        if kp_confirmation.confirmed:
            score += 12.0
        else:
            score -= 12.0
            notes.append("KP did not confirm the main outcome")

    score = max(0.0, min(100.0, round(score, 1)))
    band = _confidence_band(score)
    if band == "CLEAR":
        notes.append("Clear guidance allowed")
    elif band == "SUGGESTIVE":
        notes.append("Suggestive guidance only")
    else:
        notes.append("Observational tone only")
    return ConfidenceGate(score=score, band=band, notes=notes)


def _neutral_synthesis(life_area: str, dasha_context: DashaContext, period: str) -> str:
    time_frame = "this week" if period == "weekly" else "today"
    return f"{life_area}: {time_frame} looks routine-focused. With no strong dasha-transit activation, keep decisions conservative and stick to essentials."

def _signature_for_card(
    life_area: str,
    dasha_context: DashaContext,
    transit_trigger: TransitTrigger,
    nakshatra_context: NakshatraContext,
    activation: ActivationTrace,
    kp_confirmation: Optional[KPConfirmation]
) -> str:
    kp_flag = "Y" if (kp_confirmation and kp_confirmation.confirmed) else "N"
    act_flag = "Y" if activation.activated else "N"
    return (
        f"{life_area}|MD:{dasha_context.mahadasha}|AD:{dasha_context.antardasha}|PD:{dasha_context.pratyantar or ''}"
        f"|NAK:{nakshatra_context.current_nakshatra}:{nakshatra_context.pada}"
        f"|TR:{transit_trigger.planet}:{transit_trigger.aspect_type}:{transit_trigger.target_point}:{transit_trigger.urgency}"
        f"|ACT:{act_flag}|KP:{kp_flag}"
    )


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
        chart_data: Dict,
        natal_strengths: Optional[Dict[str, float]] = None,
        functional_planets: Optional[Dict[str, Dict[str, Any]]] = None
    ) -> DashaContext:
        """Extract current Dasha context for a life area"""
        try:
            summary = dasha_data.get("summary", {})
            mahadasha = summary.get("current_mahadasha", {})
            antardasha = summary.get("current_antardasha", {})
            pratyantar = summary.get("current_pratyantardasha", {})
            
            mahadasha_lord = mahadasha.get("lord", "Unknown")
            antardasha_lord = antardasha.get("lord", "Unknown")
            pratyantar_lord = pratyantar.get("lord") if isinstance(pratyantar, dict) else None
            time_remaining = antardasha.get("time_remaining", "Unknown")
            
            area_config = LIFE_AREAS.get(life_area, LIFE_AREAS["CAREER"])
            primary_house = area_config["houses"][0]
            house_name = self._get_house_name(primary_house)
            
            md_strength = _strength_percent_to_0_100((natal_strengths or {}).get(mahadasha_lord))
            ad_strength = _strength_percent_to_0_100((natal_strengths or {}).get(antardasha_lord))
            pd_strength = _strength_percent_to_0_100((natal_strengths or {}).get(pratyantar_lord or ""))
            strength = round(md_strength * 0.4 + ad_strength * 0.4 + pd_strength * 0.2, 1)
            
            fp = functional_planets or {}
            md_role = (fp.get(mahadasha_lord) or {}).get("functional_nature", "neutral")
            ad_role = (fp.get(antardasha_lord) or {}).get("functional_nature", "neutral")
            pd_role = (fp.get(pratyantar_lord or "") or {}).get("functional_nature", "neutral") if pratyantar_lord else None
            parts = [f"MD {mahadasha_lord} ({md_role})", f"AD {antardasha_lord} ({ad_role})"]
            if pratyantar_lord:
                parts.append(f"PD {pratyantar_lord} ({pd_role or 'neutral'})")
            theme = " / ".join(parts) + f" activates {house_name} priorities."
            
            return DashaContext(
                mahadasha=mahadasha_lord,
                antardasha=antardasha_lord,
                pratyantar=pratyantar_lord,
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
        life_area: str,
        dasha_context: Optional[DashaContext] = None
    ) -> TransitTrigger:
        """Extract most relevant transit for a life area"""
        try:
            natal_planets: Dict[str, float] = {}
            for planet in natal_chart.get("planets", []):
                if "name" in planet and "longitude" in planet:
                    natal_planets[planet["name"]] = planet["longitude"]

            asc_lon = float(natal_chart.get("ascendant", {}).get("longitude") or 0.0)
            cusp_7 = (asc_lon + 180.0) % 360.0
            cusp_10 = (asc_lon + 270.0) % 360.0

            keys: List[Tuple[str, float]] = []
            moon_lon = natal_planets.get("Moon")
            if moon_lon is not None:
                keys.append(("Moon", moon_lon))
            keys.append(("Lagna", asc_lon))
            keys.append(("7th cusp", cusp_7))
            keys.append(("10th cusp", cusp_10))

            if dasha_context:
                for lord in [dasha_context.mahadasha, dasha_context.antardasha, dasha_context.pratyantar]:
                    if lord and lord in natal_planets:
                        keys.append((f"{lord} (Dasha)", natal_planets[lord]))

            area_config = LIFE_AREAS.get(life_area, LIFE_AREAS["CAREER"])
            relevant_houses = set(area_config.get("houses") or [])

            best: Optional[Dict[str, Any]] = None

            for planet_name, transit_lon in current_transits.items():
                if planet_name not in PLANET_SYMBOLS:
                    continue

                scored_keys: List[Tuple[str, str, float, float]] = []
                for key_label, key_lon in keys:
                    asp = _vedic_aspect(planet_name, float(transit_lon), float(key_lon))
                    if asp:
                        aspect_type, aspect_degrees, exactness = asp
                        scored_keys.append((key_label, aspect_type, aspect_degrees, exactness))

                if _is_fast_planet(planet_name) and not scored_keys:
                    continue

                house_num = get_planet_house(float(transit_lon), asc_lon)

                score = _transit_priority(planet_name)
                if house_num in relevant_houses:
                    score += 30
                if scored_keys:
                    score += max(int(x[3]) for x in scored_keys)

                if best is None or score > best["score"]:
                    best_key = scored_keys[0] if scored_keys else ("", "Transit", 0.0, 0.0)
                    best = {
                        "planet": planet_name,
                        "lon": float(transit_lon),
                        "house": house_num,
                        "score": score,
                        "target_point": best_key[0] or f"House {house_num}",
                        "aspect_type": best_key[1],
                        "aspect_degrees": float(best_key[2]),
                        "exactness": float(best_key[3])
                    }

            if not best:
                return self._get_fallback_transit_trigger(life_area)

            urgency = "Peak" if best["exactness"] >= 85 else "Building" if best["exactness"] >= 65 else "Background"
            effect = f"{best['planet']} {best['aspect_type']} {best['target_point']} (House {best['house']})"

            return TransitTrigger(
                planet=best["planet"],
                planet_symbol=PLANET_SYMBOLS.get(best["planet"], ""),
                aspect_type=best["aspect_type"],
                aspect_degrees=best["aspect_degrees"],
                target_point=best["target_point"],
                urgency=urgency,
                effect=effect
            )
                
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
                {"label": "💬 Ask AI", "action": "ask_ai", "context": life_area}
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
        user_name: str,
        period: str = "daily",
        confidence_band: str = "SUGGESTIVE"
    ) -> str:
        """Use AI to synthesize all layers into a coherent prediction"""
        try:
            prompt = self._build_synthesis_prompt(
                life_area, dasha_context, transit_trigger, nakshatra_context, user_name, period
            )
            
            period_label = "weekly" if period == "weekly" else "daily"
            
            system_prompt = f"""You are a professional astrology logic interpreter. Convert the provided Vedic+KP logic into calm, practical {period_label} guidance (3-4 sentences).

Hard rules:
- No event prediction without explicit activation in the input.
- No exaggeration; astrology describes tendencies, not guarantees.
- Use certainty aligned to confidence band: CLEAR=direct, SUGGESTIVE=use 'may'/'likely', OBSERVATIONAL=describe conditions only.
- Keep it under 90 words.

Confidence band: {confidence_band}"""
            
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
            
            # Check for AI service error message
            if "trouble connecting to the stars" in synthesis:
                raise Exception("AI Service returned error message")
            
            return synthesis
            
        except Exception as e:
            logger.error(f"Error synthesizing with AI: {e}")
            return self._get_fallback_synthesis(life_area, dasha_context, transit_trigger, nakshatra_context, period)
    
    def calculate_favorability_score(
        self,
        dasha_context: DashaContext,
        transit_trigger: TransitTrigger,
        nakshatra_context: NakshatraContext,
        life_area: str = "general"
    ) -> float:
        """Calculate overall favorability score (0-100)"""
        dasha_weight = 0.4
        transit_weight = 0.35
        nakshatra_weight = 0.25
        
        dasha_score = dasha_context.strength
        
        if transit_trigger.urgency == "Peak":
            transit_score = 82
        elif transit_trigger.urgency == "Building":
            transit_score = 72
        else:
            transit_score = 62
        if transit_trigger.aspect_type.startswith("Drishti") or transit_trigger.aspect_type == "Conjunction":
            transit_score = min(90, transit_score + 5)
        
        nakshatra_score = nakshatra_context.tarabala_strength
        
        total_score = (
            dasha_score * dasha_weight +
            transit_score * transit_weight +
            nakshatra_score * nakshatra_weight
        )
        
        return max(0, min(100, round(total_score, 1)))
    
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
        longitude: float,
        period: str = "daily",
        natal_strengths: Optional[Dict[str, float]] = None,
        kp_context: Optional[Dict[str, Any]] = None,
        recent_signatures_by_area: Optional[Dict[str, List[str]]] = None
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
        
        # Get birth nakshatra and mantra
        birth_nakshatra = "Ashwini"
        birth_mantra = "Om Ashwini Kumaraya Namah"
        
        for planet in birth_chart.get("planets", []):
            if planet["name"] == "Moon":
                birth_nakshatra = planet.get("nakshatra", "Ashwini")
                # Find mantra in NAKSHATRAS list
                from astro_app.backend.astrology.nakshatra_intelligence import NAKSHATRAS
                for nak in NAKSHATRAS:
                    if nak["name"].lower() == birth_nakshatra.lower():
                        birth_mantra = nak.get("mantra", "Om Shanti")
                        break
                break
        
        functional_planets = compute_functional_planets(ascendant)

        horoscope_cards = []
        
        for life_area, config in LIFE_AREAS.items():
            # Layer 1: Dasha Context
            dasha_context = self.extract_dasha_context(
                dasha_data,
                life_area,
                birth_chart,
                natal_strengths=natal_strengths,
                functional_planets=functional_planets
            )
            
            # Layer 2: Transit Trigger
            transit_trigger = self.extract_transit_trigger(
                current_transits, birth_chart, life_area, dasha_context=dasha_context
            )
            
            # Layer 3: Nakshatra Context
            nakshatra_context = self.extract_nakshatra_context(
                current_moon_longitude, birth_nakshatra, life_area
            )

            activation = _build_activation_trace(
                life_area=life_area,
                natal_chart=birth_chart,
                dasha_context=dasha_context,
                transit_trigger=transit_trigger,
                current_transits=current_transits
            )

            kp_confirmation = _kp_confirm_for_area(life_area, kp_context)

            confidence = _compute_confidence(
                dasha_context=dasha_context,
                transit_trigger=transit_trigger,
                nakshatra_context=nakshatra_context,
                activation=activation,
                kp_confirmation=kp_confirmation
            )

            signature = _signature_for_card(
                life_area=life_area,
                dasha_context=dasha_context,
                transit_trigger=transit_trigger,
                nakshatra_context=nakshatra_context,
                activation=activation,
                kp_confirmation=kp_confirmation
            )
            recent = (recent_signatures_by_area or {}).get(life_area) or []
            repeated = bool(recent) and recent[0] == signature
            if repeated:
                adjusted_score = max(0.0, confidence.score - 6.0)
                confidence = ConfidenceGate(
                    score=adjusted_score,
                    band=_confidence_band(adjusted_score),
                    notes=[*confidence.notes, "Repetition detected; intensity reduced"]
                )
            
            # Layer 4: Calculate Favorability
            favorability = self.calculate_favorability_score(
                dasha_context, transit_trigger, nakshatra_context, life_area
            )

            if not activation.activated:
                favorability = 50.0
            if kp_confirmation and not kp_confirmation.confirmed:
                favorability = max(0.0, favorability - 8.0)
            if repeated:
                favorability = max(0.0, favorability - 3.0)
            
            # Layer 5: AI Synthesis
            if confidence.band == "OBSERVATIONAL" or not activation.activated:
                synthesis = _neutral_synthesis(life_area, dasha_context, period)
            else:
                synthesis = self.synthesize_with_ai(
                    life_area, dasha_context, transit_trigger, nakshatra_context, user_name, period, confidence.band
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
                ai_confidence=85.0,
                activation=activation,
                kp_confirmation=kp_confirmation,
                confidence=confidence,
                evidence={
                    "activation": activation.triggers,
                    "kp": kp_confirmation.dict() if kp_confirmation else None,
                    "signature": signature,
                    "repetition": {"repeated": repeated, "recent": recent[:3]}
                }
            )
            
            horoscope_cards.append(card)
        
        # Generate overall theme
        overall_theme = self._generate_overall_theme(horoscope_cards, user_name, period)
        
        avg_conf = round(sum((c.confidence.score if c.confidence else 0.0) for c in horoscope_cards) / len(horoscope_cards), 1) if horoscope_cards else 0.0
        response_conf = ConfidenceGate(score=avg_conf, band=_confidence_band(avg_conf), notes=[])
        activated_count = sum(1 for c in horoscope_cards if c.activation and c.activation.activated)
        neutral_day = activated_count == 0
        neutral_reason = "No strong dasha-transit activation across life areas" if neutral_day else None
        repetition_count = sum(1 for c in horoscope_cards if (c.evidence or {}).get("repetition", {}).get("repeated"))

        logic_trace = LogicTrace(
            natal={
                "ascendant": ascendant,
                "moon_sign": moon_sign,
                "birth_nakshatra": birth_nakshatra
            },
            functional_planets=functional_planets,
            dasha={"summary": dasha_data.get("summary", {}) if isinstance(dasha_data, dict) else {}},
            transits={"moon_longitude": current_moon_longitude},
            repetition={"repetition_count": repetition_count}
        )

        return DailyHoroscopeResponse(
            date=current_time.strftime("%A, %B %d, %Y"),
            overall_theme=overall_theme,
            power_mantra=birth_mantra,
            primary_focus="Growth",
            harmonic_color="Gold",
            optimal_direction="East",
            horoscopes=horoscope_cards,
            birth_name=user_name,
            ascendant=ascendant,
            moon_sign=moon_sign,
            generated_at=current_time,
            ai_provider=self.ai_provider,
            neutral_day=neutral_day,
            neutral_reason=neutral_reason,
            confidence=response_conf,
            logic_trace=logic_trace,
            evidence_map={"activated_count": activated_count}
        )
    
    # Helper methods
    def _get_house_name(self, house_num: int) -> str:
        house_names = {
            1: "Self", 2: "Wealth", 3: "Courage", 4: "Home",
            5: "Creativity", 6: "Service", 7: "Partnership", 8: "Transformation",
            9: "Wisdom", 10: "Career", 11: "Gains", 12: "Liberation"
        }
        return house_names.get(house_num, "Unknown")
    
    def _build_synthesis_prompt(self, life_area, dasha, transit, nakshatra, name, period="daily"):
        period_label = "weekly" if period == "weekly" else "daily"
        return f"""Generate a {period_label} {life_area} horoscope for {name}.

DASHA: {dasha.mahadasha}-{dasha.antardasha} period activating {dasha.theme}
TRANSIT: {transit.planet} {transit.aspect_type} {transit.target_point} - {transit.effect}
NAKSHATRA: {nakshatra.current_nakshatra} ({nakshatra.theme})

Synthesize these into 3-4 sentences."""
    
    def _generate_overall_theme(self, cards: List[HoroscopeCard], name: str, period: str = "daily") -> str:
        # Get the Moon/Nakshatra from the first card (they are usually same for all areas)
        nakshatra = "the stars"
        if cards and cards[0].nakshatra_context:
            nakshatra = cards[0].nakshatra_context.current_nakshatra

        avg_favorability = sum(c.favorability for c in cards) / len(cards)
        
        # Adjust text based on period
        time_frame = "week" if period == "weekly" else "day"
        
        if avg_favorability >= 85:
            return f"With the Moon in {nakshatra}, cosmic energies flow in your favor this {time_frame}, {name}. Trust your intuition."
        elif avg_favorability >= 70:
            return f"A balanced {time_frame} under {nakshatra}, {name}. Focus on areas where the stars align most favorably."
        else:
            return f"Navigate this {time_frame}'s {nakshatra} energy with patience, {name}. Challenges bring growth."

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
    
    def _get_fallback_synthesis(self, life_area: str, dasha: DashaContext, transit: TransitTrigger, nakshatra: Optional[NakshatraContext] = None, period: str = "daily") -> str:
        """
        Generate a rule-based fallback horoscope when AI is unavailable.
        Uses Dasha (Timeline), Transit (Current Planet), and Nakshatra (Mood) to create a unique insight.
        """
        time_frame = "week" if period == "weekly" else "day"
        
        # Base templates
        templates = [
            "Your {dasha_lord} period brings focus to {life_area_lower} this {time_frame}.",
            "Under the influence of {transit_planet}, {life_area_lower} takes center stage.",
            "{transit_planet}'s energy activates your {life_area_lower} sector this {time_frame}."
        ]
        
        key = f"{life_area}:{dasha.mahadasha}:{dasha.antardasha}:{transit.planet}:{time_frame}"
        idx = sum(ord(c) for c in key) % len(templates)
        base = templates[idx].format(
            dasha_lord=dasha.mahadasha,
            life_area_lower=life_area.lower(),
            transit_planet=transit.planet,
            time_frame=time_frame
        )
        
        # Add Nakshatra context if available
        if nakshatra:
            nakshatra_msg = f" The Moon in {nakshatra.current_nakshatra} brings focus to {nakshatra.theme.lower()}."
        else:
            nakshatra_msg = ""
            
        # Add specific transit effect
        effect_msg = f" Expect {transit.effect.lower()}."
        
        return base + nakshatra_msg + effect_msg

    def generate_weekly_horoscopes(
        self,
        birth_chart: Dict,
        dasha_data: Dict,
        base_date: datetime,
        latitude: float,
        longitude: float,
        timezone_str: str,
        natal_strengths: Optional[Dict[str, float]] = None,
        kp_context: Optional[Dict[str, Any]] = None
    ):
        """Generate weekly horoscope aggregation for 7 days from base_date"""
        from astro_app.backend.astrology.chart import calculate_chart
        from astro_app.backend.horoscope_models import WeeklyDaySummary, WeeklyHoroscopeResponse
        from datetime import timedelta
        
        user_name = birth_chart.get("name", "User")
        daily_summaries = []
        area_totals: Dict[str, float] = {area: 0.0 for area in LIFE_AREAS.keys()}
        day_overall_scores = []
        
        # Generate predictions for each of the 7 days
        for day_offset in range(7):
            current_date = base_date + timedelta(days=day_offset)
            
            # Calculate transits for this day
            current_date_str = current_date.strftime("%d/%m/%Y")
            current_time_str = "12:00"  # Noon for daily average
            
            try:
                transit_chart = calculate_chart(
                    current_date_str,
                    current_time_str,
                    timezone_str,
                    float(latitude),
                    float(longitude)
                )
                
                current_transits = {}
                for planet in transit_chart.get("planets", []):
                    current_transits[planet["name"]] = planet["longitude"]
                
                current_moon_longitude = current_transits.get("Moon", 0.0)
                
                # Generate daily horoscopes for this day
                daily_result = self.generate_daily_horoscopes(
                    birth_chart=birth_chart,
                    dasha_data=dasha_data,
                    current_transits=current_transits,
                    current_moon_longitude=current_moon_longitude,
                    current_time=current_date,
                    latitude=latitude,
                    longitude=longitude,
                    period="daily",
                    natal_strengths=natal_strengths,
                    kp_context=kp_context
                )
                
                # Calculate daily scores
                area_scores = {}
                for card in daily_result.horoscopes:
                    area_scores[card.life_area] = card.favorability
                    area_totals[card.life_area] += card.favorability
                
                overall_score = sum(area_scores.values()) / len(area_scores) if area_scores else 50.0
                day_overall_scores.append((current_date, overall_score))
                
                # Find best/worst areas for this day
                best_area = max(area_scores, key=area_scores.get) if area_scores else "CAREER"
                worst_area = min(area_scores, key=area_scores.get) if area_scores else "CAREER"
                
                daily_summaries.append(WeeklyDaySummary(
                    date=current_date.strftime("%Y-%m-%d"),
                    weekday=current_date.strftime("%A"),
                    overall_score=round(overall_score, 1),
                    best_area=best_area,
                    worst_area=worst_area,
                    theme=daily_result.overall_theme[:100] if daily_result.overall_theme else "Steady energy",
                    area_scores=area_scores
                ))
                
            except Exception as e:
                logger.error(f"Error calculating day {day_offset}: {e}")
                # Add fallback day
                daily_summaries.append(WeeklyDaySummary(
                    date=current_date.strftime("%Y-%m-%d"),
                    weekday=current_date.strftime("%A"),
                    overall_score=50.0,
                    best_area="CAREER",
                    worst_area="WEALTH",
                    theme="Steady progress",
                    area_scores={area: 50.0 for area in LIFE_AREAS.keys()}
                ))
                day_overall_scores.append((current_date, 50.0))
        
        # Calculate weekly averages
        area_averages = {area: round(total / 7, 1) for area, total in area_totals.items()}
        overall_week_score = round(sum(area_averages.values()) / len(area_averages), 1)
        
        # Find best and worst days
        sorted_days = sorted(day_overall_scores, key=lambda x: x[1], reverse=True)
        best_day_date, best_day_score = sorted_days[0]
        worst_day_date, worst_day_score = sorted_days[-1]
        
        # Generate weekly theme
        top_area = max(area_averages, key=area_averages.get)
        weekly_theme = f"This week emphasizes {top_area.lower().replace('_', ' ')} with an average energy of {overall_week_score:.0f}%. Your strongest day is {best_day_date.strftime('%A')}."
        
        return WeeklyHoroscopeResponse(
            week_start=base_date.strftime("%Y-%m-%d"),
            week_end=(base_date + timedelta(days=6)).strftime("%Y-%m-%d"),
            area_averages=area_averages,
            overall_week_score=overall_week_score,
            best_day=best_day_date.strftime("%A"),
            best_day_date=best_day_date.strftime("%Y-%m-%d"),
            worst_day=worst_day_date.strftime("%A"),
            worst_day_date=worst_day_date.strftime("%Y-%m-%d"),
            daily_summaries=daily_summaries,
            weekly_theme=weekly_theme,
            weekly_focus=top_area,
            birth_name=user_name,
            generated_at=datetime.now()
        )

