import React from 'react';
import { PosterFormat, LanguageMode, ColorTheme, DisplayMode } from '../types';
import { SyncStatusBadge } from './SyncStatusBadge';
import {
  Smartphone,
  Layout,
  Maximize2,
  Square,
  Sparkles,
  Download,
  Share2,
  Calendar,
  Layers,
  HandHeart,
  Eye,
  Languages,
  Sun,
  Moon
} from 'lucide-react';

interface PosterToolbarProps {
  format: PosterFormat;
  setFormat: (fmt: PosterFormat) => void;
  langMode: LanguageMode;
  setLangMode: (lang: LanguageMode) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  confettiEnabled: boolean;
  setConfettiEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  onOpenActivities: () => void;
  onOpenProgram: () => void;
  onOpenVolunteer: () => void;
  onOpenShare: () => void;
  onOpenInvitation: () => void;
}

export const PosterToolbar: React.FC<PosterToolbarProps> = ({
  format,
  setFormat,
  langMode,
  setLangMode,
  colorTheme,
  setColorTheme,
  displayMode,
  setDisplayMode,
  confettiEnabled,
  setConfettiEnabled,
  onOpenActivities,
  onOpenProgram,
  onOpenVolunteer,
  onOpenShare,
  onOpenInvitation,
}) => {
  return (
    <nav className="sticky top-0 z-40 w-full bg-stone-950/95 border-b border-amber-400/30 backdrop-blur-md px-3 sm:px-6 py-2.5 shadow-lg no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Branding & Tag & Firebase Sync Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-900 border border-amber-400/50 text-amber-300 font-bold text-sm shadow">
            🇲🇷
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-extrabold text-white tracking-wide">
                AFFICHE OFFICIELLE 2026 • الملصق الرسمي
              </h1>
            </div>
            <p className="text-[11px] text-amber-300 font-arabic">
              النسخة الثالثة — حاسي البكاي (كيفة، لعصابه)
            </p>
          </div>
          <SyncStatusBadge className="hidden lg:inline-block" />
        </div>

        {/* Center: Controls for Format, Language, Day/Night & Confetti */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Format Selector */}
          <div className="flex items-center p-1 rounded-xl bg-stone-900 border border-stone-800 text-xs">
            <button
              onClick={() => setFormat('portrait')}
              title="Affiche Portrait Standard (A4/A3)"
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                format === 'portrait'
                  ? 'bg-amber-400 text-stone-950 shadow'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portrait A4</span>
            </button>

            <button
              onClick={() => setFormat('story')}
              title="Format Story / WhatsApp (9:16)"
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                format === 'story'
                  ? 'bg-amber-400 text-stone-950 shadow'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Story (9:16)</span>
            </button>

            <button
              onClick={() => setFormat('banner')}
              title="Format Paysage / Bannière (16:9)"
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                format === 'banner'
                  ? 'bg-amber-400 text-stone-950 shadow'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Paysage</span>
            </button>

            <button
              onClick={() => setFormat('square')}
              title="Format Carré Réseaux (1:1)"
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                format === 'square'
                  ? 'bg-amber-400 text-stone-950 shadow'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Carré</span>
            </button>
          </div>

          {/* Day / Night Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-stone-900 border border-stone-800 text-xs">
            <button
              onClick={() => setDisplayMode('night')}
              title="Thème Nuit (Fond sombre saharien)"
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                displayMode === 'night'
                  ? 'bg-indigo-900/90 text-amber-300 border border-indigo-400/50 shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nuit</span>
            </button>
            <button
              onClick={() => setDisplayMode('day')}
              title="Thème Jour (Fond clair solaire)"
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                displayMode === 'day'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Jour</span>
            </button>
          </div>

          {/* Floating Confetti Toggle */}
          <button
            onClick={() => setConfettiEnabled((prev) => !prev)}
            title="Activer/Désactiver les éléments festifs flottants"
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              confettiEnabled
                ? 'bg-emerald-900/90 border-emerald-400 text-emerald-200 shadow-sm'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${confettiEnabled ? 'text-amber-300 animate-spin' : ''}`} />
            <span className="hidden sm:inline">Ambiance Festive</span>
          </button>

          {/* Language Switch */}
          <div className="flex items-center p-1 rounded-xl bg-stone-900 border border-stone-800 text-xs">
            <button
              onClick={() => setLangMode('bilingual')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                langMode === 'bilingual'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Bilingue FR/AR
            </button>
            <button
              onClick={() => setLangMode('ar-focus')}
              className={`px-2.5 py-1 rounded-lg font-semibold font-arabic transition-all ${
                langMode === 'ar-focus'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              العربية
            </button>
            <button
              onClick={() => setLangMode('fr-focus')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                langMode === 'fr-focus'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Français
            </button>
          </div>

          {/* Theme Selector */}
          <div className="hidden lg:flex items-center p-1 rounded-xl bg-stone-900 border border-stone-800 text-xs">
            <button
              onClick={() => setColorTheme('mauritania-classic')}
              title="Couleurs nationales (Vert / Or / Rouge)"
              className={`px-2 py-1 rounded-lg font-semibold transition-all ${
                colorTheme === 'mauritania-classic'
                  ? 'bg-amber-400 text-stone-950'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              National 🇲🇷
            </button>
            <button
              onClick={() => setColorTheme('assaba-gold')}
              title="Teintes Assaba Ocre Doré"
              className={`px-2 py-1 rounded-lg font-semibold transition-all ${
                colorTheme === 'assaba-gold'
                  ? 'bg-amber-400 text-stone-950'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Ocre Assaba
            </button>
            <button
              onClick={() => setColorTheme('royal-emerald')}
              title="Émeraude Royale"
              className={`px-2 py-1 rounded-lg font-semibold transition-all ${
                colorTheme === 'royal-emerald'
                  ? 'bg-amber-400 text-stone-950'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Émeraude
            </button>
          </div>
        </div>

        {/* Right: Quick Action Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Official Invitation Card & WhatsApp Generator */}
          <button
            onClick={onOpenInvitation}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white border border-emerald-400/60 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all cursor-pointer active:scale-95 animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Carte d'Invitation VIP</span>
            <span dir="rtl" className="font-arabic text-[11px] text-amber-200">بطاقة الدعوة</span>
          </button>

          {/* Activities detail */}
          <button
            onClick={onOpenActivities}
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Activités</span>
            <span dir="rtl" className="font-arabic text-[11px]">الفعاليات</span>
          </button>

          {/* Program Schedule */}
          <button
            onClick={onOpenProgram}
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Programme</span>
            <span dir="rtl" className="font-arabic text-[11px]">البرنامج</span>
          </button>

          {/* Volunteer Button */}
          <button
            onClick={onOpenVolunteer}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 text-white border border-emerald-500/50 text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
          >
            <HandHeart className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Rejoindre</span>
            <span dir="rtl" className="font-arabic text-[11px]">انضمام</span>
          </button>

          {/* Share / Download Primary Action */}
          <button
            onClick={onOpenShare}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger / Partager</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
