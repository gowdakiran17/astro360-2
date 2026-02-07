
import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { 
    Moon, Sun, Globe,
    AlertTriangle, Calendar, Clock
} from 'lucide-react';

const EclipseHub = () => {
    // Mock Data for Demo
    const upcomingEclipses = [
        {
            type: 'Solar',
            date: '2024-04-08',
            name: 'Total Solar Eclipse',
            visibility: 'North America',
            nakshatra: 'Revati',
            impact: 'High',
            sutak_start: '08:42 AM',
            sutak_end: '01:52 PM'
        },
        {
            type: 'Lunar',
            date: '2024-09-18',
            name: 'Partial Lunar Eclipse',
            visibility: 'Europe, Africa, Americas',
            nakshatra: 'Purva Bhadrapada',
            impact: 'Medium',
            sutak_start: '07:12 PM',
            sutak_end: '11:15 PM'
        }
    ];

    const [selectedEclipse, setSelectedEclipse] = useState(upcomingEclipses[0]);

    return (
        <MainLayout title="Eclipse Hub" breadcrumbs={['Cosmic Events', 'Eclipses']}>
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl bg-black text-white p-10 md:p-16 text-center">
                    <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1 rounded-full text-sm font-medium mb-6">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            <span>Next Event: {upcomingEclipses[0].name}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                            Cosmic Shadows & Spiritual Timing
                        </h1>
                        <p className="text-lg text-slate-300 mb-8">
                            Eclipses are powerful portals for transformation. Track upcoming solar and lunar eclipses, understand their impact on your nakshatra, and follow Vedic rituals.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Eclipse List */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                            Upcoming Eclipses
                        </h2>
                        <div className="space-y-4">
                            {upcomingEclipses.map((eclipse, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => setSelectedEclipse(eclipse)}
                                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                                        selectedEclipse === eclipse 
                                        ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                                        : 'border-slate-100 bg-white hover:border-indigo-200'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                            eclipse.type === 'Solar' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'
                                        }`}>
                                            {eclipse.type}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-600">{eclipse.date}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-1">{eclipse.name}</h3>
                                    <p className="text-sm text-slate-500 flex items-center gap-1">
                                        <Globe className="w-3 h-3" /> {eclipse.visibility}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detail View */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedEclipse.name}</h2>
                                    <p className="text-slate-400 mt-1">{selectedEclipse.date}</p>
                                </div>
                                {selectedEclipse.type === 'Solar' ? <Sun className="w-10 h-10 text-amber-400" /> : <Moon className="w-10 h-10 text-slate-400" />}
                            </div>
                            
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                
                                {/* Key Stats */}
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Astrological Impact</h4>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Nakshatra</span>
                                                <span className="font-bold text-slate-900">{selectedEclipse.nakshatra}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Intensity</span>
                                                <span className={`font-bold ${
                                                    selectedEclipse.impact === 'High' ? 'text-red-600' : 'text-amber-600'
                                                }`}>{selectedEclipse.impact}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sutak Timing (Inauspicious Period)</h4>
                                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-5 h-5 text-red-500" />
                                                <div>
                                                    <p className="text-xs text-red-600 font-semibold uppercase">Starts</p>
                                                    <p className="font-bold text-red-900">{selectedEclipse.sutak_start}</p>
                                                </div>
                                            </div>
                                            <div className="h-8 w-px bg-red-200"></div>
                                            <div>
                                                <p className="text-xs text-red-600 font-semibold uppercase">Ends</p>
                                                <p className="font-bold text-red-900">{selectedEclipse.sutak_end}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Do's and Don'ts */}
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Vedic Guidelines</h4>
                                    <div className="space-y-3">
                                        <div className="flex gap-3 items-start">
                                            <div className="mt-1 min-w-[20px] h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">✕</div>
                                            <p className="text-sm text-slate-600">Avoid eating or cooking during the eclipse period.</p>
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <div className="mt-1 min-w-[20px] h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">✕</div>
                                            <p className="text-sm text-slate-600">Do not start new ventures or sign important contracts.</p>
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <div className="mt-1 min-w-[20px] h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</div>
                                            <p className="text-sm text-slate-600">Chant mantras (Om Namah Shivaya) or meditate.</p>
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <div className="mt-1 min-w-[20px] h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</div>
                                            <p className="text-sm text-slate-600">Take a bath after the eclipse ends to purify aura.</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
};

export default EclipseHub;
