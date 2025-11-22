import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiXMark, HiLockClosed, HiKey } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../api/axiosConfig';
import useUserStore from '../../store/userStore';

const SetWithdrawalPasswordModal = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useUserStore();

  const handleSubmit = async () => {
    if (password.length < 6) return toast.error('Mínimo 6 caracteres');
    if (password !== confirm) return toast.error('Las contraseñas no coinciden');
    
    setLoading(true);
    try {
      // Ajusta la ruta según tu backend (users/withdrawal-password o similar)
      const { data } = await api.put('/users/withdrawal-password', { withdrawalPassword: password });
      setUser(data.user);
      toast.success('Contraseña de seguridad establecida');
      onClose();
    } catch (error) {
      toast.error('Error al guardar');
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
        className="bg-surface w-full max-w-xs rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="bg-[#111827] p-6 text-center border-b border-white/5 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-white"><HiXMark className="w-6 h-6" /></button>
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-accent/20">
                <HiLockClosed className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-lg font-bold text-white">Seguridad de Retiro</h2>
            <p className="text-xs text-text-secondary mt-1">Crea un PIN único para autorizar salidas de dinero.</p>
        </div>

        <div className="p-6 space-y-4">
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase ml-1">Nueva Contraseña</label>
                <div className="relative">
                    <HiKey className="absolute left-3 top-3 text-text-secondary w-5 h-5" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                        className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-accent outline-none transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase ml-1">Confirmar Contraseña</label>
                <div className="relative">
                    <HiKey className="absolute left-3 top-3 text-text-secondary w-5 h-5" />
                    <input 
                        type="password" 
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="••••••"
                        className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-accent outline-none transition-colors"
                    />
                </div>
            </div>

            <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl shadow-lg shadow-accent/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
                {loading ? 'Guardando...' : 'ESTABLECER SEGURIDAD'}
            </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SetWithdrawalPasswordModal;