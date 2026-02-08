import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Briefcase,
  ChevronDown,
  Coins,
  Heart,
  MessageCircle,
  Sparkles,
  Timer,
  TrendingUp
} from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GuidanceArea, GuidanceRowCompact, GuidanceStatus } from '../../../types/guidance';

export interface LifeGuidanceAccordionProps {
  rows: GuidanceRowCompact[];
  openArea?: GuidanceArea;
  onOpenAreaChange?: (area: GuidanceArea | undefined) => void;
}

const colorForStatus = (_status: GuidanceStatus, score: number) => {
  if (score >= 80) {
    return {
      rail: 'bg-gradient-to-b from-emerald-400 to-emerald-500',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_30px_rgba(52,211,153,0.25)]',
      bg: 'bg-gradient-to-r from-emerald-500/15 to-teal-500/10',
      border: 'border-emerald-500/25'
    };
  }
  if (score >= 60) {
    return {
      rail: 'bg-gradient-to-b from-amber-400 to-orange-500',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_30px_rgba(251,191,36,0.20)]',
      bg: 'bg-gradient-to-r from-amber-500/15 to-yellow-500/10',
      border: 'border-amber-500/25'
    };
  }
  if (score >= 40) {
    return {
      rail: 'bg-gradient-to-b from-blue-400 to-indigo-500',
      text: 'text-blue-400',
      glow: 'shadow-[0_0_30px_rgba(96,165,250,0.20)]',
      bg: 'bg-gradient-to-r from-blue-500/15 to-indigo-500/10',
      border: 'border-blue-500/25'
    };
  }
  return {
    rail: 'bg-gradient-to-b from-rose-400 to-pink-500',
    text: 'text-rose-400',
    glow: 'shadow-[0_0_30px_rgba(251,113,133,0.20)]',
    bg: 'bg-gradient-to-r from-rose-500/15 to-pink-500/10',
    border: 'border-rose-500/25'
  };
};

const iconForArea = (area: GuidanceArea) => {
  switch (area) {
    case 'CAREER_WORK': return Briefcase;
    case 'WEALTH_MONEY': return Coins;
    case 'RELATIONSHIPS': return Heart;
    case 'HEALTH_ENERGY': return Activity;
    case 'DECISIONS_COMMUNICATION': return MessageCircle;
  }
};

const LifeGuidanceAccordion = ({ rows, openArea, onOpenAreaChange }: LifeGuidanceAccordionProps) => {
  const navigate = useNavigate();

  const ordered = useMemo(() => {
    const order: GuidanceArea[] = ['CAREER_WORK', 'WEALTH_MONEY', 'RELATIONSHIPS', 'HEALTH_ENERGY', 'DECISIONS_COMMUNICATION'];
    const map = new Map(rows.map((r) => [r.area, r]));
    return order.map((a) => map.get(a)).filter(Boolean) as GuidanceRowCompact[];
  }, [rows]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-[2rem] overflow-hidden"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/50 to-slate-900/80" />
      <div className="absolute inset-0 backdrop-blur-sm" />
      <div className="absolute inset-0 rounded-[2rem] border border-white/10" />

      {/* Decorative orbs */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px]" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">Life Guidance</div>
                <div className="text-lg font-black tracking-tight text-white">Today's Focus Areas</div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-white/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Tap to expand
            </div>
          </div>
        </div>

        {/* Accordion Items */}
        <div className="pb-2">
          {ordered.map((row, i) => {
            const isOpen = openArea === row.area;
            const Icon: any = iconForArea(row.area);
            const c = colorForStatus(row.status, row.score);

            return (
              <motion.div
                key={row.area}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="mx-3 mb-2"
              >
                <button
                  onClick={() => onOpenAreaChange?.(isOpen ? undefined : row.area)}
                  className={`w-full rounded-2xl ${c.bg} ${c.border} border px-4 py-4 text-left transition-all hover:scale-[1.01] active:scale-[0.99]`}
                >
                  <div className="flex items-center gap-4">
                    {/* Score Rail */}
                    <div className={`w-1.5 h-12 rounded-full ${c.rail} ${c.glow}`} />

                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-xl bg-black/30 flex items-center justify-center ${c.text} shadow-lg`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-white">{row.label}</span>
                        <span className={`text-[10px] font-black uppercase tracking-wide ${c.text}`}>{row.status}</span>
                      </div>
                      <div className="text-xs font-medium text-white/50 truncate">{row.oneLineFocus}</div>
                    </div>

                    {/* Score & Chevron */}
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 + i * 0.05, type: 'spring' }}
                          className={`text-2xl font-black ${c.text}`}
                        >
                          {row.score}
                        </motion.span>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
                      >
                        <ChevronDown className="w-4 h-4 text-white/40" />
                      </motion.div>
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 pb-2 px-2 space-y-3">
                        {/* Tone */}
                        <div className="rounded-xl bg-black/20 border border-white/5 p-4">
                          <div className="text-[10px] font-black uppercase tracking-wide text-white/40 mb-1">Overall Tone</div>
                          <div className="text-sm font-semibold text-white/85">{row.expanded.tone}</div>
                        </div>

                        {/* Guidance Lines */}
                        <div className="rounded-xl bg-white/5 border border-white/5 p-4 space-y-2">
                          {row.expanded.guidanceLines.slice(0, 3).map((l: string, idx: number) => (
                            <p key={`${idx}-${l}`} className="text-sm text-white/70 leading-relaxed">{l}</p>
                          ))}
                        </div>

                        {/* Best Window */}
                        {row.expanded.bestWindow && (
                          <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-bold text-indigo-300">
                              <Timer className="w-4 h-4" />
                              Best Time
                            </div>
                            <div className="text-base font-black text-white">
                              {row.expanded.bestWindow.startTime}
                              {row.expanded.bestWindow.endTime ? ` – ${row.expanded.bestWindow.endTime}` : ''}
                            </div>
                          </div>
                        )}

                        {/* Good/Avoid Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3">
                            <div className="text-[10px] font-black uppercase tracking-wide text-emerald-300 mb-2">✓ Good For</div>
                            <ul className="space-y-1">
                              {row.expanded.goodFor.slice(0, 2).map((g: string, idx: number) => (
                                <li key={`${idx}-${g}`} className="text-xs text-emerald-100/80 flex items-start gap-2">
                                  <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                  {g}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3">
                            <div className="text-[10px] font-black uppercase tracking-wide text-rose-300 mb-2">✗ Avoid</div>
                            <ul className="space-y-1">
                              {row.expanded.avoid.slice(0, 2).map((a: string, idx: number) => (
                                <li key={`${idx}-${a}`} className="text-xs text-rose-100/80 flex items-start gap-2">
                                  <span className="w-1 h-1 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                                  {a}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Focus Advice */}
                        <div className="rounded-xl bg-white/5 border border-white/5 p-4">
                          <div className="text-[10px] font-black uppercase tracking-wide text-white/40 mb-1">Focus Advice</div>
                          <div className="text-sm font-medium text-white/80">{row.expanded.focusAdvice}</div>
                        </div>

                        {/* AI Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/ai-astrologer?topic=${row.expanded.askAiTopic}&mode=today`)}
                          className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm transition-all shadow-lg shadow-purple-500/20"
                        >
                          <span className="inline-flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Ask AI for Details
                          </span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default LifeGuidanceAccordion;
