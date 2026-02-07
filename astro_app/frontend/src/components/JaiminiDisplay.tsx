import React from 'react';
import { Star, Eye, Compass, Clock } from 'lucide-react';

interface JaiminiData {
  karakas: Record<string, string>;
  padas: Record<string, string>;
  chara_dasha: Array<{
    sign: string;
    start_date: string;
    end_date: string;
    duration: number;
  }>;
  aspects: {
    sign_aspects: Record<string, string[]>;
    planet_aspects: Record<string, {
      sign: string;
      aspected_by_signs: string[];
      aspected_by_planets: Array<{ name: string; sign: string }>;
    }>;
  };
  argala?: {
    ascendant: string;
    argalas: Array<{
      type: string;
      argala_house: number;
      causing_planets: string[];
      virodha_house: number;
      obstructing_planets: string[];
      status: string;
      net_strength: number;
    }>;
  };
}

interface JaiminiDisplayProps {
  data: JaiminiData;
}

const JaiminiDisplay: React.FC<JaiminiDisplayProps> = ({ data }) => {
  if (!data) return null;

  const karakaMap: Record<string, string> = {
    AK: 'Atmakaraka (Self)',
    AmK: 'Amatyakaraka (Career)',
    BK: 'Bhatrikaraka (Siblings/Guru)',
    MK: 'Matrikaraka (Mother)',
    PiK: 'Putrakaraka (Children)',
    GK: 'Gnatikaraka (Relatives/Strife)',
    DK: 'Darakaraka (Spouse)'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. Karakas Section */}
      <div className="bg-[#11162A] border border-[#FFFFFF]/08 rounded-xl p-6">
        <h3 className="text-lg font-bold text-[#EDEFF5] flex items-center gap-2 mb-6">
          <Star className="w-5 h-5 text-[#F5A623]" />
          Jaimini Karakas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(data.karakas).map(([karaka, planet]) => (
            <div key={karaka} className="bg-[#FFFFFF]/04 rounded-lg p-4 border border-[#FFFFFF]/05">
              <div className="text-xs font-bold text-[#6D5DF6] uppercase tracking-wider mb-1">{karaka}</div>
              <div className="text-xl font-bold text-[#EDEFF5]">{planet}</div>
              <div className="text-[10px] text-[#A9B0C2] mt-1">{karakaMap[karaka] || karaka}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 2. Arudha Padas */}
        <div className="bg-[#11162A] border border-[#FFFFFF]/08 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#EDEFF5] flex items-center gap-2 mb-6">
            <Compass className="w-5 h-5 text-[#2ED573]" />
            Arudha Padas
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(data.padas).map(([pada, sign]) => (
              <div key={pada} className="flex justify-between items-center p-3 bg-[#FFFFFF]/04 rounded-lg border border-[#FFFFFF]/05">
                <span className="font-bold text-[#A9B0C2]">{pada}</span>
                <span className="font-bold text-[#EDEFF5]">{sign}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Chara Dasha */}
        <div className="bg-[#11162A] border border-[#FFFFFF]/08 rounded-xl p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
          <h3 className="text-lg font-bold text-[#EDEFF5] flex items-center gap-2 mb-6 sticky top-0 bg-[#11162A] pb-2 z-10">
            <Clock className="w-5 h-5 text-[#E25555]" />
            Chara Dasha Timeline
          </h3>
          <div className="space-y-3">
            {data.chara_dasha.map((period, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#FFFFFF]/04 rounded-lg border border-[#FFFFFF]/05 hover:bg-[#FFFFFF]/08 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#6D5DF6]/20 flex items-center justify-center text-[#6D5DF6] font-bold text-sm">
                    {period.sign.substring(0, 2)}
                  </div>
                  <div>
                    <div className="font-bold text-[#EDEFF5]">{period.sign}</div>
                    <div className="text-xs text-[#A9B0C2]">{period.duration} Years</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-[#EDEFF5]">
                    {new Date(period.start_date).getFullYear()} - {new Date(period.end_date).getFullYear()}
                  </div>
                  <div className="text-[10px] text-[#A9B0C2]">
                    Ends: {new Date(period.end_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Argala (Intervention) */}
      {data.argala && (
        <div className="bg-[#11162A] border border-[#FFFFFF]/08 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#EDEFF5] flex items-center gap-2 mb-6">
            <div className="w-5 h-5 flex items-center justify-center bg-indigo-500/20 rounded-full text-indigo-400 font-bold text-xs">A</div>
            Argala (Planetary Intervention)
            <span className="ml-auto text-xs font-normal text-[#A9B0C2] bg-[#FFFFFF]/05 px-2 py-1 rounded">Ascendant: {data.argala.ascendant}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.argala.argalas.map((arg, idx) => (
              <div key={idx} className="bg-[#FFFFFF]/04 rounded-lg p-4 border border-[#FFFFFF]/05 hover:border-[#6D5DF6]/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs font-bold text-[#A9B0C2] uppercase">{arg.type}</div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    arg.status === 'Strong Argala' ? 'bg-emerald-500/10 text-emerald-400' :
                    arg.status === 'Obstructed' ? 'bg-rose-500/10 text-rose-400' :
                    arg.status === 'Balanced' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-slate-500/10 text-slate-400'
                  }`}>{arg.status}</div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-xl font-bold text-[#EDEFF5]">{arg.argala_house}H</div>
                  <div className="text-xs text-[#A9B0C2]">vs {arg.virodha_house}H</div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between bg-[#FFFFFF]/02 p-1.5 rounded">
                    <span className="text-[#A9B0C2]">Causing:</span>
                    <span className="font-bold text-[#EDEFF5]">{arg.causing_planets.join(', ') || '-'}</span>
                  </div>
                  <div className="flex justify-between bg-[#FFFFFF]/02 p-1.5 rounded">
                    <span className="text-[#A9B0C2]">Obstructing:</span>
                    <span className="font-bold text-[#EDEFF5]">{arg.obstructing_planets.join(', ') || '-'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Rashi Drishti (Aspects) */}
      <div className="bg-[#11162A] border border-[#FFFFFF]/08 rounded-xl p-6">
        <h3 className="text-lg font-bold text-[#EDEFF5] flex items-center gap-2 mb-6">
          <Eye className="w-5 h-5 text-[#6D5DF6]" />
          Jaimini Aspects (Rashi Drishti)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#A9B0C2] uppercase bg-[#FFFFFF]/04 border-b border-[#FFFFFF]/08">
              <tr>
                <th className="px-4 py-3 font-bold">Planet</th>
                <th className="px-4 py-3 font-bold">Sign</th>
                <th className="px-4 py-3 font-bold">Aspected By Signs</th>
                <th className="px-4 py-3 font-bold">Aspected By Planets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFFFFF]/08">
              {Object.entries(data.aspects.planet_aspects).map(([planet, details]) => (
                <tr key={planet} className="hover:bg-[#FFFFFF]/02">
                  <td className="px-4 py-3 font-bold text-[#EDEFF5]">{planet}</td>
                  <td className="px-4 py-3 text-[#A9B0C2]">{details.sign}</td>
                  <td className="px-4 py-3 text-[#A9B0C2]">
                    <div className="flex flex-wrap gap-1">
                      {details.aspected_by_signs.map(s => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-[#FFFFFF]/05 border border-[#FFFFFF]/10 text-[10px]">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#A9B0C2]">
                    <div className="flex flex-wrap gap-1">
                      {details.aspected_by_planets.length > 0 ? (
                        details.aspected_by_planets.map((p, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-[#6D5DF6]/10 text-[#6D5DF6] border border-[#6D5DF6]/20 text-[10px] font-bold">
                            {p.name} ({p.sign})
                          </span>
                        ))
                      ) : (
                        <span className="text-xs opacity-50">-</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JaiminiDisplay;
