import { useState, useEffect } from 'react';
import api from '../services/api';
import MainLayout from '../components/layout/MainLayout';
import UniversalChart from '../components/charts/UniversalChart';
import {
    Info, Layers, RefreshCw, Star, Sun, Table as TableIcon
} from 'lucide-react';
import AIReportButton from '../components/ai/AIReportButton';
import { useChartSettings } from '../context/ChartContext';

const ShadowPlanets = () => {
    // const navigate = useNavigate();
    const { currentProfile } = useChartSettings();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shadowData, setShadowData] = useState<any[]>([]);
    const [birthData, setBirthData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'Overview' | 'Aprakasha' | 'Upagrahas' | 'Charts'>('Charts');

    useEffect(() => {
        if (currentProfile) {
            fetchShadowPlanets(currentProfile);
        }
    }, [currentProfile]);

    const fetchShadowPlanets = async (profile: any) => {
        setLoading(true);
        setError('');
        try {
            const birthPayload = {
                date: profile.date,
                time: profile.time,
                timezone: profile.timezone,
                latitude: profile.latitude,
                longitude: profile.longitude
            };

            // Fetch Birth Chart for D1
            const birthResponse = await api.post('chart/birth', birthPayload);
            setBirthData(birthResponse.data);

            // Fetch Shadow Planets for S1
            const shadowResponse = await api.post('chart/shadow-planets', {
                birth_details: birthPayload
            });
            setShadowData(shadowResponse.data);
        } catch (err) {
            console.error(err);
            setError('Failed to calculate shadow planets.');
        } finally {
            setLoading(false);
        }
    };

    const int = (n: number) => Math.floor(n);
    const getS1ChartData = () => {
        if (!birthData || !shadowData) return null;

        const ascendant = birthData.ascendant;
        const planets = shadowData.map(p => {
            // Calculate house based on shadow planet longitude and ascendant longitude
            const p_sign_index = int(p.longitude / 30);
            const asc_sign_index = int(ascendant.longitude / 30);

            let diff = p_sign_index - asc_sign_index;
            if (diff < 0) diff += 12;
            const house = diff + 1;

            return {
                name: p.symbol, // Use symbol for chart display (Dh, Vy, etc.)
                longitude: p.longitude,
                zodiac_sign: p.sign,
                house: house
            };
        });

        return { ascendant, planets };
    };

    return (
        <MainLayout title="Shadow Planets" breadcrumbs={['Home', 'Tools', 'Shadow Planets']}>
            <div className="w-full space-y-6 pb-20 px-4 md:px-12">

                {/* Header */}
                <div className="glass-card p-6 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                <Layers className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                    Shadow Planets
                                    <span className="px-2 py-0.5 bg-white/5 text-slate-400 text-[10px] uppercase tracking-wider rounded-md font-bold border border-white/5">Aprakasha & Upagraha</span>
                                </h1>
                                <p className="text-sm text-slate-400 max-w-xl mt-1 font-medium">
                                    Shadow planets are mathematical points representing hidden or subtle influences. They reveal karmic patterns and deeper spiritual layers.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 w-full md:w-auto">
                            {shadowData.length > 0 && birthData && (
                                <AIReportButton
                                    buttonText="AI Shadow Insight"
                                    context={`Shadow Planet Analysis (Upagrahas) for ${currentProfile?.name}`}
                                    data={{ birthData, shadowData }}
                                    className="mr-2"
                                />
                            )}
                            <button
                                onClick={() => currentProfile && fetchShadowPlanets(currentProfile)}
                                className="p-2.5 text-slate-400 hover:text-indigo-400 rounded-xl border border-white/5 bg-white/5 active:scale-95 transition-all"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center space-x-1 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
                        {['Overview', 'Aprakasha', 'Upagrahas', 'Charts'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {error && <div className="bg-rose-500/10 text-rose-400 p-4 rounded-xl border border-rose-500/20 font-medium">{error}</div>}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                        <p className="text-slate-400 animate-pulse font-medium">Calculating sensitive shadow points...</p>
                    </div>
                ) : shadowData.length > 0 && birthData ? (
                    <div className="space-y-6">
                        {/* Tab Content: Charts */}
                        {activeTab === 'Charts' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* S1 Chart */}
                                <div className="glass-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                                        <div className="flex items-center space-x-2">
                                            <Star className="w-4 h-4 text-amber-400" />
                                            <span className="font-bold text-slate-100 text-sm uppercase tracking-wide">Shadow Planets Chart (S1)</span>
                                        </div>
                                    </div>
                                    <div className="p-8 flex justify-center bg-transparent">
                                        <div className="scale-110">
                                            {getS1ChartData() && <UniversalChart data={getS1ChartData()!} />}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Sensitive Points & Upagrahas</p>
                                    </div>
                                </div>

                                {/* D1 Chart */}
                                <div className="glass-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
                                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                                        <div className="flex items-center space-x-2">
                                            <Sun className="w-4 h-4 text-orange-400" />
                                            <span className="font-bold text-slate-100 text-sm uppercase tracking-wide">Birth Chart (D1)</span>
                                        </div>
                                    </div>
                                    <div className="p-8 flex justify-center bg-transparent">
                                        <div className="scale-110">
                                            <UniversalChart data={{
                                                ascendant: birthData.ascendant,
                                                planets: birthData.planets
                                            }} />
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Main Planetary Grid</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Interpretation Info Card */}
                        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-md font-bold text-indigo-400 flex items-center gap-2 mb-3">
                                <Info className="w-5 h-5" />
                                Chart Interpretation
                            </h3>
                            <div className="text-sm text-slate-300 leading-relaxed max-w-4xl space-y-1">
                                <p>The S1 chart displays the positions of all shadow planets and sensitive points alongside your primary D1 birth chart. Key factors to observe:</p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-3">
                                    <li className="flex items-center gap-2 text-slate-400"><div className="w-1 h-1 bg-indigo-500 rounded-full" /> Houses occupied by nodal axis (Rahu/Ketu)</li>
                                    <li className="flex items-center gap-2 text-slate-400"><div className="w-1 h-1 bg-indigo-500 rounded-full" /> Aspects between shadow and natal planets</li>
                                    <li className="flex items-center gap-2 text-slate-400"><div className="w-1 h-1 bg-indigo-500 rounded-full" /> Conjunctions with visible grahas</li>
                                    <li className="flex items-center gap-2 text-slate-400"><div className="w-1 h-1 bg-indigo-500 rounded-full" /> Clusters of upagrahas in specific houses</li>
                                </ul>
                            </div>
                        </div>

                        {/* Position Table */}
                        <div className="glass-card overflow-hidden">
                            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center space-x-2">
                                <TableIcon className="w-4 h-4 text-indigo-400" />
                                <h3 className="font-bold text-slate-100 text-sm uppercase tracking-widest">Shadow Planet Positions</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/5">
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Symbol</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Shadow Name</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Zodiac Sign</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Exact Degree</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {shadowData.map((p, idx) => (
                                            <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <span className="px-2.5 py-1 bg-white/5 text-slate-300 rounded-md text-xs font-black uppercase group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-[0_0_10px_rgba(79,70,229,0.4)] transition-all border border-white/5">
                                                        {p.symbol}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-200 text-sm">{p.name}</td>
                                                <td className="px-6 py-4 text-slate-400 text-sm font-medium">{p.sign}</td>
                                                <td className="px-6 py-4 text-slate-100 text-sm font-black tracking-tighter tabular-nums text-right">{p.degree}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Interpretation Guidelines */}
                        <div className="relative glass-card bg-slate-900/60 p-8 text-white overflow-hidden shadow-2xl border-white/10">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] scale-[2.5] rotate-12 pointer-events-none">
                                <Star className="w-64 h-64 text-white" />
                            </div>
                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-100">
                                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                                            <Star className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                                        </div>
                                        Interpretation Guidelines
                                    </h3>
                                    <div className="space-y-6 text-slate-400 font-medium">
                                        <div className="space-y-4">
                                            <ul className="space-y-3 text-xs leading-relaxed">
                                                <li className="flex gap-2">
                                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                                                    <span>Shadow planets amplify the karmic significance of houses they occupy</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                                                    <span>They create unique opportunities for spiritual growth through challenges</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                                                    <span><strong className="text-slate-200">Rahu:</strong> Drives evolutionary desire, worldly focus, and innovation</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                                                    <span><strong className="text-slate-200">Ketu:</strong> Represents spiritual liberation, past life mastery, and detachment</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                                                    <span>Upagrahas influence specific life departments with subtle but decisive effects</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-indigo-500/30 transition-all">
                                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6">Expert Analysis Framework:</h4>
                                        <ul className="space-y-5 text-[11px] text-slate-400 font-medium leading-relaxed">
                                            {[
                                                "Prioritize the Rahu-Ketu nodal axis houses and signs",
                                                "Identify sensitive conjunctions with Lagna and Moon",
                                                "Evaluate house lord dispositors for nodal placement",
                                                "Analyze clusters of shadow planets in angular houses",
                                                "Confirm timing through current transit overlaps"
                                            ].map((item, i) => (
                                                <li key={i} className="flex gap-3">
                                                    <span className="text-indigo-500 font-black">0{i + 1}</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card p-24 text-center border-dashed">
                        <Layers className="w-16 h-16 text-slate-700 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-bold text-slate-200 mb-2">Shadow Planets Map Ready</h3>
                        <p className="text-slate-400 max-w-sm mx-auto font-medium">Select a birth chart to reveal the 11 sensitive shadow points and their impact on your profile.</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default ShadowPlanets;
