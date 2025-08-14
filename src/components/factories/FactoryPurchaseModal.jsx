// RUTA: frontend/src/components/factories/FactoryPurchaseModal.jsx (v3.0 - FLUJO DE COMPRA INTELIGENTE)

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HiXMark, HiMinus, HiPlus, HiOutlineCurrencyDollar } from 'react-icons/hi2';
import useUserStore from '../../store/userStore';
import toast from 'react-hot-toast';
import api from '../../api/axiosConfig';

const FactoryPurchaseModal = ({ factory, onClose, onGoToDeposit }) => {
  const { user, setUser } = useUserStore();
  const { t } = useTranslation();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const MAX_QUANTITY = 20;

  const handleIncrease = () => setQuantity(q => Math.min(q + 1, MAX_QUANTITY));
  const handleDecrease = () => setQuantity(q => Math.max(q - 1, 1));

  const totalCost = (factory?.price || 0) * quantity;
  const userBalance = user?.balance?.usdt || 0;
  const canPayWithBalance = userBalance >= totalCost;

  // --- INICIO DE MODIFICACIÓN: Lógica de compra revisada ---
  const handlePurchase = async () => {
    setIsProcessing(true);
    const purchaseToastId = 'purchase_request';
    toast.loading(t('factoryPurchaseModal.toasts.purchasing', 'Procesando compra...'), { id: purchaseToastId });
    
    try {
      const response = await api.post('/wallet/purchase-factory', {
        factoryId: factory._id,
        quantity: quantity,
      });
      setUser(response.data.user);
      toast.success(t('factoryPurchaseModal.toasts.purchaseSuccess', '¡Compra exitosa!'), { id: purchaseToastId });
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || t('common.error');
      
      // Lógica clave: si el error es de saldo insuficiente, iniciamos el flujo de depósito
      if (errorMessage.includes('insuficiente')) {
          toast.error(t('factoryPurchaseModal.toasts.insufficientFunds', 'Saldo insuficiente. Redirigiendo a depósito...'), { id: purchaseToastId });
          // Esperamos un momento para que el usuario lea el toast y luego cambiamos de modal
          setTimeout(() => {
            onGoToDeposit();
          }, 1500);
      } else {
          toast.error(errorMessage, { id: purchaseToastId });
      }
    } finally {
      // No ponemos setIsProcessing(false) aquí para que el modal se cierre o cambie sin que el botón se reactive.
    }
  };
  // --- FIN DE MODIFICACIÓN ---
  
  const backdropVariants = { visible: { opacity: 1 }, hidden: { opacity: 0 } };
  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}
    >
      <motion.div
        className="relative bg-card/80 backdrop-blur-lg rounded-2xl w-full max-w-sm text-text-primary border border-white/20 shadow-medium flex flex-col max-h-[90vh]"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 p-6 pb-4 border-b border-border">
            <button className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary" onClick={onClose}>
                <HiXMark className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-center">{factory.name}</h2>
            <img src={factory.imageUrl || '/assets/images/tool-placeholder.png'} alt={factory.name} className="w-20 h-20 mx-auto mt-2 object-contain" />
        </header>
        
        <main className="flex-grow p-6 overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-center">
                <span className="text-text-secondary mr-4">{t('factoryPurchaseModal.quantity', 'Cantidad:')}</span>
                <div className="flex items-center bg-background/50 rounded-lg border border-border">
                    <button onClick={handleDecrease} disabled={quantity <= 1 || isProcessing} className="p-2 disabled:opacity-40 hover:bg-black/10 transition rounded-l-lg"><HiMinus className="w-5 h-5" /></button>
                    <span className="px-5 py-1 text-text-primary font-bold text-lg">{quantity}</span>
                    <button onClick={handleIncrease} disabled={quantity >= MAX_QUANTITY || isProcessing} className="p-2 disabled:opacity-40 hover:bg-black/10 transition rounded-r-lg"><HiPlus className="w-5 h-5" /></button>
                </div>
            </div>

            <div className="space-y-2 text-sm my-4">
                <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg border border-border">
                    <span className="text-text-secondary">{t('factoryPurchaseModal.totalCost', 'Costo Total')}</span>
                    <span className="font-bold text-xl text-text-primary">{totalCost.toFixed(2)} USDT</span>
                </div>
                <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg border border-border">
                    <span className="text-text-secondary">{t('factoryPurchaseModal.yourBalance', 'Tu Saldo')}</span>
                    <span className={`font-bold text-xl ${canPayWithBalance ? 'text-status-success' : 'text-status-danger'}`}>{userBalance.toFixed(2)} USDT</span>
                </div>
            </div>
        </main>
        
        <footer className="flex-shrink-0 p-6 pt-4 border-t border-border">
             <button 
                onClick={handlePurchase} 
                disabled={isProcessing} 
                className="w-full flex items-center justify-center gap-3 p-3 rounded-full bg-accent-primary text-white font-bold disabled:opacity-50 transition-all hover:bg-accent-primary-hover active:scale-95">
                <HiOutlineCurrencyDollar className="w-6 h-6" />
                <span>{t('factoryPurchaseModal.buyNow', 'Comprar Ya')} ({totalCost.toFixed(2)} USDT)</span>
            </button>
        </footer>
      </motion.div>
    </motion.div>
  )
}

export default FactoryPurchaseModal;