import { Sparkles, ChevronRight } from 'lucide-react';

interface MobileInsightsProps {
  insights: any;
  aiPredictions: any;
}

const MobileInsights = ({ insights, aiPredictions }: MobileInsightsProps) => {
  const getDailyInsights = () => {
    if (!insights?.predictions) return [];
    return insights.predictions.slice(0, 3); // Show top 3 predictions
  };

  const getAIPredictions = () => {
    if (!aiPredictions?.predictions) return [];
    return aiPredictions.predictions.slice(0, 2); // Show top 2 AI predictions
  };

  const dailyInsights = getDailyInsights();
  const aiPredictionsList = getAIPredictions();

  return (
    <div className="space-y-4">
      {/* Daily Horoscope Insights */}
      {dailyInsights.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Today's Guidance</h3>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          
          <div className="space-y-3">
            {dailyInsights.map((insight: any, index: number) => (
              <div key={index} className="p-3 bg-amber-50 rounded-lg">
                <p className="text-sm text-slate-700 leading-relaxed">{insight.prediction}</p>
                <p className="text-xs text-amber-600 mt-1 font-medium">{insight.area}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Predictions */}
      {aiPredictionsList.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">AI Insights</h3>
            <span className="text-xs text-indigo-600 font-medium">Powered by AI</span>
          </div>
          
          <div className="space-y-3">
            {aiPredictionsList.map((prediction: any, index: number) => (
              <div key={index} className="p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm text-slate-700 leading-relaxed">{prediction.text}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-indigo-600 font-medium">{prediction.category}</span>
                  <span className="text-xs text-slate-500">{prediction.confidence}% confidence</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button className="p-3 bg-slate-50 rounded-lg text-left hover:bg-slate-100 transition-colors">
            <p className="text-sm font-medium text-slate-900">View Chart</p>
            <p className="text-xs text-slate-500">Birth details</p>
          </button>
          <button className="p-3 bg-slate-50 rounded-lg text-left hover:bg-slate-100 transition-colors">
            <p className="text-sm font-medium text-slate-900">Transits</p>
            <p className="text-xs text-slate-500">Current positions</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileInsights;