import { BarChart3, Sun, Sunset, Moon } from 'lucide-react';
import { EnergyFlowPeriod } from '../../../types/guidance';

interface Props {
  energyFlow: EnergyFlowPeriod[];
}

const barColor = (value: number) => {
  if (value >= 75) return 'from-emerald-400 to-emerald-200';
  if (value >= 55) return 'from-amber-300 to-amber-100';
  if (value >= 40) return 'from-blue-400 to-blue-200';
  return 'from-rose-400 to-rose-200';
};

const EnergyRow = ({ item }: { item: EnergyFlowPeriod }) => {
  const Icon = item.period === 'morning' ? Sun : item.period === 'afternoon' ? Sunset : Moon;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-white/40" />
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
             <span className="font-bold uppercase tracking-wider text-white/60">{item.label}</span>
             <span className="font-bold text-white">{item.energyLevel}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${barColor(item.energyLevel)}`} style={{ width: `${Math.max(0, Math.min(100, item.energyLevel))}%` }} />
          </div>
        </div>
      </div>
      
      <div className="bg-black/20 rounded-lg p-2 ml-7 border border-white/5">
         <div className="flex flex-wrap gap-2 mb-1">
            <span className="text-[10px] text-green-300 bg-green-500/10 px-1.5 py-0.5 rounded">
               Best: {item.bestFor[0]}
            </span>
            {item.avoid.length > 0 && (
               <span className="text-[10px] text-red-300 bg-red-500/10 px-1.5 py-0.5 rounded">
                  Avoid: {item.avoid[0]}
               </span>
            )}
         </div>
      </div>
    </div>
  );
};

const EnergyManagementCard: React.FC<Props> = ({ energyFlow }) => {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 overflow-hidden p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">Today’s Energy</div>
          <div className="mt-1 text-lg font-black tracking-tight text-white">Flow Management</div>
        </div>
        <div className="w-10 h-10 rounded-xl border border-white/10 bg-black/20 flex items-center justify-center text-[#6D5DF6]">
          <BarChart3 className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-4">
        {energyFlow.map((item) => (
          <EnergyRow key={item.period} item={item} />
        ))}
      </div>

      <div className="mt-6 text-xs font-semibold text-white/40 leading-relaxed text-center">
        Sync your tasks with your energy levels for maximum flow.
      </div>
    </section>
  );
};

export default EnergyManagementCard;
