import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiXMark, HiLockClosed, HiKey, HiShieldCheck } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../api/axiosConfig';
import useUserStore from '../../store/userStore';

const SetWithdrawalPasswordModal = ({ onClose }) => {
  const { user, setUser } = useUserStore();
  // Detectar si ya tiene contraseña configurada
  const isSetupMode = !user?.isWithdrawalPasswordSet;

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (password.length < 6) return toast.error('Mínimo 6 caracteres');
    if (password !== confirm) return toast.error('Las contraseñas no coinciden');
    // Si no es modo setup (es cambio), exigir contraseña actual
    if (!isSetupMode && !currentPassword) return toast.error('Ingresa tu contraseña actual');
    
    setLoading(true);
    try {
      const payload = { 
          withdrawalPassword: password, // Nueva contraseña
          currentPassword: isSetupMode ? undefined : currentPassword // Solo enviar si no es setup
      };

      // Endpoint: /users/withdrawal-password
      const { data } = await api.put('/users/withdrawal-password', payload);
      
      setUser(data.user);
      toast.success(isSetupMode ? 'Contraseña creada exitosamente' : 'Contraseña actualizada');
      onClose();
    } catch (error) {
      console.error("Error setting password:", error);
      toast.error(error.response?.data?.message || 'Error al guardar');
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
                {isSetupMode ? <HiLockClosed className="w-8 h-8 text-accent" /> : <HiShieldCheck className="w-8 h-8 text-green-500" />}
            </div>
            <h2 className="text-lg font-bold text-white">
                {isSetupMode ? 'Crear PIN de Retiro' : 'Cambiar PIN'}
            </h2>
            <p className="text-xs text-text-secondary mt-1">
                {isSetupMode ? 'Establece un código de seguridad único.' : 'Actualiza tu seguridad periódicamente.'}
            </p>
        </div>

        <div className="p-6 space-y-4">
            
            {/* Campo Contraseña Actual (Solo si YA tiene contraseña) */}
            {!isSetupMode && (
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-secondary uppercase ml-1">Contraseña Actual</label>
                    <div className="relative">
                        <HiLockClosed className="absolute left-3 top-3 text-text-secondary w-5 h-5" />
                        <input 
                            type="password" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••"
                            className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-accent outline-none transition-colors"
                        />
                    </div>
                </div>
            )}

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
                <label className="text-[10px] font-bold text-text-secondary uppercase ml-1">Confirmar</label>
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