// RUTA: frontend/src/components/factories/FactoryPurchaseModal.jsx (NUEVO, ANTES PurchaseModal.jsx)
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiXMark, HiOutlineCurrencyDollar, HiMinus, HiPlus, HiOutlineCreditCard } from 'react-icons/hi2';
import useUserStore from '../../store/userStore';
import toast from 'react-hot-toast';
import api from '../../api/axiosConfig';

const FactoryPurchaseModal = ({ factory, onClose }) => {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Asumimos un límite máximo de 20 fábricas por compra única, aunque la lógica de negocio debe validarlo.
  const MAX_QUANTITY = 20; 

  const handleIncrease = () => {
    if (quantity < MAX_QUANTITY) setQuantity(q => q + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const totalCost = (factory?.price || 0) * quantity;
  const userBalance = user?.balance?.usdt || 0;
  const canPayWithBalance = userBalance >= totalCost;

  const handlePurchase = async () => {
    setIsProcessing(true);
    toast.loading('Procesando compra...', { id: 'purchase_request' });
    try {
      // El endpoint de compra ya fue adaptado para el nuevo modelo de datos y lógica de comisiones.
      const response = await api.post('/wallet/purchase-factory', {
        factoryId: factory._id,
        quantity: quantity,
      });

      // Actualizamos el estado del usuario en el store con el objeto devuelto por el backend
      setUser(response.data.user);
      
      toast.success(response.data.message, { id: 'purchase_request' });
      onClose(); // Cierra el modal
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al procesar la compra.';
      toast.error(errorMessage, { id: 'purchase_request' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoToRecharge = () => {
    onClose(); // Cierra el modal de compra
    // Redirecciona a la página de perfil/billetera para recargar
    navigate('/profile'); 
  };

  const PurchaseContent = () => (
    <>
      {/* Sección de Selección de Cantidad */}
      <div className="flex items-center justify-center my-4 p-3 bg-dark-primary/50 rounded-lg">
        <span className="text-text-secondary mr-4">Cantidad:</span>
        <div className="flex items-center">
            <button onClick={handleDecrease} disabled={quantity <= 1} className="p-2 bg-dark-primary rounded-l-lg disabled:opacity-40 hover:bg-accent-start transition"><HiMinus className="w-5 h-5" /></button>
            <span className="px-4 py-1 bg-dark-primary text-white font-bold text-lg">{quantity}</span>
            <button onClick={handleIncrease} disabled={quantity >= MAX_QUANTITY} className="p-2 bg-dark-primary rounded-r-lg disabled:opacity-40 hover:bg-accent-start transition"><HiPlus className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Sección de Resumen de Pago */}
      <div className="space-y-2 text-sm my-4">
        <div className="flex justify-between items-center bg-dark-primary/50 p-3 rounded-lg">
            <span className="text-text-secondary">Costo Total</span>
            <span className="font-bold text-xl text-white">{totalCost.toFixed(2)} USDT</span>
        </div>
        <div className="flex justify-between items-center bg-dark-primary/50 p-3 rounded-lg">
            <span className="text-text-secondary">Tu Saldo</span>
            <span className={`font-bold text-xl ${canPayWithBalance ? 'text-green-400' : 'text-red-400'}`}>{userBalance.toFixed(2)} USDT</span>
        </div>
      </div>
      
      {/* Sección de Botón de Compra o Recarga */}
      <div className="mt-6">
        {canPayWithBalance ? (
          <button 
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-3 p-3 rounded-full bg-gradient-to-r from-accent-start to-accent-end text-white font-bold disabled:bg-gray-600 disabled:opacity-50 transition-all"
          >
            <HiOutlineCurrencyDollar className="w-6 h-6" />
            <span>Compra Ya ({totalCost.toFixed(2)} USDT)</span>
          </button>
        ) : (
          <button 
            onClick={handleGoToRecharge}
            className="w-full flex items-center justify-center gap-3 p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold transition-all"
          >
            <HiOutlineCreditCard className="w-6 h-6" />
            <span>Saldo Insuficiente. Ir a Recargar</span>
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in-fast" onClick={onClose}>
        <motion.div
          className="relative bg-dark-secondary border border-white/10 rounded-2xl w-full max-w-sm text-white p-6"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <button className="absolute top-4 right-4 text-text-secondary hover:text-white" onClick={onClose}><HiXMark className="w-6 h-6" /></button>
          
          <h2 className="text-xl font-bold text-center mb-2">{factory.name}</h2>
          <img src={factory.imageUrl || '/assets/images/tool-placeholder.png'} alt={factory.name} className="w-20 h-20 mx-auto my-4 object-contain" />

          {/* Contenido del modal con scrollable */}
          <div className="overflow-y-auto max-h-[70vh]">
            <PurchaseContent />
          </div>
        </motion.div>
    </div>
  );
};

export default FactoryPurchaseModal;