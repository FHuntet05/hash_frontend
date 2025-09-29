// --- START OF FILE PurchasedMinerItem.jsx ---

// RUTA: frontend/src/components/miners/PurchasedMinerItem.jsx (v7.0 - "QUANTUM LEAP": REDISEÑO CIRCULAR)

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFactoryCycle } from '../../hooks/useFactoryCycle'; // Mantener el hook por ahora, su lógica es válida

// --- Componente interno para el anillo de progreso ---
const CircularProgress = ({ progress, size = 40, strokeWidth = 4, colorClass }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle
        className="text-black/20"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className={colorClass}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  );
};

const PurchasedMinerItem = ({ purchasedMiner, onClaim }) => {
  const { t } = useTranslation();
  
  if (!purchasedMiner || typeof purchasedMiner.miner !== 'object') {
    return null;
  }
  
  const { miner, expiryDate, _id: purchasedMinerId, lastClaim } = purchasedMiner;
  const { countdown, progress: cycleProgress, isClaimable } = useFactoryCycle(lastClaim);

  const { timeLeftText, lifetimeProgress } = useMemo(() => {
    const end = new Date(expiryDate).getTime();
    const now = Date.now();
    const totalDuration = end - new Date(purchasedMiner.purchaseDate).getTime();
    const elapsed = Math.max(0, now - new Date(purchasedMiner.purchaseDate).getTime());
    const progress = Math.min(100, (elapsed / totalDuration) * 100);

    const remainingMs = Math.max(0, end - now);
    const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
    
    let text = t('time.days', '{{count}}d', { count: days });
    if (remainingMs === 0) text = t('time.expired', 'Expirado');

    return { timeLeftText: text, lifetimeProgress: progress };
  }, [expiryDate, purchasedMiner.purchaseDate, t]);
  
  const lifetimeBarColor = useMemo(() => {
    if (lifetimeProgress > 25) return 'text-status-warning';
    if (lifetimeProgress > 0) return 'text-status-success';
    return 'text-status-danger';
  }, [lifetimeProgress]);

  return (
    <div className="bg-surface rounded-2xl p-4 border border-border flex flex-col gap-4 shadow-subtle">
      {/* --- SECCIÓN SUPERIOR: Información y botón --- */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-background rounded-lg flex items-center justify-center flex-shrink-0 border border-border">
                <img src={miner.imageUrl} alt={miner.name} className="w-10 h-10 object-contain" />
            </div>
            <div>
                <h3 className="text-md font-bold text-text-primary leading-tight">{miner.name}</h3>
                <span className="text-xs font-semibold text-status-success mt-1">
                    +{miner.dailyProduction.toFixed(2)} USDT / 24h
                </span>
            </div>
        </div>
        <button
          onClick={() => onClaim(purchasedMinerId)}
          disabled={!isClaimable}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 transform active:scale-95
            ${isClaimable 
              ? 'bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent-hover'
              : 'bg-text-terciary/50 text-text-secondary cursor-not-allowed'
            }`}
        >
          {isClaimable ? t('purchasedMiner.claim', 'Reclamar') : countdown}
        </button>
      </div>

      {/* --- SECCIÓN INFERIOR: Indicadores de progreso --- */}
      <div className="flex justify-around items-center pt-2 border-t border-border">
          <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="text-xs text-text-secondary">{t('purchasedMiner.nextClaim', 'Próximo Reclamo')}</span>
              <div className="relative">
                  <CircularProgress progress={cycleProgress} colorClass="text-accent" />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-mono">
                      {Math.floor(cycleProgress)}%
                  </span>
              </div>
          </div>
           <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="text-xs text-text-secondary">{t('purchasedMiner.lifespan', 'Vida Útil')}</span>
              <div className="relative">
                  <CircularProgress progress={100 - lifetimeProgress} colorClass={lifetimeBarColor} />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                    {timeLeftText}
                  </span>
              </div>
           </div>
      </div>
    </div>
  );
};

export default PurchasedMinerItem;

// --- END OF FILE PurchasedMinerItem.jsx ---