import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HiXMark, HiOutlineWallet, HiCheckCircle } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import useUserStore from '../../store/userStore';
import api from '../../api/axiosConfig';

const SetWithdrawalAddressModal = ({ onClose }) => {
  const { t } = useTranslation();
  const { user, setUser } = useUserStore();
  
  const [address, setAddress] = useState(user?.withdrawalAddress?.address || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica Frontend
    if (!address) {
      return toast.error('La dirección es requerida.');
    }
    if (address.length < 25) { // Longitud mínima segura para evitar errores de dedo
      return toast.error('Dirección demasiado corta para ser válida.');
    }

    setIsProcessing(true);
    
    // Usamos api.put hacia /users/withdrawal-address
    const saveAddressPromise = api.put('/users/withdrawal-address', { address });

    toast.promise(saveAddressPromise, {
      loading: 'Verificando y guardando...',
      success: (res) => {
        setUser(res.data.user);
        onClose();
        return 'Billetera vinculada exitosamente';
      },
      error: (err) => {
        console.error(err);
        return err.response?.data?.message || 'Error de conexión';
      },
    }).finally(() => {
      setIsProcessing(false);
    });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
    >
      <motion.div
        className="relative bg-surface w-full max-w-sm rounded-3xl text-white border border-white/10 shadow-2xl flex flex-col overflow-hidden"
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#111827] p-6 text-center border-b border-white/5 relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={onClose}><HiXMark className="w-6 h-6" /></button>
            <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-500/20">
              <HiOutlineWallet className="w-7 h-7 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold">Billetera de Retiro</h2>
            <p className="text-xs text-gray-400 mt-1">Tus fondos serán enviados aquí.</p>
        </div>
        
        <main className="p-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 mb-1 block uppercase">Dirección USDT (BEP20/TRC20)</label>
              <div className="relative">
                <HiOutlineWallet className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value.trim())} 
                  placeholder="0x..."
                  rows={2}
                  className="w-full bg-background border border-border rounded-xl p-3 pl-10 text-sm font-mono text-white focus:border-accent focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            <button 
                type="submit" 
                disabled={isProcessing} 
                className="w-full py-3.5 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
            >
                {isProcessing ? 'Guardando...' : 'GUARDAR BILLETERA'}
            </button>
          </form>
        </main>
        
        <footer className="p-4 pt-0 text-center">
            <p className="text-[10px] text-gray-500">
                Verifica bien la dirección. Los retiros a direcciones incorrectas no son recuperables.
            </p>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default SetWithdrawalAddressModal;