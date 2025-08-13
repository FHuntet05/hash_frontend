// RUTA: frontend/src/pages/HomePage.jsx (VERSIÓN FINAL - TEMA CLARO)

import React from 'react';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

import PurchasedFactoryItem from '../components/factories/PurchasedFactoryItem';
import Loader from '../components/common/Loader';

const UserBalanceDisplay = ({ balance, productionBalance }) => {
    const { t } = useTranslation();
    const formattedBalance = typeof balance === 'number' ? balance.toFixed(4) : '0.0000';
    const formattedProduction = typeof productionBalance === 'number' ? productionBalance.toFixed(4) : '0.0000';
    
    return (
        // MODIFICADO: Tarjetas con fondo blanco sólido y sombra sutil
        <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-card rounded-lg border border-border shadow-subtle">
                <p className="text-sm text-text-secondary uppercase tracking-widest">{t('homePage.mainBalance', 'Saldo Principal')}</p>
                <p className="text-3xl font-bold text-text-primary mt-1">
                    {formattedBalance} <span className="text-xl text-accent-primary">USDT</span>
                </p>
            </div>
             <div className="text-center p-4 bg-card rounded-lg border border-border shadow-subtle">
                <p className="text-sm text-text-secondary uppercase tracking-widest">{t('homePage.production', 'Producción')}</p>
                <p className="text-3xl font-bold text-text-primary mt-1">
                    {formattedProduction} <span className="text-xl text-accent-secondary">USDT</span>
                </p>
            </div>
        </div>
    );
};

const FactoryAnimation = () => {
    return (
        // MODIFICADO: Se elimina la superposición de gradiente. El video ahora se integra naturalmente.
        <div className="relative w-full aspect-video mx-auto rounded-2xl overflow-hidden">
            <video
                src="/animations/factory-animation.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ objectPosition: '50% 65%' }}
            />
        </div>
    );
};


const HomePage = () => {
    const { t } = useTranslation();
    const { user, setUser } = useUserStore();

    const handleClaim = async (purchasedFactoryId) => {
        toast.loading(t('homePage.toasts.claiming', 'Reclamando producción...'), { id: 'claim_request' });
        try {
            const response = await api.post('/wallet/claim-production', { purchasedFactoryId });
            setUser(response.data.user);
            toast.success(t('homePage.toasts.claimSuccess', 'Producción reclamada!'), { id: 'claim_request' });
        } catch (error) {
            toast.error(error.response?.data?.message || t('common.error', 'Ocurrió un error'), { id: 'claim_request' });
        }
    };

    if (!user) {
        return <div className="flex items-center justify-center h-full bg-background"><Loader text={t('common.loadingUser', 'Cargando datos del usuario...')} /></div>;
    }
    
    return (
        <div className="flex flex-col h-full gap-6 p-4 pb-24">
            <UserBalanceDisplay balance={user.balance?.usdt} productionBalance={user.productionBalance?.usdt} />
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
                    <div className="bg-card rounded-lg p-8 text-center text-text-secondary border border-border shadow-subtle">
                        <p>{t('homePage.noFactories', 'No tienes fábricas activas.')}</p>
                        <p className="text-sm mt-2">{t('homePage.goToStore', 'Visita la tienda para adquirir tu primera fábrica y empezar a producir.')}</p>
                    </div>
                )}
            </div>
             <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">{t('homePage.tasks', 'Tareas')}</h2>
                <div className="bg-card rounded-lg p-8 flex items-center justify-center text-text-secondary border border-border shadow-subtle">
                    <p>{t('homePage.tasksComingSoon', 'El centro de tareas estará disponible próximamente.')}</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;