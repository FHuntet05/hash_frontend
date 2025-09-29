

// RUTA: frontend/src/components/factories/MinerCard.jsx (v4.6 - "QUANTUM LEAP": TÍTULO RESPONSIVE CON ETIQUETA ADYACENTE)

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const MinerCard = ({ miner, onBuyClick, isOwned }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      layout
      className="relative rounded-xl overflow-hidden shadow-lg shadow-black/30 border border-white/10 h-[340px] w-full max-w-md mx-auto"
    >
      {/* --- Imagen de fondo personalizada --- */}
      <div
        className="absolute inset-0 bg-cover bg-top"
        style={{ backgroundImage: `url(${miner.imageUrl || '/assets/images/tool-placeholder.png'})` }}
      />

      {/* --- Panel glass inferior --- */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[65%] px-5 py-4 flex flex-col justify-between 
                   bg-black/50 backdrop-blur-md rounded-t-xl border-t border-white/10"
      >
        {/* --- Información del minero --- */}
        <div>

          {/* --- INICIO DE MODIFICACIÓN CRÍTICA: Título y Etiqueta en un contenedor Flex --- */}
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white shadow-text flex-1 min-w-0 truncate">
              {miner.name}
            </h3> 

            {isOwned && (
              <span className="text-xs font-semibold text-blue-300 bg-blue-500/20 px-2.5 py-1 rounded-full inline-block border border-blue-400/30 flex-shrink-0">
                {t('minerCard.owned', 'Adquirida')}
              </span>
            )}
          </div>
          {/* --- FIN DE MODIFICACIÓN CRÍTICA --- */}

          <hr className="border-white/10 my-3" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">{t('minerCard.dailyProduction', 'Producción Diaria')}</span> 
              <span className="font-semibold text-status-success text-base">+ {miner.dailyProduction || 0} USDT</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">{t('minerCard.duration', 'Duración')}</span>
              <span className="font-semibold text-white text-base">
                {t('minerCard.days', '{{count}} días', { count: miner.durationDays || 0 })}
              </span>
            </div>
          </div>
        </div>

        {/* --- Sección de compra --- */}
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <span className="text-gray-300 text-sm">{t('minerCard.price', 'Precio')}</span>
            <span className="font-bold text-2xl text-white">{miner.price || 0} USDT</span>
          </div>

          <button 
            onClick={() => onBuyClick(miner)}
            disabled={isOwned}
            className={`
              w-full mt-1 py-2.5 text-white font-bold text-base rounded-lg transition-all duration-200 ease-in-out
              ${isOwned 
                ? 'bg-gray-700/80 cursor-not-allowed'
                : 'bg-accent hover:bg-accent-hover shadow-lg shadow-accent/30 transform active:scale-95'
              }
            `}
          >
            {isOwned ? t('minerCard.alreadyOwned', 'ADQUIRIDO') : t('minerCard.buyNow', 'COMPRAR AHORA')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MinerCard;

