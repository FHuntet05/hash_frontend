// RUTA: frontend/src/components/factories/PurchasedFactoryItem.jsx (UI RENOVADA)
import React, { useMemo } from 'react';
import { useFactoryCycle } from '../../hooks/useFactoryCycle';

// Pequeño componente para la barra de progreso animada (sin cambios funcionales)
const ProgressBar = ({ progress, bgColorClass, pulse = false }) => (
  <div className="w-full bg-slate-900/70 rounded-full h-2.5 overflow-hidden">
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

  // Los colores semánticos para la vida útil se mantienen
  const lifetimeBarColor = useMemo(() => {
    if (lifetimeProgress < 50) return 'bg-green-500';
    if (lifetimeProgress < 85) return 'bg-yellow-500';
    return 'bg-red-500';
  }, [lifetimeProgress]);

  // Si la fábrica no tiene datos, no renderizamos nada para evitar errores.
  if (!factory) return null;

  return (
    <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 flex flex-col gap-3 shadow-lg">
      {/* --- Cabecera con Nombre y Botón de Estado --- */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-100">{factory.name}</h3>
        <button
          onClick={() => onClaim(purchasedFactoryId)}
          disabled={!isClaimable}
          className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-300 transform active:scale-95
            ${isClaimable 
              ? 'bg-lime-500 text-slate-900 shadow-lg shadow-lime-500/30 animate-pulse'
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
        >
          {isClaimable ? 'RECLAMAR' : 'PRODUCIENDO'}
        </button>
      </div>

      <div className="flex gap-4">
        {/* Columna Izquierda: Imagen de la Fábrica */}
        <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-700">
            <img src={factory.imageUrl} alt={factory.name} className="w-12 h-12 object-contain" />
        </div>

        {/* Columna Derecha: Detalles y Barras de Progreso */}
        <div className="flex-grow flex flex-col justify-between gap-2">
            <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Próximo Reclamo</span>
                    <span className="font-mono">{countdown}</span>
                </div>
                <ProgressBar progress={cycleProgress} bgColorClass="bg-sky-500" pulse={true} />
            </div>
             <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Vida Útil</span>
                    <span className="font-mono">{daysLeftText}</span>
                </div>
                <ProgressBar progress={lifetimeProgress} bgColorClass={lifetimeBarColor} />
            </div>
        </div>
      </div>
      
      {/* Detalles Inferiores */}
      <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-700 pt-2 mt-2">
        <span>Producción Diaria:</span>
        <span className="font-bold font-mono text-lime-400">{factory.dailyProduction.toFixed(2)} USDT</span>
      </div>
    </div>
  );
};

export default PurchasedFactoryItem;