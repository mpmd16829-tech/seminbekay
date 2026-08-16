import React from 'react';
import { FESTIVAL_INFO } from '../data/festivalData';
import { LanguageMode, DisplayMode } from '../types';
import { Calendar, MapPin, Sparkles } from 'lucide-react';

interface PosterHeaderProps {
  langMode: LanguageMode;
  displayMode?: DisplayMode;
  compact?: boolean;
}

export const PosterHeader: React.FC<PosterHeaderProps> = ({
  langMode,
  displayMode = 'night',
  compact = false,
}) => {
  const isLight = displayMode === 'day';

  return (
    <header className="relative w-full text-center px-4 sm:px-8 pt-3 pb-2 flex flex-col items-center">
      {/* Decorative top badge: 3e Édition / النسخة الثالثة */}
      <div
        className={`inline-flex items-center gap-2 px-4 py-1 rounded-full border shadow-sm backdrop-blur-sm font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 transition-colors ${
          isLight
            ? 'bg-amber-400 text-stone-950 border-amber-500 font-bold'
            : 'bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border-amber-400/50 text-amber-300'
        }`}
      >
        <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-stone-950' : 'text-amber-400'}`} />
        {langMode !== 'ar-focus' && <span>{FESTIVAL_INFO.editionFr}</span>}
        {langMode === 'bilingual' && <span className={isLight ? 'text-stone-900 font-bold' : 'text-amber-400 font-bold'}>•</span>}
        {langMode !== 'fr-focus' && <span className="font-arabic">{FESTIVAL_INFO.editionAr}</span>}
      </div>

      {/* Main Dual Titles */}
      <div className="w-full space-y-1">
        {/* French Title */}
        {langMode !== 'ar-focus' && (
          <h1
            className={`text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase font-latin-display drop-shadow-sm ${
              isLight ? 'text-emerald-950' : 'text-white'
            }`}
          >
            <span
              className={
                isLight
                  ? 'bg-gradient-to-r from-emerald-800 via-stone-900 to-emerald-900 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-emerald-300 via-amber-200 to-emerald-300 bg-clip-text text-transparent'
              }
            >
              {FESTIVAL_INFO.titleFr}
            </span>
          </h1>
        )}

        {/* Arabic Title (Amiri/Cairo font with RTL) */}
        {langMode !== 'fr-focus' && (
          <h2
            dir="rtl"
            className={`text-2xl sm:text-4xl md:text-5xl font-bold font-arabic-display drop-shadow-sm leading-relaxed mt-1 ${
              isLight ? 'text-amber-800' : 'text-amber-300'
            }`}
          >
            {FESTIVAL_INFO.titleAr}
          </h2>
        )}
      </div>

      {/* Location & Dates Bar */}
      <div className="mt-2.5 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-medium">
        {/* Location Box */}
        <div
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border shadow-xs transition-colors ${
            isLight
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-emerald-950/70 border-emerald-500/40 text-emerald-100 shadow-inner'
          }`}
        >
          <MapPin className={`w-4 h-4 shrink-0 ${isLight ? 'text-emerald-700' : 'text-amber-400'}`} />
          <div className="text-center leading-tight">
            {langMode !== 'ar-focus' && (
              <p className={`font-bold tracking-wide ${isLight ? 'text-stone-900' : 'text-white'}`}>
                Hassi El Bakaï — Kiffa <span className={isLight ? 'text-emerald-800 font-medium' : 'text-amber-300 font-normal'}>(Wilaya de l’Assaba)</span>
              </p>
            )}
            {langMode !== 'fr-focus' && (
              <p dir="rtl" className={`font-arabic text-xs mt-0.5 ${isLight ? 'text-emerald-900 font-semibold' : 'text-amber-200'}`}>
                حاسي البكاي — كيفة، ولاية لعصابه (موريتانيا)
              </p>
            )}
          </div>
        </div>

        {/* Dates Box */}
        <div
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border shadow-xs transition-colors ${
            isLight
              ? 'bg-red-50 border-red-300 text-red-950'
              : 'bg-red-950/70 border-red-500/40 text-red-100 shadow-inner'
          }`}
        >
          <Calendar className={`w-4 h-4 shrink-0 ${isLight ? 'text-red-700' : 'text-amber-400'}`} />
          <div className="text-center leading-tight">
            {langMode !== 'ar-focus' && (
              <p className={`font-bold tracking-wide ${isLight ? 'text-stone-900' : 'text-white'}`}>
                {FESTIVAL_INFO.datesFr}
              </p>
            )}
            {langMode !== 'fr-focus' && (
              <p dir="rtl" className={`font-arabic text-xs mt-0.5 ${isLight ? 'text-red-900 font-semibold' : 'text-amber-200'}`}>
                {FESTIVAL_INFO.datesAr}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

