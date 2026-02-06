import { X, User, Settings, Calendar, Star, BookOpen, LogOut } from 'lucide-react';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
}

const MobileNavigation = ({ isOpen, onClose, userName, userEmail }: MobileNavigationProps) => {
  const navigationItems = [
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: Calendar, label: 'My Charts', href: '/my-charts' },
    { icon: Star, label: 'Daily Insights', href: '/daily-insights' },
    { icon: BookOpen, label: 'Learn', href: '/learn' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-80 bg-white z-50 transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">{userName || 'User'}</p>
                <p className="text-sm text-slate-500">{userEmail || 'user@example.com'}</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navigationItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                    onClick={onClose}
                  >
                    <item.icon className="w-5 h-5 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200">
            <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors w-full">
              <LogOut className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;