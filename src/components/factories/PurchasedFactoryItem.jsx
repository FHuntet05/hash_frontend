// RUTA: frontend/src/components/factories/PurchasedFactoryItem.jsx (NUEVO)
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFactoryCycle } from '../../hooks/useFactoryCycle';

// Pequeño componente para la barra de progreso animada
const ProgressBar = ({ progress, bgColorClass, pulse = false }) => (
  <div className="w-full bg-black/30 rounded-full h-2.5 overflow-hidden">
    <div
      className={`${bgColorClass} h-2.5 rounded-full transition-all duration-500 relative`}
      style={{ width: `${progress}%` }}
    >
      {pulse && progress < 100 && (
        <div className="absolute top-0 left-0 h-full w-full bg-white/30 rounded-full animate-pulse-slow"></div>
      )}
    </div>
  </div>
);

const PurchasedFactoryItem = ({ purchasedFactory, onClaim }) => {
  const { factory, purchaseDate, expiryDate, _id: purchasedFactoryId, lastClaim } = purchasedFactory;
  
  // Usamos el hook para obtener el estado del ciclo de 24h
  const { countdown, progress: cycleProgress, isClaimable } = useFactoryCycle(lastClaim);

  // Calculamos el progreso de la vida útil de la fábrica
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
      daysLeftText: `Día ${dayNumber} de ${totalDays}`
    };
  }, [purchaseDate, expiryDate]);

  const lifetimeBarColor = useMemo(() => {
    if (lifetimeProgress < 50) return 'bg-green-500';
    if (lifetimeProgress < 85) return 'bg-yellow-500';
    return 'bg-red-500';
  }, [lifetimeProgress]);

  // Si la fábrica no tiene datos, no renderizamos nada para evitar errores.
  if (!factory) return null;

  return (
    <div className="bg-dark-secondary rounded-2xl p-4 border border-white/10 flex flex-col gap-3">
      {/* --- Cabecera con Nombre y Botón de Estado --- */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">{factory.name}</h3>
        <button
          onClick={() => onClaim(purchasedFactoryId)}
          disabled={!isClaimable}
          className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-300
            ${isClaimable 
              ? 'bg-gradient-to-r from-accent-start to-accent-end text-white shadow-glow animate-pulse'
              : 'bg-gray-700 text-text-secondary cursor-not-allowed'
            }`}
        >
          {isClaimable ? 'RECLAMAR' : 'PRODUCIENDO'}
        </button>
      </div>

      <div className="flex gap-4">
        {/* Columna Izquierda: Animación (Platzhalter) */}
        <div className="w-16 h-16 bg-dark-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <img src={factory.imageUrl} alt={factory.name} className="w-12 h-12 object-contain" />
        </div>

        {/* Columna Derecha: Detalles y Barras de Progreso */}
        <div className="flex-grow flex flex-col justify-between gap-2">
            <div>
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>Próximo Reclamo</span>
                    <span className="font-mono">{countdown}</span>
                </div>
                <ProgressBar progress={cycleProgress} bgColorClass="bg-accent-start" pulse={true} />
            </div>
             <div>
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>Vida Útil</span>
                    <span className="font-mono">{daysLeftText}</span>
                </div>
                <ProgressBar progress={lifetimeProgress} bgColorClass={lifetimeBarColor} />
            </div>
        </div>
      </div>
      
      {/* Detalles Inferiores */}
      <div className="flex justify-between items-center text-xs text-text-secondary border-t border-white/10 pt-2 mt-2">
        <span>Producción Diaria:</span>
        <span className="font-bold font-mono text-green-400">{factory.dailyProduction.toFixed(2)} USDT</span>
      </div>
    </div>
  );
};

export default PurchasedFactoryItem;