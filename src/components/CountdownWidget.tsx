import React, { useState, useEffect } from 'react';
import { LanguageMode, DisplayMode } from '../types';
import { Clock, Timer, Sparkles } from 'lucide-react';

interface CountdownWidgetProps {
  langMode: LanguageMode;
  displayMode: DisplayMode;
}

export const CountdownWidget: React.FC<CountdownWidgetProps> = ({ langMode, displayMode }) => {
  // Festival start date: 28 August 2026 at 16:00 (Kiffa time / GMT)
  const festivalTargetDate = new Date('2026-08-28T16:00:00Z').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = festivalTargetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPassed: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [festivalTargetDate]);

  const isLight = displayMode === 'day';

  return (
    <div className="w-full max-w-2xl px-4 my-1.5 flex justify-center">
      <div
        className={`w-full py-1.5 px-3 sm:px-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-2 shadow-sm transition-colors ${
          isLight
            ? 'bg-amber-50/90 border-amber-300 text-stone-900 shadow-amber-900/5'
            : 'bg-stone-950/70 border-amber-400/40 text-stone-100 backdrop-blur-md'
        }`}
      >
        {/* Label */}
        <div className="flex items-center gap-2 text-xs font-bold text-amber-500">
          <Timer className="w-3.5 h-3.5 animate-pulse text-amber-500" />
          <div className="flex items-center gap-1.5 leading-none">
            {langMode !== 'ar-focus' && (
              <span className={isLight ? 'text-stone-800' : 'text-stone-200'}>
                Compte à rebours :
              </span>
            )}
            {langMode !== 'fr-focus' && (
              <span dir="rtl" className={`font-arabic ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
                العد التنازلي لانطلاق الأسبوع :
              </span>
            )}
          </div>
        </div>

        {/* Units display */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Days */}
          <div className={`px-2 py-0.5 rounded-lg border text-center ${
            isLight ? 'bg-white border-amber-200 shadow-xs' : 'bg-stone-900 border-stone-800'
          }`}>
            <span className={`text-xs sm:text-sm font-extrabold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
              {timeLeft.days}
            </span>
            <span className="text-[9px] text-stone-500 block uppercase leading-tight">
              {langMode === 'ar-focus' ? 'يوم' : 'Jours'}
            </span>
          </div>

          <span className="text-xs font-bold text-amber-500">:</span>

          {/* Hours */}
          <div className={`px-2 py-0.5 rounded-lg border text-center ${
            isLight ? 'bg-white border-amber-200 shadow-xs' : 'bg-stone-900 border-stone-800'
          }`}>
            <span className={`text-xs sm:text-sm font-extrabold ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] text-stone-500 block uppercase leading-tight">
              {langMode === 'ar-focus' ? 'ساعة' : 'H'}
            </span>
          </div>

          <span className="text-xs font-bold text-amber-500">:</span>

          {/* Minutes */}
          <div className={`px-2 py-0.5 rounded-lg border text-center ${
            isLight ? 'bg-white border-amber-200 shadow-xs' : 'bg-stone-900 border-stone-800'
          }`}>
            <span className={`text-xs sm:text-sm font-extrabold ${isLight ? 'text-red-700' : 'text-red-400'}`}>
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] text-stone-500 block uppercase leading-tight">
              {langMode === 'ar-focus' ? 'دقيقة' : 'Min'}
            </span>
          </div>

          <span className="text-xs font-bold text-amber-500">:</span>

          {/* Seconds */}
          <div className={`px-2 py-0.5 rounded-lg border text-center ${
            isLight ? 'bg-white border-amber-200 shadow-xs' : 'bg-stone-900 border-stone-800'
          }`}>
            <span className="text-xs sm:text-sm font-extrabold text-amber-500">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] text-stone-500 block uppercase leading-tight">
              {langMode === 'ar-focus' ? 'ثانية' : 'Sec'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
