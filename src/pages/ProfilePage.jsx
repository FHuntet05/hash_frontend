import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    HiWallet, HiUserGroup, HiQuestionMarkCircle, 
    HiInformationCircle, HiChatBubbleLeftRight, 
    HiLanguage, HiChevronRight, HiKey,
    HiArrowDownTray, HiArrowUpTray, HiShieldCheck
} from 'react-icons/hi2';

import SetWithdrawalPasswordModal from '../components/modals/SetWithdrawalPasswordModal';
import SetWithdrawalAddressModal from '../components/modals/SetWithdrawalAddressModal'; 
import WithdrawalModal from '../components/modals/WithdrawalModal';
import Loader from '../components/common/Loader';

// --- COMPONENTE DE TARJETA DE ACCIÓN (CORREGIDO) ---
const ActionCard = ({ icon: Icon, label, subLabel, colorClass, onClick }) => (
    <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onClick}
        className="relative overflow-hidden bg-surface border border-white/5 rounded-2xl p-4 flex flex-col items-start justify-between h-32 group hover:border-accent/30 transition-all"
    >
        {/* CORRECCIÓN: Opacidad aumentada del 5% al 20% para mayor visibilidad */}
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClass} opacity-20 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110 duration-500`}></div>
        
        {/* Icono con fondo más intenso */}
        <div className={`p-2.5 rounded-xl ${colorClass} bg-opacity-20 mb-2 backdrop-blur-sm`}>
            <Icon className={`w-6 h-6 ${colorClass.replace('from-', 'text-').replace('to-', '').split(' ')[0]}`} />
        </div>
        
        <div className="text-left z-10">
            <p className="text-sm font-bold text-white leading-tight tracking-wide">{label}</p>
            <p className="text-[10px] text-text-secondary mt-1 font-medium opacity-80">{subLabel}</p>
        </div>
    </motion.button>
);

// --- COMPONENTE DE MENÚ (CORREGIDO CON NARANJA) ---
const MenuItem = ({ icon: Icon, label, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-surface rounded-xl border border-white/5 hover:border-accent/40 hover:shadow-[0_0_10px_rgba(249,115,22,0.1)] transition-all group">
        <div className="flex items-center gap-3">
            {/* Icono siempre naranja con fondo suave */}
            <div className="p-2.5 bg-accent/10 rounded-lg text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-text-primary group-hover:text-white transition-colors">{label}</span>
        </div>
        <HiChevronRight className="w-4 h-4 text-text-secondary group-hover:text-accent transition-colors" />
    </button>
);

const ProfilePage = () => {
    const { user } = useUserStore();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [modalState, setModalState] = React.useState({
        withdrawal: false,
        setPassword: false,
        setAddress: false,
    });

    const openModal = (name) => setModalState(prev => ({ ...prev, [name]: true }));
    const closeModal = (name) => setModalState(prev => ({ ...prev, [name]: false }));

    if (!user) return <div className="h-full flex items-center justify-center"><Loader /></div>;

    const isPasswordSet = user.isWithdrawalPasswordSet;
    const isWalletSet = user.withdrawalAddress?.isSet;

    return (
        <>
            <motion.div 
                className="flex flex-col h-full overflow-y-auto no-scrollbar p-4 pt-8 gap-6 pb-32" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
            >
                {/* --- HEADER: ID CARD REPARADO --- */}
                {/* CORRECCIÓN: pt-10 pb-8 y flex-col con gap para asegurar espacio */}
                <div className="relative w-full bg-surface rounded-3xl pt-10 pb-8 px-6 border border-white/10 shadow-2xl overflow-visible mt-4">
                    
                    {/* Fondo Decorativo (contenido dentro del borde) */}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        
                        {/* Avatar Container - Subido ligeramente usando margin negativo controlado */}
                        <div className="-mt-16 mb-4 relative">
                            <div className="w-28 h-28 rounded-full p-1.5 bg-gradient-to-b from-surface via-surface to-accent shadow-2xl">
                                <img 
                                    src={user.photoUrl || '/assets/images/placeholder.png'} 
                                    alt="Avatar" 
                                    className="w-full h-full rounded-full object-cover border-4 border-surface bg-surface" 
                                />
                            </div>
                            <div className="absolute bottom-1 right-1 bg-surface p-1.5 rounded-full shadow-sm border border-white/5">
                                <HiShieldCheck className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-white tracking-tight">{user.fullName || user.username}</h1>
                        
                        <div className="flex items-center gap-3 mt-2 mb-6">
                            <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-1 rounded border border-accent/20">
                                ID: {user.telegramId}
                            </span>
                            <span className="text-[10px] font-bold text-text-secondary bg-white/5 px-2 py-1 rounded border border-white/5">
                                VERIFICADO
                            </span>
                        </div>

                        {/* Balance Bar */}
                        <div className="w-full bg-background/60 rounded-2xl p-4 flex justify-between items-center border border-white/5 backdrop-blur-md">
                            <div className="text-left">
                                <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold mb-1">Saldo Total</p>
                                <p className="text-xl font-mono font-bold text-white">{user.balance?.usdt.toFixed(4)} <span className="text-sm text-accent font-sans">USDT</span></p>
                            </div>
                            <div className="h-8 w-[1px] bg-white/10"></div>
                            <div className="text-right">
                                <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold mb-1">Estado</p>
                                <div className="flex items-center justify-end gap-1.5">
                                    <span className="relative flex h-2.5 w-2.5">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                    </span>
                                    <span className="text-sm font-bold text-white">Activo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FINANZAS: BENTO GRID (2x2) --- */}
                <div>
                    <h3 className="text-xs font-bold text-text-secondary uppercase ml-1 mb-3">Operaciones</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <ActionCard 
                            icon={HiArrowDownTray} 
                            label="Depositar" 
                            subLabel="Recargar Saldo"
                            colorClass="from-green-500 to-emerald-600 text-green-500"
                            onClick={() => navigate('/deposit/select-network')}
                        />
                        <ActionCard 
                            icon={HiArrowUpTray} 
                            label="Retirar" 
                            subLabel="Transferir Fondos"
                            colorClass="from-red-500 to-rose-600 text-red-500"
                            onClick={() => openModal('withdrawal')}
                        />
                        <ActionCard 
                            icon={HiWallet} 
                            label="Billetera" 
                            subLabel={isWalletSet ? "Vinculada" : "Configurar"}
                            colorClass={isWalletSet ? "from-blue-500 to-indigo-600 text-blue-500" : "from-gray-500 to-gray-600 text-gray-400"}
                            onClick={() => openModal('setAddress')}
                        />
                        <ActionCard 
                            icon={HiKey} 
                            label="PIN Retiro" 
                            subLabel="Seguridad"
                            colorClass={isPasswordSet ? "from-accent to-orange-600 text-accent" : "from-gray-500 to-gray-600 text-gray-400"}
                            onClick={() => openModal('setPassword')}
                        />
                    </div>
                </div>

                {/* --- CONFIGURACIÓN (MENÚ NARANJA ADAPTADO) --- */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-text-secondary uppercase ml-1">Aplicación</h3>
                    
                    <MenuItem icon={HiLanguage} label={t('profile.language')} onClick={() => navigate('/language')} />
                    
                    <div className="grid grid-cols-2 gap-3">
                        <MenuItem icon={HiQuestionMarkCircle} label="FAQ" onClick={() => navigate('/faq')} />
                        <MenuItem icon={HiChatBubbleLeftRight} label="Soporte" onClick={() => navigate('/support')} />
                    </div>
                    
                    <MenuItem icon={HiInformationCircle} label={t('profile.about')} onClick={() => navigate('/about')} />
                </div>

                {/* Versión Footer */}
                <div className="text-center mt-4 pb-4 opacity-30">
                    <p className="text-[10px] font-mono text-text-secondary">NovMining v2.1.0 Security Encrypted</p>
                </div>
            </motion.div>

            {/* Modales */}
            <AnimatePresence>
                {modalState.withdrawal && <WithdrawalModal onClose={() => closeModal('withdrawal')} />}
                {modalState.setPassword && <SetWithdrawalPasswordModal onClose={() => closeModal('setPassword')} />}
                {modalState.setAddress && <SetWithdrawalAddressModal onClose={() => closeModal('setAddress')} />}
            </AnimatePresence>
        </>
    );
};
export default ProfilePage;