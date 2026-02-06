import { useState } from 'react';
import { Moon, Sun, ChevronUp, ChevronDown, Sparkles, Compass } from 'lucide-react';

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

  const NakshatraCard = ({ title, subTitle, nakshatra, sign, pada, data, icon: Icon, colorClass }: any) => (
    <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 hover:border-slate-700 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
            <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">{title}</h4>
            <p className="text-xs text-slate-500">{subTitle}</p>
          </div>
        </div>
        <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
            Pada {pada}
        </span>
      </div>
      
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-slate-100 mb-1">{nakshatra}</h3>
        <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{sign}</p>
      </div>

      <p className="text-sm text-slate-400 leading-relaxed mb-4 min-h-[60px]">
        {data.description}
      </p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-t border-slate-800 pt-3">
        <div>
            <span className="text-slate-500 block mb-0.5">Deity</span>
            <span className="text-slate-300 font-medium">{data.deity}</span>
        </div>
        <div>
            <span className="text-slate-500 block mb-0.5">Symbol</span>
            <span className="text-slate-300 font-medium">{data.symbol}</span>
        </div>
        <div className="col-span-2 mt-1">
            <span className="text-slate-500 block mb-0.5">Key Themes</span>
            <div className="flex flex-wrap gap-1.5">
                {data.keyThemes.map((theme: string, i: number) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {theme}
                    </span>
                ))}
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Nakshatra Intelligence</h3>
        </div>
        <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-slate-200 transition-colors"
        >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NakshatraCard 
            title="Psychological Core"
            subTitle="Primary Moon Nakshatra"
            nakshatra={moonNak}
            sign={getSign(moon)}
            pada={getPada(moon)}
            data={moonData}
            icon={Moon}
            colorClass="bg-blue-500 text-blue-400"
          />
          <NakshatraCard 
            title="Soul Purpose"
            subTitle="Sun Nakshatra"
            nakshatra={sunNak}
            sign={getSign(sun)}
            pada={getPada(sun)}
            data={sunData}
            icon={Sun}
            colorClass="bg-amber-500 text-amber-400"
          />
          <NakshatraCard 
            title="Physical Body"
            subTitle="Ascendant Nakshatra"
            nakshatra={lagNak}
            sign={getSign(ascendant)}
            pada={getPada(ascendant)}
            data={lagnaData}
            icon={Compass}
            colorClass="bg-emerald-500 text-emerald-400"
          />
        </div>
      )}
    </div>
  );
};

export default NakshatraIntelligenceCenter;