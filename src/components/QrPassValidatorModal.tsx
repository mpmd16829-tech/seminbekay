import React, { useState, useMemo } from 'react';
import { InvitationCardData } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import {
  QrCode,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  UserCheck,
  MapPin,
  Sparkles,
  RefreshCw,
  X,
  ShieldCheck,
  Check,
  Users,
  Camera,
  Calendar
} from 'lucide-react';

interface QrPassValidatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitations: InvitationCardData[];
  onCheckIn: (id: string, checkedIn: boolean) => Promise<void>;
  isCloudConnected: boolean;
}

export const QrPassValidatorModal: React.FC<QrPassValidatorModalProps> = ({
  isOpen,
  onClose,
  invitations,
  onCheckIn,
  isCloudConnected,
}) => {
  const [searchCode, setSearchCode] = useState('');
  const [validatedInvitation, setValidatedInvitation] = useState<InvitationCardData | null>(null);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'success' | 'already_checked' | 'not_found'>('idle');
  const [operatorName, setOperatorName] = useState('Comité d\'Organisation');
  const [activeFilter, setActiveFilter] = useState<'all' | 'checked' | 'pending'>('all');

  if (!isOpen) return null;

  // Function to search & evaluate code
  const handleValidateCode = (codeToTest?: string) => {
    const query = (codeToTest !== undefined ? codeToTest : searchCode).trim().toUpperCase();
    if (!query) return;

    // Handle parsed QR format e.g. FESTIVAL-2026|HB26-VIP-101|Name|Category
    let cleanCode = query;
    if (query.includes('|')) {
      const parts = query.split('|');
      cleanCode = parts[1] || query;
    }

    const found = invitations.find(
      (inv) =>
        inv.invitationCode.toUpperCase() === cleanCode ||
        inv.id.toUpperCase() === cleanCode ||
        inv.recipientName.toUpperCase().includes(cleanCode)
    );

    if (found) {
      setValidatedInvitation(found);
      if (found.checkedIn) {
        setValidationStatus('already_checked');
      } else {
        setValidationStatus('success');
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#005a2b', '#c99837', '#e6b94d', '#10b981'],
          });
        } catch {
          // ignore
        }
      }
    } else {
      setValidatedInvitation(null);
      setValidationStatus('not_found');
    }
  };

  const handleConfirmEntry = async (item: InvitationCardData) => {
    await onCheckIn(item.id, true);
    setValidatedInvitation({ ...item, checkedIn: true, checkedInAt: new Date().toISOString() });
    setValidationStatus('success');
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#005a2b', '#c99837', '#10b981'],
      });
    } catch {
      // ignore
    }
  };

  const handleCancelEntry = async (item: InvitationCardData) => {
    await onCheckIn(item.id, false);
    setValidatedInvitation({ ...item, checkedIn: false, checkedInAt: undefined });
    setValidationStatus('idle');
  };

  const filteredHistory = invitations.filter((inv) => {
    if (activeFilter === 'checked') return inv.checkedIn;
    if (activeFilter === 'pending') return !inv.checkedIn;
    return true;
  });

  const checkedCount = invitations.filter((i) => i.checkedIn).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 border-2 border-amber-400/60 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-b border-amber-400/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-400 text-stone-950 shadow-md">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Contrôle d'Accès & Validation QR Pass 2026
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                  Organisateurs
                </span>
              </div>
              <p dir="rtl" className="text-xs text-amber-300 font-arabic mt-0.5">
                مسح وقبول تصاريح الدخول وبطاقات الدعوة الرسمية للمهرجان
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

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Top Scan / Input Bar */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-amber-400/40 shadow-inner space-y-3">
            <label className="block text-xs font-bold text-amber-300 flex items-center justify-between">
              <span>Saisir ou scanner le code du Pass QR (ex: HB26-VIP-101 ou nom) :</span>
              <span dir="rtl" className="font-arabic text-stone-400">إدخال رمز البطاقة أو مسح QR</span>
            </label>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleValidateCode();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => {
                    setSearchCode(e.target.value);
                    if (e.target.value.includes('|')) {
                      handleValidateCode(e.target.value);
                    }
                  }}
                  placeholder="Ex: HB26-VIP-101, Mohamed, ou coller le texte scanné..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-white placeholder-stone-500 text-sm font-mono focus:border-amber-400 focus:outline-none"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer shrink-0 active:scale-95"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Vérifier le Pass</span>
              </button>
            </form>

            {/* Quick Helper presets */}
            <div className="flex items-center gap-2 pt-1 overflow-x-auto text-[11px] text-stone-400">
              <span className="shrink-0">Pass rapides pour tester :</span>
              {invitations.slice(0, 4).map((inv) => (
                <button
                  key={inv.id}
                  type="button"
                  onClick={() => {
                    setSearchCode(inv.invitationCode);
                    handleValidateCode(inv.invitationCode);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-300 font-mono text-[10px] shrink-0 cursor-pointer"
                >
                  {inv.invitationCode} ({inv.recipientName.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>

          {/* Validation Result Box */}
          {validationStatus !== 'idle' && (
            <div className="animate-fadeIn">
              {validationStatus === 'not_found' && (
                <div className="p-5 rounded-2xl bg-red-950/80 border-2 border-red-500/60 text-white flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-red-900/90 text-red-300 shrink-0">
                    <XCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-red-200">
                      Pass Non Trouvé / رمز غير موجود
                    </h3>
                    <p className="text-xs text-red-300 mt-1">
                      Le code « {searchCode} » ne correspond à aucune invitation enregistrée dans la base de données.
                    </p>
                  </div>
                </div>
              )}

              {validatedInvitation && (
                <div
                  className={`p-5 rounded-2xl border-2 shadow-lg transition-all ${
                    validatedInvitation.checkedIn
                      ? 'bg-emerald-950/90 border-emerald-500 text-white'
                      : 'bg-amber-950/80 border-amber-400 text-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: Holder details */}
                    <div className="flex items-start gap-3.5 flex-1">
                      <div className="p-3 rounded-2xl bg-stone-900 border border-amber-400/40 shrink-0">
                        <QRCodeSVG
                          value={`FESTIVAL-2026|${validatedInvitation.invitationCode}|${validatedInvitation.recipientName}|${validatedInvitation.category}`}
                          size={64}
                          bgColor="#1c1917"
                          fgColor="#fbbf24"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-stone-900 text-amber-300 border border-amber-400/40">
                            {validatedInvitation.invitationCode}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-900/90 text-emerald-200 border border-emerald-500/40">
                            {validatedInvitation.category.toUpperCase()}
                          </span>
                          {validatedInvitation.checkedIn ? (
                            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500 text-stone-950 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Entrée Validée
                            </span>
                          ) : (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              En Attente de Validation
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-black text-white">
                          {validatedInvitation.recipientName}
                        </h3>

                        <p className="text-xs text-stone-300 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span>{validatedInvitation.recipientHonorificFr}</span>
                          <span className="text-stone-500">•</span>
                          <span dir="rtl" className="font-arabic text-amber-300 font-bold">
                            {validatedInvitation.recipientHonorificAr}
                          </span>
                        </p>

                        <p className="text-xs text-stone-300 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Emplacement : <strong>{validatedInvitation.seatZone || 'Tribune Principale'}</strong></span>
                        </p>

                        {validatedInvitation.checkedIn && validatedInvitation.checkedInAt && (
                          <p className="text-[11px] text-emerald-300 flex items-center gap-1 pt-1">
                            <Clock className="w-3 h-3" />
                            <span>Validé à l'entrée le {new Date(validatedInvitation.checkedInAt).toLocaleTimeString()}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Validation Action */}
                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                      {!validatedInvitation.checkedIn ? (
                        <button
                          onClick={() => handleConfirmEntry(validatedInvitation)}
                          className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Autoriser l'Accès</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCancelEntry(validatedInvitation)}
                          className="w-full px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs text-stone-300 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Annuler la validation</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Real-time Validation History & Attendee Directory */}
          <div className="space-y-3 pt-2 border-t border-stone-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">
                  Registre des Entrées ({checkedCount} / {invitations.length} validés)
                </h4>
              </div>

              {/* Filter pills */}
              <div className="flex items-center p-1 rounded-xl bg-stone-950 border border-stone-800 text-xs">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    activeFilter === 'all' ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Tous ({invitations.length})
                </button>
                <button
                  onClick={() => setActiveFilter('checked')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    activeFilter === 'checked' ? 'bg-emerald-500 text-stone-950' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Validés ({checkedCount})
                </button>
                <button
                  onClick={() => setActiveFilter('pending')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    activeFilter === 'pending' ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  En Attente ({invitations.length - checkedCount})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSearchCode(item.invitationCode);
                    handleValidateCode(item.invitationCode);
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    item.checkedIn
                      ? 'bg-emerald-950/40 border-emerald-500/40 hover:border-emerald-400'
                      : 'bg-stone-950/70 border-stone-800 hover:border-amber-400/50'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-bold text-amber-300">
                        {item.invitationCode}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-900 text-stone-400 border border-stone-800">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white truncate mt-0.5">
                      {item.recipientName}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate">
                      {item.seatZone || 'Tribune Principale'}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {item.checkedIn ? (
                      <span className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400" title="Validé">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmEntry(item);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold cursor-pointer"
                      >
                        Valider
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
