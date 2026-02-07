export type GuidanceEventName =
  | 'page_view'
  | 'pull_to_refresh'
  | 'quick_metric_tap'
  | 'life_guidance_expand'
  | 'save'
  | 'share'
  | 'time_spent';

export interface GuidanceEvent {
  name: GuidanceEventName;
  t: number;
  props?: Record<string, any>;
}

const key = 'guidance_metrics_v1';
const maxEvents = 250;

export const trackGuidanceEvent = (name: GuidanceEventName, props?: Record<string, any>) => {
  try {
    const existing = JSON.parse(localStorage.getItem(key) || '[]') as GuidanceEvent[];
    const next = [{ name, t: Date.now(), props }, ...existing].slice(0, maxEvents);
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    return;
  }
};

