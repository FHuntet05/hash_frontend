<<<<<<< HEAD
// RUTA: frontend/src/components/factories/FactoryCard.jsx (v3.0 - REDISEÑO "OBSIDIAN BLUE" Y SEMÁNTICA "MINER")
=======
// RUTA: frontend/src/components/factories/FactoryCard.jsx (v3.1 - COMPRA MÚLTIPLE HABILITADA)
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
<<<<<<< HEAD

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
=======
import { FaCoins } from 'react-icons/fa';
import { HiOutlineClock } from 'react-icons/hi2';

const Stat = ({ icon: Icon, value, label }) => (
    <div className="flex flex-col items-center text-center">
        <Icon className="w-5 h-5 mb-1 text-accent-primary opacity-80" />
        <p className="font-bold text-text-primary">{value}</p>
        <p className="text-xs text-text-secondary">{label}</p>
    </div>
);

// --- INICIO DE LA MODIFICACIÓN CRÍTICA ---
// Se ha eliminado la prop 'isOwned' de la desestructuración.
const FactoryCard = ({ factory, onBuyClick }) => {
// --- FIN DE LA MODIFICACIÓN CRÍTICA ---
  const { t } = useTranslation();

  return (
    <motion.div 
      className="bg-card/70 backdrop-blur-md rounded-2xl p-6 border border-border flex flex-col items-center text-center gap-4 shadow-medium transition-all"
      // La animación de hover ahora es incondicional.
      whileHover={{ scale: 1.03 }}
    >
      {/* Se eliminan las clases condicionales de la imagen (grayscale). */}
      <img 
        src={factory.imageUrl || '/assets/images/tool-placeholder.png'} 
        alt={factory.name} 
        className="w-24 h-24 object-contain flex-shrink-0 mb-2"
      />
      <h3 className="text-xl font-bold text-text-primary -mt-2">{factory.name}</h3> 
      
      <div className="w-full flex justify-around items-center py-4 border-y border-border">
        <Stat 
          icon={FaCoins} 
          value={`${factory.dailyProduction || 0} USDT`}
          label={t('factoryCard.daily', 'Diario')}
        />
        <Stat 
          icon={HiOutlineClock} 
          value={t('factoryCard.days', { count: factory.durationDays || 0 })}
          label={t('factoryCard.lifespanSimple', 'Duración')}
        />
      </div>
      
      <div className="flex flex-col items-center">
        <p className="text-sm text-text-secondary">{t('factoryCard.price', 'Precio')}</p>
        <p className="font-bold text-3xl text-accent-primary my-1">{factory.price || 0} <span className="text-xl">USDT</span></p>
      </div>

      {/* --- BOTÓN DE COMPRA AHORA INCONDICIONAL --- */}
      <button 
        onClick={() => onBuyClick(factory)}
        // Se elimina la propiedad 'disabled'.
        // Las clases ahora son fijas, siempre mostrando el estado activo.
        className="w-full mt-2 py-3 text-white font-bold rounded-full transition-all duration-150 bg-accent-primary hover:bg-accent-primary-hover shadow-subtle transform active:scale-95"
      >
        {t('factoryCard.buyNow', 'COMPRAR AHORA')}
      </button>
      {/* --- FIN DE LA MODIFICACIÓN DEL BOTÓN --- */}
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503
    </motion.div>
  );
};

// Se mantiene el nombre de exportación original por compatibilidad con los archivos que lo importan.
export default FactoryCard;