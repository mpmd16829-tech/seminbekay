import React from 'react';
import { FESTIVAL_ACTIVITIES } from '../data/festivalData';
import { LanguageMode, FestivalActivity, DisplayMode } from '../types';
import { 
  Sparkles, 
  Megaphone, 
  Target, 
  Trophy, 
  Dices, 
  GraduationCap, 
  Leaf, 
  HeartHandshake,
  ArrowRight
} from 'lucide-react';

interface PosterActivitiesGridProps {
  langMode: LanguageMode;
  displayMode?: DisplayMode;
  onSelectActivity?: (activity: FestivalActivity) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5" />,
  Megaphone: <Megaphone className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  Trophy: <Trophy className="w-5 h-5" />,
  Dices: <Dices className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  Leaf: <Leaf className="w-5 h-5" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5" />,
};

const darkVariants = [
  { bg: 'from-emerald-950/80 to-stone-900/90', border: 'border-emerald-500/40', text: 'text-emerald-300', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { bg: 'from-amber-950/80 to-stone-900/90', border: 'border-amber-500/40', text: 'text-amber-300', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { bg: 'from-red-950/80 to-stone-900/90', border: 'border-red-500/40', text: 'text-red-300', badge: 'bg-red-500/20 text-red-300 border-red-500/40' },
  { bg: 'from-emerald-950/80 to-stone-900/90', border: 'border-emerald-500/40', text: 'text-emerald-300', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { bg: 'from-rose-950/80 to-stone-900/90', border: 'border-rose-500/40', text: 'text-rose-300', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  { bg: 'from-blue-950/80 to-stone-900/90', border: 'border-blue-500/40', text: 'text-blue-300', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  { bg: 'from-teal-950/80 to-stone-900/90', border: 'border-teal-500/40', text: 'text-teal-300', badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
  { bg: 'from-amber-950/80 to-stone-900/90', border: 'border-amber-500/40', text: 'text-amber-300', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
];

const lightVariants = [
  { bg: 'from-emerald-50 to-amber-50/50', border: 'border-emerald-200 hover:border-emerald-400', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { bg: 'from-amber-50 to-orange-50/50', border: 'border-amber-200 hover:border-amber-400', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800 border-amber-300' },
  { bg: 'from-red-50 to-rose-50/50', border: 'border-red-200 hover:border-red-400', text: 'text-red-700', badge: 'bg-red-100 text-red-800 border-red-300' },
  { bg: 'from-emerald-50 to-teal-50/50', border: 'border-emerald-200 hover:border-emerald-400', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { bg: 'from-rose-50 to-pink-50/50', border: 'border-rose-200 hover:border-rose-400', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-800 border-rose-300' },
  { bg: 'from-blue-50 to-sky-50/50', border: 'border-blue-200 hover:border-blue-400', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800 border-blue-300' },
  { bg: 'from-teal-50 to-emerald-50/50', border: 'border-teal-200 hover:border-teal-400', text: 'text-teal-700', badge: 'bg-teal-100 text-teal-800 border-teal-300' },
  { bg: 'from-amber-50 to-yellow-50/50', border: 'border-amber-200 hover:border-amber-400', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800 border-amber-300' },
];

export const PosterActivitiesGrid: React.FC<PosterActivitiesGridProps> = ({
  langMode,
  displayMode = 'night',
  onSelectActivity
}) => {
  const isLight = displayMode === 'day';
  const colorVariants = isLight ? lightVariants : darkVariants;

  return (
    <section className="w-full max-w-4xl px-4 sm:px-6 my-2">
      {/* Section Subheading */}
      <div className="text-center mb-3">
        <h3 className={`text-xs sm:text-sm font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 ${
          isLight ? 'text-amber-800' : 'text-amber-400'
        }`}>
          <span>❖</span>
          <span>Programme & Activités Majeures • أبرز فعاليات الأسبوع</span>
          <span>❖</span>
        </h3>
      </div>

      {/* 8-Activity Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {FESTIVAL_ACTIVITIES.map((activity, idx) => {
          const style = colorVariants[idx % colorVariants.length];
          const icon = iconMap[activity.iconName] || <Sparkles className="w-5 h-5" />;

          return (
            <div
              key={activity.id}
              onClick={() => onSelectActivity?.(activity)}
              className={`relative rounded-xl p-3 bg-gradient-to-b ${style.bg} border ${style.border} shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-0.5`}
            >
              {/* Card Header: Icon & Category Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className={`p-2 rounded-lg ${isLight ? 'bg-white shadow-xs' : 'bg-stone-950/70'} border ${style.border} ${style.text} group-hover:scale-110 transition-transform`}>
                  {icon}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>
                  {langMode === 'ar-focus' ? activity.badgeAr : activity.badgeFr}
                </span>
              </div>

              {/* French Title */}
              {langMode !== 'ar-focus' && (
                <h4 className={`text-xs sm:text-sm font-bold leading-snug transition-colors ${
                  isLight ? 'text-stone-900 group-hover:text-emerald-800' : 'text-white group-hover:text-amber-200'
                }`}>
                  {activity.titleFr}
                </h4>
              )}

              {/* Arabic Title */}
              {langMode !== 'fr-focus' && (
                <h5
                  dir="rtl"
                  className={`text-xs sm:text-sm font-bold font-arabic leading-snug mt-1 transition-colors ${
                    isLight ? 'text-amber-900 group-hover:text-emerald-900' : 'text-amber-300 group-hover:text-amber-200'
                  }`}
                >
                  {activity.titleAr}
                </h5>
              )}

              {/* Quick Details */}
              <p className={`text-[11px] mt-1.5 line-clamp-2 leading-relaxed opacity-90 ${
                isLight ? 'text-stone-600' : 'text-stone-300'
              }`}>
                {langMode === 'ar-focus' ? activity.descAr : activity.descFr}
              </p>

              {/* Bottom interactive clue */}
              <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] transition-colors ${
                isLight ? 'border-stone-200 text-stone-500 group-hover:text-amber-800' : 'border-stone-800 text-stone-400 group-hover:text-amber-300'
              }`}>
                <span>{langMode === 'ar-focus' ? activity.scheduleDayAr : activity.scheduleDay}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

