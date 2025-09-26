<<<<<<< HEAD
// RUTA: frontend/src/components/factories/PurchasedFactoryItem.jsx (v6.0 - REDISEÑO "MINER" CON TIEMPO RESTANTE)

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFactoryCycle } from '../../hooks/useFactoryCycle'; // Este hook se puede renombrar a useMinerCycle después

const ProgressBar = ({ progress, bgColorClass }) => (
  <div className="w-full bg-black/30 rounded-full h-1.5 overflow-hidden">
    <div
      className={`${bgColorClass} h-1.5 rounded-full transition-all duration-500`}
      style={{ width: `${progress}%` }}
    />
  </div>
);
=======
// RUTA: frontend/src/components/factories/PurchasedFactoryItem.jsx (v6.0 - INDICADORES VISUALES AVANZADOS)

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFactoryCycle } from '../../hooks/useFactoryCycle';
import { FaCoins } from 'react-icons/fa';
import CpuChipIcon from '../icons/CpuChipIcon';

// --- INICIO DE NUEVOS SUB-COMPONENTES VISUALES ---

const ProductionBattery = ({ progress }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-8 h-24 bg-black/20 rounded-lg border-2 border-border p-1 flex items-end">
        {/* Capa de llenado de la batería */}
        <div
          className="w-full bg-accent-primary rounded-sm transition-all duration-500 ease-out"
          style={{ height: `${progress}%` }}
        />
      </div>
      <span className="text-xs font-bold text-text-secondary">{t('purchasedFactory.production', 'Producción')}</span>
    </div>
  );
};

const LifetimeThermometer = ({ progress }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-8 h-24 bg-black/20 rounded-lg border-2 border-border p-1 flex items-end">
        {/* Capa de llenado del termómetro con degradado */}
        <div
          className="w-full bg-gradient-to-t from-status-success via-status-warning to-status-danger rounded-sm transition-all duration-500 ease-out"
          style={{ height: `${progress}%` }}
        />
      </div>
      <span className="text-xs font-bold text-text-secondary">{t('purchasedFactory.lifespan', 'Vida Útil')}</span>
    </div>
  );
};

// --- FIN DE NUEVOS SUB-COMPONENTES VISUALES ---

>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503

// El componente ahora espera `purchasedMiner`
const PurchasedMinerItem = ({ purchasedMiner, onClaim }) => {
  const { t } = useTranslation();
  
  // Verificación de robustez: Si el miner anidado no existe, no renderizar nada.
  if (!purchasedMiner || typeof purchasedMiner.miner !== 'object') {
    console.warn("PurchasedMinerItem renderizado sin un objeto 'miner' válido.", purchasedMiner);
    return null;
  }
  
  // Desestructuración con los nuevos nombres de campos del userModel
  const { miner, expiryDate, _id: purchasedMinerId, lastClaim } = purchasedMiner;
  const { countdown, progress: cycleProgress, isClaimable } = useFactoryCycle(lastClaim);

<<<<<<< HEAD
  // --- INICIO DE NUEVA LÓGICA: Cálculo del tiempo restante ---
  const { timeLeftText, lifetimeProgress } = useMemo(() => {
=======
  const animationDuration = useMemo(() => {
    return Math.max(0.5, 4 / (factory.dailyProduction || 1));
  }, [factory.dailyProduction]);

  const { lifetimeProgress } = useMemo(() => {
    const start = new Date(purchaseDate).getTime();
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503
    const end = new Date(expiryDate).getTime();
    const now = Date.now();
    const totalDuration = end - new Date(purchasedMiner.purchaseDate).getTime();
    const elapsed = now - new Date(purchasedMiner.purchaseDate).getTime();
    const progress = Math.min(100, (elapsed / totalDuration) * 100);
<<<<<<< HEAD

    const remainingMs = Math.max(0, end - now);
    const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

    let text;
    if (days > 0) {
      text = t('time.daysHours', '{{days}}d {{hours}}h', { days, hours });
    } else if (hours > 0) {
      text = t('time.hoursMinutes', '{{hours}}h {{minutes}}m', { hours, minutes });
    } else {
      text = t('time.minutes', '{{minutes}}m', { minutes });
    }
    
    if (remainingMs === 0) {
      text = t('time.expired', 'Expirado');
    }

    return { timeLeftText: text, lifetimeProgress: progress };
  }, [expiryDate, purchasedMiner.purchaseDate, t]);
  // --- FIN DE NUEVA LÓGICA ---

  const lifetimeBarColor = useMemo(() => {
    if (lifetimeProgress < 75) return 'bg-status-success';
    if (lifetimeProgress < 95) return 'bg-status-warning';
    return 'bg-status-danger';
  }, [lifetimeProgress]);

  return (
    <div className="bg-surface rounded-2xl p-4 border border-border flex flex-col gap-4 shadow-subtle">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-background rounded-lg flex items-center justify-center flex-shrink-0 border border-border">
                <img src={miner.imageUrl} alt={miner.name} className="w-10 h-10 object-contain" />
            </div>
            <div className="flex flex-col">
                <h3 className="text-md font-bold text-text-primary leading-tight">{miner.name}</h3>
                <span className="text-xs font-semibold text-status-success mt-1">
                    +{miner.dailyProduction.toFixed(2)} USDT / 24h
                </span>
=======
    return { lifetimeProgress: progress };
  }, [purchaseDate, expiryDate]);

  return (
    <div className="bg-card/70 backdrop-blur-md rounded-2xl p-4 border border-border flex flex-col gap-4 shadow-medium">
      {/* --- SECCIÓN SUPERIOR (SIN CAMBIOS) --- */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-text-primary leading-tight">{factory.name}</h3>
          <div className="flex items-center gap-1.5 text-status-success text-xs font-semibold mt-1">
            <FaCoins />
            <span>+{factory.dailyProduction.toFixed(2)} USDT / {t('common.day', 'Día')}</span>
          </div>
        </div>
        <CpuChipIcon 
          className="w-8 h-8 text-accent-primary opacity-80"
          animationDuration={animationDuration}
        />
      </div>

      {/* --- INICIO DE LA RECONSTRUCCIÓN DEL CUERPO --- */}
      <div className="flex justify-around items-center text-center">
        <ProductionBattery progress={cycleProgress} />
        
        <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-background/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-border">
                <img src={factory.imageUrl} alt={factory.name} className="w-16 h-16 object-contain" />
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503
            </div>
            <span className="font-mono text-lg text-text-primary mt-2">{countdown}</span>
            <span className="text-xs text-text-secondary">{t('purchasedFactory.nextClaim', 'Próximo Reclamo')}</span>
        </div>
<<<<<<< HEAD
        <button
          onClick={() => onClaim(purchasedMinerId)}
          disabled={!isClaimable}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 transform active:scale-95
=======

        <LifetimeThermometer progress={lifetimeProgress} />
      </div>
      {/* --- FIN DE LA RECONSTRUCCIÓN DEL CUERPO --- */}
      
      <button
          onClick={() => onClaim(purchasedFactoryId)}
          disabled={!isClaimable}
          className={`w-full py-3 text-sm font-bold rounded-full transition-all duration-300 transform active:scale-95
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503
            ${isClaimable 
              ? 'bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent-hover'
              : 'bg-text-terciary/50 text-text-secondary cursor-not-allowed'
            }`}
        >
          {isClaimable ? t('purchasedMiner.claim', 'Reclamar') : t('purchasedMiner.producing', 'Minando...')}
        </button>
      </div>

      <div className="flex-grow flex flex-col justify-between gap-3 text-xs">
          <div>
              <div className="flex justify-between text-text-secondary mb-1">
                  <span>{t('purchasedMiner.nextClaim', 'Próximo Reclamo')}</span>
                  <span className="font-mono">{countdown}</span>
              </div>
              <ProgressBar progress={cycleProgress} bgColorClass="bg-accent" />
          </div>
           <div>
              <div className="flex justify-between text-text-secondary mb-1">
                  <span>{t('purchasedMiner.lifespan', 'Vida Útil Restante')}</span>
                  <span className="font-mono font-semibold text-text-primary">{timeLeftText}</span>
              </div>
              <ProgressBar progress={lifetimeProgress} bgColorClass={lifetimeBarColor} />
          </div>
      </div>
    </div>
  );
};

export default PurchasedMinerItem;