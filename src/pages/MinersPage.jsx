// RUTA: frontend/src/pages/MinersPage.jsx (v4.1 - SINCRONIZACIÓN DE MODAL)

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import useUserStore from '../store/userStore';
import MinerCard from '../components/miners/MinerCard';
// --- INICIO DE CORRECCIÓN CRÍTICA ---
// Se importa el modal con su nombre correcto.
import MinerPurchaseModal from '../components/miners/MinerPurchaseModal';
// --- FIN DE CORRECCIÓN CRÍTICA ---
import DirectDepositModal from '../components/modals/DirectDepositModal';
import Loader from '../components/common/Loader';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

const MinersPage = () => {
  const { t } = useTranslation();
  const [miners, setMiners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUserStore();
  const [selectedMiner, setSelectedMiner] = useState(null);

  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  
  const handleGoToDeposit = async () => {
      setSelectedMiner(null);
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

  useEffect(() => { 
    const fetchMiners = async () => {
        try {
            setLoading(true);
            const response = await api.get('/miners');
            setMiners(response.data);
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.data?.message || t('minersPage.error', 'Error al cargar el mercado.');
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    fetchMiners();
  }, [t]);

  const ownedMinerIds = useMemo(() => {
    if (!user || !user.purchasedMiners) return new Set();
    return new Set(user.purchasedMiners.map(pm => pm.miner?._id).filter(Boolean));
  }, [user]);

  const handleBuyClick = (miner) => setSelectedMiner(miner);
  const handleCloseModal = () => setSelectedMiner(null);

  const StatusCard = ({ message, className = 'text-text-secondary' }) => (
    <motion.div 
      key="status-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-surface/50 backdrop-blur-md rounded-2xl p-8 text-center border border-border shadow-subtle ${className}`}
    >
      <p>{message}</p>
    </motion.div>
  );

  return (
    <>
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar p-4 pt-6 gap-6 pb-28">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary">{t('minersPage.title', 'Mercado de Mineros')}</h1>
          <p className="text-text-secondary mt-1">{t('minersPage.subtitle', 'Adquiere nuevos mineros para aumentar tu producción.')}</p>
        </div>

        <AnimatePresence mode="wait">
          {loading ? ( 
            <motion.div key="loader" className="flex justify-center pt-8"><Loader /></motion.div> 
          ) : error ? ( 
            <StatusCard message={error} className="text-status-danger" />
          ) : miners.length > 0 ? (
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {miners.map((miner) => (
                  <motion.div 
                    key={miner._id} 
                    variants={itemVariants} 
                  >
                    <MinerCard 
                      miner={miner}
                      onBuyClick={handleBuyClick}
                      isOwned={ownedMinerIds.has(miner._id)}
                    />
                  </motion.div>
                )
              )}
            </motion.div>
          ) : (
             <StatusCard message={t('minersPage.noMinersAvailable', 'No hay mineros disponibles en el mercado en este momento.')} />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedMiner && (
          // --- INICIO DE CORRECCIÓN CRÍTICA ---
          // Se usa el nombre correcto del componente.
          // Se pasa la prop con el nombre correcto: 'miner'.
          <MinerPurchaseModal 
            miner={selectedMiner}
            onClose={handleCloseModal} 
            onGoToDeposit={handleGoToDeposit}
          />
          // --- FIN DE CORRECCIÓN CRÍTICA ---
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

export default MinersPage;