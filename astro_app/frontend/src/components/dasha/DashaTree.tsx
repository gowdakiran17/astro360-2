import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashaLevel {
    lord: string;
    start_date: string;
    end_date: string;
    duration_years: number;
    is_current?: boolean;
    antardashas?: DashaLevel[];
    pratyantardashas?: DashaLevel[];
    sookshma_dashas?: DashaLevel[];
    prana_dashas?: DashaLevel[];
}

interface DashaTreeProps {
    dashas: DashaLevel[];
}

const DashaNode = ({ item, level = 0 }: { item: DashaLevel, level?: number }) => {
    const [isOpen, setIsOpen] = useState(item.is_current); // Auto-open current
    const hasChildren = (item.antardashas && item.antardashas.length > 0) || (item.pratyantardashas && item.pratyantardashas.length > 0);

    // Determine children based on level logic (Maha -> Antar -> Pratyantar)
    const children = item.antardashas || item.pratyantardashas || item.sookshma_dashas || item.prana_dashas;

    const levelColors = [
        'border-l-[#6D5DF6]', // Maha - Secondary Accent
        'border-l-[#F5A623]',   // Antar - Primary Accent
        'border-l-[#2ED573]',   // Pratyantar - Success
        'border-l-[#E25555]'   // Sookshma - Warning/Critical
    ];

    return (
        <div className="relative">
            {/* Connection Line */}
            {level > 0 && (
                <div className="absolute left-[-18px] top-6 w-4 h-[1px] bg-[#FFFFFF]/10" />
            )}

            <div
                onClick={() => hasChildren && setIsOpen(!isOpen)}
                className={`relative group flex items-center justify-between p-4 rounded-xl border border-[#FFFFFF]/08 transition-all cursor-pointer mb-2
                    ${item.is_current ? 'bg-[#6D5DF6]/10 border-[#6D5DF6]/30' : 'bg-[#FFFFFF]/04 hover:bg-[#FFFFFF]/06'}
                    ${level > 0 ? 'ml-0' : ''}
                `}
            >
                <div className="flex items-center gap-4">
                        {/* Status Indicator */}
                        <div className={`w-2 h-2 rounded-full ${item.is_current ? 'bg-[#2ED573] shadow-[0_0_8px_rgba(46,213,115,0.5)] animate-pulse' : 'bg-[#6F768A]'}`} />

                        <div>
                            <h4 className={`text-base font-bold ${item.is_current ? 'text-[#EDEFF5]' : 'text-[#A9B0C2]'}`}>
                                {item.lord} <span className="text-[10px] uppercase font-bold text-[#6F768A] ml-2 tracking-wider opacity-60">
                                    {level === 0 ? 'Mahadasha' : level === 1 ? 'Antardasha' : level === 2 ? 'Pratyantar' : level === 3 ? 'Sookshma' : 'Prana'}
                                </span>
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-[#6F768A] mt-1">
                                <span>{item.start_date}</span>
                                <ArrowRight className="w-3 h-3 opacity-50" />
                                <span>{item.end_date}</span>
                            </div>
                        </div>
                    </div>

                {hasChildren && (
                    <div className={`p-1 rounded-full bg-[#FFFFFF]/05 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-4 h-4 text-[#A9B0C2]" />
                    </div>
                )}
            </div>

            {/* Children Render */}
            <AnimatePresence>
                {isOpen && hasChildren && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`pl-4 md:pl-8 border-l-2 ${levelColors[level] || 'border-l-[#6F768A]'} border-opacity-30 ml-4`}
                    >
                        {children?.map((child, idx) => (
                            <DashaNode key={idx} item={child} level={level + 1} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const DashaTree: React.FC<DashaTreeProps> = ({ dashas }) => {
    return (
        <div className="space-y-4">
            {dashas.map((dasha, idx) => (
                <DashaNode key={idx} item={dasha} level={0} />
            ))}
        </div>
    );
};

export default DashaTree;
