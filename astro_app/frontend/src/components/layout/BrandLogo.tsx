import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { box: 'w-7 h-7', text: 'text-[10px]' },
  md: { box: 'w-9 h-9', text: 'text-xs' },
  lg: { box: 'w-12 h-12', text: 'text-sm' },
};

const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showWordmark = true, className = '' }) => {
  const s = sizeMap[size];
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showWordmark && (
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
          Bhava
        </span>
      )}
      <div className={`${s.box} rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-[#050816] font-black ${size === 'sm' ? 'text-[10px]' : 'text-sm'}`}>
        360
      </div>
    </div>
  );
};

export default BrandLogo;
