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
import ScoreBreakdownPopover from './ScoreBreakdownPopover';

export interface QuickGlanceRailProps {
  metrics: GuidanceQuickMetric[];
  activeKey?: GuidanceQuickMetric['key'];
  onSelect?: (key: GuidanceQuickMetric['key']) => void;
  mode?: 'rail' | 'grid';
}

const statusStyles = (_status: GuidanceStatus, score: number) => {
  if (score >= 80) {
    return {
      gradient: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      ring: 'ring-emerald-400/40',
      dot: 'bg-emerald-400',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/20',
      chip: 'bg-emerald-400/15 border-emerald-400/30 text-emerald-300'
    };
  }
  if (score >= 60) {
    return {
      gradient: 'from-amber-500/20 to-yellow-500/10',
      border: 'border-amber-500/30',
      ring: 'ring-amber-400/40',
      dot: 'bg-amber-400',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/20',
      chip: 'bg-amber-400/15 border-amber-400/30 text-amber-300'
    };
  }
  if (score >= 40) {
    return {
      gradient: 'from-blue-500/20 to-indigo-500/10',
      border: 'border-blue-500/30',
      ring: 'ring-blue-400/40',
      dot: 'bg-blue-400',
      text: 'text-blue-400',
      glow: 'shadow-blue-500/20',
      chip: 'bg-blue-400/15 border-blue-400/30 text-blue-300'
    };
  }
  return {
    gradient: 'from-rose-500/20 to-pink-500/10',
    border: 'border-rose-500/30',
    ring: 'ring-rose-400/40',
    dot: 'bg-rose-400',
    text: 'text-rose-400',
    glow: 'shadow-rose-500/20',
    chip: 'bg-rose-400/15 border-rose-400/30 text-rose-300'
  };
};

const iconFor = (icon: GuidanceQuickMetric['icon']) => {
  switch (icon) {
    case 'mood': return Smile;
    case 'energy': return Zap;
    case 'career': return Briefcase;
    case 'money': return Coins;
    case 'relationships':
    case 'love': return Heart;
    case 'health': return Activity;
    case 'decisions': return MessageCircle;
    default: return Activity;
  }
};

const QuickGlanceRail = ({ metrics, activeKey, onSelect, mode = 'rail' }: QuickGlanceRailProps) => {

  if (mode === 'grid') {
    // Premium Grid/List Mode for sidebar
    return (
      <div className="space-y-2">
        {metrics.map((m, i) => {
          const Icon: any = iconFor(m.icon);
          const s = statusStyles(m.status, m.score);
          const active = activeKey === m.key;

          return (
            <motion.button
              key={m.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelect?.(m.key)}
              className={`w-full rounded-2xl border ${s.border} bg-gradient-to-r ${s.gradient} p-3 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${active ? `ring-2 ${s.ring}` : ''}`}
            >
              <div className="flex items-center gap-3">
                {/* Icon with glow */}
                <div className={`w-10 h-10 rounded-xl bg-black/30 flex items-center justify-center ${s.text} shadow-lg ${s.glow}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white">{m.label}</span>
                    <div className="flex items-center gap-2">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 + i * 0.05, type: 'spring' }}
                        className={`text-lg font-black ${s.text}`}
                      >
                        {m.score}
                      </motion.span>
                      <ScoreBreakdownPopover score={m.score} areaLabel={m.label} />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-black/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.score}%` }}
                      transition={{ duration: 0.8, delay: 0.1 + i * 0.05 }}
                      className={`h-full rounded-full ${s.dot}`}
                    />
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    );
  }

  // Rail Mode - Horizontal scrolling cards
  return (
    <div className="-mx-4 md:-mx-8 px-4 md:px-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">Daily Pulse</div>
        <div className="text-[10px] font-bold uppercase tracking-wide text-white/30">← Swipe →</div>
      </div>

      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {metrics.map((m, i) => {
          const Icon: any = iconFor(m.icon);
          const s = statusStyles(m.status, m.score);
          const active = activeKey === m.key;

          return (
            <motion.button
              key={m.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect?.(m.key)}
              className={`snap-start shrink-0 w-[160px] rounded-2xl border ${s.border} bg-gradient-to-br ${s.gradient} p-4 text-left transition-all backdrop-blur-sm ${active ? `ring-2 ${s.ring}` : ''}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-black/30 flex items-center justify-center ${s.text} shadow-lg ${s.glow}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-end">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.05, type: 'spring' }}
                    className={`text-2xl font-black ${s.text}`}
                  >
                    {m.score}
                  </motion.span>
                  <motion.span
                    className={`w-2 h-2 rounded-full ${s.dot}`}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>

              {/* Label */}
              <div className="text-sm font-bold text-white mb-1">{m.label}</div>

              {/* Status Chip */}
              <div className={`inline-block px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wide ${s.chip}`}>
                {m.status}
              </div>

              {/* Hint */}
              <div className="mt-2 text-[11px] font-medium text-white/50 line-clamp-2 leading-relaxed">{m.hint}</div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickGlanceRail;