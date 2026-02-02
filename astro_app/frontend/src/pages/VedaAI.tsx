import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Send, Bot, Mic, FileText, Presentation, PenTool,
    User, Calendar, Clock, MapPin, Globe, Plus, Menu, X, Volume2
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
const FEATURE_CARDS = [
    {
        icon: FileText,
        title: 'Chart Analysis',
        description: 'Get detailed analysis of your birth chart with planetary positions and aspects'
    },
    {
        icon: Presentation,
        title: 'Life Predictions',
        description: 'Receive predictions about career, relationships, health, and wealth'
    },
    {
        icon: PenTool,
        title: 'Spiritual Guidance',
        description: 'Discover yogas, doshas, and remedies based on Vedic astrology'
    }
];

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

    const formatWithHighlights = (text: string) => {
        let formattedHtml = text;

        // Replace newlines with breaks
        formattedHtml = formattedHtml.replace(/\n/g, '<br/>');

        // Helper to escape regex special chars
        const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Apply highlights
        HIGHLIGHTS.positive.forEach(phrase => {
            const regex = new RegExp(`(${escapeRegExp(phrase)})`, 'gi');
            formattedHtml = formattedHtml.replace(regex, '<span class="text-green-600 font-bold">$1</span>');
        });

        HIGHLIGHTS.negative.forEach(phrase => {
            const regex = new RegExp(`(${escapeRegExp(phrase)})`, 'gi');
            formattedHtml = formattedHtml.replace(regex, '<span class="text-red-500 font-bold">$1</span>');
        });

        HIGHLIGHTS.warning.forEach(phrase => {
            const regex = new RegExp(`(${escapeRegExp(phrase)})`, 'gi');
            formattedHtml = formattedHtml.replace(regex, '<span class="text-amber-500 font-bold">$1</span>');
        });

        // Make bullet points bold and block
        formattedHtml = formattedHtml.replace(/\* (.*?)(?=<br|$)/g, '<div class="ml-4 my-2 flex items-start"><span class="mr-2 text-purple-500">•</span><span>$1</span></div>');

        return formattedHtml;
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
        <div className="flex h-[calc(100vh-180px)] bg-gray-900 text-white overflow-hidden rounded-2xl">
            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'w-56' : 'w-0'} transition-all duration-300 bg-gray-800/50 flex flex-col overflow-hidden`}>
                {/* Sidebar Header with Toggle */}
                <div className="p-3 flex items-center justify-between border-b border-gray-700">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* New Chat Button */}
                <div className="p-3">
                    <button
                        onClick={handleNewChat}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium"
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
                            className={`group relative px-3 py-2.5 mb-1 rounded-lg cursor-pointer transition-all ${currentChatId === session.id
                                ? 'bg-gray-700'
                                : 'hover:bg-gray-700/50'
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
            <div className="flex-1 flex flex-col bg-gray-900">
                {/* Toggle Sidebar Button (when closed) */}
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="absolute top-4 left-4 z-10 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <Menu className="w-4 h-4" />
                    </button>
                )}

                {/* User Profile Card - VedAstro Style */}
                {mode === 'natal' && currentProfile && (
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-white text-sm">{currentProfile.name}</h3>
                            <div className="flex items-center gap-3 text-xs text-white/80 mt-0.5">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {currentProfile.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {currentProfile.time}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {currentProfile.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Globe className="w-3 h-3" />
                                    {currentProfile.timezone || '+05:30'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages Area with White Background */}
                <div className="flex-1 overflow-y-auto bg-white">
                    <div className="max-w-4xl mx-auto px-6 py-6">
                        {messages.map((msg, i) => (
                            <div key={i} className="mb-6">
                                {msg.role === 'assistant' ? (
                                    <div>
                                        {/* AI Header */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-7 h-7 bg-purple-600 rounded flex items-center justify-center">
                                                <Bot className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="font-semibold text-gray-900 text-sm">Vedant</span>
                                            <Volume2 className="w-4 h-4 text-gray-400 ml-auto cursor-pointer hover:text-gray-600" />
                                        </div>
                                        {/* AI Message */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                            {msg.htmlContent ? (
                                                <div
                                                    className="prose prose-sm max-w-none text-gray-800 leading-relaxed tracking-wide"
                                                    dangerouslySetInnerHTML={{ __html: msg.htmlContent }}
                                                />
                                            ) : (
                                                <div
                                                    className="prose prose-sm max-w-none text-gray-800 leading-relaxed tracking-wide"
                                                    dangerouslySetInnerHTML={{ __html: formatWithHighlights(msg.content) }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-end">
                                        <div className="bg-gray-100 rounded-lg px-4 py-3 max-w-[80%]">
                                            <p className="text-sm text-gray-900">{msg.content}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-7 h-7 bg-purple-600 rounded flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white animate-pulse" />
                                    </div>
                                    <span className="font-semibold text-gray-900 text-sm">Vedant</span>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Feature Cards - Show when no messages */}
                    {messages.length === 0 && (
                        <div className="max-w-4xl mx-auto px-6 pb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {FEATURE_CARDS.map((card, i) => (
                                    <div
                                        key={i}
                                        className="p-5 bg-gray-800 text-white rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer group"
                                    >
                                        <div className="mb-3 p-2.5 bg-gray-700 rounded-lg w-fit">
                                            <card.icon className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <h3 className="text-base font-bold mb-2">{card.title}</h3>
                                        <p className="text-xs text-gray-400 leading-relaxed">{card.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="bg-gray-800 px-6 py-4">
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={handleSend} className="flex items-center gap-2 bg-gray-700 rounded-lg px-4 py-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Send a message to VedaAI"
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
                                className="p-2 text-purple-400 hover:text-purple-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
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
