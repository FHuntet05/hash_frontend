// RUTA: frontend/src/pages/FactoriesPage.jsx (UI FINAL ALINEADA)

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axiosConfig'; // Cambiado para usar el api singleton
import toast from 'react-hot-toast'; // Usar react-hot-toast para consistencia
import { motion, AnimatePresence } from 'framer-motion';

import useUserStore from '../store/userStore';
import FactoryCard from '../components/factories/FactoryCard';
import Loader from '../components/common/Loader';
import FactoryPurchaseModal from '../components/modals/FactoryPurchaseModal';

const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

const FactoriesPage = () => {
  const { t } = useTranslation();
  // Eliminamos factoriesStore para simplificar y alinear con otros componentes
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
            setError(t('factoriesPage.error', 'No se pudieron cargar las fábricas.'));
            toast.error(error);
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
    // Contenedor principal ahora con padding consistente y espaciado inferior para el BottomNav
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-5 pb-24 animate-fade-in">
      
      <div className="text-center pt-4">
        {/* --- CAMBIO: Paleta de colores actualizada --- */}
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
                    onPurchase={handleBuyClick} // Renombrado en la prop para consistencia
                    isOwned={ownedFactoryIds.has(factory._id)} // Prop más clara
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