import { Menu, Bell, Settings } from 'lucide-react';

interface MobileHeaderProps {
  userName: string;
  location?: string;
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

const MobileHeader = ({ userName, location, onMenuToggle, isMenuOpen }: MobileHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0F1A]/95 backdrop-blur-md border-b border-[rgba(255,255,255,0.08)]">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.06)] transition-colors text-[#A9B0C2] hover:text-[#EDEFF5]"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <Menu className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <div>
            <h1 className="text-sm font-semibold text-[#EDEFF5]">{userName}</h1>
            {location && (
              <p className="text-xs text-[#6F768A]">{location}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.06)] transition-colors text-[#A9B0C2] hover:text-[#EDEFF5]" aria-label="Notifications">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.06)] transition-colors text-[#A9B0C2] hover:text-[#EDEFF5]" aria-label="Settings">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;