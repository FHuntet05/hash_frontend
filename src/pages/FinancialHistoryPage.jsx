// RUTA: frontend/src/pages/FinancialHistoryPage.jsx (DISEÑO CRISTALINO)

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axiosConfig';
import TransactionItem from '../components/history/TransactionItem';
import Loader from '../components/common/Loader';
import StaticPageLayout from '../components/layout/StaticPageLayout';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };

const FinancialHistoryPage = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get('/wallet/history');
        setTransactions(response.data);
      } catch (err) {
        setError(t('historyPage.error', 'No se pudo cargar el historial.'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [t]);

  // Componente para mostrar mensajes de estado dentro de una tarjeta
  const StatusCard = ({ message, className = 'text-text-secondary' }) => (
      <motion.div 
        key="status-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-card/70 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 shadow-subtle ${className}`}
      >
        <p>{message}</p>
      </motion.div>
  );

  return (
    <StaticPageLayout title={t('historyPage.title', 'Historial de Transacciones')}>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loader" className="flex justify-center items-center h-full pt-16">
            <Loader text={t('historyPage.loading', 'Cargando...')} />
          </motion.div>
        ) : error ? (
          <StatusCard message={error} className="text-status-danger" />
        ) : transactions.length === 0 ? (
          <StatusCard message={t('historyPage.empty', 'No tienes transacciones todavía.')} />
        ) : (
          <motion.div 
            key="list" 
            className="space-y-3" 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
          >
            {transactions.map((tx) => (<TransactionItem key={tx._id} transaction={tx} />))}
          </motion.div>
        )}
      </AnimatePresence>
    </StaticPageLayout>
  );
};

export default FinancialHistoryPage;