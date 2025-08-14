// RUTA: frontend/src/components/factories/FactoryPurchaseModal.jsx (v2.0 - NUEVO FLUJO DE RECARGA)

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HiXMark, HiMinus, HiPlus, HiOutlineCurrencyDollar, HiOutlineCreditCard } from 'react-icons/hi2';
import useUserStore from '../../store/userStore';
import toast from 'react-hot-toast';
import api from '../../api/axiosConfig';

// --- INICIO DE MODIFICACIÓN: Se añade la prop 'onGoToDeposit' ---
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

  const handlePurchase = async () => {
    setIsProcessing(true);
    toast.loading(t('factoryPurchaseModal.toasts.purchasing', 'Procesando compra...'), { id: 'purchase_request' });
    try {
      const response = await api.post('/wallet/purchase-factory', {
        factoryId: factory._id,
        quantity: quantity,
      });
      setUser(response.data.user);
      toast.success(response.data.message, { id: 'purchase_request' });
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || t('factoryPurchaseModal.toasts.purchaseError', 'Error al procesar la compra.');
      toast.error(errorMessage, { id: 'purchase_request' });
    } finally {
      setIsProcessing(false);
    }
  };
  
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
                    <button onClick={handleDecrease} disabled={quantity <= 1} className="p-2 disabled:opacity-40 hover:bg-black/10 transition rounded-l-lg"><HiMinus className="w-5 h-5" /></button>
                    <span className="px-5 py-1 text-text-primary font-bold text-lg">{quantity}</span>
                    <button onClick={handleIncrease} disabled={quantity >= MAX_QUANTITY} className="p-2 disabled:opacity-40 hover:bg-black/10 transition rounded-r-lg"><HiPlus className="w-5 h-5" /></button>
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
            {/* --- INICIO DE MODIFICACIÓN: Lógica condicional del botón principal --- */}
             {canPayWithBalance ? (
                <button onClick={handlePurchase} disabled={isProcessing} className="w-full flex items-center justify-center gap-3 p-3 rounded-full bg-accent-primary text-white font-bold disabled:opacity-50 transition-all hover:bg-accent-primary-hover active:scale-95">
                    <HiOutlineCurrencyDollar className="w-6 h-6" />
                    <span>{t('factoryPurchaseModal.buyNow', 'Comprar Ya')} ({totalCost.toFixed(2)} USDT)</span>
                </button>
            ) : (
                <button onClick={onGoToDeposit} className="w-full flex items-center justify-center gap-3 p-3 rounded-full bg-accent-tertiary text-white font-bold transition-all hover:bg-accent-tertiary-hover active:scale-95">
                    <HiOutlineCreditCard className="w-6 h-6" />
                    <span>{t('factoryPurchaseModal.rechargeNow', 'Recargar para Comprar')}</span>
                </button>
            )}
            {/* --- FIN DE MODIFICACIÓN --- */}
        </footer>
      </motion.div>
    </motion.div>
  )
}

export default FactoryPurchaseModal;