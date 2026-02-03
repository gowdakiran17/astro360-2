import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen, Brain, Heart, Briefcase, X } from 'lucide-react';
import api from '../../services/api';

interface TransitInspectorProps {
    transit: any | null; // The selected transit to inspect
    onClose: () => void;
}

const TransitInspector: React.FC<TransitInspectorProps> = ({ transit, onClose }) => {
    const [mode, setMode] = useState<'Beginner' | 'Practitioner' | 'Therapeutic' | 'Strategic'>('Beginner');
    const [aiExplanation, setAiExplanation] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Fetch explanation when transit or mode changes
    React.useEffect(() => {
        if (transit) {
            fetchExplanation();
        }
    }, [transit, mode]);

    const fetchExplanation = async () => {
        setLoading(true);
        try {
            const response = await api.post('ai/transits/explain', {
                transit_event: transit,
                mode: mode
            });
            setAiExplanation(response.data.data);
        } catch (error) {
            console.error("Failed to fetch explanation", error);
        } finally {
            setLoading(false);
        }
    };

    if (!transit) return null;

    const modes = [
        { id: 'Beginner', icon: BookOpen, label: 'Simple' },
        { id: 'Practitioner', icon: Sparkles, label: 'Technical' },
        { id: 'Therapeutic', icon: Heart, label: 'Healing' },
        { id: 'Strategic', icon: Briefcase, label: 'Strategic' },
    ];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-2xl bg-[#0F1426] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {transit.name || "Planetary Transit"}
                            </h2>
                            <p className="text-sm text-slate-400 uppercase tracking-widest">Deep Interpretation</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Mode Selector */}
                    <div className="px-6 py-4 flex gap-3 overflow-x-auto">
                        {modes.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id as any)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all ${mode === m.id
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                <m.icon className="w-4 h-4" />
                                {m.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="p-6 min-h-[300px]">
                        {loading ? (
                            <div className="space-y-4 animate-pulse">
                                <div className="h-4 bg-white/5 rounded w-3/4" />
                                <div className="h-4 bg-white/5 rounded w-full" />
                                <div className="h-4 bg-white/5 rounded w-5/6" />
                            </div>
                        ) : aiExplanation ? (
                            <div className="space-y-6">
                                <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <h4 className="text-sm font-black text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Brain className="w-4 h-4" />
                                        Why This Matters
                                    </h4>
                                    <p className="text-base font-bold text-amber-100/90">
                                        {aiExplanation.why_this_matters}
                                    </p>
                                </div>

                                <div className="prose prose-invert prose-base max-w-none">
                                    <p className="text-slate-200 leading-relaxed whitespace-pre-line text-lg">
                                        {aiExplanation.explanation}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-slate-500 mt-10">
                                Select a mode to analyze this transit.
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-black/20 text-center">
                        <span className="text-xs uppercase tracking-widest text-slate-500">
                            AI interpretation based on deterministic planetary positions
                        </span>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TransitInspector;
