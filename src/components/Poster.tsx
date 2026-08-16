import React, { forwardRef } from 'react';
import { PosterFormat, LanguageMode, ColorTheme, FestivalActivity, DisplayMode } from '../types';
import { PosterBorder } from './PosterBorder';
import { PosterHeader } from './PosterHeader';
import { CountdownWidget } from './CountdownWidget';
import { WeatherWidget } from './WeatherWidget';
import { FloatingFestiveConfetti } from './FloatingFestiveConfetti';
import { PosterThemeBlock } from './PosterThemeBlock';
import { PosterHeroBanner } from './PosterHeroBanner';
import { PosterActivitiesGrid } from './PosterActivitiesGrid';
import { PosterInvitationBlock } from './PosterInvitationBlock';
import { PosterFooter } from './PosterFooter';

interface PosterProps {
  format: PosterFormat;
  langMode: LanguageMode;
  colorTheme: ColorTheme;
  displayMode?: DisplayMode;
  confettiEnabled?: boolean;
  onSelectActivity?: (activity: FestivalActivity) => void;
  onOpenVolunteer?: () => void;
  onOpenInvitation?: () => void;
}

export const Poster = forwardRef<HTMLDivElement, PosterProps>(
  (
    {
      format,
      langMode,
      colorTheme,
      displayMode = 'night',
      confettiEnabled = true,
      onSelectActivity,
      onOpenVolunteer,
      onOpenInvitation,
    },
    ref
  ) => {
    // Determine aspect ratio class & max-width based on format
    const formatStyles = {
      portrait: 'w-full max-w-[840px] min-h-[1188px]', // A4 / Poster standard ratio
      story: 'w-full max-w-[540px] min-h-[960px]',    // 9:16 mobile / WhatsApp story
      banner: 'w-full max-w-[1080px] min-h-[608px]',  // 16:9 widescreen / banner
      square: 'w-full max-w-[760px] min-h-[760px]',   // 1:1 square
    };

    // Color theme backgrounds and border nuances for Night vs Day
    const isLight = displayMode === 'day';

    const nightThemeStyles = {
      'mauritania-classic': 'bg-gradient-to-b from-[#00381d] via-[#051c11] to-[#120606] text-stone-100 border-[#FFD100]/40',
      'assaba-gold': 'bg-gradient-to-b from-[#1a1202] via-[#0a1811] to-[#1a0808] text-stone-100 border-amber-400/60',
      'royal-emerald': 'bg-gradient-to-b from-[#022c16] via-[#041d10] to-[#01140a] text-stone-100 border-emerald-400/50',
      'festive-sahara': 'bg-gradient-to-b from-[#240e07] via-[#0f1a14] to-[#1f0d06] text-stone-100 border-amber-500/50',
    };

    const dayThemeStyles = {
      'mauritania-classic': 'bg-gradient-to-b from-[#fbf8ee] via-[#f4f7f2] to-[#fcf5e8] text-stone-900 border-amber-500/70',
      'assaba-gold': 'bg-gradient-to-b from-[#fefbf0] via-[#faf4e1] to-[#f9eed5] text-stone-900 border-amber-500',
      'royal-emerald': 'bg-gradient-to-b from-[#f0f9f4] via-[#e5f5ec] to-[#d8f0e3] text-stone-900 border-emerald-600/70',
      'festive-sahara': 'bg-gradient-to-b from-[#fff6ed] via-[#ffedd5] to-[#fed7aa] text-stone-900 border-amber-600',
    };

    const currentThemeClass = isLight ? dayThemeStyles[colorTheme] : nightThemeStyles[colorTheme];

    return (
      <div className="flex justify-center w-full p-2 sm:p-4">
        <div
          ref={ref}
          id="festival-poster-canvas"
          className={`relative ${formatStyles[format]} ${currentThemeClass} rounded-2xl shadow-2xl border-4 overflow-hidden flex flex-col items-center justify-between transition-all duration-300 print-container bg-mauritania-pattern`}
        >
          {/* Subtle Festive Animated Floating Elements (Green/Gold/Red/Stars/Crescents) */}
          <FloatingFestiveConfetti enabled={confettiEnabled} />

          {/* Top Decorative Border with Tricolor & Stars */}
          <PosterBorder variant="top" />

          {/* Poster Content Flow */}
          <main className="w-full flex-1 flex flex-col items-center py-2 relative z-10">
            {/* Header: Titles, Edition, Dates, Place */}
            <PosterHeader langMode={langMode} displayMode={displayMode} />

            {/* Countdown to Festival Launch (28 Aug 2026) */}
            <CountdownWidget langMode={langMode} displayMode={displayMode} />

            {/* Weather Widget for Kiffa (Assaba) with Open-Meteo API */}
            <WeatherWidget langMode={langMode} displayMode={displayMode} />

            {/* Official Theme Banner */}
            <PosterThemeBlock langMode={langMode} displayMode={displayMode} />

            {/* Hero Artwork Image */}
            <PosterHeroBanner langMode={langMode} />

            {/* 8 Official Activities Grid */}
            <PosterActivitiesGrid
              langMode={langMode}
              displayMode={displayMode}
              onSelectActivity={onSelectActivity}
            />

            {/* Invitation & Community Call to Action */}
            <PosterInvitationBlock
              langMode={langMode}
              displayMode={displayMode}
              onOpenVolunteer={onOpenVolunteer}
              onOpenInvitation={onOpenInvitation}
            />
          </main>

          {/* Footer: Open to all, Slogan & Bottom Ribbon */}
          <PosterFooter langMode={langMode} displayMode={displayMode} />
        </div>
      </div>
    );
  }
);

Poster.displayName = 'Poster';

