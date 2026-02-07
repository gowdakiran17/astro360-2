import React from 'react';
import { CommunicationQuality } from '../../../types/guidance';
import { MessageSquare, Users, Briefcase, Phone } from 'lucide-react';

interface Props {
  communication: CommunicationQuality;
}

const CommunicationQualityCard: React.FC<Props> = ({ communication }) => {
  return (
    <section className="bg-white/5 rounded-2xl border border-white/10 p-5">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-bold text-white">Communication</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
         <div>
            <div className="flex justify-between text-xs text-white/60 mb-1">
               <span>Listening</span>
               <span>{communication.listeningQuality}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-blue-400 rounded-full" style={{ width: `${communication.listeningQuality}%` }} />
            </div>
         </div>
         <div>
            <div className="flex justify-between text-xs text-white/60 mb-1">
               <span>Clarity</span>
               <span>{communication.speakingClarity}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-green-400 rounded-full" style={{ width: `${communication.speakingClarity}%` }} />
            </div>
         </div>
         <div>
            <div className="flex justify-between text-xs text-white/60 mb-1">
               <span>Reactivity</span>
               <span>{communication.emotionalReactivity}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-red-400 rounded-full" style={{ width: `${communication.emotionalReactivity}%` }} />
            </div>
         </div>
         <div>
            <div className="flex justify-between text-xs text-white/60 mb-1">
               <span>Overall</span>
               <span>{communication.overall}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-purple-400 rounded-full" style={{ width: `${communication.overall}%` }} />
            </div>
         </div>
      </div>

      <div className="space-y-2">
         <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex gap-3">
            <Briefcase className="w-4 h-4 text-white/40 mt-0.5" />
            <div>
               <h4 className="text-xs font-bold text-white/60 uppercase">At Work</h4>
               <p className="text-sm text-white/90">{communication.contextAdvice.office}</p>
            </div>
         </div>
         <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex gap-3">
            <Users className="w-4 h-4 text-white/40 mt-0.5" />
            <div>
               <h4 className="text-xs font-bold text-white/60 uppercase">With Family</h4>
               <p className="text-sm text-white/90">{communication.contextAdvice.family}</p>
            </div>
         </div>
         <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex gap-3">
            <Phone className="w-4 h-4 text-white/40 mt-0.5" />
            <div>
               <h4 className="text-xs font-bold text-white/60 uppercase">Clients/Calls</h4>
               <p className="text-sm text-white/90">{communication.contextAdvice.clients}</p>
            </div>
         </div>
      </div>
    </section>
  );
};

export default CommunicationQualityCard;
