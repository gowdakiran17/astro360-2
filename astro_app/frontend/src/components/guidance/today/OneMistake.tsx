import React from 'react';
import { AlertOctagon } from 'lucide-react';

interface Props {
  mistake: string;
  theme?: any;
}

const OneMistake: React.FC<Props> = ({ mistake }) => {
  return (
    <section className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
      <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
      <div>
         <h3 className="text-xs font-bold text-red-400 uppercase tracking-wide mb-1">Avoid This Mistake</h3>
         <p className="text-sm text-red-100/90">{mistake}</p>
      </div>
    </section>
  );
};

export default OneMistake;
