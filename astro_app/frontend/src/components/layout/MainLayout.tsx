import React, { useEffect } from 'react';
import CelestialNavbar from './CelestialNavbar';
import BottomTabBar from './BottomTabBar';
import FloatingProfileSwitcher from './FloatingProfileSwitcher';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: string[];
  showHeader?: boolean;
  disableContentPadding?: boolean;
  theme?: 'default' | 'cosmic';
}

const MainLayout = ({ children, title, showHeader = true, disableContentPadding = false }: MainLayoutProps) => {

  // Update document title
  useEffect(() => {
    if (title) {
      document.title = `${title} | Bhava360`;
    }
  }, [title]);

  const bgClass = 'bg-[#0B0F1A]';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgClass} selection:bg-amber-500/30 text-[#EDEFF5]`}>
      <div className="flex flex-col min-h-screen transition-all duration-300 relative overflow-hidden">
        {/* Sky Background Overlays */}
        <div className="fixed inset-0 pointer-events-none opacity-40">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-900/10 blur-[100px] rounded-full" />
        </div>

        {/* --- PREMIUM CELESTIAL NAVBAR --- */}
        {showHeader && (
          <>
            <CelestialNavbar />
            <BottomTabBar />
            <FloatingProfileSwitcher />
          </>
        )}

        <main className={`flex-1 relative z-10 ${disableContentPadding ? '' : 'p-6 md:p-12'} text-white pb-24 md:pb-32 pt-16 md:pt-32`} >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
