import { Menu, Bell, Settings } from 'lucide-react';

interface MobileHeaderProps {
  userName: string;
  location?: string;
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

const MobileHeader = ({ userName, location, onMenuToggle, isMenuOpen }: MobileHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <Menu className="w-5 h-5 text-slate-700" />
            ) : (
              <Menu className="w-5 h-5 text-slate-700" />
            )}
          </button>
          <div>
            <h1 className="text-sm font-semibold text-slate-900">{userName}</h1>
            {location && (
              <p className="text-xs text-slate-500">{location}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors" aria-label="Notifications">
            <Bell className="w-5 h-5 text-slate-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors" aria-label="Settings">
            <Settings className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;