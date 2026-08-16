import React, { useState, useEffect } from 'react';
import { InvitationCard, InvitationCardLanguage } from './InvitationCard';
import { PersonalizedFestivalPoster } from './PersonalizedFestivalPoster';
import { InvitationCardData, InvitationCategory } from '../types';
import { generateWhatsAppInvitationMessage } from '../data/festivalData';
import { useCloudInvitations } from '../lib/firestoreService';
import { validateMauritanianPhone, formatMauritaniaInput, buildWhatsAppUrl } from '../lib/phoneUtils';
import { exportElementToPdf, PdfPaperSize } from '../lib/pdfExport';
import { InvitationStatsDashboard } from './InvitationStatsDashboard';
import { QrPassValidatorModal } from './QrPassValidatorModal';
import { SyncStatusBadge } from './SyncStatusBadge';
import { toPng } from 'html-to-image';
import {
  X,
  Share2,
  Download,
  Printer,
  MessageCircle,
  Plus,
  Trash2,
  Copy,
  Check,
  Sparkles,
  QrCode,
  Users,
  Search,
  RefreshCw,
  Eye,
  Send,
  Edit3,
  Image as ImageIcon,
  Paperclip,
  Languages,
  CheckCircle2,
  FileCheck,
  Info,
  Cloud,
  FileText,
  BarChart2,
  ShieldCheck,
  Phone,
  AlertCircle
} from 'lucide-react';

interface InvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_INVITATIONS: InvitationCardData[] = [
  {
    id: 'inv-sample-1',
    recipientName: 'محمد الأمين ولد الشيخ',
    recipientNameAr: 'محمد الأمين ولد الشيخ',
    recipientNameFr: 'Mohamed Lemine Ould Cheikh',
    recipientHonorificFr: 'M. le Notable & Invité d’Honneur',
    recipientHonorificAr: 'السيد الفاضل والوجيه',
    whatsappPhone: '22246000000',
    category: 'vip',
    seatZone: 'المنصة الشرفية (Tribune A1)',
    invitationCode: 'HB26-VIP-101',
    createdAt: new Date().toISOString(),
    checkedIn: true,
    checkedInAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'inv-sample-2',
    recipientName: 'Mariem Mint El Moctar',
    recipientNameAr: 'مريم بنت المختار',
    recipientNameFr: 'Mariem Mint El Moctar',
    recipientHonorificFr: 'Chère Représentante Associative',
    recipientHonorificAr: 'الأخت الفاضلة والفاعلة الجمعوية',
    whatsappPhone: '22236000000',
    category: 'guest',
    seatZone: 'Zone Invités B4',
    invitationCode: 'HB26-INV-204',
    createdAt: new Date().toISOString(),
    checkedIn: false,
  },
  {
    id: 'inv-sample-3',
    recipientName: 'أحمد ولد بابانه',
    recipientNameAr: 'أحمد ولد بابانه',
    recipientNameFr: 'Ahmed Ould Babana',
    recipientHonorificFr: 'Cher Capitaine & Sportif',
    recipientHonorificAr: 'الشاب الرياضي وقائد الفريق',
    whatsappPhone: '22222000000',
    category: 'youth',
    seatZone: 'Espace Jeunesse & Équipes',
    invitationCode: 'HB26-YTH-309',
    createdAt: new Date().toISOString(),
    checkedIn: false,
  },
];

export const InvitationModal: React.FC<InvitationModalProps> = ({ isOpen, onClose }) => {
  const getInitialList = (): InvitationCardData[] => {
    try {
      const saved = localStorage.getItem('hassi_bekay_invitations_list') || localStorage.getItem('hassi_bakai_invitations_list');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return SAMPLE_INVITATIONS;
  };

  const {
    invitations,
    saveInvitation,
    checkInInvitation,
    removeInvitation,
    isCloudConnected,
    loading: isCloudLoading
  } = useCloudInvitations(getInitialList());

  const [currentForm, setCurrentForm] = useState<InvitationCardData>({
    id: 'inv-' + Date.now(),
    recipientName: '',
    recipientNameAr: '',
    recipientNameFr: '',
    recipientHonorificFr: 'M./Mme',
    recipientHonorificAr: 'السيد(ة) الفاضل(ة)',
    whatsappPhone: '222',
    category: 'guest',
    seatZone: 'المنصة الرئيسية / Entrée Principale',
    invitationCode: `HB26-INV-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  });

  const [cardLanguage, setCardLanguage] = useState<InvitationCardLanguage>('ar');
  const [visualFormat, setVisualFormat] = useState<'poster_personalized' | 'card_vip'>('poster_personalized');
  const [pdfPaperSize, setPdfPaperSize] = useState<PdfPaperSize>('a4');
  const [isExporting, setIsExporting] = useState(false);
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'preview' | 'list' | 'dashboard' | 'scanner'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [showAttachmentGuidance, setShowAttachmentGuidance] = useState(false);
  const [isQrScannerModalOpen, setIsQrScannerModalOpen] = useState(false);

  // Helper to determine the target element based on selected visual format
  const getActiveTargetElementId = () => {
    return visualFormat === 'poster_personalized'
      ? 'festival-personalized-poster-canvas'
      : 'festival-invitation-card-canvas';
  };

  // Phone validation status for the form
  const phoneValidation = validateMauritanianPhone(currentForm.whatsappPhone);

  if (!isOpen) return null;

  const handleGenerateNewCode = () => {
    const prefix = currentForm.category === 'vip' ? 'HB26-VIP' : currentForm.category === 'volunteer' ? 'HB26-VOL' : 'HB26-INV';
    const rand = Math.floor(1000 + Math.random() * 9000);
    setCurrentForm((prev) => ({
      ...prev,
      invitationCode: `${prefix}-${rand}`,
    }));
  };

  const handleSelectHonorific = (fr: string, ar: string) => {
    setCurrentForm((prev) => ({
      ...prev,
      recipientHonorificFr: fr,
      recipientHonorificAr: ar,
    }));
  };

  const handleSaveAndNew = async () => {
    const primaryName = currentForm.recipientNameAr?.trim() || currentForm.recipientNameFr?.trim() || currentForm.recipientName.trim();
    if (!primaryName) {
      alert('Veuillez renseigner le nom du participant (en arabe ou en français) / يرجى إدخال اسم المدعو');
      return;
    }

    // Ensure phone is normalized
    const normalizedPhone = phoneValidation.isValid ? phoneValidation.normalized : currentForm.whatsappPhone.replace(/\D/g, '');

    await saveInvitation({
      ...currentForm,
      recipientName: primaryName,
      recipientNameAr: currentForm.recipientNameAr?.trim() || primaryName,
      recipientNameFr: currentForm.recipientNameFr?.trim() || primaryName,
      whatsappPhone: normalizedPhone || currentForm.whatsappPhone,
    });

    // Reset form for next participant
    const nextRand = Math.floor(1000 + Math.random() * 9000);
    setCurrentForm({
      id: 'inv-' + Date.now(),
      recipientName: '',
      recipientNameAr: '',
      recipientNameFr: '',
      recipientHonorificFr: 'M./Mme',
      recipientHonorificAr: 'السيد(ة) الفاضل(ة)',
      whatsappPhone: '222',
      category: 'guest',
      seatZone: 'المنصة الرئيسية / Entrée Principale',
      invitationCode: `HB26-INV-${nextRand}`,
      createdAt: new Date().toISOString(),
    });

    setActiveTab('list');
  };

  const handleLoadInvitation = (item: InvitationCardData) => {
    setCurrentForm({
      ...item,
      recipientNameAr: item.recipientNameAr || (item.recipientName && /[\u0600-\u06FF]/.test(item.recipientName) ? item.recipientName : ''),
      recipientNameFr: item.recipientNameFr || (item.recipientName && !/[\u0600-\u06FF]/.test(item.recipientName) ? item.recipientName : ''),
    });
    setActiveTab('preview');
  };

  const handleDeleteInvitation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Voulez-vous supprimer cette invitation de la liste et du Cloud Firebase ? / هل تريد حذف هذه الدعوة؟')) {
      await removeInvitation(id);
    }
  };

  // Helper to generate Image Blob
  const getCardImageBlob = async (targetId?: string): Promise<{ blob: Blob; dataUrl: string } | null> => {
    const resolvedId = targetId || getActiveTargetElementId();
    const el = document.getElementById(resolvedId) || document.getElementById('festival-invitation-card-preview-mini');
    if (!el) return null;

    try {
      const dataUrl = await toPng(el, {
        quality: 0.98,
        pixelRatio: 2.5,
        cacheBust: true,
        skipFonts: true,
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      return { blob, dataUrl };
    } catch (err) {
      console.error('Error generating card image blob:', err);
      return null;
    }
  };

  // PDF EXPORT HANDLER (jsPDF with Grand Format A4 / A3 / A5 support)
  const handleExportPdf = async (paperSize: PdfPaperSize = pdfPaperSize) => {
    try {
      setIsPdfExporting(true);
      const displayName = currentForm.recipientNameFr || currentForm.recipientNameAr || currentForm.recipientName || 'Participant';
      const sanitizedName = displayName.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_');
      const isPoster = visualFormat === 'poster_personalized';
      const filename = isPoster
        ? `Affiche_Officielle_Festival_${sanitizedName}_${paperSize.toUpperCase()}_${currentForm.invitationCode}.pdf`
        : `Carte_Invitation_${sanitizedName}_${paperSize.toUpperCase()}_${currentForm.invitationCode}.pdf`;

      const targetId = getActiveTargetElementId();
      const success = await exportElementToPdf(targetId, {
        filename,
        paperSize: paperSize,
        orientation: isPoster ? 'portrait' : 'landscape',
        quality: 1.0,
        invitationData: currentForm,
      });

      if (success) {
        setExportSuccess(
          isPoster
            ? `Affiche Complète du Festival en PDF Grand Format (${paperSize.toUpperCase()} 300 DPI) générée avec succès !`
            : `Carte d'Invitation PDF (${paperSize.toUpperCase()}) générée avec succès !`
        );
        setTimeout(() => setExportSuccess(null), 5000);
      } else {
        alert('Impossible de générer le document PDF. Veuillez vérifier l\'affichage de l\'affiche/carte.');
      }
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsPdfExporting(false);
    }
  };

  // SEND AS WHATSAPP ATTACHMENT (Image / Poster File Attachment directly to Guest Phone)
  const handleSendWhatsAppAsAttachment = async () => {
    try {
      setIsExporting(true);
      const cleanPhone = phoneValidation.isValid ? phoneValidation.normalized : currentForm.whatsappPhone.replace(/[^0-9]/g, '');
      const fullPhone = cleanPhone.startsWith('222') ? cleanPhone : cleanPhone.length === 8 ? `222${cleanPhone}` : cleanPhone;
      const displayName = currentForm.recipientNameFr || currentForm.recipientNameAr || currentForm.recipientName || 'Invite';
      const sanitizedName = displayName.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_');
      const isPoster = visualFormat === 'poster_personalized';
      const filename = isPoster
        ? `Affiche_Officielle_Hassi_Bekay_2026_${sanitizedName}.png`
        : `Carte_Invitation_${sanitizedName}_${cardLanguage}_${currentForm.invitationCode}.png`;

      const targetId = getActiveTargetElementId();
      const result = await getCardImageBlob(targetId);
      if (!result) {
        alert(isPoster ? 'Impossible de capturer l\'image de l\'affiche. Veuillez réessayer.' : 'Impossible de capturer la carte. Veuillez réessayer.');
        setIsExporting(false);
        return;
      }

      const { blob, dataUrl } = result;
      const file = new File([blob], filename, { type: 'image/png' });

      // Check if Web Share API can share the image file (Android, iOS Safari, etc.)
      const canShareFile = typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] });

      if (canShareFile) {
        try {
          await navigator.share({
            title: isPoster
              ? `الملصق الرسمي - أسبوع أحسي البكاي الثقافي والرياضي 2026 (${currentForm.recipientNameAr || currentForm.recipientNameFr || 'دعوة شرف'})`
              : `بطاقة دعوة وملصق - ${currentForm.recipientNameAr || currentForm.recipientNameFr || 'أسبوع أحسي البكاي'}`,
            text: isPoster
              ? `الملصق الرسمي للأسبوع الثقافي والرياضي بقرى تجمع أحسي البكاي 2026 مع دعوة الشرف الخاصة بالسيد(ة) ${currentForm.recipientNameAr || currentForm.recipientNameFr || ''}`
              : `بطاقة الدعوة الرسمية وتصريح الدخول للمهرجان الثقافي والرياضي بأحسي البكاي 2026 (الرمز: ${currentForm.invitationCode})`,
            files: [file],
          });
          setExportSuccess(isPoster ? 'Affiche officielle partagée avec succès en pièce jointe sur WhatsApp !' : 'Carte d\'invitation partagée avec succès sur WhatsApp !');
          setTimeout(() => setExportSuccess(null), 5000);
          setIsExporting(false);
          return;
        } catch (shareErr) {
          console.log('Share dismissed or fallback:', shareErr);
        }
      }

      // Universal Web Fallback (Desktop WhatsApp Web / Mobile Fallback):
      let copiedToClipboard = false;
      try {
        if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          copiedToClipboard = true;
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 4000);
        }
      } catch (clipErr) {
        console.warn('Clipboard write image not permitted:', clipErr);
      }

      // Automatically download the high-res PNG image
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();

      // Open WhatsApp chat directly with the target phone and accompanying text
      const accompanyingMsg = isPoster
        ? `🇲🇷 *الأسبوع الثقافي والرياضي 2026 — تجمع قرى أحسي البكاي (النسخة 3)*\n\n✨ *دعوة شرف رسمية للسيد(ة) :* ${displayName}\n🏷️ *الفئة :* ${currentForm.category}\n🎫 *رمز الدخول :* \`${currentForm.invitationCode}\`\n\n🖼️ *مرفق :* تم تجهيز وتحميل صورة الملصق الرسمي للمهرجان بدقة عالية (300 DPI) لمشاركتها معكم.`
        : generateWhatsAppInvitationMessage(
            displayName,
            currentForm.recipientHonorificFr,
            currentForm.recipientHonorificAr,
            currentForm.invitationCode,
            currentForm.category
          );

      const whatsappUrl = buildWhatsAppUrl(currentForm.whatsappPhone, accompanyingMsg);
      window.open(whatsappUrl, '_blank');

      // Show helpful guidance modal/toast
      setShowAttachmentGuidance(true);
      setExportSuccess(
        copiedToClipboard
          ? `${isPoster ? 'Affiche du Festival' : 'Carte d\'invitation'} copiée et téléchargée ! Envoyez-la directement dans WhatsApp (${fullPhone ? '+' + fullPhone : 'Destinataire'}).`
          : `${isPoster ? 'Affiche HD' : 'Carte HD'} téléchargée ! Joignez-la via le bouton trombone 📎 dans WhatsApp (${fullPhone ? '+' + fullPhone : ''}).`
      );
    } catch (err) {
      console.error('Error sending as attachment:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Copy Image Blob Directly to Clipboard
  const handleCopyImageToClipboard = async () => {
    try {
      setIsExporting(true);
      const targetId = getActiveTargetElementId();
      const result = await getCardImageBlob(targetId);
      if (!result) return;

      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': result.blob }),
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 4000);
      } else {
        const link = document.createElement('a');
        link.download = visualFormat === 'poster_personalized' ? `Affiche_Hassi_Bekay_2026.png` : `Carte_Invitation_${currentForm.invitationCode}.png`;
        link.href = result.dataUrl;
        link.click();
        setExportSuccess('Image téléchargée ! Collez-la ou joignez-la dans WhatsApp.');
        setTimeout(() => setExportSuccess(null), 4000);
      }
    } catch (err) {
      console.error('Copy image error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // HD PNG Image Download
  const handleDownloadCardImage = async () => {
    const targetId = getActiveTargetElementId();
    const result = await getCardImageBlob(targetId);
    if (!result) return;

    try {
      setIsExporting(true);
      const displayName = currentForm.recipientNameFr || currentForm.recipientNameAr || currentForm.recipientName || 'Participant';
      const sanitizedName = displayName.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_');
      const isPoster = visualFormat === 'poster_personalized';

      const link = document.createElement('a');
      link.download = isPoster
        ? `Affiche_Officielle_Festival_${sanitizedName}_HD.png`
        : `Carte_Invitation_${sanitizedName}_${cardLanguage}_${currentForm.invitationCode}.png`;
      link.href = result.dataUrl;
      link.click();
      setExportSuccess(isPoster ? 'Affiche PNG HD (300 DPI) téléchargée avec succès !' : 'Carte d\'invitation PNG HD téléchargée avec succès !');
      setTimeout(() => setExportSuccess(null), 4000);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Send WhatsApp Text Accompaniment
  const handleSendWhatsAppTextMessage = () => {
    const displayName = currentForm.recipientNameAr && currentForm.recipientNameFr
      ? `${currentForm.recipientNameAr} / ${currentForm.recipientNameFr}`
      : currentForm.recipientNameAr || currentForm.recipientNameFr || currentForm.recipientName || 'Invité d’Honneur / ضيف كريم';

    const message = generateWhatsAppInvitationMessage(
      displayName,
      currentForm.recipientHonorificFr,
      currentForm.recipientHonorificAr,
      currentForm.invitationCode,
      currentForm.category
    );

    const url = buildWhatsAppUrl(currentForm.whatsappPhone, message);
    window.open(url, '_blank');
  };

  // Print Card
  const handlePrintCard = () => {
    window.print();
  };

  const filteredInvitations = invitations.filter((inv) =>
    (inv.recipientName && inv.recipientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (inv.recipientNameAr && inv.recipientNameAr.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (inv.recipientNameFr && inv.recipientNameFr.toLowerCase().includes(searchTerm.toLowerCase())) ||
    inv.invitationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.whatsappPhone.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-stone-900 border-2 border-amber-400/60 rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-b border-amber-400/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-amber-400 text-stone-950 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Gestionnaire & Cartes d'Invitation 2026
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold flex items-center gap-1">
                  <Languages className="w-3 h-3" />
                  Saisie Bilingue Arabe & Français
                </span>
                <SyncStatusBadge isCloudConnected={isCloudConnected} totalSavedCards={invitations.length} />
              </div>
              <p dir="rtl" className="text-xs text-amber-300 font-arabic mt-0.5">
                إدخال اسم المدعو بالعربية والفرنسية لكل نسخة مع تصدير PDF وصورة واتساب وتحقق QR
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

        {/* Tab Navigation & Language Selector Bar */}
        <div className="flex flex-wrap items-center justify-between px-3 sm:px-6 py-2 bg-stone-950/90 border-b border-stone-800 shrink-0 gap-2">
          
          {/* Main Tabs */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>1. Personnaliser (Nom FR / AR)</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>2. Aperçu, PDF & WhatsApp</span>
            </button>

            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>3. Répertoire ({invitations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-stone-950 font-black shadow-md'
                  : 'text-emerald-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>4. Tableau de Bord & Stats</span>
            </button>

            <button
              onClick={() => setIsQrScannerModalOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r from-indigo-900/90 to-purple-900/90 text-amber-300 border border-indigo-500/40 hover:border-amber-400 shadow cursor-pointer transition-all active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Contrôle d'Accès QR</span>
            </button>
          </div>

          {/* Language Switcher for Card Output */}
          <div className="flex items-center gap-1 p-1 bg-stone-900 border border-amber-400/40 rounded-xl">
            <span className="text-[11px] font-bold text-amber-300 px-1 flex items-center gap-1">
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Format de carte :</span>
            </span>
            
            <button
              type="button"
              onClick={() => setCardLanguage('ar')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold font-arabic transition-all cursor-pointer flex items-center gap-1 ${
                cardLanguage === 'ar'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm ring-1 ring-emerald-400'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <span>🌟 النسخة العربية</span>
            </button>

            <button
              type="button"
              onClick={() => setCardLanguage('bilingual')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                cardLanguage === 'bilingual'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-sm ring-1 ring-amber-300'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <span>📜 Modèle Bilingue (AR/FR)</span>
            </button>

            <button
              type="button"
              onClick={() => setCardLanguage('fr')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                cardLanguage === 'fr'
                  ? 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-sm ring-1 ring-blue-400'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <span>🇫🇷 Français</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: FORM TO CREATE / EDIT INVITATION */}
          {activeTab === 'create' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <span>❖</span>
                      <span>Informations du Participant • بيانات المشارك</span>
                    </h3>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      {currentForm.invitationCode}
                    </span>
                  </div>

                  {/* DUAL NAME INPUT: ARABIC & FRENCH */}
                  <div className="space-y-3 p-3.5 rounded-2xl bg-stone-900/90 border border-amber-400/40 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Languages className="w-3.5 h-3.5 text-amber-400" />
                        <span>Nom du Participant (Arabe & Français)</span>
                      </span>
                      <span className="text-[10px] text-emerald-300 font-arabic">الاسم للنسختين العربية والفرنسية</span>
                    </div>

                    {/* 1. Arabic Name Field */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-200 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">AR</span>
                          <span>الاسم الكامل باللغة العربية (للنسخة العربية) :</span>
                        </span>
                        <span dir="rtl" className="text-amber-300 text-[11px] font-arabic font-bold">اسم المدعو بالعربية</span>
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        placeholder="مثال: محمد الأمين ولد الشيخ / مريم بنت المختار"
                        value={currentForm.recipientNameAr || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentForm((prev) => ({
                            ...prev,
                            recipientNameAr: val,
                            recipientName: val || prev.recipientNameFr || '',
                          }));
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-emerald-500/50 text-amber-200 placeholder-stone-600 focus:outline-hidden focus:border-amber-400 text-sm font-arabic font-bold text-right"
                      />
                    </div>

                    {/* 2. French Name Field */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-200 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-500/40 text-[10px] font-bold">FR</span>
                          <span>Nom & Prénom en Français (pour version FR & Bilingue) :</span>
                        </span>
                        <span className="text-stone-400 text-[10px]">Caractères latins</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Mohamed Lemine Ould Cheikh / Mariem Mint El Moctar"
                        value={currentForm.recipientNameFr || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentForm((prev) => ({
                            ...prev,
                            recipientNameFr: val,
                            recipientName: prev.recipientNameAr || val,
                          }));
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-blue-500/50 text-white placeholder-stone-600 focus:outline-hidden focus:border-amber-400 text-sm font-semibold"
                      />
                    </div>
                  </div>

                  {/* Honorific Presets */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      Titre / Formule de politesse (FR & AR) :
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                      <button
                        type="button"
                        onClick={() => handleSelectHonorific('M./Mme', 'السيد(ة) الفاضل(ة)')}
                        className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                          currentForm.recipientHonorificFr === 'M./Mme'
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                            : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        M./Mme • السيد(ة)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectHonorific('M. le Notable & Invité d’Honneur', 'السيد الفاضل والوجيه')}
                        className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                          currentForm.recipientHonorificFr === 'M. le Notable & Invité d’Honneur'
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                            : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        Notable • الوجيه
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectHonorific('Dr / Cher Représentant', 'الدكتور / الممثل المحترم')}
                        className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                          currentForm.recipientHonorificFr.includes('Dr')
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                            : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        Docteur • الدكتور
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectHonorific('Cher Frère / Sœur', 'الأخ(ت) الكريم(ة)')}
                        className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                          currentForm.recipientHonorificFr === 'Cher Frère / Sœur'
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                            : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        Frère/Sœur • الأخ(ت)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectHonorific('Cher Sportif / Champion', 'البطل والرياضي الكريم')}
                        className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                          currentForm.recipientHonorificFr.includes('Sportif')
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                            : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        Sportif • الرياضي
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectHonorific('Membre & Bénévole Dévoué(e)', 'العضو والمتطوع المتميز')}
                        className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                          currentForm.recipientHonorificFr.includes('Bénévole')
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                            : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        Bénévole • المتطوع
                      </button>
                    </div>
                  </div>

                  {/* International Phone Number Input with Mauritania Validation */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        Numéro WhatsApp (Indicatif Mauritanie +222) :
                      </span>
                      <span dir="rtl" className="text-emerald-400 text-[11px] font-arabic">رقم الواتساب مع الرمز الدولي</span>
                    </label>

                    <div className="relative flex items-center">
                      <div className="absolute left-3 flex items-center gap-1 text-xs text-amber-300 font-bold pointer-events-none">
                        <span>🇲🇷 +222</span>
                      </div>

                      <input
                        type="tel"
                        placeholder="46 12 34 56 (ou 22246...)"
                        value={currentForm.whatsappPhone}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentForm({ ...currentForm, whatsappPhone: val });
                        }}
                        className={`w-full pl-20 pr-3 py-2.5 rounded-xl bg-stone-900 border text-white placeholder-stone-500 focus:outline-hidden text-sm font-mono transition-colors ${
                          phoneValidation.isValid
                            ? 'border-emerald-500/80 focus:border-emerald-400'
                            : 'border-stone-700 focus:border-amber-400'
                        }`}
                      />
                    </div>

                    {/* Live validation feedback */}
                    <div className="mt-1.5 flex items-center justify-between text-[11px]">
                      {phoneValidation.isValid ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{phoneValidation.hint}</span>
                          <span className="font-mono text-[10px] text-stone-400">({phoneValidation.formatted})</span>
                        </span>
                      ) : (
                        <span className="text-amber-400/90 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{phoneValidation.hint || 'Format recommandé : 8 chiffres (ex: 46 12 34 56)'}</span>
                        </span>
                      )}
                      
                      <span className="text-[10px] text-stone-400 font-arabic" dir="rtl">
                        موريتيل / ماتال / شنقيتل
                      </span>
                    </div>
                  </div>

                  {/* Category & Pass Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Catégorie / الفئة :
                      </label>
                      <select
                        value={currentForm.category}
                        onChange={(e) => {
                          const cat = e.target.value as InvitationCategory;
                          setCurrentForm({ ...currentForm, category: cat });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs font-medium focus:outline-hidden focus:border-amber-400"
                      >
                        <option value="vip">🌟 VIP / ضيف شرف</option>
                        <option value="guest">✉️ Invité Spécial / ضيف خاص</option>
                        <option value="resident">🏡 Habitant / ساكن القرية</option>
                        <option value="volunteer">🤝 Bénévole / متطوع</option>
                        <option value="youth">⚽ Jeunesse & Sport / شباب ورياضة</option>
                        <option value="partner">🤝 Partenaire / شريك وداعم</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center justify-between">
                        <span>Code d'accès unique :</span>
                        <button
                          type="button"
                          onClick={handleGenerateNewCode}
                          className="text-[10px] text-amber-300 hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <RefreshCw className="w-2.5 h-2.5" /> Régénérer
                        </button>
                      </label>
                      <input
                        type="text"
                        value={currentForm.invitationCode}
                        onChange={(e) => setCurrentForm({ ...currentForm, invitationCode: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-amber-300 text-xs font-mono font-bold focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Seat / Zone / Table */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Zone / Tribune réservée :
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: المنصة الشرفية / Tribune d'Honneur, Zone A"
                      value={currentForm.seatZone || ''}
                      onChange={(e) => setCurrentForm({ ...currentForm, seatZone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('preview')}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Aperçu & Envoyer comme Pièce Jointe</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveAndNew}
                      className="py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Enregistrer</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Mini Preview */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Aperçu instantané</span>
                  </span>
                  <span className="text-xs text-amber-300 font-bold">
                    {cardLanguage === 'ar' ? '🌟 النسخة العربية' : cardLanguage === 'bilingual' ? '📜 Modèle Bilingue' : '🇫🇷 Version Française'}
                  </span>
                </div>

                <div className="w-full max-h-[500px] overflow-y-auto rounded-2xl bg-stone-950 p-2 border border-stone-800 shadow-inner">
                  <InvitationCard
                    data={currentForm}
                    cardElementId="festival-invitation-card-preview-mini"
                    cardLanguage={cardLanguage}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FULL PREVIEW & SENDING DISPATCH */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              
              {/* Visual Format Mode Selector (Affiche Complète vs Carte VIP) */}
              <div className="p-3 rounded-2xl bg-stone-950/90 border border-amber-400/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Format à Exporter / Envoyer :
                  </span>
                </div>
                <div className="flex items-center p-1 rounded-xl bg-stone-900 border border-stone-800 text-xs w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setVisualFormat('poster_personalized')}
                    className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      visualFormat === 'poster_personalized'
                        ? 'bg-amber-400 text-stone-950 shadow-md'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>🖼️ Affiche Complète (Grand Format A4)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisualFormat('card_vip')}
                    className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      visualFormat === 'card_vip'
                        ? 'bg-amber-400 text-stone-950 shadow-md'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>🎫 Carte Pass VIP (Badge)</span>
                  </button>
                </div>
              </div>

              {/* Sending Controls Toolbar (WhatsApp Direct Dispatch & PDF Grand Format) */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-2 border-emerald-400/60 flex flex-col gap-4 shadow-2xl">
                
                {/* Recipient & Destination Phone Banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-500/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-400 text-stone-950 font-bold shadow-md">
                      <Paperclip className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm sm:text-base font-extrabold text-white">
                          {visualFormat === 'poster_personalized' ? "Expédition de l'Affiche Officielle Complète" : "Expédition de la Carte d'Invitation VIP"}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black">
                          {visualFormat === 'poster_personalized' ? 'GRAND FORMAT AFFICHE 300 DPI' : 'FORMAT CARTE PASS & QR CODE'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 mt-0.5">
                        Destinataire : <span className="font-bold text-amber-300">{currentForm.recipientNameAr || currentForm.recipientNameFr || currentForm.recipientName || 'Invité'}</span> {currentForm.recipientNameFr && currentForm.recipientNameAr && <span className="text-stone-400">({currentForm.recipientNameFr})</span>}
                      </p>
                    </div>
                  </div>

                  {/* Destination Phone Badge */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-950/80 border border-emerald-400/50">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-stone-300 font-medium">N° WhatsApp :</span>
                    <span className="text-xs font-mono font-bold text-emerald-300">
                      {phoneValidation.isValid ? `🇲🇷 ${phoneValidation.formatted}` : (currentForm.whatsappPhone || 'Non configuré')}
                    </span>
                  </div>
                </div>

                {/* Main Action Bar: WhatsApp Direct Send & PDF Grand Format */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  
                  {/* Left: 1-Click WhatsApp Direct Send */}
                  <div className="md:col-span-7">
                    <button
                      onClick={handleSendWhatsAppAsAttachment}
                      disabled={isExporting}
                      className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/80 transition-all cursor-pointer active:scale-95"
                    >
                      <Paperclip className="w-6 h-6 text-emerald-950 shrink-0" />
                      <div className="text-left leading-tight">
                        <span className="block text-sm sm:text-base font-black">
                          {isExporting
                            ? 'Génération en cours...'
                            : visualFormat === 'poster_personalized'
                            ? `🚀 Envoyer l'Affiche du Festival sur WhatsApp`
                            : `🎫 Envoyer la Carte d'Invitation sur WhatsApp`}
                        </span>
                        <span dir="rtl" className="block text-xs font-arabic font-bold text-emerald-950">
                          {visualFormat === 'poster_personalized'
                            ? `إرسال الملصق الرسمي الكامل للمهرجان إلى الواتساب (${phoneValidation.isValid ? phoneValidation.formatted : currentForm.whatsappPhone})`
                            : `إرسال بطاقة الدعوة الرسمية إلى الواتساب (${phoneValidation.isValid ? phoneValidation.formatted : currentForm.whatsappPhone})`}
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Right: PDF Grand Format Selector & Download */}
                  <div className="md:col-span-5 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[11px] text-stone-300">
                      <span className="font-bold flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-red-400" />
                        <span>Format PDF :</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setPdfPaperSize('a4')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            pdfPaperSize === 'a4' ? 'bg-red-600 text-white shadow' : 'bg-stone-800 text-stone-300'
                          }`}
                        >
                          A4 (Grand Format)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPdfPaperSize('a3')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            pdfPaperSize === 'a3' ? 'bg-red-600 text-white shadow' : 'bg-stone-800 text-stone-300'
                          }`}
                        >
                          A3 (Géant)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPdfPaperSize('a5')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            pdfPaperSize === 'a5' ? 'bg-red-600 text-white shadow' : 'bg-stone-800 text-stone-300'
                          }`}
                        >
                          A5 (Carte)
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleExportPdf(pdfPaperSize)}
                      disabled={isPdfExporting}
                      className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
                    >
                      <Download className="w-4 h-4 text-amber-300" />
                      <span>
                        {isPdfExporting
                          ? 'Génération PDF...'
                          : visualFormat === 'poster_personalized'
                          ? `Télécharger l'Affiche en PDF (${pdfPaperSize.toUpperCase()} 300 DPI)`
                          : `Télécharger la Carte en PDF (${pdfPaperSize.toUpperCase()})`}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Secondary Actions Row (PNG HD, Clipboard Copy, Print, Text) */}
                <div className="pt-3 border-t border-emerald-500/30 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Copy image to clipboard */}
                    <button
                      onClick={handleCopyImageToClipboard}
                      disabled={isExporting}
                      className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 border border-stone-700 transition-all cursor-pointer"
                      title="Copier l'image pour la coller directement dans WhatsApp"
                    >
                      {copiedImage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedImage ? 'Copié !' : 'Copier l\'image (Ctrl+V)'}</span>
                    </button>

                    {/* Download HD PNG */}
                    <button
                      onClick={handleDownloadCardImage}
                      disabled={isExporting}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{visualFormat === 'poster_personalized' ? "Télécharger l'Affiche PNG HD (4K)" : "Télécharger la Carte PNG HD"}</span>
                    </button>

                    {/* Print */}
                    <button
                      onClick={handlePrintCard}
                      className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 border border-stone-700 transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimer</span>
                    </button>
                  </div>

                  {/* Optional Text Accompaniment */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSendWhatsAppTextMessage}
                      className="px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-emerald-300 text-xs font-medium flex items-center gap-1.5 border border-emerald-500/30 transition-all cursor-pointer"
                      title="Envoyer également un message texte d'accompagnement"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Envoyer texte descriptif</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Message / Notification */}
              {exportSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-400 text-emerald-200 text-xs flex items-center gap-2.5 shadow-md">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{exportSuccess}</span>
                </div>
              )}

              {/* Guidance Info Box */}
              {showAttachmentGuidance && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 to-stone-900 border border-amber-400/40 text-stone-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <Info className="w-4 h-4" />
                    <span>Comment joindre le document dans WhatsApp :</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-300">
                    <li><strong className="text-white">Sur Téléphone (Mobile) :</strong> Le panneau de partage natif s'est ouvert pour envoyer l'affiche ou la carte directement à votre contact WhatsApp.</li>
                    <li><strong className="text-white">Sur Ordinateur (WhatsApp Web) :</strong> L'image a été copiée et téléchargée. Cliquez dans la zone de texte de la discussion WhatsApp et appuyez sur <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">Ctrl + V</kbd> (ou cliquez sur le trombone 📎 &gt; Photo) pour envoyer l'affiche en pièce jointe.</li>
                  </ul>
                </div>
              )}

              {/* Exact Display Container based on selected Visual Format */}
              <div className="w-full flex flex-col items-center bg-stone-950/90 p-2 sm:p-5 rounded-3xl border border-stone-800">
                <div className="mb-2 text-xs font-bold text-amber-300 flex items-center gap-2">
                  <span>❖</span>
                  <span>
                    {visualFormat === 'poster_personalized'
                      ? "Aperçu : AFFICHE OFFICIELLE DU FESTIVAL (Grand Format A4 avec Dédicace Nominative)"
                      : `Aperçu : CARTE PASS D'INVITATION VIP (${cardLanguage === 'ar' ? 'النسخة العربية' : cardLanguage === 'bilingual' ? 'Modèle Bilingue' : 'Version Française'})`}
                  </span>
                  <span>❖</span>
                </div>

                {visualFormat === 'poster_personalized' ? (
                  <PersonalizedFestivalPoster
                    data={currentForm}
                    elementId="festival-personalized-poster-canvas"
                    langMode={cardLanguage === 'ar' ? 'ar-focus' : cardLanguage === 'fr' ? 'fr-focus' : 'bilingual'}
                  />
                ) : (
                  <InvitationCard
                    data={currentForm}
                    cardElementId="festival-invitation-card-canvas"
                    cardLanguage={cardLanguage}
                  />
                )}
              </div>
            </div>
          )}

          {/* TAB 3: INVITATIONS DIRECTORY / LIST */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              
              {/* Search & Actions Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-stone-950/60 border border-stone-800">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    placeholder="Rechercher un invité, nom arabe/FR, code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      const rand = Math.floor(1000 + Math.random() * 9000);
                      setCurrentForm({
                        id: 'inv-' + Date.now(),
                        recipientName: '',
                        recipientNameAr: '',
                        recipientNameFr: '',
                        recipientHonorificFr: 'M./Mme',
                        recipientHonorificAr: 'السيد(ة) الفاضل(ة)',
                        whatsappPhone: '222',
                        category: 'guest',
                        seatZone: 'المنصة الرئيسية / Entrée Principale',
                        invitationCode: `HB26-INV-${rand}`,
                        createdAt: new Date().toISOString(),
                      });
                      setActiveTab('create');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Créer une nouvelle carte</span>
                  </button>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredInvitations.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleLoadInvitation(item)}
                    className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 hover:border-amber-400/80 hover:bg-stone-900/90 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30">
                          <QrCode className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                              {item.recipientNameAr || item.recipientNameFr || item.recipientName || 'Invité sans nom'}
                            </h5>
                            {item.checkedIn && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Validé
                              </span>
                            )}
                          </div>
                          {item.recipientNameFr && item.recipientNameAr && (
                            <p className="text-[11px] font-semibold text-emerald-300/90">
                              {item.recipientNameFr}
                            </p>
                          )}
                          <p className="text-[11px] text-stone-400">
                            {item.recipientHonorificFr} • <span dir="rtl" className="font-arabic text-amber-200">{item.recipientHonorificAr}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-800 text-emerald-400 border border-stone-700">
                          {item.invitationCode}
                        </span>
                        <button
                          onClick={(e) => handleDeleteInvitation(item.id, e)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-stone-800 transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between text-xs">
                      <span className="text-stone-400 flex items-center gap-1 font-mono text-[11px]">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        +{item.whatsappPhone}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-amber-400 uppercase font-bold">
                          {item.category}
                        </span>
                        <span className="text-xs text-stone-500 group-hover:text-amber-300 group-hover:translate-x-1 transition-all">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredInvitations.length === 0 && (
                  <div className="col-span-2 p-8 text-center rounded-2xl bg-stone-950 border border-dashed border-stone-800 text-stone-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-stone-600" />
                    <p className="text-xs font-semibold">Aucune invitation trouvée.</p>
                    <p className="text-[11px] text-stone-500 mt-1">Créez votre première carte d'invitation avec le bouton ci-dessus.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: RECHARTS STATS DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              <InvitationStatsDashboard
                invitations={invitations}
                isCloudConnected={isCloudConnected}
              />
            </div>
          )}

        </div>
      </div>

      {/* QR Code Pass Access Control Modal */}
      <QrPassValidatorModal
        isOpen={isQrScannerModalOpen}
        onClose={() => setIsQrScannerModalOpen(false)}
        invitations={invitations}
        onCheckIn={checkInInvitation}
        isCloudConnected={isCloudConnected}
      />
    </div>
  );
};
