import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, Sparkles, Calendar } from 'lucide-react';

const BottomTabBar = () => {
  const navItems = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/dashboard/main', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/ai-astrologer', icon: Sparkles, label: 'Veda AI' },
    { to: '/daily/guidance', icon: Calendar, label: 'Today' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-[#0B0F1A]/90 backdrop-blur-lg border-t border-white/10" />
      
      <div className="relative flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-full h-full space-y-1
              transition-colors duration-200
              ${isActive ? 'text-[#F5A623]' : 'text-slate-500 hover:text-slate-300'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} 
                />
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute top-0 w-8 h-1 bg-[#F5A623] rounded-b-full shadow-[0_0_10px_#F5A623]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomTabBar;
