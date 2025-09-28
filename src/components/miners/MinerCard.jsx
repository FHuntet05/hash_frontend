// RUTA: frontend/src/components/factories/FactoryCard.jsx (v3.0 - REDISEÑO "OBSIDIAN BLUE" Y SEMÁNTICA "MINER")

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const MinerCard = ({ miner, onBuyClick, isOwned }) => { // Componente renombrado internamente
  const { t } = useTranslation();

  return (
    <motion.div
        layout
        className={`
            bg-surface rounded-2xl p-5 border flex flex-col gap-4 text-text-primary shadow-medium
            transition-colors duration-300
            ${isOwned ? 'border-accent/30 bg-surface/80' : 'border-border hover:border-accent/50'}
        `}
    >
        <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
                <h3 className="text-xl font-bold text-text-primary">{miner.name}</h3> 
                {isOwned && (
                    <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full mt-2 inline-block">
                        {t('minerCard.owned', 'En Posesión')}
                    </span>
                )}
            </div>
            <img 
                src={miner.imageUrl || '/assets/images/tool-placeholder.png'} 
                alt={miner.name} 
                className={`w-16 h-16 object-contain flex-shrink-0 transition-opacity ${isOwned ? 'opacity-40 saturate-0' : 'opacity-100'}`}
            />
        </div>

        <div className="space-y-3 text-sm border-t border-border pt-4">
            <div className="flex justify-between items-center">
                <span className="text-text-secondary">{t('minerCard.dailyProduction', 'Producción Diaria')}</span> 
                <span className="font-semibold text-status-success">+ {miner.dailyProduction || 0} USDT</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-text-secondary">{t('minerCard.duration', 'Duración')}</span>
                <span className="font-semibold text-text-primary">
                    {t('minerCard.days', '{{count}} días', { count: miner.durationDays || 0 })}
                </span>
            </div>
            <div className="flex justify-between items-center pt-2">
                <span className="text-text-secondary">{t('minerCard.price', 'Precio')}</span>
                <span className="font-bold text-2xl text-text-primary">{miner.price || 0} USDT</span>
            </div>
        </div>
      
        <button 
            onClick={() => onBuyClick(miner)}
            disabled={isOwned}
            className={`
                w-full mt-2 py-3 text-white font-bold rounded-lg transition-all duration-200 ease-in-out
                ${isOwned 
                    ? 'bg-text-terciary cursor-not-allowed' 
                    : 'bg-accent hover:bg-accent-hover shadow-lg shadow-accent/20 transform active:scale-95'
                }
            `}
        >
            {isOwned ? t('minerCard.alreadyOwned', 'ADQUIRIDO') : t('minerCard.buyNow', 'COMPRAR AHORA')}
        </button>
    </motion.div>
  );
};

// Se mantiene el nombre de exportación original por compatibilidad con los archivos que lo importan.
export default MinerCard;