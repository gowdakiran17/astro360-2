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
  'Aries': 'text-red-400', 'Taurus': 'text-emerald-400', 'Gemini': 'text-yellow-400', 'Cancer': 'text-white',
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
    <div className="bg-white/[0.04] backdrop-blur-3xl rounded-[2.5rem] border border-white/[0.08] overflow-hidden shadow-2xl relative group">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-yellow-500/[0.05] to-transparent pointer-events-none" />
      <div className="px-6 md:px-10 py-6 md:py-8 border-b border-white/[0.08] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 shadow-xl shadow-yellow-500/5 backdrop-blur-md">
            <Eye className="w-5 h-5 text-yellow-400" />
          </div>
          <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Structural Analysis</h2>
        </div>
        <div className="h-2 w-2 rounded-full bg-yellow-500 shadow-[0_0_12px_rgba(251,191,36,0.6)] animate-pulse" />
      </div>

      <div className="p-4 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        {/* Lagna Chart (D1) */}
        <div className="bg-white/[0.06] rounded-[2rem] p-6 md:p-10 border border-white/[0.12] flex flex-col items-center justify-center min-h-[400px] shadow-2xl relative group/chart overflow-hidden hover:bg-white/[0.09] transition-all duration-700">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/[0.05] to-transparent opacity-0 group-hover/chart:opacity-100 transition-opacity duration-1000" />
          <div className="absolute top-6 left-6 flex items-center gap-3 relative z-10">
            <span className="text-sm font-black text-yellow-100 uppercase tracking-widest bg-yellow-500/20 px-4 py-1.5 rounded-full border border-yellow-500/30 shadow-xl backdrop-blur-md">D1 Array</span>
            <span className="text-sm text-white font-black uppercase tracking-[0.2em]">Lagna Chart</span>
          </div>
          <div className="w-full max-w-[320px] transition-all duration-1000 group-hover/chart:scale-[1.05] relative z-10 blur-[0.2px] group-hover/chart:blur-0">
            <SouthIndianChart data={chartData} />
          </div>
        </div>

        {/* Moon Nakshatra */}
        <div className="bg-white/[0.06] rounded-[2rem] p-8 md:p-14 border border-white/[0.12] flex flex-col justify-center relative overflow-hidden group/nakshatra hover:bg-white/[0.09] transition-all duration-700 shadow-2xl">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none group-hover/nakshatra:bg-orange-600/15 transition-colors duration-1000" />

          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="p-2.5 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 shadow-xl shadow-yellow-500/10">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-base font-black text-yellow-200 uppercase tracking-[0.4em]">Lunar Frequency</span>
          </div>

          <h3 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter relative z-10 group-hover/nakshatra:translate-x-2 transition-transform duration-700 leading-none">{moonNakshatra}</h3>

          <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-sm font-black uppercase tracking-[0.3em] text-yellow-200 mb-12 w-fit relative z-10 shadow-xl shadow-yellow-500/5 backdrop-blur-md">
            <span>Pada {moonPada}</span>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            <span>Quarter {moonPada}/4</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            {[
              { label: 'Divine Deity', value: nakshatraInfo.deity, icon: Crown, color: 'yellow' },
              { label: 'Cosmic Symbol', value: nakshatraInfo.symbol, icon: Feather, color: 'orange' }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-5 p-5 bg-white/[0.03] rounded-[1.8rem] border border-white/[0.08] hover:bg-white/[0.08] transition-all duration-500 group/item shadow-lg">
                  <div className={`w-12 h-12 rounded-2xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center text-${item.color}-400 shadow-xl group-hover/item:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-bold mb-1">{item.label}</p>
                    <span className="text-base text-white font-black tracking-tight uppercase whitespace-nowrap">{item.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart Details - Creative Redesign */}
        <div className="bg-white/[0.06] rounded-[2rem] p-6 md:p-10 border border-white/[0.12] lg:col-span-2 relative overflow-hidden group/details shadow-2xl">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-yellow-500/[0.05] to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 shadow-xl shadow-yellow-500/5">
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Temporal Metrics</h3>
            </div>
            <div className="flex-1 max-w-[200px] h-[1px] bg-gradient-to-r from-yellow-500/30 to-transparent ml-8 hidden md:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Big Zodiac Cards */}
            <div className="space-y-6">
              {/* Lagna Card */}
              <div className="relative group overflow-hidden bg-white/[0.02] rounded-3xl p-6 border border-white/[0.05] hover:bg-white/[0.05] transition-all duration-700">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="text-sm text-white uppercase tracking-widest font-black block mb-2">Lagna (Asc)</span>
                    <span className={`text-xl font-black tracking-tight ${ZODIAC_COLORS[ascendantSign] || 'text-white'}`}>{ascendantSign}</span>
                  </div>
                  <span className={`text-4xl ${ZODIAC_COLORS[ascendantSign] || 'text-white'} opacity-90 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700`}>
                    {ZODIAC_SYMBOLS[ascendantSign]}
                  </span>
                </div>
                <div className="mt-4 text-sm text-white font-black tracking-[0.1em] font-mono relative z-10">{getDegree(ascendant).toFixed(2)}°</div>
                <div className={`absolute -right-8 -bottom-8 text-9xl opacity-[0.05] ${ZODIAC_COLORS[ascendantSign]} pointer-events-none group-hover:scale-110 transition-transform duration-1000`}>
                  {ZODIAC_SYMBOLS[ascendantSign]}
                </div>
              </div>

              {/* Moon Sign Card */}
              <div className="relative group overflow-hidden bg-white/[0.02] rounded-3xl p-6 border border-white/[0.05] hover:bg-white/[0.05] transition-all duration-700">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="text-sm text-white uppercase tracking-widest font-black block mb-2">Moon Sign</span>
                    <span className={`text-xl font-black tracking-tight ${ZODIAC_COLORS[moonSign] || 'text-white'}`}>{moonSign}</span>
                  </div>
                  <span className={`text-4xl ${ZODIAC_COLORS[moonSign] || 'text-white'} opacity-90 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700`}>
                    {ZODIAC_SYMBOLS[moonSign]}
                  </span>
                </div>
                <div className="mt-4 text-sm text-white font-black tracking-[0.1em] font-mono relative z-10">{getDegree(moon).toFixed(2)}°</div>
                <div className={`absolute -right-8 -bottom-8 text-9xl opacity-[0.05] ${ZODIAC_COLORS[moonSign]} pointer-events-none group-hover:scale-110 transition-transform duration-1000`}>
                  {ZODIAC_SYMBOLS[moonSign]}
                </div>
              </div>

              {/* Sun Sign Card */}
              <div className="relative group overflow-hidden bg-white/[0.02] rounded-3xl p-6 border border-white/[0.05] hover:bg-white/[0.05] transition-all duration-700">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="text-sm text-white uppercase tracking-widest font-black block mb-2">Sun Sign</span>
                    <span className={`text-xl font-black tracking-tight ${ZODIAC_COLORS[sunSign] || 'text-white'}`}>{sunSign}</span>
                  </div>
                  <span className={`text-4xl ${ZODIAC_COLORS[sunSign] || 'text-white'} opacity-90 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700`}>
                    {ZODIAC_SYMBOLS[sunSign]}
                  </span>
                </div>
                <div className="mt-4 text-sm text-white font-black tracking-[0.1em] font-mono relative z-10">{getDegree(sun).toFixed(2)}°</div>
                <div className={`absolute -right-8 -bottom-8 text-9xl opacity-[0.05] ${ZODIAC_COLORS[sunSign]} pointer-events-none group-hover:scale-110 transition-transform duration-1000`}>
                  {ZODIAC_SYMBOLS[sunSign]}
                </div>
              </div>
            </div>

            {/* Column 2: Panchang Grid with Icons */}
            <div className="grid grid-cols-2 gap-4 content-start">
              {[
                { label: 'Tithi', value: panchangData?.tithi?.name, icon: Moon, color: 'yellow' },
                { label: 'Yoga', value: panchangData?.yoga?.name, icon: Sunrise, color: 'orange' },
                { label: 'Karana', value: panchangData?.karana?.name, icon: Feather, color: 'yellow' },
                { label: 'Lord', value: panchangData?.nakshatra?.lord, icon: Crown, color: 'orange' }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="p-5 bg-white/[0.02] rounded-[1.5rem] border border-white/[0.1] flex flex-col gap-3 hover:bg-white/5 transition-all duration-500 group/pitem">
                    <Icon className={`w-5 h-5 text-${item.color}-400 group-hover/pitem:scale-110 transition-transform`} />
                    <div>
                      <span className="text-sm text-white uppercase font-black tracking-widest block mb-1 opacity-70">{item.label}</span>
                      <p className="text-white font-black text-sm leading-tight uppercase tracking-tight">{item.value || '-'}</p>
                    </div>
                  </div>
                );
              })}

              <div className="col-span-2 bg-gradient-to-br from-yellow-900/40 via-orange-900/30 to-transparent rounded-[2.5rem] p-8 md:p-10 border border-yellow-500/20 shadow-xl backdrop-blur-sm flex items-center justify-between group/vara hover:scale-[1.02] transition-all duration-500">
                <div>
                  <span className="text-yellow-500/80 text-sm uppercase tracking-[0.2em] font-black block mb-1">Celestial Weekday</span>
                  <p className="text-yellow-400 font-black text-lg uppercase tracking-wider">{panchangData?.vara?.name || '-'}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30 shadow-xl group-hover/vara:rotate-6 transition-all">
                  <span className="text-yellow-400 font-black text-lg">{panchangData?.vara?.name?.charAt(0)}</span>
                </div>
              </div>
            </div>

            {/* Column 3: Time & Location styled */}
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-[2.5rem] bg-white/[0.08] border border-white/[0.15] shadow-2xl backdrop-blur-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Sunrise className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-200 text-sm font-black uppercase tracking-widest">Sunrise</span>
                    </div>
                    <p className="text-white font-black text-xl tracking-tight">{panchangData?.sunrise || '06:00 AM'}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-end gap-2 mb-3">
                      <Sunset className="w-5 h-5 text-orange-400" />
                      <span className="text-orange-200 text-sm font-black uppercase tracking-widest">Sunset</span>
                    </div>
                    <p className="text-white font-black text-xl tracking-tight">{panchangData?.sunset || '06:00 PM'}</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div className="w-1/2 h-full bg-gradient-to-r from-yellow-500 to-orange-500 shadow-[0_0_10px_rgba(251,191,36,0.3)]" />
                </div>
              </div>

              <div className="bg-white/[0.04] rounded-[1.5rem] p-5 border border-white/[0.1] shadow-xl group/dasha hover:bg-white/[0.06] transition-all">
                <span className="text-white text-sm uppercase tracking-[0.2em] font-black block mb-2 opacity-70">Balance Dasha</span>
                <div className="flex items-baseline gap-3">
                  <p className="text-yellow-400 font-black text-base bg-yellow-500/10 px-4 py-1.5 rounded-xl border border-yellow-500/20 inline-block uppercase tracking-tight">
                    {panchangData?.balance_dasha || '-'}
                  </p>
                </div>
              </div>

              <div className="bg-white/[0.04] rounded-[1.5rem] p-5 border border-white/[0.1] grid grid-cols-2 gap-5 shadow-xl">
                <div>
                  <span className="text-white text-sm uppercase tracking-widest font-black block mb-1.5 opacity-70">Ayanamsa</span>
                  <p className="text-white text-base font-black uppercase tracking-tight">{panchangData?.ayanamsa || 'Lahiri'}</p>
                </div>
                <div>
                  <span className="text-white text-sm uppercase tracking-widest font-black block mb-1.5 opacity-70">Julian Day</span>
                  <p className="text-white text-base font-black tracking-tight">{panchangData?.julian_day ? Math.round(panchangData.julian_day).toLocaleString() : '-'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-5 py-3 bg-yellow-500/5 rounded-xl border border-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10 transition-all duration-500">
                <MapPin className="w-4 h-4" />
                <span className="text-[10px] truncate font-black uppercase tracking-[0.1em]">{panchangData?.place || chartData?.birth_details?.location || 'Unknown Location'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickReferenceData;

