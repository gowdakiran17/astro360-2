# Astro360 Feature Implementation Roadmap (200+ Features)

This document tracks the progress of building the comprehensive 200+ feature list for Astro360.
**Status:** Phase 1 (Core Foundations) is in progress.

---

## 🟢 Phase 1: Core Foundations (Current)
**Goal:** Establish the bedrock astrological calculations, essential API endpoints, and primary charts.

### 1. Chart & Calculation Engine (Feature #1-15)
*   [x] **Rashi & Navamsa (D1/D9):** Core calculations (#1, #2, #3).
*   [x] **Planetary Positions:** Sidereal longitudes, nakshatras, padas (#3).
*   [x] **House Systems:** Placidus/Whole Sign support (#8, #11).
*   [x] **Divisional Charts:** D1-D60 framework implemented (#3).
*   [x] **Ayanamsa:** Lahiri (Chitrapaksha) default, others supported (#11, #15).
*   [x] **Outer Planets:** Uranus, Neptune, Pluto integration (#7).
*   [ ] **Calculation Settings:** UI for Ayanamsa/House System selection (#11).
*   [ ] **Chart Visuals:** Interactive Chart Wheel (#193), Aspect Table (#14), Jyotish Reference Table (#13).

### 2. Basic Dasha & Planets (Feature #46, #52-53, #28)
*   [ ] **Vimshottari Dasha:** 5 levels (Maha to Prana) (#46).
*   [ ] **Dasha Balance & Current:** Auto-calculation at birth/now (#52, #53).
*   [ ] **Rahu/Ketu Analysis:** True/Mean node options (#28).

### 3. Jaimini Module (Feature #26-27, #48, #97)
*   [x] **7 Karakas:** Atmakaraka to Darakaraka (#26, #27, #187).
*   [x] **Arudha Padas:** Lagna Pada (AL) and Upapada (UL) (#97).
*   [ ] **Chara Dasha:** Sign-based dasha system (#48).
*   [ ] **Karakamsa:** Placement in Navamsa (#27).

### 4. Solar Return (Varshaphal) (Feature #171)
*   [x] **Tajaka Chart Calculation:** Annual return time calculation (#171).
*   [x] **Muntha:** Annual progression of the ascendant (#171).
*   [ ] **Pancha Adhikaris:** The 5 Office Bearers (#171).
*   [ ] **Year Lord Selection:** Logic to pick the strongest candidate (#171).

---

## 🟡 Phase 2: Deep Analysis
**Goal:** Implement detailed planetary, nakshatra, and strength analysis ("Gold" tier depth).

### 1. Nakshatra Engine (Feature #16-25)
*   [ ] **Detailed Info:** Deity, Symbol, Ruler, Guna, Element (#16, #19, #24).
*   [ ] **Nakshatra Explorer:** Searchable database (#20).
*   [ ] **Positions in Vargas:** Nakshatras in Divisional Charts (#4, #18, #23).
*   [ ] **Advanced Calculation:** Unequal Nakshatras (#22), Aspects/Latta (#21).

### 2. Planetary Strength & Dignity (Feature #32-45, #55-57)
*   [ ] **Shadbala:** Full 6-fold strength calculation (#55).
*   [ ] **Bhava Bala:** House strength for all 12 houses (#56, #57).
*   [ ] **Varga Dignities:** Exalted/Own/Friend/Enemy in ALL 16 vargas (#32).
*   [ ] **Planetary States:** Avasthas (Bala, Kumara etc.) (#100, #44, #45).
*   [ ] **Yogas & Special Points:** Combustion (#36), Retrograde (#35), Badhaka (#43).
*   [ ] **Destiny Points:** Bhrigu Bindu (#29), Fortune Point (#31, #38).

### 3. Advanced Dasha Systems (Feature #47-51, #54, #102)
*   [ ] **Yogini Dasha:** 8-planet dasha (#51).
*   [ ] **Ashtottari Dasha:** 108-year cycle (#51).
*   [ ] **Kalachakra Dasha:** Wheel of Time dasha (#49, #102).
*   [ ] **Timeline Visualization:** Dasha graphs (#54, #195).

---

## 🟠 Phase 3: Predictive & Event Engine
**Goal:** Enable "When will it happen?" capabilities and daily astrology.

### 1. Transits (Gochara) (Feature #73-83)
*   [ ] **Real-time Transit Chart:** Current planetary positions (#73, #74, #75).
*   [ ] **Transit/Natal Overlay:** Interactive superimposition (#33, #194).
*   [ ] **Sade Sati / Dhaiya:** Saturn transit analysis (#59 - inferred).
*   [ ] **Special Transits:** Kakshya (#60 - inferred), Gandanta (#82), Vargottama (#81).
*   [ ] **Transit Calendar:** Monthly summary and hitlist (#34, #76, #77).

### 2. Panchang & Time (Feature #64-72, #121-128)
*   [ ] **Daily Panchang:** Tithi, Vara, Nakshatra, Yoga, Karana (#64, #65).
*   [ ] **Muhurta:** Rahu Kaal, Yamaganda, Gulika Kaal (#69, #70, #71, #72).
*   [ ] **Sunrise/Sunset:** Accurate local calculation (#68).
*   [ ] **Tithi & Lunar:** Tithi Pravesh (#123), Deities (#124), Yogatara (#127).

### 3. Events & Yoga (Feature #111-120, #164-170)
*   [ ] **Yoga Detection:** 100+ Classical Yogas (Raja, Dhana, Arishta) (#164-169).
*   [ ] **Life Events:** Tracking and correlation (#111, #112).
*   [ ] **Auspicious Timing:** Sankranti (#114), Purnima/Amavasya (#116, #117).

---

## 🔵 Phase 4: Specialized Modules
**Goal:** High-end features for professional astrologers and remedies.

### 1. KP Astrology (Feature #130-133)
*   [ ] **KP Cusps:** Placidus house system (#131).
*   [ ] **Significators:** Planet and House significations (A, B, C, D) (#132).
*   [ ] **Sub-Lord Theory:** The core of KP prediction (#133).

### 2. Ashtakavarga (Feature #58-60)
*   [ ] **Bhinna Ashtakavarga:** Individual planet points (#59).
*   [ ] **Sarva Ashtakavarga:** Total points per sign (#58).
*   [ ] **Prastharas:** Detailed point distribution (#60).

### 3. Compatibility (Feature #159-163)
*   [ ] **Ashta Kuta:** 36-point matching system (#160, #161).
*   [ ] **Manglik Dosha:** Mars affliction check (#88 - inferred).
*   [ ] **Synastry:** Planet-to-planet overlay (#162).
*   [ ] **Composite Charts:** (#163).

### 4. Remedies & Rituals (Feature #84-94, #155)
*   [ ] **Personalized Remedies:** Nakshatra (#84), Mantra (#85), Gemstone (#90).
*   [ ] **Dosha Remedies:** Kaal Sarp, Pitra, etc. (#93).
*   [ ] **Eclipse Rituals:** Sutak timings (#157), Remedies (#155).

### 5. Advanced Analysis (Feature #95-110, #129, #134-152)
*   [ ] **Special Points:** Arabic Parts (#129), Mrtyu Bhaga (#138), Pushkara Navamsa (#151).
*   [ ] **Chakra Analysis:** SarvatoBhadra (#152), Sudarshan (#10).
*   [ ] **Drekkana Analysis:** Jagannath, Somnath (#103-105).

---

## 🟣 Phase 5: Reports & Monetization
**Goal:** Generate revenue, downloadable assets, and user management.

### 1. PDF Reports (Feature #176-183)
*   [ ] **PDF Generation:** High-quality vector PDFs (#176).
*   [ ] **Report Templates:** Basic (#177), Detailed (#178), Transit (#180), Compatibility (#182).

### 2. Notifications (Feature #198-202)
*   [ ] **Transit Alerts:** "Jupiter entering Taurus" (#198, #200).
*   [ ] **Dasha Alerts:** "Entering Mercury Antardasha" (#199).
*   [ ] **Remedy Reminders:** (#201).

### 3. Monetization & Utilities (Feature #184-192, #203-210)
*   [ ] **Tiered Access:** Silver/Gold/Platinum enforcement (#203-207).
*   [ ] **Subscription Logic:** Renewal and upgrades (#209, #210).
*   [ ] **User Utilities:** Offline Charts (#184), Multiple Profiles (#186), Celebrity DB (#192).
