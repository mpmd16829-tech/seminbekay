import React from 'react';
import { FESTIVAL_INFO } from '../data/festivalData';
import { LanguageMode, DisplayMode } from '../types';
import { Compass } from 'lucide-react';

interface PosterThemeBlockProps {
  langMode: LanguageMode;
  displayMode?: DisplayMode;
}

export const PosterThemeBlock: React.FC<PosterThemeBlockProps> = ({
  langMode,
  displayMode = 'night',
}) => {
  const isLight = displayMode === 'day';

  return (
    <section className="w-full max-w-4xl px-4 sm:px-6 my-2">
      <div
        className={`relative overflow-hidden rounded-2xl border-2 p-3 sm:p-4 text-center shadow-md transition-colors ${
          isLight
            ? 'bg-amber-100/80 border-amber-400 text-stone-900 shadow-amber-900/5'
            : 'bg-gradient-to-r from-amber-500/15 via-emerald-900/40 to-amber-500/15 border-amber-400/60 shadow-lg backdrop-blur-md'
        }`}
      >
        {/* Subtle decorative corner triangles */}
        <div className={`absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 ${isLight ? 'border-amber-600' : 'border-amber-300'}`} />
        <div className={`absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 ${isLight ? 'border-amber-600' : 'border-amber-300'}`} />
        <div className={`absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 ${isLight ? 'border-amber-600' : 'border-amber-300'}`} />
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 ${isLight ? 'border-amber-600' : 'border-amber-300'}`} />

        <div className={`flex items-center justify-center gap-2 mb-1 text-xs uppercase tracking-widest font-bold ${
          isLight ? 'text-amber-800' : 'text-amber-300'
        }`}>
          <Compass className={`w-3.5 h-3.5 ${isLight ? 'text-amber-700' : 'text-amber-400'}`} />
          <span>Thème Officiel • الموضوع الرسمي</span>
          <Compass className={`w-3.5 h-3.5 ${isLight ? 'text-amber-700' : 'text-amber-400'}`} />
        </div>

        {langMode !== 'ar-focus' && (
          <p className={`text-sm sm:text-base md:text-lg font-extrabold tracking-normal sm:tracking-wide ${
            isLight ? 'text-stone-950' : 'text-white'
          }`}>
            « {FESTIVAL_INFO.themeFr} »
          </p>
        )}

        {langMode !== 'fr-focus' && (
          <p
            dir="rtl"
            className={`text-base sm:text-lg md:text-xl font-bold font-arabic mt-1 leading-relaxed ${
              isLight ? 'text-emerald-900' : 'text-amber-300'
            }`}
          >
            « {FESTIVAL_INFO.themeAr} »
          </p>
        )}
      </div>
    </section>
  );
};

