import React, { useState } from 'react';
import { 
  Briefcase, Heart, Wallet, Shield, Zap, Info, ChevronUp, ChevronDown, Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CosmicConsultationProps {
  chartData: any;
  dashaData?: any;
  periodOverview?: any;
  aiPredictions?: any;
}

// Helper to determine planet strength (simplified for UI)
const getPlanetStrength = (planet: any) => {
  if (!planet) return 50;
  let score = 50;
  if (planet.is_exalted) score += 30;
  if (planet.is_moolatrikona) score += 20;
  if (planet.is_debilitated) score -= 30;
  if (planet.is_retrograde) score += 10; // Powerful but tricky
  return Math.min(100, Math.max(0, score));
};

const AccordionItem = ({
  icon: Icon,
  title,
  subtitle,
  children,
  isOpen,
  onClick,
  colorClass = "text-indigo-400",
  bgClass = "bg-indigo-500/10",
  score
}: {
  icon: any;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
  colorClass?: string;
  bgClass?: string;
  score?: number;
}) => {
  return (
    <div className="border-b border-slate-800 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-4 flex items-center justify-between text-left group hover:bg-slate-900/30 px-4 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg ${bgClass} ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {score && (
            <div className="flex items-center gap-2">
                 <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${score >= 70 ? 'bg-emerald-500' : score >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`} 
                      style={{ width: `${score}%` }}
                    />
                 </div>
                 <span className="text-xs font-mono text-slate-400">{score}%</span>
            </div>
          )}
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-6 pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileDomainCard = ({
  icon: Icon,
  title,
  score = 85,
  rating = 'Excellent',
  analysis = 'I apologize, but I am having trouble connecting to the stars right now. Please try again later.',
  dashaTitle = 'Mars-Moon',
  dashaSubtitle = 'Focus on high-leverage actions',
  transitTitle = 'Saturn Sextile',
  transitSubtitle = 'Significant influence',
  recommendation = 'Schedule important meeting or pitch idea',
  recommendationTime = '09:39 AM',
  aiConfidence = 85
}: {
  icon: any;
  title: string;
  score?: number;
  rating?: string;
  analysis?: string;
  dashaTitle?: string;
  dashaSubtitle?: string;
  transitTitle?: string;
  transitSubtitle?: string;
  recommendation?: string;
  recommendationTime?: string;
  aiConfidence?: number;
}) => {
  const scoreColor = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-blue-300' : 'text-amber-300';
  const barColor = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-blue-500' : 'bg-amber-500';
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 md:p-6 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
          <Icon className="w-5 h-5 text-slate-200" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-bold text-slate-200">{title}</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden md:inline">Mobile First</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${scoreColor}`}>{score.toFixed(1)}%</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{rating}</span>
          </div>
          <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${barColor}`} style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
          <span className="w-3 h-3 rounded-full bg-slate-700" />
          Analysis
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{analysis}</p>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Dasha</span>
          <div className="mt-1 text-sm font-semibold text-slate-200">{dashaTitle}</div>
          <div className="text-xs text-slate-400">{dashaSubtitle}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Transit</span>
          <div className="mt-1 text-sm font-semibold text-slate-200">{transitTitle}</div>
          <div className="text-xs text-slate-400">{transitSubtitle}</div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-blue-300">
          <Zap className="w-3 h-3" /> Recommendation
        </div>
        <p className="text-sm text-slate-200">{recommendation}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-300">
            <Clock className="w-3 h-3 text-slate-400" /> {recommendationTime}
          </span>
          <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">Set Alert</button>
          <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold">Ask AI</button>
        </div>
      </div>

      <div className="mt-3 text-center text-[10px] font-mono text-slate-500">
        AI Confidence: {aiConfidence}%
      </div>
    </div>
  )
};

const CosmicConsultation: React.FC<CosmicConsultationProps> = ({ chartData, aiPredictions }) => {
  const [openSection, setOpenSection] = useState<string | null>('career');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const getPlanet = (name: string) => chartData?.planets?.find((p: any) => p.name === name);

  // Dynamic Data Extraction
  const saturn = getPlanet('Saturn');
  const jupiter = getPlanet('Jupiter');
  const venus = getPlanet('Venus');
  const sun = getPlanet('Sun');
  const mars = getPlanet('Mars');

  return (
    <div className="bg-slate-900/20 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Career Section */}
      <AccordionItem
        icon={Briefcase}
        title="Career & Purpose"
        subtitle="Professional path and success metrics"
        isOpen={openSection === 'career'}
        onClick={() => toggleSection('career')}
        colorClass="text-indigo-400"
        bgClass="bg-indigo-500/10"
        score={getPlanetStrength(saturn)}
      >
        <MobileDomainCard
          icon={Briefcase}
          title="Career"
          score={getPlanetStrength(saturn)}
          rating={getPlanetStrength(saturn) >= 80 ? 'Excellent' : getPlanetStrength(saturn) >= 60 ? 'Good' : 'Caution'}
          analysis={aiPredictions?.career?.summary || undefined}
          dashaTitle={aiPredictions?.career?.dasha || 'Mars-Moon'}
          dashaSubtitle={aiPredictions?.career?.dasha_note || 'Focus on high-leverage actions'}
          transitTitle={aiPredictions?.career?.transit || 'Saturn Sextile'}
          transitSubtitle={aiPredictions?.career?.transit_note || 'Significant influence'}
          recommendation={aiPredictions?.career?.recommendation || 'Schedule important meeting or pitch idea'}
          recommendationTime={aiPredictions?.career?.best_time || '09:39 AM'}
          aiConfidence={aiPredictions?.career?.confidence ?? 85}
        />
      </AccordionItem>

      {/* Relationships Section */}
      <AccordionItem
        icon={Heart}
        title="Relationships"
        subtitle="Emotional bonds and partnerships"
        isOpen={openSection === 'relationships'}
        onClick={() => toggleSection('relationships')}
        colorClass="text-pink-400"
        bgClass="bg-pink-500/10"
        score={getPlanetStrength(venus)}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Primary Influencer: Venus
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Venus in <span className="text-slate-200 font-medium">{venus?.zodiac_sign || 'transit'}</span> indicates 
              {venus?.is_exalted ? " an excellent time for harmony and connection." : " a need for balance in personal connections."}
            </p>
          </div>
        </div>
      </AccordionItem>

      {/* Wealth Section */}
      <AccordionItem
        icon={Wallet}
        title="Wealth & Finance"
        subtitle="Assets, income and gains"
        isOpen={openSection === 'wealth'}
        onClick={() => toggleSection('wealth')}
        colorClass="text-emerald-400"
        bgClass="bg-emerald-500/10"
        score={getPlanetStrength(jupiter)}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
             <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Primary Influencer: Jupiter
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
               Jupiter's position suggests {jupiter?.is_retrograde ? "re-evaluating financial strategies" : "potential for expansion in assets"}.
            </p>
          </div>
        </div>
      </AccordionItem>

      {/* Health Section */}
      <AccordionItem
        icon={Shield}
        title="Health & Vitality"
        subtitle="Physical and mental well-being"
        isOpen={openSection === 'health'}
        onClick={() => toggleSection('health')}
        colorClass="text-blue-400"
        bgClass="bg-blue-500/10"
        score={getPlanetStrength(sun)}
      >
        <div className="space-y-4">
           <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
             <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400" />
              Vitality Check
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
               The Sun provides {sun?.is_exalted ? "strong vitality and immunity" : "steady energy levels"}. 
               Mars in <span className="text-slate-200 font-medium">{mars?.zodiac_sign}</span> adds drive.
            </p>
          </div>
        </div>
      </AccordionItem>
    </div>
  );
};

export default CosmicConsultation;
