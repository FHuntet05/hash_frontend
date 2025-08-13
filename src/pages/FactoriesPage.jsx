// RUTA: frontend/src/pages/FactoriesPage.jsx (UI FINAL ALINEADA - RUTA CORREGIDA)

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import useUserStore from '../store/userStore';
import FactoryCard from '../components/factories/FactoryCard';
import Loader from '../components/common/Loader';

// --- INICIO DE LA CORRECCIÓN CRÍTICA ---
// La ruta anterior apuntaba a /modals/, lo cual era incorrecto.
// Se restaura la ruta para que apunte a la carpeta /factories/ donde reside el componente.
import FactoryPurchaseModal from '../components/factories/FactoryPurchaseModal';
// --- FIN DE LA CORRECCIÓN CRÍTICA ---

const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

const FactoriesPage = () => {
  const { t } = useTranslation();
  const [factories, setFactories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useUserStore();
  const [selectedFactory, setSelectedFactory] = useState(null);
  
  useEffect(() => { 
    const fetchFactories = async () => {
        try {
            setLoading(true);
            const response = await api.get('/factories');
            setFactories(response.data);
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.data?.message || t('factoriesPage.error', 'No se pudieron cargar las fábricas.');
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
    return new Set(user.purchasedFactories.map(pf => pf.factory?._id).filter(id => id));
  }, [user]);

  const handleBuyClick = (factory) => setSelectedFactory(factory);
  const handleCloseModal = () => setSelectedFactory(null);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-5 pb-24 animate-fade-in">
      
      <div className="text-center pt-4">
        <h1 className="text-2xl font-bold text-slate-50">{t('factoriesPage.title', 'Tienda de Fábricas')}</h1>
        <p className="text-slate-400 mt-1">{t('factoriesPage.subtitle', 'Adquiere nuevas fábricas para aumentar tu producción.')}</p>
      </div>

      <AnimatePresence mode="wait">
        {loading ? ( 
          <motion.div key="loader" className="flex justify-center pt-8">
            <Loader text={t('factoriesPage.loading', 'Cargando fábricas...')} />
          </motion.div> 
        ) : error ? ( 
          <motion.div key="error" className="text-center text-red-400 p-8">
            {error}
          </motion.div> 
        ) : (
          <div className="space-y-4">
            {factories.map((factory, index) => (
                <motion.div 
                  key={factory._id} 
                  variants={itemVariants} 
                  initial="hidden" 
                  animate="visible"
                  transition={{ delay: 0.05 * index }}
                >
                  <FactoryCard 
                    factory={factory} 
                    onPurchase={handleBuyClick}
                    isOwned={ownedFactoryIds.has(factory._id)}
                  />
                </motion.div>
              )
            )}
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedFactory && (
          <FactoryPurchaseModal 
            factory={selectedFactory} 
            onClose={handleCloseModal} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FactoriesPage;