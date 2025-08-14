// RUTA: frontend/src/components/factories/PurchasedFactoryItem.jsx (v2.0 - A PRUEBA DE ERRORES)

import React, { useMemo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// --- INICIO DE CORRECCIÓN: Lógica del hook integrada directamente para evitar dependencias externas ---
const useFactoryCycle = (lastClaim) => {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const twentyFourHours = 24 * 60 * 60 * 1000;
    const lastClaimTime = new Date(lastClaim).getTime();
    const timeSinceClaim = now - lastClaimTime;
    const isClaimable = timeSinceClaim >= twentyFourHours;
    
    const timeRemaining = isClaimable ? 0 : twentyFourHours - timeSinceClaim;
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    const countdown = isClaimable ? "00:00:00" : `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const progress = isClaimable ? 100 : (timeSinceClaim / twentyFourHours) * 100;
    
    return { countdown, progress, isClaimable };
};
// --- FIN DE CORRECCIÓN ---

const ProgressBar = ({ progress, bgColorClass }) => (
  <div className="w-full bg-black/10 rounded-full h-2.5 overflow-hidden">
    <div
      className={`${bgColorClass} h-2.5 rounded-full transition-all duration-500`}
      style={{ width: `${progress}%` }}
    />
  </div>
);

const PurchasedFactoryItem = ({ purchasedFactory, onClaim }) => {
  const { t } = useTranslation();
  const { factory, purchaseDate, expiryDate, _id: purchasedFactoryId, lastClaim } = purchasedFactory;
  
  // --- INICIO DE CORRECCIÓN: Verificación de seguridad ---
  // Si 'factory' no es un objeto (es decir, es solo un ID), no renderizamos nada.
  // Esto evita que la aplicación se rompa y es la causa principal del bug.
  if (!factory || typeof factory !== 'object') {
    console.warn("PurchasedFactoryItem: La fábrica no está populada. Saltando renderizado.", purchasedFactory);
    return null;
  }
  // --- FIN DE CORRECCIÓN ---

  const { countdown, progress: cycleProgress, isClaimable } = useFactoryCycle(lastClaim);

  const { lifetimeProgress, daysLeftText } = useMemo(() => {
    const start = new Date(purchaseDate).getTime();
    const end = new Date(expiryDate).getTime();
    const now = Date.now();
    const totalDuration = end - start;
    const elapsed = now - start;
    const progress = Math.min(100, (elapsed / totalDuration) * 100);
    const totalDays = Math.ceil(totalDuration / (1000 * 60 * 60 * 24));
    const dayNumber = Math.min(totalDays, Math.ceil(elapsed / (1000 * 60 * 60 * 24)));
    return {
      lifetimeProgress: progress,
      daysLeftText: t('purchasedFactory.dayCounter', 'Día {{dayNumber}} de {{totalDays}}', { dayNumber, totalDays })
    };
  }, [purchaseDate, expiryDate, t]);

  const lifetimeBarColor = useMemo(() => {
    if (lifetimeProgress < 50) return 'bg-status-success';
    if (lifetimeProgress < 85) return 'bg-status-warning';
    return 'bg-status-danger';
  }, [lifetimeProgress]);

  return (
    <div className="bg-card/70 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col gap-3 shadow-medium">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-text-primary">{factory.name}</h3>
        <button
          onClick={() => onClaim(purchasedFactoryId)}
          disabled={!isClaimable}
          className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-300 transform active:scale-95
            ${isClaimable 
              ? 'bg-accent-secondary text-white shadow-subtle animate-pulse'
              : 'bg-text-tertiary/50 text-text-secondary cursor-not-allowed'
            }`}
        >
          {isClaimable ? t('purchasedFactory.claim', 'RECLAMAR') : t('purchasedFactory.producing', 'PRODUCIENDO')}
        </button>
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
    </div>
  );
};

export default PurchasedFactoryItem;