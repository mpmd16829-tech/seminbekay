import React from 'react';
import { FESTIVAL_INFO } from '../data/festivalData';
import { LanguageMode, DisplayMode } from '../types';
import { Users2, HandHeart, Sparkles } from 'lucide-react';

interface PosterInvitationBlockProps {
  langMode: LanguageMode;
  displayMode?: DisplayMode;
  onOpenVolunteer?: () => void;
  onOpenInvitation?: () => void;
}

export const PosterInvitationBlock: React.FC<PosterInvitationBlockProps> = ({
  langMode,
  displayMode = 'night',
  onOpenVolunteer,
  onOpenInvitation,
}) => {
  const isLight = displayMode === 'day';

  return (
    <section className="w-full max-w-4xl px-4 sm:px-6 my-2">
      <div
        className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 text-center shadow-md transition-colors ${
          isLight
            ? 'bg-emerald-50/90 border-emerald-300 text-stone-900 shadow-emerald-950/5'
            : 'bg-gradient-to-r from-emerald-950/90 via-stone-900/95 to-emerald-950/90 border-amber-400/50 text-stone-100 shadow-xl backdrop-blur-md'
        }`}
      >
        {/* Top Tag */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${
            isLight
              ? 'bg-amber-400 text-stone-950 border-amber-500'
              : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
          }`}
        >
          <Users2 className="w-3.5 h-3.5" />
          <span>Message d’Invitation & d'Appel • رسالة الدعوة والانضمام</span>
        </div>

        {/* French Message */}
        {langMode !== 'ar-focus' && (
          <p className={`text-xs sm:text-sm md:text-base font-semibold max-w-3xl mx-auto leading-relaxed ${
            isLight ? 'text-stone-800' : 'text-stone-100'
          }`}>
            « {FESTIVAL_INFO.invitationFr} »
          </p>
        )}

        {/* Arabic Message */}
        {langMode !== 'fr-focus' && (
          <p
            dir="rtl"
            className={`text-sm sm:text-base md:text-lg font-bold font-arabic max-w-3xl mx-auto mt-2 leading-relaxed ${
              isLight ? 'text-emerald-900' : 'text-amber-300'
            }`}
          >
            « {FESTIVAL_INFO.invitationAr} »
          </p>
        )}

        {/* Interactive Action Badges */}
        <div className={`mt-3.5 pt-3 border-t flex flex-wrap items-center justify-center gap-2 ${
          isLight ? 'border-emerald-200' : 'border-amber-400/20'
        }`}>
          {onOpenInvitation && (
            <button
              onClick={onOpenInvitation}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95 animate-bounce-short"
            >
              <Sparkles className="w-4 h-4 text-emerald-950" />
              <span>Générer ma Carte d'Invitation • بطاقة الدعوة</span>
            </button>
          )}

          {onOpenVolunteer && (
            <>
              <button
                onClick={onOpenVolunteer}
                className={`px-4 py-1.5 rounded-xl border font-semibold text-xs sm:text-sm flex items-center gap-2 shadow transition-all cursor-pointer ${
                  isLight
                    ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300'
                    : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border-emerald-500/40'
                }`}
              >
                <HandHeart className="w-4 h-4 text-amber-300" />
                <span>Rejoindre un comité / الانضمام للجان</span>
              </button>

              <button
                onClick={onOpenVolunteer}
                className={`px-4 py-1.5 rounded-xl border font-semibold text-xs sm:text-sm flex items-center gap-2 shadow transition-all cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-stone-800/80 hover:bg-stone-700/80 text-stone-200 border-stone-700'
                }`}
              >
                <span>Proposer une idée / اقتراح فكرة</span>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

