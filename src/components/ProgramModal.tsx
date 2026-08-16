import React, { useState } from 'react';
import { FESTIVAL_DAYS_SCHEDULE } from '../data/festivalData';
import { LanguageMode } from '../types';
import { X, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';

interface ProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  langMode: LanguageMode;
}

export const ProgramModal: React.FC<ProgramModalProps> = ({ isOpen, onClose, langMode }) => {
  const [activeDay, setActiveDay] = useState<number>(1);

  if (!isOpen) return null;

  const currentSchedule = FESTIVAL_DAYS_SCHEDULE.find((d) => d.dayNumber === activeDay) || FESTIVAL_DAYS_SCHEDULE[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 border-2 border-amber-400/50 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-b border-amber-400/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Programme Détaillé du 28 Août au 2 Septembre 2026
              </h2>
              <p dir="rtl" className="text-xs text-amber-300 font-arabic">
                البرنامج اليومي المفصل لأيام الأسبوع الثقافي والرياضي
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

        {/* Day Selector Tabs */}
        <div className="flex overflow-x-auto p-3 gap-2 bg-stone-950 border-b border-stone-800 scrollbar-none">
          {FESTIVAL_DAYS_SCHEDULE.map((day) => {
            const isSelected = day.dayNumber === activeDay;
            return (
              <button
                key={day.dayNumber}
                onClick={() => setActiveDay(day.dayNumber)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-md scale-102'
                    : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
                }`}
              >
                <div>Jour {day.dayNumber} : {day.dateFr.split(' ')[0]} {day.dateFr.split(' ')[1]}</div>
                <div dir="rtl" className="text-[10px] font-arabic opacity-90">{day.dateAr.split(' ')[0]} {day.dateAr.split(' ')[1]}</div>
              </button>
            );
          })}
        </div>

        {/* Day Content */}
        <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
          {/* Day Highlight Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/70 via-stone-900 to-amber-950/50 border border-amber-400/40 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Thème du jour • عنوان اليوم
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {currentSchedule.highlightFr}
              </h3>
              <p dir="rtl" className="text-sm font-arabic text-amber-200 mt-0.5">
                {currentSchedule.highlightAr}
              </p>
            </div>
            <Sparkles className="w-6 h-6 text-amber-400 shrink-0 hidden sm:block" />
          </div>

          {/* Events Timeline */}
          <div className="space-y-3">
            {currentSchedule.events.map((event, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 hover:border-amber-400/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="px-2.5 py-1 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-400 text-xs font-extrabold flex items-center gap-1 shrink-0 mt-0.5 sm:mt-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{event.time}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {event.titleFr}
                    </h4>
                    <p dir="rtl" className="text-xs font-arabic text-amber-300 mt-1">
                      {event.titleAr}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-stone-400 shrink-0 self-end sm:self-auto bg-stone-900/80 px-2.5 py-1 rounded-lg border border-stone-800">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{event.locationFr}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
