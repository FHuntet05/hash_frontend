// RUTA: frontend/src/pages/ProfilePage.jsx (REDISEÑO COMPLETO "MEGA FÁBRICA")

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
    HiOutlineClipboardDocument
} from 'react-icons/hi2';

import WithdrawalModal from '../components/modals/WithdrawalModal';
import Loader from '../components/common/Loader';

// Componente para una fila de acción, clave en el nuevo diseño de lista.
const ActionRow = ({ icon: Icon, label, onClick, hasChevron = true }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center p-4 bg-slate-800 rounded-lg text-left hover:bg-slate-700 transition-colors duration-200 active:bg-slate-600"
    >
        <Icon className="w-6 h-6 mr-4 text-slate-400" />
        <span className="flex-grow text-base font-medium text-slate-50">{label}</span>
        {hasChevron && <HiOutlineArrowRightOnRectangle className="w-5 h-5 text-slate-500 transform rotate-180" />}
    </button>
);

const ProfilePage = () => {
    const { user, logout } = useUserStore();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [isWithdrawalModalOpen, setWithdrawalModalOpen] = useState(false);

    const copyToClipboard = (text, message) => {
        navigator.clipboard.writeText(text);
        toast.success(message);
    };

    if (!user) {
        return <div className="h-full w-full flex items-center justify-center"><Loader text={t('common.loading')} /></div>;
    }

    const handleWithdrawClick = () => {
        if ((user?.balance?.usdt || 0) < 1.0) { // Lógica de negocio mantenida
            toast.error(t('profilePage.toasts.insufficientBalance', { min: "1.00" }));
        } else {
            setWithdrawalModalOpen(true);
        }
    };
    
    // Simplificamos: el depósito ahora lleva directamente a la página de depósito
    const handleRechargeClick = () => navigate('/deposit');

    const mainActions = [
        { label: t('profile.recharge'), icon: HiOutlineArrowDownOnSquare, onClick: handleRechargeClick },
        { label: t('profile.withdraw'), icon: HiOutlineArrowUpOnSquare, onClick: handleWithdrawClick },
        { label: t('profile.records'), icon: HiOutlineRectangleStack, onClick: () => navigate('/history') },
    ];

    const secondaryActions = [
        { label: t('profile.invite'), icon: HiOutlineUserGroup, onClick: () => navigate('/team') },
        { label: t('profile.language'), icon: HiOutlineLanguage, onClick: () => navigate('/language') },
        { label: t('profile.support'), icon: HiOutlineChatBubbleLeftRight, onClick: () => navigate('/support') },
        { label: t('profile.faq'), icon: HiOutlineQuestionMarkCircle, onClick: () => navigate('/faq') },
        { label: t('profile.about'), icon: HiOutlineInformationCircle, onClick: () => navigate('/about') },
    ];

    return (
        <>
            <motion.div 
                className="flex flex-col h-full overflow-y-auto p-4 gap-6 pb-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* --- Bloque de Identidad --- */}
                <div className="flex flex-col items-center text-center pt-4">
                    <img 
                        src={user?.photoUrl || '/assets/images/user-avatar-placeholder.png'} 
                        alt="Avatar" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-slate-700 shadow-lg" 
                    />
                    <h1 className="text-2xl font-bold text-slate-50 mt-4">{user?.username || 'Usuario'}</h1>
                    <div className="flex items-center gap-4 mt-2 text-slate-400 text-sm">
                        <span>ID: {user?.telegramId}</span>
                        {user?.referrerId && <span>{t('profile.inviter')}: {user.referrerId}</span>}
                    </div>
                </div>

                {/* --- Bloque de Balances --- */}
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                        <p className="text-sm text-slate-400 uppercase tracking-wider">{t('profilePage.balanceUsdtLabel')}</p>
                        <p className="text-2xl font-bold text-sky-400 mt-1">{(user?.balance?.usdt || 0).toFixed(4)}</p>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                        <p className="text-sm text-slate-400 uppercase tracking-wider">{t('profilePage.productionLabel', 'Producción')}</p>
                        <p className="text-2xl font-bold text-lime-400 mt-1">{(user?.productionBalance?.usdt || 0).toFixed(4)}</p>
                    </div>
                </div>

                {/* --- Bloque de Acciones Principales --- */}
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-slate-500 px-2">{t('profile.mainActions', 'ACCIONES')}</h2>
                    {mainActions.map(action => <ActionRow key={action.label} {...action} />)}
                </div>

                {/* --- Bloque de Acciones Secundarias --- */}
                <div className="space-y-3">
                     <h2 className="text-sm font-semibold text-slate-500 px-2">{t('profile.settings', 'AJUSTES Y SOPORTE')}</h2>
                    {secondaryActions.map(action => <ActionRow key={action.label} {...action} />)}
                </div>

                {/* --- Botón de Cerrar Sesión --- */}
                <div className="pt-4">
                    <button 
                        onClick={logout} 
                        className="w-full flex items-center justify-center p-4 bg-red-900/50 rounded-lg text-red-400 hover:bg-red-900/80 hover:text-red-300 transition-colors duration-200 active:bg-red-800"
                    >
                        <HiOutlineArrowRightOnRectangle className="w-6 h-6 mr-3" />
                        <span className="text-base font-bold">{t('profile.logout')}</span>
                    </button>
                </div>
            </motion.div>

            <AnimatePresence>
                {isWithdrawalModalOpen && <WithdrawalModal onClose={() => setWithdrawalModalOpen(false)} />}
            </AnimatePresence>
        </>
    );
};
export default ProfilePage;