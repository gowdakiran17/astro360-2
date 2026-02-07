import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';

type PullState = {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
};

export interface StickyTodayHeaderProps {
  greeting: string;
  profileName: string;
  weekdayLabel: string;
  dateLabel: string;
  vedicLine: string;
  moonPhaseName: string;
  moonIllumination?: number;
  streak: number;
  pull: PullState;
}

const moonGlyph = (phaseName: string, illumination?: number) => {
  const illum = typeof illumination === 'number' ? illumination : 50;
  const name = (phaseName || '').toLowerCase();
  if (name.includes('new')) return '🌑';
  if (name.includes('full')) return '🌕';
  if (name.includes('waxing')) {
    if (illum < 25) return '🌒';
    if (illum < 50) return '🌓';
    if (illum < 75) return '🌔';
    return '🌔';
  }
  if (name.includes('waning')) {
    if (illum < 25) return '🌘';
    if (illum < 50) return '🌗';
    if (illum < 75) return '🌖';
    return '🌖';
  }
  return '🌙';
};

const pullLabel = (pull: PullState) => {
  if (pull.isRefreshing) return 'Refreshing…';
  if (pull.pullDistance >= 72) return 'Release to refresh';
  if (pull.isPulling) return 'Pull to refresh';
  return '';
};

const FirePill = ({ streak }: { streak: number }) => {
  return (
    <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 overflow-hidden">
      <div className="absolute inset-0 opacity-50">
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500/30 via-orange-500/10 to-transparent blur-2xl animate-pulse" />
        <div className="absolute -right-14 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500/20 via-amber-500/10 to-transparent blur-2xl animate-pulse" />
      </div>
      <motion.div
        initial={{ y: 2, opacity: 0.7 }}
        animate={{ y: [2, -1, 2], opacity: [0.65, 0.9, 0.65] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="relative text-base leading-none select-none"
        aria-hidden="true"
      >
        🔥
      </motion.div>
      <div className="relative flex items-baseline gap-1">
        <span className="text-sm font-black tracking-tight text-white">{streak}</span>
        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/60">day</span>
      </div>
    </div>
  );
};

const StickyTodayHeader = (props: StickyTodayHeaderProps) => {
  const glyph = moonGlyph(props.moonPhaseName, props.moonIllumination);
  const pullText = pullLabel(props.pull);

  return (
    <div className="sticky top-16 z-[70] -mx-3 md:-mx-12 px-3 md:px-12 pt-4 pb-4 bg-[#0B0F1A]/85 backdrop-blur-xl border-b border-white/5 transition-all">
      <div className="max-w-xl mx-auto">
        {/* Pull to refresh indicator */}
        <div className="h-6 mb-1 relative overflow-hidden">
          {pullText && (
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                  <div className="w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin" style={{ display: props.pull.isRefreshing ? 'block' : 'none' }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">{pullText}</span>
               </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">
              <span>{props.greeting}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="truncate max-w-[100px]">{props.profileName}</span>
            </div>

            <div className="mt-0.5 flex items-baseline gap-2 text-white">
              <h1 className="text-xl font-black tracking-tight leading-none">
                {props.weekdayLabel}
              </h1>
              <span className="text-sm font-semibold text-white/40">{props.dateLabel}</span>
            </div>

            <div className="mt-1.5 flex items-center gap-3 text-[11px] font-semibold text-white/60">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                 <Moon className="w-3 h-3 text-[#6D5DF6]" />
                 <span className="truncate max-w-[120px]">{props.vedicLine}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                <span aria-hidden="true" className="text-xs leading-none">{glyph}</span>
                <span className="truncate">{props.moonPhaseName}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 self-center">
             <FirePill streak={props.streak} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyTodayHeader;

