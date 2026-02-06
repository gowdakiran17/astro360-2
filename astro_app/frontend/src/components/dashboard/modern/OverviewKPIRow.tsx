import React from 'react';
import { AlertTriangle, CheckCircle2, TrendingUp, Clock } from 'lucide-react';

interface KPI {
  label: string;
  value: number | string;
  delta?: number;
  icon?: React.ReactNode;
  tone?: 'positive' | 'neutral' | 'negative';
  spark?: number[];
}

interface OverviewKPIRowProps {
  kpis?: KPI[];
}

const defaultSpark = [65, 68, 60, 72, 75, 78, 80];

const Sparkline = ({ data = defaultSpark }: { data?: number[] }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, i) => (
        <div
          key={i}
          className="w-1.5 rounded-t bg-gradient-to-t from-slate-700 to-slate-400"
          style={{ height: `${Math.max(4, Math.round((v / max) * 32))}px` }}
        />
      ))}
    </div>
  );
};

const toneClass = (t?: 'positive' | 'neutral' | 'negative') =>
  t === 'positive'
    ? 'text-emerald-400'
    : t === 'negative'
    ? 'text-rose-400'
    : 'text-slate-300';

const OverviewKPIRow: React.FC<OverviewKPIRowProps> = ({ kpis }) => {
  const items: KPI[] =
    kpis && kpis.length
      ? kpis
      : [
          { label: 'Today Score', value: 78, delta: +6, icon: <TrendingUp className="w-4 h-4" />, tone: 'positive', spark: defaultSpark },
          { label: 'Alerts', value: 2, icon: <AlertTriangle className="w-4 h-4" />, tone: 'negative', spark: [2,1,0,3,1,2,2] },
          { label: 'Resolved', value: 8, icon: <CheckCircle2 className="w-4 h-4" />, tone: 'positive', spark: [3,4,5,6,7,8,8] },
          { label: 'Avg Response', value: '1m 20s', icon: <Clock className="w-4 h-4" />, tone: 'neutral', spark: [80,85,90,75,70,68,72] },
        ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((k, i) => (
        <div key={i} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{k.label}</span>
            <span className={`flex items-center gap-1 ${toneClass(k.tone)}`}>{k.icon}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">{k.value}</span>
            {typeof k.delta === 'number' && (
              <span className={`text-xs font-semibold ${k.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {k.delta >= 0 ? '+' : ''}
                {k.delta}
              </span>
            )}
          </div>
          <div className="mt-3">
            <Sparkline data={k.spark} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewKPIRow;
