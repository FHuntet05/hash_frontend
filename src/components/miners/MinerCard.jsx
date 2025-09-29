// RUTA: frontend/src/components/factories/MinerCard.jsx (v4.4 - "QUANTUM LEAP": DISEÑO RECTANGULAR CON TÍTULO VISIBLE)

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const MinerCard = ({ miner, onBuyClick, isOwned }) => {
  const { t } = useTranslation();

  return (
    <motion.div
        layout
        className="relative rounded-2xl overflow-hidden shadow-lg shadow-black/30 border border-white/10 aspect-[4/3] min-h-[280px]"
        //                                                                                             ^--- CAMBIO CRÍTICO: Relación de aspecto a 4:3 (más ancha).
        //                                                                                                            ^--- CAMBIO CRÍTICO: Altura mínima reducida para la nueva forma.
    >
        {/* --- CAPA DE FONDO (IMAGEN) --- */}
        {/* La imagen sigue siendo el fondo, ahora con proporciones panorámicas. */}
        <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${miner.imageUrl || '/assets/images/tool-placeholder.png'})` }}
        />

        {/* --- CAPA DE CONTENIDO (GLASSMORPHISM) --- */}
        {/* El panel ahora empieza más abajo para revelar el título de la imagen. */}
        <div 
            className="absolute bottom-0 left-0 right-0 h-[65%] p-5 flex flex-col justify-between 
                       bg-black/60 backdrop-blur-md rounded-t-2xl border-t border-white/10"
            //         ^--- CAMBIO CRÍTICO: La altura ahora es del 65% para no cubrir el texto superior.
        >
            {/* --- SECCIÓN DE INFORMACIÓN (COMPACTA) --- */}
            <div>
                <h3 className="text-2xl font-bold text-white shadow-text truncate">{miner.name}</h3> 
                
                {isOwned && (
                    <span className="text-xs font-semibold text-blue-300 bg-blue-500/20 px-2.5 py-1 rounded-full mt-2 inline-block border border-blue-400/30">
                        {t('minerCard.owned', 'Adquirida')}
                    </span>
                )}
                
                <hr className="border-white/10 my-4" />

                <div className="space-y-3 text-sm">
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

            {/* --- SECCIÓN DE COMPRA (INFERIOR) --- */}
            <div>
                <div className="flex justify-between items-baseline mb-4">
                    <span className="text-gray-300 text-sm">{t('minerCard.price', 'Precio')}</span>
                    <span className="font-bold text-3xl text-white">{miner.price || 0} USDT</span>
                </div>
              
                <button 
                    onClick={() => onBuyClick(miner)}
                    disabled={isOwned}
                    className={`
                        w-full mt-2 py-3 text-white font-bold text-base rounded-lg transition-all duration-200 ease-in-out
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