import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Send, Bot, User, Sparkles, BookOpen, Clock,
    Brain, Trash2, Calendar, MapPin, Hash
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useChartSettings } from '../context/ChartContext';
import ChatHistorySidebar from '../components/ai/ChatHistorySidebar';

const fixHtmlContent = (html: string) => {
    if (!html) return html;

    // Log original for debugging intermittent issues
    console.log('Original Chart HTML:', html);

    // 1. Replace webapi with api subdomain (api is more reliable for public image access)
    let fixed = html.replace(/webapi\.vedastro\.org/g, 'api.vedastro.org');

    // 2. Fix missing slashes before ChartType (Robust fix for finding +05:30ChartType)
    // Ensures 'ChartType' is always preceded by a slash if it's not already
    fixed = fixed.replace(/(?<!\/)(ChartType)/g, '/$1');

    // 3. Fix double slashes in URLs which can break image rendering
    // and ensure URLs are absolute if needed
    fixed = fixed.replace(/src="([^"]+)"/g, (_match, src) => {
        // Only replace double slashes after the protocol
        const cleanSrc = src.replace(/([^:])\/\//g, '$1/');
        return `src="${cleanSrc}"`;
    });

    console.log('Fixed Chart HTML:', fixed);
    return fixed;
};

interface Message {
    role: 'user' | 'assistant';
    content: string;
    htmlContent?: string;
    timestamp: Date;
    suggestions?: string[];
}

const AIChatPage = () => {
    const location = useLocation();
    const { user } = useAuth();
    const { currentProfile } = useChartSettings();

    const [mode, setMode] = useState<'natal' | 'guru' | 'horary'>('natal');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [bookCode, setBookCode] = useState('PrasnaMarga');
    const [horaryNumber, setHoraryNumber] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Determine mode based on URL
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('ai-guru')) setMode('guru');
        else if (path.includes('ai-horary')) setMode('horary');
        else setMode('natal');

        setMessages([]);
        setSessionId(null);
    }, [location.pathname, currentProfile?.name]); // Reset session if profile changes

    // Load Chat History on Mount/Mode Change
    useEffect(() => {
        const loadHistory = async () => {
            if (!user) return;
            try {
                const response = await api.get('chat/history');
                if (response.data && Array.isArray(response.data)) {
                    const history: Message[] = response.data.map((msg: any) => ({
                        role: msg.role,
                        content: msg.content,
                        htmlContent: msg.html_content,
                        timestamp: new Date(msg.timestamp),
                        suggestions: msg.suggestions
                    }));
                    setMessages(history);
                    // Set session ID from last message if available
                    if (history.length > 0) {
                        // Logic to recover session ID could be improved if needed
                    }
                }
            } catch (error) {
                console.error("Failed to load chat history", error);
            }
        };
        loadHistory();
    }, [user, mode]);

    const saveMessageToDB = async (msg: Message, sid: string | null) => {
        if (!user) return;
        try {
            await api.post('chat/message', {
                role: msg.role,
                content: msg.content,
                html_content: msg.htmlContent,
                session_id: sid,
                suggestions: msg.suggestions
            });
        } catch (error) {
            console.error("Failed to save message", error);
        }
    };

    const clearHistory = async () => {
        try {
            await api.delete('chat/history');
            setMessages([]);
            setSessionId(null);
        } catch (error) {
            console.error("Failed to clear history", error);
        }
    };

    const handleSessionSelect = async (selectedSessionId: string) => {
        setSessionId(selectedSessionId);
        setMessages([]);
        setIsLoading(true);
        try {
            const response = await api.get('chat/history', {
                params: { session_id: selectedSessionId }
            });
            if (response.data && Array.isArray(response.data)) {
                const history: Message[] = response.data.map((msg: any) => ({
                    role: msg.role,
                    content: msg.content,
                    htmlContent: msg.html_content,
                    timestamp: new Date(msg.timestamp),
                    suggestions: msg.suggestions
                }));
                setMessages(history);
            }
        } catch (error) {
            console.error("Failed to load session", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewChat = () => {
        setMessages([]);
        setSessionId(null);
        setInput('');
    };

    // Auto-initialize Natal/Horary session if profile is available
    useEffect(() => {
        if (mode !== 'guru' && currentProfile && !sessionId && messages.length === 0 && !isLoading) {
            const initChat = async () => {
                setIsLoading(true);
                try {
                    // Step 1: Initialize session
                    const response = await api.post('ai/chat', {
                        user_query: "", // Empty query triggers initialization
                        context: mode,
                        user_id: user?.id?.toString() || 'anonymous',
                        session_id: null,
                        chart_data: currentProfile
                    });

                    const data = response.data;
                    console.log('🔍 Init Response:', data);
                    console.log('📋 Follow-up questions:', data.follow_up_questions);

                    if (data.status === "Pass") {
                        const sid = data.session_id;
                        setSessionId(sid);

                        // Fallback suggestions if API doesn't provide them
                        const defaultSuggestions = [
                            "💡 Will higher education help me?",
                            "🎉 Will party lifestyle help me?",
                            "👥 Friends or family: who helps me?",
                            "💍 Will marriage bring me happiness?",
                            "🧘 Will monk life benefit me?",
                            "✈️ Can travel improve my life?",
                            "📈 Will I succeed in stock trading?",
                            "⭐ Will I become famous?",
                            "💰 Will I become a millionaire?",
                            "👫 Describe my future spouse",
                            "👨‍👦 Relationship with my father?",
                            "🎰 Can I win the lottery?",
                            "🔍 Special yogas in my chart?",
                            "💼 Best career path for me?",
                            "🌍 Will I get foreign education?"
                        ];

                        const suggestions = data.follow_up_questions && data.follow_up_questions.length > 0
                            ? data.follow_up_questions
                            : defaultSuggestions;

                        // Show chart with suggestions immediately (no detailed text)
                        const firstMsg: Message = {
                            role: 'assistant',
                            content: data.answer,
                            htmlContent: data.html_answer,
                            timestamp: new Date(),
                            suggestions: suggestions
                        };

                        console.log('💬 First message with suggestions:', firstMsg);
                        setMessages([firstMsg]);

                        // Save the initialization message
                        saveMessageToDB(firstMsg, sid);
                    }
                } catch (error) {
                    console.error('Initialization Error:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            initChat();
        }
    }, [mode, currentProfile, sessionId, messages.length, isLoading]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e?: React.FormEvent, suggestionText?: string) => {
        if (e) e.preventDefault();

        const messageText = suggestionText || input;
        if (!messageText.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: messageText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Save User Message
        saveMessageToDB(userMessage, sessionId);

        try {
            const response = await api.post('ai/chat', {
                user_query: messageText,
                context: mode,
                user_id: user?.id?.toString() || 'anonymous',
                session_id: sessionId,
                chart_data: currentProfile,
                book_code: mode === 'guru' ? bookCode : undefined,
                horary_number: mode === 'horary' ? horaryNumber : undefined
            });

            const data = response.data;
            const aiMessage: Message = {
                role: 'assistant',
                content: data.answer,
                htmlContent: data.html_answer,
                timestamp: new Date(),
                suggestions: data.follow_up_questions
            };

            setMessages(prev => [...prev, aiMessage]);
            if (data.session_id) setSessionId(data.session_id);

            // Save AI Message
            saveMessageToDB(aiMessage, data.session_id || sessionId);

        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'I apologize, but I encountered an error connecting to the cosmic server. Please try again.',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const getModeTitle = () => {
        switch (mode) {
            case 'natal': return 'VedaAI - Natal Astrologer';
            case 'guru': return 'AI Guru - Spiritual Teacher';
            case 'horary': return 'Horary Prasna - Event Prediction';
            default: return 'AI Astrology Chat';
        }
    };

    const getModeIcon = () => {
        switch (mode) {
            case 'natal': return <Sparkles className="w-6 h-6 text-[#6D5DF6]" />;
            case 'guru': return <BookOpen className="w-6 h-6 text-[#2ED573]" />;
            case 'horary': return <Clock className="w-6 h-6 text-[#F5A623]" />;
        }
    };

    return (
        <div className="flex h-[calc(100vh-140px)] bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.08)] overflow-hidden shadow-2xl relative">
            {/* Cosmic Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6D5DF6]/20 via-[#11162A]/20 to-[#0B0F1A]/40 pointer-events-none z-0" />

            {/* Embedded Sidebar */}
            <ChatHistorySidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                onSessionSelect={handleSessionSelect}
                onNewChat={handleNewChat}
                currentSessionId={sessionId}
            />

            {/* Main Chat Area */}
            <div className="flex flex-col flex-1 relative z-10">
                <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.08)] bg-[#0B0F1A]/20 backdrop-blur-md flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-[#6D5DF6] to-[#5B4BC4] rounded-xl shadow-lg border border-[rgba(255,255,255,0.1)]">
                            {getModeIcon()}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#EDEFF5] tracking-tight drop-shadow-sm">{getModeTitle()}</h2>
                            <p className="text-[11px] text-[#A9B0C2] font-medium tracking-wide">Powered by VedAstro Engine</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={clearHistory}
                            className="group p-2 text-[#6F768A] hover:text-[#E25555] hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-all duration-200"
                            title="Clear History"
                        >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>

                {mode === 'natal' && currentProfile && (
                    <div className="px-6 py-2 bg-[#6D5DF6]/5 border-b border-[rgba(255,255,255,0.08)] flex items-center gap-4 text-xs text-[#A9B0C2] z-10 backdrop-blur-sm">
                        <div className="flex items-center gap-1.5"><User className="w-3 h-3 opacity-70" /> <span className="font-medium">{currentProfile.name}</span></div>
                        <div className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.2)]" />
                        <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 opacity-70" /> <span>{currentProfile.date}</span></div>
                        <div className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.2)]" />
                        <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 opacity-70" /> <span>{currentProfile.location}</span></div>
                    </div>
                )}

                {mode === 'horary' && (
                    <div className="px-6 py-3 bg-[#F5A623]/10 border-b border-[#F5A623]/20 flex items-center gap-4 z-10">
                        <span className="text-xs font-bold text-[#F5A623] uppercase tracking-widest">Horary Context</span>
                        <div className="flex items-center gap-2">
                            <Hash className="w-3.5 h-3.5 text-[#F5A623]" />
                            <input
                                type="number"
                                placeholder="1-249"
                                value={horaryNumber}
                                onChange={(e) => setHoraryNumber(e.target.value)}
                                className="bg-[#0B0F1A]/40 border border-[#F5A623]/30 text-[#EDEFF5] text-xs px-2 py-1 rounded w-20 focus:outline-none focus:border-[#F5A623] transition-all font-mono"
                            />
                        </div>
                    </div>
                )}

                {mode === 'guru' && (
                    <div className="px-6 py-3 bg-[#2ED573]/10 border-b border-[#2ED573]/20 flex items-center gap-4 z-10">
                        <span className="text-xs font-bold text-[#2ED573] uppercase tracking-widest">Source Text</span>
                        <select
                            value={bookCode}
                            onChange={(e) => setBookCode(e.target.value)}
                            className="bg-[#0B0F1A]/40 border border-[#2ED573]/30 text-[#EDEFF5] text-xs px-3 py-1 rounded focus:outline-none focus:border-[#2ED573] transition-all"
                        >
                            <option value="PrasnaMarga">Prasna Marga (Event Prediction)</option>
                            <option value="BrihatParasharaHoraShastra">BPHS (Fundamentals)</option>
                            <option value="Saravali">Saravali (Phala Jyotish)</option>
                        </select>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth custom-scrollbar z-10">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-700">
                            <div className="w-24 h-24 bg-gradient-to-br from-[#6D5DF6]/20 to-[#5B4BC4]/20 rounded-full flex items-center justify-center mb-8 ring-1 ring-[rgba(255,255,255,0.1)] shadow-[0_0_40px_-10px_rgba(109,93,246,0.3)]">
                                <Brain className="w-12 h-12 text-[#6D5DF6] animate-pulse-slow" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#EDEFF5] mb-3 tracking-tight">Cosmic Intelligence</h3>
                            <p className="text-[#A9B0C2] max-w-sm leading-relaxed mb-8">
                                {mode === 'natal' && "Your personal stargazer is ready. Ask about your planetary placements, career path, or relationships."}
                                {mode === 'guru' && "Tap into the ancient wisdom of the sages. Explore the depths of astrological texts."}
                                {mode === 'horary' && "Divine the answer to specific questions using the time-honored Prasha method."}
                            </p>

                            <div className="flex flex-wrap justify-center gap-2 max-w-md">
                                {mode === 'natal' && [
                                    "What does my Sun placement mean?",
                                    "Check my career prospects",
                                    "When will I have good fortune?"
                                ].map(q => (
                                    <button key={q} onClick={() => { setInput(q); }} className="px-4 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] rounded-full text-xs text-[#A9B0C2] hover:text-[#EDEFF5] hover:border-[#6D5DF6]/50 transition-all duration-300">
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500 group`}>
                                <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-[#6D5DF6] to-[#5B4BC4] ring-2 ring-[#6D5DF6]/30'
                                        : 'bg-[#11162A] border border-[rgba(255,255,255,0.08)] ring-2 ring-[#0B0F1A]'
                                        }`}>
                                        {msg.role === 'user' ? <User className="w-5 h-5 text-[#EDEFF5]" /> : <Bot className="w-5 h-5 text-[#6D5DF6]" />}
                                    </div>
                                    <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} flex-1 min-w-0`}>
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-center justify-between w-full mb-1.5 px-1">
                                                <span className="text-[10px] font-bold text-[#6D5DF6] uppercase tracking-wider flex items-center gap-1.5">
                                                    <span>{mode === 'guru' ? '📜 Ancient Text' : '👴 VedaAI'}</span>
                                                </span>
                                            </div>
                                        )}
                                        <div className={`px-5 py-4 rounded-2xl text-[15px] leading-7 shadow-xl backdrop-blur-sm ${msg.role === 'user'
                                            ? 'bg-gradient-to-br from-[#6D5DF6] to-[#5B4BC4] text-[#EDEFF5] shadow-[#6D5DF6]/20 rounded-tr-none border border-[#6D5DF6]/20'
                                            : 'bg-[#11162A]/90 text-[#EDEFF5] border border-[rgba(255,255,255,0.08)] rounded-tl-none shadow-black/20'
                                            }`}>
                                            {msg.htmlContent ? (
                                                <div className="prose prose-invert prose-sm max-w-none 
                                                prose-img:mx-auto prose-img:rounded-xl prose-img:border prose-img:border-[rgba(255,255,255,0.08)] prose-img:shadow-md
                                                prose-headings:text-[#EDEFF5] prose-headings:font-bold prose-headings:tracking-tight
                                                prose-p:text-[#A9B0C2] prose-p:leading-7
                                                prose-strong:text-[#F5A623] prose-strong:font-semibold
                                                prose-a:text-[#6D5DF6] prose-a:no-underline hover:prose-a:underline"
                                                    dangerouslySetInnerHTML={{ __html: fixHtmlContent(msg.htmlContent) }}
                                                />
                                            ) : (
                                                <div className={msg.role === 'assistant' ? 'text-[#A9B0C2]' : ''}>
                                                    {msg.content}
                                                </div>
                                            )}
                                        </div>
                                        {/* Suggestion Chips */}
                                        {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-4 animate-fadeIn px-1 w-full justify-end">
                                                {msg.suggestions.map((suggestion, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSend({ preventDefault: () => { } } as any, suggestion)}
                                                        className="px-4 py-2 bg-[#0B0F1A]/80 backdrop-blur-sm text-[#6D5DF6] text-xs font-semibold rounded-lg 
                                                             border border-[rgba(255,255,255,0.08)] hover:bg-[#6D5DF6]/10 hover:border-[#6D5DF6]/30 hover:shadow-md hover:-translate-y-0.5
                                                             transition-all duration-300 shadow-sm flex items-center gap-1.5 active:scale-95"
                                                    >
                                                        <Sparkles className="w-3 h-3 opacity-70" /> {suggestion}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        <span className="mt-2 text-[10px] text-[#6F768A]/60 px-2 font-medium">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="flex justify-start pl-2">
                            <div className="flex gap-4 items-center">
                                <div className="w-9 h-9 rounded-xl bg-[#0B0F1A] border border-[rgba(255,255,255,0.08)] flex items-center justify-center shadow-lg">
                                    <Bot className="w-5 h-5 text-[#6D5DF6] animate-pulse" />
                                </div>
                                <div className="flex gap-1.5 px-4 py-3 bg-[rgba(255,255,255,0.04)] rounded-full border border-[rgba(255,255,255,0.08)] backdrop-blur-md">
                                    <div className="w-2 h-2 bg-[#6D5DF6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-[#6D5DF6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-[#6D5DF6] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-[#0B0F1A]/80 backdrop-blur-md border-t border-[rgba(255,255,255,0.08)] z-20">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3 relative">
                        <input
                            type="text"
                            placeholder={`Ask your ${mode === 'guru' ? 'guru' : 'astrologer'} anything...`}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#EDEFF5] text-sm px-6 py-4 rounded-xl focus:outline-none focus:border-[#6D5DF6]/50 focus:bg-[rgba(255,255,255,0.06)] transition-all shadow-inner placeholder:text-[#6F768A]"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-2 bottom-2 aspect-square bg-gradient-to-br from-[#6D5DF6] to-[#5B4BC4] text-[#EDEFF5] rounded-lg shadow-lg shadow-[#6D5DF6]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-0 disabled:scale-90 flex items-center justify-center"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    <p className="text-[10px] text-center text-[#6F768A] mt-3 font-medium tracking-wide">
                        {mode === 'horary' ? "Select a number (1-249) before asking." : "The AI provides guidance; use your intuition for big life decisions."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AIChatPage;
