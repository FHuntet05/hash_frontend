<<<<<<< HEAD:src/pages/MinersPage.jsx
// RUTA: frontend/src/pages/FactoriesPage.jsx (v4.0 - SEMÁNTICA "MINER" Y NUEVO TEMA "OBSIDIAN BLUE")
=======
// RUTA: frontend/src/pages/FactoriesPage.jsx (v3.2 - GESTIÓN DE MODALES SINCRONIZADA)
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503:src/pages/FactoriesPage.jsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

<<<<<<< HEAD:src/pages/MinersPage.jsx
import useUserStore from '../store/userStore';
// NOTA: Los siguientes componentes (FactoryCard, FactoryPurchaseModal) necesitarán
// también una refactorización de texto y estilo en los próximos pasos.
=======
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503:src/pages/FactoriesPage.jsx
import FactoryCard from '../components/factories/FactoryCard';
import FactoryPurchaseModal from '../components/factories/FactoryPurchaseModal';
<<<<<<< HEAD:src/pages/MinersPage.jsx
import DirectDepositModal from '../components/modals/DirectDepositModal';
import Loader from '../components/common/Loader';
=======
import SelectNetworkModal from '../components/modals/SelectNetworkModal';
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503:src/pages/FactoriesPage.jsx

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

// Se cambia el nombre del componente de FactoriesPage a MinersPage para coherencia
const MinersPage = () => {
  const { t } = useTranslation();
  const [miners, setMiners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< HEAD:src/pages/MinersPage.jsx
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
=======
  
  // --- INICIO DE LA REINGENIERÍA DE ESTADO DE MODALES ---
  // Se reemplazan los estados booleanos separados por un objeto de estado unificado.
  const [modalState, setModalState] = useState({
    purchase: null, // Almacenará el objeto de la fábrica seleccionada
    selectNetwork: false,
  });

  const openModal = (modalName, data = true) => setModalState(prev => ({ ...prev, [modalName]: data }));
  const closeModal = (modalName) => setModalState(prev => ({ ...prev, [modalName]: null })); // 'null' para purchase, 'false' para el otro

  const handleGoToDeposit = () => {
      closeModal('purchase'); // Cierra el modal de compra
      openModal('selectNetwork'); // Abre el modal de selección de red
  };
  // --- FIN DE LA REINGENIERÍA DE ESTADO DE MODALES ---

  useEffect(() => { 
    const fetchFactories = async () => {
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503:src/pages/FactoriesPage.jsx
        try {
            setLoading(true);
            // La ruta API sigue siendo '/factories' hasta que refactoricemos el backend.
            const response = await api.get('/factories');
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

<<<<<<< HEAD:src/pages/MinersPage.jsx
  const ownedMinerIds = useMemo(() => {
    // La estructura del objeto 'user' en el store ahora usa 'purchasedMiners'.
    if (!user || !user.purchasedMiners) return new Set();
    return new Set(user.purchasedMiners.map(pm => pm.miner?._id).filter(Boolean));
  }, [user]);

  const handleBuyClick = (miner) => setSelectedMiner(miner);
  const handleCloseModal = () => setSelectedMiner(null);

=======
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503:src/pages/FactoriesPage.jsx
  const StatusCard = ({ message, className = 'text-text-secondary' }) => (
    <motion.div 
      key="status-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
<<<<<<< HEAD:src/pages/MinersPage.jsx
      className={`bg-surface/50 backdrop-blur-md rounded-2xl p-8 text-center border border-border shadow-subtle ${className}`}
=======
      className={`bg-card/70 backdrop-blur-md rounded-2xl p-8 text-center border border-border shadow-subtle ${className}`}
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503:src/pages/FactoriesPage.jsx
    >
      <p>{message}</p>
    </motion.div>
  );

  return (
    <>
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar p-4 pt-6 gap-6 pb-28">
        <div className="text-center">
<<<<<<< HEAD:src/pages/MinersPage.jsx
          <h1 className="text-2xl font-bold text-text-primary">{t('minersPage.title', 'Mercado de Mineros')}</h1>
          <p className="text-text-secondary mt-1">{t('minersPage.subtitle', 'Adquiere nuevos mineros para aumentar tu producción.')}</p>
=======
          <h1 className="text-2xl font-bold text-text-primary">{t('factoriesPage.title')}</h1>
          <p className="text-text-secondary mt-1">{t('factoriesPage.subtitle')}</p>
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503:src/pages/FactoriesPage.jsx
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
                    <FactoryCard 
<<<<<<< HEAD:src/pages/MinersPage.jsx
                      factory={miner} // Se sigue pasando la prop 'factory' por compatibilidad con el componente hijo por ahora.
                      onBuyClick={handleBuyClick}
                      isOwned={ownedMinerIds.has(miner._id)}
=======
                      factory={factory} 
                      onBuyClick={() => openModal('purchase', factory)} // Se pasa el objeto factory al estado
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503:src/pages/FactoriesPage.jsx
                    />
                  </motion.div>
                )
              )}
            </motion.div>
          ) : (
<<<<<<< HEAD:src/pages/MinersPage.jsx
             <StatusCard message={t('minersPage.noMinersAvailable', 'No hay mineros disponibles en el mercado en este momento.')} />
=======
             <StatusCard message={t('factoriesPage.noFactoriesAvailable')} />
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503:src/pages/FactoriesPage.jsx
          )}
        </AnimatePresence>
      </div>

      {/* --- RENDERIZADO DE MODALES CON EL NUEVO ESTADO --- */}
      <AnimatePresence>
<<<<<<< HEAD:src/pages/MinersPage.jsx
        {selectedMiner && (
          <FactoryPurchaseModal 
            factory={selectedMiner} // Se pasa la prop 'factory' por compatibilidad con el modal por ahora.
            onClose={handleCloseModal} 
=======
        {modalState.purchase && (
          <FactoryPurchaseModal 
            factory={modalState.purchase} 
            onClose={() => closeModal('purchase')} 
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503:src/pages/FactoriesPage.jsx
            onGoToDeposit={handleGoToDeposit}
          />
        )}
        {modalState.selectNetwork && (
          <SelectNetworkModal 
            onClose={() => setModalState(prev => ({ ...prev, selectNetwork: false }))} 
          />
        )}
      </AnimatePresence>
      {/* --- FIN DEL RENDERIZADO DE MODALES --- */}
    </>
  );
};

export default MinersPage; // Exportamos el componente con el nuevo nombre