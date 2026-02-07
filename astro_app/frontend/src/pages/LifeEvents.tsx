
import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { 
    Calendar, Plus, Trash2, Tag, 
    Heart, Briefcase, Home
} from 'lucide-react';

interface LifeEvent {
    id: string;
    title: string;
    date: string;
    category: 'career' | 'relationship' | 'health' | 'relocation' | 'family' | 'other';
    notes: string;
}

const LifeEvents = () => {
    const [events, setEvents] = useState<LifeEvent[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    
    // Form State
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState<LifeEvent['category']>('career');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        // Load from local storage for demo
        const stored = localStorage.getItem('user_life_events');
        if (stored) {
            setEvents(JSON.parse(stored));
        }
    }, []);

    const saveEvent = () => {
        if (!title || !date) return;
        
        const newEvent: LifeEvent = {
            id: Date.now().toString(),
            title,
            date,
            category,
            notes
        };
        
        const updated = [...events, newEvent];
        setEvents(updated);
        localStorage.setItem('user_life_events', JSON.stringify(updated));
        
        // Reset
        setTitle('');
        setDate('');
        setNotes('');
        setIsAdding(false);
    };

    const deleteEvent = (id: string) => {
        const updated = events.filter(e => e.id !== id);
        setEvents(updated);
        localStorage.setItem('user_life_events', JSON.stringify(updated));
    };

    const getIcon = (cat: string) => {
        switch(cat) {
            case 'relationship': return <Heart className="w-5 h-5 text-pink-500" />;
            case 'career': return <Briefcase className="w-5 h-5 text-blue-500" />;
            case 'relocation': return <Home className="w-5 h-5 text-amber-500" />;
            default: return <Tag className="w-5 h-5 text-slate-500" />;
        }
    };

    return (
        <MainLayout title="Life Events Journal" breadcrumbs={['Profile', 'Life Events']}>
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">My Life Events</h1>
                        <p className="text-slate-500 mt-2 max-w-lg">
                            Track significant milestones in your life. This data helps our AI calibrate your chart and improve prediction accuracy by correlating past events with planetary movements.
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Add Event
                    </button>
                </div>

                {/* Add Form */}
                {isAdding && (
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 animate-in fade-in slide-in-from-top-4">
                        <h3 className="font-bold text-slate-800 mb-4">Add New Event</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Event Title</label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Got Married"
                                    className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                                <input 
                                    type="date" 
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                                <select 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as any)}
                                    className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                >
                                    <option value="career">Career & Job</option>
                                    <option value="relationship">Love & Marriage</option>
                                    <option value="health">Health & Wellness</option>
                                    <option value="relocation">Relocation / Travel</option>
                                    <option value="family">Family & Children</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setIsAdding(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={saveEvent}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
                            >
                                Save Event
                            </button>
                        </div>
                    </div>
                )}

                {/* Timeline List */}
                <div className="space-y-4">
                    {events.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">No events recorded yet.</p>
                            <p className="text-sm text-slate-400">Add your first life event to start calibration.</p>
                        </div>
                    ) : (
                        events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((event) => (
                            <div key={event.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-indigo-100 transition-colors group">
                                <div className="p-3 bg-slate-50 rounded-full border border-slate-100">
                                    {getIcon(event.category)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-slate-800 text-lg">{event.title}</h3>
                                        <button 
                                            onClick={() => deleteEvent(event.id)}
                                            className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-indigo-600 font-medium text-sm mb-1">
                                        {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded uppercase tracking-wide font-bold">
                                        {event.category}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </MainLayout>
    );
};

export default LifeEvents;
