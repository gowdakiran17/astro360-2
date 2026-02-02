import React from 'react';
import { Star, Sunrise, Sunset, Eye, MapPin, Moon, Sparkles, Feather, Crown } from 'lucide-react';
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

const ZODIAC_COLORS: Record<string, string> = {
  'Aries': 'text-red-400', 'Taurus': 'text-emerald-400', 'Gemini': 'text-yellow-400', 'Cancer': 'text-blue-400',
  'Leo': 'text-amber-500', 'Virgo': 'text-emerald-500', 'Libra': 'text-pink-400', 'Scorpio': 'text-red-500',
  'Sagittarius': 'text-amber-400', 'Capricorn': 'text-indigo-400', 'Aquarius': 'text-cyan-400', 'Pisces': 'text-teal-400'
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

const QuickReferenceData: React.FC<QuickReferenceDataProps> = ({ chartData, panchangData }) => {
  if (!chartData) return null;

  const ascendant = chartData.ascendant;
  const planets = chartData.planets || [];
  const moon = planets.find((p: any) => p.name === 'Moon');
  const sun = planets.find((p: any) => p.name === 'Sun');

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
  const sunSign = getSign(sun);

  const moonNakshatra = getNakshatra(moon);
  const moonPada = getPada(moon);
  const nakshatraInfo = NAKSHATRA_DATA[moonNakshatra] || {
    deity: 'Unknown',
    symbol: 'Unknown',
    quality: 'Unknown',
    rulingPlanet: 'Unknown',
    power: 'Unknown'
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 backdrop-blur-3xl rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
      <div className="px-8 py-5 border-b border-white/5 flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <Eye className="w-5 h-5 text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Quick Reference</h2>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lagna Chart (D1) */}
        <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center min-h-[380px] shadow-inner relative group">
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded-md">D1</span>
            <span className="text-xs text-slate-500 font-medium">Lagna Chart</span>
          </div>
          <div className="w-full max-w-[320px] transition-transform duration-500 group-hover:scale-[1.02]">
            <SouthIndianChart data={chartData} />
          </div>
        </div>

        {/* Moon Nakshatra */}
        <div className="bg-gradient-to-br from-violet-900/20 via-slate-900/50 to-indigo-900/20 rounded-2xl p-8 border border-white/5 flex flex-col justify-center relative overflow-hidden group">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

          <div className="flex items-center gap-2 mb-6 relative z-10">
            <div className="p-1.5 bg-violet-500/20 rounded-md">
              <Star className="w-4 h-4 text-violet-400" />
            </div>
            <span className="text-violet-200/80 text-sm font-bold uppercase tracking-widest">Moon Nakshatra</span>
          </div>

          <h3 className="text-4xl font-extrabold text-white mb-4 tracking-tight relative z-10">{moonNakshatra}</h3>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-200 text-xs font-bold mb-8 w-fit relative z-10">
            <span>Pada {moonPada}</span>
            <span className="w-1 h-1 bg-violet-400 rounded-full" />
            <span>Quarter {moonPada}/4</span>
          </div>

          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Deity</span>
                <span className="text-slate-200 font-medium">{nakshatraInfo.deity}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-300">
                <Feather className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Symbol</span>
                <span className="text-slate-200 font-medium">{nakshatraInfo.symbol}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Details - Creative Redesign */}
        <div className="bg-slate-900/40 rounded-2xl p-8 border border-white/5 lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Chart Details
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Big Zodiac Cards */}
            <div className="space-y-4">
              {/* Lagna Card */}
              <div className="relative group overflow-hidden bg-slate-800/30 rounded-xl p-4 border border-white/5 hover:bg-slate-800/50 transition-colors">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Lagna (Asc)</span>
                    <span className={`text-lg font-bold ${ZODIAC_COLORS[ascendantSign] || 'text-white'}`}>{ascendantSign}</span>
                  </div>
                  <span className={`text-3xl ${ZODIAC_COLORS[ascendantSign] || 'text-white'} opacity-80 group-hover:scale-110 transition-transform`}>
                    {ZODIAC_SYMBOLS[ascendantSign]}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-400 font-mono relative z-10">{getDegree(ascendant).toFixed(2)}°</div>
                <div className={`absolute -right-6 -bottom-6 text-8xl opacity-[0.03] ${ZODIAC_COLORS[ascendantSign]} pointer-events-none`}>
                  {ZODIAC_SYMBOLS[ascendantSign]}
                </div>
              </div>

              {/* Moon Sign Card */}
              <div className="relative group overflow-hidden bg-slate-800/30 rounded-xl p-4 border border-white/5 hover:bg-slate-800/50 transition-colors">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Moon Sign</span>
                    <span className={`text-lg font-bold ${ZODIAC_COLORS[moonSign] || 'text-white'}`}>{moonSign}</span>
                  </div>
                  <span className={`text-3xl ${ZODIAC_COLORS[moonSign] || 'text-white'} opacity-80 group-hover:scale-110 transition-transform`}>
                    {ZODIAC_SYMBOLS[moonSign]}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-400 font-mono relative z-10">{getDegree(moon).toFixed(2)}°</div>
                <div className={`absolute -right-6 -bottom-6 text-8xl opacity-[0.03] ${ZODIAC_COLORS[moonSign]} pointer-events-none`}>
                  {ZODIAC_SYMBOLS[moonSign]}
                </div>
              </div>

              {/* Sun Sign Card */}
              <div className="relative group overflow-hidden bg-slate-800/30 rounded-xl p-4 border border-white/5 hover:bg-slate-800/50 transition-colors">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Sun Sign</span>
                    <span className={`text-lg font-bold ${ZODIAC_COLORS[sunSign] || 'text-white'}`}>{sunSign}</span>
                  </div>
                  <span className={`text-3xl ${ZODIAC_COLORS[sunSign] || 'text-white'} opacity-80 group-hover:scale-110 transition-transform`}>
                    {ZODIAC_SYMBOLS[sunSign]}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-400 font-mono relative z-10">{getDegree(sun).toFixed(2)}°</div>
                <div className={`absolute -right-6 -bottom-6 text-8xl opacity-[0.03] ${ZODIAC_COLORS[sunSign]} pointer-events-none`}>
                  {ZODIAC_SYMBOLS[sunSign]}
                </div>
              </div>
            </div>

            {/* Column 2: Panchang Grid with Icons */}
            <div className="grid grid-cols-2 gap-4 content-start">
              <div className="p-4 bg-slate-800/20 rounded-xl border border-white/5 flex flex-col gap-2 hover:bg-slate-800/40 transition-colors">
                <Moon className="w-4 h-4 text-indigo-400 mb-1" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Tithi</span>
                  <p className="text-indigo-100 font-bold text-sm leading-tight">{panchangData?.tithi?.name || '-'}</p>
                </div>
              </div>
              <div className="p-4 bg-slate-800/20 rounded-xl border border-white/5 flex flex-col gap-2 hover:bg-slate-800/40 transition-colors">
                <Sunrise className="w-4 h-4 text-amber-400 mb-1" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Yoga</span>
                  <p className="text-amber-100 font-bold text-sm leading-tight">{panchangData?.yoga?.name || '-'}</p>
                </div>
              </div>
              <div className="p-4 bg-slate-800/20 rounded-xl border border-white/5 flex flex-col gap-2 hover:bg-slate-800/40 transition-colors">
                <Feather className="w-4 h-4 text-emerald-400 mb-1" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Karana</span>
                  <p className="text-emerald-100 font-bold text-sm leading-tight">{panchangData?.karana?.name || '-'}</p>
                </div>
              </div>
              <div className="p-4 bg-slate-800/20 rounded-xl border border-white/5 flex flex-col gap-2 hover:bg-slate-800/40 transition-colors">
                <Crown className="w-4 h-4 text-purple-400 mb-1" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Lord</span>
                  <p className="text-purple-100 font-bold text-sm leading-tight">{panchangData?.nakshatra?.lord || '-'}</p>
                </div>
              </div>

              <div className="col-span-2 p-4 bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-xl border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <span className="text-emerald-500/80 text-[10px] uppercase tracking-wider font-bold block mb-0.5">Vedic Weekday</span>
                  <p className="text-emerald-400 font-bold text-base">{panchangData?.vara?.name || '-'}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <span className="text-emerald-400 font-bold text-xs">{panchangData?.vara?.name?.charAt(0)}</span>
                </div>
              </div>
            </div>

            {/* Column 3: Time & Location styled */}
            <div className="space-y-4">
              <div className="bg-slate-800/20 rounded-xl p-5 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-amber-100/60 text-[10px] font-bold uppercase">Sunrise</span>
                    </div>
                    <p className="text-white font-mono text-sm">{panchangData?.sunrise || '06:00 AM'}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5 mb-1">
                      <Sunset className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-orange-100/60 text-[10px] font-bold uppercase">Sunset</span>
                    </div>
                    <p className="text-white font-mono text-sm">{panchangData?.sunset || '06:00 PM'}</p>
                  </div>
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-indigo-900/20 rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-gradient-to-r from-amber-400 to-orange-400" />
                </div>
              </div>

              <div className="bg-slate-800/20 rounded-xl p-4 border border-white/5">
                <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold block mb-1">Balance Dasha</span>
                <div className="flex items-baseline gap-2">
                  <p className="text-amber-200 font-bold text-sm bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 inline-block">
                    {panchangData?.balance_dasha || '-'}
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/20 rounded-xl p-4 border border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold block mb-1">Ayanamsa</span>
                  <p className="text-slate-300 text-xs font-medium">{panchangData?.ayanamsa || 'Lahiri'}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold block mb-1">Julian Day</span>
                  <p className="text-slate-300 text-xs font-medium font-mono">{panchangData?.julian_day ? Math.round(panchangData.julian_day) : '-'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/40 rounded-lg border border-white/5 text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs truncate font-medium">{panchangData?.place || chartData?.birth_details?.location || 'Unknown Location'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickReferenceData;

