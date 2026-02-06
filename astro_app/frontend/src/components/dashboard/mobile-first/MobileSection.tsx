import { ReactNode } from 'react';
import { LucideIcon, ChevronRight } from 'lucide-react';

interface MobileSectionProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  onExpand?: () => void;
  expandable?: boolean;
}

const MobileSection = ({ title, icon: Icon, children, onExpand, expandable = false }: MobileSectionProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        </div>
        {expandable && (
          <button
            onClick={onExpand}
            className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default MobileSection;