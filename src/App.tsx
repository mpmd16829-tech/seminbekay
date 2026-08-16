import React, { useState, useRef } from 'react';
import { Poster } from './components/Poster';
import { PosterToolbar } from './components/PosterToolbar';
import { ActivitiesModal } from './components/ActivitiesModal';
import { ProgramModal } from './components/ProgramModal';
import { VolunteerModal } from './components/VolunteerModal';
import { ShareModal } from './components/ShareModal';
import { InvitationModal } from './components/InvitationModal';
import { PosterFormat, LanguageMode, ColorTheme, FestivalActivity, DisplayMode } from './types';
import { FESTIVAL_ACTIVITIES } from './data/festivalData';
import { Sparkles, Calendar, HandHeart, Layers, Share2, Info, Mail } from 'lucide-react';

export default function App() {
  const [format, setFormat] = useState<PosterFormat>('portrait');
  const [langMode, setLangMode] = useState<LanguageMode>('bilingual');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('mauritania-classic');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('night');
  const [confettiEnabled, setConfettiEnabled] = useState(true);

  // Modals state
  const [isActivitiesOpen, setIsActivitiesOpen] = useState(false);
  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<FestivalActivity | null>(null);

  const posterRef = useRef<HTMLDivElement>(null);

  const handleSelectActivity = (activity: FestivalActivity) => {
    setSelectedActivity(activity);
    setIsActivitiesOpen(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col selection:bg-amber-400 selection:text-stone-950 ${
      displayMode === 'day' ? 'bg-stone-100 text-stone-900' : 'bg-stone-950 text-stone-100'
    }`}>
      {/* Top Interactive Controls Toolbar */}
      <PosterToolbar
        format={format}
        setFormat={setFormat}
        langMode={langMode}
        setLangMode={setLangMode}
        colorTheme={colorTheme}
        setColorTheme={setColorTheme}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        confettiEnabled={confettiEnabled}
        setConfettiEnabled={setConfettiEnabled}
        onOpenActivities={() => {
          setSelectedActivity(FESTIVAL_ACTIVITIES[0]);
          setIsActivitiesOpen(true);
        }}
        onOpenProgram={() => setIsProgramOpen(true)}
        onOpenVolunteer={() => setIsVolunteerOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenInvitation={() => setIsInvitationOpen(true)}
      />

      {/* Main Canvas Area */}
      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-6 overflow-x-hidden">
        {/* Quick Context Banner */}
        <div className="w-full max-w-4xl mb-4 px-2 no-print">
          <div className={`rounded-xl border p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs transition-colors ${
            displayMode === 'day'
              ? 'bg-amber-50/90 border-amber-200 text-stone-900 shadow-sm'
              : 'bg-emerald-950/40 border-emerald-500/30 text-stone-100'
          }`}>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-emerald-500/20 text-emerald-300">🇲🇷</span>
              <span className={`font-semibold ${displayMode === 'day' ? 'text-emerald-950' : 'text-emerald-200'}`}>
                Semaine Culturelle & Sportive 2026 — 3e Édition | Hassi El Bekay (Kiffa, Assaba)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsInvitationOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-amber-400 text-stone-950 font-extrabold hover:bg-amber-300 transition-colors flex items-center gap-1 cursor-pointer text-[11px]"
              >
                <Sparkles className="w-3 h-3 text-emerald-950" />
                <span>Cartes VIP / الدعوات</span>
              </button>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-300 font-bold">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>28 Août – 2 Sept 2026</span>
              </span>
              <span className="hidden md:inline text-stone-400">•</span>
              <span dir="rtl" className="font-arabic text-amber-700 dark:text-amber-200 hidden md:inline font-bold">
                من 28 أغسطس إلى 2 سبتمبر 2026
              </span>
            </div>
          </div>
        </div>

        {/* The Digital Poster Art Canvas */}
        <Poster
          ref={posterRef}
          format={format}
          langMode={langMode}
          colorTheme={colorTheme}
          displayMode={displayMode}
          confettiEnabled={confettiEnabled}
          onSelectActivity={handleSelectActivity}
          onOpenVolunteer={() => setIsVolunteerOpen(true)}
          onOpenInvitation={() => setIsInvitationOpen(true)}
        />

        {/* Bottom Floating Quick Actions on Mobile */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-1.5 rounded-2xl bg-stone-900/90 border border-amber-400/40 shadow-2xl backdrop-blur-md sm:hidden no-print">
          <button
            onClick={() => setIsInvitationOpen(true)}
            className="p-2.5 rounded-xl bg-emerald-700 text-amber-300 hover:bg-emerald-600"
            title="Carte d'Invitation"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedActivity(FESTIVAL_ACTIVITIES[0]);
              setIsActivitiesOpen(true);
            }}
            className="p-2.5 rounded-xl bg-stone-800 text-amber-300 hover:bg-stone-700"
            title="Activités"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsProgramOpen(true)}
            className="p-2.5 rounded-xl bg-stone-800 text-emerald-400 hover:bg-stone-700"
            title="Programme"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsVolunteerOpen(true)}
            className="p-2.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-600"
            title="Rejoindre"
          >
            <HandHeart className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsShareOpen(true)}
            className="px-3 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1 shadow"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Partager</span>
          </button>
        </div>
      </main>

      {/* Interactive Modals */}
      <InvitationModal
        isOpen={isInvitationOpen}
        onClose={() => setIsInvitationOpen(false)}
      />

      <ActivitiesModal
        isOpen={isActivitiesOpen}
        onClose={() => setIsActivitiesOpen(false)}
        selectedActivity={selectedActivity}
        langMode={langMode}
        onSelectActivity={setSelectedActivity}
        onJoinCommittee={() => setIsVolunteerOpen(true)}
      />

      <ProgramModal
        isOpen={isProgramOpen}
        onClose={() => setIsProgramOpen(false)}
        langMode={langMode}
      />

      <VolunteerModal
        isOpen={isVolunteerOpen}
        onClose={() => setIsVolunteerOpen(false)}
        langMode={langMode}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        posterElementId="festival-poster-canvas"
      />
    </div>
  );
}
