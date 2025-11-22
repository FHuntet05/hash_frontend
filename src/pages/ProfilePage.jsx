import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
    HiOutlineWallet, HiOutlineUserGroup, HiOutlineQuestionMarkCircle, 
    HiOutlineInformationCircle, HiOutlineChatBubbleLeftRight, 
    HiOutlineLanguage, HiChevronRight, HiOutlineKey
} from 'react-icons/hi2';

import SetWithdrawalPasswordModal from '../components/modals/SetWithdrawalPasswordModal';
import SetWithdrawalAddressModal from '../components/modals/SetWithdrawalAddressModal'; 
import Loader from '../components/common/Loader';

// Componente de Item de Menú (Reutilizable)
const ProfileMenuItem = ({ icon: Icon, label, onClick, highlight = false }) => (
  <button 
    onClick={onClick} 
    className={`
        w-full flex items-center p-4 rounded-xl border transition-all duration-200 active:scale-[0.98]
        ${highlight 
            ? 'bg-accent/10 border-accent/30 text-accent hover:bg-accent/20' 
            : 'bg-surface border-border text-text-primary hover:bg-surface/80'
        }
    `}
  >
    <div className={`p-2 rounded-lg mr-4 ${highlight ? 'bg-accent text-white' : 'bg-background text-text-secondary'}`}>
        <Icon className="w-5 h-5" />
    </div>
    <span className="flex-grow text-sm font-semibold text-left">{label}</span>
    <HiChevronRight className={`w-4 h-4 ${highlight ? 'text-accent' : 'text-text-secondary'}`} />
  </button>
);

const ProfilePage = () => {
    const { user } = useUserStore();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [modalState, setModalState] = React.useState({
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
                className="flex flex-col h-full overflow-y-auto no-scrollbar p-4 pt-6 gap-6 pb-28" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
            >
                {/* --- HEADER DEL PERFIL --- */}
                <div className="bg-surface rounded-3xl p-6 border border-border shadow-medium flex flex-col items-center text-center relative overflow-hidden">
                    {/* Fondo decorativo */}
                    <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-accent/20 to-transparent"></div>

                    <div className="relative z-10 mb-3 p-1 rounded-full bg-surface border-2 border-accent">
                        <img 
                            src={user.photoUrl || '/assets/images/placeholder.png'} 
                            alt="Profile" 
                            className="w-20 h-20 rounded-full object-cover" 
                        />
                    </div>
                    
                    <h1 className="relative z-10 text-xl font-bold text-white">{user.fullName || user.username}</h1>
                    <p className="relative z-10 text-xs text-text-secondary bg-background/50 px-2 py-1 rounded-lg mt-1 border border-white/5">
                        ID: {user.telegramId}
                    </p>
                    
                    <div className="relative z-10 grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-white/5">
                        <div>
                            <p className="text-[10px] text-text-secondary uppercase tracking-wider">Saldo Total</p>
                            <p className="text-lg font-bold text-white">{user.balance?.usdt.toFixed(4)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-text-secondary uppercase tracking-wider">Estado</p>
                            <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded">Verificado</span>
                        </div>
                    </div>
                </div>
                
                {/* --- SECCIONES DE MENÚ --- */}
                <div className="space-y-6">
                    
                    {/* Configuración Crítica */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold text-text-secondary uppercase ml-1">Seguridad & Pagos</h3>
                        <ProfileMenuItem 
                            icon={HiOutlineWallet} 
                            label={isWalletSet ? "Gestionar Billetera de Retiro" : "Vincular Billetera USDT (BEP20)"} 
                            onClick={() => openModal('setAddress')}
                            highlight={!isWalletSet} // Resaltar si no está configurada
                        />
                        <ProfileMenuItem 
                            icon={HiOutlineKey} 
                            label={isPasswordSet ? "Cambiar Contraseña de Retiro" : "Crear Contraseña de Retiro"} 
                            onClick={() => openModal('setPassword')}
                            highlight={!isPasswordSet} // Resaltar si no está configurada
                        />
                    </div>

                    {/* Comunidad */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold text-text-secondary uppercase ml-1">Comunidad</h3>
                        <ProfileMenuItem icon={HiOutlineUserGroup} label={t('profile.invite')} onClick={() => navigate('/team')} />
                    </div>

                    {/* Sistema */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold text-text-secondary uppercase ml-1">Aplicación</h3>
                        <ProfileMenuItem icon={HiOutlineLanguage} label={t('profile.language')} onClick={() => navigate('/language')} />
                        <ProfileMenuItem icon={HiOutlineQuestionMarkCircle} label={t('profile.faq')} onClick={() => navigate('/faq')} />
                        <ProfileMenuItem icon={HiOutlineChatBubbleLeftRight} label={t('profile.support')} onClick={() => navigate('/support')} />
                        <ProfileMenuItem icon={HiOutlineInformationCircle} label={t('profile.about')} onClick={() => navigate('/about')} />
                    </div>

                </div>
                
                {/* Footer Branding */}
                <div className="text-center mt-4 pb-4 opacity-30">
                    <p className="text-[10px] font-mono text-text-secondary">NovMining v2.0.4 Build 240</p>
                </div>

            </motion.div>

            <AnimatePresence>
                {modalState.setPassword && <SetWithdrawalPasswordModal onClose={() => closeModal('setPassword')} />}
                {modalState.setAddress && <SetWithdrawalAddressModal onClose={() => closeModal('setAddress')} />}
            </AnimatePresence>
        </>
    );
};
export default ProfilePage;