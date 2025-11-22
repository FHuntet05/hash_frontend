import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiChevronRight, HiBolt, HiClock, HiCurrencyDollar, 
  HiChartBar, HiCpuChip 
} from 'react-icons/hi2';

import useUserStore from '../store/userStore';
import MinerPurchaseModal from '../components/miners/MinerPurchaseModal';
import DirectDepositModal from '../components/modals/DirectDepositModal';
import Loader from '../components/common/Loader';

const MinersPage = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  
  // Estados de Datos
  const [miners, setMiners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado de Selección (Core de la nueva UI)
  const [selectedMiner, setSelectedMiner] = useState(null);
  
  // Estados de Modales
  const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);

  // Referencia para el scroll horizontal
  const scrollRef = useRef(null);

  // 1. Cargar Potenciadores
  useEffect(() => { 
    const fetchMiners = async () => {
        try {
            setLoading(true);
            const response = await api.get('/miners');
            const data = response.data;
            setMiners(data);
            
            // REGLA DE NEGOCIO: Seleccionar el primero por defecto
            if (data.length > 0) {
                setSelectedMiner(data[0]);
            }
        } catch (err) {
            toast.error('Error cargando el mercado.');
        } finally {
            setLoading(false);
        }
    };
    fetchMiners();
  }, []);

  // Lógica de Depósito
  const handleGoToDeposit = async () => {
      setPurchaseModalOpen(false);
      toast.loading('Generando dirección...', { id: 'deposit_gen' });
      try {
        const response = await api.post('/wallet/create-deposit-address');
        setPaymentInfo(response.data);
        setDepositModalOpen(true);
        toast.dismiss('deposit_gen');
      } catch (error) {
        toast.error('Error de conexión', { id: 'deposit_gen' });
      }
  };

  // Verificar si ya lo tiene (para deshabilitar botón)
  const isOwned = (minerId) => {
      return user?.purchasedMiners?.some(pm => pm.miner?._id === minerId || pm.miner === minerId);
  };

  if (loading) return <div className="flex h-full items-center justify-center"><Loader /></div>;

  return (
    <div className="flex flex-col h-full overflow-hidden relative bg-background">
        
        {/* --- HEADER --- */}
        <div className="px-4 pt-4 pb-2 flex-shrink-0">
            <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <HiCpuChip className="text-accent"/> 
                {t('minersPage.title', 'Centro de Potencia')}
            </h1>
            <p className="text-xs text-text-secondary">
                Selecciona un módulo para ver detalles e instalar.
            </p>
        </div>

        {/* --- ZONA SUPERIOR: CARRUSEL HORIZONTAL (SELECTOR) --- */}
        <div className="relative flex-shrink-0 h-32 mb-2">
            {/* Flecha Indicadora de Scroll (Derecha) */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 flex items-center justify-end pr-1 pointer-events-none">
                <HiChevronRight className="text-text-secondary animate-pulse" />
            </div>

            <div 
                ref={scrollRef}
                className="flex items-center gap-3 px-4 overflow-x-auto no-scrollbar h-full snap-x"
            >
                {miners.map((miner) => {
                    const isSelected = selectedMiner?._id === miner._id;
                    const owned = isOwned(miner._id);

                    return (
                        <motion.button
                            key={miner._id}
                            onClick={() => setSelectedMiner(miner)}
                            className={`
                                relative flex-shrink-0 w-20 h-24 rounded-xl flex flex-col items-center justify-center gap-1
                                border transition-all duration-300 snap-center
                                ${isSelected 
                                    ? 'bg-surface border-accent shadow-[0_0_15px_rgba(249,115,22,0.3)] scale-105 z-10' 
                                    : 'bg-surface/50 border-transparent opacity-70 grayscale hover:grayscale-0'
                                }
                            `}
                            whileTap={{ scale: 0.95 }}
                        >
                            {owned && (
                                <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full shadow-lg" />
                            )}
                            
                            <img 
                                src={miner.imageUrl || '/assets/images/vip1-logo.png'} 
                                alt={miner.name}
                                className="w-10 h-10 object-contain"
                            />
                            <span className={`text-[10px] font-bold truncate max-w-full px-1 ${isSelected ? 'text-accent' : 'text-text-secondary'}`}>
                                {miner.name}
                            </span>
                        </motion.button>
                    );
                })}
                {/* Espaciador final para que el último item no quede pegado */}
                <div className="w-4 flex-shrink-0" />
            </div>
        </div>

        {/* --- ZONA INFERIOR: INSPECTOR (DETALLES) --- */}
        <div className="flex-1 bg-surface rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col relative border-t border-white/5">
            
            {selectedMiner ? (
                <div className="flex flex-col h-full p-6 pb-24 overflow-y-auto no-scrollbar">
                    
                    {/* Encabezado del Inspector */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="text-accent text-xs font-bold uppercase tracking-widest mb-1">Especificaciones del Módulo</div>
                            <h2 className="text-2xl font-bold text-white">{selectedMiner.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs bg-white/10 text-white px-2 py-0.5 rounded">Nivel {selectedMiner.vipLevel}</span>
                                {isOwned(selectedMiner._id) && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">Instalado</span>}
                            </div>
                        </div>
                        {/* Imagen Grande */}
                        <motion.img 
                            key={selectedMiner._id} // Key para reiniciar animación al cambiar
                            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            src={selectedMiner.imageUrl || '/assets/images/vip1-logo.png'}
                            className="w-20 h-20 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        />
                    </div>

                    {/* Grid de Estadísticas */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        
                        {/* Producción Diaria */}
                        <div className="bg-background p-4 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
                                <HiCurrencyDollar className="text-green-400"/> Ganancia Diaria
                            </div>
                            <div className="text-xl font-bold text-white">
                                {selectedMiner.dailyProduction} <span className="text-xs font-normal text-text-secondary">USDT</span>
                            </div>
                        </div>

                        {/* Potencia (Simulada) */}
                        <div className="bg-background p-4 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
                                <HiBolt className="text-accent"/> Potencia
                            </div>
                            <div className="text-xl font-bold text-white">
                                {(selectedMiner.dailyProduction * 100).toFixed(0)} <span className="text-xs font-normal text-text-secondary">GH/s</span>
                            </div>
                        </div>

                        {/* Ganancia Mensual */}
                        <div className="bg-background p-4 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
                                <HiChartBar className="text-purple-400"/> Retorno Mensual
                            </div>
                            <div className="text-xl font-bold text-white">
                                {(selectedMiner.dailyProduction * 30).toFixed(0)} <span className="text-xs font-normal text-text-secondary">USDT</span>
                            </div>
                        </div>

                        {/* Duración */}
                        <div className="bg-background p-4 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
                                <HiClock className="text-blue-400"/> Duración
                            </div>
                            <div className="text-xl font-bold text-white">
                                {selectedMiner.durationDays} <span className="text-xs font-normal text-text-secondary">Días</span>
                            </div>
                        </div>
                    </div>

                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-text-secondary">Seleccione un potenciador</div>
            )}

            {/* --- FOOTER FIJO: BOTÓN DE COMPRA --- */}
            {selectedMiner && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-surface/95 backdrop-blur-xl border-t border-white/5 pb-20"> {/* pb-20 para no chocar con BottomNav */}
                    <div className="flex items-center justify-between mb-3 px-2">
                        <span className="text-text-secondary text-sm">Inversión Requerida</span>
                        <span className="text-2xl font-bold text-white">{selectedMiner.price} USDT</span>
                    </div>
                    
                    <button
                        onClick={() => setPurchaseModalOpen(true)}
                        disabled={isOwned(selectedMiner._id)}
                        className={`
                            w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                            ${isOwned(selectedMiner._id)
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-accent hover:bg-accent-hover text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                            }
                        `}
                    >
                        {isOwned(selectedMiner._id) ? (
                            <>Instalado <HiBolt /></>
                        ) : (
                            <>AUMENTAR POTENCIA <HiChevronRight /></>
                        )}
                    </button>
                </div>
            )}
        </div>

        {/* --- MODALES --- */}
        <AnimatePresence>
            {isPurchaseModalOpen && selectedMiner && (
                <MinerPurchaseModal
                    miner={selectedMiner}
                    onClose={() => setPurchaseModalOpen(false)}
                    onGoToDeposit={handleGoToDeposit}
                />
            )}
            {isDepositModalOpen && (
                <DirectDepositModal
                    paymentInfo={paymentInfo}
                    onClose={() => setDepositModalOpen(false)}
                />
            )}
        </AnimatePresence>
    </div>
  );
};

export default MinersPage;