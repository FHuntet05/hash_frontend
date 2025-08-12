// RUTA: frontend/src/pages/HomePage.jsx (VERSIÓN MEGA FÁBRICA FINAL - UI RENOVADA)

import React from 'react';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

import PurchasedFactoryItem from '../components/factories/PurchasedFactoryItem';
import Loader from '../components/common/Loader';

// Componente de Balance rediseñado con la nueva paleta de colores.
const UserBalanceDisplay = ({ balance, productionBalance }) => {
    const formattedBalance = typeof balance === 'number' ? balance.toFixed(4) : '0.0000';
    const formattedProduction = typeof productionBalance === 'number' ? productionBalance.toFixed(4) : '0.0000';
    
    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Saldo Principal */}
            <div className="text-center p-4 bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
                <p className="text-sm text-slate-400 uppercase tracking-widest">Saldo Principal</p>
                <p className="text-3xl font-bold text-slate-100 mt-1">
                    {formattedBalance} <span className="text-xl text-sky-400">USDT</span>
                </p>
            </div>
            {/* Producción */}
             <div className="text-center p-4 bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
                <p className="text-sm text-slate-400 uppercase tracking-widest">Producción</p>
                <p className="text-3xl font-bold text-slate-100 mt-1">
                    {formattedProduction} <span className="text-xl text-lime-400">USDT</span>
                </p>
            </div>
        </div>
    );
};

// Componente de la Animación de la Fábrica
const FactoryAnimation = () => {
    return (
        <div className="w-full h-48 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 border border-slate-700 overflow-hidden shadow-lg">
            {/* 
              NOTA DE ARQUITECTURA: Usamos la etiqueta <video> en lugar de un GIF.
              Es más eficiente en tamaño de archivo y ofrece mayor calidad.
              'autoPlay', 'loop', 'muted' y 'playsInline' son cruciales para una reproducción fluida y automática en todos los dispositivos.
              El video debe estar en la carpeta `public/animations/factory-animation.mp4`
            */}
            <video
                src="/animations/factory-animation.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
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
            toast.success(response.data.message, { id: 'claim_request' });
        } catch (error) {
            toast.error(error.response?.data?.message || t('common.error', 'Ocurrió un error'), { id: 'claim_request' });
        }
    };

    if (!user) {
        return <div className="flex items-center justify-center h-full"><Loader text="Cargando datos del usuario..." /></div>;
    }
    
    return (
        <div className="flex flex-col h-full animate-fade-in gap-6 overflow-y-auto p-4 pb-24">
            <UserBalanceDisplay balance={user.balance?.usdt} productionBalance={user.productionBalance?.usdt} />

            <FactoryAnimation />

            {/* Sección Mis Fábricas */}
            <div>
                <h2 className="text-xl font-bold text-slate-100 mb-3">Mis Fábricas</h2>
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
                    <div className="bg-slate-800 rounded-lg p-8 text-center text-slate-400 border border-slate-700 shadow-lg">
                        <p>{t('homePage.noFactories', 'No tienes fábricas activas.')}</p>
                        <p className="text-sm mt-2">{t('homePage.goToStore', 'Visita la tienda para adquirir tu primera fábrica y empezar a producir.')}</p>
                    </div>
                )}
            </div>

            {/* Sección Tareas */}
             <div>
                <h2 className="text-xl font-bold text-slate-100 mb-3">Tareas</h2>
                <div className="bg-slate-800 rounded-lg p-8 flex items-center justify-center text-slate-400 border border-slate-700 shadow-lg">
                    <p>{t('homePage.tasksComingSoon', 'El centro de tareas estará disponible próximamente.')}</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;