// --- START OF FILE SelectNetworkPage.jsx ---

// RUTA: frontend/src/pages/SelectNetworkPage.jsx (NUEVA PÁGINA)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiCheckCircle, HiArrowLeft } from 'react-icons/hi2';

// Componente interno para cada tarjeta de red
const NetworkCard = ({ networkInfo, isSelected, onClick }) => (
  <motion.button
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    onClick={onClick}
    className={`w-full flex items-center p-4 rounded-2xl border-2 text-left transition-all duration-200
      ${isSelected 
        ? 'bg-accent/10 border-accent shadow-lg shadow-accent/10' 
        : 'bg-surface border-border hover:border-border/50'
      }`
    }
  >
    <img src={networkInfo.icon} alt={networkInfo.name} className="w-10 h-10 mr-4" />
    <div className="flex-grow">
      <p className="font-bold text-text-primary text-lg">{networkInfo.fullName}</p>
      <p className="text-sm text-text-secondary">{networkInfo.network}</p>
    </div>
    {isSelected && <HiCheckCircle className="w-6 h-6 text-accent flex-shrink-0" />}
  </motion.button>
);

const SelectNetworkPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  const networks = [
    { id: 'usdt-bep20', name: 'USDT', fullName: 'BNB Smart Chain', network: 'BEP20 (BSC)', icon: '/assets/images/networks/bnb.png' },
    { id: 'usdt-trc20', name: 'USDT', fullName: 'TRON Network', network: 'TRC20', icon: '/assets/images/networks/tron.png' },
    // Puede añadir más redes aquí en el futuro
  ];

  const handleContinue = () => {
    if (!selectedNetwork) return;
    // Navegamos a la siguiente página, pasando la información de la red seleccionada
    navigate('/deposit/address', { state: { network: selectedNetwork } });
  };
  
  const listVariants = { visible: { transition: { staggerChildren: 0.1 } }, hidden: {} };

  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 p-4 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 mr-2"><HiArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-xl font-bold">{t('deposit.selectNetwork.title', 'Seleccionar Red')}</h1>
      </header>
      
      <main className="flex-grow flex flex-col gap-6 p-4 overflow-y-auto no-scrollbar">
        <p className="text-text-secondary text-sm">
          {t('deposit.selectNetwork.warning', 'Elija la red correcta para depositar sus activos. Enviar a una red incorrecta puede resultar en la pérdida de sus fondos.')}
        </p>

        <motion.div className="space-y-3" initial="hidden" animate="visible" variants={listVariants}>
          {networks.map(net => (
            <NetworkCard 
              key={net.id} 
              networkInfo={net} 
              isSelected={selectedNetwork?.id === net.id}
              onClick={() => setSelectedNetwork(net)}
            />
          ))}
        </motion.div>
      </main>

      <footer className="p-4 border-t border-border bg-background">
        <button 
          onClick={handleContinue}
          disabled={!selectedNetwork}
          className="w-full p-4 rounded-xl bg-accent text-white font-bold text-lg transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('common.continue', 'Continuar')}
        </button>
      </footer>
    </div>
  );
};

export default SelectNetworkPage;

// --- END OF FILE SelectNetworkPage.jsx ---