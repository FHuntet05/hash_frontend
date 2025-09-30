// --- START OF FILE SelectNetworkPage.jsx ---

// RUTA: frontend/src/pages/SelectNetworkPage.jsx (v2.0 - DISEÑO DE REFERENCIA FINAL)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiChevronRight } from 'react-icons/hi2';

// Componente para cada tarjeta de red, ahora con navegación directa
const NetworkCard = ({ networkInfo, onClick }) => (
  <motion.button
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    onClick={onClick}
    className="w-full flex items-center p-4 rounded-2xl border border-border bg-surface hover:border-accent/50 transition-colors duration-200"
  >
    <img src={networkInfo.icon} alt={networkInfo.name} className="w-10 h-10 mr-4" />
    <div className="flex-grow text-left">
      <p className="font-bold text-text-primary text-lg">{networkInfo.fullName}</p>
      <p className="text-sm text-text-secondary">{networkInfo.network}</p>
    </div>
    <HiChevronRight className="w-6 h-6 text-text-secondary flex-shrink-0" />
  </motion.button>
);

const SelectNetworkPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Se restauran todas las redes del modal original
  const networks = [
    { id: 'usdt-bep20', name: 'USDT', fullName: 'USDT', network: 'BEP20 (BSC)', icon: '/assets/images/networks/bep20-usdt.png', type: 'dynamic' },
    { id: 'usdt-trc20', name: 'USDT', fullName: 'TRON Network', network: 'TRC20', icon: '/assets/images/networks/tron.png', type: 'static' },
    { id: 'bnb-bep20', name: 'BNB', fullName: 'BNB', network: 'BEP20 (BSC)', icon: '/assets/images/networks/bnb.png', type: 'static' },
    { id: 'tron-trc20', name: 'Tron', fullName: 'USDT', network: 'TRC20', icon: '/assets/images/networks/trc20-usdt.png', type: 'static' },
  ];

  const handleNetworkSelect = (network) => {
    // La selección navega directamente a la siguiente página
    navigate('/deposit/address', { state: { network: network } });
  };
  
  const listVariants = { visible: { transition: { staggerChildren: 0.1 } }, hidden: {} };

  return (
    <div className="flex flex-col h-full p-4 pt-6 pb-28">
      <header className="flex-shrink-0 flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="p-2 mr-2"><HiArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-2xl font-bold">{t('deposit.selectNetwork.title', 'Seleccionar Red')}</h1>
      </header>
      
      <main className="flex-grow flex flex-col gap-4 overflow-y-auto no-scrollbar">
        <p className="text-text-secondary text-sm">
          {t('deposit.selectNetwork.warning', 'Elija la red correcta para depositar sus activos. Enviar a una red incorrecta puede resultar en la pérdida de sus fondos.')}
        </p>

        <motion.div className="space-y-3" initial="hidden" animate="visible" variants={listVariants}>
          {networks.map(net => (
            <NetworkCard 
              key={net.id} 
              networkInfo={net} 
              onClick={() => handleNetworkSelect(net)}
            />
          ))}
        </motion.div>
      </main>

      {/* El footer con el botón "Continuar" ha sido eliminado según sus instrucciones */}
    </div>
  );
};

export default SelectNetworkPage;

// --- END OF FILE SelectNetworkPage.jsx ---