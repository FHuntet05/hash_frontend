import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
    HiXMark, HiMinus, HiPlus, 
    HiOutlineCurrencyDollar, HiBolt, HiCpuChip 
} from 'react-icons/hi2';
import useUserStore from '../../store/userStore';
import toast from 'react-hot-toast';
import api from '../../api/axiosConfig';

const MinerPurchaseModal = ({ miner, onClose, onGoToDeposit }) => {
  const { user, setUser } = useUserStore();
  const { t } = useTranslation();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const MAX_QUANTITY = 50;

  if (!miner) return null;

  const handleIncrease = () => setQuantity(q => Math.min(q + 1, MAX_QUANTITY));
  const handleDecrease = () => setQuantity(q => Math.max(q - 1, 1));

  // Cálculos
  const totalCost = (miner.price || 0) * quantity;
  const userBalance = user?.balance?.usdt || 0;
  const canPayWithBalance = userBalance >= totalCost;
  
  // FÓRMULA VISUAL: 1 USDT Prod = 100 GH/s
  const singlePower = (miner.dailyProduction || 0) * 100;
  const totalPower = singlePower * quantity;

  const handlePurchase = async () => {
    setIsProcessing(true);
    const purchaseToastId = 'purchase_request';
    toast.loading('Procesando transacción...', { id: purchaseToastId });
    
    try {
      const response = await api.post('/wallet/purchase-miner', {
        factoryId: miner._id,
        quantity: quantity,
      });
      
      setUser(response.data.user);
      toast.success('¡Potencia adquirida!', { id: purchaseToastId });
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error en la compra';
      
      if (errorMessage.toLowerCase().includes('saldo') || errorMessage.toLowerCase().includes('insuficiente')) {
          toast.error('Saldo insuficiente. Redirigiendo...', { id: purchaseToastId });
          setTimeout(() => {
            onGoToDeposit();
          }, 1000);
      } else {
          toast.error(errorMessage, { id: purchaseToastId });
          setIsProcessing(false);
      }
    }
  };
  
  const backdropVariants = { visible: { opacity: 1 }, hidden: { opacity: 0 } };
  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 50 },
    visible: { scale: 1, opacity: 1, y: 0, transition: { type: 'spring', damping: 25 } },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}
    >
      <motion.div
        className="relative bg-[#111827] rounded-3xl w-full max-w-sm text-white border border-white/10 shadow-2xl flex flex-col overflow-hidden"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fondo Decorativo */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>

        <header className="flex-shrink-0 p-6 pb-0 text-center relative z-10">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" onClick={onClose}>
                <HiXMark className="w-6 h-6" />
            </button>
            
            <div className="w-20 h-20 mx-auto bg-surface rounded-2xl p-2 border border-white/5 shadow-lg mb-3 flex items-center justify-center">
                <img src={miner.imageUrl || '/assets/images/vip1-logo.png'} alt={miner.name} className="w-full h-full object-contain" />
            </div>
            
            <h2 className="text-xl font-bold tracking-tight">{miner.name}</h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Módulo de Minería</p>
        </header>
        
        <main className="p-6">
            
            {/* --- VISUALIZADOR DE POTENCIA (NUEVO) --- */}
            <div className="flex justify-center mb-6">
                <div className="flex items-center gap-3 bg-accent/10 border border-accent/20 px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                    <HiBolt className="text-accent w-5 h-5 animate-pulse" />
                    <div className="text-center">
                        <span className="block text-xl font-bold text-white leading-none">
                            {totalPower.toFixed(0)} <span className="text-sm font-normal text-gray-300">GH/s</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Selector de Cantidad */}
            <div className="flex items-center justify-between bg-surface p-2 rounded-xl border border-white/5 mb-4">
                <span className="text-sm text-gray-400 ml-2 font-medium">Cantidad</span>
                <div className="flex items-center gap-3">
                    <button onClick={handleDecrease} disabled={quantity <= 1 || isProcessing} className="p-2 bg-background rounded-lg text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                        <HiMinus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-bold w-6 text-center">{quantity}</span>
                    <button onClick={handleIncrease} disabled={quantity >= MAX_QUANTITY || isProcessing} className="p-2 bg-background rounded-lg text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                        <HiPlus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Resumen Financiero */}
            <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-background rounded-xl border border-white/5">
                    <span className="text-xs text-gray-400">Costo Total</span>
                    <span className="font-bold text-lg text-white">{totalCost.toFixed(2)} USDT</span>
                </div>
                <div className="flex justify-between items-center px-3">
                    <span className="text-xs text-gray-500">Tu Saldo Disponible</span>
                    <span className={`text-xs font-bold ${canPayWithBalance ? 'text-green-400' : 'text-red-400'}`}>
                        {userBalance.toFixed(2)} USDT
                    </span>
                </div>
            </div>
        </main>
        
        <footer className="p-6 pt-0">
             <button 
                onClick={handlePurchase} 
                disabled={isProcessing} 
                className={`
                    w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white transition-all active:scale-[0.98] shadow-lg
                    ${canPayWithBalance 
                        ? 'bg-accent hover:bg-accent-hover shadow-accent/20' 
                        : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                `}>
                {canPayWithBalance ? (
                    <>
                        <HiCpuChip className="w-5 h-5" />
                        <span>CONFIRMAR INSTALACIÓN</span>
                    </>
                ) : (
                    <>
                        <HiOutlineCurrencyDollar className="w-5 h-5" />
                        <span>RECARGAR SALDO</span>
                    </>
                )}
            </button>
        </footer>
      </motion.div>
    </motion.div>
  )
}

export default MinerPurchaseModal;