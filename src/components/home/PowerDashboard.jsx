import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importar hook de navegación
import { useTranslation } from 'react-i18next';
import { HiBolt, HiCpuChip, HiSignal } from 'react-icons/hi2';

const PowerDashboard = ({ user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // 2. Instanciar hook
  const cardRef = useRef(null);

  // --- 1. CÁLCULOS DE POTENCIA ---
  const purchasedMiners = user?.purchasedMiners || [];
  
  const totalDailyProduction = purchasedMiners.reduce((acc, curr) => {
    const now = new Date();
    const expiry = new Date(curr.expiryDate);
    if (now > expiry) return acc;
    return acc + (curr.miner?.dailyProduction || 0);
  }, 0);

  const totalHashPower = totalDailyProduction * 100; 
  const productionPerSecond = totalDailyProduction / 86400;

  // --- 2. LÓGICA DE CONTADOR DE MINADO ---
  const [minedAmount, setMinedAmount] = useState(0);

  useEffect(() => {
    const calculatePendingRewards = () => {
        const now = Date.now();
        let totalPending = 0;

        purchasedMiners.forEach(pm => {
            const expiry = new Date(pm.expiryDate).getTime();
            const lastClaim = new Date(pm.lastClaim).getTime();
            
            if (lastClaim >= expiry) return;

            const effectiveNow = Math.min(now, expiry);
            const elapsedSeconds = (effectiveNow - lastClaim) / 1000;
            
            if (elapsedSeconds > 0) {
                const minerDaily = pm.miner?.dailyProduction || 0;
                const minerPerSecond = minerDaily / 86400;
                
                // Límite de seguridad visual (Máximo 12h)
                const maxCycleReward = minerDaily / 2;
                const calculated = elapsedSeconds * minerPerSecond;
                
                totalPending += Math.min(calculated, maxCycleReward);
            }
        });

        setMinedAmount(totalPending);
    };

    calculatePendingRewards();

    if (totalDailyProduction === 0) return;

    const interval = setInterval(() => {
        setMinedAmount(prev => prev + (productionPerSecond * 0.1));
    }, 100);

    return () => clearInterval(interval);
  }, [purchasedMiners, totalDailyProduction, productionPerSecond]);

  // --- 3. LÓGICA CICLO 12H ---
  const [timeLeft, setTimeLeft] = useState('00:00:00');
  const [progressPercent, setProgressPercent] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (cardRef.current) {
      setDimensions({ width: cardRef.current.offsetWidth, height: cardRef.current.offsetHeight });
    }
  }, []);

  useEffect(() => {
    const updateCycle = () => {
      if (purchasedMiners.length === 0) {
          setTimeLeft('00:00:00');
          setProgressPercent(0);
          return;
      }

      const latestClaimTime = Math.max(...purchasedMiners.map(m => new Date(m.lastClaim).getTime()));
      const now = Date.now();
      const cycleDuration = 12 * 60 * 60 * 1000; 
      
      const nextClaimTime = latestClaimTime + cycleDuration;
      let msRemaining = nextClaimTime - now;

      if (msRemaining < 0) msRemaining = 0;

      const elapsed = now - latestClaimTime;
      let percent = (elapsed / cycleDuration) * 100;
      if (percent > 100) percent = 100;
      setProgressPercent(percent);

      const hours = Math.floor((msRemaining / (1000 * 60 * 60)));
      const minutes = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((msRemaining % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    const timer = setInterval(updateCycle, 1000);
    updateCycle();
    return () => clearInterval(timer);
  }, [purchasedMiners]);

  const perimeter = 2 * (dimensions.width + dimensions.height);
  const strokeDashoffset = perimeter - (progressPercent / 100) * perimeter;

  return (
    <div className="relative w-full" ref={cardRef}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 rounded-3xl overflow-visible">
        <rect x="0" y="0" width="100%" height="100%" rx="24" ry="24" fill="none" stroke="#374151" strokeWidth="2" />
        <rect
          x="0" y="0" width="100%" height="100%" rx="24" ry="24" fill="none"
          stroke="#F97316" strokeWidth="3"
          strokeDasharray={perimeter}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 linear shadow-[0_0_15px_#F97316]"
        />
      </svg>

      <div className="bg-surface rounded-3xl p-6 shadow-2xl overflow-hidden relative z-10">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#F97316 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        <div className="flex justify-between items-start mb-6 relative">
          <div>
            <p className="text-[10px] font-mono text-accent uppercase tracking-widest mb-1 flex items-center gap-1">
              <HiSignal className="animate-pulse"/> Live Mining
            </p>
            <div className="flex items-end gap-2">
                <h2 className="text-3xl font-bold text-white font-mono tracking-tight">{timeLeft}</h2>
                <span className="text-[10px] text-text-secondary mb-1.5">para liberar</span>
            </div>
          </div>
          <div className="bg-background/60 backdrop-blur-sm p-2 rounded-lg border border-white/5 text-center min-w-[80px]">
            <span className="block text-[10px] text-text-secondary uppercase">Ciclo</span>
            <span className="block text-lg font-bold text-accent">12H</span>
          </div>
        </div>

        <div className="text-center py-4 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
             <p className="text-text-secondary text-[10px] uppercase mb-1 tracking-widest">Generado en este ciclo</p>
             <div className="text-4xl md:text-5xl font-mono font-bold text-white tracking-tighter drop-shadow-lg">
                {minedAmount.toFixed(7)} <span className="text-lg text-text-secondary font-sans">USDT</span>
             </div>
        </div>

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
                    {(totalDailyProduction / 24).toFixed(4)} <span className="text-xs font-normal text-text-secondary">/h</span>
                </div>
            </div>
        </div>

        {/* --- BOTÓN DE ACCIÓN CON NAVEGACIÓN --- */}
        <button 
            onClick={() => navigate('/market')} // <--- ESTA ES LA LÍNEA CLAVE
            className="w-full mt-6 py-3.5 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl shadow-lg shadow-accent/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
        >
            <HiBolt className="w-5 h-5" />
            AUMENTAR POTENCIA
        </button>

      </div>
    </div>
  );
};

export default PowerDashboard;