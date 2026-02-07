
import MainLayout from '../components/layout/MainLayout';
import { Hand } from 'lucide-react';

const MudraPlanets = () => {
    return (
        <MainLayout title="Planets on Fingers" breadcrumbs={['Tools', 'Mudra Therapy']}>
            <div className="max-w-4xl mx-auto text-center py-12">
                <Hand className="w-16 h-16 text-indigo-300 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-slate-800 mb-4">Mudra & Hand Astrology</h1>
                <p className="text-slate-500 max-w-lg mx-auto mb-8">
                    Discover which parts of your hand correspond to different planets and how to use Mudras for planetary remedies.
                </p>
                <div className="p-8 bg-slate-50 rounded-xl border border-slate-200 inline-block">
                    <p className="font-bold text-slate-400">Coming Soon</p>
                    <p className="text-sm text-slate-500 mt-2">Interactive 3D Hand Model is under development.</p>
                </div>
            </div>
        </MainLayout>
    );
};

export default MudraPlanets;
