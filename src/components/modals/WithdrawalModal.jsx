import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HiXMark, HiArrowUpTray, HiWallet, HiLockClosed } from 'react-icons/hi2';
import useUserStore from '../../store/userStore';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const WithdrawalModal = ({ onClose }) => {
  const { t } = useTranslation();
  const { user, setUser } = useUserStore();
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!amount || !password) return toast.error('Completa todos los campos');
    setLoading(true);
    try {
        const { data } = await api.post('/wallet/request-withdrawal', { amount, withdrawalPassword: password });
        setUser(data.user);
        toast.success('Solicitud de retiro enviada');
        onClose();
    } catch (error) {
        toast.error(error.response?.data?.message || 'Error en retiro');
    } finally {
        setLoading(false);
    }
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-surface w-full max-w-sm rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Header Naranja */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white relative">
            <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 p-1 rounded-full hover:bg-black/40"><HiXMark /></button>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl"><HiArrowUpTray className="w-6 h-6" /></div>
                <div>
                    <h2 className="text-lg font-bold">Retirar Fondos</h2>
                    <p className="text-xs opacity-80">Transferencia a Billetera Externa</p>
                </div>
            </div>
        </div>

        <div className="p-6 space-y-4">
            {/* Info Saldo */}
            <div className="flex justify-between items-center bg-background p-3 rounded-xl border border-white/5">
                <span className="text-xs text-text-secondary">Disponible</span>
                <span className="text-lg font-bold text-white">{user.balance.usdt.toFixed(2)} USDT</span>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
                <div>
                    <label className="text-xs font-bold text-text-secondary ml-1 mb-1 block">Monto a Retirar</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-background border border-border rounded-xl py-3 pl-4 pr-12 text-white focus:border-accent outline-none font-mono"
                            placeholder="0.00"
                        />
                        <span className="absolute right-4 top-3.5 text-xs font-bold text-text-secondary">USDT</span>
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-text-secondary ml-1 mb-1 block">Contraseña de Retiro</label>
                    <div className="relative">
                        <HiLockClosed className="absolute left-4 top-3.5 text-text-secondary" />
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-white focus:border-accent outline-none"
                            placeholder="••••••"
                        />
                    </div>
                </div>
            </div>

            {/* Info Wallet Destino */}
            <div className="flex items-start gap-2 text-[10px] text-text-secondary bg-background/50 p-2 rounded-lg">
                <HiWallet className="mt-0.5" />
                <p>Se enviará a: <span className="text-white font-mono break-all">{user.withdrawalAddress?.address}</span></p>
            </div>

            <button 
                onClick={handleWithdraw} 
                disabled={loading}
                className="w-full py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl shadow-lg shadow-accent/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Procesando...' : 'CONFIRMAR RETIRO'}
            </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WithdrawalModal;