import { useState } from 'react';
import { Clock, Activity } from 'lucide-react';

interface DashaData {
  current_mahadasha: string;
  current_antardasha: string;
  antardasha_end_date: string;
  mahadasha_end_date: string;
}

interface YoginiDashaPeriod {
  dasha: string;
  lord: string;
  start_year: number;
  end_year: number;
  duration: number;
  is_balance: boolean;
}

interface DashaDisplayProps {
  data: DashaData | null;
  yoginiData?: YoginiDashaPeriod[];
}

const DashaDisplay = ({ data, yoginiData }: DashaDisplayProps) => {
  const [activeTab, setActiveTab] = useState<'vimshottari' | 'yogini'>('vimshottari');

  if (!data && !yoginiData) return null;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
      <div className="bg-purple-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Clock className="h-6 w-6 text-white mr-2" />
          <h3 className="text-xl font-bold text-white">Dasha Periods</h3>
        </div>
        <div className="flex bg-purple-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('vimshottari')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'vimshottari' ? 'bg-white text-purple-700' : 'text-purple-200 hover:text-white'
            }`}
          >
            Vimshottari
          </button>
          <button
            onClick={() => setActiveTab('yogini')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'yogini' ? 'bg-white text-purple-700' : 'text-purple-200 hover:text-white'
            }`}
          >
            Yogini
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {activeTab === 'vimshottari' && data && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Mahadasha */}
              <div className="bg-purple-50 rounded-lg p-5 border border-purple-100">
                <h4 className="text-sm uppercase tracking-wide text-purple-600 font-semibold mb-2">Current Mahadasha</h4>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">{data.current_mahadasha}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Ends on: <span className="font-medium text-gray-900">{data.mahadasha_end_date}</span>
                </div>
              </div>

              {/* Current Antardasha */}
              <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100">
                <h4 className="text-sm uppercase tracking-wide text-indigo-600 font-semibold mb-2">Current Antardasha</h4>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">{data.current_antardasha}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Ends on: <span className="font-medium text-gray-900">{data.antardasha_end_date}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 rounded p-4 text-sm text-gray-600">
              <p>
                You are currently experiencing the major influence of <strong>{data.current_mahadasha}</strong> with the sub-influence of <strong>{data.current_antardasha}</strong>.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'yogini' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {!yoginiData ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                Yogini Dasha data not available.
              </div>
            ) : (
              <div className="space-y-4">
                 <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yogini</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lord</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {yoginiData.slice(0, 10).map((period, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{period.dasha}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{period.lord}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {Math.floor(period.start_year)} - {Math.floor(period.end_year)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{period.duration} Years</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-xs text-gray-500 text-center italic mt-2">
                  Showing first 10 periods of the 36-year Yogini cycle.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashaDisplay;
