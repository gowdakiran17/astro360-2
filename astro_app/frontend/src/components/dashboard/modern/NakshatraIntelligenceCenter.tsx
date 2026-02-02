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
    <div className="bg-white/[0.08] backdrop-blur-3xl border border-white/[0.15] rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-8 md:px-12 py-8 md:py-10 bg-gradient-to-br from-yellow-500/[0.05] to-orange-500/[0.05] border-b border-white/[0.08] flex items-center justify-between hover:from-yellow-500/[0.08] hover:to-orange-500/[0.08] transition-all duration-700 group/header relative z-10"
      >
        <div className="flex items-center gap-6">
          <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 shadow-xl shadow-yellow-500/10 group-hover/header:rotate-12 transition-transform duration-700">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
          <div className="text-left">
            <h2 className="text-base md:text-lg font-black text-white uppercase tracking-[0.3em] mb-2">Nakshatra Intelligence Center</h2>
            <p className="text-base text-yellow-300 uppercase tracking-[0.15em] font-bold">Deep psychological and karmic analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden sm:block px-6 py-3 bg-yellow-500/10 rounded-full border border-yellow-500/20 shadow-xl shadow-yellow-500/5 backdrop-blur-md">
            <span className="text-sm font-black text-yellow-400 uppercase tracking-[0.25em]">Temporal Matrix</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover/header:bg-white/10 transition-all border border-white/10 group-hover/header:scale-110 active:scale-95">
            {isExpanded ? <ChevronUp className="w-6 h-6 text-yellow-500" /> : <ChevronDown className="w-6 h-6 text-yellow-500" />}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="p-8 md:p-12">
          {/* Three Nakshatra Cards with Category Labels - Redesigned */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Psychological Moon Card + Primary Label */}
            <div className="flex flex-col gap-4">
              {/* Primary Category Badge */}
              <div className="flex items-center gap-5 bg-white/[0.05] px-6 py-3 rounded-full border border-white/[0.12] hover:bg-white/[0.08] transition-all">
                <span className="text-base font-black uppercase tracking-[0.2em] text-white">Primary</span>
                <span className="text-base font-black tracking-[0.15em] text-orange-400 uppercase">Psychological Core</span>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/[0.08] to-orange-500/[0.08] rounded-[2.5rem] p-8 border border-yellow-500/20 relative overflow-hidden group/card hover:scale-[1.02] transition-all duration-500 shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-yellow-500/20 rounded-xl">
                      <Moon className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="text-xs font-black text-yellow-400 uppercase tracking-[0.2em]">Psychological Moon</span>
                  </div>
                  <div className="px-4 py-1.5 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                    <span className="text-xs font-black text-yellow-300 uppercase">Pada {getPada(moon)}</span>
                  </div>
                </div>

                {/* Nakshatra Name */}
                <h3 className="text-4xl font-black text-white mb-2 tracking-tighter relative z-10">{moonNak}</h3>
                <p className="text-base font-bold text-yellow-300 uppercase tracking-wide mb-6 relative z-10">{getSign(moon)}</p>

                {/* Metadata Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
                  <div>
                    <span className="text-xs font-black text-white/60 uppercase tracking-wider block mb-1">Deity</span>
                    <p className="text-sm font-black text-white uppercase break-words">{moonData.deity}</p>
                  </div>
                  <div>
                    <span className="text-xs font-black text-white/60 uppercase tracking-wider block mb-1">Symbol</span>
                    <p className="text-sm font-black text-white uppercase break-words">{moonData.symbol}</p>
                  </div>
                  <div>
                    <span className="text-xs font-black text-white/60 uppercase tracking-wider block mb-1">Regent</span>
                    <p className="text-sm font-black text-white uppercase break-words">{moonData.rulingPlanet}</p>
                  </div>
                </div>

                {/* Key Themes */}
                <div className="flex flex-wrap gap-2 relative z-10">
                  {moonData.keyThemes.slice(0, 2).map((theme: string, i: number) => (
                    <span key={i} className="text-xs font-black uppercase tracking-wide text-yellow-400 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-yellow-400 animate-pulse" />
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Vitalizing Sun Card + Secondary Label */}
            <div className="flex flex-col gap-4">
              {/* Secondary Category Badge */}
              <div className="flex items-center gap-5 bg-white/[0.05] px-6 py-3 rounded-full border border-white/[0.12] hover:bg-white/[0.08] transition-all">
                <span className="text-base font-black uppercase tracking-[0.2em] text-white">Secondary</span>
                <span className="text-base font-black tracking-[0.15em] text-yellow-400 uppercase">Soul Purpose</span>
              </div>

              <div className="bg-gradient-to-br from-orange-500/[0.08] to-yellow-500/[0.08] rounded-[2.5rem] p-8 border border-orange-500/20 relative overflow-hidden group/card hover:scale-[1.02] transition-all duration-500 shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-500/20 rounded-xl">
                      <Sun className="w-5 h-5 text-orange-400" />
                    </div>
                    <span className="text-xs font-black text-orange-400 uppercase tracking-[0.2em]">Vitalizing Sun</span>
                  </div>
                  <div className="px-4 py-1.5 bg-orange-500/20 rounded-full border border-orange-500/30">
                    <span className="text-xs font-black text-orange-300 uppercase">Pada {getPada(sun)}</span>
                  </div>
                </div>

                {/* Nakshatra Name */}
                <h3 className="text-4xl font-black text-white mb-2 tracking-tighter relative z-10">{sunNak}</h3>
                <p className="text-base font-bold text-orange-300 uppercase tracking-wide mb-6 relative z-10">{getSign(sun)}</p>

                {/* Metadata Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
                  <div>
                    <span className="text-xs font-black text-white/60 uppercase tracking-wider block mb-1">Deity</span>
                    <p className="text-sm font-black text-white uppercase break-words">{sunData.deity}</p>
                  </div>
                  <div>
                    <span className="text-xs font-black text-white/60 uppercase tracking-wider block mb-1">Symbol</span>
                    <p className="text-sm font-black text-white uppercase break-words">{sunData.symbol}</p>
                  </div>
                  <div>
                    <span className="text-xs font-black text-white/60 uppercase tracking-wider block mb-1">Regent</span>
                    <p className="text-sm font-black text-white uppercase break-words">{sunData.rulingPlanet}</p>
                  </div>
                </div>

                {/* Key Themes */}
                <div className="flex flex-wrap gap-2 relative z-10">
                  {sunData.keyThemes.slice(0, 2).map((theme: string, i: number) => (
                    <span key={i} className="text-xs font-black uppercase tracking-wide text-orange-400 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-orange-400 animate-pulse" />
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Karmic Ascendant Card + Tertiary Label */}
            <div className="flex flex-col gap-4">
              {/* Tertiary Category Badge */}
              <div className="flex items-center gap-5 bg-white/[0.05] px-6 py-3 rounded-full border border-white/[0.12] hover:bg-white/[0.08] transition-all">
                <span className="text-base font-black uppercase tracking-[0.2em] text-white">Tertiary</span>
                <span className="text-base font-black tracking-[0.15em] text-orange-400 uppercase">Surface Manifestation</span>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/[0.08] to-orange-500/[0.08] rounded-[2.5rem] p-8 border border-yellow-500/20 relative overflow-hidden group/card hover:scale-[1.02] transition-all duration-500 shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-yellow-500/20 rounded-xl">
                      <Target className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="text-xs font-black text-yellow-400 uppercase tracking-[0.2em]">Karmic Ascendant</span>
                  </div>
                  <div className="px-4 py-1.5 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                    <span className="text-xs font-black text-yellow-300 uppercase">Pada {getPada(ascendant)}</span>
                  </div>
                </div>

                {/* Nakshatra Name */}
                <h3 className="text-4xl font-black text-white mb-2 tracking-tighter relative z-10">{lagNak}</h3>
                <p className="text-base font-bold text-yellow-300 uppercase tracking-wide mb-6 relative z-10">{getSign(ascendant)}</p>

                {/* Metadata Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
                  <div>
                    <span className="text-xs font-black text-white/60 uppercase tracking-wider block mb-1">Deity</span>
                    <p className="text-sm font-black text-white uppercase break-words">{lagnaData.deity}</p>
                  </div>
                  <div>
                    <span className="text-xs font-black text-white/60 uppercase tracking-wider block mb-1">Symbol</span>
                    <p className="text-sm font-black text-white uppercase break-words">{lagnaData.symbol}</p>
                  </div>
                  <div>
                    <span className="text-xs font-black text-white/60 uppercase tracking-wider block mb-1">Regent</span>
                    <p className="text-sm font-black text-white uppercase break-words">{lagnaData.rulingPlanet}</p>
                  </div>
                </div>

                {/* Key Themes */}
                <div className="flex flex-wrap gap-2 relative z-10">
                  {lagnaData.keyThemes.slice(0, 2).map((theme: string, i: number) => (
                    <span key={i} className="text-xs font-black uppercase tracking-wide text-yellow-400 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-yellow-400 animate-pulse" />
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Interpretation Section */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-yellow-500/[0.08] to-orange-500/[0.08] border border-yellow-500/20 shadow-2xl backdrop-blur-md p-10 md:p-12">
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-yellow-500/[0.05] to-transparent pointer-events-none" />
              <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>
                <h4 className="text-lg font-black text-white uppercase tracking-[0.25em]">Deep Interpretation</h4>
              </div>
              <p className="text-xl md:text-2xl text-white leading-relaxed italic font-medium relative z-10 tracking-tight drop-shadow-sm mb-10">
                "{moonData.description}"
              </p>
              <div className="mt-10 flex flex-wrap gap-4 relative z-10">
                {moonData.coreTraits.map((trait, i) => (
                  <span key={i} className="px-6 py-3 text-base font-black bg-white/[0.08] text-white rounded-full border border-white/[0.15] uppercase tracking-[0.15em] hover:bg-white/[0.12] transition-all cursor-default hover:text-yellow-400 hover:border-yellow-400/30 shadow-lg">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white/[0.06] rounded-[2.5rem] p-10 border border-white/[0.12] group/stat shadow-xl hover:bg-white/[0.09] transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-2xl -ml-24 -mt-24 pointer-events-none" />
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 group-hover/stat:rotate-12 transition-transform">
                    <Target className="w-6 h-6 text-yellow-400" />
                  </div>
                  <span className="text-base font-black text-white uppercase tracking-[0.25em]">Life Purpose</span>
                </div>
                <p className="text-4xl font-black text-white tracking-tighter uppercase leading-tight">{moonData.lifePurpose}</p>
                <div className="w-16 h-1 bg-yellow-500/40 rounded-full mt-8 shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
              </div>
              <div className="bg-white/[0.06] rounded-[2.5rem] p-10 border border-white/[0.12] group/stat shadow-xl hover:bg-white/[0.09] transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-48 h-48 bg-orange-500/5 rounded-full blur-2xl -ml-24 -mt-24 pointer-events-none" />
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 group-hover/stat:rotate-12 transition-transform">
                    <Heart className="w-6 h-6 text-orange-400" />
                  </div>
                  <span className="text-base font-black text-white uppercase tracking-[0.25em]">Temperament</span>
                </div>
                <p className="text-3xl font-black text-white tracking-tighter uppercase leading-tight">{moonData.quality}</p>
                <div className="w-16 h-1 bg-orange-500/40 rounded-full mt-8 shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
              </div>
            </div>
            <div className="sm:col-span-2 bg-gradient-to-r from-yellow-500/10 via-white/[0.03] to-transparent rounded-[2.5rem] p-8 md:p-10 border border-yellow-500/20 relative overflow-hidden group/karmic shadow-2xl hover:scale-[1.01] transition-all duration-700">
              <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:bg-yellow-500/20 transition-all duration-1000" />
              <div className="flex items-start gap-6 relative z-10">
                <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 group-hover/karmic:rotate-[-12deg] transition-transform duration-700">
                  <Sparkles className="w-8 h-8 text-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]" />
                </div>
                <div>
                  <span className="text-base font-black text-yellow-400 uppercase tracking-[0.4em] block mb-3">Karmic Matrix Power</span>
                  <p className="text-base text-white leading-relaxed font-black tracking-tight uppercase drop-shadow-sm">{moonData.power}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

export default NakshatraIntelligenceCenter;
