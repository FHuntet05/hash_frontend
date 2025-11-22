import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiBolt, HiClock, HiCpuChip, HiSignal } from 'react-icons/hi2';

const PowerDashboard = ({ user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  // --- 1. CÁLCULOS DE POTENCIA TOTAL (GH/s) ---
  const purchasedMiners = user?.purchasedMiners || [];
  
  // Suma de la producción diaria de todos los mineros activos
  const totalDailyProduction = purchasedMiners.reduce((acc, curr) => {
    const now = new Date();
    const expiry = new Date(curr.expiryDate);
    // Solo cuenta si no ha expirado
    if (now > expiry) return acc;
    return acc + (curr.miner?.dailyProduction || 0);
  }, 0);

  // Conversión Visual: 1 USDT Prod = 100 GH/s
  const totalHashPower = totalDailyProduction * 100; 
  
  // Ganancia por segundo (Matemática pura)
  // Producción Diaria / 86400 segundos
  const productionPerSecond = totalDailyProduction / 86400;

  // --- 2. LÓGICA DEL CONTADOR DE MINERÍA (NO SALDO DE WALLET) ---
  // Estado inicial: 0. Se calculará en el useEffect.
  const [minedAmount, setMinedAmount] = useState(0);

  useEffect(() => {
    // FUNCIÓN CRÍTICA: Calcula cuánto se ha minado desde el último reclamo hasta AHORA MISMO.
    // Esto evita que empiece de 0 al recargar la página.
    const calculatePendingRewards = () => {
        const now = Date.now();
        let totalPending = 0;

        purchasedMiners.forEach(pm => {
            const expiry = new Date(pm.expiryDate).getTime();
            const lastClaim = new Date(pm.lastClaim).getTime();
            
            // Si el minero ya expiró antes del último reclamo, no genera nada
            if (lastClaim >= expiry) return;

            // El tiempo productivo es desde el último reclamo hasta AHORA
            // (o hasta que expiró, si expiró hace poco)
            const effectiveNow = Math.min(now, expiry);
            const elapsedSeconds = (effectiveNow - lastClaim) / 1000;
            
            if (elapsedSeconds > 0) {
                const minerDaily = pm.miner?.dailyProduction || 0;
                const minerPerSecond = minerDaily / 86400;
                totalPending += elapsedSeconds * minerPerSecond;
            }
        });

        setMinedAmount(totalPending);
    };

    calculatePendingRewards();

    // Si no hay producción, no iniciamos el intervalo
    if (totalDailyProduction === 0) return;

    // Intervalo visual: Suma lo generado cada 100ms para efecto suave
    const interval = setInterval(() => {
        setMinedAmount(prev => prev + (productionPerSecond * 0.1));
    }, 100);

    return () => clearInterval(interval);
  }, [purchasedMiners, totalDailyProduction, productionPerSecond]);


  // --- 3. LÓGICA DEL CICLO VISUAL (12 HORAS) ---
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

      // Buscamos el 'lastClaim' más antiguo para determinar el inicio del ciclo global
      // (O el más reciente, dependiendo de cómo quieras sincronizar. Usualmente es el más reciente para bloquear el botón).
      const latestClaimTime = Math.max(...purchasedMiners.map(m => new Date(m.lastClaim).getTime()));
      
      const now = Date.now();
      const cycleDuration = 12 * 60 * 60 * 1000; // 12 Horas
      
      // Calculamos tiempo restante
      const nextClaimTime = latestClaimTime + cycleDuration;
      let msRemaining = nextClaimTime - now;

      if (msRemaining < 0) msRemaining = 0; // Ciclo completado

      // Porcentaje (Inverso: empieza en 0% y va a 100% a medida que pasa el tiempo)
      const elapsed = now - latestClaimTime;
      let percent = (elapsed / cycleDuration) * 100;
      if (percent > 100) percent = 100;
      setProgressPercent(percent);

      // Formato HH:MM:SS
      const hours = Math.floor((msRemaining / (1000 * 60 * 60)));
      const minutes = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((msRemaining % (1000 * 60)) / 1000);
      
      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    const timer = setInterval(updateCycle, 1000);
    updateCycle();
    return () => clearInterval(timer);
  }, [purchasedMiners]);


  // SVG Borde
  const perimeter = 2 * (dimensions.width + dimensions.height);
  const strokeDashoffset = perimeter - (progressPercent / 100) * perimeter;

  return (
    <div className="relative w-full" ref={cardRef}>
      
      {/* --- BORDE PROGRESIVO (NARANJA) --- */}
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

      {/* --- CONTENIDO --- */}
      <div className="bg-surface rounded-3xl p-6 shadow-2xl overflow-hidden relative z-10">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#F97316 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        {/* Header */}
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

        {/* --- CONTADOR PRINCIPAL (CORREGIDO: MUESTRA LO MINADO, NO EL SALDO) --- */}
        <div className="text-center py-4 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
             
             <p className="text-text-secondary text-[10px] uppercase mb-1 tracking-widest">Generado en este ciclo</p>
             
             {/* Aquí mostramos 'minedAmount', que empieza en 0 y sube según producción */}
             <div className="text-4xl md:text-5xl font-mono font-bold text-white tracking-tighter drop-shadow-lg">
                {minedAmount.toFixed(7)} <span className="text-lg text-text-secondary font-sans">USDT</span>
             </div>
        </div>

        {/* Detalles Técnicos */}
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
                    {/* Mostramos ganancia por hora */}
                    {(totalDailyProduction / 24).toFixed(4)} <span className="text-xs font-normal text-text-secondary">/h</span>
                </div>
            </div>
        </div>

        <button 
            onClick={() => navigate('/market')}
            className="w-full mt-6 py-3.5 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl shadow-lg shadow-accent/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
        >
            <HiBolt className="w-5 h-5" />
            Aumentar Potencia
        </button>

      </div>
    </div>
  );
};

export default PowerDashboard;