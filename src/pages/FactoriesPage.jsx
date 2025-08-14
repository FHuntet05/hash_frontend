// RUTA: frontend/src/pages/FactoriesPage.jsx (v3.0 - CON FLUJO DE DEPÓSITO)

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import useUserStore from '../store/userStore';
import FactoryCard from '../components/factories/FactoryCard';
import Loader from '../components/common/Loader';
import FactoryPurchaseModal from '../components/factories/FactoryPurchaseModal';
import DirectDepositModal from '../components/modals/DirectDepositModal'; // Importar modal de depósito

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

const FactoriesPage = () => {
  const { t } = useTranslation();
  const [factories, setFactories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUserStore();
  const [selectedFactory, setSelectedFactory] = useState(null);

  // --- LÓGICA PARA EL MODAL DE DEPÓSITO ---
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  
  const handleGoToDeposit = async () => {
      setSelectedFactory(null); // Cerrar el modal de compra
      toast.loading(t('profilePage.toasts.generatingAddress', 'Generando tu dirección...'), { id: 'deposit_address' });
      try {
        const response = await api.post('/wallet/create-deposit-address');
        setPaymentInfo(response.data);
        setDepositModalOpen(true);
        toast.success(t('profilePage.toasts.addressGenerated', 'Dirección generada.'), { id: 'deposit_address' });
      } catch (error) {
        toast.error(error.response?.data?.message || t('common.error'), { id: 'deposit_address' });
      }
  };
  // --- FIN DE LÓGICA ---

  useEffect(() => { 
    // ... (código de fetchFactories sin cambios)
    const fetchFactories = async () => {
        try {
            setLoading(true);
            const response = await api.get('/factories');
            setFactories(response.data);
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.data?.message || t('factoriesPage.error');
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    fetchFactories();
  }, [t]);

  const ownedFactoryIds = useMemo(() => {
    if (!user || !user.purchasedFactories) return new Set();
    return new Set(user.purchasedFactories.map(pf => pf.factory?._id).filter(Boolean));
  }, [user]);

  const handleBuyClick = (factory) => setSelectedFactory(factory);
  const handleCloseModal = () => setSelectedFactory(null);

  // ... (StatusCard sin cambios)
  const StatusCard = ({ message, className = 'text-text-secondary' }) => (
    <motion.div 
      key="status-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-card/70 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 shadow-subtle ${className}`}
    >
      <p>{message}</p>
    </motion.div>
  );

  return (
    <>
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar p-4 pt-6 gap-6 pb-28">
        {/* ... (código de header y renderizado de lista sin cambios) */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary">{t('factoriesPage.title', 'Tienda de Fábricas')}</h1>
          <p className="text-text-secondary mt-1">{t('factoriesPage.subtitle', 'Adquiere nuevas fábricas para aumentar tu producción.')}</p>
        </div>

        <AnimatePresence mode="wait">
          {loading ? ( 
            <motion.div key="loader" className="flex justify-center pt-8"><Loader /></motion.div> 
          ) : error ? ( 
            <StatusCard message={error} className="text-status-danger" />
          ) : factories.length > 0 ? (
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {factories.map((factory) => (
                  <motion.div 
                    key={factory._id} 
                    variants={itemVariants} 
                  >
                    <FactoryCard 
                      factory={factory} 
                      onBuyClick={handleBuyClick}
                      isOwned={ownedFactoryIds.has(factory._id)}
                    />
                  </motion.div>
                )
              )}
            </motion.div>
          ) : (
             <StatusCard message={t('factoriesPage.noFactoriesAvailable', 'No hay fábricas disponibles en la tienda en este momento.')} />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedFactory && (
          <FactoryPurchaseModal 
            factory={selectedFactory} 
            onClose={handleCloseModal} 
            onGoToDeposit={handleGoToDeposit} // Pasar la función al modal
          />
        )}
        {isDepositModalOpen && (
          <DirectDepositModal 
            paymentInfo={paymentInfo} 
            onClose={() => setDepositModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FactoriesPage;