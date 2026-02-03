import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Construction } from 'lucide-react';

interface PlaceholderProps {
    title: string;
    breadcrumbs: string[];
}

const PlaceholderIntelligence: React.FC<PlaceholderProps> = ({ title, breadcrumbs }) => {
    return (
        <MainLayout title={title} breadcrumbs={breadcrumbs} showHeader={true} disableContentPadding={false}>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 space-y-6">
                <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
                    <Construction className="w-10 h-10 text-amber-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Build In Progress</h2>
                    <p className="text-white/60 max-w-md mx-auto">
                        The <strong>{title}</strong> module is currently being calibrated by our celestial architects. Access will be available shortly.
                    </p>
                </div>
                <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-amber-500/80">
                    STATUS: CONSTRUCTION
                </div>
            </div>
        </MainLayout>
    );
};

export default PlaceholderIntelligence;
