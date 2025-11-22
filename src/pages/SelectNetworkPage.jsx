import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiGlobeAlt, HiLightningBolt, HiShieldCheck, HiChevronRight } from 'react-icons/hi2';

const NetworkCard = ({ name, protocol, fee, color, delay, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    onClick={onClick}
    className="w-full bg-surface p-5 rounded-2xl border border-white/5 hover:border-accent/50 transition-all group relative overflow-hidden flex items-center justify-between mb-4"
  >
    {/* Efecto Hover de Fondo */}
    <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />

    <div className="flex items-center gap-4 relative z-10">
        <div className={`p-3 rounded-xl bg-background border border-white/10 ${color.replace('from-', 'text-').split(' ')[0]}`}>
            <HiGlobeAlt className="w-6 h-6" />
        </div>
        <div className="text-left">
            <h3 className="text-lg font-bold text-white">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono text-text-secondary bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                    {protocol}
                </span>
                <span className="text-[10px] text-green-400 flex items-center gap-1">
                    <HiLightningBolt /> {fee}
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

  const handleSelect = (networkId, protocol) => {
    // Pasamos el protocolo como estado a la siguiente página
    navigate('/deposit/address', { state: { networkId, protocol } });
  };

  return (
    <div className="flex flex-col h-full p-4 pt-10 pb-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Elegir Red</h1>
            <p className="text-sm text-text-secondary">Selecciona la red blockchain para realizar tu depósito.</p>
        </div>

        {/* Lista de Redes */}
        <div className="flex-1">
            
            {/* OPCIÓN 1: BNB Smart Chain (Dinámica) */}
            <NetworkCard 
                name="USDT (Tether)"
                protocol="BEP20 (BSC)"
                fee="Gas Bajo"
                color="from-yellow-500 to-orange-500"
                delay={0.1}
                onClick={() => handleSelect('usdt_bep20', 'BEP20')}
            />

            {/* OPCIÓN 2: TRON (Hardcoded) */}
            <NetworkCard 
                name="USDT (Tether)"
                protocol="TRC20 (Tron)"
                fee="Rápido"
                color="from-red-500 to-rose-600"
                delay={0.2}
                onClick={() => handleSelect('usdt_trc20', 'TRC20')}
            />

            {/* Más opciones si quisieras */}
        </div>

        {/* Footer Info */}
        <div className="mt-auto p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 flex gap-3">
            <HiShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
            <p className="text-xs text-blue-200/80 leading-relaxed">
                Asegúrate de seleccionar la red correcta en tu billetera de origen. Los fondos enviados a redes incorrectas no se pueden recuperar.
            </p>
        </div>
    </div>
  );
};

export default SelectNetworkPage;