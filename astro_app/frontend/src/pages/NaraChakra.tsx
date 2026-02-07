
import MainLayout from '../components/layout/MainLayout';
import { User } from 'lucide-react';

const NaraChakra = () => {
    return (
        <MainLayout title="Nara Chakra" breadcrumbs={['Tools', 'Body Parts']}>
            <div className="max-w-4xl mx-auto text-center py-12">
                <User className="w-16 h-16 text-indigo-300 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-slate-800 mb-4">Nara Chakra Analysis</h1>
                <p className="text-slate-500 max-w-lg mx-auto mb-8">
                    Understand how different Nakshatras rule specific parts of the human body and influence health.
                </p>
                <div className="p-8 bg-slate-50 rounded-xl border border-slate-200 inline-block">
                    <p className="font-bold text-slate-400">Coming Soon</p>
                    <p className="text-sm text-slate-500 mt-2">Body Mapping visualization is under development.</p>
                </div>
            </div>
        </MainLayout>
    );
};

export default NaraChakra;
