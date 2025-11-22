import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiChevronRight, HiBolt, HiClock, HiCurrencyDollar, 
  HiChartBar, HiCpuChip, HiCheckBadge 
} from 'react-icons/hi2';

import useUserStore from '../store/userStore';
import MinerPurchaseModal from '../components/miners/MinerPurchaseModal';
import DirectDepositModal from '../components/modals/DirectDepositModal';
import Loader from '../components/common/Loader';

const MinersPage = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  
  const [miners, setMiners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMiner, setSelectedMiner] = useState(null);
  
  // Modales
  const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const scrollRef = useRef(null);

  useEffect(() => { 
    const fetchMiners = async () => {
        try {
            setLoading(true);
            const response = await api.get('/miners');
            const data = response.data;
            setMiners(data);
            if (data.length > 0) setSelectedMiner(data[0]);
        } catch (err) {
            toast.error('Error cargando el mercado.');
        } finally {
            setLoading(false);
        }
    };
    fetchMiners();
  }, []);

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

  const isOwned = (minerId) => {
      return user?.purchasedMiners?.some(pm => pm.miner?._id === minerId || pm.miner === minerId);
  };

  if (loading) return <div className="flex h-full items-center justify-center"><Loader /></div>;

  // --- Componente Helper para Tarjetas de Detalle con Color ---
  const DetailCard = ({ label, value, unit, icon: Icon, colorFrom, colorTo, border, textColor, iconColor }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className={`
            relative overflow-hidden p-3.5 rounded-2xl border backdrop-blur-sm
            bg-gradient-to-br ${colorFrom} ${colorTo} ${border}
        `}
    >
        {/* Icono de fondo decorativo grande */}
        <Icon className={`absolute -right-2 -bottom-2 w-12 h-12 opacity-10 ${textColor}`} />
        
        <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`w-4 h-4 ${iconColor}`} />
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-300/80">{label}</span>
            </div>
            <div className="text-lg font-black text-white leading-tight shadow-black drop-shadow-md">
                {value} <span className={`text-xs font-medium ${textColor}`}>{unit}</span>
            </div>
        </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden relative bg-[#0D1117]">
        
        {/* --- HEADER --- */}
        <div className="px-5 pt-6 pb-2 flex-shrink-0">
            <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                    <HiCpuChip className="text-accent w-5 h-5"/>
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">{t('minersPage.title', 'Centro de Potencia')}</h1>
            </div>
            <p className="text-xs text-text-secondary ml-1">Selecciona un módulo para instalar.</p>
        </div>

        {/* --- ZONA SUPERIOR: SELECTOR --- */}
        <div className="relative flex-shrink-0 h-36 mb-2">
            
            {/* FLECHA INDICADORA (Agrandada y Brillante) */}
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0D1117] via-[#0D1117]/90 to-transparent z-20 flex items-center justify-end pr-2 pointer-events-none">
                <div className="bg-black/40 rounded-full p-1 backdrop-blur-md border border-accent/30 shadow-[0_0_15px_rgba(249,115,22,0.6)] animate-pulse">
                    <HiChevronRight className="w-6 h-6 text-accent" />
                </div>
            </div>

            <div 
                ref={scrollRef}
                className="flex items-center gap-3 px-5 overflow-x-auto no-scrollbar h-full snap-x pr-16"
            >
                {miners.map((miner) => {
                    const isSelected = selectedMiner?._id === miner._id;
                    const owned = isOwned(miner._id);

                    return (
                        <motion.button
                            key={miner._id}
                            onClick={() => setSelectedMiner(miner)}
                            className={`
                                relative flex-shrink-0 w-24 h-28 rounded-2xl flex flex-col items-center justify-center gap-1.5
                                border-2 transition-all duration-300 snap-center overflow-hidden
                                ${isSelected 
                                    ? 'bg-[#161B22] border-accent shadow-[0_0_20px_rgba(249,115,22,0.25)] scale-105 z-10' 
                                    : 'bg-[#161B22]/50 border-white/5 opacity-70 grayscale-[0.5] hover:opacity-100'
                                }
                            `}
                            whileTap={{ scale: 0.95 }}
                        >
                            {/* Punto indicador de selección */}
                            {isSelected && <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full shadow-[0_0_8px_#F97316]"></div>}
                            
                            {owned && (
                                <div className="absolute top-0 left-0 bg-green-500/90 text-[9px] font-bold text-white px-2 py-0.5 rounded-br-lg shadow-md z-10">
                                    OWN
                                </div>
                            )}
                            
                            <div className="relative w-10 h-10">
                                {/* Resplandor detrás de la moneda */}
                                {isSelected && <div className="absolute inset-0 bg-accent/30 blur-xl rounded-full"></div>}
                                <img 
                                    src={miner.imageUrl || '/assets/images/vip1-logo.png'} 
                                    alt={miner.name}
                                    className="w-full h-full object-contain relative z-10"
                                />
                            </div>
                            
                            <div className="text-center w-full px-1">
                                <span className={`block text-[10px] font-bold truncate ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                    {miner.name}
                                </span>
                                {/* PRECIO VISIBLE */}
                                <span className={`block text-xs font-extrabold mt-0.5 ${isSelected ? 'text-accent' : 'text-gray-500'}`}>
                                    ${miner.price}
                                </span>
                            </div>
                        </motion.button>
                    );
                })}
                <div className="w-4 flex-shrink-0" />
            </div>
        </div>

        {/* --- ZONA INFERIOR: INSPECTOR DETALLADO (FULL COLOR) --- */}
        <div className="flex-1 bg-[#161B22] rounded-t-[2.5rem] shadow-[0_-10px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative border-t border-white/5 ring-1 ring-white/5">
            
            {selectedMiner ? (
                <div className="flex flex-col h-full px-6 pt-8 pb-28 overflow-y-auto no-scrollbar">
                    
                    {/* Cabecera del Inspector */}
                    <div className="flex items-center justify-between mb-8 relative">
                        <div>
                            <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-accent animate-pulse"></span>
                                ESPECIFICACIONES DEL MÓDULO
                            </p>
                            <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-2">{selectedMiner.name}</h2>
                            <div className="flex gap-2">
                                <span className="text-xs font-bold bg-white/5 border border-white/10 text-gray-300 px-2.5 py-1 rounded-lg">Nivel {selectedMiner.vipLevel}</span>
                                {isOwned(selectedMiner._id) && (
                                    <span className="text-xs font-bold bg-blue-500/20 border border-blue-500/30 text-blue-400 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                        <HiCheckBadge className="w-3.5 h-3.5" /> Instalado
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {/* Círculo Grande con Imagen */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-accent/40 to-purple-500/40 blur-2xl rounded-full opacity-50"></div>
                            <motion.div 
                                key={selectedMiner._id}
                                initial={{ scale: 0.8, opacity: 0, rotate: 90 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                transition={{ type: 'spring', bounce: 0.5 }}
                                className="w-20 h-20 rounded-full bg-[#0D1117] border border-white/10 p-3 flex items-center justify-center relative z-10 shadow-xl"
                            >
                                <img 
                                    src={selectedMiner.imageUrl || '/assets/images/vip1-logo.png'}
                                    className="w-full h-full object-contain"
                                />
                            </motion.div>
                        </div>
                    </div>

                    {/* GRID DE DATOS (Coloreado y Atractivo) */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        
                        {/* 1. Ganancia Diaria (Verde) */}
                        <DetailCard 
                            label="Ganancia Diaria"
                            value={selectedMiner.dailyProduction}
                            unit="USDT"
                            icon={HiCurrencyDollar}
                            colorFrom="from-emerald-900/30"
                            colorTo="to-[#161B22]"
                            border="border-emerald-500/30"
                            textColor="text-emerald-400"
                            iconColor="text-emerald-500"
                        />

                        {/* 2. Potencia (Naranja - Identidad) */}
                        <DetailCard 
                            label="Potencia Hash"
                            value={(selectedMiner.dailyProduction * 100).toFixed(0)}
                            unit="GH/s"
                            icon={HiBolt}
                            colorFrom="from-orange-900/30"
                            colorTo="to-[#161B22]"
                            border="border-orange-500/30"
                            textColor="text-orange-400"
                            iconColor="text-orange-500"
                        />

                        {/* 3. Retorno Mensual (Morado) */}
                        <DetailCard 
                            label="Retorno Mensual"
                            value={(selectedMiner.dailyProduction * 30).toFixed(0)}
                            unit="USDT"
                            icon={HiChartBar}
                            colorFrom="from-purple-900/30"
                            colorTo="to-[#161B22]"
                            border="border-purple-500/30"
                            textColor="text-purple-400"
                            iconColor="text-purple-500"
                        />

                        {/* 4. Duración (Azul) */}
                        <DetailCard 
                            label="Ciclo Duración"
                            value={selectedMiner.durationDays}
                            unit="Días"
                            icon={HiClock}
                            colorFrom="from-blue-900/30"
                            colorTo="to-[#161B22]"
                            border="border-blue-500/30"
                            textColor="text-blue-400"
                            iconColor="text-blue-500"
                        />
                    </div>

                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-text-secondary">Seleccione un módulo</div>
            )}

            {/* --- FOOTER: ACCIÓN FIJA --- */}
            {selectedMiner && (
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-[#161B22]/95 backdrop-blur-2xl border-t border-white/5 pb-24 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
                    <div className="flex items-end justify-between mb-4 px-1">
                        <div>
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-0.5">Inversión Total</span>
                            <span className="text-3xl font-black text-white">{selectedMiner.price} <span className="text-base font-medium text-gray-500">USDT</span></span>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => setPurchaseModalOpen(true)}
                        disabled={isOwned(selectedMiner._id)}
                        className={`
                            w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.97] uppercase tracking-wide shadow-lg
                            ${isOwned(selectedMiner._id)
                                ? 'bg-gray-700/50 border border-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-accent hover:bg-accent-hover text-white shadow-orange-500/20'
                            }
                        `}
                    >
                        {isOwned(selectedMiner._id) ? (
                            <>Instalado <HiCheckBadge className="w-6 h-6" /></>
                        ) : (
                            <>Adquirir Potencia <HiBolt className="w-5 h-5 animate-pulse" /></>
                        )}
                    </button>
                </div>
            )}
        </div>

        {/* MODALES */}
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