import api from './api';

export interface CryptoTimingParams {
    crypto_symbol: string;
    timing_horizon?: 'intraday' | 'swing' | 'long_term';
    lat?: number;
    lon?: number;
    timezone?: string;
    birth_date?: string;
    birth_time?: string;
    birth_lat?: number;
    birth_lon?: number;
    birth_timezone?: string;
}

export interface PlanetaryInfluence {
    planet: string;
    status: string;
    effect: string;
    strength: number;
    signal: 'bullish' | 'bearish' | 'neutral' | 'volatile' | 'deceptive';
}

export interface TimingWindow {
    type: 'entry' | 'exit' | 'avoid';
    start_date: string;
    end_date: string;
    reason: string;
    strength: number;
}

export interface ActionGuidance {
    strategy: string;
    position_size: string;
    stop_loss: string;
    take_profit: string;
}

export interface WhaleActivity {
    detected: boolean;
    type: string;
}

export interface CryptoAIAnalysis {
    daily_core: string;
    deep_dive: string;
    caution_note?: string;
}

export interface CryptoTimingResponse {
    crypto_symbol: string;
    timing_horizon: string;
    overall_signal: 'buy' | 'hold' | 'avoid';
    confidence_score: number;
    planetary_influences: PlanetaryInfluence[];
    entry_windows: TimingWindow[];
    exit_windows: TimingWindow[];
    risk_periods: TimingWindow[];
    action_guidance: ActionGuidance;
    whale_activity: WhaleActivity;
    patterns?: any[];
    personal_guidance?: any[];
    ai_analysis?: CryptoAIAnalysis;
    dasha_context?: any;
}

export const getCryptoTiming = async (params: CryptoTimingParams): Promise<CryptoTimingResponse> => {
    const response = await api.post('/business/crypto-timing', null, { params });
    return response.data;
};
