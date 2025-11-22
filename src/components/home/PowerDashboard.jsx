import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiBolt, HiClock, HiCpuChip, HiSignal } from 'react-icons/hi2';

const PowerDashboard = ({ user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  // --- 1. CÁLCULOS DE POTENCIA Y DATOS ---
  const purchasedMiners = user?.purchasedMiners || [];
  
  // Producción Diaria Total
  const totalDailyProduction = purchasedMiners.reduce((acc, curr) => {
    const now = new Date();
    const expiry = new Date(curr.expiryDate);
    if (now > expiry) return acc;
    return acc + (curr.miner?.dailyProduction || 0);
  }, 0);

  // Conversión Visual: 1 USDT diario ~= 100 GH/s (Factor de conversión estética)
  const totalHashPower = totalDailyProduction * 100; 
  const productionPerHour = totalDailyProduction / 24;

  // --- 2. LÓGICA DE CICLO DE 12 HORAS ---
  const [timeLeft, setTimeLeft] = useState('00:00:00');
  const [progressPercent, setProgressPercent] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Medir el tamaño de la tarjeta para dibujar el borde exacto
  useEffect(() => {
    if (cardRef.current) {
      setDimensions({
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight
      });
    }
  }, []);

  useEffect(() => {
    const updateCycle = () => {
      // Encontrar el último reclamo o fecha de compra
      let lastEventTime = 0;
      if (purchasedMiners.length > 0) {
        // Usamos el lastClaim más reciente
        const latestClaim = Math.max(...purchasedMiners.map(m => new Date(m.lastClaim).getTime()));
        lastEventTime = latestClaim;
      } else {
        lastEventTime = Date.now();
      }

      const now = Date.now();
      const cycleDuration = 12 * 60 * 60 * 1000; // 12 Horas en milisegundos
      
      // Calcular cuándo termina el ciclo actual de 12h
      // Si lastEvent fue a las 10:00, next es a las 22:00.
      // Si ahora son las 23:00, estamos en el siguiente ciclo (que empezó a las 22:00).
      const timeSinceLast = now - lastEventTime;
      const cyclesPassed = Math.floor(timeSinceLast / cycleDuration);
      const currentCycleStart = lastEventTime + (cyclesPassed * cycleDuration);
      const nextPayout = currentCycleStart + cycleDuration;
      
      const msRemaining = nextPayout - now;

      // Calcular Porcentaje (0 a 100)
      const elapsed = now - currentCycleStart;
      let percent = (elapsed / cycleDuration) * 100;
      if (percent > 100) percent = 100;
      setProgressPercent(percent);

      // Formatear Cuenta Regresiva HH:MM:SS
      const hours = Math.floor((msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((msRemaining % (1000 * 60)) / 1000);
      
      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    const interval = setInterval(updateCycle, 1000);
    updateCycle(); // Ejecutar inmediatamente
    return () => clearInterval(interval);
  }, [purchasedMiners]);

  // --- 3. EFECTO DE SALDO EN VIVO ---
  const [displayBalance, setDisplayBalance] = useState(user?.balance?.usdt || 0);
  const productionPerSecond = totalDailyProduction / 86400;

  useEffect(() => {
    if (totalDailyProduction === 0) return;
    const interval = setInterval(() => {
      setDisplayBalance(prev => prev + (productionPerSecond * 0.1));
    }, 100);
    return () => clearInterval(interval);
  }, [totalDailyProduction]);


  // Cálculo del trazo SVG para el borde rectangular
  // Perímetro = 2 * (w + h). Trazo dinámico con strokeDasharray.
  const perimeter = 2 * (dimensions.width + dimensions.height);
  const strokeDashoffset = perimeter - (progressPercent / 100) * perimeter;

  return (
    <div className="relative w-full" ref={cardRef}>
      
      {/* --- BORDE PROGRESIVO SVG (LAYER SUPERIOR) --- */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 rounded-3xl overflow-visible">
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="24" // Radio de borde (rounded-3xl es 24px aprox)
          ry="24"
          fill="none"
          stroke="#374151" // Color de fondo del borde (Gris oscuro)
          strokeWidth="2"
        />
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="24"
          ry="24"
          fill="none"
          stroke="#F97316" // Color Naranja Accent
          strokeWidth="3"
          strokeDasharray={perimeter}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 linear shadow-[0_0_15px_#F97316]" // Glow effect CSS
        />
      </svg>

      {/* --- CONTENIDO DE LA TARJETA (REACTOR) --- */}
      <div className="bg-surface rounded-3xl p-6 shadow-2xl overflow-hidden relative z-10">
        
        {/* Fondo Grid Tech Decorativo */}
        <div className="absolute inset-0 opacity-5" 
             style={{ backgroundImage: 'radial-gradient(#F97316 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {/* HEADER: Próximo Ciclo */}
        <div className="flex justify-between items-start mb-6 relative">
          <div>
            <p className="text-xs font-mono text-accent uppercase tracking-widest mb-1 flex items-center gap-1">
              <HiSignal className="animate-pulse"/> Live Network
            </p>
            <div className="flex items-end gap-2">
                <h2 className="text-3xl font-bold text-white font-mono tracking-tight">
                    {timeLeft}
                </h2>
                <span className="text-[10px] text-text-secondary mb-1.5">hasta liberación</span>
            </div>
          </div>
          <div className="bg-background/60 backdrop-blur-sm p-2 rounded-lg border border-white/5 text-center min-w-[80px]">
            <span className="block text-[10px] text-text-secondary uppercase">Ciclo</span>
            <span className="block text-lg font-bold text-accent">12H</span>
          </div>
        </div>

        {/* MAIN DISPLAY: Saldo y Potencia */}
        <div className="text-center py-4 relative">
             {/* Círculo de brillo detrás del número */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
             
             <p className="text-text-secondary text-xs uppercase mb-1">Saldo Retirable Proyectado</p>
             <div className="text-4xl md:text-5xl font-mono font-bold text-white tracking-tighter drop-shadow-lg">
                {displayBalance.toFixed(6)} <span className="text-lg text-text-secondary font-sans">USDT</span>
             </div>
        </div>

        {/* GRID DE DETALLES TÉCNICOS */}
        <div className="grid grid-cols-2 gap-3 mt-6 relative">
            {/* Dato 1: Hashrate (GH/s) */}
            <div className="bg-background/40 border border-white/5 p-3 rounded-xl flex flex-col">
                <div className="flex items-center gap-2 text-text-secondary text-[10px] uppercase mb-1">
                    <HiCpuChip /> Potencia de Hash
                </div>
                <div className="text-xl font-bold text-white flex items-baseline gap-1">
                    {totalHashPower.toFixed(0)} <span className="text-xs font-normal text-accent">GH/s</span>
                </div>
            </div>

             {/* Dato 2: Ganancia por Hora */}
             <div className="bg-background/40 border border-white/5 p-3 rounded-xl flex flex-col">
                <div className="flex items-center gap-2 text-text-secondary text-[10px] uppercase mb-1">
                    <HiBolt /> Rendimiento
                </div>
                <div className="text-xl font-bold text-white flex items-baseline gap-1">
                    {productionPerHour.toFixed(4)} <span className="text-xs font-normal text-text-secondary">/h</span>
                </div>
            </div>
        </div>

        {/* BOTÓN DE ACCIÓN */}
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