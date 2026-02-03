import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Send, Bot, Mic, User, Calendar, Clock, MapPin, Globe, Plus, Menu, X, Volume2,
    Sparkles, Scroll
} from 'lucide-react';
import api from '../services/api';
import { useChartSettings } from '../context/ChartContext';

const fixHtmlContent = (html: string) => {
    if (!html) return html;
    let fixed = html.replace(/webapi\.vedastro\.org/g, 'api.vedastro.org');
    fixed = fixed.replace(/(?<!\/)(ChartType)/g, '/$1');
    fixed = fixed.replace(/src="([^"]+)"/g, (_match, src) => {
        const cleanSrc = src.replace(/([^:])\/\//g, '$1/');
        return `src="${cleanSrc}"`;
    });
    return fixed;
};

interface Message {
    role: 'user' | 'assistant';
    content: string;
    htmlContent?: string;
    timestamp: Date;
    suggestions?: string[];
}

interface ChatSession {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: Date;
    messageCount: number;
}

// Feature cards for empty state


const MAX_HISTORY_MESSAGES = 50;

const VedaAI = () => {
    const location = useLocation();
    const { currentProfile } = useChartSettings();

    const [mode, setMode] = useState<'natal' | 'guru' | 'horary'>('natal');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [currentChatId, setCurrentChatId] = useState<string>('default');
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Get storage key based on mode and profile
    const getStorageKey = (chatId: string = currentChatId) => {
        if (mode === 'natal' && currentProfile) {
            return `vedaai_chat_${mode}_${currentProfile.name}_${chatId}`;
        }
        return `vedaai_chat_${mode}_${chatId}`;
    };

    const getSessionsKey = () => {
        if (mode === 'natal' && currentProfile) {
            return `vedaai_sessions_${mode}_${currentProfile.name}`;
        }
        return `vedaai_sessions_${mode}`;
    };

    // Load chat sessions list
    const loadChatSessions = () => {
        try {
            const sessionsKey = getSessionsKey();
            const savedSessions = localStorage.getItem(sessionsKey);
            if (savedSessions) {
                const parsed = JSON.parse(savedSessions);
                const sessionsWithDates = parsed.map((session: any) => ({
                    ...session,
                    timestamp: new Date(session.timestamp)
                }));
                setChatSessions(sessionsWithDates);
            }
        } catch (error) {
            console.error('Error loading chat sessions:', error);
        }
    };

    // Semantic keyword highlighting
    const HIGHLIGHTS = {
        positive: [
            'positive indications', 'strongest positives', 'favorable', 'growth and expansion',
            'success', 'prosperity', 'beneficial', 'lucky', 'strength', 'excellent', 'gain',
            'harmony', 'happiness', 'auspicious', 'powerful', 'supportive', 'opportunities',
            'good fortune', 'financial success', 'vitality', 'creativity', 'wisdom'
        ],
        negative: [
            'challenges', 'careful risk management', 'consistent effort', 'patience and resilience',
            'long-term perspective', 'obstacles', 'delays', 'difficulties', 'losses', 'conflicts',
            'health issues', 'stress', 'hard work', 'discipline', 'restriction', 'separation',
            'debts', 'enemies', 'litigation', 'accidents', 'precaution', 'remedy'
        ],
        warning: [
            'be mindful', 'uncertainty and volatility', 'patient and strategic', 'unexpected',
            'caution', 'avoid', 'watch out', 'sudden', 'change', 'instability', 'confusion',
            'illusion', 'impulsive', 'restless', 'anxiety', 'trigger', 'sensitive'
        ]
    };

    const SUGGESTIONS = [
        { text: "Will higher education help me?", emoji: "💡" },
        { text: "Will party lifestyle help me?", emoji: "🎉" },
        { text: "Friends or family: who helps me?", emoji: "🧭" },
        { text: "Will marriage bring me happiness?", emoji: "💍" },
        { text: "Will monk life benefit me?", emoji: "🧘" },
        { text: "Can travel improve my life?", emoji: "✈️" },
        { text: "Will I succeed in stock trading?", emoji: "📈" },
        { text: "Will I become famous?", emoji: "⭐" },
        { text: "Will I become a millionaire?", emoji: "💰" },
        { text: "Describe my future spouse", emoji: "👤" },
        { text: "Relationship with my father?", emoji: "👨‍👩‍👧" },
        { text: "Can I win the lottery?", emoji: "🎟️" },
        { text: "Special yogas in my chart?", emoji: "🔍" },
        { text: "Best career path for me?", emoji: "💼" },
        { text: "Will I get foreign education?", emoji: "🌍" }
    ];

    // --- Dynamic AI Message Renderer (Insight Stream) ---

    const AIMessageRenderer = ({ content }: { content: string }) => {
        // Parse sections based on ## headers
        const sections = content.split(/(?=## (?:VERDICT_PILL|KEY_ALIGNMENTS|COSMIC_NARRATIVE|TIMELINE_JOURNEY|SACRED_REMEDY))/g);

        // Helper to process standard text with highlights
        const processText = (text: string) => {
            let processed = text;

            // Remove the section header itself
            processed = processed.replace(/^## (VERDICT_PILL|KEY_ALIGNMENTS|COSMIC_NARRATIVE|TIMELINE_JOURNEY|SACRED_REMEDY)(?::.*)?\n/, '');

            // Formatting: Headers
            processed = processed.replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold text-yellow-400 !mt-6 !mb-4 border-b border-yellow-500/30 !pb-2">$1</h1>');
            processed = processed.replace(/^### (.*$)/gm, '<h3 class="text-base font-bold text-gray-300 !mt-4 !mb-2">$1</h3>');

            // Formatting: Bold
            processed = processed.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-white">$1</span>');

            // Formatting: Lists
            processed = processed.replace(/(?:^|\n)- (.*?)(?=\n|$)/g, '<div class="ml-4 !my-1 flex items-start"><span class="mr-2 text-yellow-400 font-bold">•</span><span>$1</span></div>');

            // Formatting: Paragraphs to breaks
            processed = processed.replace(/\n\n/g, '<br/><br/>'); // Double newline for paragraphs
            processed = processed.replace(/(?<!>)\n(?!<)/g, ' '); // Single newline to space in narration

            // Highlights
            const highlight = (text: string, phrases: string[], colorClass: string) => {
                phrases.forEach(phrase => {
                    const regex = new RegExp(`(${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                    text = text.replace(regex, `<span class="${colorClass} font-bold">$1</span>`);
                });
                return text;
            };

            processed = highlight(processed, HIGHLIGHTS.positive, 'text-emerald-400');
            processed = highlight(processed, HIGHLIGHTS.negative, 'text-red-400');
            processed = highlight(processed, HIGHLIGHTS.warning, 'text-amber-400');

            return processed;
        };

        return (
            <div className="space-y-6">
                {sections.map((section, idx) => {
                    const trimmed = section.trim();
                    if (!trimmed) return null;

                    // 1. VERDICT PILL
                    if (trimmed.startsWith('## VERDICT_PILL')) {
                        const titleMatch = trimmed.match(/## VERDICT_PILL: \[(.*?)\] (.*)/);
                        const type = titleMatch ? titleMatch[1].toLowerCase() : 'neutral';
                        const title = titleMatch ? titleMatch[2] : trimmed.replace('## VERDICT_PILL:', '').trim();

                        const styles = {
                            gold: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]',
                            red: 'bg-red-500/20 text-red-200 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
                            blue: 'bg-blue-500/20 text-blue-200 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
                            neutral: 'bg-gray-500/20 text-gray-200 border-gray-500/50'
                        };

                        return (
                            <div key={idx} className="flex justify-start mb-4">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border backdrop-blur-md flex items-center gap-2 ${styles[type as keyof typeof styles] || styles.neutral}`}>
                                    <Sparkles className="w-3.5 h-3.5" />
                                    {title}
                                </span>
                            </div>
                        );
                    }

                    // 2. KEY ALIGNMENTS (Quick Stats)
                    if (trimmed.startsWith('## KEY_ALIGNMENTS')) {
                        const lines = trimmed.split('\n').filter(l => l.startsWith('-'));
                        return (
                            <div key={idx} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {lines.map((line, i) => {
                                    // Remove hyphen and split colon
                                    const cleanLine = line.replace(/^- /, '');
                                    const parts = cleanLine.split(':');
                                    const label = parts[0]?.replace(/\*\*/g, '').trim();
                                    const value = parts[1]?.trim();

                                    return (
                                        <div key={i} className="flex-shrink-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2 min-w-[140px]">
                                            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">{label}</div>
                                            <div className="text-xs text-white font-medium truncate">{value}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    }

                    // 3. COSMIC NARRATIVE
                    if (trimmed.startsWith('## COSMIC_NARRATIVE')) {
                        const content = processText(trimmed);
                        return (
                            <div key={idx} className="prose prose-sm max-w-none text-gray-200 leading-7 tracking-wide font-light">
                                <div dangerouslySetInnerHTML={{ __html: content }} />
                            </div>
                        );
                    }

                    // 4. TIMELINE JOURNEY
                    if (trimmed.startsWith('## TIMELINE_JOURNEY')) {
                        const lines = trimmed.split('\n').slice(1).filter(l => l.trim().startsWith('-'));
                        return (
                            <div key={idx} className="mt-6 mb-4 pl-2 relative">
                                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Future Path
                                </h3>
                                {/* Continuous Line */}
                                <div className="absolute left-[15px] top-8 bottom-4 w-0.5 bg-gradient-to-b from-indigo-500 to-transparent opacity-30" />

                                <div className="space-y-5">
                                    {lines.map((line, i) => {
                                        const match = line.match(/- \*\*(.*?)\*\*: (.*)/);
                                        const date = match ? match[1] : '';
                                        const desc = match ? match[2] : line.replace(/^- /, '');

                                        return (
                                            <div key={i} className="flex gap-4 relative z-10 group">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 ring-4 ring-indigo-500/20 group-hover:bg-indigo-300 transition-colors" />
                                                <div>
                                                    <div className="text-xs font-bold text-indigo-200 mb-0.5">{date}</div>
                                                    <div className="text-sm text-gray-300 group-hover:text-white transition-colors">{desc}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    }

                    // 5. SACRED REMEDY
                    if (trimmed.startsWith('## SACRED_REMEDY')) {
                        const content = processText(trimmed);
                        return (
                            <div key={idx} className="mt-6 bg-gradient-to-r from-purple-900/20 to-transparent border-l-2 border-purple-500 pl-4 py-2">
                                <h3 className="text-xs font-bold text-purple-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Scroll className="w-3 h-3" /> Guidance
                                </h3>
                                <div
                                    className="text-sm text-gray-300 italic leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: content }}
                                />
                            </div>
                        );
                    }

                    // Fallback for unparsed text
                    return null;
                })}
            </div>
        );
    };

    // Save chat sessions list
    const saveChatSessions = (sessions: ChatSession[]) => {
        try {
            const sessionsKey = getSessionsKey();
            localStorage.setItem(sessionsKey, JSON.stringify(sessions));
            setChatSessions(sessions);
        } catch (error) {
            console.error('Error saving chat sessions:', error);
        }
    };

    // Update session metadata
    const updateSessionMetadata = () => {
        if (messages.length === 0) return;

        const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
        const title = lastUserMessage?.content.slice(0, 30) || 'New Chat';

        const session: ChatSession = {
            id: currentChatId,
            title,
            lastMessage: messages[messages.length - 1].content.slice(0, 50),
            timestamp: new Date(),
            messageCount: messages.length
        };

        const existingIndex = chatSessions.findIndex(s => s.id === currentChatId);
        let updatedSessions: ChatSession[];

        if (existingIndex >= 0) {
            updatedSessions = [...chatSessions];
            updatedSessions[existingIndex] = session;
        } else {
            updatedSessions = [session, ...chatSessions];
        }

        saveChatSessions(updatedSessions);
    };

    // Load chat history from localStorage
    useEffect(() => {
        const loadHistory = () => {
            try {
                const storageKey = getStorageKey();
                const savedHistory = localStorage.getItem(storageKey);
                if (savedHistory) {
                    const parsed = JSON.parse(savedHistory);
                    const messagesWithDates = parsed.map((msg: any) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    }));
                    setMessages(messagesWithDates);
                } else {
                    setMessages([]);
                }
            } catch (error) {
                console.error('Error loading chat history:', error);
            }
        };

        loadHistory();
        loadChatSessions();
    }, [mode, currentProfile?.name, currentChatId]);

    // Handle incoming context from HoroscopeCard
    useEffect(() => {
        const contextData = sessionStorage.getItem('veda_ai_context');
        if (contextData) {
            try {
                const context = JSON.parse(contextData);
                if (context.question) {
                    // Set the input to the question so the user can just hit send,
                    // or we can auto-send it. Auto-sending is smoother.
                    // But we need to make sure we don't send it multiple times if the user refreshes.
                    // So we remove it from session storage immediately.
                    sessionStorage.removeItem('veda_ai_context');

                    // Use a small timeout to let the component fully mount
                    setTimeout(() => {
                        handleSend(undefined, context.question);
                    }, 500);
                }
            } catch (e) {
                console.error("Error parsing veda_ai_context", e);
            }
        }
    }, []); // Run once on mount

    // Save chat history to localStorage
    useEffect(() => {
        if (messages.length > 0) {
            try {
                const storageKey = getStorageKey();
                const limitedMessages = messages.slice(-MAX_HISTORY_MESSAGES);
                localStorage.setItem(storageKey, JSON.stringify(limitedMessages));
                updateSessionMetadata();
            } catch (error) {
                console.error('Error saving chat history:', error);
            }
        }
    }, [messages]);

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('ai-guru')) setMode('guru');
        else if (path.includes('ai-horary')) setMode('horary');
        else setMode('natal');
    }, [location.pathname]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleNewChat = () => {
        const newChatId = `chat_${Date.now()}`;
        setCurrentChatId(newChatId);
        setMessages([]);
        setSessionId(null);
    };

    const handleSelectChat = (chatId: string) => {
        setCurrentChatId(chatId);
        setSessionId(null);
    };



    const handleSend = async (e?: React.FormEvent, suggestionText?: string) => {
        e?.preventDefault();
        const messageText = suggestionText || input.trim();
        if (!messageText || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: messageText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            let chartData = null;
            if (mode === 'natal' && currentProfile) {
                chartData = {
                    name: currentProfile.name,
                    date: currentProfile.date,
                    time: currentProfile.time,
                    location: currentProfile.location,
                    timezone: currentProfile.timezone || '+05:30'
                };
            }

            const payload = {
                user_query: messageText,
                context: mode,
                chart_data: chartData,
                session_id: sessionId,
                user_id: 'guest_user'
            };

            const response = await api.post('ai/chat', payload);

            const assistantMessage: Message = {
                role: 'assistant',
                content: response.data.answer,
                htmlContent: response.data.html_answer ? fixHtmlContent(response.data.html_answer) : undefined,
                timestamp: new Date(),
                suggestions: response.data.follow_up_questions || []
            };

            setMessages(prev => [...prev, assistantMessage]);
            if (response.data.session_id) {
                setSessionId(response.data.session_id);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-180px)] overflow-hidden rounded-2xl border border-white/10 shadow-2xl relative" style={{ background: '#000000' }}>
            {/* Styles for Star Field */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                .star-field {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 0;
                    overflow: hidden;
                }
                .star {
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: #FBBF24;
                    border-radius: 50%;
                    animation: twinkle 3s ease-in-out infinite;
                }
                `
            }} />

            {/* Star Field Background */}
            <div className="star-field" aria-hidden="true">
                {Array.from({ length: 50 }, (_, i) => (
                    <div
                        key={i}
                        className="star"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-black/20 backdrop-blur-md border-r border-white/10 flex flex-col overflow-hidden relative z-20`}>
                {/* Sidebar Header with Toggle */}
                <div className="p-3 flex items-center justify-between border-b border-white/10">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-300 hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* New Chat Button */}
                <div className="p-3">
                    <button
                        onClick={handleNewChat}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black rounded-lg transition-all shadow-lg shadow-orange-500/20 text-sm font-bold"
                    >
                        <Plus className="w-4 h-4" />
                        New Chat
                    </button>
                </div>

                {/* Chat History List */}
                <div className="flex-1 overflow-y-auto px-2">
                    {chatSessions.map((session) => (
                        <div
                            key={session.id}
                            onClick={() => handleSelectChat(session.id)}
                            className={`group relative px-3 py-2.5 mb-1 rounded-lg cursor-pointer transition-all border border-transparent ${currentChatId === session.id
                                ? 'bg-white/10 border-white/10 text-white shadow-sm'
                                : 'hover:bg-white/5 text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-white truncate mb-0.5">
                                        {session.title}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {session.messageCount} messages • {session.timestamp.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-transparent relative z-10">
                {/* Toggle Sidebar Button (when closed) */}
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="absolute top-4 left-4 z-10 p-2 bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
                    >
                        <Menu className="w-4 h-4" />
                    </button>
                )}

                {/* User Profile Card - VedAstro Style */}
                {mode === 'natal' && currentProfile && (
                    <div className="bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-3 flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                            <User className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-white text-sm">{currentProfile.name}</h3>
                            <div className="flex items-center gap-3 text-xs text-gray-300 mt-0.5">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-yellow-500/70" />
                                    {currentProfile.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-yellow-500/70" />
                                    {currentProfile.time}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-yellow-500/70" />
                                    {currentProfile.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Globe className="w-3 h-3 text-yellow-500/70" />
                                    {currentProfile.timezone || '+05:30'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages Area with Transparent Background */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-6 py-6">
                        {messages.map((msg, i) => (
                            <div key={i} className="mb-6">
                                {msg.role === 'assistant' ? (
                                    <div>
                                        {/* AI Header */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded flex items-center justify-center shadow-lg shadow-orange-500/20">
                                                <Bot className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="font-semibold text-white text-sm">Vedant</span>
                                            <Volume2 className="w-4 h-4 text-gray-400 ml-auto cursor-pointer hover:text-white transition-colors" />
                                        </div>
                                        {/* AI Message */}
                                        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl rounded-tl-none p-5 shadow-xl">
                                            <AIMessageRenderer content={msg.content} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-end">
                                        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-yellow-500/30 rounded-2xl rounded-tr-none px-5 py-3 max-w-[80%] shadow-lg">
                                            <p className="text-sm text-white font-medium">{msg.content}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white animate-pulse" />
                                    </div>
                                    <span className="font-semibold text-white text-sm">Vedant</span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl rounded-tl-none p-4 shadow-xl w-24">
                                    <div className="flex gap-1.5 justify-center">
                                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions Grid - Show when no messages */}
                    {messages.length === 0 && (
                        <div className="max-w-4xl mx-auto px-6 pb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {SUGGESTIONS.map((suggestion, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInput(suggestion.text)}
                                        className="p-3 bg-white/5 backdrop-blur-sm text-left text-gray-200 rounded-xl border border-white/10 hover:border-yellow-500/50 hover:bg-white/10 transition-all cursor-pointer group hover:-translate-y-0.5 duration-200 flex items-center gap-3"
                                    >
                                        <span className="text-xl">{suggestion.emoji}</span>
                                        <span className="text-sm font-medium group-hover:text-white transition-colors">{suggestion.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="bg-black/20 backdrop-blur-md px-6 py-4 border-t border-white/10">
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={handleSend} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:bg-white/10 focus-within:border-white/20 transition-all">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Send a message to Vedant..."
                                className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                                title="Voice input"
                            >
                                <Mic className="w-4 h-4" />
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="p-2 text-yellow-500 hover:text-yellow-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VedaAI;
