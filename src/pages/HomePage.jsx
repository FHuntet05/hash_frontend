<<<<<<< HEAD
// RUTA: frontend/src/pages/HomePage.jsx (v4.0 - REDISEÑO "OBSIDIAN BLUE")
=======
// RUTA: frontend/src/pages/HomePage.jsx (v4.2 - CON TICKER DE ACTIVIDAD)
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503

import React from 'react';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import PurchasedFactoryItem from '../components/factories/PurchasedFactoryItem'; // Asumiendo este componente será renombrado/actualizado luego.
import TaskCenter from '../components/home/TaskCenter';
import Loader from '../components/common/Loader';
// --- INICIO DE LA INTEGRACIÓN ---
// 1. Se importa el nuevo componente que hemos creado.
import ActivityTicker from '../components/home/ActivityTicker';
// --- FIN DE LA INTEGRACIÓN ---

<<<<<<< HEAD
// --- COMPONENTE ELIMINADO: UserBalanceDisplay ---
// El componente que mostraba el saldo principal ha sido eliminado según los requerimientos.

const MinerAnimation = () => {
=======
const UserHeader = ({ user }) => {
    const balance = user?.balance?.usdt || 0;
    
    return (
        <div className="flex items-center gap-4 p-4 bg-card/70 backdrop-blur-md rounded-2xl border border-border shadow-medium">
            <img 
                src={user?.photoUrl || '/assets/images/user-avatar-placeholder.png'} 
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-accent-primary/50"
            />
            <div className="flex-1">
                <p className="text-lg font-bold text-text-primary">{user?.username || 'Usuario'}</p>
                <p className="text-xs text-text-secondary font-mono">ID: {user?.telegramId}</p>
            </div>
            <div className="text-right">
                <p className="font-bold text-accent-primary text-xl">{balance.toFixed(2)}</p>
                <p className="text-xs text-text-secondary">USDT</p>
            </div>
        </div>
    );
};


const FactoryAnimation = () => {
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503
    const { t } = useTranslation();
    const [isVideoLoading, setVideoLoading] = React.useState(true);
    return (
        <div className="relative w-full max-w-sm mx-auto aspect-square rounded-3xl overflow-hidden bg-black/20 border border-border shadow-medium">
            {isVideoLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader text={t('homePage.loadingAnimation', 'Cargando animación...')} />
                </div>
            )}
            {/* Se mantiene la animación existente por ahora. Puede ser reemplazada por una nueva de "mineros". */}
            <video
                src="/animations/factory-animation.mp4"
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={() => setVideoLoading(false)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${isVideoLoading ? 'opacity-0' : 'opacity-100'}`}
            />
        </div>
    );
};

const HomePage = () => {
    const { t } = useTranslation();
    const { user, setUser } = useUserStore();

    const handleClaim = async (purchasedFactoryId) => {
        toast.loading(t('homePage.toasts.claiming'), { id: 'claim_request' });
        try {
            const response = await api.post('/wallet/claim-production', { purchasedFactoryId });
            setUser(response.data.user);
            toast.success(response.data.message, { id: 'claim_request' });
        } catch (error) {
            toast.error(error.response?.data?.message || t('common.error'), { id: 'claim_request' });
        }
    };

    if (!user) {
        return <div className="flex items-center justify-center h-full"><Loader text={t('common.loadingUser')} /></div>;
    }

<<<<<<< HEAD
    const purchasedMiners = user?.purchasedFactories || [];
    
    return (
        <motion.div 
            className="flex flex-col gap-6 p-4 pt-6 pb-28" // Se ajusta el 'gap' tras la eliminación del saldo.
=======
    const purchasedFactories = user?.purchasedFactories || [];
    
    return (
        <motion.div 
            className="flex flex-col gap-6 p-4 pt-6 pb-28" 
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
<<<<<<< HEAD
            {/* ELIMINADO: Ya no se renderiza UserBalanceDisplay */}
            
            <MinerAnimation />
            
            <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">{t('homePage.myMiners', 'Mis Mineros')}</h2>
                {purchasedMiners.length > 0 ? (
=======
            <UserHeader user={user} />
            
            {/* --- INICIO DE LA INTEGRACIÓN --- */}
            {/* 2. Se inyecta el componente Ticker en la posición solicitada. */}
            <ActivityTicker />
            {/* --- FIN DE LA INTEGRACIÓN --- */}
            
            <FactoryAnimation />

            <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">{t('homePage.myFactories')}</h2>
                {purchasedFactories.length > 0 ? (
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503
                    <div className="space-y-4">
                        {purchasedMiners.map(pf => (
                            // Este componente (PurchasedFactoryItem) también deberá ser actualizado en el siguiente paso.
                            <PurchasedFactoryItem 
                                key={pf._id} 
                                purchasedFactory={pf}
                                onClaim={handleClaim}
                            />
                        ))}
                    </div>
                ) : (
<<<<<<< HEAD
                    <div className="bg-surface/50 backdrop-blur-md rounded-2xl p-8 text-center text-text-secondary border border-border shadow-medium">
                        <p>{t('homePage.noMiners', 'No tienes mineros activos.')}</p>
                        <p className="text-sm mt-2">{t('homePage.goToMarket', 'Visita el mercado para empezar a producir.')}</p>
=======
                    <div className="bg-card/70 backdrop-blur-md rounded-2xl p-8 text-center text-text-secondary border border-border shadow-medium">
                        <p>{t('homePage.noFactories')}</p>
                        <p className="text-sm mt-2">{t('homePage.goToStore')}</p>
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503
                    </div>
                )}
            </div>

             <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">{t('homePage.tasks')}</h2>
                <TaskCenter />
            </div>
        </motion.div>
    );
};

export default HomePage;