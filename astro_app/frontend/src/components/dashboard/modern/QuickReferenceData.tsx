import React from 'react';
import { Star, Moon, Crown, Feather, Activity, Compass } from 'lucide-react';
import SouthIndianChart from '../../charts/SouthIndianChart';

interface QuickReferenceDataProps {
  chartData: any;
  panchangData?: any;
}

const ZODIAC_SYMBOLS: Record<string, string> = {
  'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
  'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
};

const NAKSHATRA_DATA: Record<string, { deity: string; symbol: string; quality: string; rulingPlanet: string; power: string }> = {
  'Ashwini': { deity: 'Ashwini Kumaras', symbol: 'Horse Head', quality: 'Swift/Light', rulingPlanet: 'Ketu', power: 'Shidravyapani Shakti' },
  'Bharani': { deity: 'Yama', symbol: 'Yoni', quality: 'Fierce/Severe', rulingPlanet: 'Venus', power: 'Apabharani Shakti' },
  'Krittika': { deity: 'Agni', symbol: 'Razor/Flame', quality: 'Mixed', rulingPlanet: 'Sun', power: 'Dahana Shakti' },
  'Rohini': { deity: 'Brahma', symbol: 'Chariot/Ox Cart', quality: 'Fixed/Stable', rulingPlanet: 'Moon', power: 'Rohana Shakti' },
  'Mrigashira': { deity: 'Soma', symbol: 'Deer Head', quality: 'Soft/Tender', rulingPlanet: 'Mars', power: 'Prinana Shakti' },
  'Ardra': { deity: 'Rudra', symbol: 'Teardrop/Diamond', quality: 'Sharp/Dreadful', rulingPlanet: 'Rahu', power: 'Yatna Shakti' },
  'Punarvasu': { deity: 'Aditi', symbol: 'Bow/Quiver', quality: 'Moveable', rulingPlanet: 'Jupiter', power: 'Vasutva Prapana Shakti' },
  'Pushya': { deity: 'Brihaspati', symbol: 'Lotus/Cow Udder', quality: 'Swift/Light', rulingPlanet: 'Saturn', power: 'Brahmavarchasa Shakti' },
  'Ashlesha': { deity: 'Serpent Gods', symbol: 'Coiled Serpent', quality: 'Sharp/Dreadful', rulingPlanet: 'Mercury', power: 'Visasleshana Shakti' },
  'Magha': { deity: 'Pitris', symbol: 'Throne/Palanquin', quality: 'Fierce/Severe', rulingPlanet: 'Ketu', power: 'Tyage Kshepani Shakti' },
  'Purva Phalguni': { deity: 'Bhaga', symbol: 'Front Legs of Bed', quality: 'Fierce/Severe', rulingPlanet: 'Venus', power: 'Prajanana Shakti' },
  'Uttara Phalguni': { deity: 'Aryaman', symbol: 'Back Legs of Bed', quality: 'Fixed/Stable', rulingPlanet: 'Sun', power: 'Chayani Shakti' },
  'Hasta': { deity: 'Savitar', symbol: 'Hand/Fist', quality: 'Swift/Light', rulingPlanet: 'Moon', power: 'Hasta Sthapaniya Shakti' },
  'Chitra': { deity: 'Vishwakarma', symbol: 'Bright Jewel', quality: 'Soft/Tender', rulingPlanet: 'Mars', power: 'Punya Chayani Shakti' },
  'Swati': { deity: 'Vayu', symbol: 'Coral/Sword', quality: 'Moveable', rulingPlanet: 'Rahu', power: 'Pradhvamsa Shakti' },
  'Vishakha': { deity: 'Indra-Agni', symbol: 'Triumphal Arch', quality: 'Mixed', rulingPlanet: 'Jupiter', power: 'Vyapana Shakti' },
  'Anuradha': { deity: 'Mitra', symbol: 'Lotus/Umbrella', quality: 'Soft/Tender', rulingPlanet: 'Saturn', power: 'Radhana Shakti' },
  'Jyeshtha': { deity: 'Indra', symbol: 'Circular Talisman', quality: 'Sharp/Dreadful', rulingPlanet: 'Mercury', power: 'Arohana Shakti' },
  'Mula': { deity: 'Nirriti', symbol: 'Bunch of Roots', quality: 'Sharp/Dreadful', rulingPlanet: 'Ketu', power: 'Barhana Shakti' },
  'Purva Ashadha': { deity: 'Apah (Water Goddess)', symbol: 'Winnowing Basket, Fan', quality: 'Fierce/Severe', rulingPlanet: 'Venus', power: 'Varchograhana Shakti' },
  'Uttara Ashadha': { deity: 'Vishwe Devas', symbol: 'Elephant Tusk', quality: 'Fixed/Stable', rulingPlanet: 'Sun', power: 'Apradhrishya Shakti' },
  'Shravana': { deity: 'Vishnu', symbol: 'Three Footprints', quality: 'Moveable', rulingPlanet: 'Moon', power: 'Samhanana Shakti' },
  'Dhanishta': { deity: 'Eight Vasus', symbol: 'Drum', quality: 'Moveable', rulingPlanet: 'Mars', power: 'Khyapayitri Shakti' },
  'Shatabhisha': { deity: 'Varuna', symbol: 'Empty Circle', quality: 'Moveable', rulingPlanet: 'Rahu', power: 'Bheshaja Shakti' },
  'Purva Bhadrapada': { deity: 'Aja Ekapada', symbol: 'Sword/Two Front Legs of Funeral Cot', quality: 'Fierce/Severe', rulingPlanet: 'Jupiter', power: 'Yajamana Udyamana Shakti' },
  'Uttara Bhadrapada': { deity: 'Ahir Budhnya', symbol: 'Back Legs of Funeral Cot, Twins', quality: 'Fixed/Stable', rulingPlanet: 'Saturn', power: 'Varshodyamana Shakti' },
  'Revati': { deity: 'Pushan', symbol: 'Fish/Drum', quality: 'Soft/Tender', rulingPlanet: 'Mercury', power: 'Kshiradyapani Shakti' }
};

const QuickReferenceData: React.FC<QuickReferenceDataProps> = ({ chartData }) => {
  if (!chartData) return null;

  const ascendant = chartData.ascendant;
  const planets = chartData.planets || [];
  const moon = planets.find((p: any) => p.name === 'Moon');

  const getSign = (obj: any) => obj?.zodiac_sign || obj?.sign || '';
  const getNakshatra = (obj: any) => {
    if (!obj?.nakshatra) return 'Unknown';
    if (typeof obj.nakshatra === 'string') return obj.nakshatra;
    return obj.nakshatra?.name || 'Unknown';
  };
  const getPada = (obj: any) => {
    if (typeof obj?.nakshatra === 'object') return obj.nakshatra?.pada || 1;
    return obj?.pada || 1;
  };
  const getDegree = (obj: any) => {
    if (obj?.longitude !== undefined) return obj.longitude % 30;
    return obj?.degree || 0;
  };

  const ascendantSign = getSign(ascendant);
  const moonSign = getSign(moon);
  
  const moonNakshatra = getNakshatra(moon);
  const moonPada = getPada(moon);
  const nakshatraInfo = NAKSHATRA_DATA[moonNakshatra] || {
    deity: '-', symbol: '-', quality: '-', rulingPlanet: '-', power: '-'
  };

  const KeyMetric = ({ label, value, subValue, icon: Icon, color = "blue" }: any) => (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
      <div className={`mt-0.5 p-2 rounded-lg bg-${color}-500/10 text-${color}-400`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-slate-200">{value}</p>
        {subValue && <p className="text-xs text-slate-500 mt-1">{subValue}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Chart Overview
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Key Metrics */}
        <div className="space-y-4">
            <KeyMetric 
                label="Ascendant"
                value={ascendantSign}
                subValue={`${getDegree(ascendant).toFixed(2)}° • ${getNakshatra(ascendant)}`}
                icon={Compass}
                color="blue"
            />
            <KeyMetric 
                label="Moon Sign"
                value={moonSign}
                subValue={`${getDegree(moon).toFixed(2)}° • ${ZODIAC_SYMBOLS[moonSign]}`}
                icon={Moon}
                color="indigo"
            />
            <KeyMetric 
                label="Nakshatra"
                value={moonNakshatra}
                subValue={`Pada ${moonPada} • ${nakshatraInfo.quality}`}
                icon={Star}
                color="amber"
            />
             <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/20">
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Deity & Symbol</h4>
                <div className="flex items-center gap-3 mb-2">
                    <Crown className="w-4 h-4 text-amber-500/70" />
                    <span className="text-sm text-slate-300">{nakshatraInfo.deity}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Feather className="w-4 h-4 text-purple-500/70" />
                    <span className="text-sm text-slate-300">{nakshatraInfo.symbol}</span>
                </div>
             </div>
        </div>

        {/* Center/Right: Chart Visual */}
        <div className="lg:col-span-2">
            <div className="h-full min-h-[300px] p-6 rounded-2xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center relative group">
                 <div className="absolute top-4 left-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 py-1 rounded border border-slate-800 bg-slate-900/50">
                        D1 Lagna Chart
                    </span>
                 </div>
                 <div className="w-full max-w-[420px] xl:max-w-[520px] 2xl:max-w-[620px] opacity-90 group-hover:opacity-100 transition-opacity">
                    <SouthIndianChart data={chartData} />
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default QuickReferenceData;
