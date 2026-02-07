import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, Lightbulb, MessageCircle, AlertTriangle, HelpCircle, Target } from 'lucide-react';
import { InteractionSubcategory } from '../../../types/guidance';

interface InteractionCardProps {
  data: InteractionSubcategory;
  isExpanded: boolean;
  onToggle: () => void;
}

const InteractionCard: React.FC<InteractionCardProps> = ({ data, isExpanded, onToggle }) => {
  const statusConfig = {
    excellent: { color: 'text-green-400', bg: 'bg-green-400/10', dot: 'bg-green-400', label: 'Excellent' },
    favorable: { color: 'text-green-300', bg: 'bg-green-300/10', dot: 'bg-green-300', label: 'Favorable' },
    neutral: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', dot: 'bg-yellow-400', label: 'Neutral' },
    sensitive: { color: 'text-purple-400', bg: 'bg-purple-400/10', dot: 'bg-purple-400', label: 'Sensitive' },
    caution: { color: 'text-red-400', bg: 'bg-red-400/10', dot: 'bg-red-400', label: 'Caution' }
  }[data.status];

  return (
    <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
      {/* Header / Collapsed View */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{data.emoji}</span>
          <div>
            <h4 className="font-semibold text-white">{data.title}</h4>
            <p className="text-sm text-white/60 line-clamp-1">{data.overview}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`hidden sm:flex items-center gap-2 ${statusConfig.bg} px-3 py-1 rounded-full`}>
            <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
            <span className={`text-xs font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
          <div className={`text-lg font-bold ${statusConfig.color}`}>{data.score}</div>
          <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Expanded View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="px-4 pb-4 border-t border-white/10 space-y-5">
              
              {/* Energy Description */}
              <div className="mt-4 italic text-sm text-white/60 bg-white/5 p-3 rounded-lg border border-white/5">
                "{data.energyDescription}"
              </div>

              {/* Good For & Avoid Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2 flex items-center gap-1">
                    <span className="text-lg">✓</span> Good For
                  </h5>
                  <ul className="space-y-1">
                    {data.goodFor.map((item, i) => (
                      <li key={i} className="text-sm text-white/80 pl-2 border-l-2 border-green-500/30">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {data.avoid.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> Avoid
                    </h5>
                    <ul className="space-y-1">
                      {data.avoid.map((item, i) => (
                        <li key={i} className="text-sm text-white/80 pl-2 border-l-2 border-red-500/30">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Best Timing */}
              {data.bestTiming && (
                <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-blue-300">Best Timing: {data.bestTiming.startTime} - {data.bestTiming.endTime}</h5>
                    <p className="text-xs text-blue-200/70">{data.bestTiming.activity}</p>
                  </div>
                </div>
              )}

              {/* Power Move */}
              <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-purple-300">Power Move</h5>
                  <p className="text-sm text-purple-100/80">{data.powerMove}</p>
                </div>
              </div>

              {/* Conversation Starters */}
              {data.conversationStarters && (
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2 flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" /> Conversation Starters
                  </h5>
                  <div className="space-y-2">
                    {data.conversationStarters.map((starter, i) => (
                      <div key={i} className="bg-white/5 rounded px-3 py-2 text-sm text-white/90 italic">
                        "{starter}"
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions to Ask */}
              {data.questionsToAsk && (
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2 flex items-center gap-1">
                    <HelpCircle className="w-4 h-4" /> Questions to Ask
                  </h5>
                  <ul className="space-y-1">
                    {data.questionsToAsk.map((q, i) => (
                      <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Strategy Tips */}
              {data.strategyTips && (
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2 flex items-center gap-1">
                    <Target className="w-4 h-4" /> Strategy
                  </h5>
                  <ul className="space-y-1">
                    {data.strategyTips.map((tip, i) => (
                      <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                        <span className="text-blue-400">→</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Connection Metrics */}
              {data.metrics && (
                <div className="pt-2 border-t border-white/5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">Connection Metrics</h5>
                  <div className="space-y-3">
                    {data.metrics.map(metric => (
                      <div key={metric.label}>
                        <div className="flex justify-between text-xs mb-1 text-white/70">
                          <span>{metric.label}</span>
                          <span>{metric.value}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <button className="w-full mt-2 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-white/90 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <span>🤖</span>
                <span>Ask AI about this interaction</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractionCard;
