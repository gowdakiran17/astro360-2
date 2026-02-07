import { Compass, Timer } from 'lucide-react';
import { DecisionCompass } from '../../../types/guidance';

export interface DecisionCompassCardProps {
  compass: DecisionCompass;
}

const overallStyles = (value: DecisionCompass['recommendation']) => {
  switch (value) {
    case 'Proceed':
      return 'bg-emerald-400/10 border-emerald-400/20 text-emerald-200';
    case 'Proceed Carefully':
      return 'bg-amber-300/10 border-amber-300/20 text-amber-200';
    case 'Delay':
      return 'bg-blue-400/10 border-blue-400/20 text-blue-200';
    case 'Avoid':
      return 'bg-rose-400/10 border-rose-400/20 text-rose-200';
    default:
      return 'bg-white/10 border-white/20 text-white';
  }
};

const chip = (status: 'go' | 'caution' | 'avoid') => {
  if (status === 'go') return 'bg-emerald-400/10 border-emerald-400/20 text-emerald-200';
  if (status === 'avoid') return 'bg-rose-400/10 border-rose-400/20 text-rose-200';
  return 'bg-amber-300/10 border-amber-300/20 text-amber-200';
};

const DecisionCompassCard = ({ compass }: DecisionCompassCardProps) => {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">Today’s Decision Compass</div>
            <div className="mt-1 text-lg font-black tracking-tight text-white">Clear calls, calm mind</div>
          </div>
          <div className="w-10 h-10 rounded-xl border border-white/10 bg-black/20 flex items-center justify-center text-[#F5A623]">
            <Compass className="w-5 h-5" />
          </div>
        </div>

        <div className={`mt-5 rounded-2xl border px-4 py-3 ${overallStyles(compass.recommendation)}`}>
          <div className="text-[10px] font-black uppercase tracking-[0.18em] opacity-80">Overall decision energy</div>
          <div className="mt-1 text-xl font-black">{compass.recommendation}</div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">Small decisions</div>
            <div className={`mt-2 inline-flex px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-[0.16em] ${chip(compass.smallDecisions.status)}`}>
              {compass.smallDecisions.status.toUpperCase()}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">Big commitments</div>
            <div className={`mt-2 inline-flex px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-[0.16em] ${chip(compass.bigDecisions.status)}`}>
              {compass.bigDecisions.status.toUpperCase()}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">Emotional decisions</div>
            <div className={`mt-2 inline-flex px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-[0.16em] ${chip(compass.emotionalDecisions.status)}`}>
              {compass.emotionalDecisions.status.toUpperCase()}
            </div>
          </div>
        </div>

        {compass.bestWindow ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white/60">
              <Timer className="w-4 h-4 text-[#6D5DF6]" />
              Best time window
            </div>
            <div className="text-sm font-black text-white">
              {compass.bestWindow.startTime}
              {compass.bestWindow.endTime ? ` – ${compass.bestWindow.endTime}` : ''}
            </div>
          </div>
        ) : null}

        <div className="mt-4 text-xs font-semibold text-white/55 leading-relaxed">
          Use this for interviews, purchases, agreements, and commitments. It’s about timing and tone — not pressure.
        </div>
      </div>
    </div>
  );
};

export default DecisionCompassCard;
