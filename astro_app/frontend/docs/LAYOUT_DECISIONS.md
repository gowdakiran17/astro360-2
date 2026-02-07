# Layout Redesign & Architecture Decisions

## 1. Mission Control Dashboard Philosophy
The new "Today's Guidance" page adopts a **Mission Control** metaphor.
- **Why?** Astrology users want to feel in control of their destiny. A dashboard provides high density of information without clutter.
- **Key Principle:** "Quick Glances first, Deep Dives second."
- **Visual Style:** Glassmorphism + High Contrast + Semantic Colors (Green/Red/Amber) for quick cognitive processing.

## 2. Grid System
We utilize a **12-column fluid grid** system powered by CSS Grid (via Tailwind).

### Breakpoints & Columns
- **Desktop (lg: 1024px+)**: 3-Column Layout
  - **Left Sidebar (3 cols)**: Context, Navigation, Quick Stats. Fixed/Sticky.
  - **Center Stage (6 cols)**: The "Feed" - Hero, Deep Dive Guidance, Key Interactions. Scrollable.
  - **Right Sidebar (3 cols)**: Supplemental Widgets - Energy, Mood, Tools. Sticky or Independent.
- **Tablet (md: 768px+)**: 2-Column Layout
  - **Left Sidebar (4 cols)**: Same as desktop.
  - **Center Stage (8 cols)**: Expands to fill space.
  - **Right Sidebar**: Moves to bottom or reflows into Center Stage (depending on height).
- **Mobile (<768px)**: Single Column Stack
  - **Header**: Sticky top bar with date/greeting.
  - **Quick Rail**: Horizontal scroll (Instagram Stories style) for metrics.
  - **Feed**: Vertical stack of cards.

## 3. Component Standardization
All cards follow a strict visual language:
- **Rounded Corners**: `rounded-3xl` (24px) for outer containers, `rounded-2xl` (16px) for inner elements.
- **Borders**: `border border-white/10` or `border-white/5` for subtle separation.
- **Backgrounds**: `bg-white/5` (glass) or `bg-black/20` (depth).
- **Shadows**: `shadow-2xl` for floating elements to create depth.

## 4. Typography & Hierarchy
- **Headings**: `font-black` (Inter/System UI) for maximum impact. Uppercase tracking for labels (`tracking-[0.2em]`).
- **Body**: `font-medium` text-white/70 for readability against dark backgrounds.
- **Data Points**: `font-black` or `font-extrabold` to make numbers pop.

## 5. Accessibility (WCAG 2.1)
- **Contrast**: All text meets AA standard (4.5:1). Secondary text bumped from `text-white/40` to `text-white/60` or `text-white/70`.
- **Semantic HTML**:
  - `<aside>` for sidebars.
  - `<main>` for primary content.
  - `<section>` with `aria-label` for distinct widgets.
  - `<button>` with `aria-label` for icon-only actions.
- **Focus States**: Visible `ring` outlines for keyboard navigation.
- **Motion**: `prefers-reduced-motion` support (via Framer Motion).

## 6. Performance Optimization
- **Code Splitting**: Heavy widgets (`LifeGuidanceAccordion`, `EnergyManagementCard`, charts) are lazy-loaded via `React.lazy` and `Suspense`.
- **Skeleton Loading**: Custom skeleton states prevent layout shift (CLS) during data fetching.
- **Interaction**: Heavy interactions (animations) are localized to specific components to avoid main thread blocking.

## 7. A/B Testing Recommendations
To validate the effectiveness of the new layout, we recommend the following tests:

### Test A: Navigation Structure
- **Variant A (Current)**: Left sidebar sticky navigation.
- **Variant B**: Top sticky tab bar (Context | Feed | Widgets).
- **Hypothesis**: Sidebar is better for desktop discovery; Tabs might be better for tablet focus.

### Test B: Information Density
- **Variant A (Current)**: "Quick Glance Rail" (Compact horizontal scroll).
- **Variant B**: "Quick Glance Grid" (2x2 expanded grid at top of feed).
- **Hypothesis**: Grid provides more immediate value but pushes content down. Rail encourages scroll.

### Test C: Call to Action (CTA) Placement
- **Variant A**: "One Powerful Action" integrated into the feed.
- **Variant B**: "One Powerful Action" as a floating sticky button (Mobile only).
- **Hypothesis**: Floating button increases click-through rate for daily tasks.
