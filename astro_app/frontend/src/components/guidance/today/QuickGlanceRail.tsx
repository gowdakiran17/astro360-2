import { motion } from 'framer-motion';
import {
  Activity,
  Briefcase,
  Coins,
  Heart,
  MessageCircle,
  Smile,
  Zap
} from 'lucide-react';
import { GuidanceQuickMetric, GuidanceStatus } from '../../../types/guidance';

export interface QuickGlanceRailProps {
  metrics: GuidanceQuickMetric[];
  activeKey?: GuidanceQuickMetric['key'];
  onSelect?: (key: GuidanceQuickMetric['key']) => void;
  mode?: 'rail' | 'grid';
}

const statusStyles = (status: GuidanceStatus) => {
  switch (status) {
    case 'favorable':
      return {
        ring: 'ring-emerald-400/30',
        dot: 'bg-emerald-400',
        text: 'text-emerald-200',
        chip: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-200'
      };
    case 'excellent':
        return {
          ring: 'ring-green-400/30',
          dot: 'bg-green-400',
          text: 'text-green-200',
          chip: 'bg-green-400/10 border-green-400/20 text-green-200'
        };
    case 'caution':
      return {
        ring: 'ring-rose-400/30',
        dot: 'bg-rose-400',
        text: 'text-rose-200',
        chip: 'bg-rose-400/10 border-rose-400/20 text-rose-200'
      };
    case 'sensitive':
        return {
          ring: 'ring-purple-400/30',
          dot: 'bg-purple-400',
          text: 'text-purple-200',
          chip: 'bg-purple-400/10 border-purple-400/20 text-purple-200'
        };
    default:
      return {
        ring: 'ring-amber-300/30',
        dot: 'bg-amber-300',
        text: 'text-amber-200',
        chip: 'bg-amber-300/10 border-amber-300/20 text-amber-200'
      };
  }
};

const iconFor = (icon: GuidanceQuickMetric['icon']) => {
  switch (icon) {
    case 'mood':
      return Smile;
    case 'energy':
      return Zap;
    case 'career':
      return Briefcase;
    case 'money':
      return Coins;
    case 'relationships':
    case 'love':
      return Heart;
    case 'health':
      return Activity;
    case 'decisions':
      return MessageCircle;
    default:
      return Activity;
  }
};

const QuickGlanceRail = ({ metrics, activeKey, onSelect, mode = 'rail' }: QuickGlanceRailProps) => {
  const containerClasses = mode === 'rail' 
    ? "mt-3 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 [-webkit-overflow-scrolling:touch]"
    : "mt-3 space-y-2";

  const itemClasses = mode === 'rail'
    ? "snap-start shrink-0 w-[150px] rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all"
    : "w-full rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 p-3 text-left transition-all group";

  return (
    <div className={mode === 'rail' ? "-mx-6 md:-mx-12 px-6 md:px-12" : ""}>
      {mode === 'rail' && (
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">Quick glance</div>
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">tap to open</div>
        </div>
      )}

      <div className={containerClasses}>
        {metrics.map((m) => {
          const Icon: any = iconFor(m.icon);
          const s = statusStyles(m.status);
          const active = activeKey === m.key;

          if (mode === 'rail') {
            return (
              <button
                key={m.key}
                onClick={() => onSelect?.(m.key)}
                aria-pressed={active}
                aria-label={`View details for ${m.label} (Current status: ${m.status}, Score: ${m.score})`}
                className={`${itemClasses} ${active ? `ring-2 ${s.ring}` : 'hover:bg-white/7'}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl border border-white/10 bg-black/20 flex items-center justify-center ${s.text}`}>
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.span
                      className={`w-2.5 h-2.5 rounded-full ${s.dot}`}
                      animate={{ opacity: [0.45, 1, 0.45], scale: [0.95, 1.05, 0.95] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-black text-white">{m.score}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm font-extrabold text-white/90">{m.label}</div>
                  <div className={`px-2 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.16em] ${s.chip}`}>
                    {m.status}
                  </div>
                </div>

                <div className="mt-2 text-xs font-semibold text-white/50">{m.hint}</div>
              </button>
            );
          }

          // List Mode (formerly Grid)
          return (
            <button
              key={m.key}
              onClick={() => onSelect?.(m.key)}
              className={`${itemClasses} ${active ? 'bg-white/10 ring-1 ring-white/10' : ''}`}
            >
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-black/20 ${s.text} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                   <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white/90 group-hover:text-white transition-colors">{m.label}</span>
                      <div className="flex items-center gap-2">
                         <span className={`text-[9px] font-black uppercase tracking-wider ${s.text} opacity-80`}>{m.status}</span>
                         <span className="text-xs font-black text-white bg-white/10 px-1.5 py-0.5 rounded">{m.score}</span>
                      </div>
                   </div>
                   
                   {/* Progress Bar */}
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${m.score}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full ${s.dot}`} 
                      />
                   </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickGlanceRail;