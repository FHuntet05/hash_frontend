// RUTA: frontend/src/pages/HomePage.jsx (VIDEO CUADRADO Y COLORES SEMÁNTICOS)

import React from 'react';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

import PurchasedFactoryItem from '../components/factories/PurchasedFactoryItem';
import Loader from '../components/common/Loader';

// Componente de Balance rediseñado con la nueva paleta semántica.
const UserBalanceDisplay = ({ balance, productionBalance }) => {
    const { t } = useTranslation();
    const formattedBalance = typeof balance === 'number' ? balance.toFixed(4) : '0.0000';
    const formattedProduction = typeof productionBalance === 'number' ? productionBalance.toFixed(4) : '0.0000';
    
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-card rounded-lg border border-border shadow-lg">
                <p className="text-sm text-text-secondary uppercase tracking-widest">{t('homePage.mainBalance', 'Saldo Principal')}</p>
                <p className="text-3xl font-bold text-text-primary mt-1">
                    {formattedBalance} <span className="text-xl text-accent-primary">USDT</span>
                </p>
            </div>
             <div className="text-center p-4 bg-card rounded-lg border border-border shadow-lg">
                <p className="text-sm text-text-secondary uppercase tracking-widest">{t('homePage.production', 'Producción')}</p>
                <p className="text-3xl font-bold text-text-primary mt-1">
                    {formattedProduction} <span className="text-xl text-accent-secondary">USDT</span>
                </p>
            </div>
        </div>
    );
};

// Componente de la Animación de la Fábrica con formato cuadrado.
const FactoryAnimation = () => {
    return (
        // MODIFICADO: Contenedor ahora es un cuadrado (aspect-square) con ancho máximo y centrado.
        <div className="relative w-full max-w-sm mx-auto aspect-square bg-card rounded-2xl flex items-center justify-center text-text-secondary border border-border overflow-hidden shadow-lg">
            <video
                src="/animations/factory-animation.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
            />
            {/* MODIFICADO: El gradiente ahora usa el color de fondo semántico 'from-card'. */}
            <div 
                className="absolute inset-0 bg-gradient-to-b from-card to-transparent opacity-80"
                aria-hidden="true"
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
        return <div className="flex items-center justify-center h-full"><Loader text={t('common.loadingUser', 'Cargando datos del usuario...')} /></div>;
    }
    
    return (
        <div className="flex flex-col h-full animate-fade-in gap-6 overflow-y-auto p-4 pb-24">
            <UserBalanceDisplay balance={user.balance?.usdt} productionBalance={user.productionBalance?.usdt} />

            <FactoryAnimation />

            {/* Sección Mis Fábricas */}
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
                    <div className="bg-card rounded-lg p-8 text-center text-text-secondary border border-border shadow-lg">
                        <p>{t('homePage.noFactories', 'No tienes fábricas activas.')}</p>
                        <p className="text-sm mt-2">{t('homePage.goToStore', 'Visita la tienda para adquirir tu primera fábrica y empezar a producir.')}</p>
                    </div>
                )}
            </div>

            {/* Sección Tareas */}
             <div>
                <h2 className="text-xl font-bold text-text-primary mb-3">{t('homePage.tasks', 'Tareas')}</h2>
                <div className="bg-card rounded-lg p-8 flex items-center justify-center text-text-secondary border border-border shadow-lg">
                    <p>{t('homePage.tasksComingSoon', 'El centro de tareas estará disponible próximamente.')}</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;