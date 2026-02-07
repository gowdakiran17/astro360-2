import React, { useState } from 'react';
import { InteractionCategory } from '../../../types/guidance';
import InteractionCard from './InteractionCard';
import { Users } from 'lucide-react';

interface Props {
  interactions: InteractionCategory[];
}

const InteractionForecastSection: React.FC<Props> = ({ interactions }) => {
  const [activeTabId, setActiveTabId] = useState(interactions[0]?.id || 'romantic');
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);

  const activeCategory = interactions.find(c => c.id === activeTabId);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Users className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-bold text-white">Interaction Forecast</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        {interactions.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveTabId(cat.id);
              setExpandedSubId(null);
            }}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${activeTabId === cat.id 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }
            `}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-3 min-h-[300px]">
        {activeCategory ? (
          activeCategory.subcategories.map((sub) => (
            <InteractionCard
              key={sub.id}
              data={sub}
              isExpanded={expandedSubId === sub.id}
              onToggle={() => setExpandedSubId(expandedSubId === sub.id ? null : sub.id)}
            />
          ))
        ) : (
          <div className="text-center py-10 text-white/40">
            No interaction data available for this category.
          </div>
        )}
      </div>
    </section>
  );
};

export default InteractionForecastSection;
