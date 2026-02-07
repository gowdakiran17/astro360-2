import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Plus, User, MapPin } from 'lucide-react';
import { useChartSettings } from '../../context/ChartContext';
import CreateChartModal from '../CreateChartModal';

const FloatingProfileSwitcher = () => {
    const { currentProfile, availableProfiles, switchProfile, refreshProfiles } = useChartSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSwitch = (profile: any) => {
        switchProfile(profile);
        setIsOpen(false);
    };

    const getDisplayName = (p: any) => {
        if (!p) return 'Select Chart';
        if (p.name) return p.name;
        if (p.first_name) return `${p.first_name} ${p.last_name || ''}`.trim();
        return 'Unnamed Chart';
    };

    // Only show if we have a profile (or we can show "Select Chart")
    if (!currentProfile && availableProfiles.length === 0) return null;

    return (
        <>
            <div 
                className="fixed top-20 right-4 md:right-8 z-40 hidden md:block" 
                ref={dropdownRef}
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-full bg-[#0B0F1A]/80 backdrop-blur-md border border-[#F5A623]/20 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-[#F5A623]/40 transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center text-[#0B0F1A] shadow-inner">
                        <User className="w-4 h-4" />
                    </div>
                    
                    <div className="text-left">
                        <p className="text-[9px] text-[#F5A623] font-bold uppercase tracking-wider leading-none mb-1">Active Chart</p>
                        <p className="text-xs font-bold text-[#EDEFF5] leading-none truncate max-w-[120px]">
                            {getDisplayName(currentProfile)}
                        </p>
                    </div>

                    <div className={`ml-2 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center transition-transform duration-200 ${isOpen ? 'rotate-180 bg-white/10' : ''}`}>
                         <ChevronDown className="w-3 h-3 text-[#A9B0C2]" />
                    </div>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full right-0 mt-3 w-72 bg-[#0B0F1A] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl"
                        >
                            <div className="p-4 border-b border-[rgba(255,255,255,0.08)] bg-[#11162A]/50">
                                <div className="flex items-center justify-between mb-2">
                                     <p className="text-[10px] font-black uppercase tracking-widest text-[#6F768A]">Quick Switch</p>
                                     <span className="text-[10px] font-bold text-[#F5A623] bg-[#F5A623]/10 px-2 py-0.5 rounded-full">
                                         {availableProfiles.length} Charts
                                     </span>
                                </div>
                                
                                <div className="max-h-[240px] overflow-y-auto custom-scrollbar space-y-1 pr-1">
                                    {availableProfiles.map((profile: any) => (
                                        <button
                                            key={profile.id}
                                            onClick={() => handleSwitch(profile)}
                                            className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                                                (currentProfile as any)?.id === profile.id
                                                    ? 'bg-[#F5A623] text-[#0B0F1A] shadow-lg shadow-[#F5A623]/20'
                                                    : 'text-[#A9B0C2] hover:bg-white/5 hover:text-[#EDEFF5]'
                                            }`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                                 (currentProfile as any)?.id === profile.id ? 'bg-black/20' : 'bg-white/5'
                                            }`}>
                                                {getDisplayName(profile).charAt(0)}
                                            </div>
                                            <div className="flex-1 text-left min-w-0">
                                                <p className="text-xs font-bold truncate">{getDisplayName(profile)}</p>
                                                <p className={`text-[10px] truncate flex items-center gap-1 ${
                                                     (currentProfile as any)?.id === profile.id ? 'text-[#0B0F1A]/70' : 'text-[#6F768A]'
                                                }`}>
                                                    <MapPin className="w-2.5 h-2.5" />
                                                    {profile.location_name || 'Unknown'}
                                                </p>
                                            </div>
                                            {(currentProfile as any)?.id === profile.id && (
                                                <Check className="w-4 h-4" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="p-3 bg-[#0B0F1A]">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setIsCreateModalOpen(true);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[#F5A623]/30 text-[#F5A623] hover:bg-[#F5A623]/10 font-bold text-xs transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add New Chart
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <CreateChartModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onChartCreated={(newChart) => {
                    refreshProfiles();
                    switchProfile(newChart); 
                }}
            />
        </>
    );
};

export default FloatingProfileSwitcher;
