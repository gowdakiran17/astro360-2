# Astro360 - Comprehensive Technical Documentation

## Overview

Astro360 is a full-stack Vedic astrology application that provides:
- Birth chart calculations and analysis
- Vimshottari Dasha (planetary period) calculations
- Period analysis with daily favorability scores
- AI-powered astrological insights
- Compatibility matching (Ashtakoot)
- Life predictions and timing analysis
- KP (Krishnamurti Paddhati) astrology
- Vastu guidance
- Numerology analysis
- Business/Financial astrology

## Architecture

### Tech Stack

**Backend:**
- Python 3.11
- FastAPI (async web framework)
- SQLAlchemy (ORM)
- SQLite (database)
- pyswisseph (Swiss Ephemeris for astrological calculations)
- uvicorn (ASGI server)

**Frontend:**
- React 18 with TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Recharts (charts/graphs)
- React Router v6

**External APIs:**
- VedAstro API (https://vedastro.org) - Vedic astrology calculations
- Google Gemini (optional - AI predictions)
- OpenAI (optional - AI chat)

---

## Project Structure

```
astro_app/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── database.py             # SQLAlchemy database configuration
│   ├── models.py               # SQLAlchemy ORM models
│   ├── schemas.py              # Pydantic request/response schemas
│   │
│   ├── auth/                   # Authentication module
│   │   └── router.py           # Login, register, JWT tokens
│   │
│   ├── astrology/              # Core astrology calculation modules
│   │   ├── chart.py            # Birth chart (D1) calculations
│   │   ├── dasha.py            # Vimshottari Mahadasha calculations
│   │   ├── divisional.py       # Divisional chart calculations (D1-D60)
│   │   ├── ashtakvarga.py      # Ashtakvarga strength calculations
│   │   ├── shadbala.py         # Shadbala (6-fold strength)
│   │   ├── muhurata.py         # Muhurata/electional timing
│   │   ├── matching.py         # Compatibility/Ashtakoot matching
│   │   ├── numerology.py       # Numerology calculations
│   │   ├── shadow_planets.py   # Upagrahas (shadow planets)
│   │   ├── sade_sati.py        # Sade Sati analysis
│   │   ├── basics.py           # Basic chart details
│   │   ├── avasthas.py         # Planetary states (Avasthas)
│   │   │
│   │   ├── period_analysis/    # Period/timing analysis module
│   │   │   ├── core.py         # AstroCalculate class
│   │   │   ├── orchestrator.py # Main analysis orchestrator
│   │   │   ├── life_predictor.py # Life prediction engine
│   │   │   ├── modern_scoring.py # Modern scoring algorithms
│   │   │   ├── events.py       # Event detection
│   │   │   └── ...             # Various event calculators
│   │   │
│   │   └── kp/                 # KP Astrology module
│   │       ├── kp_core.py      # KP calculations
│   │       ├── kp_predictions.py
│   │       └── ...
│   │
│   ├── routers/                # API route handlers
│   │   ├── calculations.py     # Chart/dasha/period endpoints
│   │   ├── matching.py         # Compatibility endpoints
│   │   ├── panchang.py         # Daily panchang endpoints
│   │   ├── tools.py            # Utility tools endpoints
│   │   ├── ai_insight.py       # AI chat endpoints
│   │   ├── business.py         # Financial astrology
│   │   ├── vastu.py            # Vastu guidance
│   │   ├── kp_router.py        # KP astrology endpoints
│   │   └── ...
│   │
│   ├── services/               # External service integrations
│   │   ├── vedastro_client.py  # VedAstro AI Chat client
│   │   ├── vedastro_predictor.py # VedAstro prediction client
│   │   ├── ai_formatter.py     # AI response formatting
│   │   └── ai_predictions.py   # Gemini AI predictions
│   │
│   └── monetization/           # Access control/subscription
│       └── access_control.py   # Feature access verification
│
└── frontend/
    ├── src/
    │   ├── pages/              # Page components
    │   ├── components/         # Reusable UI components
    │   ├── context/            # React contexts (Auth, Chart)
    │   ├── services/           # API client services
    │   └── utils/              # Utility functions
    ├── vite.config.ts          # Vite configuration
    └── package.json
```

---

## VedAstro API Integration

### Base URL
```
https://api.vedastro.org/api
```

### Working Endpoints (Confirmed)

#### 1. Chart Generation
```
GET /Calculate/SouthIndianChart/Location/{location}/Time/{time}/ChartType/{type}/Ayanamsa/{ayanamsa}
```

Example:
```
https://api.vedastro.org/api/Calculate/SouthIndianChart/Location/Malur,Karnataka,India/Time/05:06/17/04/1990/+05:30/ChartType/RasiD1/Ayanamsa/LAHIRI
```

#### 2. Horoscope Predictions
```
GET /Calculate/HoroscopePredictions?Location={lon},{lat}&Time={time}&Ayanamsa=LAHIRI
```

#### 3. Planet Positions
```
GET /Calculate/PlanetPositions?Location={lon},{lat}&Time={time}
```

#### 4. Dasha Calculations
```
GET /Calculate/VimshottariDasha?Location={lon},{lat}&BirthTime={time}&Time={currentTime}
```

### Non-Working Endpoints (404)

The following endpoints from the original implementation are **not available** in the public API:

- `/api/AIChat` - AI Chat endpoint
- `/api/BirthDataSubmission` - Birth data submission
- `/api/AskAITeacher` - AI Teacher endpoint

**Note:** These endpoints may be available only with VedAstro subscription or may have been deprecated.

### VedAstro Client Files

| File | Purpose |
|------|---------|
| `vedastro_client.py` | AI Chat integration (currently unavailable) |
| `vedastro_predictor.py` | Prediction and chart data from VedAstro |

### Fallback Behavior (Implemented)

When VedAstro AI endpoints are unavailable (404 or network errors), the application:
1. Checks HTTP 404 responses explicitly
2. Returns a user-friendly fallback message: "VedAstro AI Chat service is currently unavailable. Please try again later or use the local calculation features."
3. Falls back to local calculation engines using `pyswisseph` for all astronomical calculations
4. Handles network exceptions gracefully without exposing raw error details

All VedAstro client methods (`submit_birth_data`, `ask_ai_chat`, `ask_ai_teacher`, `get_horary_suggestions`) implement this fallback pattern.

---

## API Reference

### Authentication Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user info |

### Chart Calculation Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/chart/birth` | Calculate birth chart (D1) |
| POST | `/api/chart/dasha` | Get Vimshottari Dasha |
| POST | `/api/chart/divisional` | Get divisional charts |
| POST | `/api/chart/shodashvarga` | Get all 16 vargas |
| POST | `/api/chart/ashtakvarga` | Get Ashtakvarga strength |
| POST | `/api/chart/shadbala` | Get Shadbala strength |
| POST | `/api/chart/basics` | Get basic chart details |
| POST | `/api/chart/transits` | Get current transits |
| POST | `/api/chart/shadow-planets` | Get Upagrahas |
| POST | `/api/chart/muhurata` | Get Muhurata data |
| POST | `/api/chart/sade-sati` | Get Sade Sati analysis |

### Period Analysis Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/chart/period-analysis` | Monthly period analysis |
| POST | `/api/chart/period/overview` | Dashboard overview |
| POST | `/api/chart/period/month` | Day-by-day month analysis |
| POST | `/api/chart/period/life-timeline` | Multi-year life timeline |
| POST | `/api/chart/period/predictions` | VedAstro life predictions |
| POST | `/api/chart/life-predictor` | Advanced life predictor |

### Matching Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/match/ashtakoot` | Ashtakoot matching |
| POST | `/api/match/compatibility` | Full compatibility analysis |
| POST | `/api/match/business` | Business compatibility |

### AI Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/ai/chat` | AI astrology chat |
| POST | `/api/ai/horary-suggestions` | Horary question suggestions |

### Panchang Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/chart/panchang` | Get panchang for date |
| POST | `/api/chart/live-panchang` | Get live panchang |

### KP Astrology Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/kp/chart` | KP chart calculation |
| POST | `/api/kp/dasha-timeline` | KP dasha timeline |
| POST | `/api/kp/precision-scores` | KP precision scores |
| POST | `/api/kp/detailed-predictions` | KP predictions |
| POST | `/api/kp/complete-report` | Full KP report |

### Vastu Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/vastu/guidance` | Vastu guidance |
| POST | `/api/vastu/remedies` | Vastu remedies |
| POST | `/api/vastu/analysis` | Vastu analysis |

### Business/Finance Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/business/financial-profile` | Financial astrology profile |
| GET | `/api/business/market-timing` | Market timing analysis |
| GET | `/api/business/crypto-signals` | Crypto signals |
| POST | `/api/business/asset-analysis` | Asset analysis |

---

## Request/Response Schemas

### BirthDetails (Common Request)
```json
{
  "date": "DD/MM/YYYY",
  "time": "HH:MM",
  "timezone": "+HH:MM",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

### Chart Response (Example)
```json
{
  "ascendant": {
    "longitude": 45.23,
    "sign": "Taurus",
    "zodiac_sign": "Taurus",
    "degree": 15.23
  },
  "planets": [
    {
      "name": "Sun",
      "longitude": 23.45,
      "sign": "Aries",
      "house": 12,
      "nakshatra": "Ashwini",
      "pada": 2,
      "retrograde": false
    }
  ]
}
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET_KEY` | Yes | Secret key for JWT tokens |
| `GEMINI_API_KEY` | No | Google Gemini API key for AI predictions |
| `OPENAI_API_KEY` | No | OpenAI API key for AI chat |
| `VEDASTRO_API_KEY` | No | VedAstro API key (if using paid tier) |
| `ASTROLOGY_API_IO_KEY` | No | External astrology API key |

---

## Known Issues & Limitations

### VedAstro API
1. **AI Chat endpoints unavailable** - `/api/AIChat` and `/api/BirthDataSubmission` return 404
2. **Calculate endpoints work** - Chart generation and horoscope predictions function correctly

### LSP Warnings (Non-Critical)
The following LSP warnings appear but don't affect runtime:
- Import resolution warnings for `fastapi`, `uvicorn`, `swisseph` (packages exist but pyright can't resolve)

### Pydantic Warnings
- `orm_mode` deprecated - should be renamed to `from_attributes` in Pydantic v2

---

## Running the Application

### Development Mode

**Backend:**
```bash
cd /home/runner/workspace
python -m uvicorn astro_app.backend.main:app --host localhost --port 8000 --reload
```

**Frontend:**
```bash
cd astro_app/frontend
npm run dev
```

### Production Deployment

The application is configured for Replit Autoscale deployment:
- Build: `cd astro_app/frontend && npm install && npm run build`
- Run: `python -m uvicorn astro_app.backend.main:app --host 0.0.0.0 --port 5000`

---

## File Review Checklist

### Core Files (Priority 1)
- [x] `astro_app/backend/main.py` - Application entry, routers mounted
- [x] `astro_app/backend/schemas.py` - All request/response schemas
- [x] `astro_app/backend/routers/calculations.py` - Main chart endpoints
- [x] `astro_app/backend/services/vedastro_client.py` - VedAstro AI integration
- [x] `astro_app/backend/services/vedastro_predictor.py` - VedAstro predictions

### Astrology Engines (Priority 2)
- [x] `astro_app/backend/astrology/chart.py` - Birth chart calculations
- [x] `astro_app/backend/astrology/dasha.py` - Dasha calculations
- [x] `astro_app/backend/astrology/period_analysis/core.py` - Core calculations
- [x] `astro_app/backend/astrology/period_analysis/life_predictor.py` - Life predictions
- [x] `astro_app/backend/astrology/period_analysis/orchestrator.py` - Analysis orchestrator

### Frontend (Priority 3)
- [x] `astro_app/frontend/vite.config.ts` - Build configuration
- [x] `astro_app/frontend/src/pages/` - Page components
- [x] `astro_app/frontend/src/services/` - API clients

---

## Changelog

### 2026-02-01
- Fixed LSP errors in `calculations.py`, `vedastro_predictor.py`, `life_predictor.py`
- Added `jd_to_datetime` method to `AstroCalculate` class
- Fixed `LifePredictorEngine` parameter type mismatch
- Updated Vite config for Replit domain patterns
- Added VedAstro API fallback handling
- Created comprehensive documentation
