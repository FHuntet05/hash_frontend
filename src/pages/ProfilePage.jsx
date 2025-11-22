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

// Componente de Tarjeta de Acción (Grid)
const ActionCard = ({ icon: Icon, label, subLabel, colorClass, onClick }) => (
    <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onClick}
        className="relative overflow-hidden bg-surface border border-white/5 rounded-2xl p-4 flex flex-col items-start justify-between h-32 group hover:border-white/10 transition-colors"
    >
        {/* Fondo con degradado sutil del color */}
        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colorClass} opacity-5 rounded-bl-full -mr-4 -mt-4 transition-opacity group-hover:opacity-10`}></div>
        
        <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 mb-2`}>
            <Icon className={`w-6 h-6 ${colorClass.replace('from-', 'text-').replace('to-', '').split(' ')[0]}`} />
        </div>
        
        <div className="text-left z-10">
            <p className="text-sm font-bold text-white leading-tight">{label}</p>
            {subLabel && <p className="text-[10px] text-text-secondary mt-0.5">{subLabel}</p>}
        </div>
    </motion.button>
);

// Componente de Lista Simple (Menu)
const MenuItem = ({ icon: Icon, label, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-surface/50 rounded-xl border border-white/5 hover:bg-surface transition-colors">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-background rounded-lg text-text-secondary">
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-text-primary">{label}</span>
        </div>
        <HiChevronRight className="w-4 h-4 text-text-secondary" />
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
                {/* --- HEADER: ID CARD (REDISEÑADO) --- */}
                <div className="relative w-full bg-gradient-to-br from-surface to-[#0f151f] rounded-3xl p-6 border border-white/5 shadow-2xl overflow-hidden">
                    {/* Elementos decorativos de fondo */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -ml-5 -mb-5"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-accent to-blue-500">
                                <img 
                                    src={user.photoUrl || '/assets/images/placeholder.png'} 
                                    alt="Avatar" 
                                    className="w-full h-full rounded-full object-cover border-4 border-[#111827]" 
                                />
                            </div>
                            <div className="absolute bottom-0 right-0 bg-[#111827] p-1 rounded-full">
                                <HiShieldCheck className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>

                        <h1 className="mt-4 text-2xl font-bold text-white tracking-tight">{user.fullName || user.username}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                                ID: {user.telegramId}
                            </span>
                            <span className="text-xs font-bold text-text-secondary">|</span>
                            <span className="text-xs text-text-secondary">Nivel 1</span>
                        </div>

                        <div className="mt-6 w-full bg-[#111827]/50 rounded-xl p-4 flex justify-between items-center border border-white/5 backdrop-blur-sm">
                            <div className="text-left">
                                <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Saldo Total</p>
                                <p className="text-xl font-mono font-bold text-white">{user.balance?.usdt.toFixed(4)} <span className="text-sm text-accent">USDT</span></p>
                            </div>
                            <div className="h-8 w-[1px] bg-white/10"></div>
                            <div className="text-right">
                                <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Potencia</p>
                                {/* Aquí podrías conectar la potencia real si la tuvieras en store, por ahora un valor calculado */}
                                <p className="text-xl font-mono font-bold text-white">Active <span className="text-green-400 text-lg">●</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FINANZAS: BENTO GRID (2x2) --- */}
                <div>
                    <h3 className="text-xs font-bold text-text-secondary uppercase ml-1 mb-3">Operaciones Financieras</h3>
                    <div className="grid grid-cols-2 gap-3">
                        
                        {/* Botón DEPOSITAR */}
                        <ActionCard 
                            icon={HiArrowDownTray} 
                            label="Depositar" 
                            subLabel="Recargar Saldo"
                            colorClass="from-green-500 to-emerald-600 text-green-500"
                            onClick={() => navigate('/deposit/select-network')}
                        />

                        {/* Botón RETIRAR */}
                        <ActionCard 
                            icon={HiArrowUpTray} 
                            label="Retirar" 
                            subLabel="Transferir Fondos"
                            colorClass="from-red-500 to-rose-600 text-red-500"
                            onClick={() => openModal('withdrawal')}
                        />

                        {/* Botón WALLET */}
                        <ActionCard 
                            icon={HiWallet} 
                            label="Billetera" 
                            subLabel={isWalletSet ? "Configurada" : "No Vinculada"}
                            colorClass={isWalletSet ? "from-blue-500 to-indigo-600 text-blue-500" : "from-gray-500 to-gray-600 text-gray-400"}
                            onClick={() => openModal('setAddress')}
                        />

                        {/* Botón PASSWORD */}
                        <ActionCard 
                            icon={HiKey} 
                            label="Seguridad" 
                            subLabel="PIN de Retiro"
                            colorClass={isPasswordSet ? "from-accent to-orange-600 text-accent" : "from-gray-500 to-gray-600 text-gray-400"}
                            onClick={() => openModal('setPassword')}
                        />
                    </div>
                </div>

                {/* --- MENÚ GENERAL (LISTA) --- */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-text-secondary uppercase ml-1">Configuración & Ayuda</h3>
                    
                    <MenuItem icon={HiUserGroup} label="Mi Equipo" onClick={() => navigate('/team')} />
                    <MenuItem icon={HiLanguage} label="Idioma" onClick={() => navigate('/language')} />
                    
                    <div className="grid grid-cols-2 gap-3">
                        <MenuItem icon={HiQuestionMarkCircle} label="FAQ" onClick={() => navigate('/faq')} />
                        <MenuItem icon={HiChatBubbleLeftRight} label="Soporte" onClick={() => navigate('/support')} />
                    </div>
                    
                    <MenuItem icon={HiInformationCircle} label="Sobre NovMining" onClick={() => navigate('/about')} />
                </div>

                <div className="h-4"></div> 
            </motion.div>

            {/* MODALES */}
            <AnimatePresence>
                {modalState.withdrawal && <WithdrawalModal onClose={() => closeModal('withdrawal')} />}
                {modalState.setPassword && <SetWithdrawalPasswordModal onClose={() => closeModal('setPassword')} />}
                {modalState.setAddress && <SetWithdrawalAddressModal onClose={() => closeModal('setAddress')} />}
            </AnimatePresence>
        </>
    );
};
export default ProfilePage;