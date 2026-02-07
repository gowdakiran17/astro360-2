import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Briefcase,
  ChevronDown,
  Coins,
  Heart,
  MessageCircle,
  Sparkles,
  Timer
} from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GuidanceArea, GuidanceRowCompact, GuidanceStatus } from '../../../types/guidance';

export interface LifeGuidanceAccordionProps {
  rows: GuidanceRowCompact[];
  openArea?: GuidanceArea;
  onOpenAreaChange?: (area: GuidanceArea | undefined) => void;
}

const colorForStatus = (status: GuidanceStatus) => {
  switch (status) {
    case 'favorable':
      return { rail: 'bg-emerald-400', text: 'text-emerald-200', glow: 'shadow-[0_0_24px_rgba(52,211,153,0.15)]' };
    case 'excellent':
        return { rail: 'bg-green-400', text: 'text-green-200', glow: 'shadow-[0_0_24px_rgba(52,211,153,0.15)]' };
    case 'caution':
      return { rail: 'bg-rose-400', text: 'text-rose-200', glow: 'shadow-[0_0_24px_rgba(251,113,133,0.12)]' };
    case 'sensitive':
        return { rail: 'bg-purple-400', text: 'text-purple-200', glow: 'shadow-[0_0_24px_rgba(168,85,247,0.15)]' };
    default:
      return { rail: 'bg-amber-300', text: 'text-amber-200', glow: 'shadow-[0_0_24px_rgba(252,211,77,0.10)]' };
  }
};

const iconForArea = (area: GuidanceArea) => {
  switch (area) {
    case 'CAREER_WORK':
      return Briefcase;
    case 'WEALTH_MONEY':
      return Coins;
    case 'RELATIONSHIPS':
      return Heart;
    case 'HEALTH_ENERGY':
      return Activity;
    case 'DECISIONS_COMMUNICATION':
      return MessageCircle;
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
    <div className="rounded-[2rem] border border-white/10 bg-white/5 overflow-hidden">
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">Today’s Life Guidance</div>
            <div className="mt-1 text-lg font-black tracking-tight text-white">What to focus on, gently</div>
          </div>
          <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
            <Sparkles className="w-3.5 h-3.5 text-[#F5A623]" />
            Tap to expand
          </div>
        </div>
      </div>

      <div className="mt-4">
        {ordered.map((row) => {
          const isOpen = openArea === row.area;
          const Icon: any = iconForArea(row.area);
          const c = colorForStatus(row.status);

          return (
            <div key={row.area} className="border-t border-white/10">
              <button
                onClick={() => onOpenAreaChange?.(isOpen ? undefined : row.area)}
                className="w-full px-6 py-5 text-left flex items-start gap-4 hover:bg-white/[0.03] transition-colors"
              >
                <div className={`w-1.5 rounded-full ${c.rail} ${c.glow}`} style={{ height: 44 }} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl border border-white/10 bg-black/20 flex items-center justify-center ${c.text}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-white/90">{row.label}</span>
                          <span className={`text-[10px] font-black uppercase tracking-[0.16em] ${c.text}`}>{row.status}</span>
                        </div>
                        <div className="mt-1 text-xs font-semibold text-white/55 truncate">{row.oneLineFocus}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">Score</div>
                        <div className="text-base font-black text-white">{row.score}</div>
                      </div>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                        <ChevronDown className="w-5 h-5 text-white/35" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-1 space-y-4">
                      <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">Overall tone</div>
                        <div className="mt-1 text-sm font-bold text-white/85">{row.expanded.tone}</div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 space-y-2">
                        {row.expanded.guidanceLines.slice(0, 3).map((l: string, idx: number) => (
                          <div key={`${idx}-${l}`} className="text-sm text-white/70 leading-relaxed">
                            {l}
                          </div>
                        ))}
                      </div>

                      {row.expanded.bestWindow ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-white/60">
                            <Timer className="w-4 h-4 text-[#6D5DF6]" />
                            Best time window
                          </div>
                          <div className="text-sm font-black text-white">
                            {row.expanded.bestWindow.startTime}
                            {row.expanded.bestWindow.endTime ? ` – ${row.expanded.bestWindow.endTime}` : ''}
                          </div>
                        </div>
                      ) : null}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 px-4 py-3">
                          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200/70">Good for today</div>
                          <ul className="mt-2 space-y-2 text-sm text-emerald-100/80">
                            {row.expanded.goodFor.slice(0, 2).map((g: string, idx: number) => (
                              <li key={`${idx}-${g}`} className="flex items-start gap-2">
                                <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-emerald-300 shrink-0" />
                                <span>{g}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-2xl border border-rose-400/15 bg-rose-400/5 px-4 py-3">
                          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-rose-200/70">Avoid today</div>
                          <ul className="mt-2 space-y-2 text-sm text-rose-100/80">
                            {row.expanded.avoid.slice(0, 2).map((a: string, idx: number) => (
                              <li key={`${idx}-${a}`} className="flex items-start gap-2">
                                <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-rose-300 shrink-0" />
                                <span>{a}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">Focus advice</div>
                        <div className="mt-1 text-sm font-semibold text-white/80">{row.expanded.focusAdvice}</div>
                      </div>

                      <button
                        onClick={() => navigate(`/ai-astrologer?topic=${row.expanded.askAiTopic}&mode=today`)}
                        className="w-full h-12 rounded-2xl border border-[#6D5DF6]/25 bg-[#6D5DF6]/15 hover:bg-[#6D5DF6]/20 text-white font-black uppercase tracking-[0.14em] text-xs transition-all"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Ask AI about this today
                        </span>
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LifeGuidanceAccordion;
