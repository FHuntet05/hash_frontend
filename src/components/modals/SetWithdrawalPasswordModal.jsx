import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiXMark, HiLockClosed, HiKey, HiShieldCheck } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../api/axiosConfig';
import useUserStore from '../../store/userStore';

const SetWithdrawalPasswordModal = ({ onClose }) => {
  const { user, setUser } = useUserStore();
  
  // Si isWithdrawalPasswordSet es false/undefined, estamos en modo CREAR
  const isSetupMode = !user?.isWithdrawalPasswordSet;

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // 1. Limpieza de inputs
    const cleanPass = password.trim();
    const cleanConfirm = confirm.trim();
    
    // 2. Validación Local (Frontend)
    if (cleanPass.length < 6) {
        return toast.error('Frontend: La contraseña debe tener 6 caracteres o más.');
    }
    if (cleanPass !== cleanConfirm) {
        return toast.error('Las contraseñas no coinciden.');
    }
    if (!isSetupMode && !currentPassword) {
        return toast.error('Ingresa tu contraseña actual para autorizar el cambio.');
    }
    
    setLoading(true);
    
    try {
      // 3. Construcción del Payload Blindado
      const payload = { 
          // Enviamos con ambos nombres posibles para asegurar que el controller lo lea
          withdrawalPassword: cleanPass, 
          newPassword: cleanPass,
          
          // Solo enviamos currentPassword si no es la primera vez
          currentPassword: isSetupMode ? undefined : currentPassword 
      };

      console.log("Enviando Payload:", payload); // Debug en consola del navegador

      // 4. Petición PUT
      const { data } = await api.put('/users/withdrawal-password', payload);
      
      // 5. Éxito
      setUser(data.user);
      toast.success(isSetupMode ? '¡PIN de retiro creado!' : 'PIN actualizado correctamente');
      onClose();

    } catch (error) {
      console.error("Error Setting Password:", error);
      const msg = error.response?.data?.message || 'Error al conectar con el servidor';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
    >
      <motion.div 
        className="bg-surface w-full max-w-xs rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#111827] p-6 text-center border-b border-white/5 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors">
                <HiXMark className="w-6 h-6" />
            </button>
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-accent/20 shadow-inner">
                {isSetupMode ? <HiLockClosed className="w-8 h-8 text-accent" /> : <HiShieldCheck className="w-8 h-8 text-green-500" />}
            </div>
            <h2 className="text-lg font-bold text-white">
                {isSetupMode ? 'Crear PIN de Retiro' : 'Cambiar PIN'}
            </h2>
            <p className="text-xs text-text-secondary mt-1">
                {isSetupMode ? 'Este código será necesario para retirar tus fondos.' : 'Ingresa tu PIN actual para autorizar el cambio.'}
            </p>
        </div>

        {/* Formulario */}
        <div className="p-6 space-y-4">
            
            {/* Campo: Contraseña Actual (Solo en cambio) */}
            {!isSetupMode && (
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-secondary uppercase ml-1">PIN Actual</label>
                    <div className="relative group">
                        <HiLockClosed className="absolute left-3 top-3 text-text-secondary w-5 h-5 group-focus-within:text-accent transition-colors" />
                        <input 
                            type="password" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Ingresa tu PIN actual"
                            className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
                        />
                    </div>
                </div>
            )}

            {/* Campo: Nueva Contraseña */}
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase ml-1">Nuevo PIN (Mín. 6 caracteres)</label>
                <div className="relative group">
                    <HiKey className="absolute left-3 top-3 text-text-secondary w-5 h-5 group-focus-within:text-accent transition-colors" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ej: 123456"
                        className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm tracking-widest"
                    />
                </div>
            </div>

            {/* Campo: Confirmar */}
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase ml-1">Confirmar Nuevo PIN</label>
                <div className="relative group">
                    <HiKey className="absolute left-3 top-3 text-text-secondary w-5 h-5 group-focus-within:text-accent transition-colors" />
                    <input 
                        type="password" 
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Repite el PIN"
                        className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm tracking-widest"
                    />
                </div>
            </div>

            {/* Botón Acción */}
            <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 mt-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl shadow-lg shadow-accent/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
                {loading ? (
                    <span className="animate-pulse">Guardando...</span>
                ) : (
                    isSetupMode ? 'ESTABLECER SEGURIDAD' : 'ACTUALIZAR PIN'
                )}
            </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SetWithdrawalPasswordModal;