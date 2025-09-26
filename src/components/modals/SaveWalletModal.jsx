// RUTA: frontend/src/components/modals/SaveWalletModal.jsx (NUEVO COMPONENTE)

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

const SaveWalletModal = ({ onClose }) => {
  const { t } = useTranslation();
  const { user, setUser } = useUserStore();
  
  const [walletAddress, setWalletAddress] = useState(user?.withdrawalWallet?.address || '');
  const [withdrawalPassword, setWithdrawalPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones del frontend para una respuesta rápida al usuario
    if (!walletAddress || !withdrawalPassword) {
      return toast.error(t('saveWalletModal.toasts.allFieldsRequired', 'Todos los campos son obligatorios.'));
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return toast.error(t('saveWalletModal.toasts.invalidAddress', 'El formato de la dirección de billetera no es válido.'));
    }

    setIsProcessing(true);
    const saveWalletPromise = api.put('/users/withdrawal-wallet', {
      walletAddress,
      withdrawalPassword,
    });

    toast.promise(saveWalletPromise, {
      loading: t('saveWalletModal.toasts.processing', 'Guardando billetera...'),
      success: (res) => {
        // Actualizamos el estado global del usuario con la respuesta del backend
        setUser(res.data.user);
        onClose(); // Cerramos el modal en caso de éxito
        return res.data.message; // Mostramos el mensaje de éxito del backend
      },
      error: (err) => {
        // Mostramos el mensaje de error específico del backend
        return err.response?.data?.message || t('saveWalletModal.toasts.error', 'Error al guardar la billetera.');
      },
    }).finally(() => {
      setIsProcessing(false);
    });
  };

  const isWalletAlreadySet = user?.withdrawalWallet?.isSet;

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
            <h2 className="text-xl font-bold text-center">
              {isWalletAlreadySet ? t('saveWalletModal.titleEdit', 'Actualizar Billetera de Retiro') : t('saveWalletModal.titleSet', 'Guardar Billetera de Retiro')}
            </h2>
            <p className="text-sm text-center text-text-secondary mt-1">
              {t('saveWalletModal.subtitle', 'Esta dirección se usará para todos tus retiros.')}
            </p>
        </header>
        
        <main className="flex-grow p-6 pt-2 overflow-y-auto no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-text-secondary mb-1 block" htmlFor="walletAddress">{t('saveWalletModal.addressLabel', 'Dirección de Billetera (USDT BEP20)')}</label>
              <div className="relative">
                <HiOutlineWallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <input 
                  id="walletAddress"
                  type="text" 
                  placeholder={t('saveWalletModal.addressPlaceholder', 'Pega tu dirección 0x...')}
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)} 
                  className="w-full bg-background/50 p-3 pl-10 rounded-lg border border-border focus:border-accent-primary focus:ring-accent-primary focus:ring-1 transition-colors" 
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-text-secondary mb-1 block" htmlFor="withdrawalPassword">{t('saveWalletModal.passwordLabel', 'Confirmar con Contraseña de Retiro')}</label>
              <input 
                id="withdrawalPassword"
                type="password" 
                placeholder="••••••••" 
                value={withdrawalPassword}
                onChange={(e) => setWithdrawalPassword(e.target.value)} 
                className="w-full bg-background/50 p-3 rounded-lg border border-border focus:border-accent-primary focus:ring-accent-primary focus:ring-1 transition-colors" 
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isProcessing} 
                className="w-full py-3 bg-accent-primary text-white font-bold rounded-full disabled:opacity-50 hover:bg-accent-primary-hover active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? t('common.saving', 'Guardando...') : (
                  <>
                    <HiCheckCircle className="w-5 h-5" />
                    {t('saveWalletModal.saveButton', 'Guardar Billetera')}
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
        
        <footer className="flex-shrink-0 p-6 pt-0">
            <div className="text-xs text-center text-text-secondary">
              <p>{t('saveWalletModal.notice', 'Por seguridad, cualquier cambio en tu billetera de retiro requiere confirmar tu contraseña.')}</p>
            </div>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default SaveWalletModal;