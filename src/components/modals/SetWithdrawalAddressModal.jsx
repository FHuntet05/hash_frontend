// RUTA: frontend/src/components/modals/SetWithdrawalAddressModal.jsx (NUEVO COMPONENTE PARA FEATURE-001)

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HiXMark, HiOutlineWallet, HiCheckCircle } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import useUserStore from '../../store/userStore';
import api from '../../api/axiosConfig';

const backdropVariants = { visible: { opacity: 1 }, hidden: { opacity: 0 } };
const modalVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
};

const SetWithdrawalAddressModal = ({ onClose }) => {
  const { t } = useTranslation();
  const { user, setUser } = useUserStore();
  
  const [address, setAddress] = useState(user?.withdrawalAddress?.address || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address) {
      return toast.error(t('setWithdrawalAddressModal.toasts.addressRequired', 'La dirección de la billetera es requerida.'));
    }

    setIsProcessing(true);
    // Llama al nuevo endpoint del backend
    const saveAddressPromise = api.put('/users/withdrawal-address', { address });

    toast.promise(saveAddressPromise, {
      loading: t('setWithdrawalAddressModal.toasts.processing', 'Guardando billetera...'),
      success: (res) => {
        setUser(res.data.user); // Actualiza el estado global del usuario
        onClose(); // Cierra el modal
        return res.data.message; // Muestra el mensaje de éxito
      },
      error: (err) => {
        return err.response?.data?.message || t('setWithdrawalAddressModal.toasts.error', 'Error al guardar la billetera.');
      },
    }).finally(() => {
      setIsProcessing(false);
    });
  };

  const isWalletAlreadySet = user?.withdrawalAddress?.isSet;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}
    >
      <motion.div
        className="relative bg-surface/80 backdrop-blur-lg rounded-2xl w-full max-w-sm text-text-primary border border-border shadow-medium flex flex-col max-h-[90vh]"
        variants={modalVariants} onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 p-6 pb-4">
            <button className="absolute top-4 right-4 text-text-secondary hover:text-text-primary" onClick={onClose}><HiXMark className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold text-center">
              {isWalletAlreadySet ? t('setWithdrawalAddressModal.titleEdit', 'Actualizar Billetera de Retiro') : t('setWithdrawalAddressModal.titleSet', 'Configurar Billetera de Retiro')}
            </h2>
            <p className="text-sm text-center text-text-secondary mt-1">
              {t('setWithdrawalAddressModal.subtitle', 'Esta dirección se usará para todos tus retiros.')}
            </p>
        </header>
        
        <main className="flex-grow p-6 pt-2 overflow-y-auto no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-text-secondary mb-1 block" htmlFor="walletAddress">{t('setWithdrawalAddressModal.addressLabel', 'Dirección de Billetera (USDT BEP20)')}</label>
              <div className="relative">
                <HiOutlineWallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input 
                  id="walletAddress"
                  type="text" 
                  placeholder={t('setWithdrawalAddressModal.addressPlaceholder', 'Pega tu dirección aquí')}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)} 
                  className="w-full bg-background/50 p-3 pl-10 rounded-lg border border-border focus:border-accent focus:ring-accent focus:ring-1 transition-colors" 
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isProcessing} 
                className="w-full py-3 bg-accent text-white font-bold rounded-full disabled:opacity-50 hover:bg-accent-hover active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? t('common.saving', 'Guardando...') : (
                  <>
                    <HiCheckCircle className="w-5 h-5" />
                    {t('setWithdrawalAddressModal.saveButton', 'Guardar Billetera')}
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
        
        <footer className="flex-shrink-0 p-6 pt-0">
            <div className="text-xs text-center text-text-secondary">
              <p>{t('setWithdrawalAddressModal.notice', 'Asegúrate de que la dirección sea correcta y pertenezca a la red BEP20.')}</p>
            </div>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default SetWithdrawalAddressModal;