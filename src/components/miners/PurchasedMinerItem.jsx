// --- START OF FILE PurchasedMinerItem.jsx ---

// RUTA: frontend/src/components/miners/PurchasedMinerItem.jsx (v10.0 - "QUANTUM LEAP": PANEL DE RENDIMIENTO ENRIQUECIDO)

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFactoryCycle } from '../../hooks/useFactoryCycle';
import { HiOutlineClock, HiOutlineCalendar, HiOutlineChartBar, HiOutlineStatusOnline } from 'react-icons/hi';

// Componente interno para los anillos de progreso
const CircularProgress = ({ progress, size = 50, strokeWidth = 4, colorClass, children }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle className="text-black/20" stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
        <circle className={colorClass} stroke="currentColor" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
};

const PurchasedMinerItem = ({ purchasedMiner, onClaim }) => {
  const { t } = useTranslation();
  if (!purchasedMiner || !purchasedMiner.miner) return null;
  
  const { miner, expiryDate, _id: purchasedMinerId, lastClaim, purchaseDate } = purchasedMiner;
  const { countdown, progress: cycleProgress, isClaimable } = useFactoryCycle(lastClaim);

  const { timeLeftText, lifetimeProgress, isExpired, statusText, statusColor } = useMemo(() => {
    const end = new Date(expiryDate).getTime();
    const start = new Date(purchaseDate).getTime();
    const now = Date.now();
    
    const totalDuration = end - start;
    const elapsed = Math.max(0, now - start);
    const progress = totalDuration > 0 ? Math.min(100, (elapsed / totalDuration) * 100) : 100;

    const remainingMs = Math.max(0, end - now);
    const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
    
    let text = t('time.days', '{{count}}d', { count: days });
    const expired = remainingMs === 0;
    if (expired) text = t('time.expired', 'Expirado');

    let sText = t('status.mining', 'Minando');
    let sColor = 'bg-status-success/10 text-status-success';
    if (expired) {
      sText = t('status.expired', 'Expirado');
      sColor = 'bg-status-danger/10 text-status-danger';
    } else if (isClaimable) {
      sText = t('status.readyToClaim', 'Listo para Reclamar');
      sColor = 'bg-accent/10 text-accent';
    }

    return { timeLeftText: text, lifetimeProgress: progress, isExpired: expired, statusText: sText, statusColor: sColor };
  }, [expiryDate, purchaseDate, t, isClaimable]);

  const lifetimeBarColor = useMemo(() => {
    if (lifetimeProgress < 75) return 'text-status-success';
    if (lifetimeProgress < 95) return 'text-status-warning';
    return 'text-status-danger';
  }, [lifetimeProgress]);

  // Placeholder para la producción total. Necesitará un campo `totalProduced` en el modelo del backend.
  const totalProduced = purchasedMiner.totalProduced || 0;

  return (
    <div className="bg-surface rounded-2xl p-4 border border-border flex flex-col gap-4 shadow-subtle">
      {/* --- SECCIÓN 1: Información Principal y Botón/Contador --- */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-14 h-14 bg-background-start rounded-lg flex items-center justify-center flex-shrink-0 border border-border">
            <img src={miner.imageUrl} alt={miner.name} className="w-12 h-12 object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-text-primary truncate">{miner.name}</h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${statusColor}`}>{statusText}</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          {isClaimable && !isExpired ? (
            <button onClick={() => onClaim(purchasedMinerId)} className="px-5 py-2 text-sm font-bold rounded-lg bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent-hover transform active:scale-95 transition-all">
              {t('purchasedMiner.claim', 'Reclamar')}
            </button>
          ) : !isExpired ? (
            <div className="bg-background-start text-text-primary font-mono text-md px-4 py-2 rounded-lg border border-border">
              <span>{countdown}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* --- SECCIÓN 2: Visualización de Progreso (Círculos) --- */}
      <div className="flex justify-around items-center pt-3 border-t border-border/50 text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-text-secondary">{t('purchasedMiner.claimCycle', 'Ciclo de Reclamo')}</span>
          <CircularProgress progress={cycleProgress} colorClass="text-accent">
            <HiOutlineClock className="w-5 h-5 text-accent" />
          </CircularProgress>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-text-secondary">{t('purchasedMiner.lifespan', 'Vida Útil Restante')}</span>
          <CircularProgress progress={100 - lifetimeProgress} colorClass={lifetimeBarColor}>
            <span className="font-bold text-sm">{timeLeftText}</span>
          </CircularProgress>
        </div>
      </div>
      
      {/* --- SECCIÓN 3: Estadísticas Adicionales --- */}
      <div className="bg-background-start rounded-lg p-3 space-y-2 text-sm border border-border/50">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2 text-text-secondary"><HiOutlineChartBar /> {t('purchasedMiner.totalProduction', 'Producción Total')}</span>
          <span className="font-bold text-text-primary">{totalProduced.toFixed(2)} USDT</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2 text-text-secondary"><HiOutlineCalendar /> {t('purchasedMiner.expiresOn', 'Expira el')}</span>
          <span className="font-mono text-text-primary">{new Date(expiryDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PurchasedMinerItem;

// --- END OF FILE PurchasedMinerItem.jsx ---