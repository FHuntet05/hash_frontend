// RUTA: frontend/src/pages/ProfilePage.jsx (v3.4 - FEATURE-001: LÓGICA DE WALLET DE RETIRO)

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
// CAMBIO CRÍTICO: Se importa el nuevo modal que crearemos.
import SetWithdrawalAddressModal from '../components/modals/SetWithdrawalAddressModal'; 
import SelectNetworkModal from '../components/modals/SelectNetworkModal';

const StatCard = ({ label, value }) => ( <div className="flex-1 text-center"> <p className="text-2xl font-bold text-text-primary">{value.toFixed(2)}</p> <p className="text-xs text-text-secondary uppercase tracking-wider mt-1">{label}</p> </div> );
const ActionCard = ({ icon: Icon, label, onClick }) => ( <button onClick={onClick} className="flex flex-col items-center justify-center p-4 bg-card/70 backdrop-blur-md rounded-2xl border border-border shadow-subtle text-center hover:border-accent-primary/50 transition-colors duration-200 active:bg-accent-primary/10 aspect-square"> <Icon className="w-12 h-12 mb-2 text-accent-primary" /> <span className="text-sm font-semibold text-text-primary">{label}</span> </button> );
const ActionRow = ({ icon: Icon, label, onClick }) => ( <button onClick={onClick} className="w-full flex items-center p-4 bg-card/70 backdrop-blur-md rounded-2xl border border-border shadow-subtle text-left hover:border-accent-primary/50 transition-colors duration-200 active:bg-accent-primary/10"> <Icon className="w-6 h-6 mr-4 text-text-secondary" /> <span className="flex-grow text-base font-semibold text-text-primary">{label}</span> <HiChevronRight className="w-5 h-5 text-text-tertiary" /> </button> );

const ProfilePage = () => {
    const { user, logout } = useUserStore();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // CAMBIO CRÍTICO: El estado del modal ahora usa el nuevo nombre 'setAddress'.
    const [modalState, setModalState] = React.useState({
        withdrawal: false,
        setPassword: false,
        selectNetwork: false,
        setAddress: false,
    });

    const openModal = (modalName) => setModalState(prev => ({ ...prev, [modalName]: true }));
    const closeModal = (modalName) => setModalState(prev => ({ ...prev, [modalName]: false }));

    const handleWithdrawClick = () => {
        // CAMBIO CRÍTICO: La validación ahora comprueba el nuevo objeto 'withdrawalAddress'.
        if (!user?.isWithdrawalPasswordSet) { toast.error(t('profilePage.toasts.passwordNotSet')); openModal('setPassword'); return; }
        if (!user?.withdrawalAddress?.isSet) { toast.error(t('profilePage.toasts.walletNotSet')); openModal('setAddress'); return; }
        if ((user?.balance?.usdt || 0) < 0.1) { toast.error(t('profilePage.toasts.insufficientBalance', { min: "0.1" })); return; }
        openModal('withdrawal');
    };
    
    const handleNavigateToSetPassword = () => {
        closeModal('withdrawal');
        openModal('setPassword');
    };

    if (!user) { return <div className="h-full w-full flex items-center justify-center pt-16"><Loader /></div>; }

    const isPasswordSet = user?.isWithdrawalPasswordSet || false;
    const isWalletSet = user?.withdrawalAddress?.isSet || false;

    const mainActions = [
        { label: t('profile.recharge'), icon: HiOutlineArrowDownOnSquare, onClick: () => openModal('selectNetwork') },
        { label: t('profile.withdraw'), icon: HiOutlineArrowUpOnSquare, onClick: handleWithdrawClick },
        // CAMBIO CRÍTICO: El botón de "Guardar Billetera" ahora abre el modal 'setAddress'.
        { label: isWalletSet ? t('profile.editWallet', 'Editar Billetera') : t('profile.saveWallet', 'Guardar Billetera'), icon: HiOutlineWallet, onClick: () => openModal('setAddress') },
        { label: t('profile.records'), icon: HiOutlineRectangleStack, onClick: () => navigate('/history') },
    ];
    
    const secondaryActions = [
        { label: isPasswordSet ? t('profile.changeWithdrawalPassword') : t('profile.setWithdrawalPassword'), icon: HiOutlineKey, onClick: () => openModal('setPassword') },
        { label: t('profile.invite'), icon: HiOutlineUserGroup, onClick: () => navigate('/team') },
        { label: t('profile.language'), icon: HiOutlineLanguage, onClick: () => navigate('/language') },
        { label: t('profile.support'), icon: HiOutlineChatBubbleLeftRight, onClick: () => navigate('/support') },
        { label: t('profile.faq'), icon: HiOutlineQuestionMarkCircle, onClick: () => navigate('/faq') },
        { label: t('profile.about'), icon: HiOutlineInformationCircle, onClick: () => navigate('/about') },
    ];

    return (
        <>
            <motion.div className="flex flex-col h-full overflow-y-auto no-scrollbar p-4 pt-6 gap-6 pb-28" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="flex flex-col items-center text-center">
                    <img src={user?.photoUrl || '/assets/images/user-avatar-placeholder.png'} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-card shadow-medium" />
                    <h1 className="text-2xl font-bold text-text-primary mt-4">{user?.username || 'Usuario'}</h1>
                    <div className="flex items-center gap-4 mt-2 text-text-secondary text-sm"><span>ID: {user?.telegramId}</span></div>
                </div>
                <div className="flex items-center justify-around p-4 bg-card/70 backdrop-blur-md rounded-2xl border border-border shadow-medium">
                    <StatCard label={t('profilePage.balanceUsdtLabel')} value={user?.balance?.usdt || 0} />
                    <div className="w-px h-10 bg-border"></div>
                    <StatCard label={t('profilePage.totalRecharged')} value={user?.totalRecharge || 0} />
                    <div className="w-px h-10 bg-border"></div>
                    <StatCard label={t('profilePage.totalWithdrawn')} value={user?.totalWithdrawal || 0} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {mainActions.map(action => <ActionCard key={action.label} {...action} />)}
                </div>
                <div className="space-y-3">
                    <h3 className="font-bold text-text-secondary px-2">{t('profile.settingsTitle')}</h3>
                    {secondaryActions.map(action => <ActionRow key={action.label} {...action} />)}
                </div>
                <div className="pt-4">
                    <button onClick={logout} className="w-full flex items-center justify-center gap-3 p-4 bg-status-danger/10 backdrop-blur-md rounded-2xl border border-status-danger/30 shadow-subtle text-status-danger hover:bg-status-danger/20 hover:border-status-danger/50 transition-colors duration-200 active:scale-[0.98]">
                        <HiOutlineArrowRightOnRectangle className="w-6 h-6" />
                        <span className="text-base font-bold">{t('profile.logout')}</span>
                    </button>
                </div>
            </motion.div>

            <AnimatePresence>
                {modalState.selectNetwork && <SelectNetworkModal onClose={() => closeModal('selectNetwork')} />}
                {modalState.withdrawal && <WithdrawalModal onClose={() => closeModal('withdrawal')} onGoToSetPassword={handleNavigateToSetPassword} />}
                {modalState.setPassword && <SetWithdrawalPasswordModal onClose={() => closeModal('setPassword')} />}
                {/* CAMBIO CRÍTICO: Se renderiza el nuevo modal y se le pasa la función de cierre. */}
                {modalState.setAddress && <SetWithdrawalAddressModal onClose={() => closeModal('setAddress')} />}
            </AnimatePresence>
        </>
    );
};
export default ProfilePage;