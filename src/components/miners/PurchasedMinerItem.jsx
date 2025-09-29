// --- START OF FILE PurchasedMinerItem.jsx ---

// RUTA: frontend/src/components/miners/PurchasedMinerItem.jsx (v9.0 - "QUANTUM LEAP": DISEÑO HÍBRIDO DEFINITIVO)

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFactoryCycle } from '../../hooks/useFactoryCycle';

// Componente interno para generar los anillos de progreso SVG
const CircularProgress = ({ progress, size = 40, strokeWidth = 3, colorClass, children }) => {
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
  
  if (!purchasedMiner || typeof purchasedMiner.miner !== 'object') return null;
  
  const { miner, expiryDate, _id: purchasedMinerId, lastClaim, purchaseDate } = purchasedMiner;
  const { countdown, progress: cycleProgress, isClaimable } = useFactoryCycle(lastClaim);

  // Lógica para calcular la vida útil restante y el progreso
  const { timeLeftText, lifetimeProgress } = useMemo(() => {
    const end = new Date(expiryDate).getTime();
    const start = new Date(purchaseDate).getTime();
    const now = Date.now();
    
    const totalDuration = end - start;
    const elapsed = Math.max(0, now - start);
    const progress = totalDuration > 0 ? Math.min(100, (elapsed / totalDuration) * 100) : 100;

    const remainingMs = Math.max(0, end - now);
    const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
    
    let text = t('time.days', '{{count}}d', { count: days });
    if (remainingMs === 0) text = t('time.expired', 'Expirado');

    return { timeLeftText: text, lifetimeProgress: progress };
  }, [expiryDate, purchaseDate, t]);

  const lifetimeBarColor = useMemo(() => {
    if (lifetimeProgress < 75) return 'text-status-success';
    if (lifetimeProgress < 95) return 'text-status-warning';
    return 'text-status-danger';
  }, [lifetimeProgress]);

  return (
    <div className="bg-surface rounded-2xl p-4 border border-border flex flex-col gap-3 shadow-subtle">
      {/* --- SECCIÓN 1: Información Principal y Botón --- */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-background-start rounded-lg flex items-center justify-center flex-shrink-0 border border-border">
            <img src={miner.imageUrl} alt={miner.name} className="w-10 h-10 object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-md font-bold text-text-primary truncate">{miner.name}</h3>
            <span className="text-xs font-semibold text-status-success mt-0.5">+{miner.dailyProduction.toFixed(2)} USDT / 24h</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          {isClaimable ? (
            <button onClick={() => onClaim(purchasedMinerId)} className="px-4 py-2 text-sm font-bold rounded-lg bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent-hover transform active:scale-95 transition-all">
              {t('purchasedMiner.claim', 'Reclamar')}
            </button>
          ) : (
            <div className="bg-background-start text-text-primary font-mono text-sm px-3 py-1.5 rounded-full border border-border">
              <span>{countdown}</span>
            </div>
          )}
        </div>
      </div>

      {/* --- SECCIÓN 2: Visualización de Progreso (Círculos) --- */}
      <hr className="border-border/50" />
      <div className="flex justify-around items-center">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="text-xs text-text-secondary">{t('purchasedMiner.nextClaim', 'Próximo Reclamo')}</span>
          <CircularProgress progress={cycleProgress} colorClass="text-accent">
            <span className="text-xs font-mono">{Math.floor(cycleProgress)}%</span>
          </CircularProgress>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="text-xs text-text-secondary">{t('purchasedMiner.lifespan', 'Vida Útil Restante')}</span>
          <CircularProgress progress={100 - lifetimeProgress} colorClass={lifetimeBarColor}>
            <span className="text-[10px] font-bold">{timeLeftText}</span>
          </CircularProgress>
        </div>
      </div>
    </div>
  );
};

export default PurchasedMinerItem;

// --- END OF FILE PurchasedMinerItem.jsx ---