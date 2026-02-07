# Analysis of Daily Guidance Engine Issues & Fixes

## 1. Issue Analysis
The user reported that the "app is not working" when changing charts, specifically that the data was not refreshing correctly and appeared to be "mockup data".

### Root Cause Analysis

1.  **Cache Key Collision (Frontend):**
    *   The `guidanceService` was caching data using a key that might not have been granular enough (initially likely just name/ID).
    *   **Impact:** Changing birth time slightly (which changes the chart) did not invalidate the cache, leading to stale predictions.
    *   **Fix:** Updated `cacheKey` to use a "Chart Fingerprint" combining `name|date|time|timezone|lat|lon|location`.

2.  **Mock Data Fallback (Frontend):**
    *   When the API failed or returned empty data, the service (or component) might have been falling back to hardcoded mock data (if present) or just showing stale state.
    *   **Fix:** Added a "Fail Fast" mechanism in `guidanceService`. If `horoscopes` array is empty, it throws an error immediately, allowing the UI to show an error state rather than fake data.

3.  **Race Condition on Profile Switch (Frontend):**
    *   When switching profiles rapidly, async requests could return out of order.
    *   **Scenario:** User clicks Profile A -> Request A starts. User clicks Profile B -> Request B starts. Request B finishes (shows B). Request A finishes (overwrites with A). Result: UI shows Profile B's name but Profile A's data.
    *   **Fix:** Added a check in `TodaysGuidance.tsx` to verify `profileFingerprint(currentProfile) === loadingProfileId` before updating state.

4.  **Backend Crash (Shadbala):**
    *   The `calculate_shadbala` function was receiving a raw dictionary instead of a list of planets, causing a `TypeError: string indices must be integers`.
    *   **Impact:** API failed, triggering frontend fallbacks.
    *   **Fix:** Updated `ai_insight.py` to construct `planets_d1` list and pass that to the calculation engine.

5.  **Duplicate React Keys:**
    *   `GuidanceHeroCard` and `LifeGuidanceAccordion` were using simple strings as keys, leading to duplicates if two items had similar text.
    *   **Fix:** Updated keys to combine index and content (e.g., `${idx}-${text}`).

## 2. Verified Fixes

### Frontend Service (`guidance.ts`)
```typescript
// Robust Cache Key
const profileFingerprint = (profile: UserProfile) => {
  // ... joins all fields including time/lat/lon
  return [rawId, date, time, timezone, latitude, longitude, location, name].join('|');
};

// Fail Fast
if (!horoscopes.length) {
  throw new Error('Daily horoscopes unavailable');
}
```

### Frontend Component (`TodaysGuidance.tsx`)
```typescript
// Race Condition Protection
const loadingProfileId = profileFingerprint(currentProfile);
const res = await guidanceService.loadDaily(...);
if (profileFingerprint(currentProfile) === loadingProfileId) {
  setPayload(res.payload);
}
```

### Backend (`ai_insight.py`)
```python
# Correct Argument Passing
planets_d1 = [ ... ] 
shadbala = await calculate_shadbala(planets_d1, ascendant_sign_idx, birth_details_dict)
```

## 3. Verification & Testing

### Unit Tests
A new test file `src/tests/guidanceService.test.ts` was created to verify the service logic.
*   **Environment:** Vitest + JSDOM
*   **Results:** All tests passed.
    *   ✅ `should generate a unique cache key based on profile fingerprint`
    *   ✅ `should return cached data if available and not forced`
    *   ✅ `should throw error if horoscopes are empty`
    *   ✅ `should invalidate cache if chart details change`

### Manual Verification
*   **Chart Switching:** Verified that switching profiles forces a refresh and shows correct data.
*   **Data Integrity:** Verified that different birth times produce different "fingerprints" and thus different API calls.

## 4. Recommendations
*   Ensure the backend `calculate_shadbala` remains stable.
*   Monitor API latency; if `daily-horoscopes` is slow, the loading state will persist longer now (which is better than showing wrong data).
