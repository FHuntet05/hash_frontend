// RUTA: frontend/src/components/modals/SetWithdrawalPasswordModal.jsx (ENDPOINT CORREGIDO)

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HiXMark, HiShieldCheck } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import useUserStore from '../../store/userStore';
import api from '../../api/axiosConfig';

const backdropVariants = { visible: { opacity: 1 }, hidden: { opacity: 0 } };
const modalVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
};

const SetWithdrawalPasswordModal = ({ onClose }) => {
  const { t } = useTranslation();
  const { user, setUser } = useUserStore();

  const isPasswordSet = user?.isWithdrawalPasswordSet || false;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones (sin cambios)
    if (isPasswordSet && !currentPassword) return toast.error(t('setWithdrawalPasswordModal.toasts.currentRequired', 'La contraseña actual es obligatoria.'));
    if (newPassword.length < 6) return toast.error(t('setWithdrawalPasswordModal.toasts.minLength', 'La nueva contraseña debe tener al menos 6 caracteres.'));
    if (newPassword !== confirmPassword) return toast.error(t('setWithdrawalPasswordModal.toasts.noMatch', 'Las nuevas contraseñas no coinciden.'));

    setIsProcessing(true);
    
    const payload = { newPassword };
    if (isPasswordSet) {
      payload.currentPassword = currentPassword;
    }

    // --- INICIO DE CORRECCIÓN CRÍTICA ---
    // Se ha corregido la ruta del endpoint para que coincida con la API del backend.
    // Antes: '/users/set-withdrawal-password'
    const setPasswordPromise = api.post('/users/withdrawal-password', payload);
    // --- FIN DE CORRECCIÓN CRÍTICA ---

    toast.promise(setPasswordPromise, {
      loading: t('setWithdrawalPasswordModal.toasts.saving', 'Guardando contraseña...'),
      success: (res) => {
        setUser(res.data.user);
        onClose();
        return res.data.message || t('setWithdrawalPasswordModal.toasts.saveSuccess', 'Contraseña guardada con éxito.');
      },
      error: (err) => err.response?.data?.message || t('setWithdrawalPasswordModal.toasts.saveError', 'Error al guardar la contraseña.'),
    }).finally(() => setIsProcessing(false));
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}
    >
      <motion.div
        className="relative bg-card/80 backdrop-blur-lg rounded-2xl w-full max-w-sm text-text-primary border border-white/20 shadow-medium flex flex-col max-h-[90vh]"
        variants={modalVariants} onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 p-6 pb-4">
          <button className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary" onClick={onClose}><HiXMark className="w-6 h-6" /></button>
          <h2 className="text-xl font-bold text-center">
            {isPasswordSet 
              ? t('setWithdrawalPasswordModal.title_change', 'Cambiar Contraseña de Retiro') 
              : t('setWithdrawalPasswordModal.title_set', 'Configurar Contraseña de Retiro')}
          </h2>
        </header>

        <form onSubmit={handleSubmit}>
          <main className="flex-grow p-6 pt-2 overflow-y-auto no-scrollbar space-y-4">
            <p className="text-sm text-center text-text-secondary">
              {isPasswordSet
                ? t('setWithdrawalPasswordModal.intro_change', 'Introduce tu contraseña actual para establecer una nueva.')
                : t('setWithdrawalPasswordModal.intro_set', 'Esta contraseña se usará para autorizar todos tus retiros. Guárdala en un lugar seguro.')
              }
            </p>

            {isPasswordSet && (
              <div>
                <label className="text-sm text-text-secondary mb-1 block">{t('setWithdrawalPasswordModal.currentPassword_label', 'Contraseña Actual')}</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full bg-background/50 p-3 rounded-lg border border-border" />
              </div>
            )}
            
            <div>
              <label className="text-sm text-text-secondary mb-1 block">{t('setWithdrawalPasswordModal.newPassword_label', 'Nueva Contraseña (mín. 6 caracteres)')}</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-background/50 p-3 rounded-lg border border-border" />
            </div>

            <div>
              <label className="text-sm text-text-secondary mb-1 block">{t('setWithdrawalPasswordModal.confirmPassword_label', 'Confirmar Nueva Contraseña')}</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-background/50 p-3 rounded-lg border border-border" />
            </div>
          </main>

          <footer className="flex-shrink-0 p-6 pt-4 border-t border-border">
            <button type="submit" disabled={isProcessing} className="w-full py-3 bg-accent-primary text-white text-lg font-bold rounded-full disabled:opacity-50 hover:bg-accent-primary-hover active:scale-95 transition-all">
              {isProcessing ? t('common.saving', 'Guardando...') : t('setWithdrawalPasswordModal.saveButton', 'Guardar Contraseña')}
            </button>
          </footer>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SetWithdrawalPasswordModal;