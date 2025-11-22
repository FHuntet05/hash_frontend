import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';
import api from '../api/axiosConfig';
import { motion } from 'framer-motion';
import { HiOutlineClipboardList } from 'react-icons/hi2';

import PowerDashboard from '../components/home/PowerDashboard';
import TransactionItem from '../components/history/TransactionItem';
import Loader from '../components/common/Loader';

const HomePage = () => {
    const { t } = useTranslation();
    const user = useUserStore(state => state.user);
    
    // Estado para el historial integrado
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    // Cargar historial filtrado (Solo Depósitos y Retiros como solicitaste)
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/wallet/history');
                // Filtramos en el cliente para mostrar solo movimientos de fondos externos
                const filtered = response.data.filter(tx => 
                    ['deposit', 'withdrawal'].includes(tx.type)
                ).slice(0, 10); // Mostramos solo los últimos 10 para no saturar el home
                setHistory(filtered);
            } catch (error) {
                console.error("Error cargando historial en home:", error);
            } finally {
                setLoadingHistory(false);
            }
        };

        if (user) {
            fetchHistory();
        }
    }, [user]);

    if (!user) {
        return <div className="flex items-center justify-center h-full"><Loader /></div>;
    }
    
    return (
        <motion.div 
            className="flex flex-col gap-6 p-4 pt-6 pb-28" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
        >
            {/* 1. El Nuevo Dashboard de Potencia */}
            <PowerDashboard user={user} />

            {/* 2. Sección de Historial Integrado */}
            <div className="mt-2">
                <div className="flex items-center gap-2 mb-4 px-1">
                    <HiOutlineClipboardList className="text-accent w-5 h-5" />
                    <h2 className="text-lg font-bold text-text-primary">
                        {t('homePage.recentActivity', 'Actividad Reciente')}
                    </h2>
                </div>

                {loadingHistory ? (
                    <div className="space-y-3">
                        <div className="h-16 bg-surface rounded-xl animate-pulse" />
                        <div className="h-16 bg-surface rounded-xl animate-pulse" />
                    </div>
                ) : history.length > 0 ? (
                    <div className="space-y-3">
                        {history.map(tx => (
                            <TransactionItem key={tx._id} transaction={tx} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-surface/50 border border-border border-dashed rounded-xl p-8 text-center">
                        <p className="text-text-secondary text-sm">
                            {t('homePage.noActivity', 'Aún no hay depósitos o retiros registrados.')}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default HomePage;