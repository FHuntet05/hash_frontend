// RUTA: frontend/src/pages/HomePage.jsx (v4.0 - REDISEÑO "OBSIDIAN BLUE")

import React from 'react';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import PurchasedMinerItem from '../components/miners/PurchasedMinerItem'; // Asumiendo que el componente y directorio ya han sido renombrados
import TaskCenter from '../components/home/TaskCenter';
import Loader from '../components/common/Loader';

const MinerAnimation = () => {
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
    const user = useUserStore(state => state.user);
    const setUser = useUserStore(state => state.setUser);

    const handleClaim = async (purchasedMinerId) => {
        toast.loading(t('homePage.toasts.claiming', 'Reclamando...'), { id: 'claim_request' });
        try {
            // La API del backend espera 'purchasedFactoryId' en el cuerpo, mantenemos esa compatibilidad por ahora.
            const response = await api.post('/wallet/claim-miner', { purchasedFactoryId: purchasedMinerId });
            setUser(response.data.user);
            toast.success(response.data.message, { id: 'claim_request' });
        } catch (error) {
            toast.error(error.response?.data?.message || t('common.error'), { id: 'claim_request' });
        }
    };

    if (!user) {
        return <div className="flex items-center justify-center h-full"><Loader text={t('common.loadingUser', "Cargando usuario...")} /></div>;
    }

    // El objeto de usuario ahora tiene 'purchasedMiners'.
    const purchasedMiners = user?.purchasedMiners || [];
    
    return (
        <motion.div 
            className="flex flex-col gap-6 p-4 pt-6 pb-28" // Se ajusta el 'gap' tras la eliminación del saldo.
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <MinerAnimation />
            
            <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">{t('homePage.myMiners', 'Mis Mineros')}</h2>
                {purchasedMiners.length > 0 ? (
                    <div className="space-y-4">
                        {purchasedMiners.map(pm => (
                            <PurchasedMinerItem 
                                key={pm._id} 
                                purchasedMiner={pm}
                                onClaim={handleClaim}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-surface/50 backdrop-blur-md rounded-2xl p-8 text-center text-text-secondary border border-border shadow-medium">
                        <p>{t('homePage.noMiners', 'No tienes mineros activos.')}</p>
                        <p className="text-sm mt-2">{t('homePage.goToMarket', 'Visita el mercado para empezar a producir.')}</p>
                    </div>
                )}
            </div>

             <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">{t('homePage.tasks', 'Tareas')}</h2>
                <TaskCenter />
            </div>
        </motion.div>
    );
};

export default HomePage;