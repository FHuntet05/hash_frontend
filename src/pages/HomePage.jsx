import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';
import api from '../api/axiosConfig';
import { motion } from 'framer-motion';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';

import PowerDashboard from '../components/home/PowerDashboard';
import TransactionItem from '../components/history/TransactionItem';
import Loader from '../components/common/Loader';

const HomePage = () => {
    const { t } = useTranslation();
    // Obtenemos refreshUserData del store para invocar el Lazy Claim
    const { user, refreshUserData } = useUserStore();
    
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    // EFECTO DE INICIO: TRIGGER DE AUTOCLAIM Y CARGA DE HISTORIAL
    useEffect(() => {
        // 1. Llamar al endpoint /profile para que el backend procese ganancias pendientes
        // Esto es vital para que el usuario vea su saldo actualizado al abrir la app
        if (user) {
            refreshUserData().catch(err => console.error("Error auto-claim:", err));
        }

        // 2. Cargar Historial de Transacciones
        const fetchHistory = async () => {
            try {
                const response = await api.get('/wallet/history');
                // Filtrar visualmente solo depósitos y retiros
                const filtered = response.data.filter(tx => 
                    ['deposit', 'withdrawal'].includes(tx.type)
                ).slice(0, 10); 
                setHistory(filtered);
            } catch (error) {
                console.error("Error cargando historial:", error);
            } finally {
                setLoadingHistory(false);
            }
        };

        if (user) {
            fetchHistory();
        }
    }, [user?.telegramId]); // Dependencia en ID para asegurar ejecución una vez logueado

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
            {/* DASHBOARD DE POTENCIA (CON BUCLE VISUAL DE 12H) */}
            <PowerDashboard user={user} />

            {/* HISTORIAL (DEPÓSITOS/RETIROS) */}
            <div className="mt-2">
                <div className="flex items-center gap-2 mb-4 px-1">
                    <HiOutlineClipboardDocumentList className="text-accent w-5 h-5" />
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
                            {t('homePage.noActivity', 'Sin movimientos recientes.')}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default HomePage;