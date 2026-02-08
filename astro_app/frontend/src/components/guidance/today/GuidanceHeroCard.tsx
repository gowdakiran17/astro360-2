import { Bookmark, Share2, Timer, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-[2rem] overflow-hidden"
    >
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/60 to-pink-900/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(120,90,255,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,150,100,0.2),transparent_50%)]" />

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 backdrop-blur-[2px] bg-white/[0.02]" />

      {/* Animated glow orbs */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-[80px] animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-amber-500/15 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Border */}
      <div className="absolute inset-0 rounded-[2rem] border border-white/10" />

      <div className="relative p-6 md:p-8">
        {/* Header with badge */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Today's Focus</span>
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight">
                {hero.themeHeadline}
              </h2>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSave}
              aria-label={isSaved ? "Remove from saved" : "Save guidance"}
              className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${isSaved
                  ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                  : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                }`}
            >
              <Bookmark className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShare}
              aria-label="Share guidance"
              className="w-11 h-11 rounded-xl border border-white/10 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all"
              disabled={isSharing}
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Paragraphs */}
        <div className="space-y-4 mb-8">
          {hero.paragraphs.map((p: string, idx: number) => (
            <motion.p
              key={`${idx}-${p}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="text-base md:text-lg text-white/80 leading-relaxed font-medium"
            >
              {p}
            </motion.p>
          ))}
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Best Time Window */}
          {hero.bestWindow && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/20 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wide">Best Window</span>
              </div>
              <div className="text-xl font-black text-white">
                {hero.bestWindow.startTime}
                {hero.bestWindow.endTime ? ` – ${hero.bestWindow.endTime}` : ''}
              </div>
              {hero.bestWindow.label && (
                <p className="text-xs text-white/50 mt-1">{hero.bestWindow.label}</p>
              )}
            </motion.div>
          )}

          {/* Primary Focus */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 p-4"
          >
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wide mb-2">✨ Primary Focus</div>
            <div className="text-base font-bold text-white leading-snug">{hero.primaryFocus}</div>
          </motion.div>

          {/* Avoid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/10 border border-rose-500/20 p-4"
          >
            <div className="text-xs font-bold text-rose-300 uppercase tracking-wide mb-2">⚠️ Avoid Today</div>
            <div className="text-sm font-semibold text-white/90 leading-snug">{hero.avoidLine}</div>
          </motion.div>
        </div>

        {/* Cosmic Reason */}
        {hero.cosmicReason && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 flex items-start gap-2 p-4 rounded-xl bg-black/20 border border-white/5"
          >
            <span className="text-lg">🌙</span>
            <p className="text-sm text-white/60 leading-relaxed">{hero.cosmicReason}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default GuidanceHeroCard;
