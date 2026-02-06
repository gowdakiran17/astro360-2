## Objectives
- Transform predictions into astrologer-grade guidance that reduces uncertainty, explains delay/suffering, gives hope/closure, validates experience, enables decisions, and stops endless waiting.
- Introduce PROMISED / DELAYED / DENIED logic with timing windows, confidence, dominance resolution, karma repetition, and non‑interpretive tokens.

## Messaging Principles
- Plain language, ritual of clarity: lead with status + timing, then cause + remedy, then action.
- No jargon first: factors are visible under “Why this?” and tokens, not in the lead copy.
- Always provide a decision path today (Next best action) and a window (Event timing).

## Result Card Structure (per life area)
1. Header: Status badge (PROMISED / DELAYED / DENIED) + Timing window + Confidence %
2. Lead line: One‑sentence outcome statement (what and when)
3. Cause & resolution: Dominance resolution (which influence rules, how to resolve), Karma repetition (pattern seen)
4. Action today: One concrete step, with hora or time window
5. Tokens row (non‑interpretive): P+, P‑, DLY, DENY, DOM, KRP, TRN, NAK
6. Why this? : Factors: Dasha (mahadasha/antardasha + theme), Transit (planet + aspect + effect), Nakshatra (name + theme)

## Content Schema (new fields)
- area: string
- status: 'PROMISED' | 'DELAYED' | 'DENIED'
- timing_window: { start_iso, end_iso, label }
- confidence: 0–100 (with rationale: factor_weights)
- dominance_resolution: { dominant: string, counter: string, method: string }
- karma_repetition: { seen: boolean, description }
- today_action: { text, time_label, hora }
- tokens: string[] // P+, DLY, DENY, etc.
- factors: { dasha: {...}, transit: {...}, nakshatra: {...} }

## Status Logic (deterministic weights)
- Inputs: dasha_context.strength, theme polarity; transit_trigger.effect polarity; nakshatra_context.tarabala_strength; house relevance.
- Scoring:
  - base = w_dasha*D + w_transit*T + w_nakshatra*N + w_house*H (normalize to 0–100)
  - dominance = argmax(D, T, N)
- Status mapping:
  - PROMISED: base ≥ 70 AND no hard negative flags (e.g., transit downtrend + tarabala low)
  - DELAYED: 40 ≤ base < 70 OR conflicting dominance (dominant negative with supportive subfactor)
  - DENIED: base < 40 OR explicit contraindication flag (e.g., Saturn hard aspect + house debilitation)
- Timing window:
  - If PROMISED: use transit supportive window + antardasha remaining period (intersection)
  - If DELAYED: next supportive window (nearest transit positive + dasha shift) with “unlock earliest” label
  - If DENIED: show “Not ideal in current cycle”, next re‑evaluation window (next dasha/antardasha change)
- Confidence: sigmoid(base) adjusted by factor agreement (± up to 10) and data freshness.

## Dominance Resolution & Karma Repetition
- Dominance resolution:
  - dominant influence (e.g., Saturn) + counter influence (e.g., Jupiter) → method (restructure plan, seek mentor, choose patient strategy)
- Karma repetition detection:
  - repeat tag when same influence combo appeared in prior periods (rolling 6–12 months)
  - description: “Similar pattern last Aug—opted to wait; this window favors decisive action.”

## Non‑Interpretive Tokens (for trust)
- P+: supportive promise; P‑: weak promise; DLY: delayed; DENY: denied; DOM: dominance influence; KRP: karma repetition; TRN: transit support/opposition; NAK: nakshatra theme code.
- Display under tokens row; tooltips define each.

## Microcopy Templates
- PROMISED (Career): “Green light. Promotion/recognition is PROMISED between Feb 12–Mar 8 (confidence 78%). Saturn’s structure dominates; Jupiter offers lift—lean into disciplined output. Act today: send proposal during Mars hora (02:30–03:30 pm).”
- DELAYED (Relations): “Meaningful progress is DELAYED until Venus strengthens (Feb 20–Mar 4) (confidence 62%). Cause: Mercury over‑analysis; resolution: simplify contact cadence. Today: one honest message, no escalation.”
- DENIED (Business): “Funding is DENIED in this cycle (confidence 55%). Cause: Saturn hard aspect blocks risk; resolution: rebuild plan for the next window (Mar 18–Apr 12). Today: focus on unit economics, defer pitch.”

## UX Changes
- New badges/status + timing chip next to score
- Confidence badge; hover breakdown of factor contributions
- Tokens row with tooltips; “Why this?” keeps factors
- Today Action block with hora and a Set Alert CTA

## Fallback Behavior
- If synthesis missing or error: auto‑compose lead line from status + timing + dominant factor; show Retry.

## Implementation Phases
- Phase 1 (Messaging Core):
  - Add schema fields to AI/horoscope response
  - Build status/timing/confidence generator (deterministic mapping)
  - Update card copy with templates
- Phase 2 (Trust Layer):
  - Tokens row + tooltips; factor contribution breakdown
  - Karma repetition detection (use prior periodOverview snapshots)
- Phase 3 (Timing Polish):
  - Hora calculation and local time labeling
  - “Unlock earliest” for DELAYED windows
- Phase 4 (Calibration):
  - Compare outputs vs. expert samples; tweak weights; A/B test microcopy

## Deliverables
- Microcopy library (templates per status + area)
- Generator module spec (inputs/outputs, weight table)
- UI spec changes for cards (status badge, timing chip, tokens row, confidence badge)
- Example outputs per area with different statuses

## Decision Request
- Approve the above messaging and logic; I’ll implement Phase 1 immediately, then ship Trust Layer in Phase 2.
