import { FC } from 'react';

const StatusLegend: FC = () => {
  return (
    <div className="mt-2 p-3 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-300 space-y-2">
      <div className="flex items-center gap-2">
        <span className="inline-flex px-2 py-0.5 rounded border border-emerald-700 bg-emerald-600/20 text-emerald-300 text-[10px] font-bold">PROMISED</span>
        <span>Strong alignment across dasha, transit and nakshatra for outcome.</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex px-2 py-0.5 rounded border border-amber-700 bg-amber-600/20 text-amber-300 text-[10px] font-bold">DELAYED</span>
        <span>Alignment exists but timing or conditions require patience or adjustments.</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex px-2 py-0.5 rounded border border-rose-700 bg-rose-600/20 text-rose-300 text-[10px] font-bold">DENIED</span>
        <span>Factors do not support outcome now; redirect focus to alternatives.</span>
      </div>
    </div>
  );
};

export default StatusLegend;
