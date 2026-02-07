## Goal
Replace the current “daily horoscope” generation with a **logic-first Vedic + KP daily decision support engine** that:
- Runs the full mandatory pipeline you specified (birth → functional planets → MD/AD/PD → transits → activation → weighting → modifiers → micro-timing → per-area isolation → KP confirm → confidence gate → neutral-day → repetition control)
- Produces **non-random, traceable outputs** and downgrades certainty when logic is weak
- Uses **only ephemeris/engines already in the codebase** for positions (Swiss Ephemeris via `calculate_chart`), never LLM “math”

## Current Gaps (what we will fix)
- [daily_horoscope_engine.py](file:///Users/kiran/Desktop/astro360-2/astro_app/backend/services/daily_horoscope_engine.py) uses templates, hash-jitter, and western-style aspects; it does not enforce PD, house priority weighting, KP confirmation, or traceable activation rules.
- [guidance.ts](file:///Users/kiran/Desktop/astro360-2/astro_app/frontend/src/services/guidance.ts) still derives multiple user-facing values via seeded randomness (and includes tarot/affirmation-style extras), which violates the “no random/generic guidance” requirement.

## Architecture Changes
### 1) Introduce a “Logic Trace” schema (auditable output)
Add structured fields to the daily response so every sentence can be traced:
- `logic_trace.natal`: lagna, moon sign, nakshatra+pada, house ownership, dignity, shadbala summary, KP cusps + sublords
- `logic_trace.dasha`: MD/AD/PD lords + their strength, houses activated, and why
- `logic_trace.transits`: Moon transit + slow planets + only relevant fast transits (per your gating rules)
- `logic_trace.activation`: explicit YES/NO activation checks per life area
- `logic_trace.kp_confirmation`: YES/NO + cusp/sub-lord significator evidence
- `confidence`: numeric + band (above 80 / 60–80 / below 60)
- `neutral_day`: boolean + reason

### 2) Replace the engine implementation (backend)
Refactor/replace the current `DailyHoroscopeEngine` with a new internal pipeline (kept behind the same endpoint for minimal UI churn, or exposed as a v2 endpoint with backward compatibility):
- **Birth Chart Engine (Static)**: use existing `calculate_chart` output + KP enrichment from `astro_app.backend.astrology.kp` and strength from `calculate_shadbala`.
- **Functional Planet Mapping**: compute functional benefic/malefic/yogakaraka based on ascendant and house ownership.
- **Dasha Engine (Primary Driver)**: use existing Vimshottari implementation that already supports deeper levels (MD/AD/PD) in [dasha.py](file:///Users/kiran/Desktop/astro360-2/astro_app/backend/astrology/dasha.py). Extract **current PD** and include it in `DashaContext`.
- **Transit Engine (Daily Trigger)**: prioritize Moon; always include Saturn/Jupiter/Rahu/Ketu; include fast planets only when they meet your trigger conditions.
- **Aspect & Activation Logic**: replace western aspect table with **Vedic drishti + conjunction + sign/house activation**, and explicitly test “no activation = no prediction”.
- **House Priority Weighting**: apply your HIGH/MED/LOW weighting when computing each life-area score.
- **Planetary State Modifiers**: incorporate retrograde (already computed), combustion (implement reusable combustion/orbs), planetary war (reuse Shadbala yuddha indicator), and avastha (existing Baladi/Jagradadi).
- **Time Sensitivity**: compute morning/afternoon/evening guidance using Moon degree movement + hora (already partially available) and link each timing suggestion to evidence.
- **Life-Area Isolation**: compute Career/Money/Relationships/Health/Emotional/Decisions independently; merge only into summary.
- **Validation & Cancellation**: apply strength validation + benefic protection rules + KP confirmation gate.
- **Confidence Gate**: output tone and certainty strictly from the computed confidence band.
- **Neutral Day Detection**: if no meaningful activation, output routine-focused guidance.
- **Memory/Repetition Control**: persist last N outputs per user+area (DB/kv) and reduce intensity/change focus if repetition detected.

### 3) AI layer becomes “interpretation only”
LLM will only:
- Rephrase the already-computed logic into calm, practical guidance
- Never invent events; it must cite the provided evidence keys
Fallback (when AI fails) will be deterministic and template-driven, but still **fully parameterized by computed evidence** (no randomness).

## Endpoint and Frontend Plan
### Backend API
- Update `POST /api/ai/daily-horoscopes` in [ai_insight.py](file:///Users/kiran/Desktop/astro360-2/astro_app/backend/routers/ai_insight.py) to return:
  - Existing fields for compatibility
  - New `logic_trace`, `confidence`, `neutral_day`, and `evidence_map`
- Ensure `period=weekly` uses the same pipeline but aggregates triggers across 7 days (Moon nakshatra/sign changes + slow-planet context) and produces week-safe language.

### Frontend
- Remove seeded-random derivations from [guidance.ts](file:///Users/kiran/Desktop/astro360-2/astro_app/frontend/src/services/guidance.ts) for anything presented as astrology.
- Make Today’s Guidance render purely from backend evidence-driven values.
- Move tarot/affirmations/remedies/lucky-elements into a clearly separated optional “Extras” module (or disable on Today’s Life Guidance page entirely).

## Testing & Verification
- Add/extend test scripts to verify:
  - Today vs Tomorrow differs due to Moon/nakshatra and/or activation changes
  - Weekly output uses week-safe logic and confidence gates
  - Neutral-day detection triggers correctly
  - KP confirmation downgrades outcomes when not confirmed
  - No response fields are generated from randomness
- Add backend unit tests for:
  - Functional planet mapping
  - Activation gating
  - Confidence scoring
  - Combustion + retrograde modifiers

## Delivery Steps (implementation order)
1) Add response schema support for `logic_trace`, `confidence`, `neutral_day`.
2) Implement functional planet mapping + PD extraction.
3) Implement Vedic activation engine (houses + drishti + gating).
4) Implement KP confirmation checks using existing KP modules.
5) Implement confidence gate + neutral-day detection.
6) Update frontend to remove seeded randomness and to display evidence-backed values.
7) Add repetition control storage and tests.

If you confirm, I will start by refactoring the backend engine first (so the frontend immediately gets real, traceable logic), then remove the remaining non-astrology/random pieces from the Today’s Guidance payload.