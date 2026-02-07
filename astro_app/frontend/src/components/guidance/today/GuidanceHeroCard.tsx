import { Bookmark, Share2, Timer } from 'lucide-react';
import { GuidanceHero } from '../../../types/guidance';

export interface GuidanceHeroCardProps {
  hero: GuidanceHero;
  onSave?: () => void;
  onShare?: () => void;
  isSaved?: boolean;
  isSharing?: boolean;
}

const GuidanceHeroCard = ({ hero, onSave, onShare, isSaved, isSharing }: GuidanceHeroCardProps) => {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.05)] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
      <div className="relative p-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-purple-600/15 blur-[90px]" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-amber-500/12 blur-[90px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/[0.02] to-white/0" />
        </div>

        <div className="relative">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
               <div className="min-w-0">
                 <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse" />
                   Today's Focus
                 </div>
                 <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
                   {hero.themeHeadline}
                 </h2>
               </div>
               
               {/* Actions moved to bottom on mobile, right on desktop if space permits */}
               <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <button
                    onClick={onSave}
                    aria-label={isSaved ? "Remove from saved" : "Save guidance"}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                      isSaved
                        ? 'bg-[#F5A623]/15 border-[#F5A623]/25 text-[#F5A623]'
                        : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    onClick={onShare}
                    aria-label="Share guidance"
                    className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all"
                    disabled={isSharing}
                  >
                    <Share2 className="w-4 h-4" aria-hidden="true" />
                  </button>
               </div>
            </div>

            <div className="space-y-3 text-sm md:text-base text-white/70 leading-relaxed font-medium max-w-2xl">
              {hero.paragraphs.map((p: string, idx: number) => (
                <p key={`${idx}-${p}`}>{p}</p>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {hero.bestWindow ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white/60">
                    <Timer className="w-4 h-4 text-[#6D5DF6]" />
                    Best time window
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
                    {hero.bestWindow.label}
                  </div>
                </div>
                <div className="mt-1 text-lg font-black text-white">
                  {hero.bestWindow.startTime}
                  {hero.bestWindow.endTime ? ` – ${hero.bestWindow.endTime}` : ''}
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-xs font-bold text-white/70">Primary focus</div>
                <div className="mt-1 text-base font-extrabold text-white">{hero.primaryFocus}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-xs font-bold text-white/70">One thing to avoid</div>
                <div className="mt-1 text-sm font-semibold text-white/90">{hero.avoidLine}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidanceHeroCard;
