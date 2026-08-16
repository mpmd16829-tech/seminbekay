import React from 'react';
import { InvitationCardData, LanguageMode, DisplayMode } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { PosterBorder } from './PosterBorder';
import { PosterHeader } from './PosterHeader';
import { CountdownWidget } from './CountdownWidget';
import { WeatherWidget } from './WeatherWidget';
import { PosterThemeBlock } from './PosterThemeBlock';
import { PosterHeroBanner } from './PosterHeroBanner';
import { PosterActivitiesGrid } from './PosterActivitiesGrid';
import { PosterFooter } from './PosterFooter';
import { FESTIVAL_INFO } from '../data/festivalData';
import { Sparkles, QrCode, ShieldCheck, MapPin, Calendar, CheckCircle2, UserCheck, Star } from 'lucide-react';

interface PersonalizedFestivalPosterProps {
  data: InvitationCardData;
  elementId?: string;
  langMode?: LanguageMode;
  displayMode?: DisplayMode;
}

export const PersonalizedFestivalPoster: React.FC<PersonalizedFestivalPosterProps> = ({
  data,
  elementId = 'festival-personalized-poster-canvas',
  langMode = 'bilingual',
  displayMode = 'night',
}) => {
  const isLight = displayMode === 'day';

  const categoryLabels = {
    vip: { fr: 'VIP • Invité d’Honneur Officiel', ar: 'ضيف شرف متميز (VIP)' },
    guest: { fr: 'Invité(e) Spécial(e)', ar: 'دعوة خاصة' },
    resident: { fr: 'Habitant / Résident', ar: 'أحد سكان القرى' },
    volunteer: { fr: 'Membre & Bénévole', ar: 'عضو / متطوع' },
    youth: { fr: 'Jeunesse & Sportif', ar: 'شاب / رياضي' },
    partner: { fr: 'Partenaire & Notable', ar: 'شريك وفاعل محلي' },
  };

  const currentCat = categoryLabels[data.category] || categoryLabels.guest;
  const arabicRecipientName = data.recipientNameAr?.trim() || data.recipientName?.trim();
  const frenchRecipientName = data.recipientNameFr?.trim() || data.recipientName?.trim();
  const arHonorific = data.recipientHonorificAr || 'السيد(ة) الفاضل(ة)';
  const frHonorific = data.recipientHonorificFr || 'M./Mme';

  const qrPayload = JSON.stringify({
    app: 'HassiBekay2026',
    code: data.invitationCode,
    nameAr: arabicRecipientName,
    nameFr: frenchRecipientName,
    cat: data.category,
    zone: data.seatZone,
  });

  return (
    <div className="flex justify-center w-full p-2 sm:p-4 overflow-hidden">
      <div
        id={elementId}
        className={`relative w-full max-w-[840px] min-h-[1200px] ${
          isLight
            ? 'bg-gradient-to-b from-[#fbf8ee] via-[#f4f7f2] to-[#fcf5e8] text-stone-900 border-amber-500/80'
            : 'bg-gradient-to-b from-[#00381d] via-[#051c11] to-[#120606] text-stone-100 border-[#FFD100]/60'
        } rounded-3xl shadow-2xl border-4 overflow-hidden flex flex-col items-center justify-between transition-all duration-300 print-container bg-mauritania-pattern`}
      >
        {/* Top Decorative National Border */}
        <PosterBorder variant="top" />

        {/* Main Content Flow */}
        <main className="w-full flex-1 flex flex-col items-center py-2 relative z-10">
          
          {/* Official Festival Header */}
          <PosterHeader langMode={langMode} displayMode={displayMode} />

          {/* DEDICATED PERSONALIZED INVITATION BANNER IN THE POSTER */}
          <section className="w-full max-w-4xl px-3 sm:px-6 my-2">
            <div
              className={`relative overflow-hidden rounded-2xl border-2 p-4 sm:p-6 shadow-2xl transition-all ${
                isLight
                  ? 'bg-gradient-to-r from-amber-100 via-amber-50 to-emerald-100 border-amber-500 text-stone-900'
                  : 'bg-gradient-to-r from-[#033119] via-[#091b12] to-[#241203] border-amber-400 text-stone-100 shadow-amber-950/60'
              }`}
              style={{
                boxShadow: '0 10px 30px -5px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,209,0,0.4)',
              }}
            >
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-amber-400 opacity-60">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <div className="absolute top-2 right-2 text-amber-400 opacity-60">
                <Star className="w-4 h-4 fill-current" />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Left/Center: Guest Invitation Text */}
                <div className="flex-1 text-center sm:text-right space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-black uppercase tracking-wider shadow">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>دعوة شرف رسمية • Invitation d'Honneur Officielle</span>
                  </div>

                  {/* Arabic Recipient Callout */}
                  <div dir="rtl" className="space-y-1">
                    <p className="text-xs sm:text-sm font-arabic text-amber-300/90 font-bold">
                      تتشرف اللجنة المنظمة بدعوة :
                    </p>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-arabic-display text-white drop-shadow">
                      {arHonorific} {arabicRecipientName || 'الضيف الكريم'}
                    </h3>
                  </div>

                  {/* French Recipient Callout */}
                  {frenchRecipientName && (
                    <div className="pt-1 border-t border-amber-400/30">
                      <p className="text-xs sm:text-sm font-bold text-amber-200">
                        {frHonorific} <span className="text-white text-base sm:text-lg">{frenchRecipientName}</span>
                      </p>
                    </div>
                  )}

                  {/* Category & Place Info */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 pt-1">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-700/80 border border-emerald-400/50 text-white text-xs font-bold">
                      {currentCat.ar} • {currentCat.fr}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-stone-950/70 border border-amber-400/40 text-amber-300 font-mono text-xs font-black">
                      CODE : {data.invitationCode}
                    </span>
                    {data.seatZone && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-200 text-xs font-medium">
                        📍 {data.seatZone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Security QR Code Pass */}
                <div className="shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white text-stone-950 shadow-xl border-2 border-[#c99837]">
                  <QRCodeSVG
                    value={qrPayload}
                    size={88}
                    level="H"
                    includeMargin={false}
                    fgColor="#00381d"
                  />
                  <div className="text-center leading-none">
                    <span className="font-mono text-[10px] font-black text-emerald-950 tracking-wider">
                      {data.invitationCode}
                    </span>
                    <span className="block text-[8px] text-stone-500 font-bold uppercase mt-0.5">
                      PASS OFFICIEL VIP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Countdown Widget to 28 August 2026 */}
          <CountdownWidget langMode={langMode} displayMode={displayMode} />

          {/* Weather for Kiffa */}
          <WeatherWidget langMode={langMode} displayMode={displayMode} />

          {/* Official Theme Block */}
          <PosterThemeBlock langMode={langMode} displayMode={displayMode} />

          {/* Hero Banner Artwork */}
          <PosterHeroBanner langMode={langMode} />

          {/* 8 Official Activities Grid */}
          <PosterActivitiesGrid langMode={langMode} displayMode={displayMode} />

          {/* Call to Action Slogan */}
          <div className="w-full max-w-4xl px-4 text-center my-3">
            <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-amber-400/40 shadow-lg">
              <p dir="rtl" className="font-arabic font-bold text-amber-300 text-sm sm:text-base">
                « أسبوع أحسي البكاي 2026: تظاهرة تنموية وثقافية ورياضية كبرى تجمع كل أبناء الوطن وأصدقاء الثقافة »
              </p>
              <p className="text-xs text-stone-300 font-medium mt-1">
                Lieu : Qura Tajamou Hassi El Bekay • Kiffa • Assaba • Mauritanie
              </p>
            </div>
          </div>
        </main>

        {/* Official Footer */}
        <PosterFooter langMode={langMode} displayMode={displayMode} />
      </div>
    </div>
  );
};
