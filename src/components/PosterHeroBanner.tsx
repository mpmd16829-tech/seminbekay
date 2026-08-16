import React, { useState } from 'react';
import { LanguageMode } from '../types';
import { Users, Sparkles, Trophy, Heart } from 'lucide-react';

interface PosterHeroBannerProps {
  langMode: LanguageMode;
  onExploreActivity?: (id: string) => void;
}

// Generated artwork images
import heroArtPrimary from '../assets/images/affiche_hero_hassi_bakai_1786894144524.jpg';
import traditionsArt from '../assets/images/assaba_kiffa_traditions_1786894160211.jpg';

export const PosterHeroBanner: React.FC<PosterHeroBannerProps> = ({ langMode, onExploreActivity }) => {
  const [selectedImage, setSelectedImage] = useState<'primary' | 'traditions'>('primary');

  const currentImg = selectedImage === 'primary' ? heroArtPrimary : traditionsArt;

  return (
    <div className="w-full max-w-4xl px-4 sm:px-6 my-2">
      <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-2xl bg-stone-950 group">
        {/* Main Artwork */}
        <div className="relative h-60 sm:h-80 md:h-96 w-full overflow-hidden">
          <img
            src={currentImg}
            alt="Semaine culturelle et sportive Hassi El Bakaï Kiffa Assaba"
            className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />

          {/* Artistic Mauritanian Tint & Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
          <div className="absolute inset-0 bg-radial from-transparent via-emerald-950/20 to-stone-950/80" />

          {/* Top Cultural Tag */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="px-2.5 py-1 rounded-md bg-emerald-900/90 text-emerald-200 border border-emerald-500/50 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 shadow-md">
              <span>🇲🇷</span> Kiffa • Assaba
            </span>

            <span className="px-2.5 py-1 rounded-md bg-amber-500/90 text-stone-950 border border-amber-300 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3 h-3 text-stone-950" />
              <span>Unité & Célébration • وحدة وتآخي</span>
            </span>
          </div>

          {/* Quick Artwork Switcher (for rich presentation) */}
          <div className="absolute top-3 right-3 z-10 flex gap-1 pointer-events-auto opacity-80 hover:opacity-100 transition-opacity">
            <button
              onClick={() => setSelectedImage('primary')}
              title="Vue Festival & Jeunesse"
              className={`px-2 py-0.5 text-[10px] rounded font-semibold transition-all ${
                selectedImage === 'primary'
                  ? 'bg-amber-400 text-stone-950 shadow'
                  : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setSelectedImage('traditions')}
              title="Vue Traditions (Sigg, Kroub, Tir)"
              className={`px-2 py-0.5 text-[10px] rounded font-semibold transition-all ${
                selectedImage === 'traditions'
                  ? 'bg-amber-400 text-stone-950 shadow'
                  : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800'
              }`}
            >
              Traditions & Jeux
            </button>
          </div>

          {/* Bottom Community Highlights floating on image */}
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-stone-900/85 border border-amber-400/30 backdrop-blur-md">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30">
                <Users className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="font-bold text-white text-[11px] sm:text-xs">Jeunes & Familles</span>
                <span dir="rtl" className="text-[10px] text-emerald-300 font-arabic">الشباب والعائلات</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-amber-950/60 border border-amber-500/30">
                <Trophy className="w-4 h-4 text-amber-400 mb-1" />
                <span className="font-bold text-white text-[11px] sm:text-xs">Sportifs & Tireurs</span>
                <span dir="rtl" className="text-[10px] text-amber-300 font-arabic">الرياضيون والرماة</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-rose-950/60 border border-rose-500/30">
                <Sparkles className="w-4 h-4 text-rose-400 mb-1" />
                <span className="font-bold text-white text-[11px] sm:text-xs">Femmes & Jeux Sigg</span>
                <span dir="rtl" className="text-[10px] text-rose-300 font-arabic">النساء والألعاب التراثية</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30">
                <Heart className="w-4 h-4 text-cyan-400 mb-1" />
                <span className="font-bold text-white text-[11px] sm:text-xs">Volontaires & Entraide</span>
                <span dir="rtl" className="text-[10px] text-cyan-300 font-arabic">المتطوعون والتكافل</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
