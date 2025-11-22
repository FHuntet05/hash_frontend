import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiBolt, HiCpuChip, HiSignal } from 'react-icons/hi2';

const PowerDashboard = ({ user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  // --- 1. CÁLCULOS DE POTENCIA ---
  const purchasedMiners = user?.purchasedMiners || [];
  
  // Producción Diaria Total (Solo de items vigentes)
  const totalDailyProduction = purchasedMiners.reduce((acc, curr) => {
    const now = new Date();
    const expiry = new Date(curr.expiryDate);
    if (now > expiry) return acc;
    return acc + (curr.miner?.dailyProduction || 0);
  }, 0);

  // Conversión: 1 USDT = 100 GH/s visuales
  const totalHashPower = totalDailyProduction * 100; 
  const productionPerSecond = totalDailyProduction / 86400;

  // --- 2. CONTADOR DE GENERACIÓN (CICLO ACTUAL) ---
  const [minedAmount, setMinedAmount] = useState(0);

  useEffect(() => {
    // Calcula cuánto dinero se ha generado matemáticamente desde el último 'lastClaim'
    const calculatePending = () => {
        const now = Date.now();
        let total = 0;

        purchasedMiners.forEach(pm => {
            if (new Date(pm.expiryDate) < now) return;
            
            const lastClaim = new Date(pm.lastClaim).getTime();
            const elapsedSec = (now - lastClaim) / 1000;
            
            if (elapsedSec > 0) {
                const daily = pm.miner?.dailyProduction || 0;
                const perSec = daily / 86400;
                
                // TOPE DE 12 HORAS: El contador nunca muestra más del 50% diario
                const maxCycleReward = daily / 2; 
                
                const currentGenerated = elapsedSec * perSec;
                total += Math.min(currentGenerated, maxCycleReward);
            }
        });
        setMinedAmount(total);
    };

    calculatePending(); // Cálculo inicial

    // Animación en tiempo real si hay potencia
    if (totalDailyProduction > 0) {
        const interval = setInterval(() => {
            // Incrementamos visualmente (limitado por la lógica anterior al recargar)
            setMinedAmount(prev => {
                const maxTotalLimit = totalDailyProduction / 2; 
                const nextVal = prev + (productionPerSecond * 0.1);
                return Math.min(nextVal, maxTotalLimit);
            });
        }, 100);
        return () => clearInterval(interval);
    }
  }, [purchasedMiners, totalDailyProduction, productionPerSecond]);

  // --- 3. LÓGICA VISUAL DEL CICLO (TIMER DE 12H) ---
  const [timeLeft, setTimeLeft] = useState('12:00:00');
  const [progressPercent, setProgressPercent] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (cardRef.current) {
        setDimensions({ width: cardRef.current.offsetWidth, height: cardRef.current.offsetHeight });
    }
  }, []);

  useEffect(() => {
    const updateTimer = () => {
      if (purchasedMiners.length === 0) {
          setTimeLeft('00:00:00');
          setProgressPercent(0);
          return;
      }

      // Tomamos como referencia el reclamo más reciente
      const latestClaimTime = Math.max(...purchasedMiners.map(m => new Date(m.lastClaim).getTime()));
      const now = Date.now();
      const cycleDuration = 12 * 60 * 60 * 1000; // 12 Horas
      
      const targetTime = latestClaimTime + cycleDuration;
      let msRemaining = targetTime - now;

      // Calcular porcentajes para el borde
      if (msRemaining <= 0) {
          msRemaining = 0;
          setProgressPercent(100);
      } else {
          const timePassed = now - latestClaimTime;
          let pct = (timePassed / cycleDuration) * 100;
          setProgressPercent(Math.min(pct, 100));
      }

      // Formateo HH:MM:SS
      const h = Math.floor((msRemaining / (1000 * 60 * 60)));
      const m = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((msRemaining % (1000 * 60)) / 1000);
      
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(timer);
  }, [purchasedMiners]);

  // Cálculo del borde SVG
  const perimeter = 2 * (dimensions.width + dimensions.height);
  const strokeDashoffset = perimeter - (progressPercent / 100) * perimeter;

  return (
    <div className="relative w-full" ref={cardRef}>
      
      {/* --- CAPAS VISUALES --- */}
      <div className="absolute inset-0 bg-surface rounded-3xl z-0 shadow-2xl border border-border"></div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 rounded-3xl overflow-visible">
        <rect x="0" y="0" width="100%" height="100%" rx="24" ry="24" fill="none" stroke="transparent" strokeWidth="0" />
        <rect
          x="0" y="0" width="100%" height="100%" rx="24" ry="24" fill="none"
          stroke="#F97316" strokeWidth="3"
          strokeDasharray={perimeter}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 linear shadow-[0_0_15px_#F97316]"
        />
      </svg>

      <div className="relative z-20 p-6 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#F97316 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        {/* Header */}
        <div className="flex justify-between items-start mb-6 relative">
          <div>
            <p className="text-[10px] font-mono text-accent uppercase tracking-widest mb-1 flex items-center gap-1">
              <HiSignal className="animate-pulse"/> Live Network
            </p>
            <div className="flex items-end gap-2">
                <h2 className="text-3xl font-bold text-white font-mono tracking-tight">{timeLeft}</h2>
                <span className="text-[10px] text-text-secondary mb-1.5">para liberación</span>
            </div>
          </div>
          <div className="bg-background/60 backdrop-blur-sm p-2 rounded-lg border border-white/5 text-center min-w-[80px]">
            <span className="block text-[10px] text-text-secondary uppercase">Ciclo</span>
            <span className="block text-lg font-bold text-accent">12H</span>
          </div>
        </div>

        {/* Contador */}
        <div className="text-center py-4 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>
             <p className="text-text-secondary text-[10px] uppercase mb-1 tracking-widest">Generado en este ciclo</p>
             <div className="text-4xl md:text-5xl font-mono font-bold text-white tracking-tighter drop-shadow-lg">
                {minedAmount.toFixed(7)} <span className="text-lg text-text-secondary font-sans">USDT</span>
             </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-6 relative">
            <div className="bg-background/40 border border-white/5 p-3 rounded-xl flex flex-col">
                <div className="flex items-center gap-2 text-text-secondary text-[10px] uppercase mb-1">
                    <HiCpuChip /> Potencia Hash
                </div>
                <div className="text-xl font-bold text-white flex items-baseline gap-1">
                    {totalHashPower.toFixed(0)} <span className="text-xs font-normal text-accent">GH/s</span>
                </div>
            </div>

             <div className="bg-background/40 border border-white/5 p-3 rounded-xl flex flex-col">
                <div className="flex items-center gap-2 text-text-secondary text-[10px] uppercase mb-1">
                    <HiBolt /> Rendimiento
                </div>
                <div className="text-xl font-bold text-white flex items-baseline gap-1">
                    {/* Muestra Ganancia Por HORA (Diario / 24) */}
                    {(totalDailyProduction / 24).toFixed(4)} <span className="text-xs font-normal text-text-secondary">/h</span>
                </div>
            </div>
        </div>

        {/* BOTÓN: Navega al mercado (z-30 para asegurar el click) */}
        <button 
            onClick={() => navigate('/market')}
            className="w-full mt-6 py-3.5 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl shadow-lg shadow-accent/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-wide relative z-30 cursor-pointer"
        >
            <HiBolt className="w-5 h-5" />
            AUMENTAR POTENCIA
        </button>

      </div>
    </div>
  );
};

export default PowerDashboard;