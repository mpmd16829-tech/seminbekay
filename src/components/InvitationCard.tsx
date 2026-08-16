import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { INVITATION_CARD_OFFICIAL_DATA } from '../data/festivalData';
import { InvitationCardData } from '../types';
import { Calendar, MapPin, Sparkles, ShieldCheck, UserCheck } from 'lucide-react';

export type InvitationCardLanguage = 'ar' | 'bilingual' | 'fr';

interface InvitationCardProps {
  data: InvitationCardData;
  cardElementId?: string;
  showQr?: boolean;
  cardLanguage?: InvitationCardLanguage;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  data,
  cardElementId = 'festival-invitation-card-canvas',
  showQr = true,
  cardLanguage = 'bilingual',
}) => {
  const { ar, fr } = INVITATION_CARD_OFFICIAL_DATA;

  const categoryLabels = {
    vip: { fr: 'VIP • Invité d’Honneur', ar: 'ضيف شرف متميز (VIP)' },
    guest: { fr: 'Invité(e) Spécial(e)', ar: 'ضيف خاص' },
    resident: { fr: 'Habitant / Résident', ar: 'أحد سكان القرى' },
    volunteer: { fr: 'Membre & Bénévole', ar: 'عضو / متطوع' },
    youth: { fr: 'Jeunesse & Sportif', ar: 'شاب / رياضي' },
    partner: { fr: 'Partenaire & Notable', ar: 'شريك وفاعل محلي' },
  };

  const currentCat = categoryLabels[data.category] || categoryLabels.guest;

  const arabicRecipientName = data.recipientNameAr?.trim() || data.recipientName?.trim();
  const frenchRecipientName = data.recipientNameFr?.trim() || data.recipientName?.trim();

  return (
    <div className="w-full flex justify-center p-1 sm:p-3 overflow-hidden">
      {/* Exact Card Canvas Matching the Model */}
      <div
        id={cardElementId}
        className="relative w-full max-w-[920px] bg-[#fcfaf4] text-stone-900 border-[6px] border-[#c99837] rounded-3xl shadow-2xl p-4 sm:p-7 overflow-hidden font-sans select-none"
        style={{
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.4), inset 0 0 0 2px #005a2b',
        }}
      >
        {/* Ornate Moorish Arabesque Corner Overlays */}
        {/* Top-Left Corner */}
        <div className="absolute top-0 left-0 w-24 sm:w-36 h-24 sm:h-36 pointer-events-none opacity-90 overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#005a2b] fill-current">
            <path d="M0,0 L100,0 C60,20 20,60 0,100 Z" opacity="0.18" />
            <path d="M0,0 L70,0 C45,15 15,45 0,70 Z" fill="#005a2b" opacity="0.85" />
            <path d="M0,0 L40,0 C25,10 10,25 0,40 Z" fill="#c99837" />
            <circle cx="20" cy="20" r="4" fill="#fcfaf4" />
            <path d="M30,10 Q20,20 10,30" stroke="#fcfaf4" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        {/* Top-Right Corner */}
        <div className="absolute top-0 right-0 w-24 sm:w-36 h-24 sm:h-36 pointer-events-none opacity-90 overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#005a2b] fill-current">
            <path d="M100,0 L0,0 C40,20 80,60 100,100 Z" opacity="0.18" />
            <path d="M100,0 L30,0 C55,15 85,45 100,70 Z" fill="#005a2b" opacity="0.85" />
            <path d="M100,0 L60,0 C75,10 90,25 100,40 Z" fill="#c99837" />
            <circle cx="80" cy="20" r="4" fill="#fcfaf4" />
            <path d="M70,10 Q80,20 90,30" stroke="#fcfaf4" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        {/* Bottom-Left Corner */}
        <div className="absolute bottom-0 left-0 w-24 sm:w-36 h-24 sm:h-36 pointer-events-none opacity-90 overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#005a2b] fill-current">
            <path d="M0,100 L100,100 C60,80 20,40 0,0 Z" opacity="0.18" />
            <path d="M0,100 L70,100 C45,85 15,55 0,30 Z" fill="#005a2b" opacity="0.85" />
            <path d="M0,100 L40,100 C25,90 10,75 0,60 Z" fill="#c99837" />
            <circle cx="20" cy="80" r="4" fill="#fcfaf4" />
            <path d="M30,90 Q20,80 10,70" stroke="#fcfaf4" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        {/* Bottom-Right Corner */}
        <div className="absolute bottom-0 right-0 w-24 sm:w-36 h-24 sm:h-36 pointer-events-none opacity-90 overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#005a2b] fill-current">
            <path d="M100,100 L0,100 C40,80 80,40 100,0 Z" opacity="0.18" />
            <path d="M100,100 L30,100 C55,85 85,55 100,30 Z" fill="#005a2b" opacity="0.85" />
            <path d="M100,100 L60,100 C75,90 90,75 100,60 Z" fill="#c99837" />
            <circle cx="80" cy="80" r="4" fill="#fcfaf4" />
            <path d="M70,90 Q80,80 90,70" stroke="#fcfaf4" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        {/* Inner Golden Thin Border */}
        <div className="relative z-10 border border-[#c99837]/60 rounded-2xl p-3 sm:p-5 flex flex-col items-center">
          
          {/* Top Verification & Security Bar */}
          <div className="w-full flex items-center justify-between gap-2 px-2 pb-2 border-b border-[#c99837]/30 text-[10px] sm:text-xs">
            <div className="flex items-center gap-1.5 text-[#005a2b] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c99837]" />
              <span className={cardLanguage === 'ar' ? 'font-arabic text-xs font-extrabold' : ''}>
                {cardLanguage === 'ar' 
                  ? 'بطاقة دعوة رسمية وتصريح الدخول الشرفي'
                  : 'CARTE D\'INVITATION & PASS D\'ENTRÉE'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#c99837] font-mono font-bold bg-[#005a2b] px-2.5 py-0.5 rounded-full text-white">
              <span>{cardLanguage === 'ar' ? 'رقم الدعوة :' : 'N°'} {data.invitationCode}</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* ARABIC VERSION / SECTION                                  */}
          {/* ========================================================= */}
          {(cardLanguage === 'ar' || cardLanguage === 'bilingual') && (
            <section className={`w-full text-center ${cardLanguage === 'ar' ? 'py-3 sm:py-5' : 'mt-1 pb-2'} flex flex-col items-center`}>
              
              {/* Dedicated Bismillah for Pure Arabic Card */}
              {cardLanguage === 'ar' && (
                <div dir="rtl" className="font-arabic font-bold text-sm sm:text-base text-[#005a2b] mb-2 tracking-wide">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
              )}

              {/* Ornate Green & Gold Cartouche Header "دعوة" */}
              <div className="relative inline-flex items-center justify-center my-1">
                <div
                  className={`px-10 sm:px-16 ${cardLanguage === 'ar' ? 'py-2 sm:py-3' : 'py-1'} rounded-3xl bg-[#004f24] text-white border-2 sm:border-3 border-[#e6b94d] shadow-md flex items-center justify-center`}
                  style={{
                    clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)',
                  }}
                >
                  <h2 className={`${cardLanguage === 'ar' ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-2xl'} font-black font-arabic text-white tracking-wide py-0.5 px-3`}>
                    {ar.badge}
                  </h2>
                </div>
              </div>

              {/* Personalized Guest Badge (Arabic) */}
              {arabicRecipientName && (
                <div
                  dir="rtl"
                  className={`w-full max-w-2xl mx-auto ${
                    cardLanguage === 'ar' ? 'my-3 px-4 py-2.5' : 'my-1.5 px-3 py-1.5'
                  } rounded-xl bg-amber-50/95 border border-[#c99837] text-stone-900 shadow-xs flex items-center justify-between gap-2.5 text-right`}
                >
                  <div className="flex items-center gap-2 min-w-0 overflow-hidden text-right flex-1">
                    <UserCheck className={`${cardLanguage === 'ar' ? 'w-5 h-5' : 'w-4 h-4'} text-[#005a2b] shrink-0`} />
                    <span className={`font-arabic font-bold ${cardLanguage === 'ar' ? 'text-xs sm:text-sm' : 'text-[11px] sm:text-xs'} text-[#005a2b] whitespace-nowrap shrink-0`}>
                      {data.recipientHonorificAr || 'السيد(ة) الفاضل(ة)'} :
                    </span>
                    <span className={`font-arabic font-extrabold ${cardLanguage === 'ar' ? 'text-sm sm:text-lg' : 'text-xs sm:text-sm'} text-stone-950 truncate block min-w-0`} title={arabicRecipientName}>
                      <bdi>{arabicRecipientName}</bdi>
                    </span>
                  </div>
                  <span className={`${cardLanguage === 'ar' ? 'text-xs sm:text-sm px-3 py-1' : 'text-[10px] sm:text-xs px-2.5 py-0.5'} font-arabic font-bold rounded-full bg-[#005a2b] text-amber-200 shadow-xs shrink-0 whitespace-nowrap`}>
                    {currentCat.ar}
                  </span>
                </div>
              )}

              {/* Arabic Organization Name */}
              <h3
                dir="rtl"
                className={`w-full ${
                  cardLanguage === 'ar'
                    ? 'text-base sm:text-2xl md:text-3xl font-black mt-2 mb-1.5'
                    : 'text-xs sm:text-base md:text-lg font-extrabold mt-1.5 mb-1'
                } font-arabic text-[#005a2b] leading-normal sm:leading-relaxed px-1`}
              >
                {ar.orgName}
              </h3>

              {/* Arabic Honorific Invitation Phrase */}
              <p
                dir="rtl"
                className={`w-full ${
                  cardLanguage === 'ar'
                    ? 'text-sm sm:text-base md:text-lg font-bold my-1.5 text-stone-800'
                    : 'text-[11px] sm:text-xs md:text-sm font-bold text-stone-800 my-1'
                } font-arabic leading-normal px-1`}
              >
                {ar.honorificIntro}
              </p>

              {/* Arabic Event Title */}
              <h1
                dir="rtl"
                className={`w-full ${
                  cardLanguage === 'ar'
                    ? 'text-lg sm:text-3xl md:text-4xl font-black my-2.5'
                    : 'text-sm sm:text-xl md:text-2xl font-black my-1.5'
                } font-arabic text-[#112d6a] leading-normal sm:leading-snug drop-shadow-xs px-1`}
              >
                {ar.eventTitle}
              </h1>

              {/* Arabic Villages / Beneficiaries */}
              <p
                dir="rtl"
                className={`w-full ${
                  cardLanguage === 'ar'
                    ? 'text-xs sm:text-sm md:text-base max-w-3xl my-2'
                    : 'text-[10px] sm:text-xs md:text-sm max-w-2xl my-1'
                } font-arabic font-semibold text-stone-800 mx-auto leading-normal sm:leading-relaxed px-2`}
              >
                {ar.beneficiaries}
              </p>

              {/* Arabic Slogan with Ornamental Floral Brackets */}
              <div className={`flex items-center justify-center gap-2 ${cardLanguage === 'ar' ? 'my-3' : 'my-1.5'} w-full`}>
                <span className="text-[#c99837] text-xs sm:text-sm">❖</span>
                <p
                  dir="rtl"
                  className={`${
                    cardLanguage === 'ar'
                      ? 'text-xs sm:text-base md:text-lg font-black'
                      : 'text-[10px] sm:text-xs md:text-sm font-extrabold'
                  } font-arabic text-[#112d6a] px-3 py-1 rounded-lg bg-amber-50/90 border border-[#c99837]/40 leading-normal`}
                >
                  {ar.slogan}
                </p>
                <span className="text-[#c99837] text-xs sm:text-sm">❖</span>
              </div>

              {/* Arabic Info Bar: Date, Time, Location */}
              <div className={`w-full ${cardLanguage === 'ar' ? 'max-w-3xl' : 'max-w-2xl'} grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 px-1`}>
                {/* Location */}
                <div
                  dir="rtl"
                  className={`flex items-center justify-center gap-2 ${cardLanguage === 'ar' ? 'py-2 px-3' : 'py-1 px-2.5'} rounded-xl bg-white border border-[#c99837]/50 shadow-xs`}
                >
                  <div className="p-1.5 rounded-full bg-[#005a2b] text-white shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className={`font-arabic font-bold ${cardLanguage === 'ar' ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs'} text-[#005a2b] leading-tight`}>
                    {ar.location}
                  </span>
                </div>

                {/* Date & Time */}
                <div
                  dir="rtl"
                  className={`flex items-center justify-center gap-2 ${cardLanguage === 'ar' ? 'py-2 px-3' : 'py-1 px-2.5'} rounded-xl bg-white border border-[#c99837]/50 shadow-xs`}
                >
                  <div className="p-1.5 rounded-full bg-[#005a2b] text-white shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <span className={`font-arabic font-bold ${cardLanguage === 'ar' ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs'} text-stone-900 leading-tight`}>
                    {ar.dateTime}
                  </span>
                </div>
              </div>

              {/* QR Code Pass for Dedicated Arabic View */}
              {cardLanguage === 'ar' && showQr && (
                <div className="mt-4 pt-3 border-t border-[#c99837]/40 w-full max-w-md flex items-center justify-center gap-4 bg-white/90 p-3 rounded-2xl border border-[#c99837] shadow-sm">
                  <QRCodeSVG
                    value={`FESTIVAL-2026|${data.invitationCode}|${data.recipientName || 'INVITE'}|${data.category}`}
                    size={68}
                    bgColor="#ffffff"
                    fgColor="#005a2b"
                    level="M"
                  />
                  <div dir="rtl" className="text-right">
                    <span className="block font-arabic font-black text-[#005a2b] text-sm">رمز الدخول والتحقق الرسمي</span>
                    <span className="block font-mono text-xs text-stone-700 font-bold tracking-widest">{data.invitationCode}</span>
                    <span className="block font-arabic text-xs text-amber-800 font-bold mt-0.5">{currentCat.ar} • {data.seatZone || 'المنصة الرئيسية'}</span>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ========================================================= */}
          {/* GOLDEN FLORAL DIVIDER (ONLY IN BILINGUAL MODE)            */}
          {/* ========================================================= */}
          {cardLanguage === 'bilingual' && (
            <div className="w-full my-2 flex items-center justify-center gap-3">
              <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#c99837] to-[#c99837]" />
              <div className="flex items-center gap-1.5 text-[#c99837]">
                <Sparkles className="w-3.5 h-3.5 text-[#c99837]" />
                <span className="text-xs font-bold font-serif">❦</span>
                <Sparkles className="w-3.5 h-3.5 text-[#c99837]" />
              </div>
              <div className="flex-1 h-[1.5px] bg-gradient-to-l from-transparent via-[#c99837] to-[#c99837]" />
            </div>
          )}

          {/* ========================================================= */}
          {/* FRENCH VERSION / SECTION                                  */}
          {/* ========================================================= */}
          {(cardLanguage === 'fr' || cardLanguage === 'bilingual') && (
            <section className={`w-full text-center ${cardLanguage === 'fr' ? 'py-3 sm:py-5' : 'pt-1'} flex flex-col items-center`}>
              {/* Ornate Green & Gold Cartouche Header "Invitation" */}
              <div className="relative inline-flex items-center justify-center my-1">
                <div
                  className={`px-10 sm:px-16 ${cardLanguage === 'fr' ? 'py-2 sm:py-3' : 'py-1'} rounded-3xl bg-[#004f24] text-white border-2 sm:border-3 border-[#e6b94d] shadow-md flex items-center justify-center`}
                  style={{
                    clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)',
                  }}
                >
                  <h2 className={`${cardLanguage === 'fr' ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-2xl'} font-extrabold tracking-wider text-white py-0.5 px-3 uppercase font-serif`}>
                    {fr.badge}
                  </h2>
                </div>
              </div>

              {/* Personalized Guest Line (French) */}
              {frenchRecipientName && (
                <div
                  className={`w-full max-w-2xl mx-auto ${
                    cardLanguage === 'fr' ? 'my-3 px-4 py-2.5' : 'my-1.5 px-3 py-1.5'
                  } rounded-xl bg-amber-50/95 border border-[#c99837] text-stone-900 shadow-xs flex items-center justify-between gap-2.5 text-left`}
                >
                  <div className="flex items-center gap-2 min-w-0 overflow-hidden text-left flex-1">
                    <UserCheck className={`${cardLanguage === 'fr' ? 'w-5 h-5' : 'w-4 h-4'} text-[#005a2b] shrink-0`} />
                    <span className={`font-bold ${cardLanguage === 'fr' ? 'text-xs sm:text-sm' : 'text-[11px] sm:text-xs'} text-[#005a2b] whitespace-nowrap shrink-0`}>
                      {data.recipientHonorificFr || 'M./Mme'} :
                    </span>
                    <span className={`font-extrabold ${cardLanguage === 'fr' ? 'text-sm sm:text-lg' : 'text-xs sm:text-sm'} text-stone-950 truncate block min-w-0`} title={frenchRecipientName}>
                      {frenchRecipientName}
                    </span>
                  </div>
                  <span className={`${cardLanguage === 'fr' ? 'text-xs sm:text-sm px-3 py-1' : 'text-[10px] sm:text-xs px-2.5 py-0.5'} font-bold rounded-full bg-[#005a2b] text-amber-200 shrink-0 whitespace-nowrap`}>
                    {currentCat.fr}
                  </span>
                </div>
              )}

              {/* French Organization Name */}
              <h3 className={`w-full ${cardLanguage === 'fr' ? 'text-base sm:text-2xl font-black mt-2 mb-1' : 'text-xs sm:text-base md:text-lg font-extrabold mt-1 mb-0.5'} text-[#005a2b] max-w-3xl leading-snug`}>
                {fr.orgName}
              </h3>

              {/* French Honorific Phrase */}
              <p className={`w-full ${cardLanguage === 'fr' ? 'text-xs sm:text-base font-semibold my-1' : 'text-[11px] sm:text-xs font-semibold my-0.5'} text-stone-700`}>
                {fr.honorificIntro}
              </p>

              {/* French Edition & Event Title */}
              <div className="flex items-center justify-center gap-2 my-1">
                <span className={`${cardLanguage === 'fr' ? 'text-2xl sm:text-4xl' : 'text-lg sm:text-2xl'} font-black text-[#112d6a] font-serif`}>
                  3<sup className="text-xs sm:text-sm">ème</sup>
                </span>
                <h1 className={`${cardLanguage === 'fr' ? 'text-lg sm:text-3xl font-extrabold' : 'text-sm sm:text-xl md:text-2xl font-extrabold'} text-[#112d6a] tracking-tight`}>
                  {fr.eventTitle}
                </h1>
              </div>

              {/* French Beneficiary Villages */}
              <p className={`w-full ${cardLanguage === 'fr' ? 'text-xs sm:text-sm font-semibold max-w-3xl my-2' : 'text-[10px] sm:text-xs font-semibold max-w-2xl my-1'} text-stone-700 mx-auto leading-snug px-2`}>
                {fr.beneficiaries}
              </p>

              {/* French Slogan with Floral Flourishes */}
              <div className="flex items-center justify-center gap-2 my-1.5 w-full">
                <span className="text-[#c99837] text-xs">❖</span>
                <p className={`${cardLanguage === 'fr' ? 'text-xs sm:text-base font-extrabold' : 'text-[11px] sm:text-sm font-extrabold'} text-[#112d6a] px-2 py-0.5`}>
                  {fr.slogan}
                </p>
                <span className="text-[#c99837] text-xs">❖</span>
              </div>

              {/* French Info Bar: Date, Time, Location & QR Code Verification Pass */}
              <div className={`w-full ${cardLanguage === 'fr' ? 'max-w-3xl' : 'max-w-2xl'} flex flex-col sm:flex-row items-center justify-between gap-2 mt-1 px-1`}>
                {/* Date & Time */}
                <div className="flex-1 w-full flex items-center gap-2.5 py-1.5 px-3 rounded-xl bg-white border border-[#c99837]/50 shadow-xs text-left">
                  <div className="p-1.5 rounded-full bg-[#005a2b] text-white shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[10px] sm:text-xs leading-tight">
                    <p className="font-bold text-stone-900">Le 28 août 2026</p>
                    <p className="text-stone-600">A partir de 19 heure</p>
                  </div>
                </div>

                {/* QR Code Pass for Entry Verification (in Bilingual or French mode) */}
                {showQr && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-white border border-[#c99837] rounded-xl shadow-xs shrink-0">
                    <QRCodeSVG
                      value={`FESTIVAL-2026|${data.invitationCode}|${data.recipientName || 'INVITE'}|${data.category}`}
                      size={46}
                      bgColor="#ffffff"
                      fgColor="#005a2b"
                      level="M"
                    />
                    <div className="text-[9px] text-center leading-tight">
                      <span className="block font-bold text-[#005a2b]">PASS ENTRÉE</span>
                      <span className="block font-mono text-[8px] text-stone-500 font-bold">{data.invitationCode}</span>
                      <span className="block font-arabic text-[8px] text-amber-700">رمز الدخول</span>
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="flex-1 w-full flex items-center gap-2.5 py-1.5 px-3 rounded-xl bg-white border border-[#c99837]/50 shadow-xs text-left">
                  <div className="p-1.5 rounded-full bg-[#005a2b] text-white shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[10px] sm:text-xs leading-tight">
                    <p className="font-bold text-[#005a2b]">A Hassi El Bekay</p>
                    <p className="text-stone-600">Kiffa / Assaba</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Bottom Micro Footer */}
          <div className="w-full text-center mt-2 pt-1 border-t border-[#c99837]/30 text-[9px] sm:text-[10px] text-stone-500 font-medium flex items-center justify-between px-2">
            <span>Coordination Générale pour le Développement • Hassi El Bekay</span>
            <span dir="rtl" className="font-arabic font-bold text-[#005a2b]">
              حاسي البكاي — كيفة (28 أغسطس – 2 سبتمبر 2026)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
