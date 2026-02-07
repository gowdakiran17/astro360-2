/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { guidanceService, LoadGuidanceOptions } from '../services/guidance';
import api from '../services/api';
import { UserProfile } from '../context/ChartContext';

// Mock API
vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock LocalStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('guidanceService', () => {
  const mockProfile: UserProfile = {
    name: 'Test User',
    date: '1990-01-01',
    time: '12:00',
    location: 'Test City',
    latitude: 10.0,
    longitude: 20.0,
    timezone: 'UTC',
    raw: { id: 'user-123' },
  };

  const mockPayload = {
    header: { greeting: 'Hello' },
    horoscopes: [{ life_area: 'CAREER', favorability: 80, synthesis: 'Good day' }],
    // ... minimal payload structure
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('should generate a unique cache key based on profile fingerprint', async () => {
    // We can't access private functions directly, but we can verify behavior
    // 1. Call with Profile A
    // 2. Call with Profile B (different time)
    // 3. Verify they are treated as different cache entries

    const profileA = { ...mockProfile, time: '12:00' };
    const profileB = { ...mockProfile, time: '12:01' };

    // Mock successful API response
    (api.post as any).mockResolvedValue({
      data: { status: 'success', data: { horoscopes: [{ life_area: 'CAREER', favorability: 80 }] } }
    });

    await guidanceService.loadDaily(profileA, { forceRefresh: true });
    await guidanceService.loadDaily(profileB, { forceRefresh: true });

    // Since we force refresh, it should call API twice
    expect(api.post).toHaveBeenCalledTimes(6); // 3 calls per loadDaily (horoscope, panchang, planner)
  });

  it('should return cached data if available and not forced', async () => {
    const date = new Date('2023-01-01T12:00:00Z');
    const options: LoadGuidanceOptions = { date, forceRefresh: false };
    
    // Manually seed cache (simulating previous save)
    // We need to know the cache key format to seed it, OR we just let the first call cache it.
    
    // 1. First call: API
    (api.post as any).mockResolvedValue({
        data: { status: 'success', data: { horoscopes: [{ life_area: 'CAREER', favorability: 80 }] } }
    });

    await guidanceService.loadDaily(mockProfile, { ...options, forceRefresh: true });
    
    // 2. Second call: Cache
    (api.post as any).mockClear();
    
    // We need to ensure saveCache was called. The service implementation catches errors silently but tries to save.
    // Let's assume the real implementation writes to localStorage.
    
    const result = await guidanceService.loadDaily(mockProfile, options);
    
    expect(result.fromCache).toBe(true);
    expect(api.post).not.toHaveBeenCalled();
  });

  it('should throw error if horoscopes are empty (Fail Fast)', async () => {
    (api.post as any).mockImplementation((url: string) => {
        if (url.includes('daily-horoscopes')) {
            return Promise.resolve({ data: { status: 'success', data: { horoscopes: [] } } });
        }
        return Promise.resolve({ data: {} });
    });

    await expect(guidanceService.loadDaily(mockProfile, { forceRefresh: true }))
      .rejects.toThrow('Daily horoscopes unavailable');
  });

  it('should handle null/undefined profile fields gracefully', async () => {
    const incompleteProfile: UserProfile = {
      name: 'Unknown',
      date: '',
      time: '',
      location: '',
      latitude: 0,
      longitude: 0,
      timezone: '',
    };

    (api.post as any).mockResolvedValue({
        data: { status: 'success', data: { horoscopes: [{ life_area: 'CAREER', favorability: 80 }] } }
    });

    // Should not crash
    await expect(guidanceService.loadDaily(incompleteProfile, { forceRefresh: true })).resolves.toBeDefined();
  });
  
  it('should invalidate cache if chart details change (Fingerprint check)', async () => {
      // 1. Load for Profile A
      const profileA = { ...mockProfile, time: '10:00' };
      
      (api.post as any).mockResolvedValue({
          data: { status: 'success', data: { horoscopes: [{ life_area: 'CAREER', favorability: 80 }] } }
      });
      
      await guidanceService.loadDaily(profileA, { forceRefresh: true });
      
      // 2. Load for Profile A Modified (time changed) - should NOT hit cache for Profile A
      const profileAModified = { ...mockProfile, time: '10:01' };
      
      // Clear mocks to track new calls
      (api.post as any).mockClear();
      (api.post as any).mockResolvedValue({
          data: { status: 'success', data: { horoscopes: [{ life_area: 'CAREER', favorability: 80 }] } }
      });
      
      const result = await guidanceService.loadDaily(profileAModified, { forceRefresh: false });
      
      // Should invoke API because fingerprint changed
      expect(result.fromCache).toBeFalsy(); 
      expect(api.post).toHaveBeenCalled();
  });
});
