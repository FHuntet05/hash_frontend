
// RUTA: frontend/src/components/factories/MinerCard.jsx (v4.1 - "QUANTUM LEAP": REDISEÑO GLASSMORPHISM REFINADO)

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const MinerCard = ({ miner, onBuyClick, isOwned }) => {
  const { t } = useTranslation();

  return (
    <motion.div
        layout
        className="relative rounded-2xl overflow-hidden shadow-lg shadow-black/30 border border-white/20 aspect-[3/4] min-h-[400px]"
    >
        {/* --- CAPA DE FONDO --- */}
        {/* La imagen del minero es el fondo, expandida y con un ligero desenfoque. */}
        <div
            className="absolute inset-0 bg-cover bg-center blur-[3px] scale-110"
            style={{ backgroundImage: `url(${miner.imageUrl || '/assets/images/tool-placeholder.png'})` }}
        />

        {/* --- CAPA DE CONTENIDO (GLASSMORPHISM) --- */}
        {/* Este div crea el efecto de cristal. Se utiliza un gradiente para mejorar la legibilidad. */}
        <div 
            className="absolute inset-0 p-6 flex flex-col justify-between 
                       bg-gradient-to-t from-black/70 via-black/50 to-black/20 
                       backdrop-blur-md"
        >
            {/* --- SECCIÓN SUPERIOR: Título, Estado y Estadísticas --- */}
            <div>
                <h3 className="text-2xl font-bold text-white shadow-text">{miner.name}</h3> 
                {isOwned && (
                    <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full mt-2 inline-block border border-accent/30">
                        {t('minerCard.owned', 'En Posesión')}
                    </span>
                )}
                
                {/* --- Estadísticas (diseño limpio sin cajas internas) --- */}
                <div className="space-y-3 text-sm mt-6 border-t border-white/10 pt-4">
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

            {/* --- SECCIÓN INFERIOR: Precio y Botón de Compra --- */}
            <div>
                <div className="flex justify-between items-baseline mb-4">
                    <span className="text-gray-300 text-sm">{t('minerCard.price', 'Precio')}</span>
                    <span className="font-bold text-3xl text-white">{miner.price || 0} USDT</span>
                </div>
              
                <button 
                    onClick={() => onBuyClick(miner)}
                    disabled={isOwned}
                    className={`
                        w-full mt-2 py-3 text-white font-bold rounded-lg transition-all duration-200 ease-in-out
                        ${isOwned 
                            ? 'bg-gray-500/50 cursor-not-allowed' 
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

