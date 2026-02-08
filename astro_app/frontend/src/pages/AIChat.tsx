
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, BrainCircuit, Activity, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useChartSettings } from '../context/ChartContext';

interface LogicMetadata {
    confidence: {
        score: number;
        band: string;
        breakdown: string[];
    };
    dasha: any;
    transits: any;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    logic?: LogicMetadata;
}

const AIChat: React.FC = () => {
    const { currentProfile } = useChartSettings();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Using V2 Endpoint
            const response = await api.post('/chat/v2/message', {
                message: userMsg.content,
                chart_id: currentProfile?.raw?.id
            });

            const aiMsg: Message = {
                id: Date.now().toString() + '_ai',
                role: 'assistant',
                content: response.data.response,
                timestamp: new Date(),
                logic: response.data.logic_metadata
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg: Message = {
                id: Date.now().toString() + '_err',
                role: 'assistant',
                content: "I'm having trouble connecting to the astral engine. Please try again.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const getConfidenceColor = (score: number) => {
        if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
        if (score >= 60) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
        return "text-slate-400 border-slate-600 bg-slate-800";
    };

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                        <BrainCircuit className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-white tracking-tight">Astral Logic Engine <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full ml-2">V2</span></h1>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            {currentProfile ? (
                                <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active: {currentProfile.name}</>
                            ) : (
                                <><AlertCircle className="w-3 h-3 text-amber-500" /> Select Chart</>
                            )}
                        </p>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-4 space-y-8 scroll-smooth">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                            <Sparkles className="relative w-16 h-16 text-indigo-400 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-medium text-white">Daily Life Decision Support</h2>
                            <p className="text-slate-400 max-w-sm mx-auto text-sm leading-relaxed">
                                Powered by deterministic logic. No hallucinations. <br />
                                <span className="text-indigo-400">Ask about Career, Relationships, or Timing.</span>
                            </p>
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            key={msg.id}
                            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} gap-2`}
                        >
                            {/* Message Bubble */}
                            <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-6 py-4 shadow-lg ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-900/20'
                                    : 'bg-slate-900 text-slate-200 rounded-bl-none border border-slate-800 shadow-slate-900/50'
                                }`}>
                                <p className="text-sm leading-loose whitespace-pre-wrap">{msg.content}</p>
                            </div>

                            {/* Logic Metadata Display (AI Only) */}
                            {msg.role === 'assistant' && msg.logic && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="max-w-[85%] md:max-w-[75%] w-full"
                                >
                                    <div className="mt-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50 flex flex-wrap gap-3 text-xs">
                                        {/* Confidence Chip */}
                                        <div className={`px-2 py-1 rounded-lg border flex items-center gap-1.5 ${getConfidenceColor(msg.logic.confidence.score)}`}>
                                            <Activity className="w-3.5 h-3.5" />
                                            <span className="font-medium">Confidence: {msg.logic.confidence.score}%</span>
                                        </div>

                                        {/* Dasha Chip */}
                                        {msg.logic.dasha?.mahadasha?.lord && (
                                            <div className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400 flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                <span>Dasha: {msg.logic.dasha.mahadasha.lord} / {msg.logic.dasha.antardasha.lord}</span>
                                            </div>
                                        )}

                                        {/* Transit Chip */}
                                        {msg.logic.transits?.moon?.sign && (
                                            <div className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400 flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                <span>Moon: {msg.logic.transits.moon.sign}</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            <span className="text-[10px] text-slate-500 px-1">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-900/50 rounded-2xl px-6 py-4 rounded-bl-none border border-slate-800/50 flex items-center gap-3">
                            <div className="flex space-x-1.5">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_0ms]" />
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_200ms]" />
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_400ms]" />
                            </div>
                            <span className="text-xs text-indigo-400/80 font-medium animate-pulse">Running Calculations...</span>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </main>

            {/* Input Area */}
            <div className="p-4 bg-slate-900 border-t border-slate-800">
                <div className="flex items-center space-x-2 max-w-4xl mx-auto bg-slate-950 p-2 rounded-2xl border border-slate-800 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all duration-300">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about your timeline..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-4 py-2 text-sm"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="p-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 disabled:scale-100 rounded-xl text-white transition-all shadow-lg shadow-indigo-900/20"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-slate-600">
                        AI runs on verified logic. Accuracy depends on birth time.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AIChat;
