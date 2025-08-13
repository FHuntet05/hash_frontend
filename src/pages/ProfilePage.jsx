// RUTA: frontend/src/pages/ProfilePage.jsx (CON OPCIÓN DE CONTRASEÑA DE RETIRO)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    HiOutlineArrowDownOnSquare, 
    HiOutlineArrowUpOnSquare, 
    HiOutlineRectangleStack, 
    HiOutlineUserGroup, 
    HiOutlineQuestionMarkCircle, 
    HiOutlineInformationCircle, 
    HiOutlineChatBubbleLeftRight, 
    HiOutlineLanguage,
    HiOutlineArrowRightOnRectangle,
    HiChevronRight,
    HiOutlineKey // <-- NUEVO ICONO
} from 'react-icons/hi2';

import WithdrawalModal from '../components/modals/WithdrawalModal';
import SetWithdrawalPasswordModal from '../components/modals/SetWithdrawalPasswordModal'; // <-- NUEVO MODAL
import Loader from '../components/common/Loader';

const ActionRow = ({ icon: Icon, label, onClick, hasChevron = true }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center p-4 bg-card/70 backdrop-blur-md rounded-2xl border border-white/20 shadow-subtle text-left hover:border-accent-primary/50 transition-colors duration-200 active:bg-accent-primary/10"
    >
        <Icon className="w-6 h-6 mr-4 text-text-secondary" />
        <span className="flex-grow text-base font-semibold text-text-primary">{label}</span>
        {hasChevron && <HiChevronRight className="w-5 h-5 text-text-tertiary" />}
    </button>
);

const ProfilePage = () => {
    const { user, logout } = useUserStore();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [isWithdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
    // --- NUEVO ESTADO PARA EL MODAL DE CONTRASEÑA ---
    const [isSetPasswordModalOpen, setSetPasswordModalOpen] = useState(false);

    if (!user) {
        return <div className="h-full w-full flex items-center justify-center pt-16"><Loader /></div>;
    }

    const handleWithdrawClick = () => {
        if ((user?.balance?.usdt || 0) < 1.0) {
            toast.error(t('profilePage.toasts.insufficientBalance', { min: "1.00" }));
        } else {
            setWithdrawalModalOpen(true);
        }
    };
    
    const handleRechargeClick = () => navigate('/deposit');

    const mainActions = [
        { label: t('profile.recharge', 'Depositar'), icon: HiOutlineArrowDownOnSquare, onClick: handleRechargeClick },
        { label: t('profile.withdraw', 'Retirar'), icon: HiOutlineArrowUpOnSquare, onClick: handleWithdrawClick },
        { label: t('profile.records', 'Historial'), icon: HiOutlineRectangleStack, onClick: () => navigate('/history') },
    ];
    
    // NOTA DE ARQUITECTURA: El backend deberá devolver el campo 'isWithdrawalPasswordSet' en el objeto de usuario.
    const isPasswordSet = user?.isWithdrawalPasswordSet || false;

    const secondaryActions = [
        // --- NUEVA FILA DE ACCIÓN ---
        { 
            label: isPasswordSet 
                ? t('profile.changeWithdrawalPassword', 'Cambiar Contraseña de Retiro') 
                : t('profile.setWithdrawalPassword', 'Configurar Contraseña de Retiro'), 
            icon: HiOutlineKey, 
            onClick: () => setSetPasswordModalOpen(true) 
        },
        // -----------------------------
        { label: t('profile.invite', 'Equipo'), icon: HiOutlineUserGroup, onClick: () => navigate('/team') },
        { label: t('profile.language', 'Idioma'), icon: HiOutlineLanguage, onClick: () => navigate('/language') },
        { label: t('profile.support', 'Soporte'), icon: HiOutlineChatBubbleLeftRight, onClick: () => navigate('/support') },
        { label: t('profile.faq', 'FAQ'), icon: HiOutlineQuestionMarkCircle, onClick: () => navigate('/faq') },
        { label: t('profile.about', 'Sobre Nosotros'), icon: HiOutlineInformationCircle, onClick: () => navigate('/about') },
    ];

    return (
        <>
            <motion.div 
                className="flex flex-col h-full overflow-y-auto no-scrollbar p-4 pt-6 gap-6 pb-28"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col items-center text-center">
                    <img 
                        src={user?.photoUrl || '/assets/images/user-avatar-placeholder.png'} 
                        alt="Avatar" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-card shadow-medium" 
                    />
                    <h1 className="text-2xl font-bold text-text-primary mt-4">{user?.username || 'Usuario'}</h1>
                    <div className="flex items-center gap-4 mt-2 text-text-secondary text-sm">
                        <span>ID: {user?.telegramId}</span>
                        {user?.referrerId && <span>{t('profile.inviter', 'Invitado por')}: {user.referrerId}</span>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-card/70 backdrop-blur-md rounded-2xl border border-white/20 shadow-medium">
                        <p className="text-sm text-text-secondary uppercase tracking-wider">{t('profilePage.balanceUsdtLabel', 'Saldo')}</p>
                        <p className="text-2xl font-bold text-accent-primary mt-1">{(user?.balance?.usdt || 0).toFixed(4)}</p>
                    </div>
                    <div className="p-4 bg-card/70 backdrop-blur-md rounded-2xl border border-white/20 shadow-medium">
                        <p className="text-sm text-text-secondary uppercase tracking-wider">{t('profilePage.productionLabel', 'Producción')}</p>
                        <p className="text-2xl font-bold text-accent-secondary mt-1">{(user?.productionBalance?.usdt || 0).toFixed(4)}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold text-text-secondary px-2">{t('profile.mainActionsTitle', 'Acciones Principales')}</h3>
                    {mainActions.map(action => <ActionRow key={action.label} {...action} />)}
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold text-text-secondary px-2">{t('profile.settingsTitle', 'Ajustes y Más')}</h3>
                    {secondaryActions.map(action => <ActionRow key={action.label} {...action} />)}
                </div>

                <div className="pt-4">
                    <button 
                        onClick={logout} 
                        className="w-full flex items-center justify-center gap-3 p-4 bg-status-danger/10 backdrop-blur-md rounded-2xl border border-status-danger/30 shadow-subtle text-status-danger hover:bg-status-danger/20 hover:border-status-danger/50 transition-colors duration-200 active:scale-[0.98]"
                    >
                        <HiOutlineArrowRightOnRectangle className="w-6 h-6" />
                        <span className="text-base font-bold">{t('profile.logout', 'Cerrar Sesión')}</span>
                    </button>
                </div>
            </motion.div>

            <AnimatePresence>
                {isWithdrawalModalOpen && <WithdrawalModal onClose={() => setWithdrawalModalOpen(false)} />}
                {/* --- SE AÑADE EL NUEVO MODAL --- */}
                {isSetPasswordModalOpen && <SetWithdrawalPasswordModal onClose={() => setSetPasswordModalOpen(false)} />}
            </AnimatePresence>
        </>
    );
};
export default ProfilePage;