// --- START OF FILE PurchasedMinerItem.jsx ---

// RUTA: frontend/src/components/miners/PurchasedMinerItem.jsx (v8.0 - "QUANTUM LEAP": DISEÑO DE REFERENCIA FINAL)

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFactoryCycle } from '../../hooks/useFactoryCycle'; // El hook existente es perfecto para esta lógica

const PurchasedMinerItem = ({ purchasedMiner, onClaim }) => {
  const { t } = useTranslation();
  
  // Guardia de seguridad para evitar errores si los datos no están completos
  if (!purchasedMiner || typeof purchasedMiner.miner !== 'object') {
    console.warn("PurchasedMinerItem renderizado sin un objeto 'miner' válido.", purchasedMiner);
    return null;
  }
  
  const { miner, _id: purchasedMinerId, lastClaim } = purchasedMiner;
  const { countdown, isClaimable } = useFactoryCycle(lastClaim);

  return (
    <div className="bg-surface rounded-2xl p-3 border border-border flex items-center justify-between gap-3 shadow-subtle">
      
      {/* --- LADO IZQUIERDO: Imagen e Información --- */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-12 h-12 bg-background-start rounded-lg flex items-center justify-center flex-shrink-0 border border-border">
            <img 
              src={miner.imageUrl || '/assets/images/tool-placeholder.png'} 
              alt={miner.name} 
              className="w-10 h-10 object-contain" 
            />
        </div>
        <div className="flex-1 min-w-0">
            <h3 className="text-md font-bold text-text-primary truncate">{miner.name}</h3>
            <span className="text-xs font-semibold text-status-success mt-0.5">
                +{miner.dailyProduction.toFixed(2)} USDT / 24h
            </span>
        </div>
      </div>

      {/* --- LADO DERECHO: Temporizador o Botón de Reclamo --- */}
      <div className="flex-shrink-0">
        {isClaimable ? (
          // El botón "Reclamar" cuando está activo
          <button
            onClick={() => onClaim(purchasedMinerId)}
            className="px-4 py-2 text-sm font-bold rounded-lg bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent-hover transform active:scale-95 transition-all"
          >
            {t('purchasedMiner.claim', 'Reclamar')}
          </button>
        ) : (
          // La "píldora" con el contador cuando está minando
          <div className="bg-background-start text-text-primary font-mono text-sm px-3 py-1.5 rounded-full border border-border">
            <span>{countdown}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasedMinerItem;

// --- END OF FILE PurchasedMinerItem.jsx ---