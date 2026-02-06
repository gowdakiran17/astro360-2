export type Status = 'PROMISED' | 'DELAYED' | 'DENIED';

export interface Factors {
  dasha?: { strength?: number; theme?: string; mahadasha?: string; antardasha?: string; time_remaining?: string; house?: number };
  transit?: { effect?: string; aspect_type?: string; planet?: string; urgency?: string };
  nakshatra?: { tarabala_strength?: number; current_nakshatra?: string; theme?: string };
}

const positiveWords = ['trine', 'sextile', 'support', 'growth', 'harmony', 'expansion'];
const negativeWords = ['opposition', 'square', 'block', 'delay', 'debilitation'];

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));

function scoreTransit(t?: Factors['transit']): number {
  if (!t) return 50;
  const aspect = (t.aspect_type || '').toLowerCase();
  const eff = (t.effect || '').toLowerCase();
  let s = 50;
  if (positiveWords.some(w => aspect.includes(w) || eff.includes(w))) s += 25;
  if (negativeWords.some(w => aspect.includes(w) || eff.includes(w))) s -= 25;
  if ((t.urgency || '').toLowerCase() === 'high') s += 10;
  return clamp(s);
}

function scoreDasha(d?: Factors['dasha']): number {
  if (!d) return 50;
  let s = typeof d.strength === 'number' ? d.strength : 50;
  const theme = (d.theme || '').toLowerCase();
  if (positiveWords.some(w => theme.includes(w))) s += 10;
  if (negativeWords.some(w => theme.includes(w))) s -= 10;
  return clamp(s);
}

function scoreNakshatra(n?: Factors['nakshatra']): number {
  if (!n) return 50;
  let s = typeof n.tarabala_strength === 'number' ? n.tarabala_strength : 50;
  const theme = (n.theme || '').toLowerCase();
  if (positiveWords.some(w => theme.includes(w))) s += 5;
  if (negativeWords.some(w => theme.includes(w))) s -= 5;
  return clamp(s);
}

function dominantLabel(f: { d: number; t: number; n: number }, names: { d?: string; t?: string; n?: string }) {
  const max = Math.max(f.d, f.t, f.n);
  if (max === f.d) return names.d || 'Dasha';
  if (max === f.t) return names.t || 'Transit';
  return names.n || 'Nakshatra';
}

export function computeStatusAndTiming(factors: Factors) {
  const d = scoreDasha(factors.dasha);
  const t = scoreTransit(factors.transit);
  const n = scoreNakshatra(factors.nakshatra);
  const base = clamp(0.5 * d + 0.3 * t + 0.2 * n);

  let status: Status;
  const negTransit = scoreTransit({ ...factors.transit, effect: 'opposition' }) > t; // heuristic
  if (base >= 70 && !negTransit) status = 'PROMISED';
  else if (base < 40) status = 'DENIED';
  else status = 'DELAYED';

  const start = new Date();
  const end = new Date(start);
  if (status === 'PROMISED') end.setDate(start.getDate() + 14);
  else if (status === 'DELAYED') end.setDate(start.getDate() + 28);
  else end.setDate(start.getDate() + 45);
  const timing_label = status === 'PROMISED' ? 'Favorable window' : status === 'DELAYED' ? 'Next supportive window' : 'Re‑evaluate next cycle';

  // Confidence adjusted by agreement
  let confidence = base;
  const agree = (d > 60 && t > 60) || (d > 60 && n > 60) || (t > 60 && n > 60);
  confidence = clamp(confidence + (agree ? 7 : -5));

  const tokens: string[] = [];
  if (status === 'PROMISED') tokens.push('P+');
  if (status === 'DELAYED') tokens.push('DLY');
  if (status === 'DENIED') tokens.push('DENY');
  tokens.push('DOM:' + dominantLabel({ d, t, n }, { d: factors.dasha?.mahadasha, t: factors.transit?.planet, n: factors.nakshatra?.current_nakshatra }));
  tokens.push((t >= 60 ? 'TRN+' : t <= 40 ? 'TRN-' : 'TRN0'));
  tokens.push('NAK:' + (factors.nakshatra?.current_nakshatra || ''));

  const lead = (area: string) => {
    if (status === 'PROMISED') return `Green light in ${area}. ${timing_label} ${start.toLocaleDateString()}–${end.toLocaleDateString()} (confidence ${Math.round(confidence)}%).`;
    if (status === 'DELAYED') return `Progress in ${area} is delayed. ${timing_label} ${start.toLocaleDateString()}–${end.toLocaleDateString()} (confidence ${Math.round(confidence)}%).`;
    return `Outcome in ${area} is not favored this cycle. Re‑evaluate after ${end.toLocaleDateString()} (confidence ${Math.round(confidence)}%).`;
  };

  const dominanceResolution = (() => {
    const dom = dominantLabel({ d, t, n }, { d: factors.dasha?.mahadasha, t: factors.transit?.planet, n: factors.nakshatra?.current_nakshatra });
    let method = 'choose patient strategy';
    if (/Saturn/i.test(dom)) method = 'restructure plan';
    else if (/Jupiter/i.test(dom)) method = 'seek mentor/expand';
    else if (/Mars/i.test(dom)) method = 'act decisively on one task';
    else if (/Mercury/i.test(dom)) method = 'simplify communication';
    else if (/Venus/i.test(dom)) method = 'build harmony \u0026 rapport';
    return { dominant: dom, counter: 'Balance influences', method };
  })();

  return {
    status,
    timing_window: { start_iso: start.toISOString(), end_iso: end.toISOString(), label: timing_label },
    confidence: Math.round(confidence),
    tokens,
    dominance_resolution: dominanceResolution,
    base_scores: { dasha: d, transit: t, nakshatra: n },
    lead,
  };
}
