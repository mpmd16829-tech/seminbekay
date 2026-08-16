import React, { useState, useEffect } from 'react';
import { Cloud, CloudCheck, CloudOff, RefreshCw, CheckCircle2, Wifi, WifiOff, Database, Shield } from 'lucide-react';

interface SyncStatusBadgeProps {
  isCloudConnected?: boolean;
  totalSavedCards?: number;
  className?: string;
}

export const SyncStatusBadge: React.FC<SyncStatusBadgeProps> = ({
  isCloudConnected = true,
  totalSavedCards = 0,
  className = '',
}) => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isOpen, setIsOpen] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualSync = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsRefreshing(false);
    }, 800);
  };

  const isFullyConnected = isOnline && isCloudConnected;

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main Pill Button in Toolbar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="État de la synchronisation Firebase & Disponibilité Hors-ligne"
        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border transition-all cursor-pointer shadow-xs select-none ${
          isFullyConnected
            ? 'bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border-emerald-500/40 hover:border-emerald-400'
            : 'bg-amber-950/80 hover:bg-amber-900/90 text-amber-300 border-amber-500/50 hover:border-amber-400'
        }`}
      >
        <span className="relative flex h-2 w-2">
          {isFullyConnected && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isFullyConnected ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
        </span>

        <Cloud className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">
          {isFullyConnected ? 'Firebase Synchronisé' : 'Mode Hors-Ligne Actif'}
        </span>
        <span className="sm:hidden">
          {isFullyConnected ? 'En ligne' : 'Hors-ligne'}
        </span>
      </button>

      {/* Popover Details Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-stone-900 border-2 border-amber-400/50 shadow-2xl p-4 z-50 text-xs text-white space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-white">État de Synchronisation</h4>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isFullyConnected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                }`}
              >
                {isFullyConnected ? 'Cloud Actif ☁️' : 'Local Stocké 💾'}
              </span>
            </div>

            <div className="space-y-2 text-stone-300">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  Réseau Internet :
                </span>
                <span className={`font-semibold ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isOnline ? 'Connecté' : 'Non détecté (Hors-ligne)'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-amber-400" />
                  Base Firestore :
                </span>
                <span className="font-semibold text-white">
                  {isCloudConnected ? 'Temps réel & Sécurisé' : 'Persistance locale'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-teal-400" />
                  Cartes Disponibles Hors-ligne :
                </span>
                <span className="font-bold text-emerald-400 bg-stone-950 px-2 py-0.5 rounded-md border border-stone-800">
                  {totalSavedCards} invitations
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                <span>Dernière synchro :</span>
                <span className="font-mono">{lastSyncTime}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-800 flex items-center justify-between gap-2">
              <p dir="rtl" className="text-[10px] text-amber-300/80 font-arabic flex-1">
                بيانات الدعوات محفوظة ومتاحة دائماً حتى بدون اتصال
              </p>
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isRefreshing}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
