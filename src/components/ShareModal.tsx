import React, { useState } from 'react';
import { SHARE_TEMPLATES, FESTIVAL_INFO } from '../data/festivalData';
import { X, Copy, Check, Share2, Download, Printer, MessageCircle, FileImage, AlertCircle } from 'lucide-react';
import { toPng } from 'html-to-image';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  posterElementId: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  posterElementId,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_TEMPLATES.whatsappText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadImage = async () => {
    const el = document.getElementById(posterElementId);
    if (!el) return;

    try {
      setIsExporting(true);
      setExportError(null);

      // html-to-image with skipFonts: true prevents querying external cross-origin stylesheets
      const dataUrl = await toPng(el, {
        quality: 0.98,
        pixelRatio: 2, // 2x high-resolution crispness
        cacheBust: true,
        skipFonts: true,
      });

      const link = document.createElement('a');
      link.download = `Affiche_Semaine_Culturelle_Hassi_Bekay_2026.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export error:', err);
      setExportError('Le téléchargement direct a rencontré un imprévu. Vous pouvez également utiliser le bouton Imprimer / PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(SHARE_TEMPLATES.whatsappText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-400/50 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-b border-amber-400/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Partager & Télécharger l'Affiche
              </h2>
              <p dir="rtl" className="text-xs text-amber-300 font-arabic">
                تنزيل ومشاركة الملصق الرسمي للأسبوع الثقافي 2026
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

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Download PNG */}
            <button
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="p-4 rounded-xl bg-gradient-to-br from-emerald-900 to-emerald-950 border border-emerald-500/50 hover:border-amber-400 text-white flex flex-col items-center justify-center text-center group transition-all shadow cursor-pointer"
            >
              <FileImage className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">
                {isExporting ? 'Génération...' : 'Télécharger PNG'}
              </span>
              <span dir="rtl" className="text-[11px] text-emerald-300 font-arabic mt-0.5">
                تنزيل صورة عالية الدقة
              </span>
            </button>

            {/* WhatsApp Share */}
            <button
              onClick={handleWhatsAppShare}
              className="p-4 rounded-xl bg-gradient-to-br from-emerald-950 to-stone-900 border border-emerald-600/50 hover:border-emerald-400 text-white flex flex-col items-center justify-center text-center group transition-all shadow cursor-pointer"
            >
              <MessageCircle className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Partager WhatsApp</span>
              <span dir="rtl" className="text-[11px] text-emerald-300 font-arabic mt-0.5">
                مشاركة عبر واتساب
              </span>
            </button>

            {/* Print / PDF */}
            <button
              onClick={handlePrint}
              className="p-4 rounded-xl bg-gradient-to-br from-amber-950 to-stone-900 border border-amber-500/50 hover:border-amber-400 text-white flex flex-col items-center justify-center text-center group transition-all shadow cursor-pointer"
            >
              <Printer className="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Imprimer / PDF</span>
              <span dir="rtl" className="text-[11px] text-amber-300 font-arabic mt-0.5">
                طباعة الملصق أو PDF
              </span>
            </button>
          </div>

          {/* Bilingual Shareable Message Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-300">
                Texte d'invitation officiel prêt à copier :
              </label>
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier le texte'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 max-h-48 overflow-y-auto text-xs text-stone-300 whitespace-pre-line leading-relaxed select-all">
              {SHARE_TEMPLATES.whatsappText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
