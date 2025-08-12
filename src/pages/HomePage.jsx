// frontend/src/pages/HomePage.jsx (VERSIÓN MEGA FÁBRICA v1.0)

import React from 'react';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';

// Componentes a crear en futuros pasos
// import MiningRigAnimation from '../components/home/MiningRigAnimation';
// import PurchasedFactoryList from '../components/home/PurchasedFactoryList';
// import TaskCenter from '../components/home/TaskCenter';

const UserBalanceDisplay = ({ balance }) => {
    // Componente defensivo: verifica que el balance sea un número antes de usar toFixed.
    const formattedBalance = typeof balance === 'number' ? balance.toFixed(4) : '0.0000';
    return (
        <div className="text-center p-4 bg-dark-secondary rounded-lg border border-white/10">
            <p className="text-sm text-text-secondary uppercase tracking-widest">Saldo Disponible</p>
            <p className="text-4xl font-bold text-white mt-1">
                {formattedBalance} <span className="text-2xl text-accent-start">USDT</span>
            </p>
        </div>
    );
};

const HomePage = () => {
    const { t } = useTranslation();
    const { user } = useUserStore();

    // GUARDIA DE SEGURIDAD:
    // Este es el cambio más importante. No intentamos renderizar nada si el objeto `user` aún no está cargado.
    // El UserGatekeeper ya muestra un loader, así que aquí podemos mostrar un loader simple o nada.
    if (!user) {
        return <div className="flex items-center justify-center h-full"><p>Cargando datos del usuario...</p></div>;
    }
    
    return (
        <div className="flex flex-col h-full animate-fade-in gap-6 overflow-y-auto p-4 pb-24">
            {/* Sección 1: Balance del Usuario */}
            <UserBalanceDisplay balance={user.balance?.usdt} />

            {/* Sección 2: Animación del Rig de Minería (Platzhalter) */}
            <div className="w-full h-48 bg-dark-secondary rounded-lg flex items-center justify-center text-text-secondary border border-white/10">
                {/* <MiningRigAnimation /> */}
                <p>Aquí irá la animación del Rig de Minería</p>
            </div>

            {/* Sección 3: "Mis Fábricas" (Platzhalter) */}
            <div>
                <h2 className="text-xl font-bold text-white mb-3">Mis Fábricas</h2>
                <div className="bg-dark-secondary rounded-lg p-4 min-h-[10rem] flex items-center justify-center text-text-secondary border border-white/10">
                    {/* <PurchasedFactoryList factories={user.purchasedFactories} /> */}
                    <p>Aquí se listarán las fábricas compradas</p>
                </div>
            </div>

             {/* Sección 4: "Tareas" (Platzhalter) */}
             <div>
                <h2 className="text-xl font-bold text-white mb-3">Tareas</h2>
                <div className="bg-dark-secondary rounded-lg p-4 min-h-[8rem] flex items-center justify-center text-text-secondary border border-white/10">
                    {/* <TaskCenter /> */}
                    <p>Aquí irá el centro de tareas</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;