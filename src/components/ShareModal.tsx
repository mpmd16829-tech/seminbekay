import React, { useState } from 'react';
import { SHARE_TEMPLATES } from '../data/festivalData';
import {
  X,
  Copy,
  Check,
  Share2,
  Download,
  Printer,
  MessageCircle,
  FileImage,
  AlertCircle,
  Paperclip,
  CheckCircle2,
  FileText,
  Phone,
  Info
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import { exportElementToPdf, PdfPaperSize } from '../lib/pdfExport';
import { buildWhatsAppUrl } from '../lib/phoneUtils';

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
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const [pdfSize, setPdfSize] = useState<PdfPaperSize>('a4');
  const [targetPhone, setTargetPhone] = useState('');
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [showAttachmentGuidance, setShowAttachmentGuidance] = useState(false);

  if (!isOpen) return null;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_TEMPLATES.whatsappText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const getPosterImageBlob = async (): Promise<{ blob: Blob; dataUrl: string } | null> => {
    const el = document.getElementById(posterElementId);
    if (!el) return null;

    try {
      const dataUrl = await toPng(el, {
        quality: 1.0,
        pixelRatio: 3.5,
        cacheBust: true,
        skipFonts: true,
      });

      const blob = await toBlob(el, {
        quality: 1.0,
        pixelRatio: 3.5,
        cacheBust: true,
        skipFonts: true,
      });

      if (!blob) return null;
      return { blob, dataUrl };
    } catch (err) {
      console.error('Error rendering poster image:', err);
      return null;
    }
  };

  const handleDownloadImage = async () => {
    try {
      setIsExporting(true);
      setExportError(null);

      const result = await getPosterImageBlob();
      if (!result) {
        setExportError("Impossible de capturer l'image de l'affiche. Veuillez réessayer.");
        return;
      }

      const link = document.createElement('a');
      link.download = `Affiche_Semaine_Culturelle_Hassi_Bekay_2026_HD.png`;
      link.href = result.dataUrl;
      link.click();
      setExportSuccess("Affiche téléchargée en ultra haute résolution (300 DPI) !");
      setTimeout(() => setExportSuccess(null), 4000);
    } catch (err) {
      console.error('Export error:', err);
      setExportError('Le téléchargement direct a rencontré un imprévu.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPdfGrandFormat = async (size: PdfPaperSize = pdfSize) => {
    try {
      setIsPdfExporting(true);
      setExportError(null);

      const filename = `Affiche_Officielle_${size.toUpperCase()}_Hassi_Bekay_2026.pdf`;
      const success = await exportElementToPdf(posterElementId, {
        filename,
        paperSize: size,
        orientation: 'portrait',
        quality: 1.0,
      });

      if (success) {
        setExportSuccess(`Affiche en PDF Grand Format (${size.toUpperCase()}) générée avec succès !`);
        setTimeout(() => setExportSuccess(null), 4000);
      } else {
        setExportError("Erreur lors de la génération du document PDF.");
      }
    } catch (err) {
      console.error('PDF export error:', err);
      setExportError("Impossible d'exporter l'affiche en PDF.");
    } finally {
      setIsPdfExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // SHARE POSTER DIRECTLY TO WHATSAPP RECIPIENT PHONE AS VISUAL ATTACHMENT
  const handleWhatsAppShareImage = async () => {
    try {
      setIsExporting(true);
      setExportError(null);

      const result = await getPosterImageBlob();
      if (!result) {
        setExportError("Impossible de générer l'image de l'affiche pour le partage.");
        setIsExporting(false);
        return;
      }

      const { blob, dataUrl } = result;
      const filename = `Affiche_Officielle_Semaine_Culturelle_Hassi_Bekay_2026.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      // Clean phone number
      const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
      const fullPhone = cleanPhone.startsWith('222') ? cleanPhone : cleanPhone.length === 8 ? `222${cleanPhone}` : cleanPhone;

      // Check if Web Share API with files is supported (Mobile Chrome, Safari iOS, Android)
      const canShareFile = typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] });

      if (canShareFile) {
        try {
          await navigator.share({
            title: `الملصق الرسمي - أسبوع أحسي البكاي الثقافي والرياضي 2026`,
            text: `الملصق الرسمي للأسبوع الثقافي والرياضي بقرى تجمع أحسي البكاي (28 أغسطس - 2 سبتمبر 2026)`,
            files: [file],
          });
          setExportSuccess("Image de l'affiche partagée avec succès en pièce jointe !");
          setTimeout(() => setExportSuccess(null), 5000);
          setIsExporting(false);
          return;
        } catch (shareErr) {
          console.log('Web share cancelled or fallback:', shareErr);
        }
      }

      // Fallback: Copy to clipboard & trigger download & open targeted WhatsApp
      let copiedToClip = false;
      try {
        if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          copiedToClip = true;
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 5000);
        }
      } catch (clipErr) {
        console.warn('Clipboard write image not permitted:', clipErr);
      }

      // Automatically download high-res PNG
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();

      // Open WhatsApp targeted to the specific phone with accompanying template text
      const whatsappUrl = buildWhatsAppUrl(targetPhone, SHARE_TEMPLATES.whatsappText);
      window.open(whatsappUrl, '_blank');

      setShowAttachmentGuidance(true);
      setExportSuccess(
        copiedToClip
          ? `Image copiée et téléchargée ! Envoyez-la directement dans WhatsApp (${fullPhone ? '+' + fullPhone : 'Discussion'}).`
          : "Image de l'affiche téléchargée ! Joignez-la dans WhatsApp via le trombone 📎."
      );
    } catch (err) {
      console.error('WhatsApp image share error:', err);
      setExportError("Une erreur est survenue lors de la préparation de l'image.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-400/50 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-b border-amber-400/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-400 text-stone-950 font-bold shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Partager & Télécharger l'Affiche
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold flex items-center gap-1">
                  <Paperclip className="w-3 h-3" />
                  Image & PDF Grand Format
                </span>
              </div>
              <p dir="rtl" className="text-xs text-amber-300 font-arabic">
                تنزيل ومشاركة صورة الملصق الرسمي (صورة مرفقة أو PDF عالي الدقة) للأسبوع الثقافي 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Notification Badges */}
          {exportSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{exportSuccess}</span>
            </div>
          )}

          {exportError && (
            <div className="p-3 rounded-2xl bg-red-950/90 border border-red-500/60 text-red-200 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{exportError}</span>
            </div>
          )}

          {/* Targeted WhatsApp Direct Send Box */}
          <div className="p-4 rounded-2xl bg-stone-950/80 border-2 border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>Envoi Direct de l'Affiche sur WhatsApp :</span>
              </label>
              <span className="text-[10px] text-stone-400 font-arabic" dir="rtl">إرسال الملصق مباشرة إلى رقم الواتساب</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-amber-300 font-bold pointer-events-none">
                  <span>🇲🇷 +222</span>
                </div>
                <input
                  type="tel"
                  placeholder="Numéro WhatsApp (ex: 46 12 34 56)"
                  value={targetPhone}
                  onChange={(e) => setTargetPhone(e.target.value)}
                  className="w-full pl-20 pr-3 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white placeholder-stone-500 text-xs font-mono focus:outline-hidden focus:border-emerald-400"
                />
              </div>

              <button
                onClick={handleWhatsAppShareImage}
                disabled={isExporting}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95 whitespace-nowrap"
              >
                <Paperclip className="w-4 h-4 text-emerald-950" />
                <span>{isExporting ? 'Préparation...' : 'Envoyer l\'Affiche sur WhatsApp'}</span>
              </button>
            </div>
          </div>

          {/* Quick Action Grid (PDF Grand Format, PNG HD, Print) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* PDF Grand Format A4 / A3 */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-red-950/60 to-stone-950 border border-red-500/50 flex flex-col justify-between space-y-2.5">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-400" />
                <span className="text-xs font-bold text-white">PDF Grand Format</span>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPdfSize('a4')}
                  className={`flex-1 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    pdfSize === 'a4' ? 'bg-red-500 text-white' : 'bg-stone-800 text-stone-300'
                  }`}
                >
                  A4 (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => setPdfSize('a3')}
                  className={`flex-1 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    pdfSize === 'a3' ? 'bg-red-500 text-white' : 'bg-stone-800 text-stone-300'
                  }`}
                >
                  A3 (Affiche Géante)
                </button>
              </div>

              <button
                onClick={() => handleDownloadPdfGrandFormat(pdfSize)}
                disabled={isPdfExporting}
                className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isPdfExporting ? 'Génération PDF...' : `Télécharger PDF (${pdfSize.toUpperCase()})`}</span>
              </button>
            </div>

            {/* Download PNG Ultra HD */}
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-emerald-500/40 flex flex-col justify-between space-y-2.5">
              <div className="flex items-center gap-2">
                <FileImage className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold text-white">Image Ultra HD (300 DPI)</span>
              </div>
              <p className="text-[10px] text-stone-400">Idéal pour le partage direct comme image sur WhatsApp et réseaux.</p>
              <button
                onClick={handleDownloadImage}
                disabled={isExporting}
                className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger Image PNG HD</span>
              </button>
            </div>

            {/* Print */}
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-700 flex flex-col justify-between space-y-2.5">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold text-white">Impression Directe</span>
              </div>
              <p className="text-[10px] text-stone-400">Pour imprimante de bureau ou traceur d'affiches.</p>
              <button
                onClick={handlePrint}
                className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-stone-600 transition-all cursor-pointer active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer l'Affiche</span>
              </button>
            </div>
          </div>

          {/* Guidance box */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-300 space-y-1">
              <p className="font-bold text-white">
                Affichage dans WhatsApp comme affiche visuelle :
              </p>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                Le fichier de l'affiche est préparé en très grand format et haute définition. Il atterrit directement comme image ou document dans le chat WhatsApp de l'invité.
              </p>
            </div>
          </div>

          {/* Bilingual Shareable Text (Secondary / Optional) */}
          <div className="space-y-2 pt-2 border-t border-stone-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-400">
                Texte descriptif d'accompagnement (facultatif) :
              </label>
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
              >
                {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText ? 'Texte Copié !' : 'Copier le texte'}</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 max-h-24 overflow-y-auto text-[11px] text-stone-400 whitespace-pre-line leading-relaxed select-all">
              {SHARE_TEMPLATES.whatsappText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

