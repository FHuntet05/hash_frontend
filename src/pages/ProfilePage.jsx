// --- START OF FILE ProfilePage.jsx ---

// RUTA: frontend/src/pages/ProfilePage.jsx (v4.2 - INTEGRACIÓN DE PÁGINA DE DEPÓSITO)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
    HiOutlineArrowDownOnSquare, HiOutlineArrowUpOnSquare, HiOutlineRectangleStack, 
    HiOutlineWallet, HiOutlineUserGroup, HiOutlineQuestionMarkCircle, HiOutlineInformationCircle, 
    HiOutlineChatBubbleLeftRight, HiOutlineLanguage, HiOutlineArrowRightOnRectangle,
    HiChevronRight, HiOutlineKey
} from 'react-icons/hi2';

import WithdrawalModal from '../components/modals/WithdrawalModal';
import SetWithdrawalPasswordModal from '../components/modals/SetWithdrawalPasswordModal';
import Loader from '../components/common/Loader';
import SetWithdrawalAddressModal from '../components/modals/SetWithdrawalAddressModal'; 
// ELIMINADO: import SelectNetworkModal from '../components/modals/SelectNetworkModal';

const ProfileMenuItem = ({ icon: Icon, label, onClick }) => (
  <motion.button variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} onClick={onClick} className="w-full flex items-center p-3 bg-surface rounded-xl border border-border text-left hover:bg-surface/50 transition-colors duration-200">
    <div className="bg-background p-2 rounded-full mr-4"><Icon className="w-6 h-6 text-accent" /></div>
    <span className="flex-grow text-base font-semibold text-text-primary">{label}</span>
    <HiChevronRight className="w-5 h-5 text-text-secondary" />
  </motion.button>
);

const StatItem = ({ label, value }) => (
  <div className="text-center flex-1">
    <p className="text-xl font-bold text-text-primary">{value.toFixed(2)}</p>
    <p className="text-xs text-text-secondary uppercase tracking-wider mt-1">{label}</p>
  </div>
);

const ProfilePage = () => {
    const { user, logout } = useUserStore();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // MODIFICADO: Se elimina 'selectNetwork' del estado de los modales
    const [modalState, setModalState] = React.useState({
        withdrawal: false,
        setPassword: false,
        setAddress: false,
    });

    const openModal = (modalName) => setModalState(prev => ({ ...prev, [modalName]: true }));
    const closeModal = (modalName) => setModalState(prev => ({ ...prev, [modalName]: false }));

    const handleWithdrawClick = () => {
        if (!user?.isWithdrawalPasswordSet) { toast.error(t('profilePage.toasts.passwordNotSet')); openModal('setPassword'); return; }
        if (!user?.withdrawalAddress?.isSet) { toast.error(t('profilePage.toasts.walletNotSet')); openModal('setAddress'); return; }
        if ((user?.balance?.usdt || 0) < 0.1) { toast.error(t('profilePage.toasts.insufficientBalance', { min: "0.1" })); return; }
        openModal('withdrawal');
    };
    
    if (!user) { return <div className="h-full w-full flex items-center justify-center pt-16"><Loader /></div>; }

    const isPasswordSet = user.isWithdrawalPasswordSet;
    const isWalletSet = user.withdrawalAddress?.isSet;

    // --- INICIO DE MODIFICACIÓN CRÍTICA ---
    // La acción de recargar ahora navega a la nueva página
    const financialActions = [
        { label: t('profile.recharge'), icon: HiOutlineArrowDownOnSquare, onClick: () => navigate('/deposit/select-network') },
        { label: t('profile.withdraw'), icon: HiOutlineArrowUpOnSquare, onClick: handleWithdrawClick },
        { label: isWalletSet ? t('profile.editWallet') : t('profile.saveWallet'), icon: HiOutlineWallet, onClick: () => openModal('setAddress') },
        { label: t('profile.records'), icon: HiOutlineRectangleStack, onClick: () => navigate('/history') },
    ];
    // --- FIN DE MODIFICACIÓN CRÍTICA ---
    
    const accountActions = [
        { label: isPasswordSet ? t('profile.changeWithdrawalPassword') : t('profile.setWithdrawalPassword'), icon: HiOutlineKey, onClick: () => openModal('setPassword') },
        { label: t('profile.invite'), icon: HiOutlineUserGroup, onClick: () => navigate('/team') },
        { label: t('profile.language'), icon: HiOutlineLanguage, onClick: () => navigate('/language') },
    ];

    const supportActions = [
        { label: t('profile.support'), icon: HiOutlineChatBubbleLeftRight, onClick: () => navigate('/support') },
        { label: t('profile.faq'), icon: HiOutlineQuestionMarkCircle, onClick: () => navigate('/faq') },
        { label: t('profile.about'), icon: HiOutlineInformationCircle, onClick: () => navigate('/about') },
    ];

    const listVariants = { visible: { transition: { staggerChildren: 0.07 } }, hidden: {} };

    return (
        <>
            <motion.div className="flex flex-col h-full overflow-y-auto no-scrollbar p-4 pt-6 gap-8 pb-28" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="bg-surface rounded-2xl p-5 border border-border shadow-medium flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <img src={user.photoUrl || '/assets/images/user-avatar-placeholder.png'} alt="Avatar" className="w-20 h-20 rounded-full object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold text-text-primary truncate">{user.username || 'Usuario'}</h1>
                            <span className="text-text-secondary text-sm">ID: {user.telegramId}</span>
                        </div>
                    </div>
                    <hr className="border-border/50" />
                    <div className="flex items-center justify-around">
                        <StatItem label={t('profilePage.balanceUsdtLabel')} value={user.balance?.usdt || 0} />
                        <div className="w-px h-10 bg-border"></div>
                        <StatItem label={t('profilePage.totalRecharged')} value={user.totalRecharge || 0} />
                        <div className="w-px h-10 bg-border"></div>
                        <StatItem label={t('profilePage.totalWithdrawn')} value={user.totalWithdrawal || 0} />
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-text-secondary px-2 mb-3">{t('profile.financialsTitle', 'Finanzas')}</h3>
                        <motion.div className="space-y-3" initial="hidden" animate="visible" variants={listVariants}>
                            {financialActions.map(action => <ProfileMenuItem key={action.label} {...action} />)}
                        </motion.div>
                    </div>
                    <div>
                        <h3 className="font-bold text-text-secondary px-2 mb-3">{t('profile.accountTitle', 'Cuenta')}</h3>
                        <motion.div className="space-y-3" initial="hidden" animate="visible" variants={listVariants}>
                            {accountActions.map(action => <ProfileMenuItem key={action.label} {...action} />)}
                        </motion.div>
                    </div>
                    <div>
                        <h3 className="font-bold text-text-secondary px-2 mb-3">{t('profile.supportTitle', 'Soporte')}</h3>
                        <motion.div className="space-y-3" initial="hidden" animate="visible" variants={listVariants}>
                            {supportActions.map(action => <ProfileMenuItem key={action.label} {...action} />)}
                        </motion.div>
                    </div>
                </div>
                <div className="pt-4">
                    <button onClick={logout} className="w-full flex items-center justify-center gap-3 p-4 bg-status-danger/10 rounded-2xl border border-status-danger/30 text-status-danger hover:bg-status-danger/20 hover:border-status-danger/50 transition-colors duration-200 active:scale-[0.98]">
                        <HiOutlineArrowRightOnRectangle className="w-6 h-6" />
                        <span className="text-base font-bold">{t('profile.logout')}</span>
                    </button>
                </div>
            </motion.div>
            <AnimatePresence>
                {/* ELIMINADO: El modal de selección de red ya no se renderiza aquí */}
                {modalState.withdrawal && <WithdrawalModal onClose={() => closeModal('withdrawal')} />}
                {modalState.setPassword && <SetWithdrawalPasswordModal onClose={() => closeModal('setPassword')} />}
                {modalState.setAddress && <SetWithdrawalAddressModal onClose={() => closeModal('setAddress')} />}
            </AnimatePresence>
        </>
    );
};
export default ProfilePage;

// --- END OF FILE ProfilePage.jsx ---