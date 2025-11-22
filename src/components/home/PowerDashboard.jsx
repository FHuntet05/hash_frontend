import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiBolt, HiArrowTrendingUp, HiClock } from 'react-icons/hi2';

const PowerDashboard = ({ user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 1. Cálculo de métricas base
  const purchasedMiners = user?.purchasedMiners || [];
  
  // Potencia Total = Suma de producción diaria de todos los items activos
  const totalDailyProduction = purchasedMiners.reduce((acc, curr) => {
    // Verificar si el minero ha expirado
    const now = new Date();
    const expiry = new Date(curr.expiryDate);
    if (now > expiry) return acc;
    return acc + (curr.miner?.dailyProduction || 0);
  }, 0);

  // Ganancia por segundo (para el efecto visual)
  const productionPerSecond = totalDailyProduction / 86400;

  // 2. Estado para el contador en tiempo real
  const [displayBalance, setDisplayBalance] = useState(user?.balance?.usdt || 0);
  const [cycleProgress, setCycleProgress] = useState(0);

  useEffect(() => {
    // Sincronizar balance base cuando cambia el usuario
    setDisplayBalance(user?.balance?.usdt || 0);
  }, [user?.balance?.usdt]);

  useEffect(() => {
    // Efecto de "Live Number": Incrementa el balance visualmente cada 100ms
    if (totalDailyProduction === 0) return;

    const interval = setInterval(() => {
      setDisplayBalance(prev => prev + (productionPerSecond * 0.1));
    }, 100);

    return () => clearInterval(interval);
  }, [totalDailyProduction, productionPerSecond]);

  // 3. Cálculo del Ciclo de Minado (Progreso Circular)
  useEffect(() => {
    if (purchasedMiners.length === 0) {
      setCycleProgress(0);
      return;
    }

    // Tomamos el minero más reciente o relevante para mostrar el ciclo
    // (Asumiendo ciclo global de 24h para simplificar la UI visual)
    const lastClaim = new Date(purchasedMiners[0].lastClaim).getTime();
    const now = Date.now();
    const cycleDuration = 24 * 60 * 60 * 1000; // 24 horas
    const timeSinceClaim = now - lastClaim;
    
    // Porcentaje completado (0 a 100)
    let percentage = (timeSinceClaim / cycleDuration) * 100;
    if (percentage > 100) percentage = 100;
    setCycleProgress(percentage);

  }, [purchasedMiners]);

  // SVG Circle Props
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (cycleProgress / 100) * circumference;

  return (
    <div className="relative w-full bg-surface rounded-3xl p-6 shadow-medium border border-border overflow-hidden">
      {/* Fondo decorativo industrial */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* --- SECCIÓN CENTRAL: CICLO Y POTENCIA --- */}
        <div className="relative mb-6">
          {/* SVG Progress Circle */}
          <svg width="200" height="200" className="transform -rotate-90">
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-gray-800" // Fondo del track
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-accent transition-all duration-1000 ease-out" // Progreso Naranja
            />
          </svg>

          {/* Info Central dentro del Círculo */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-text-secondary text-xs uppercase tracking-widest mb-1">Potencia</span>
            <div className="flex items-center gap-1 text-text-primary font-bold text-2xl">
              <HiBolt className="text-accent w-6 h-6" />
              {totalDailyProduction.toFixed(2)} <span className="text-xs font-normal text-text-muted">/día</span>
            </div>
            <div className="text-[10px] text-accent mt-1 bg-accent/10 px-2 py-0.5 rounded-full">
              ACTIVA
            </div>
          </div>
        </div>

        {/* --- CONTADOR EN VIVO --- */}
        <div className="mb-6 w-full">
          <p className="text-text-secondary text-sm mb-1">Saldo Retirable Estimado</p>
          <div className="text-4xl font-mono font-bold text-text-primary tracking-tight">
            {displayBalance.toFixed(7)} <span className="text-lg text-accent">USDT</span>
          </div>
        </div>

        {/* --- ESTADÍSTICAS EN FILA --- */}
        <div className="grid grid-cols-2 gap-4 w-full mb-6">
          <div className="bg-background/50 p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
              <HiArrowTrendingUp /> <span>Ganancia Total</span>
            </div>
            <p className="text-lg font-bold text-text-primary">
              {(user?.totalCommission || 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-background/50 p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
              <HiClock /> <span>Ciclo</span>
            </div>
            <p className="text-lg font-bold text-text-primary">
              24 <span className="text-xs font-normal">Horas</span>
            </p>
          </div>
        </div>

        {/* --- BOTÓN DE ACCIÓN --- */}
        <button 
          onClick={() => navigate('/market')}
          className="w-full py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl shadow-lg shadow-accent/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <HiBolt className="w-5 h-5" />
          AUMENTAR POTENCIA
        </button>

      </div>
    </div>
  );
};

export default PowerDashboard;