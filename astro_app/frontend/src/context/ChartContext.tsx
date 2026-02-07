import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

type ChartStyle = 'NORTH_INDIAN' | 'SOUTH_INDIAN' | 'WESTERN_WHEEL';

export interface UserProfile {
  name: string;
  date: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
  timezone: string;
  gender?: string;
  // Store original raw data if needed
  raw?: any;
}

export interface CalculationSettings {
  ayanamsa: 'LAHIRI' | 'RAMAN' | 'KP' | 'TROPICAL';
  houseSystem: 'PLACIDUS' | 'WHOLE_SIGN' | 'EQUAL' | 'PORPHYRY' | 'KOCH' | 'REGIOMONTANUS' | 'CAMPANUS';
}

interface ChartContextType {
  chartStyle: ChartStyle;
  setChartStyle: (style: ChartStyle) => void;
  toggleChartStyle: () => void;

  // Calculation Settings
  settings: CalculationSettings;
  updateSettings: (newSettings: Partial<CalculationSettings>) => void;

  // Profile Management
  currentProfile: UserProfile | null;
  availableProfiles: any[];
  switchProfile: (chart: any) => void;
  refreshProfiles: () => Promise<void>;
  isLoadingProfiles: boolean;

  // CRUD Operations
  deleteChart: (chartId: string) => Promise<void>;
  updateChart: (chartId: string, data: any) => Promise<void>;
}

const ChartContext = createContext<ChartContextType | undefined>(undefined);


// Helper to normalize profile data
const normalizeProfile = (chart: any): UserProfile => {
  return {
    name: chart.first_name ? `${chart.first_name} ${chart.last_name}` : (chart.name || 'My Chart'),
    date: chart.date_str || chart.date,
    time: chart.time_str || chart.time,
    location: chart.location_name || chart.location || 'Saved Location',
    latitude: chart.latitude,
    longitude: chart.longitude,
    timezone: chart.timezone_str || chart.timezone,
    gender: chart.gender || 'male',
    raw: chart
  };
};

export const ChartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [chartStyle, setChartStyleState] = useState<ChartStyle>('NORTH_INDIAN');
  const [settings, setSettings] = useState<CalculationSettings>({
    ayanamsa: 'LAHIRI',
    houseSystem: 'PLACIDUS'
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('calcSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<CalculationSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('calcSettings', JSON.stringify(updated));
      return updated;
    });
  };

  // Profile State - Initialize Synchronously
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(() => {
    try {
      const savedChart = localStorage.getItem('lastViewedChart');
      if (savedChart) {
        const parsed = JSON.parse(savedChart);
        return normalizeProfile(parsed);
      }
    } catch (e) {
      console.error("Failed to parse saved chart", e);
    }
    return null;
  });

  const [availableProfiles, setAvailableProfiles] = useState<any[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);

  // Initialize Chart Style
  useEffect(() => {
    const savedStyle = localStorage.getItem('chartStyle') as ChartStyle;
    if (savedStyle) {
      setChartStyleState(savedStyle);
    }
  }, []);

  // Fetch profiles when user is authenticated
  useEffect(() => {
    if (user) {
      refreshProfiles();
    } else {
      setAvailableProfiles([]);
    }
  }, [user]);

  const setChartStyle = (style: ChartStyle) => {
    setChartStyleState(style);
    localStorage.setItem('chartStyle', style);
  };

  const toggleChartStyle = () => {
    const styles: ChartStyle[] = ['NORTH_INDIAN', 'SOUTH_INDIAN', 'WESTERN_WHEEL'];
    const currentIndex = styles.indexOf(chartStyle);
    const nextStyle = styles[(currentIndex + 1) % styles.length];
    setChartStyle(nextStyle);
  };

  const switchProfile = (chart: any) => {
    if (!chart) {
      setCurrentProfile(null);
      localStorage.removeItem('lastViewedChart');
      return;
    }
    const profile = normalizeProfile(chart);
    setCurrentProfile(profile);
    localStorage.setItem('lastViewedChart', JSON.stringify(chart));
  };

  const refreshProfiles = async () => {
    setIsLoadingProfiles(true);
    try {
      const response = await api.get('charts/');
      setAvailableProfiles(response.data);
    } catch (error) {
      console.error("Failed to fetch profiles", error);
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  const deleteChart = async (chartId: string) => {
    try {
      await api.delete(`charts/${chartId}`);
      await refreshProfiles();

      // If deleted chart was current, switch to first available or default
      if (currentProfile?.raw?.id === chartId) {
        const remaining = availableProfiles.filter(p => p.id !== chartId);
        if (remaining.length > 0) {
          switchProfile(remaining[0]);
        } else {
          setCurrentProfile(null);
          localStorage.removeItem('lastViewedChart');
        }
      }
    } catch (error: any) {
      console.error("ChartContext.deleteChart failed:", error);
      console.error("Error response:", error.response);
      throw error;
    }
  };

  const updateChart = async (chartId: string, data: any) => {
    try {
      await api.patch(`charts/${chartId}`, data); // REMOVED TRAILING SLASH
      await refreshProfiles();

      // If updated chart is current, refresh current profile
      if (currentProfile?.raw?.id === chartId) {
        const updated = availableProfiles.find(p => p.id === chartId);
        if (updated) {
          switchProfile(updated);
        }
      }
    } catch (error) {
      console.error("Failed to update chart", error);
      throw error;
    }
  };

  return (
    <ChartContext.Provider value={{
      chartStyle,
      setChartStyle,
      toggleChartStyle,
      currentProfile,
      availableProfiles,
      switchProfile,
      refreshProfiles,
      isLoadingProfiles,
      deleteChart,
      updateChart,
      settings,
      updateSettings
    }}>
      {children}
    </ChartContext.Provider>
  );
};

export const useChart = () => {
  const context = useContext(ChartContext);
  if (context === undefined) {
    throw new Error('useChart must be used within a ChartProvider');
  }
  return context;
};

// Alias for backward compatibility
export const useChartSettings = useChart;
