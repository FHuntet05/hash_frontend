// RUTA: frontend/src/components/factories/FactoryCard.jsx (DISEÑO CRISTALINO)

import React from 'react';
import { useTranslation } from 'react-i18next';

const FactoryCard = ({ factory, onBuyClick, isOwned }) => {
  const { t } = useTranslation();

  return (
    <div 
      className={`
        bg-card/70 backdrop-blur-md rounded-2xl p-5 border flex flex-col gap-4 text-text-primary shadow-medium
        ${isOwned ? 'border-accent-primary/20' : 'border-white/20'}
      `}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold">{factory.name}</h3> 
        </div>
        <img 
          src={factory.imageUrl || '/assets/images/tool-placeholder.png'} 
          alt={factory.name} 
          className={`w-16 h-16 object-contain flex-shrink-0 transition-opacity ${isOwned ? 'opacity-50' : ''}`}
        />
      </div>

      <div className="space-y-2 text-sm border-t border-border pt-3">
        <div className="flex justify-between">
          <span className="text-text-secondary">{t('factoryCard.dailyProduction', 'Producción Diaria')}</span> 
          <span className="font-semibold text-accent-secondary">{factory.dailyProduction || 0} USDT</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">{t('factoryCard.lifespan', 'Vida Útil')}</span>
          <span className="font-semibold">{factory.durationDays || 0} {t('factoryCard.days', 'Días')}</span>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-text-secondary">{t('factoryCard.price', 'Precio')}</span>
          <span className="font-bold text-2xl text-text-primary">{factory.price || 0} USDT</span>
        </div>
      </div>
      
      <button 
        onClick={() => onBuyClick(factory)}
        disabled={isOwned}
        className={`
          w-full mt-2 py-3 text-white font-bold rounded-full transition-all duration-150
          ${isOwned 
            ? 'bg-text-tertiary cursor-not-allowed' 
            : 'bg-accent-primary hover:bg-accent-primary-hover shadow-subtle transform active:scale-95'
          }
        `}
      >
        {isOwned ? t('factoryCard.owned', 'ADQUIRIDA') : t('factoryCard.buyNow', 'COMPRAR AHORA')}
      </button>
    </div>
  );
};

export default FactoryCard;