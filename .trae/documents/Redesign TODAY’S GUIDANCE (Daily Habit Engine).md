## Goals
- Make TODAY’S GUIDANCE the daily habit loop: instant clarity (feel/do/avoid/when/focus), calm premium UI, minimal astrology jargon.
- Reuse existing backend engines/APIs for daily horoscope, Panchang, and “best time windows”.
- Keep it fast, offline-friendly (last viewed day), and PWA-native (pull-to-refresh, share).

## Competitive Pattern Takeaways (Applied)
- **Co–Star**: strong daily hook via “one headline + short cards”, blunt but memorable → we keep the “one theme” but shift tone to calm, practical.
- **The Pattern**: structured guidance that feels personal/therapeutic → we use “Decision Compass”, “Conversation Quality”, “Workplace Climate” with gentle, human copy.
- **Nebula/Sanctuary**: ritual + interaction (tarot/affirmations + reminders) → we add lightweight rituals and streaks, but keep astrology invisible by default.

## Data Sources (Backend Already Exists)
- Daily horoscope synthesis: POST `/api/ai/daily-horoscopes` → [ai_insight.py](file:///Users/kiran/Desktop/astro360-2/astro_app/backend/routers/ai_insight.py#L710-L822), models in [horoscope_models.py](file:///Users/kiran/Desktop/astro360-2/astro_app/backend/horoscope_models.py).
- Panchang line: POST `/api/chart/panchang` and/or `/api/chart/live-panchang` → [panchang.py](file:///Users/kiran/Desktop/astro360-2/astro_app/backend/routers/panchang.py).
- Best time windows: POST `/api/chart/planner/moments` (+ optional `/api/chart/muhurata`) → [panchang.py](file:///Users/kiran/Desktop/astro360-2/astro_app/backend/routers/panchang.py#L68-L131).

## IA / Component Hierarchy (Production-Ready)
We refactor the existing page [TodaysGuidance.tsx](file:///Users/kiran/Desktop/astro360-2/astro_app/frontend/src/pages/TodaysGuidance.tsx) into a composed system:

- `pages/TodaysGuidance.tsx`
  - `components/guidance/today/StickyTodayHeader.tsx` (A)
  - `components/guidance/today/QuickGlanceRail.tsx` (B)
  - `components/guidance/today/GuidanceHeroCard.tsx` (C)
  - `components/guidance/today/LifeGuidanceAccordion.tsx` (D)
  - `components/guidance/today/DecisionCompassCard.tsx` (E)
  - `components/guidance/today/EnergyManagementCard.tsx` (F)
  - `components/guidance/today/RotatingCards.tsx` (O)
    - `ConversationQualityCard.tsx` (G)
    - `WorkplaceClimateCard.tsx` (H)
    - `MoneyMoodCard.tsx` (I)
    - `EmotionalWeatherCard.tsx` (J)
    - `OnePowerfulActionCard.tsx` (L)
    - `PersonalInsightCard.tsx` (N)
  - `components/guidance/today/TodayMistakeInline.tsx` (K)
  - `components/guidance/today/TomorrowHintCard.tsx` (M)

Shared utilities:
- `services/guidance.ts` (API orchestration + caching)
- `utils/guidance/rotation.ts` (deterministic rotation)
- `utils/guidance/copy.ts` (calm human copy templates + “no fear” wording)
- `utils/guidance/metrics.ts` (lightweight engagement metrics)

## UI Spec Mapped to Your Requirements
### A) Sticky Header (Always Visible)
- Sticky top area inside [MainLayout.tsx](file:///Users/kiran/Desktop/astro360-2/astro_app/frontend/src/components/layout/MainLayout.tsx) (dark cosmic background already matches).
- Contents: weekday/date, “Paksha • Nakshatra” line, moon phase icon, greeting (morning/afternoon/evening), streak counter with subtle animated flame, pull-to-refresh affordance.
- Pull-to-refresh: custom hook listening for touch drag when scrollTop=0, animating a slim progress pill.

### B) Quick Glance Metrics (Horizontal snap)
- Snap-scroll mini cards: Mood, Energy %, Career, Money, Relationships, Health.
- Each shows icon + label + state chip (Favorable/Sensitive/Caution) with green/yellow/red glow.
- Tap scrolls to/expands the matching row in “Today’s Life Guidance”.

### C) Main Guidance Hero
- “YOUR GUIDANCE FOR TODAY” hero card with:
  - One headline theme (from `overall_theme` but rewritten with calm copy)
  - 2–3 short paragraphs (plain language)
  - Best time window (from `/planner/moments`), One avoid, One primary focus.
  - Actions: Save (offline), Share as image card.
- Share-as-image: use a small DOM-to-image utility (planned dependency) + Web Share API when available.

### D) Today’s Life Guidance (Core)
- Unified expandable rows:
  - Career & Work, Wealth & Money, Relationships, Health & Energy, Decisions & Communication.
- Collapsed row shows: status + mini color rail + one-line focus.
- Expanded: tone, 2–3 practical lines, best time, good-for (2 bullets), avoid (2 bullets), one-line focus.
- CTA: “Ask AI about this today” routes into existing AI chat entry (e.g. `/ai-astrologer?topic=career&mode=today`).

### E) Today’s Decision Compass
- Single-glance matrix:
  - Overall: Proceed / Proceed Carefully / Delay / Avoid
  - Small decisions: Yes/No
  - Big commitments: Yes/Delay/Avoid
  - Emotional decisions: Yes/Avoid
  - Best time window.

### F) Energy Management
- Morning/Afternoon/Evening energy levels + human day-planning advice (heavy work/calls/rest).

### G–N) Rotating Cards
- Always show: Life Guidance + Decision Compass + Energy Management.
- Rotate 2–3 daily from: Conversation Quality, Workplace Climate, Money Mood, Emotional Weather, One Powerful Action, Personal Insight.
- Always include:
  - K) “Today’s Common Mistake” as a one-line memorable caution
  - M) “Tomorrow’s Hint” teaser (1–2 lines)

## Rotation Logic (O)
- Deterministic per user + date: `seed = profileId + YYYY-MM-DD`.
- Select exactly 2–3 rotating cards, with simple rules:
  - If mood logged as “Rough”, prioritize Emotional Weather + Conversation Quality.
  - If user expanded Money or Career sections yesterday, prioritize Money Mood or Workplace Climate.
- Store “shown today” in localStorage so refresh doesn’t reshuffle.

## Offline + Performance
- Cache the full “Today payload” per-profile per-day:
  - `guidance_cache:{profileId}:{YYYY-MM-DD}`
  - Keep last 7 days; show offline banner if fetch fails.
- Skeleton loading states; avoid heavy images; prefer subtle gradients + SVG icons.
- Respect existing PWA setup (vite-plugin-pwa) and keep assets local.

## Engagement Metrics (Local-first)
Since no analytics SDK exists in the frontend today, we implement a local telemetry layer:
- Track: page_view, pull_to_refresh, expand_row, quick_metric_tap, save, share, time_spent.
- Store in localStorage as a small rolling buffer; optionally POST later if you add a backend metrics endpoint.

## CMS for Daily Updates (Content Layer)
- Add a “copy override” layer:
  - Frontend: `copy.ts` templates and tone rules.
  - Backend (optional next): `/api/content/daily-guidance/{date}` returning curated theme copy + “one powerful action” + “mistake to avoid”.
- UI always renders even if overrides are absent (falls back to AI/engine output).

## Build  Verification
- Typecheck/build passes (`npm run build`).
- Confirm route wiring from the Hub card [Hub.tsx](file:///Users/kiran/Desktop/astro360-2/astro_app/frontend/src/pages/Hub.tsx) to `/daily/guidance`.
- Manual QA checklist: sticky header, snap cards, accordion expand, refresh, offline reload, share fallback.

## Extra New Ideas (Post-MVP)
- “2-minute Ritual”: a guided micro routine (breath + one journaling prompt) that adapts to today’s theme.
- “Smart Reminder”: notification copy changes based on missed streak reason (“gentle nudge”, not guilt).
- “Confidence Slider”: user rates how accurate today felt → improves personalization.
- “Calendar Hook”: one-tap add “Best time window” to calendar.