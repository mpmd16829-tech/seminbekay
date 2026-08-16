import React, { useState, useEffect } from 'react';
import { InvitationCard, InvitationCardLanguage } from './InvitationCard';
import { InvitationCardData, InvitationCategory } from '../types';
import { generateWhatsAppInvitationMessage } from '../data/festivalData';
import { useCloudInvitations } from '../lib/firestoreService';
import { toPng, toBlob } from 'html-to-image';
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
  CloudCheck,
  CloudOff,
  Database
} from 'lucide-react';

interface InvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_INVITATIONS: InvitationCardData[] = [
  {
    id: 'inv-sample-1',
    recipientName: 'محمد الأمين ولد الشيخ',
    recipientHonorificFr: 'M. le Notable & Invité d’Honneur',
    recipientHonorificAr: 'السيد الفاضل والوجيه',
    whatsappPhone: '22246000000',
    category: 'vip',
    seatZone: 'المنصة الشرفية (Tribune A1)',
    invitationCode: 'HB26-VIP-101',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inv-sample-2',
    recipientName: 'Mariem Mint El Moctar',
    recipientHonorificFr: 'Chère Représentante Associative',
    recipientHonorificAr: 'الأخت الفاضلة والفاعلة الجمعوية',
    whatsappPhone: '22236000000',
    category: 'guest',
    seatZone: 'Zone Invités B4',
    invitationCode: 'HB26-INV-204',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inv-sample-3',
    recipientName: 'أحمد ولد بابانه',
    recipientHonorificFr: 'Cher Capitaine & Sportif',
    recipientHonorificAr: 'الشاب الرياضي وقائد الفريق',
    whatsappPhone: '22222000000',
    category: 'youth',
    seatZone: 'Espace Jeunesse & Équipes',
    invitationCode: 'HB26-YTH-309',
    createdAt: new Date().toISOString(),
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
    removeInvitation,
    isCloudConnected,
    loading: isCloudLoading
  } = useCloudInvitations(getInitialList());

  const [currentForm, setCurrentForm] = useState<InvitationCardData>({
    id: 'inv-' + Date.now(),
    recipientName: '',
    recipientHonorificFr: 'M./Mme',
    recipientHonorificAr: 'السيد(ة) الفاضل(ة)',
    whatsappPhone: '222',
    category: 'guest',
    seatZone: 'المنصة الرئيسية / Entrée Principale',
    invitationCode: `HB26-INV-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  });

  const [cardLanguage, setCardLanguage] = useState<InvitationCardLanguage>('ar');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'preview' | 'list'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [showAttachmentGuidance, setShowAttachmentGuidance] = useState(false);

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
    if (!currentForm.recipientName.trim()) {
      alert('Veuillez renseigner le nom du participant / يرجى إدخال اسم المدعو');
      return;
    }

    await saveInvitation(currentForm);

    // Reset form for next participant
    const nextRand = Math.floor(1000 + Math.random() * 9000);
    setCurrentForm({
      id: 'inv-' + Date.now(),
      recipientName: '',
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
    setCurrentForm(item);
    setActiveTab('preview');
  };

  const handleDeleteInvitation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Voulez-vous supprimer cette invitation de la liste et du Cloud Firebase ? / هل تريد حذف هذه الدعوة؟')) {
      await removeInvitation(id);
    }
  };

  // Helper to generate Image Blob
  const getCardImageBlob = async (targetId: string = 'festival-invitation-card-canvas'): Promise<{ blob: Blob; dataUrl: string } | null> => {
    const el = document.getElementById(targetId) || document.getElementById('festival-invitation-card-preview-mini');
    if (!el) return null;

    try {
      const dataUrl = await toPng(el, {
        quality: 0.98,
        pixelRatio: 2.5, // High resolution for mobile screen & printing
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

  // SEND AS WHATSAPP ATTACHMENT (Image File Attachment)
  const handleSendWhatsAppAsAttachment = async () => {
    try {
      setIsExporting(true);
      const cleanPhone = currentForm.whatsappPhone.replace(/[^0-9]/g, '');
      const sanitizedName = (currentForm.recipientName || 'Invite')
        .replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_');
      const filename = `Carte_Invitation_${sanitizedName}_${cardLanguage}_${currentForm.invitationCode}.png`;

      const result = await getCardImageBlob('festival-invitation-card-canvas');
      if (!result) {
        alert('Impossible de capturer l\'image de la carte. Veuillez réessayer.');
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
            title: `بطاقة دعوة - ${currentForm.recipientName || 'أسبوع أحسي البكاي'}`,
            text: `بطاقة الدعوة الرسمية وتصريح الدخول للمهرجان الثقافي والرياضي بأحسي البكاي 2026 (الرمز: ${currentForm.invitationCode})`,
            files: [file],
          });
          setExportSuccess('Image de la carte partagée avec succès en pièce jointe !');
          setTimeout(() => setExportSuccess(null), 5000);
          setIsExporting(false);
          return;
        } catch (shareErr) {
          // If user cancelled or error occurred, proceed to fallback
          console.log('Share dismissed or fallback:', shareErr);
        }
      }

      // Universal Web Fallback (Desktop WhatsApp Web / Mobile Fallback):
      // 1. Copy image directly to clipboard so user can press Ctrl+V in WhatsApp chat
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

      // 2. Automatically download the high-res PNG image
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();

      // 3. Open WhatsApp chat with the target phone
      const whatsappUrl = cleanPhone && cleanPhone.length > 5
        ? `https://api.whatsapp.com/send?phone=${cleanPhone}`
        : `https://api.whatsapp.com/send`;

      window.open(whatsappUrl, '_blank');

      // 4. Show helpful guidance modal/toast
      setShowAttachmentGuidance(true);
      setExportSuccess(
        copiedToClipboard
          ? 'Image copiée dans le presse-papier et téléchargée ! Collez-la (Ctrl + V) dans WhatsApp.'
          : 'Image HD téléchargée ! Joignez-la via le bouton trombone 📎 dans WhatsApp.'
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
      const result = await getCardImageBlob('festival-invitation-card-canvas');
      if (!result) return;

      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': result.blob }),
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 4000);
      } else {
        // Fallback download
        const link = document.createElement('a');
        link.download = `Carte_Invitation_${currentForm.invitationCode}.png`;
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
    const result = await getCardImageBlob('festival-invitation-card-canvas');
    if (!result) return;

    try {
      setIsExporting(true);
      const sanitizedName = (currentForm.recipientName || 'Participant')
        .replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_');

      const link = document.createElement('a');
      link.download = `Carte_Invitation_${sanitizedName}_${cardLanguage}_${currentForm.invitationCode}.png`;
      link.href = result.dataUrl;
      link.click();
      setExportSuccess('Image PNG HD téléchargée avec succès !');
      setTimeout(() => setExportSuccess(null), 4000);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Optional: Send Text Message (Accompaniment)
  const handleSendWhatsAppTextMessage = () => {
    const cleanPhone = currentForm.whatsappPhone.replace(/[^0-9]/g, '');
    const message = generateWhatsAppInvitationMessage(
      currentForm.recipientName || 'Invité d’Honneur / ضيف كريم',
      currentForm.recipientHonorificFr,
      currentForm.recipientHonorificAr,
      currentForm.invitationCode,
      currentForm.category
    );

    const encoded = encodeURIComponent(message);
    const url = cleanPhone && cleanPhone.length > 5
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;

    window.open(url, '_blank');
  };

  // Copy WhatsApp Text to Clipboard
  const handleCopyTextMessage = async () => {
    const message = generateWhatsAppInvitationMessage(
      currentForm.recipientName || 'Invité d’Honneur / ضيف كريم',
      currentForm.recipientHonorificFr,
      currentForm.recipientHonorificAr,
      currentForm.invitationCode,
      currentForm.category
    );

    try {
      await navigator.clipboard.writeText(message);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
    } catch {
      // fallback
    }
  };

  // Print Card
  const handlePrintCard = () => {
    window.print();
  };

  const filteredInvitations = invitations.filter((inv) =>
    inv.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.invitationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.whatsappPhone.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-stone-900 border-2 border-amber-400/60 rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-b border-amber-400/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-amber-400 text-stone-950 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Générateur de Cartes d'Invitation (Arabe • Bilingue • Français)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold flex items-center gap-1">
                  <Paperclip className="w-3 h-3" />
                  Pièce Jointe WhatsApp
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                  isCloudConnected
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                }`}>
                  <Cloud className="w-3 h-3 text-emerald-400" />
                  <span>{isCloudConnected ? 'Cloud Firebase Connecté ☁️' : 'Mode Local / Synchronisation...'}</span>
                </span>
              </div>
              <p dir="rtl" className="text-xs text-amber-300 font-arabic mt-0.5">
                توليد بطاقة الدعوة الرسمية وتخزينها سحابيًا مع إرسالها كصورة مرفقة عبر الواتساب
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
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>1. Personnaliser</span>
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
              <span>2. Aperçu & Envoi Image WhatsApp</span>
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

                  {/* Recipient Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center justify-between">
                      <span>Nom et Prénom du Participant :</span>
                      <span dir="rtl" className="text-amber-300 text-[11px] font-arabic">اسم ولقب المدعو</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: محمد الأمين ولد الشيخ / Mohamed Lemine"
                      value={currentForm.recipientName}
                      onChange={(e) => setCurrentForm({ ...currentForm, recipientName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white placeholder-stone-500 focus:outline-hidden focus:border-amber-400 text-sm font-semibold"
                    />
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
                        className={`p-1.5 rounded-lg border text-center transition-all ${
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
                        className={`p-1.5 rounded-lg border text-center transition-all ${
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
                        className={`p-1.5 rounded-lg border text-center transition-all ${
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
                        className={`p-1.5 rounded-lg border text-center transition-all ${
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
                        className={`p-1.5 rounded-lg border text-center transition-all ${
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
                        className={`p-1.5 rounded-lg border text-center transition-all ${
                          currentForm.recipientHonorificFr.includes('Bénévole')
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                            : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        Bénévole • المتطوع
                      </button>
                    </div>
                  </div>

                  {/* WhatsApp Phone Number */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center justify-between">
                      <span>Numéro WhatsApp du destinataire :</span>
                      <span dir="rtl" className="text-emerald-400 text-[11px] font-arabic">رقم الواتساب مع الرمز الدولي</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        placeholder="Ex: 22246123456 ou 22236..."
                        value={currentForm.whatsappPhone}
                        onChange={(e) => setCurrentForm({ ...currentForm, whatsappPhone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white placeholder-stone-500 focus:outline-hidden focus:border-emerald-400 text-sm font-mono"
                      />
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1">
                      💡 Indicatif mauritanien par défaut : <span className="text-amber-300 font-bold">222</span> (ex : 22246XXXXXX ou 22236XXXXXX).
                    </p>
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
              
              {/* Sending Controls Toolbar (WhatsApp Attachment Centric) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-2 border-emerald-400/60 flex flex-col gap-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-500 text-stone-950 font-bold shadow-md">
                      <Paperclip className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-extrabold text-white">
                          Envoi de la Carte d'Invitation en Pièce Jointe WhatsApp
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-extrabold">
                          FORMAT IMAGE HD
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 mt-0.5">
                        Destinataire : <span className="font-bold text-amber-300">{currentForm.recipientName || 'Invité'}</span> • WhatsApp : <span className="font-mono text-emerald-400 font-bold">{currentForm.whatsappPhone || 'Non spécifié'}</span> • Code : <span className="font-mono text-amber-300">{currentForm.invitationCode}</span>
                      </p>
                    </div>
                  </div>

                  {/* Big Primary Action: Send as Attachment */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleSendWhatsAppAsAttachment}
                      disabled={isExporting}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2.5 shadow-lg shadow-emerald-950/60 transition-all cursor-pointer active:scale-95 animate-pulse"
                    >
                      <Paperclip className="w-5 h-5 text-emerald-950" />
                      <div className="text-left leading-tight">
                        <span className="block">Envoyer la Carte sur WhatsApp (Pièce Jointe)</span>
                        <span dir="rtl" className="block text-[11px] font-arabic font-bold text-emerald-950">إرسال البطاقة كصورة مرفقة عبر واتساب</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Secondary Actions Row */}
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
                      <span>{copiedImage ? 'Image Copiée !' : 'Copier l\'image (Presse-papier)'}</span>
                    </button>

                    {/* Download HD PNG */}
                    <button
                      onClick={handleDownloadCardImage}
                      disabled={isExporting}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger l'image HD</span>
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
                      <span>Envoyer texte descriptif (Optionnel)</span>
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
                    <span>Comment joindre la carte d'invitation dans WhatsApp :</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-300">
                    <li><strong className="text-white">Sur Téléphone (Mobile) :</strong> Le panneau de partage natif s'est ouvert pour envoyer l'image directement à votre contact WhatsApp.</li>
                    <li><strong className="text-white">Sur Ordinateur (WhatsApp Web) :</strong> L'image a été copiée et téléchargée. Cliquez dans la zone de texte de la discussion WhatsApp et appuyez sur <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">Ctrl + V</kbd> (ou cliquez sur le trombone 📎 &gt; Photo) pour envoyer l'image en pièce jointe.</li>
                  </ul>
                </div>
              )}

              {/* Exact Card Display matching the selected language */}
              <div className="w-full flex flex-col items-center bg-stone-950/90 p-2 sm:p-5 rounded-3xl border border-stone-800">
                <div className="mb-2 text-xs font-bold text-amber-300 flex items-center gap-2">
                  <span>❖</span>
                  <span>
                    Affichage actif : {cardLanguage === 'ar' ? 'بطاقة الدعوة باللغة العربية (النسخة العربية)' : cardLanguage === 'bilingual' ? 'Modèle Bilingue Officiel (Arabe & Français)' : 'Carte d\'Invitation en Français'}
                  </span>
                  <span>❖</span>
                </div>
                <InvitationCard
                  data={currentForm}
                  cardElementId="festival-invitation-card-canvas"
                  cardLanguage={cardLanguage}
                />
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
                    placeholder="Rechercher un invité, code, numéro..."
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
                          <h5 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                            {item.recipientName || 'Invité sans nom'}
                          </h5>
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
                          className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-stone-800 transition-colors"
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

        </div>
      </div>
    </div>
  );
};

