// RUTA: frontend/src/pages/HomePage.jsx (VERSIÓN MEGA FÁBRICA FINAL)

import React from 'react';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

import PurchasedFactoryItem from '../components/factories/PurchasedFactoryItem'; // Importamos el nuevo componente
import Loader from '../components/common/Loader';

// Componente para mostrar el balance, ahora más robusto.
const UserBalanceDisplay = ({ balance, productionBalance }) => {
    const formattedBalance = typeof balance === 'number' ? balance.toFixed(4) : '0.0000';
    const formattedProduction = typeof productionBalance === 'number' ? productionBalance.toFixed(4) : '0.0000';
    
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-dark-secondary rounded-lg border border-white/10">
                <p className="text-sm text-text-secondary uppercase tracking-widest">Saldo Principal</p>
                <p className="text-3xl font-bold text-white mt-1">
                    {formattedBalance} <span className="text-xl text-accent-start">USDT</span>
                </p>
            </div>
             <div className="text-center p-4 bg-dark-secondary rounded-lg border border-white/10">
                <p className="text-sm text-text-secondary uppercase tracking-widest">Producción</p>
                <p className="text-3xl font-bold text-white mt-1">
                    {formattedProduction} <span className="text-xl text-green-400">USDT</span>
                </p>
            </div>
        </div>
    );
};

const HomePage = () => {
    const { t } = useTranslation();
    const { user, setUser } = useUserStore();

    const handleClaim = async (purchasedFactoryId) => {
        toast.loading(t('homePage.toasts.claiming', 'Reclamando producción...'), { id: 'claim_request' });
        try {
            // Se asume la existencia de este endpoint, que crearemos a continuación.
            const response = await api.post('/wallet/claim-production', { purchasedFactoryId });
            setUser(response.data.user); // Actualizamos el usuario con los nuevos balances y timestamps
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

            <div className="w-full h-48 bg-dark-secondary rounded-lg flex items-center justify-center text-text-secondary border border-white/10">
                <p>Aquí irá la animación del Rig de Minería</p>
            </div>

            <div>
                <h2 className="text-xl font-bold text-white mb-3">Mis Fábricas</h2>
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
                    <div className="bg-dark-secondary rounded-lg p-8 text-center text-text-secondary border border-white/10">
                        <p>{t('homePage.noFactories', 'No tienes fábricas activas.')}</p>
                        <p className="text-sm mt-2">{t('homePage.goToStore', 'Visita la tienda para adquirir tu primera fábrica y empezar a producir.')}</p>
                    </div>
                )}
            </div>

             <div>
                <h2 className="text-xl font-bold text-white mb-3">Tareas</h2>
                <div className="bg-dark-secondary rounded-lg p-8 flex items-center justify-center text-text-secondary border border-white/10">
                    <p>{t('homePage.tasksComingSoon', 'El centro de tareas estará disponible próximamente.')}</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;