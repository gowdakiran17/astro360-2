import React from 'react';
import { RefreshCw, Clock, Zap, Info, Pin, Copy, Share2, Edit, CheckCircle, Coins, Palette, Smile, Users, ChevronDown, Star } from 'lucide-react';
import { computeStatusAndTiming } from '../../../utils/astroNarrative';
import StatusLegend from './StatusLegend';

interface DailyHoroscopesProps {
  dailyHoroscopeData?: any;
  onRefresh?: () => void;
  mode?: 'summary' | 'full';
}

const LifeAreaTile = ({ card, onClick }: { card: any, narrative?: any, onClick: () => void }) => {
  const score = Number(card.favorability) || 70.4;
  const rating = card.favorability_label || (score >= 80 ? 'Excellent' : score >= 60 ? 'Moderate' : 'Caution');
  const statusColor = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-rose-400';
  const barColor = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-start justify-between p-4 rounded-xl border border-stone-800 bg-stone-900/50 hover:bg-stone-900 hover:border-amber-500/30 transition-all group w-full text-left"
    >
      <div className="flex items-start justify-between w-full mb-3 gap-2">
        <div className="flex-shrink-0 p-2 rounded-lg bg-stone-950 border border-stone-800 text-stone-400 group-hover:text-amber-500 transition-colors">
           <span className="text-lg">{card.icon}</span>
        </div>
        <div className={`text-[9px] font-bold uppercase tracking-wider ${statusColor} text-right mt-0.5`}>
          {rating}
        </div>
      </div>
      
      <div className="w-full">
        <h3 className="text-xs font-semibold text-stone-200 mb-1">{card.life_area}</h3>
        <div className="h-1 w-full bg-stone-800 rounded-full overflow-hidden">
          <div className={`h-full ${barColor}`} style={{ width: `${score}%` }} />
        </div>
      </div>
    </button>
  );
};

const MobileCard = ({ card, narrative, compact = false, onRetry }: { card: any, narrative: any, compact?: boolean, onRetry?: () => void }) => {
  const score = Number(card.favorability) || 70.4;
  const rating = card.favorability_label || (score >= 80 ? 'Excellent' : score >= 60 ? 'Moderate' : 'Caution');
  const barColor = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500';
  const [showWhy, setShowWhy] = React.useState(false);
  const [pinned, setPinned] = React.useState(false);
  const [showNote, setShowNote] = React.useState(false);
  const [note, setNote] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});
  const whyText = [
    card.dasha_context?.theme && `Dasha: ${card.dasha_context.theme}`,
    card.transit_trigger?.effect && `Transit: ${card.transit_trigger.effect}`,
    card.nakshatra_context?.theme && `Nakshatra: ${card.nakshatra_context.theme}`,
  ].filter(Boolean).join(' • ');
  const isError = typeof card.synthesis === 'string' && /trouble connecting|please try again later/i.test(card.synthesis);
  const fallbackText = [
    card.life_area && `Focus: ${card.life_area}`,
    card.dasha_context?.theme && `Dasha suggests ${card.dasha_context.theme.toLowerCase()}`,
    card.transit_trigger?.effect && `Transit indicates ${card.transit_trigger.effect.toLowerCase()}`,
    card.nakshatra_context?.current_nakshatra && `Nakshatra ${card.nakshatra_context.current_nakshatra}`
  ].filter(Boolean).join('. ');
  const statusColor =
    narrative.status === 'PROMISED'
      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-700'
      : narrative.status === 'DELAYED'
      ? 'bg-amber-600/20 text-amber-300 border-amber-700'
      : 'bg-rose-600/20 text-rose-300 border-rose-700';
  const base = narrative?.base_scores || {};
  const isFavorable = narrative.status === 'PROMISED' && Boolean(narrative.timing_window?.label);
  const timingLabel = typeof narrative?.timing_window?.label === 'string' ? narrative.timing_window.label.trim() : '';
  const showTimingChip = Boolean(timingLabel) && !/favorable window/i.test(timingLabel);
  const parseCountdown = () => {
    const t = card?.optimal_action?.timing;
    if (!t || typeof t !== 'string') return null;
    const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!m) return null;
    let hh = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    const ampm = m[3].toUpperCase();
    if (ampm === 'PM' && hh !== 12) hh += 12;
    if (ampm === 'AM' && hh === 12) hh = 0;
    const now = new Date();
    const target = new Date();
    target.setHours(hh, mm, 0, 0);
    const diffMs = target.getTime() - now.getTime();
    if (diffMs <= 0) return null;
    const mins = Math.round(diffMs / 60000);
    return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };
  const countdown = parseCountdown();
  const handleCopy = async () => {
    const text = `${card.life_area}: ${card.synthesis || fallbackText}\nAction: ${card.optimal_action?.action || ''}\nTiming: ${card.optimal_action?.timing || ''}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };
  const handleShare = async () => {
    const title = `${card.life_area} Guidance`;
    const text = `${card.synthesis || fallbackText}\nAction: ${card.optimal_action?.action || ''}\nTiming: ${card.optimal_action?.timing || ''}`;
    if ((navigator as any).share) {
      try { await (navigator as any).share({ title, text }); } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      await handleCopy();
    }
  };
  return (
    <div className="relative rounded-2xl border border-stone-800 bg-stone-950 p-4 shadow-lg h-full flex flex-col">
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
            <span className="text-xl">{card.icon}</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-200 uppercase tracking-wide">{card.life_area}</h3>
            {typeof card.ai_confidence === 'number' && (
              <p className="text-[10px] text-stone-500 font-mono">Confidence {card.ai_confidence}%</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between xl:flex-col xl:items-end xl:gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-100 tracking-tight">{score.toFixed(1)}%</span>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">{rating}</span>
          </div>
          <div className="flex items-center gap-2">
             <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border ${statusColor} text-[10px] font-bold uppercase tracking-wider`}
              title={narrative.status === 'PROMISED' ? 'Outcome supported' : narrative.status === 'DELAYED' ? 'Outcome possible later' : 'Outcome unlikely now'}
            >
              {narrative.status}
            </span>
            <button
              onClick={() => setPinned(!pinned)}
              aria-pressed={pinned}
              className={`p-1.5 rounded-lg border transition-colors ${pinned ? 'border-amber-500/40 bg-amber-600/20 text-amber-200' : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200'} xl:hidden`}
              title={pinned ? 'Pinned' : 'Pin'}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        
        <button
          onClick={() => setPinned(!pinned)}
          aria-pressed={pinned}
          className={`hidden xl:flex absolute top-4 right-4 p-2 rounded-lg border transition-colors ${pinned ? 'border-amber-500/40 bg-amber-600/20 text-amber-200' : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200'}`}
          title={pinned ? 'Pinned' : 'Pin'}
        >
          <Pin className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-4">
        <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
          <div className={`h-full ${barColor}`} style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
        </div>
      </div>

      <div className="flex flex-wrap md:flex-nowrap items-center gap-2 mb-2">
        {showTimingChip && (
          <span className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-800 bg-stone-900 text-[10px] font-medium text-stone-300 whitespace-nowrap">
            <Clock className="w-3 h-3 text-stone-400" />
            {timingLabel}
          </span>
        )}
        {isFavorable && (
          <span className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-800/50 bg-emerald-900/20 text-[10px] font-medium text-emerald-300 whitespace-nowrap">
            <CheckCircle className="w-3 h-3" />
            Favorable window
          </span>
        )}
        {base && (base.dasha || base.transit || base.nakshatra) && (
          <span className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-800 bg-stone-900 text-[10px] font-mono text-stone-400 whitespace-nowrap">
            <span className="text-stone-500">D</span> {Math.round(base.dasha || 0)}
            <span className="mx-1 opacity-30">|</span>
            <span className="text-stone-500">T</span> {Math.round(base.transit || 0)}
            <span className="mx-1 opacity-30">|</span>
            <span className="text-stone-500">N</span> {Math.round(base.nakshatra || 0)}
          </span>
        )}
      </div>
      {!compact && (
      <div className="mt-4 pt-4 border-t border-stone-800">
        <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-stone-400">
          <span className="w-3 h-3 rounded-full bg-stone-700" />
          Analysis
          <button
            className="ml-auto text-stone-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
            onClick={() => setShowWhy(!showWhy)}
            aria-expanded={showWhy}
            aria-controls={`why-${card.life_area}`}
          >
            <Info className="w-3 h-3" />
            Why this?
          </button>
        </div>
        <p className="text-sm text-stone-300 leading-relaxed">{isError ? (fallbackText || 'Guidance temporarily unavailable') : card.synthesis}</p>
        {showWhy && (
          <div id={`why-${card.life_area}`} className="mt-3 p-3 bg-stone-800/50 border border-stone-700 rounded-lg text-xs text-stone-300">
            {whyText || 'Factors unavailable'}
          </div>
        )}
      </div>
      )}
      {/* Predictions Accordion */}
      {!compact && (
        <div className="mt-4 space-y-2">
          {[
            { key: 'dasha', label: 'Cosmic Climate', icon: Clock },
            { key: 'transit', label: 'Planetary Alignment', icon: Zap },
            { key: 'nakshatra', label: 'Star Power', icon: Star },
            { key: 'lucky', label: 'Lucky Signal', icon: Palette },
            { key: 'advice', label: 'Daily Wisdom', icon: CheckCircle },
            { key: 'compatibility', label: 'Power Sign', icon: Users },
            { key: 'mood', label: 'Mood Meter', icon: Smile },
          ].map(({ key, label, icon: Icon }) => {
            const data = card?.predictions?.[key];
            const dashaTheme = card.dasha_context?.theme;
            const transitEffect = card.transit_trigger?.effect;
            const nakshatraTheme = card.nakshatra_context?.theme;
            const advice = data?.text || card.optimal_action?.action;

            let hasData = false;
            if (key === 'dasha') hasData = !!dashaTheme;
            else if (key === 'transit') hasData = !!transitEffect;
            else if (key === 'nakshatra') hasData = !!nakshatraTheme;
            else if (key === 'lucky') hasData = (data || card?.lucky || {}).color || (data || card?.lucky || {}).number;
            else if (key === 'mood') hasData = !!data?.label;
            else if (key === 'advice') hasData = !!advice;
            else if (key === 'compatibility') hasData = typeof data?.text === 'string' && data.text.length > 0;
            
            if (!hasData) return null;

            const isOpen = !!openSections[key];
            const lucky = key === 'lucky' ? data || card?.lucky || {} : {};

            return (
              <div key={key} className="rounded-xl border border-stone-800 bg-stone-900">
                <button
                  className="w-full flex items-center justify-between px-3 py-2"
                  onClick={() => setOpenSections((s) => ({ ...s, [key]: !isOpen }))}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-stone-300" />
                    <span className="text-xs font-semibold text-stone-200">{label}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`px-3 pb-3 ${isOpen ? 'block' : 'hidden'}`}>
                  {key === 'lucky' ? (
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-300">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-stone-800 bg-stone-950">
                        <Palette className="w-3 h-3 text-stone-400" /> Color: {lucky.color || '—'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-stone-800 bg-stone-950">
                        <Clock className="w-3 h-3 text-stone-400" /> Time: {lucky.time || card?.optimal_action?.timing || '—'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-stone-800 bg-stone-950">
                        <Coins className="w-3 h-3 text-stone-400" /> Number: {lucky.number || '—'}
                      </span>
                    </div>
                  ) : key === 'mood' ? (
                    <div className="space-y-2">
                      <div className="h-2 rounded-full bg-stone-800 overflow-hidden">
                        <div
                          className="h-full bg-amber-600"
                          style={{ width: `${Math.min(100, Math.max(0, Number(data?.score ?? 0)))}%` }}
                        />
                      </div>
                      <p className="text-[12px] text-stone-300">{data?.label || 'Mood unavailable'}</p>
                    </div>
                  ) : key === 'dasha' ? (
                     <p className="text-[12px] leading-relaxed text-stone-300">{dashaTheme}</p>
                  ) : key === 'transit' ? (
                     <p className="text-[12px] leading-relaxed text-stone-300">{transitEffect}</p>
                  ) : key === 'nakshatra' ? (
                     <p className="text-[12px] leading-relaxed text-stone-300">{nakshatraTheme}</p>
                  ) : key === 'advice' ? (
                     <p className="text-[12px] leading-relaxed text-stone-300">{advice}</p>
                  ) : (
                    <p className="text-[12px] leading-relaxed text-stone-300">{data?.text}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {Array.isArray(narrative.tokens) && narrative.tokens.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {narrative.tokens.map((t: string, i: number) => (
            <span
              key={i}
              className="inline-flex px-2 py-1 rounded-lg border border-stone-800 bg-stone-950 text-[10px] text-stone-300"
              title="Non-interpretive token"
            >
              {t}
            </span>
          ))}
        </div>
      )}
        <div className="mt-4 rounded-xl border border-stone-800 bg-stone-900 p-4">
        <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-amber-300">
          <Zap className="w-3 h-3" /> Recommendation
        </div>
        <p className="text-sm text-stone-200">{card.optimal_action?.action}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-stone-800 bg-stone-950 text-xs text-stone-300">
            <Clock className="w-3 h-3 text-stone-400" /> {card.optimal_action?.timing}
          </span>
          {countdown && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-stone-800 bg-stone-950 text-xs text-stone-300">
              <Clock className="w-3 h-3 text-stone-400" /> in {countdown}
            </span>
          )}
          {Array.isArray(card.optimal_action?.cta_buttons) && card.optimal_action.cta_buttons.length > 0 ? (
            <>
              <button className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold">
                {card.optimal_action.cta_buttons[0].label}
              </button>
              {card.optimal_action.cta_buttons[1] && (
                <button className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold">
                  {card.optimal_action.cta_buttons[1].label}
                </button>
              )}
            </>
          ) : (
            <button className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold">
              Plan it
            </button>
          )}
          <button onClick={handleCopy} className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold inline-flex items-center gap-1">
            <Copy className="w-3 h-3" />
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button onClick={handleShare} className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold inline-flex items-center gap-1">
            <Share2 className="w-3 h-3" />
            Share
          </button>
          <button onClick={() => setShowNote(!showNote)} className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold inline-flex items-center gap-1">
            <Edit className="w-3 h-3" />
            Note
          </button>
          {onRetry && isError && (
            <button onClick={onRetry} className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold inline-flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          )}
        </div>
        {showNote && (
          <div className="mt-3">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a personal note"
              className="w-full px-3 py-2 rounded-lg border border-stone-800 bg-stone-950 text-sm text-stone-200"
              rows={2}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const DailyHoroscopes: React.FC<DailyHoroscopesProps> = ({ dailyHoroscopeData, onRefresh, mode = 'full' }) => {
    const [filterStatus, setFilterStatus] = React.useState<'ALL' | 'PROMISED' | 'DELAYED' | 'DENIED'>('ALL');
    const [sortKey, setSortKey] = React.useState<'favorability' | 'confidence'>('favorability');
    const [compact, setCompact] = React.useState<boolean>(false);
    const [showLegend, setShowLegend] = React.useState<boolean>(false);
    const [selectedLifeArea, setSelectedLifeArea] = React.useState<string | null>(null);

    if (!dailyHoroscopeData) {
        return (
            <div className="w-full py-10">
                <div className="flex flex-col items-center justify-center gap-6">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 rounded-full border-4 border-amber-500/20" />
                        <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 animate-spin" />
                        <RefreshCw className="absolute inset-0 m-auto w-8 h-8 text-amber-400" />
                    </div>
                </div>
            </div>
        );
    }

    const withNarrative = dailyHoroscopeData.horoscopes.map((card: any) => {
      const narrative = computeStatusAndTiming({
        dasha: card.dasha_context || {},
        transit: card.transit_trigger || {},
        nakshatra: card.nakshatra_context || {}
      });
      return { card, narrative };
    });

    // If summary mode and no card selected, show tiles
    if (mode === 'summary' && !selectedLifeArea) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {withNarrative.map(({ card, narrative }: any, index: number) => (
            <LifeAreaTile 
              key={index} 
              card={card} 
              narrative={narrative} 
              onClick={() => setSelectedLifeArea(card.life_area)} 
            />
          ))}
        </div>
      );
    }

    // If summary mode AND card selected, show detail with back button
    if (mode === 'summary' && selectedLifeArea) {
      const selected = withNarrative.find(({ card }: any) => card.life_area === selectedLifeArea);
      return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
           <button 
             onClick={() => setSelectedLifeArea(null)}
             className="flex items-center gap-2 text-sm font-medium text-stone-400 hover:text-amber-500 transition-colors"
           >
             <ChevronDown className="w-4 h-4 rotate-90" /> Back to Summary
           </button>
           {selected && (
             <MobileCard card={selected.card} narrative={selected.narrative} compact={false} onRetry={onRefresh} />
           )}
        </div>
      );
    }

    const filtered = withNarrative.filter(({ narrative }: any) => {
      if (filterStatus === 'ALL') return true;
      return narrative.status === filterStatus;
    });

    const sorted = filtered.sort((a: any, b: any) => {
      if (sortKey === 'confidence') return (b.narrative.confidence || 0) - (a.narrative.confidence || 0);
      return (Number(b.card.favorability) || 0) - (Number(a.card.favorability) || 0);
    });

    return (
      <div className="w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-stone-100 tracking-tight">Daily Horoscopes</h3>
            <span className="px-2 py-1 rounded-full bg-stone-900 border border-stone-800 text-xs font-medium text-stone-400">
              {dailyHoroscopeData.date}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-stone-800 bg-stone-900/50 hover:bg-stone-900 text-xs font-medium text-stone-300 transition-colors"
              aria-expanded={showLegend}
            >
              <Info className="w-3.5 h-3.5" />
              Legend
            </button>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="inline-flex items-center gap-2 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-amber-900/20 transition-all active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-stone-900/30 p-1 rounded-xl">
          <div className="flex items-center bg-stone-900 rounded-lg p-1 border border-stone-800">
            {(['ALL', 'PROMISED', 'DELAYED', 'DENIED'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                  filterStatus === s 
                    ? 'bg-stone-800 text-white shadow-sm' 
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 ml-auto w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as any)}
                className="w-full sm:w-40 appearance-none px-3 py-2 pl-9 rounded-lg border border-stone-800 bg-stone-900 text-xs text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="favorability">Sort: Favorability</option>
                <option value="confidence">Sort: Confidence</option>
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                 <svg className="w-3 h-3 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                 </svg>
              </div>
            </div>
            
            <button
              onClick={() => setCompact(!compact)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                compact 
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' 
                  : 'border-stone-800 bg-stone-900 text-stone-300 hover:bg-stone-800'
              }`}
            >
              {compact ? (
                <><ChevronDown className="w-3.5 h-3.5 rotate-180" /> Compact</>
              ) : (
                <><ChevronDown className="w-3.5 h-3.5" /> Expanded</>
              )}
            </button>
          </div>
        </div>

        {showLegend && <StatusLegend />}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {sorted.map(({ card, narrative }: any, index: number) => (
            <MobileCard key={index} card={card} narrative={narrative} compact={compact} onRetry={onRefresh} />
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-stone-800 bg-stone-900/50">
          <span className="text-[10px] text-stone-400">
            Engine: Vedic dashas, transit, and nakshatra.
          </span>
          <span className="text-[10px] text-stone-500">
            v2.1.0 • No planetary positions computed in UI
          </span>
        </div>
      </div>
    );
};

export default DailyHoroscopes;
