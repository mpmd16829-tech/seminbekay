import React from 'react';
import { FESTIVAL_INFO } from '../data/festivalData';
import { LanguageMode, DisplayMode } from '../types';
import { PosterBorder } from './PosterBorder';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface PosterFooterProps {
  langMode: LanguageMode;
  displayMode?: DisplayMode;
}

export const PosterFooter: React.FC<PosterFooterProps> = ({
  langMode,
  displayMode = 'night',
}) => {
  const isLight = displayMode === 'day';

  return (
    <footer className="w-full mt-2 flex flex-col items-center">
      {/* Golden Highlighted Participation Tagline Bar */}
      <div className="w-full max-w-4xl px-4 sm:px-6 mb-3">
        <div
          className={`rounded-2xl border-2 p-3 sm:p-4 text-center shadow-lg transition-colors ${
            isLight
              ? 'bg-amber-100/90 border-amber-400 text-stone-900 shadow-amber-900/5'
              : 'bg-gradient-to-r from-red-950/80 via-amber-950/80 to-emerald-950/80 border-amber-400/60 text-stone-100 shadow-xl'
          }`}
        >
          {/* Tag: Participation ouverte à tous — المشاركة مفتوحة للجميع */}
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm tracking-wide shadow-md mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-900" />
            <span>
              {FESTIVAL_INFO.footerOpenFr} — <span className="font-arabic font-bold">{FESTIVAL_INFO.footerOpenAr}</span>
            </span>
          </div>

          {/* Slogan FR */}
          {langMode !== 'ar-focus' && (
            <p className={`text-sm sm:text-base font-extrabold uppercase tracking-wider font-latin-display ${
              isLight ? 'text-stone-950' : 'text-white'
            }`}>
              « {FESTIVAL_INFO.footerTaglineFr} »
            </p>
          )}

          {/* Slogan AR */}
          {langMode !== 'fr-focus' && (
            <p
              dir="rtl"
              className={`text-base sm:text-lg font-extrabold font-arabic mt-1 leading-snug ${
                isLight ? 'text-emerald-900' : 'text-amber-300'
              }`}
            >
              « {FESTIVAL_INFO.footerTaglineAr} »
            </p>
          )}
        </div>
      </div>

      {/* Decorative Bottom Tricolor Ribbon */}
      <PosterBorder variant="bottom" />
    </footer>
  );
};

