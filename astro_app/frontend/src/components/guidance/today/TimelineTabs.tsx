import React from 'react';

interface Props {
  selected: 'today' | 'tomorrow' | 'week';
  onSelect: (val: 'today' | 'tomorrow' | 'week') => void;
  theme?: string;
}

const TimelineTabs: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="flex bg-white/5 p-1 rounded-full border border-white/10 relative">
      {(['today', 'tomorrow', 'week'] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          className={`flex-1 py-2 text-sm font-medium rounded-full transition-all relative z-10 ${selected === tab ? 'text-white' : 'text-white/40 hover:text-white/60'
            }`}
        >
          {tab === 'today' ? 'Today' : tab === 'tomorrow' ? 'Tomorrow' : 'This Week'}
        </button>
      ))}

      {/* Animated Background Pill */}
      <div
        className={`absolute top-1 bottom-1 w-[32%] bg-white/10 rounded-full transition-all duration-300 ease-spring ${selected === 'today' ? 'left-1' : selected === 'tomorrow' ? 'left-[34%]' : 'left-[67%]'
          }`}
      />
    </div>
  );
};

export default TimelineTabs;
