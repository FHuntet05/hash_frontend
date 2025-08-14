// RUTA: frontend/src/components/factories/PurchasedFactoryItem.jsx (v3.3 - USANDO CLASES DE TAILWIND)

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFactoryCycle } from '../../hooks/useFactoryCycle';
import { FaFan } from 'react-icons/fa';

const ProgressBar = ({ progress, bgColorClass }) => (
  <div className="w-full bg-black/10 rounded-full h-2 overflow-hidden">
    <div
      className={`${bgColorClass} h-2 rounded-full transition-all duration-500`}
      style={{ width: `${progress}%` }}
    />
  </div>
);

const PurchasedFactoryItem = ({ purchasedFactory, onClaim }) => {
  const { t } = useTranslation();
  
  if (!purchasedFactory || typeof purchasedFactory.factory !== 'object') {
    return null;
  }
  
  const { factory, purchaseDate, expiryDate, _id: purchasedFactoryId, lastClaim } = purchasedFactory;
  const { countdown, progress: cycleProgress, isClaimable } = useFactoryCycle(lastClaim);

  const animationDuration = useMemo(() => {
    return Math.max(0.2, 3 / (factory.dailyProduction || 1));
  }, [factory.dailyProduction]);

  const { lifetimeProgress, daysLeftText } = useMemo(() => {
    const start = new Date(purchaseDate).getTime();
    const end = new Date(expiryDate).getTime();
    const now = Date.now();
    const totalDuration = end - start;
    const elapsed = now - start;
    const progress = Math.min(100, (elapsed / totalDuration) * 100);
    const totalDays = factory.durationDays;
    const dayNumber = Math.min(totalDays, Math.ceil(elapsed / (1000 * 60 * 60 * 24)));
    return {
      lifetimeProgress: progress,
      daysLeftText: t('purchasedFactory.dayCounter', 'Día {{dayNumber}} de {{totalDays}}', { dayNumber, totalDays })
    };
  }, [purchaseDate, expiryDate, t, factory.durationDays]);

  const lifetimeBarColor = useMemo(() => {
    if (lifetimeProgress < 50) return 'bg-status-success';
    if (lifetimeProgress < 85) return 'bg-status-warning';
    return 'bg-status-danger';
  }, [lifetimeProgress]);

  return (
    <div className="bg-card/70 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col gap-3 shadow-medium">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-text-primary">{factory.name}</h3>
        {/* --- INICIO DE CORRECCIÓN --- */}
        {/* Se usa la clase 'animate-spin' de Tailwind y se aplica la duración con un style en línea */}
        <FaFan 
            className="text-white/50 animate-spin" 
            style={{ animationDuration: `${animationDuration}s` }} 
        />
        {/* --- FIN DE CORRECCIÓN --- */}
      </div>

      <div className="flex gap-4 items-center">
        <div className="w-16 h-16 bg-background/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-border">
            <img src={factory.imageUrl} alt={factory.name} className="w-12 h-12 object-contain" />
        </div>
        <div className="flex-grow flex flex-col justify-between gap-2">
            <div>
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>{t('purchasedFactory.nextClaim', 'Próximo Reclamo')}</span>
                    <span className="font-mono">{countdown}</span>
                </div>
                <ProgressBar progress={cycleProgress} bgColorClass="bg-accent-primary" />
            </div>
             <div>
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>{t('purchasedFactory.lifespan', 'Vida Útil')}</span>
                    <span className="font-mono">{daysLeftText}</span>
                </div>
                <ProgressBar progress={lifetimeProgress} bgColorClass={lifetimeBarColor} />
            </div>
        </div>
      </div>
      
      <button
          onClick={() => onClaim(purchasedFactoryId)}
          disabled={!isClaimable}
          className={`w-full mt-2 py-2.5 text-sm font-bold rounded-full transition-all duration-300 transform active:scale-95
            ${isClaimable 
              ? 'bg-accent-secondary text-white shadow-subtle animate-pulse'
              : 'bg-text-tertiary/50 text-text-secondary cursor-not-allowed'
            }`}
        >
          {isClaimable 
            ? `${t('purchasedFactory.claim', 'RECLAMAR')} ${factory.dailyProduction.toFixed(2)} USDT` 
            : t('purchasedFactory.producing', 'PRODUCIENDO')}
        </button>
    </div>
  );
};

export default PurchasedFactoryItem;