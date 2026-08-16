import React from 'react';

interface PosterBorderProps {
  variant?: 'top' | 'bottom' | 'accent';
}

export const PosterBorder: React.FC<PosterBorderProps> = ({ variant = 'top' }) => {
  return (
    <div className="w-full flex flex-col items-center select-none" aria-hidden="true">
      {/* Tricolor Ribbon: Green, Yellow/Gold with Star & Crescent motif, Red */}
      <div className="w-full h-2 flex">
        <div className="h-full flex-1 bg-emerald-600" />
        <div className="h-full w-24 bg-amber-400" />
        <div className="h-full flex-1 bg-red-600" />
      </div>

      {/* Traditional geometric pattern bar */}
      <div className="w-full py-1.5 px-4 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 flex items-center justify-between border-y border-amber-400/30 text-amber-400 text-xs font-semibold tracking-wider">
        <div className="flex items-center space-x-2 rtl:space-x-reverse opacity-80">
          <span>❖</span>
          <span className="h-px w-8 bg-amber-400/40 hidden sm:inline-block"></span>
          <span>✦</span>
        </div>
        
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-[11px] uppercase tracking-widest text-amber-300 font-medium">
          <span>🇲🇷</span>
          <span className="hidden sm:inline">Hassi El Bekay • Kiffa • Assaba</span>
          <span className="text-amber-400">★ ☽ ★</span>
          <span className="hidden sm:inline" dir="rtl">حاسي البكاي • كيفة • لعصابه</span>
          <span>🇲🇷</span>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse opacity-80">
          <span>✦</span>
          <span className="h-px w-8 bg-amber-400/40 hidden sm:inline-block"></span>
          <span>❖</span>
        </div>
      </div>
    </div>
  );
};
