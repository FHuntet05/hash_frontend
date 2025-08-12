// RUTA: frontend/src/pages/FactoriesPage.jsx (ANTES ToolsPage.jsx)
import React, { useState, useEffect, useMemo } from 'react';
import useFactoriesStore from '../store/factoriesStore'; // CAMBIO: Usaremos un nuevo store para fábricas
import useUserStore from '../store/userStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import UserInfoHeader from '../components/home/UserInfoHeader'; // Componente reutilizado
import FactoryCard from '../components/factories/FactoryCard'; // Nuevo componente
import Loader from '../components/common/Loader';
import FactoryPurchaseModal from '../components/factories/FactoryPurchaseModal'; // Nuevo modal

const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

const FactoriesPage = () => {
  const { t } = useTranslation();
  // Se asume la creación de un 'factoriesStore' similar al 'toolsStore'
  const { factories, loading, error, fetchFactories } = useFactoriesStore(); 
  const { user } = useUserStore();
  
  const [selectedFactory, setSelectedFactory] = useState(null);
  
  useEffect(() => { 
    // Si las fábricas no están cargadas, las buscamos.
    if (factories.length === 0) {
      fetchFactories();
    }
  }, [factories, fetchFactories]);

  // Calculamos qué fábricas ya posee el usuario para bloquearlas en la UI
  const ownedFactoryIds = useMemo(() => {
    if (!user || !user.purchasedFactories) return new Set();
    return new Set(user.purchasedFactories.map(pf => pf.factory._id));
  }, [user]);

  const handleBuyClick = (factory) => setSelectedFactory(factory);
  const handleCloseModal = () => setSelectedFactory(null);

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 p-4 space-y-5 animate-fade-in">
      <UserInfoHeader />
      
      <div className="text-center">
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
            {factories.map(factory => (
                <motion.div 
                  key={factory._id} 
                  variants={itemVariants} 
                  initial="hidden" 
                  animate="visible"
                  transition={{ delay: 0.1 * factories.indexOf(factory) }}
                >
                  <FactoryCard 
                    factory={factory} 
                    onBuyClick={handleBuyClick}
                    // Pasamos 1 si la fábrica está en la lista de poseídas, 0 si no.
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