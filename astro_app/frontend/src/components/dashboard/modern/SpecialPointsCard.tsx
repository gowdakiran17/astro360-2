import React from 'react';
import { Target, Sparkles, AlertTriangle, Crown, Star } from 'lucide-react';

interface SpecialPointsCardProps {
  data: any;
}

const SpecialPointsCard: React.FC<SpecialPointsCardProps> = ({ data }) => {
  if (!data) return null;

  const specialPoints = data.special_points || [];
  const badhaka = data.badhaka_info;

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          Special Points & Badhaka
        </h3>
      </div>

      <div className="space-y-6">
        {/* Badhaka Section */}
        {badhaka && (
          <div className="bg-rose-50 border border-rose-100 rounded-lg p-4">
            <h4 className="text-sm font-bold text-rose-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Badhaka (Obstruction)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-rose-500 mb-1">Badhaka House</div>
                <div className="font-bold text-rose-900 text-lg">{badhaka.badhaka_house}th House</div>
              </div>
              <div>
                <div className="text-xs text-rose-500 mb-1">Badhaka Lord</div>
                <div className="font-bold text-rose-900 text-lg">{badhaka.badhaka_lord}</div>
              </div>
              <div className="col-span-2 pt-2 border-t border-rose-200/50">
                <div className="text-xs text-rose-600">
                  Ascendant Type: <span className="font-bold">{badhaka.ascendant_type}</span> ({badhaka.badhaka_sign})
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Special Points Grid */}
        <div className="space-y-3">
          {specialPoints.map((point: any, idx: number) => (
            <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-3 hover:bg-slate-100 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    {point.name.includes("Bhrigu") ? <Sparkles className="w-4 h-4 text-amber-500" /> : 
                     point.name.includes("Fortune") ? <Crown className="w-4 h-4 text-emerald-500" /> :
                     <Star className="w-4 h-4 text-indigo-500" />}
                    {point.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {point.sign} {point.longitude?.toFixed(2)}°
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    {point.nakshatra}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialPointsCard;
