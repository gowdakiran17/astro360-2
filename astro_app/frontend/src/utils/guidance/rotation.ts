import { RotatingCardType } from '../../types/guidance';

const hashString = (value: string) => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const pickDistinct = (pool: RotatingCardType[], seed: number, count: number) => {
  const picked: RotatingCardType[] = [];
  let s = seed;
  const available = [...pool];
  for (let i = 0; i < count && available.length > 0; i++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const idx = s % available.length;
    picked.push(available[idx]);
    available.splice(idx, 1);
  }
  return picked;
};

export const loadRotation = (rotationKey: string): RotatingCardType[] | null => {
  try {
    const raw = localStorage.getItem(rotationKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RotatingCardType[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveRotation = (rotationKey: string, value: RotatingCardType[]) => {
  try {
    localStorage.setItem(rotationKey, JSON.stringify(value));
  } catch {
    return;
  }
};

export const selectRotation = (params: {
  rotationKey: string;
  seed: string;
  moodLogged?: number | null;
  lastExpandedArea?: string | null;
}): RotatingCardType[] => {
  const existing = loadRotation(params.rotationKey);
  if (existing) return existing;

  const basePool: RotatingCardType[] = [
    'CONVERSATION_QUALITY',
    'WORKPLACE_CLIMATE',
    'MONEY_MOOD',
    'EMOTIONAL_WEATHER',
    'ONE_POWERFUL_ACTION',
    'PERSONAL_INSIGHT'
  ];

  const priority: RotatingCardType[] = [];

  if (params.moodLogged === 1) {
    priority.push('EMOTIONAL_WEATHER', 'CONVERSATION_QUALITY');
  }

  if (params.lastExpandedArea) {
    if (params.lastExpandedArea.includes('WEALTH') || params.lastExpandedArea.includes('MONEY')) priority.push('MONEY_MOOD');
    if (params.lastExpandedArea.includes('CAREER')) priority.push('WORKPLACE_CLIMATE');
    if (params.lastExpandedArea.includes('RELATION')) priority.push('CONVERSATION_QUALITY');
  }

  const seedHash = hashString(params.seed);
  const count = (seedHash % 2) + 2;

  const pool = basePool.filter((t) => !priority.includes(t));
  const picks = pickDistinct(pool, seedHash ^ 0x9e3779b9, Math.max(0, count - priority.length));
  const selected = [...priority, ...picks].slice(0, count);

  saveRotation(params.rotationKey, selected);
  return selected;
};

