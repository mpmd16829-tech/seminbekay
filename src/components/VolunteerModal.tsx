import React, { useState } from 'react';
import { FESTIVAL_COMMITTEES } from '../data/festivalData';
import { LanguageMode } from '../types';
import { useCloudGuestbook } from '../lib/firestoreService';
import { X, HandHeart, CheckCircle, Send, Sparkles, UserCheck, Cloud } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  langMode: LanguageMode;
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({ isOpen, onClose, langMode }) => {
  const { addMessage, isCloudConnected } = useCloudGuestbook();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('Hassi El Bekay');
  const [selectedCommittee, setSelectedCommittee] = useState(FESTIVAL_COMMITTEES[0].id);
  const [proposal, setProposal] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    // Save to Cloud Firestore
    const committeeObj = FESTIVAL_COMMITTEES.find(c => c.id === selectedCommittee);
    const committeeLabel = committeeObj ? `${committeeObj.nameFr} / ${committeeObj.nameAr}` : selectedCommittee;
    await addMessage({
      authorName: name,
      village: village,
      message: `[Comité: ${committeeLabel}] [Tél: ${phone}] ${proposal}`,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#006233', '#FFD100', '#D0103A', '#FFFFFF']
    });
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setPhone('');
    setProposal('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-400/50 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-b border-amber-400/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-400">
              <HandHeart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Rejoindre les Comités & Proposer des Idées
              </h2>
              <p dir="rtl" className="text-xs text-amber-300 font-arabic">
                الانضمام للجان التنظيم وتقديم المقترحات والمبادرات
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

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="inline-flex p-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Merci pour votre engagement communautaire !
              </h3>
              <p dir="rtl" className="text-base font-arabic text-amber-300 font-bold">
                شكرًا لمشاركتكم الفعالة! طاقتكم وأفكاركم تصنع الفارق في حاسي البكاي.
              </p>
              <p className="text-sm text-stone-300 max-w-md mx-auto">
                Votre inscription a été enregistrée avec succès. Les coordinateurs des comités prendront contact avec vous lors de la réunion préparatoire.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg transition-colors cursor-pointer"
                >
                  Fermer • إغلاق
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  « Venez nombreux participer, proposer vos idées, rejoindre les comités et soutenir les équipes ! »
                </span>
              </div>

              {/* Name & Village */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Nom complet • الاسم الكامل <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Mohamed Lemine / فاطمة"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Village / Quartier • القرية أو الحي
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="Ex: Hassi El Bekay, Kiffa..."
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Committee Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Choisir un comité à rejoindre • اختيار لجنة التنظيم <span className="text-amber-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FESTIVAL_COMMITTEES.map((com) => {
                    const isSelected = selectedCommittee === com.id;
                    return (
                      <div
                        key={com.id}
                        onClick={() => setSelectedCommittee(com.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-400/20 border-amber-400 text-white shadow'
                            : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold">{com.nameFr}</p>
                          {isSelected && <UserCheck className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <p dir="rtl" className="text-[11px] font-arabic text-amber-300/80 mt-0.5">
                          {com.nameAr}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ideas & Proposals */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Vos idées ou propositions d'activités • مقترحاتكم وأفكاركم
                </label>
                <textarea
                  rows={3}
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="Partagez vos suggestions pour la réussite de cette 3e édition..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Submit button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-white text-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirmer ma participation • تأكيد المشاركة</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
