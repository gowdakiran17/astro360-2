import datetime
import unittest

from astro_app.backend.horoscope_models import ActivationTrace, DashaContext, KPConfirmation, NakshatraContext, TransitTrigger
from astro_app.backend.services import daily_horoscope_engine as dhe
from astro_app.backend.services.daily_horoscope_engine import DailyHoroscopeEngine


class TestDailyGuidanceEngine(unittest.TestCase):
    def test_pratyantar_extraction_present(self):
        engine = DailyHoroscopeEngine(ai_provider="Gemini")
        dasha_data = {
            "summary": {
                "current_mahadasha": {"lord": "Jupiter"},
                "current_antardasha": {"lord": "Saturn", "time_remaining": "10 days"},
                "current_pratyantardasha": {"lord": "Mercury"},
            }
        }
        birth_chart = {"ascendant": {"zodiac_sign": "Aries"}}
        natal_strengths = {"Jupiter": 80.0, "Saturn": 70.0, "Mercury": 60.0}
        fp = dhe.compute_functional_planets("Aries")

        ctx = engine.extract_dasha_context(
            dasha_data=dasha_data,
            life_area="CAREER",
            chart_data=birth_chart,
            natal_strengths=natal_strengths,
            functional_planets=fp,
        )

        self.assertEqual(ctx.pratyantar, "Mercury")
        self.assertEqual(ctx.time_remaining, "10 days")
        self.assertTrue(0.0 <= ctx.strength <= 100.0)

    def test_confidence_gate_observational_when_no_activation_and_kp_no(self):
        dasha = DashaContext(
            mahadasha="Jupiter",
            antardasha="Saturn",
            pratyantar="Mercury",
            house=10,
            house_name="10th house",
            strength=70.0,
            time_remaining="",
            theme="",
        )
        transit = TransitTrigger(
            planet="Moon",
            planet_symbol="☽",
            aspect_type="Transit",
            aspect_degrees=0.0,
            target_point="House 12",
            urgency="Background",
            effect="",
        )
        nak = NakshatraContext(
            current_nakshatra="Chitra",
            pada=1,
            nakshatra_lord="Mars",
            deity="Tvashtar",
            tarabala=2,
            tarabala_name="Sampat",
            tarabala_strength=55.0,
            theme="",
        )
        activation = ActivationTrace(activated=False, reasons=["No activation"], triggers={})
        kp = KPConfirmation(confirmed=False, potential="NO", reason="Not confirmed", favorable_houses=[])

        conf = dhe._compute_confidence(dasha, transit, nak, activation, kp)
        self.assertEqual(conf.band, "OBSERVATIONAL")
        self.assertLess(conf.score, 60.0)

    def test_repetition_flags_and_reduces_confidence(self):
        original_life_areas = dhe.LIFE_AREAS
        dhe.LIFE_AREAS = {
            "CAREER": {
                "icon": "",
                "houses": [10, 6, 1],
                "planets": ["Sun", "Saturn", "Jupiter", "Mars"],
                "dasha_focus": "",
                "insight_template": "{house_name}",
            }
        }
        try:
            class FixedEngine(DailyHoroscopeEngine):
                def extract_dasha_context(self, *args, **kwargs):
                    return DashaContext(
                        mahadasha="Jupiter",
                        antardasha="Saturn",
                        pratyantar="Mercury",
                        house=10,
                        house_name="10th house",
                        strength=80.0,
                        time_remaining="",
                        theme="",
                    )

                def extract_transit_trigger(self, *args, **kwargs):
                    return TransitTrigger(
                        planet="Moon",
                        planet_symbol="☽",
                        aspect_type="Conjunction",
                        aspect_degrees=2.0,
                        target_point="Moon",
                        urgency="Peak",
                        effect="Moon Conjunction Moon",
                    )

                def extract_nakshatra_context(self, *args, **kwargs):
                    return NakshatraContext(
                        current_nakshatra="Chitra",
                        pada=1,
                        nakshatra_lord="Mars",
                        deity="Tvashtar",
                        tarabala=2,
                        tarabala_name="Sampat",
                        tarabala_strength=70.0,
                        theme="",
                    )

                def generate_optimal_action(self, *args, **kwargs):
                    return dhe.OptimalAction(action="", timing="", hora="", reason="", cta_buttons=[])

                def synthesize_with_ai(self, *args, **kwargs):
                    return "Test synthesis."

            engine = FixedEngine(ai_provider="Gemini")
            natal_chart = {
                "name": "Test",
                "ascendant": {"zodiac_sign": "Aries", "longitude": 0.0},
                "planets": [{"name": "Moon", "longitude": 10.0, "house": 1, "zodiac_sign": "Aries"}],
            }

            now = datetime.datetime(2026, 2, 7, 10, 0, 0)
            dasha_data = {
                "summary": {
                    "current_mahadasha": {"lord": "Jupiter"},
                    "current_antardasha": {"lord": "Saturn"},
                    "current_pratyantardasha": {"lord": "Mercury"},
                }
            }
            current_transits = {"Moon": 10.0}

            first = engine.generate_daily_horoscopes(
                birth_chart=natal_chart,
                dasha_data=dasha_data,
                current_transits=current_transits,
                current_moon_longitude=10.0,
                current_time=now,
                latitude=0.0,
                longitude=0.0,
                period="daily",
                natal_strengths={"Jupiter": 80.0, "Saturn": 80.0, "Mercury": 80.0},
                kp_context=None,
                recent_signatures_by_area=None,
            )
            sig = first.horoscopes[0].evidence["signature"]

            second = engine.generate_daily_horoscopes(
                birth_chart=natal_chart,
                dasha_data=dasha_data,
                current_transits=current_transits,
                current_moon_longitude=10.0,
                current_time=now,
                latitude=0.0,
                longitude=0.0,
                period="daily",
                natal_strengths={"Jupiter": 80.0, "Saturn": 80.0, "Mercury": 80.0},
                kp_context=None,
                recent_signatures_by_area={"CAREER": [sig]},
            )

            rep = second.horoscopes[0].evidence["repetition"]
            self.assertTrue(rep["repeated"])
            self.assertLess(second.horoscopes[0].confidence.score, first.horoscopes[0].confidence.score)
        finally:
            dhe.LIFE_AREAS = original_life_areas
