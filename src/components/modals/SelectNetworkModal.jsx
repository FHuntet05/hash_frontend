// RUTA: frontend/src/components/modals/SelectNetworkModal.jsx (v1.3 - CIERRE EN CASCADA)

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HiXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../api/axiosConfig';
import Loader from '../common/Loader';
import DirectDepositModal from './DirectDepositModal';
import { STATIC_DEPOSIT_ADDRESSES } from '../../config/depositConfig';

const NetworkButton = ({ icon, name, network, onClick }) => (
  <button
    onClick={() => onClick({ name, network, type: network.includes('BEP20') && name === 'USDT' ? 'dynamic' : 'static' })}
    className="w-full flex items-center p-4 bg-card/70 backdrop-blur-md rounded-2xl border border-border shadow-subtle text-left hover:border-accent-primary/50 transition-colors duration-200 active:bg-accent-primary/10"
  >
    <img src={icon} alt={name} className="w-8 h-8 mr-4" />
    <div className="flex-grow">
      <p className="font-semibold text-text-primary">{name}</p>
      <p className="text-xs text-text-secondary">{network}</p>
    </div>
  </button>
);

const backdropVariants = { visible: { opacity: 1 }, hidden: { opacity: 0 } };
const modalVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
};

const SelectNetworkModal = ({ onClose }) => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [paymentInfo, setPaymentInfo] = React.useState(null);
  const [isDepositModalOpen, setDepositModalOpen] = React.useState(false);

  const networks = [
    { name: 'USDT', network: 'BEP20 (BSC)', icon: '/assets/images/networks/bep20-usdt.png' },
    { name: 'USDT', network: 'TRC20', icon: '/assets/images/networks/trc20-usdt.png' },
    { name: 'BNB', network: 'BEP20 (BSC)', icon: '/assets/images/networks/bnb.png' },
    { name: 'Tron', network: 'TRC20', icon: '/assets/images/networks/tron.png' },
  ];

  const handleNetworkSelect = async ({ name, network, type }) => {
    if (type === 'dynamic') {
      setIsProcessing(true);
      toast.loading(t('profilePage.toasts.generatingAddress'), { id: 'deposit_address' });
      try {
        const response = await api.post('/wallet/create-deposit-address');
        setPaymentInfo(response.data);
        setDepositModalOpen(true);
        toast.success(t('profilePage.toasts.addressGenerated'), { id: 'deposit_address' });
      } catch (error) {
        toast.error(error.response?.data?.message || t('common.error'), { id: 'deposit_address' });
      } finally {
        setIsProcessing(false);
      }
    } else {
      const addressKey = network.includes('TRC20') ? (name === 'USDT' ? 'USDT-TRC20' : 'TRON') : 'BNB';
      const staticAddress = STATIC_DEPOSIT_ADDRESSES[addressKey];
      if (staticAddress) {
        setPaymentInfo({
          paymentAddress: staticAddress,
          currency: name,
          network: network,
        });
        setDepositModalOpen(true);
      } else {
        toast.error(t('selectNetworkModal.addressNotConfigured'));
      }
    }
  };

  // --- INICIO DE LA CORRECCIÓN DE LÓGICA DE CIERRE ---
  // Si el modal de depósito está abierto, este componente se convierte en un simple
  // contenedor para él, pasando la función de cierre correcta.
  if (isDepositModalOpen) {
    return (
        <DirectDepositModal 
            paymentInfo={paymentInfo} 
            // La función de cierre ahora es simplemente la función 'onClose' del padre.
            // Esto asegura que al cerrar el modal de depósito, se cierre toda la secuencia.
            onClose={onClose}
        />
    );
  }
  // --- FIN DE LA CORRECCIÓN DE LÓGICA DE CIERRE ---

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}
    >
      <motion.div
        className="relative bg-card/80 backdrop-blur-lg rounded-2xl w-full max-w-sm text-text-primary border border-border shadow-medium flex flex-col max-h-[90vh]"
        variants={modalVariants} onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 p-6 pb-4">
          <button className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary" onClick={onClose}><HiXMark className="w-6 h-6" /></button>
          <h2 className="text-xl font-bold text-center">{t('selectNetworkModal.title')}</h2>
          <p className="text-sm text-center text-text-secondary mt-1">{t('selectNetworkModal.subtitle')}</p>
        </header>

        <main className="flex-grow p-6 pt-2 overflow-y-auto no-scrollbar">
          {isProcessing ? (
            <div className="flex justify-center items-center h-32">
              <Loader text={t('selectNetworkModal.processing')} />
            </div>
          ) : (
            <div className="space-y-3">
              {networks.map(net => (
                <NetworkButton key={`${net.network}-${net.name}`} {...net} onClick={handleNetworkSelect} />
              ))}
            </div>
          )}
        </main>
      </motion.div>
    </motion.div>
  );
};

export default SelectNetworkModal;