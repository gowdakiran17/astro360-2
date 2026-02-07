from pydantic import BaseModel
from typing import Any, Dict, List, Optional
from datetime import datetime

class ConfidenceGate(BaseModel):
    score: float  # 0-100
    band: str  # "CLEAR" | "SUGGESTIVE" | "OBSERVATIONAL"
    notes: List[str] = []


class ActivationTrace(BaseModel):
    activated: bool
    reasons: List[str] = []
    triggers: Dict[str, Any] = {}


class KPConfirmation(BaseModel):
    confirmed: bool
    potential: str  # "YES" | "NO"
    reason: str
    favorable_houses: List[int] = []


class LogicTrace(BaseModel):
    natal: Dict[str, Any] = {}
    functional_planets: Dict[str, Any] = {}
    dasha: Dict[str, Any] = {}
    transits: Dict[str, Any] = {}
    repetition: Dict[str, Any] = {}


class DashaContext(BaseModel):
    """Current Dasha period context for a life area"""
    mahadasha: str  # e.g., "Venus"
    antardasha: str  # e.g., "Mercury"
    pratyantar: Optional[str] = None  # e.g., "Jupiter"
    house: int  # Which house is activated (1-12)
    house_name: str  # e.g., "Career", "Wealth"
    strength: float  # Shadbala strength 0-100
    time_remaining: str  # e.g., "2 years 3 months"
    theme: str  # Brief description of what this Dasha activates

class TransitTrigger(BaseModel):
    """Current planetary transit affecting this life area"""
    planet: str  # e.g., "Jupiter"
    planet_symbol: str  # e.g., "♃"
    aspect_type: str  # e.g., "Trine", "Square", "Conjunction"
    aspect_degrees: float  # Exact degree of aspect
    target_point: str  # What it's aspecting: "MC", "7th Lord", "Ascendant"
    urgency: str  # "Peak today", "Building", "Waning"
    effect: str  # Brief description of the transit's effect

class NakshatraContext(BaseModel):
    """Current Nakshatra influence"""
    current_nakshatra: str  # e.g., "Magha"
    nakshatra_lord: str  # e.g., "Ketu"
    deity: str  # e.g., "Pitris"
    pada: int  # 1-4
    tarabala: int  # Star strength 1-9 (Janma, Sampat, etc.)
    tarabala_name: str  # e.g., "Sampat" (Wealth)
    tarabala_strength: float  # 0-100%
    theme: str  # Brief description of Nakshatra influence

class OptimalAction(BaseModel):
    """Recommended action with timing"""
    action: str  # e.g., "Schedule important meeting"
    timing: str  # e.g., "11:42 AM"
    hora: str  # e.g., "Jupiter Hora"
    reason: str  # Why this timing is optimal
    cta_buttons: List[dict]  # e.g., [{"label": "Set Alert", "action": "alert", "time": "11:42"}]

class HoroscopeCard(BaseModel):
    """Complete horoscope card for one life area"""
    life_area: str  # "CAREER", "RELATIONS", "WELLNESS", "BUSINESS", "WEALTH"
    icon: str  # Emoji icon
    favorability: float  # 0-100 score
    favorability_label: str  # "Excellent", "Favorable", "Moderate", "Challenging"
    
    dasha_context: DashaContext
    transit_trigger: TransitTrigger
    nakshatra_context: NakshatraContext
    
    synthesis: str  # AI-generated prediction (3-4 sentences)
    optimal_action: OptimalAction
    
    ai_confidence: float  # 0-100
    activation: Optional[ActivationTrace] = None
    kp_confirmation: Optional[KPConfirmation] = None
    confidence: Optional[ConfidenceGate] = None
    evidence: Dict[str, Any] = {}

class DailyHoroscopeResponse(BaseModel):
    """Complete daily horoscope response with all 5 life areas"""
    date: str  # "Tuesday, February 3, 2026"
    overall_theme: str  # AI-generated overall cosmic theme for the day
    power_mantra: str  # e.g., "Om Shanti"
    primary_focus: str  # e.g., "Growth"
    harmonic_color: str  # e.g., "Gold"
    optimal_direction: str  # e.g., "East"
    
    horoscopes: List[HoroscopeCard]  # 5 cards
    
    # Metadata
    birth_name: str
    ascendant: str
    moon_sign: str
    generated_at: datetime
    ai_provider: str  # "Gemini" or "Kimi"
    neutral_day: bool = False
    neutral_reason: Optional[str] = None
    confidence: Optional[ConfidenceGate] = None
    logic_trace: Optional[LogicTrace] = None
    evidence_map: Dict[str, Any] = {}
