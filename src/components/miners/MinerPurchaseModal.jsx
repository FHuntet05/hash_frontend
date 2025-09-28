// RUTA: frontend/src/components/modals/MinerPurchaseModal.jsx (v4.1 - SEMÁNTICA "MINER" COMPLETA)

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HiXMark, HiMinus, HiPlus, HiOutlineCurrencyDollar } from 'react-icons/hi2';
import useUserStore from '../../store/userStore';
import toast from 'react-hot-toast';
import api from '../../api/axiosConfig';

const MinerPurchaseModal = ({ miner, onClose, onGoToDeposit }) => {
  const { user, setUser } = useUserStore();
  const { t } = useTranslation();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const MAX_QUANTITY = 20;

  const handleIncrease = () => setQuantity(q => Math.min(q + 1, MAX_QUANTITY));
  const handleDecrease = () => setQuantity(q => Math.max(q - 1, 1));

  // --- INICIO DE CORRECCIÓN CRÍTICA ---
  // Se añade una guarda para el caso de que la prop 'miner' sea nula
  // y así evitar un crash si el componente se renderiza incorrectamente.
  if (!miner) {
    return null;
  }
  // --- FIN DE CORRECCIÓN CRÍTICA ---

  const totalCost = (miner.price || 0) * quantity;
  const userBalance = user?.balance?.usdt || 0;
  const canPayWithBalance = userBalance >= totalCost;

  const handlePurchase = async () => {
    setIsProcessing(true);
    const purchaseToastId = 'purchase_request';
    toast.loading(t('minerPurchaseModal.toasts.purchasing', 'Procesando compra...'), { id: purchaseToastId });
    
    try {
      // --- INICIO DE CORRECCIÓN DE ENDPOINT Y PAYLOAD ---
      // Se apunta al nuevo endpoint del backend que ya fue refactorizado.
      // Se envía 'factoryId' porque el backend (walletController) aún lo espera con ese nombre.
      const response = await api.post('/wallet/purchase-miner', {
        factoryId: miner._id,
        quantity: quantity,
      });
      // --- FIN DE CORRECCIÓN ---
      
      setUser(response.data.user);
      toast.success(t('minerPurchaseModal.toasts.purchaseSuccess', '¡Compra exitosa!'), { id: purchaseToastId });
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || t('common.error');
      
      if (errorMessage.includes('insuficiente')) {
          toast.error(t('minerPurchaseModal.toasts.insufficientFunds', 'Saldo insuficiente. Redirigiendo a depósito...'), { id: purchaseToastId });
          setTimeout(() => {
            onGoToDeposit();
          }, 1500);
      } else {
          toast.error(errorMessage, { id: purchaseToastId });
          setIsProcessing(false);
      }
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
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}
    >
      <motion.div
        className="relative bg-surface/80 backdrop-blur-xl rounded-2xl w-full max-w-sm text-text-primary border border-border shadow-medium flex flex-col max-h-[90vh]"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 p-6 pb-4 border-b border-border">
            <button className="absolute top-4 right-4 text-text-secondary hover:text-text-primary" onClick={onClose}>
                <HiXMark className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-center">{miner.name}</h2>
            <img src={miner.imageUrl || '/assets/images/tool-placeholder.png'} alt={miner.name} className="w-20 h-20 mx-auto mt-2 object-contain" />
        </header>
        
        <main className="flex-grow p-6 overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-center">
                <span className="text-text-secondary mr-4">{t('minerPurchaseModal.quantity', 'Cantidad:')}</span>
                <div className="flex items-center bg-background rounded-lg border border-border">
                    <button onClick={handleDecrease} disabled={quantity <= 1 || isProcessing} className="p-2 disabled:opacity-40 hover:bg-surface transition rounded-l-lg"><HiMinus className="w-5 h-5" /></button>
                    <span className="px-5 py-1 text-text-primary font-bold text-lg">{quantity}</span>
                    <button onClick={handleIncrease} disabled={quantity >= MAX_QUANTITY || isProcessing} className="p-2 disabled:opacity-40 hover:bg-surface transition rounded-r-lg"><HiPlus className="w-5 h-5" /></button>
                </div>
            </div>

            <div className="space-y-2 text-sm mt-6">
                <div className="flex justify-between items-center bg-background p-3 rounded-lg border border-border">
                    <span className="text-text-secondary">{t('minerPurchaseModal.totalCost', 'Costo Total')}</span>
                    <span className="font-bold text-xl text-text-primary">{totalCost.toFixed(2)} USDT</span>
                </div>
                <div className="flex justify-between items-center bg-background p-3 rounded-lg border border-border">
                    <span className="text-text-secondary">{t('minerPurchaseModal.yourBalance', 'Tu Saldo')}</span>
                    <span className={`font-bold text-xl ${canPayWithBalance ? 'text-status-success' : 'text-status-danger'}`}>{userBalance.toFixed(2)} USDT</span>
                </div>
            </div>
        </main>
        
        <footer className="flex-shrink-0 p-6 pt-4 border-t border-border">
             <button 
                onClick={handlePurchase} 
                disabled={isProcessing} 
                className="w-full flex items-center justify-center gap-3 p-3 rounded-lg bg-accent text-white font-bold disabled:opacity-50 transition-all hover:bg-accent-hover active:scale-95 shadow-lg shadow-accent/20">
                <HiOutlineCurrencyDollar className="w-6 h-6" />
                <span>{t('minerPurchaseModal.buyNow', 'Confirmar Compra')} ({totalCost.toFixed(2)} USDT)</span>
            </button>
        </footer>
      </motion.div>
    </motion.div>
  )
}

// Se exporta con el nombre correcto.
export default MinerPurchaseModal;