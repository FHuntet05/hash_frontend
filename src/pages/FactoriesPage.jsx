// RUTA: frontend/src/pages/FactoriesPage.jsx (SIN UserInfoHeader)
import React, { useState, useEffect, useMemo } from 'react';
import useFactoriesStore from '../store/factoriesStore';
import useUserStore from '../store/userStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// ELIMINADO: import UserInfoHeader from '../components/home/UserInfoHeader';
import FactoryCard from '../components/factories/FactoryCard';
import Loader from '../components/common/Loader';
import FactoryPurchaseModal from '../components/factories/FactoryPurchaseModal';

const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

const FactoriesPage = () => {
  const { t } = useTranslation();
  const { factories, loading, error, fetchFactories } = useFactoriesStore(); 
  const { user } = useUserStore();
  const [selectedFactory, setSelectedFactory] = useState(null);
  
  useEffect(() => { 
    if (factories.length === 0) {
      fetchFactories();
    }
  }, [factories, fetchFactories]);

  const ownedFactoryIds = useMemo(() => {
    if (!user || !user.purchasedFactories) return new Set();
    return new Set(user.purchasedFactories.map(pf => pf.factory._id));
  }, [user]);

  const handleBuyClick = (factory) => setSelectedFactory(factory);
  const handleCloseModal = () => setSelectedFactory(null);

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 p-4 space-y-5 animate-fade-in">
      {/* ELIMINADO: <UserInfoHeader /> */}
      
      <div className="text-center pt-4">
        <h1 className="text-2xl font-bold text-white">{t('factoriesPage.title', 'Tienda de Fábricas')}</h1>
        <p className="text-text-secondary">{t('factoriesPage.subtitle', 'Adquiere nuevas fábricas para aumentar tu producción.')}</p>
      </div>

      <AnimatePresence mode="wait">
        {loading ? ( 
          <motion.div key="loader" className="flex justify-center pt-8">
            <Loader text={t('factoriesPage.loading', 'Cargando fábricas...')} />
          </motion.div> 
        ) : error ? ( 
          <motion.div key="error" className="text-center text-red-400 p-8">
            {t('factoriesPage.error', 'No se pudieron cargar las fábricas.')}
          </motion.div> 
        ) : (
          <div className="space-y-5">
            {factories.map((factory, index) => (
                <motion.div 
                  key={factory._id} 
                  variants={itemVariants} 
                  initial="hidden" 
                  animate="visible"
                  transition={{ delay: 0.1 * index }}
                >
                  <FactoryCard 
                    factory={factory} 
                    onBuyClick={handleBuyClick}
                    ownedCount={ownedFactoryIds.has(factory._id) ? 1 : 0}
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