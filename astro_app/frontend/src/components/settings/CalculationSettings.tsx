import React from 'react';
import { Settings, Check, X } from 'lucide-react';
import { useChart, CalculationSettings as SettingsType } from '../../context/ChartContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const CalculationSettings: React.FC<Props> = ({ isOpen, onClose }) => {
    const { settings, updateSettings } = useChart();

    const ayanamsas: { value: SettingsType['ayanamsa']; label: string; desc: string }[] = [
        { value: 'LAHIRI', label: 'Lahiri (Chitra Paksha)', desc: 'Standard Vedic Ayanamsa. Default.' },
        { value: 'RAMAN', label: 'B.V. Raman', desc: 'Used by Raman school of astrology.' },
        { value: 'KP', label: 'K.P. (Krishnamurti)', desc: 'Used in KP Astrology.' },
        { value: 'TROPICAL', label: 'Tropical (Sayana)', desc: 'Western Zodiac (0° Ayanamsa).' },
    ];

    const houseSystems: { value: SettingsType['houseSystem']; label: string; desc: string }[] = [
        { value: 'PLACIDUS', label: 'Placidus', desc: 'Standard for KP & Western. Unequal houses.' },
        { value: 'WHOLE_SIGN', label: 'Whole Sign', desc: 'Standard Vedic (Rasi). 1 Sign = 1 House.' },
        { value: 'EQUAL', label: 'Equal House', desc: 'Ascendant defines house starts (30° each).' },
        { value: 'PORPHYRY', label: 'Porphyry', desc: 'Sri Pati Paddhati base.' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-[10%] left-0 right-0 mx-auto w-[90%] max-w-lg bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-2xl z-[101] overflow-hidden"
                    >
                        <div className="p-6 border-b border-[#1E293B] flex justify-between items-center bg-[#0B0F1A]">
                            <h2 className="text-xl font-bold text-[#F8FAFC] flex items-center gap-2">
                                <Settings className="w-5 h-5 text-[#6D5DF6]" />
                                Calculation Settings
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-[#1E293B] rounded-full transition-colors">
                                <X className="w-5 h-5 text-[#94A3B8]" />
                            </button>
                        </div>

                        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
                            
                            {/* Ayanamsa Section */}
                            <section>
                                <h3 className="text-[#94A3B8] text-xs font-bold uppercase tracking-widest mb-4">Ayanamsa System</h3>
                                <div className="space-y-3">
                                    {ayanamsas.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => updateSettings({ ayanamsa: opt.value })}
                                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                                                settings.ayanamsa === opt.value
                                                    ? 'bg-[#6D5DF6]/10 border-[#6D5DF6] shadow-[0_0_20px_-10px_#6D5DF6]'
                                                    : 'bg-[#1E293B]/50 border-transparent hover:border-[#334155]'
                                            }`}
                                        >
                                            <div className="text-left">
                                                <p className={`font-semibold ${settings.ayanamsa === opt.value ? 'text-[#6D5DF6]' : 'text-[#F1F5F9]'}`}>
                                                    {opt.label}
                                                </p>
                                                <p className="text-xs text-[#64748B] mt-1">{opt.desc}</p>
                                            </div>
                                            {settings.ayanamsa === opt.value && (
                                                <Check className="w-5 h-5 text-[#6D5DF6]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* House System Section */}
                            <section>
                                <h3 className="text-[#94A3B8] text-xs font-bold uppercase tracking-widest mb-4">House System</h3>
                                <div className="space-y-3">
                                    {houseSystems.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => updateSettings({ houseSystem: opt.value })}
                                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                                                settings.houseSystem === opt.value
                                                    ? 'bg-[#F5A623]/10 border-[#F5A623] shadow-[0_0_20px_-10px_#F5A623]'
                                                    : 'bg-[#1E293B]/50 border-transparent hover:border-[#334155]'
                                            }`}
                                        >
                                            <div className="text-left">
                                                <p className={`font-semibold ${settings.houseSystem === opt.value ? 'text-[#F5A623]' : 'text-[#F1F5F9]'}`}>
                                                    {opt.label}
                                                </p>
                                                <p className="text-xs text-[#64748B] mt-1">{opt.desc}</p>
                                            </div>
                                            {settings.houseSystem === opt.value && (
                                                <Check className="w-5 h-5 text-[#F5A623]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </section>

                        </div>

                        <div className="p-4 bg-[#0B0F1A] border-t border-[#1E293B] flex justify-end">
                            <button 
                                onClick={onClose}
                                className="px-6 py-2 bg-[#F1F5F9] text-[#0F172A] font-bold rounded-lg hover:bg-white transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CalculationSettings;
