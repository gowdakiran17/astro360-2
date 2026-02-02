# Astro360 - Astrology Application

## Overview
Astro360 is a comprehensive astrology application with a React/TypeScript frontend and Python FastAPI backend. It provides astrological charts, predictions, matchmaking, and AI-powered insights.

## Project Structure
```
astro_app/
├── frontend/           # React + TypeScript + Vite frontend
│   ├── src/           # Source code
│   └── package.json   # Frontend dependencies
├── backend/           # FastAPI Python backend
│   ├── main.py        # Main FastAPI application
│   ├── routers/       # API route handlers
│   ├── astrology/     # Astrology calculation modules
│   ├── auth/          # Authentication system
│   └── models.py      # Database models
└── design_assets/     # Design resources
```

## Running the Application

### Frontend (Port 5000)
```bash
cd astro_app/frontend && npm run dev
```
- Runs on port 5000 with Vite dev server
- Proxies API requests to backend on port 8000

### Backend (Port 8000)
```bash
python -m uvicorn astro_app.backend.main:app --host localhost --port 8000 --reload
```

## Key Technologies
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, React Router
- **Backend**: FastAPI, SQLAlchemy, Python-Jose (JWT auth), pyswisseph (ephemeris)
- **Database**: SQLite (astro_app.db)

## Features
- Birth chart calculations
- Vimshottari Dasha system
- KP Astrology
- Ashtakoot matching
- Vastu analysis
- AI-powered insights (requires API keys)
- Period analysis and predictions

## Environment Variables
The backend may require:
- `OPENAI_API_KEY` - For AI insights
- `GEMINI_API_KEY` - For Google AI integration
- `ASTROLOGY_API_IO_KEY` - For external astrology API

## Recent Changes
- February 2026: Comprehensive Gemini AI Integration
  - **Replit AI Integrations**: Switched to Replit's built-in Gemini AI (gemini-2.5-flash model)
  - **AstrologerConsultation Component**: Full AI-powered birth chart reading like a professional astrologer explaining to a client
  - **Comprehensive Reading API**: POST /api/ai/comprehensive-reading endpoint with structured JSON response
  - **8 Life Sections**: Cosmic Identity, Life Mission, Wealth Patterns, Relationships, Health Patterns, Current Period, Sacred Guidance, and personalized Closing
  - **Robust JSON Parsing**: Handles various AI response formats with fallback to rule-based readings
  - **Field Mapping Fixes**: Components now correctly use `zodiac_sign` and handle nakshatra as string/object
  - All components (QuickReferenceData, NakshatraIntelligenceCenter, LifeDomainsAdvanced) updated with helper functions for data extraction
- February 2026: Advanced Professional Astrology Features
  - **QuickReferenceData**: South Indian D1 chart visualization, Moon Nakshatra details (deity, symbol, quality, pada), Chart Details (Lagna, Moon Sign, Sun Sign, Tithi, Yoga, Karana, sunrise/sunset)
  - **NakshatraIntelligenceCenter**: Deep psychological and karmic analysis with three nakshatra cards (Moon/Psychological Core, Sun/Soul Purpose, Lagna/Surface) plus Life Purpose, Quality, and Description
  - **LifeDomainsAdvanced**: Tabbed interface (Career & Finance, Relationships, Health & Wellness, Spiritual Growth) with Professional Trajectory, momentum/financial/gains scores based on planetary dignity, house analysis with strength calculations, and domain karakas
  - Deterministic score calculations based on actual chart data (planet retrograde, dignity status)
  - AI prediction key mapping fix (relationships -> love)
  - Integrated panchangData for sunrise/sunset display
  - All 27 nakshatras with complete data (deity, symbol, quality, ruling planet, power/shakti, life purpose, core traits)
- February 2026: Professional Astrologer-style Home page redesign
  - Created ProAstrologerHome component with detailed Vedic astrology predictions
  - **Cosmic Identity Section**: Shows Ascendant, Sun, Moon, Mars with zodiac symbols and degrees
  - **Vimshottari Dasha Analysis**: Current Mahadasha/Antardasha with detailed interpretations
  - **Today's Cosmic Forecast**: Score-based daily predictions with quality breakdown
  - **Life Areas Analysis**: AI-powered predictions for career, love, health, wealth, spiritual
  - **Remedies & Recommendations**: Based on current planetary period
  - Fixed data flow bug where AI predictions used stale dasha data
  - Added proper error handling with fallback UI states
  - Beautiful professional cosmic theme with golden/amber gradients
- February 2026: Previous Home page with CosmicHero and AIQuickInsights (superseded)
  - Added backend AI service using OpenAI for generating personalized insights
  - Added POST /api/ai/daily-insight and POST /api/ai/quick-predictions endpoints
  - Robust error handling with fallback data to prevent crashes
- February 2026: Configured for Replit environment with port 5000 for frontend
- Fixed import path issues in period_analysis modules
- Added missing schema definitions (StrengthRequest, KPRequest, etc.)
- Fixed VedAstro API integration with graceful fallback for unavailable AI Chat endpoints
- Added jd_to_datetime method to AstroCalculate class
- Fixed LifePredictorEngine parameter type mismatch
- Created comprehensive DOCUMENTATION.md with API reference and VedAstro integration guide
- All VedAstro client methods now handle 404 and network errors gracefully
