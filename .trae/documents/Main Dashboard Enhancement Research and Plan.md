## Executive Summary
- Goal: Create a best‑in‑class Main Dashboard with fast comprehension, actionable insights, and seamless flows across web and mobile.
- Approach: Modular, role‑personalized widgets; minimalist data viz; embedded collaboration; AI‑assisted guidance; mobile‑first layout.

## Competitor & Trend Analysis
- SaaS dashboards library: Modular cards, strong info hierarchy, conversion‑aware layouts [SaaSFrame, 2025][1].
- 2025 trends: AI‑powered personalization, minimalist viz, widget‑based customization, dark mode, embedded collaboration, mobile‑first adaptive design [Uitop][2].
- Templates landscape: mobile‑first, RTL/dark themes, performance techniques (lazy loading, code splitting), WCAG compliance, integrations [BootstrapDash][3].
- Design process for B2B dashboards: align KPIs to user/business goals, role‑based views, drill‑downs, validate flows early [UX Collective][4].
- Onboarding dashboards: empty states that invite action, contextual next steps, time‑to‑value acceleration [Procreator][5].

[1] https://www.saasframe.io/categories/dashboard
[2] https://uitop.design/blog/design/top-dashboard-design-trends/
[3] https://www.bootstrapdash.com/blog/saas-dashboard-templates
[4] https://uxdesign.cc/design-thoughtful-dashboards-for-b2b-saas-ff484385960d
[5] https://procreator.design/blog/saas-dashboards-that-nail-user-onboarding/

## Current App Observations (read‑only)
- Core sections: CosmicHero (welcome + daily context), DailyHoroscopes, CosmicConsultation (AI synthesis), PlanetaryStatus, QuickReferenceData, Nakshatra intelligence.
- Mobile header recently unified (BrandLogo), DailyHoroscopes redesigned to stacked cards.
- Rule added to hide AI Insights when DailyHoroscopes exists (reduce redundancy).

## Requirements — Dashboard Components
- Overview KPIs: 4–6 tiles (Today’s score, Trend vs last period, Alerts count, Tasks due). Micro‑viz (sparklines, progress rings).
- Trend Panels: Area/line charts for daily/weekly; comparison selectors (time range, cohorts, segments).
- Real‑Time Visualizations: Live event stream (WebSocket); status bars (uptime, latency, queue depth).
- Customizable Layout:
  - Drag‑and‑drop grid (save/load layouts per role/user).
  - Widget library: KPI Tile, Trend Chart, Funnel, Table, Annotation, AI Insight, Notification Feed.
- Quick Actions Bar: 3–5 CTAs (Create report, Ask AI, Set alert, Share); keyboard shortcut hints.
- Notification Center:
  - Inbox drawer (grouping, severity badges, snooze, mark as read), toast system.
  - Alert rules (time window, thresholds); tie to Set Alert buttons.
- Performance Metrics: Client timing, API latency, cache hit, error rate; colored thresholds.
- Filters & Context: Global date picker, profile selector, segment chips; persists to widgets.
- Search/Command Palette: fuzzy search + actions (jump to page, run query, open widget).
- Collaboration Hooks: shareable views, comments/notes panel on widgets, export (PNG/CSV).
- AI Assistance: contextual summaries per widget, follow‑ups, “Explain this trend”.

## UX Patterns & Interaction Flows
- Role‑personalization: detect role/profile to prioritize relevant KPIs and widgets [2,4].
- Minimalist viz: one story per chart; micro‑visualizations beside KPIs [2].
- Progressive disclosure: tiers — Overview → Focus panel → Drill‑down.
- Empty‑state onboarding: guided defaults, sample data, “Next best action” chips [5].
- Journeys:
  - First‑time: Welcome → guided layout with sample data → pick profile → complete 1 task.
  - Daily check‑in: Overview KPIs → trend deltas → alerts → quick actions.
  - Alert‑to‑action: toast → open feed → review → run fix/ask AI → set follow‑up.
  - Customize: enter edit → add/reorder widgets → save layout → share.
  - Drill‑down: click KPI → focus card → chart → filters → export.

## Information Architecture
- Header: BrandLogo, search/command, filters, notifications.
- Overview Row: KPI tiles with sparklines and deltas.
- Main Grid: 2–3 columns desktop; single column mobile; cards snap to grid.
- Side Drawer (optional): Notifications/Comments; collapsible on mobile.
- Footer Status: data freshness, API health.

## Visual & Responsive Specs
- Breakpoints: mobile ≤640px; tablet 641–1024px; desktop ≥1025px.
- Touch targets ≥44px, 12–16px base text, 16–24px headings.
- Charts: reduce series for mobile; truncate labels; toggle legends; vertical scroll for tables.
- Theme: dark default, light optional; 1–2 accent colors (blue/emerald), status (red/amber/green).

## Accessibility (WCAG 2.2 AA)
- Color contrast ≥4.5:1; focus outlines; skip‑to‑content; keyboard nav.
- ARIA live for notifications; chart alt summaries; tab orders in edit mode.
- Motion reduce: prefer opacity/transform, respect prefers‑reduced‑motion.

## Loading, Errors, States
- Skeletons & shimmer in tiles/charts; optimistic UI for quick actions.
- Error cards: concise message, retry, diagnostics link.
- Empty‑state prompts: “Connect data”, “Add widget”, sample data toggle.

## Technical Recommendations (non‑binding)
- Layout: react‑grid‑layout or Gridstack; persistence via user settings API.
- Data: React Query/SWR; WebSocket (Socket.IO) or SSE for live tiles.
- Viz: Recharts/ECharts; micro‑viz components (sparkline, ring, mini bar).
- Notifications: inbox model + toast bus; alert rule engine on backend.
- Performance: code splitting, virtualization, memoized selectors.
- Analytics: page/view timing, click‑through on CTAs, alert resolution time.

## Prioritized Feature List
- P0 — Foundation (High impact, Medium complexity):
  - Overview KPI row (S; Impact 5; Feasibility High)
  - Global filters & profiles (M; Impact 5; Feasibility High)
  - Notification center (M; Impact 4; Feasibility Medium)
  - Command palette/search (M; Impact 4; Feasibility Medium)
- P1 — Widgets & Trends:
  - Trend charts w/ segments (M; Impact 4; Feasibility High)
  - Performance metrics panel (M; Impact 4; Feasibility High)
  - Quick actions bar (S; Impact 3; Feasibility High)
- P2 — Customization:
  - Drag‑and‑drop layout save/share (L; Impact 5; Feasibility Medium)
  - Widget library & add flow (M; Impact 4; Feasibility Medium)
- P3 — AI & Collaboration:
  - Contextual AI summaries (M; Impact 4; Feasibility Medium)
  - Comments/notes per widget (M; Impact 3; Feasibility Medium)
- P4 — Real‑Time & Polish:
  - Live tiles via WebSocket (M; Impact 4; Feasibility Medium)
  - Dark/light theme switch (S; Impact 3; Feasibility High)

## Phased Roadmap
- Phase 1: IA + foundation — header, overview row, filters, notification center, base widgets.
- Phase 2: Trends & performance — charts, time ranges, micro‑viz, quick actions.
- Phase 3: Customization — grid edit mode, save/share layouts, widget library.
- Phase 4: AI & real‑time — contextual AI, alerting rules, live updates; collaboration.
- Phase 5: Accessibility & performance — audits, fixes, code splitting, virtualization.

## Risks & Mitigations
- Widget sprawl → curation + defaults per role.
- Data latency → caching, background refetch, freshness indicators.
- Customization complexity → progressive rollout (per‑role first, then per‑user).
- A11y gaps in charts → alt summaries + table fallback.

## Deliverables
- Wireframes: desktop/mobile (overview row, grid, notification drawer, widget add flow).
- Spec docs: component contracts, data schemas, error/loading states, a11y checklist.
- Analytics plan: instrumentation map, KPIs per role, alert resolution metrics.

## Decision Request
- Approve scope & phases above.
- Confirm priority order and active roles/personas for personalization.
- Select charting & layout libraries (we’ll adapt to existing stack if needed).