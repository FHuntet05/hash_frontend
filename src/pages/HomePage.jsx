// RUTA: frontend/src/pages/HomePage.jsx (v3.0 - FINAL CON TAREAS Y FIX DE FÁBRICA)

import React from 'react';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import PurchasedFactoryItem from '../components/factories/PurchasedFactoryItem';
import TaskCenter from '../components/tasks/TaskCenter'; // Importar el nuevo TaskCenter
import Loader from '../components/common/Loader';

const UserBalanceDisplay = ({ balance }) => {
    // ... (sin cambios)
    const { t } = useTranslation();
    const formattedBalance = typeof balance === 'number' ? balance.toFixed(4) : '0.0000';
    return (
        <div className="text-center p-4 bg-card/70 backdrop-blur-md rounded-2xl border border-white/20 shadow-medium">
            <p className="text-sm text-text-secondary uppercase tracking-widest">{t('homePage.mainBalance', 'Saldo Principal')}</p>
            <p className="text-3xl font-bold text-text-primary mt-1">
                {formattedBalance} <span className="text-xl text-accent-primary">USDT</span>
            </p>
        </div>
    );
};

const FactoryAnimation = () => {
    // ... (sin cambios)
    const { t } = useTranslation();
    const [isVideoLoading, setVideoLoading] = React.useState(true);
    return (
        <div className="relative w-full max-w-sm mx-auto aspect-square rounded-3xl overflow-hidden bg-black/5 border border-white/10 shadow-medium">
            {isVideoLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader text={t('homePage.loadingAnimation', 'Cargando animación...')} />
                </div>
            )}
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
    // --- INICIO DE CORRECCIÓN: Usar una selección reactiva del store ---
    // Esto asegura que el componente se vuelva a renderizar cuando 'user' cambie.
    const user = useUserStore(state => state.user);
    const setUser = useUserStore(state => state.setUser);
    // --- FIN DE CORRECCIÓN ---

    const handleClaim = async (purchasedFactoryId) => {
        toast.loading(t('homePage.toasts.claiming', 'Reclamando...'), { id: 'claim_request' });
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
    
    return (
        <motion.div 
            className="flex flex-col gap-4 p-4 pt-6 pb-28" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <UserBalanceDisplay balance={user.balance?.usdt} />
            <FactoryAnimation />
            <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">{t('homePage.myFactories', 'Mis Fábricas')}</h2>
                {user.purchasedFactories && user.purchasedFactories.length > 0 ? (
                    <div className="space-y-4">
                        {user.purchasedFactories.map(pf => (
                            <PurchasedFactoryItem 
                                key={pf._id} 
                                purchasedFactory={pf}
                                onClaim={handleClaim}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-card/70 backdrop-blur-md rounded-2xl p-8 text-center text-text-secondary border border-white/20 shadow-medium">
                        <p>{t('homePage.noFactories', 'No tienes fábricas activas.')}</p>
                        <p className="text-sm mt-2">{t('homePage.goToStore', 'Visita la tienda para empezar a producir.')}</p>
                    </div>
                )}
            </div>
             <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">{t('homePage.tasks', 'Tareas')}</h2>
                {/* --- INICIO DE MODIFICACIÓN: Integrar TaskCenter --- */}
                <TaskCenter />
                {/* --- FIN DE MODIFICACIÓN --- */}
            </div>
        </motion.div>
    );
};

export default HomePage;