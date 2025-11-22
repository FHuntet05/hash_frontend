import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiLightningBolt, HiShieldCheck, HiChevronRight } from 'react-icons/hi2';

// Componente de Tarjeta con Imagen
const NetworkCard = ({ name, protocol, fee, color, imageSrc, delay, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    onClick={onClick}
    className="w-full bg-surface p-4 rounded-2xl border border-white/5 hover:border-accent/50 transition-all group relative overflow-hidden flex items-center justify-between mb-3"
  >
    {/* Efecto Hover de Fondo */}
    <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />

    <div className="flex items-center gap-4 relative z-10">
        {/* Contenedor de Imagen con Fondo */}
        <div className={`p-2.5 rounded-xl bg-background border border-white/10 ${color.replace('from-', 'text-').split(' ')[0]}`}>
            <img 
                src={imageSrc} 
                alt={protocol} 
                className="w-8 h-8 object-contain"
                onError={(e) => { e.target.style.display = 'none'; }} // Ocultar si falla
            />
        </div>
        
        <div className="text-left">
            <h3 className="text-lg font-bold text-white leading-tight">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono text-text-secondary bg-white/5 px-1.5 py-0.5 rounded border border-white/5 uppercase tracking-wider">
                    {protocol}
                </span>
                <span className="text-[10px] text-green-400 flex items-center gap-1 font-bold">
                    <HiLightningBolt className="w-3 h-3" /> {fee}
                </span>
            </div>
        </div>
    </div>

    <div className="p-2 bg-background rounded-lg text-text-secondary group-hover:bg-accent group-hover:text-white transition-colors">
        <HiChevronRight className="w-5 h-5" />
    </div>
  </motion.button>
);

const SelectNetworkPage = () => {
  const navigate = useNavigate();

  const handleSelect = (protocol) => {
    navigate('/deposit/address', { state: { protocol } });
  };

  return (
    <div className="flex flex-col h-full p-4 pt-10 pb-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Seleccionar Activo</h1>
            <p className="text-sm text-text-secondary">Elige la criptomoneda y red para depositar.</p>
        </div>

        {/* Lista de Redes */}
        <div className="flex-1 space-y-2">
            
            {/* 1. USDT BEP20 */}
            <NetworkCard 
                name="USDT (Tether)"
                protocol="BSC (BEP20)"
                fee="Rápido"
                color="from-yellow-500 to-orange-500"
                imageSrc="/assets/images/networks/bep20-usdt.png" // Asegúrate de que esta ruta exista
                delay={0.1}
                onClick={() => handleSelect('USDT-BEP20')}
            />

            {/* 2. BNB */}
            <NetworkCard 
                name="BNB (Smart Chain)"
                protocol="BNB (BEP20)"
                fee="Rápido"
                color="from-yellow-400 to-yellow-600"
                imageSrc="/assets/images/networks/bnb.png"
                delay={0.15}
                onClick={() => handleSelect('BNB')}
            />

            {/* 3. USDT TRC20 */}
            <NetworkCard 
                name="USDT (Tether)"
                protocol="Tron (TRC20)"
                fee="Rápido"
                color="from-red-500 to-rose-600"
                imageSrc="/assets/images/networks/trc20-usdt.png"
                delay={0.2}
                onClick={() => handleSelect('USDT-TRC20')}
            />

            {/* 4. TRX */}
            <NetworkCard 
                name="TRX (Tron)"
                protocol="TRON (Native)"
                fee="Rápido"
                color="from-red-400 to-red-600"
                imageSrc="/assets/images/networks/tron.png"
                delay={0.25}
                onClick={() => handleSelect('TRX')}
            />

        </div>

        {/* Footer Info */}
        <div className="mt-4 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 flex gap-3">
            <HiShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
            <p className="text-[10px] text-blue-200/80 leading-relaxed">
                Verifica cuidadosamente la red seleccionada. Los envíos cruzados resultarán en pérdida de fondos.
            </p>
        </div>
    </div>
  );
};

export default SelectNetworkPage;