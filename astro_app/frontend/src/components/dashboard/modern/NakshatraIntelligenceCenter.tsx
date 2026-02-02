import { useState } from 'react';
import { Moon, Sun, ChevronUp, ChevronDown, Sparkles, Target, Heart } from 'lucide-react';

interface NakshatraIntelligenceCenterProps {
  chartData: any;
}

const NAKSHATRA_FULL_DATA: Record<string, {
  deity: string;
  symbol: string;
  quality: string;
  rulingPlanet: string;
  power: string;
  lifePurpose: string;
  coreTraits: string[];
  description: string;
  keyThemes: string[];
}> = {
  'Ashwini': { deity: 'Ashwini Kumaras', symbol: 'Horse Head', quality: 'Swift/Light', rulingPlanet: 'Ketu', power: 'Shidravyapani Shakti (Power to Quickly Reach Things)', lifePurpose: 'Dharma', coreTraits: ['Pioneering', 'Healing', 'Speed', 'Initiative'], description: 'The Star of Transport. You are quick, energetic, and always ready to initiate new ventures. Healing and movement are central themes.', keyThemes: ['Pioneering', 'Healing', 'Speed'] },
  'Bharani': { deity: 'Yama', symbol: 'Yoni', quality: 'Fierce/Severe', rulingPlanet: 'Venus', power: 'Apabharani Shakti (Power to Take Things Away)', lifePurpose: 'Artha', coreTraits: ['Creative', 'Intense', 'Transformative', 'Passionate'], description: 'The Star of Restraint. You have the power to bear and transform, understanding the cycles of life and death.', keyThemes: ['Creativity', 'Transformation', 'Intensity'] },
  'Krittika': { deity: 'Agni', symbol: 'Razor/Flame', quality: 'Mixed', rulingPlanet: 'Sun', power: 'Dahana Shakti (Power to Burn)', lifePurpose: 'Kama', coreTraits: ['Sharp', 'Purifying', 'Determined', 'Critical'], description: 'The Star of Fire. You possess the ability to cut through illusion and purify through intensity and determination.', keyThemes: ['Purification', 'Determination', 'Sharpness'] },
  'Rohini': { deity: 'Brahma', symbol: 'Chariot/Ox Cart', quality: 'Fixed/Stable', rulingPlanet: 'Moon', power: 'Rohana Shakti (Power of Growth)', lifePurpose: 'Moksha', coreTraits: ['Beautiful', 'Creative', 'Sensual', 'Nurturing'], description: 'The Star of Ascent. You have a natural ability for creation, growth, and cultivating beauty and abundance.', keyThemes: ['Growth', 'Beauty', 'Creation'] },
  'Mrigashira': { deity: 'Soma', symbol: 'Deer Head', quality: 'Soft/Tender', rulingPlanet: 'Mars', power: 'Prinana Shakti (Power to Give Fulfillment)', lifePurpose: 'Moksha', coreTraits: ['Curious', 'Searching', 'Gentle', 'Intelligent'], description: 'The Star of Searching. You are constantly seeking knowledge, truth, and new experiences with gentle curiosity.', keyThemes: ['Search', 'Curiosity', 'Fulfillment'] },
  'Ardra': { deity: 'Rudra', symbol: 'Teardrop/Diamond', quality: 'Sharp/Dreadful', rulingPlanet: 'Rahu', power: 'Yatna Shakti (Power of Effort)', lifePurpose: 'Kama', coreTraits: ['Intense', 'Transformative', 'Emotional', 'Powerful'], description: 'The Star of Storms. Through effort and sometimes destruction, you bring about necessary transformation and renewal.', keyThemes: ['Transformation', 'Effort', 'Storms'] },
  'Punarvasu': { deity: 'Aditi', symbol: 'Bow/Quiver', quality: 'Moveable', rulingPlanet: 'Jupiter', power: 'Vasutva Prapana Shakti (Power to Gain Wealth)', lifePurpose: 'Artha', coreTraits: ['Optimistic', 'Renewing', 'Returning', 'Philosophical'], description: 'The Star of Renewal. You have the gift of restoration, always able to return and renew after setbacks.', keyThemes: ['Renewal', 'Return', 'Abundance'] },
  'Pushya': { deity: 'Brihaspati', symbol: 'Lotus/Cow Udder', quality: 'Swift/Light', rulingPlanet: 'Saturn', power: 'Brahmavarchasa Shakti (Power to Create Spiritual Energy)', lifePurpose: 'Dharma', coreTraits: ['Nourishing', 'Wise', 'Generous', 'Protective'], description: 'The Star of Nourishment. Considered the most auspicious nakshatra, you embody spiritual wisdom and nurturing qualities.', keyThemes: ['Nourishment', 'Wisdom', 'Protection'] },
  'Ashlesha': { deity: 'Serpent Gods', symbol: 'Coiled Serpent', quality: 'Sharp/Dreadful', rulingPlanet: 'Mercury', power: 'Visasleshana Shakti (Power to Inflict Poison)', lifePurpose: 'Dharma', coreTraits: ['Mystical', 'Hypnotic', 'Intuitive', 'Deep'], description: 'The Star of the Serpent. You possess deep mystical wisdom and the ability to mesmerize and transform.', keyThemes: ['Mystery', 'Kundalini', 'Depth'] },
  'Magha': { deity: 'Pitris', symbol: 'Throne/Palanquin', quality: 'Fierce/Severe', rulingPlanet: 'Ketu', power: 'Tyage Kshepani Shakti (Power to Leave the Body)', lifePurpose: 'Artha', coreTraits: ['Royal', 'Ancestral', 'Proud', 'Authoritative'], description: 'The Star of Power. You carry ancestral blessings and natural authority, destined for positions of leadership.', keyThemes: ['Authority', 'Ancestry', 'Power'] },
  'Purva Phalguni': { deity: 'Bhaga', symbol: 'Front Legs of Bed', quality: 'Fierce/Severe', rulingPlanet: 'Venus', power: 'Prajanana Shakti (Power of Procreation)', lifePurpose: 'Kama', coreTraits: ['Creative', 'Romantic', 'Artistic', 'Joyful'], description: 'The Star of Fortune. You are blessed with creativity, romance, and the ability to enjoy life pleasures.', keyThemes: ['Romance', 'Creativity', 'Joy'] },
  'Uttara Phalguni': { deity: 'Aryaman', symbol: 'Back Legs of Bed', quality: 'Fixed/Stable', rulingPlanet: 'Sun', power: 'Chayani Shakti (Power of Accumulation)', lifePurpose: 'Moksha', coreTraits: ['Generous', 'Loyal', 'Helpful', 'Reliable'], description: 'The Star of Patronage. You excel at forming lasting partnerships and accumulating through helpful service.', keyThemes: ['Partnerships', 'Generosity', 'Reliability'] },
  'Hasta': { deity: 'Savitar', symbol: 'Hand/Fist', quality: 'Swift/Light', rulingPlanet: 'Moon', power: 'Hasta Sthapaniya Shakti (Power to Manifest)', lifePurpose: 'Moksha', coreTraits: ['Skillful', 'Clever', 'Healing', 'Dexterous'], description: 'The Star of the Hand. You have remarkable skills and the ability to manifest your goals through craftsmanship.', keyThemes: ['Skill', 'Manifestation', 'Healing'] },
  'Chitra': { deity: 'Vishwakarma', symbol: 'Bright Jewel', quality: 'Soft/Tender', rulingPlanet: 'Mars', power: 'Punya Chayani Shakti (Power to Accumulate Merit)', lifePurpose: 'Kama', coreTraits: ['Artistic', 'Beautiful', 'Creative', 'Charismatic'], description: 'The Star of the Architect. You are a natural artist and creator, bringing beauty and structure to the world.', keyThemes: ['Art', 'Beauty', 'Architecture'] },
  'Swati': { deity: 'Vayu', symbol: 'Coral/Sword', quality: 'Moveable', rulingPlanet: 'Rahu', power: 'Pradhvamsa Shakti (Power to Scatter)', lifePurpose: 'Artha', coreTraits: ['Independent', 'Flexible', 'Diplomatic', 'Free'], description: 'The Star of the Wind. You value freedom and independence, adapting flexibly to changing circumstances.', keyThemes: ['Freedom', 'Independence', 'Flexibility'] },
  'Vishakha': { deity: 'Indra-Agni', symbol: 'Triumphal Arch', quality: 'Mixed', rulingPlanet: 'Jupiter', power: 'Vyapana Shakti (Power to Achieve)', lifePurpose: 'Dharma', coreTraits: ['Determined', 'Goal-oriented', 'Ambitious', 'Persistent'], description: 'The Star of Purpose. You are driven by goals and possess unstoppable determination to achieve.', keyThemes: ['Achievement', 'Goals', 'Triumph'] },
  'Anuradha': { deity: 'Mitra', symbol: 'Lotus/Umbrella', quality: 'Soft/Tender', rulingPlanet: 'Saturn', power: 'Radhana Shakti (Power of Worship)', lifePurpose: 'Dharma', coreTraits: ['Devotional', 'Friendly', 'Organized', 'Cooperative'], description: 'The Star of Success. You excel in friendships and devotion, achieving through cooperation and love.', keyThemes: ['Friendship', 'Devotion', 'Success'] },
  'Jyeshtha': { deity: 'Indra', symbol: 'Circular Talisman', quality: 'Sharp/Dreadful', rulingPlanet: 'Mercury', power: 'Arohana Shakti (Power to Rise)', lifePurpose: 'Artha', coreTraits: ['Protective', 'Eldest', 'Powerful', 'Responsible'], description: 'The Chief Star. You carry the responsibility and power of the eldest, naturally rising to leadership.', keyThemes: ['Leadership', 'Protection', 'Seniority'] },
  'Mula': { deity: 'Nirriti', symbol: 'Bunch of Roots', quality: 'Sharp/Dreadful', rulingPlanet: 'Ketu', power: 'Barhana Shakti (Power to Destroy)', lifePurpose: 'Kama', coreTraits: ['Investigative', 'Root-seeking', 'Philosophical', 'Intense'], description: 'The Root Star. You seek to understand the root cause of everything, often through intense investigation.', keyThemes: ['Investigation', 'Roots', 'Destruction'] },
  'Purva Ashadha': { deity: 'Apah (Water Goddess)', symbol: 'Winnowing Basket, Fan', quality: 'Fierce/Severe', rulingPlanet: 'Venus', power: 'Varchograhana Shakti (Power to Invigorate)', lifePurpose: 'Moksha', coreTraits: ['Invincible', 'Proud', 'Patient', 'Optimistic', 'Emotional'], description: 'The Invincible Star. You have an unshakeable confidence and patience. You can purify emotions and situations.', keyThemes: ['Invincibility', 'Purification', 'Victory'] },
  'Uttara Ashadha': { deity: 'Vishwe Devas', symbol: 'Elephant Tusk', quality: 'Fixed/Stable', rulingPlanet: 'Sun', power: 'Apradhrishya Shakti (Power to Be Invincible)', lifePurpose: 'Moksha', coreTraits: ['Victorious', 'Righteous', 'Committed', 'Universal'], description: 'The Universal Star. Your victories are lasting and righteous, achieved through universal principles.', keyThemes: ['Victory', 'Righteousness', 'Universality'] },
  'Shravana': { deity: 'Vishnu', symbol: 'Three Footprints', quality: 'Moveable', rulingPlanet: 'Moon', power: 'Samhanana Shakti (Power to Connect)', lifePurpose: 'Artha', coreTraits: ['Listening', 'Learning', 'Connected', 'Wise'], description: 'The Star of Learning. You learn through listening and have the power to connect and preserve knowledge.', keyThemes: ['Listening', 'Learning', 'Connection'] },
  'Dhanishta': { deity: 'Eight Vasus', symbol: 'Drum', quality: 'Moveable', rulingPlanet: 'Mars', power: 'Khyapayitri Shakti (Power to Give Fame)', lifePurpose: 'Dharma', coreTraits: ['Musical', 'Wealthy', 'Ambitious', 'Charitable'], description: 'The Star of Symphony. You have rhythm, wealth, and the ability to bring prosperity through harmony.', keyThemes: ['Music', 'Wealth', 'Fame'] },
  'Shatabhisha': { deity: 'Varuna', symbol: 'Empty Circle', quality: 'Moveable', rulingPlanet: 'Rahu', power: 'Bheshaja Shakti (Power to Heal)', lifePurpose: 'Dharma', coreTraits: ['Healing', 'Secretive', 'Independent', 'Mystical'], description: 'The Star of Healing. You possess powerful healing abilities and knowledge of hidden medicines.', keyThemes: ['Healing', 'Mystery', 'Independence'] },
  'Purva Bhadrapada': { deity: 'Aja Ekapada', symbol: 'Sword/Front Legs of Funeral Cot', quality: 'Fierce/Severe', rulingPlanet: 'Jupiter', power: 'Yajamana Udyamana Shakti (Power of Spiritual Fire)', lifePurpose: 'Artha', coreTraits: ['Spiritual', 'Intense', 'Transformative', 'Passionate'], description: 'The Star of Fire Dragon. You carry intense spiritual fire and the power to transform through sacrifice.', keyThemes: ['Spirituality', 'Intensity', 'Transformation'] },
  'Uttara Bhadrapada': { deity: 'Ahir Budhnya (Serpent of the Deep)', symbol: 'Back of a Funeral Cot, Twins', quality: 'Fixed/Stable', rulingPlanet: 'Saturn', power: 'Varshodyamana Shakti (Power to Bring Rain)', lifePurpose: 'Kama', coreTraits: ['Wise', 'Patient', 'Mystical', 'Compassionate'], description: 'The Star of the Deep. You possess deep wisdom and patience, bringing nourishment from hidden depths.', keyThemes: ['Depth', 'Wisdom', 'Nourishment'] },
  'Revati': { deity: 'Pushan', symbol: 'Fish/Drum', quality: 'Soft/Tender', rulingPlanet: 'Mercury', power: 'Kshiradyapani Shakti (Power of Nourishment)', lifePurpose: 'Moksha', coreTraits: ['Nurturing', 'Protective', 'Wealthy', 'Safe'], description: 'The Star of Wealth. You guide and protect others on their journey, ensuring safe passage and nourishment.', keyThemes: ['Guidance', 'Protection', 'Journey'] }
};

const NakshatraIntelligenceCenter: React.FC<NakshatraIntelligenceCenterProps> = ({ chartData }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!chartData?.planets) return null;

  const moon = chartData.planets.find((p: any) => p.name === 'Moon');
  const sun = chartData.planets.find((p: any) => p.name === 'Sun');
  const ascendant = chartData.ascendant;

  const getSign = (obj: any) => obj?.zodiac_sign || obj?.sign || '';
  const getNakshatra = (obj: any) => {
    if (!obj?.nakshatra) return 'Ashwini';
    if (typeof obj.nakshatra === 'string') return obj.nakshatra;
    return obj.nakshatra?.name || 'Ashwini';
  };
  const getPada = (obj: any) => {
    if (typeof obj?.nakshatra === 'object') return obj.nakshatra?.pada || 1;
    return obj?.pada || 1;
  };

  const moonNak = getNakshatra(moon);
  const sunNak = getNakshatra(sun);
  const lagNak = getNakshatra(ascendant);

  const moonData = NAKSHATRA_FULL_DATA[moonNak] || NAKSHATRA_FULL_DATA['Ashwini'];
  const sunData = NAKSHATRA_FULL_DATA[sunNak] || NAKSHATRA_FULL_DATA['Ashwini'];
  const lagnaData = NAKSHATRA_FULL_DATA[lagNak] || NAKSHATRA_FULL_DATA['Ashwini'];

  return (
    <div className="bg-[#0F0F16] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-8 py-5 bg-emerald-500/5 border-b border-emerald-500/10 flex items-center justify-between hover:bg-emerald-500/10 transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-white tracking-tight">Nakshatra Intelligence Center</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Deep psychological and karmic analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active Insight</span>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </div>
      </button>

      {isExpanded && (
        <div className="p-6">
          {/* Nakshatra Type Labels */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 group cursor-help">
              <span className="text-slate-500 font-bold text-[10px] tracking-widest uppercase">Primary</span>
              <span className="px-3 py-1 text-[10px] font-bold tracking-wider bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/20">Psychological Core</span>
            </div>
            <div className="flex items-center gap-2 group cursor-help">
              <span className="text-slate-500 font-bold text-[10px] tracking-widest uppercase">Secondary</span>
              <span className="px-3 py-1 text-[10px] font-bold tracking-wider bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/20">Soul Purpose</span>
            </div>
            <div className="flex items-center gap-2 group cursor-help">
              <span className="text-slate-500 font-bold text-[10px] tracking-widest uppercase">Tertiary</span>
              <span className="px-3 py-1 text-[10px] font-bold tracking-wider bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/20">Surface</span>
            </div>
          </div>

          {/* Three Nakshatra Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <NakshatraCard
              title="Moon Nakshatra"
              icon={<Moon className="w-5 h-5 text-purple-400" />}
              data={moonData}
              nakshatraName={moonNak}
              sign={getSign(moon)}
              pada={getPada(moon)}
              colorClass="purple"
            />
            <NakshatraCard
              title="Sun Nakshatra"
              icon={<Sun className="w-5 h-5 text-amber-400" />}
              data={sunData}
              nakshatraName={sunNak}
              sign={getSign(sun)}
              pada={getPada(sun)}
              colorClass="amber"
            />
            <NakshatraCard
              title="Lagna Nakshatra"
              icon={<Target className="w-5 h-5 text-teal-400" />}
              data={lagnaData}
              nakshatraName={lagNak}
              sign={getSign(ascendant)}
              pada={getPada(ascendant)}
              colorClass="teal"
            />
          </div>

          {/* Detailed Interpretation Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-700/30">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Deep Interpretation</h4>
              </div>
              <p className="text-slate-300 leading-relaxed italic text-sm">
                "{moonData.description}"
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {moonData.coreTraits.map((trait, i) => (
                  <span key={i} className="px-3 py-1 text-[10px] font-bold bg-slate-800 text-slate-300 rounded-full border border-slate-700/50">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/40 rounded-2xl p-5 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Life Purpose</span>
                </div>
                <p className="text-xl font-bold text-white">{moonData.lifePurpose}</p>
                <p className="text-[10px] text-slate-400 mt-1">Primary soul motivation</p>
              </div>
              <div className="bg-slate-900/40 rounded-2xl p-5 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quality</span>
                </div>
                <p className="text-lg font-bold text-white">{moonData.quality}</p>
                <p className="text-[10px] text-slate-400 mt-1">Nature of temperament</p>
              </div>
              <div className="col-span-2 bg-gradient-to-r from-purple-500/10 to-transparent rounded-2xl p-5 border border-purple-500/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-1">Karmic Power</span>
                    <p className="text-sm text-slate-200 leading-relaxed">{moonData.power}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface NakshatraCardProps {
  title: string;
  icon: React.ReactNode;
  data: any;
  nakshatraName: string;
  sign: string;
  pada: number;
  colorClass: 'purple' | 'amber' | 'teal';
}

const NakshatraCard: React.FC<NakshatraCardProps> = ({ title, icon, data, nakshatraName, sign, pada, colorClass }) => {
  const themes = {
    purple: {
      border: 'border-purple-500/30',
      bg: 'from-purple-900/40 to-indigo-900/30',
      text: 'text-purple-300',
      accent: 'text-purple-400',
      subtext: 'text-purple-200/70',
      pill: 'bg-purple-500/20 text-purple-200 border-purple-500/20'
    },
    amber: {
      border: 'border-amber-500/30',
      bg: 'from-amber-900/40 to-orange-900/30',
      text: 'text-amber-300',
      accent: 'text-amber-400',
      subtext: 'text-amber-200/70',
      pill: 'bg-amber-500/20 text-amber-200 border-amber-500/20'
    },
    teal: {
      border: 'border-teal-500/30',
      bg: 'from-teal-900/40 to-cyan-900/30',
      text: 'text-teal-300',
      accent: 'text-teal-400',
      subtext: 'text-teal-200/70',
      pill: 'bg-teal-500/20 text-teal-200 border-teal-500/20'
    }
  }[colorClass];

  return (
    <div className={`relative group overflow-hidden bg-gradient-to-br ${themes.bg} rounded-2xl p-6 border ${themes.border} transition-all duration-500 hover:shadow-2xl hover:shadow-${colorClass}-500/20`}>
      {/* Decorative background element */}
      <div className={`absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent blur-3xl group-hover:scale-150 transition-transform duration-700 opacity-50`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon}
            <span className={`text-[10px] font-bold uppercase tracking-widest ${themes.subtext}`}>{title}</span>
          </div>
          <div className={`px-2 py-0.5 rounded-full border ${themes.pill} text-[10px] font-bold`}>
            Pada {pada}
          </div>
        </div>

        <h3 className="text-3xl font-black text-white mb-1 tracking-tight">{nakshatraName}</h3>
        <p className={`text-sm font-bold ${themes.text} mb-6`}>{sign}</p>

        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Deity</span>
            <span className="text-sm text-white font-medium">{data.deity}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Symbol</span>
            <span className="text-sm text-white font-medium">{data.symbol}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Ruling Planet</span>
            <span className="text-sm text-white font-medium">{data.rulingPlanet}</span>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/5">
          <div className="flex flex-wrap gap-2">
            {data.keyThemes.slice(0, 3).map((theme: string, i: number) => (
              <span key={i} className={`text-[10px] font-bold ${themes.text} flex items-center gap-1.5`}>
                <span className={`w-1 h-1 rounded-full ${themes.accent} bg-current`} />
                {theme}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NakshatraIntelligenceCenter;
