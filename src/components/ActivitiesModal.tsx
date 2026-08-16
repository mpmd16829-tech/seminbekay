import React, { useState } from 'react';
import { FESTIVAL_ACTIVITIES } from '../data/festivalData';
import { FestivalActivity, LanguageMode } from '../types';
import { 
  X, 
  Sparkles, 
  Megaphone, 
  Target, 
  Trophy, 
  Dices, 
  GraduationCap, 
  Leaf, 
  HeartHandshake,
  Calendar,
  Users,
  CheckCircle2
} from 'lucide-react';

interface ActivitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedActivity: FestivalActivity | null;
  langMode: LanguageMode;
  onSelectActivity: (activity: FestivalActivity) => void;
  onJoinCommittee: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-6 h-6 text-amber-400" />,
  Megaphone: <Megaphone className="w-6 h-6 text-emerald-400" />,
  Target: <Target className="w-6 h-6 text-red-400" />,
  Trophy: <Trophy className="w-6 h-6 text-amber-400" />,
  Dices: <Dices className="w-6 h-6 text-rose-400" />,
  GraduationCap: <GraduationCap className="w-6 h-6 text-blue-400" />,
  Leaf: <Leaf className="w-6 h-6 text-emerald-400" />,
  HeartHandshake: <HeartHandshake className="w-6 h-6 text-amber-400" />,
};

export const ActivitiesModal: React.FC<ActivitiesModalProps> = ({
  isOpen,
  onClose,
  selectedActivity,
  langMode,
  onSelectActivity,
  onJoinCommittee,
}) => {
  if (!isOpen) return null;

  const current = selectedActivity || FESTIVAL_ACTIVITIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 border-2 border-amber-400/50 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-b border-amber-400/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Activités de la Semaine Culturelle et Sportive
              </h2>
              <p dir="rtl" className="text-xs text-amber-300 font-arabic">
                دليل فعاليات وأنشطة الأسبوع الثقافي والرياضي 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two columns (List on Left, Details on Right) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 min-h-[480px]">
          {/* Left: Activities List */}
          <div className="md:col-span-1 border-r border-stone-800 bg-stone-950/60 p-3 space-y-1.5 overflow-y-auto max-h-[500px]">
            {FESTIVAL_ACTIVITIES.map((act) => {
              const isSelected = act.id === current.id;
              return (
                <button
                  key={act.id}
                  onClick={() => onSelectActivity(act)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-amber-400/15 border-amber-400/60 text-white shadow-md'
                      : 'border-stone-800/80 bg-stone-900/50 text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-stone-950 shrink-0">
                    {iconMap[act.iconName]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate">{act.titleFr}</p>
                    <p dir="rtl" className="text-[11px] font-arabic text-amber-300/90 truncate">
                      {act.titleAr}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Selected Activity Detail */}
          <div className="md:col-span-2 p-6 flex flex-col justify-between bg-gradient-to-b from-stone-900 via-stone-900 to-emerald-950/30">
            <div className="space-y-4">
              {/* Category & Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {current.categoryFr} • {current.categoryAr}
                </span>
                <span className="text-xs text-stone-400 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {current.scheduleDay}
                </span>
              </div>

              {/* Bilingual Headings */}
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {current.titleFr}
                </h3>
                <h4 dir="rtl" className="text-lg sm:text-xl font-bold font-arabic text-amber-300 mt-1">
                  {current.titleAr}
                </h4>
              </div>

              {/* Detailed Descriptions */}
              <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
                <p className="text-sm text-stone-200 leading-relaxed">
                  {current.descFr}
                </p>
                <div className="h-px bg-stone-800" />
                <p dir="rtl" className="text-sm font-arabic text-amber-200/90 leading-relaxed">
                  {current.descAr}
                </p>
              </div>

              {/* Target Audience / Public cible */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
                <Users className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-200">
                    Public cible & Participants :
                  </p>
                  <p className="text-stone-300">{current.targetGroupFr}</p>
                  <p dir="rtl" className="text-emerald-300 font-arabic mt-0.5">
                    {current.targetGroupAr}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions inside Modal */}
            <div className="mt-6 pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-stone-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Participation gratuite et ouverte à tous
              </span>
              
              <button
                onClick={() => {
                  onClose();
                  onJoinCommittee();
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                <span>Rejoindre le comité dédié</span>
                <span dir="rtl" className="font-arabic">الانضمام للجنة</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
