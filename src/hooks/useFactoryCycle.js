// RUTA: frontend/src/hooks/useFactoryCycle.js (CON CICLO DE PRUEBA CONFIGURABLE)

import { useState, useEffect, useMemo } from 'react';

// --- INICIO DE MODIFICACIÓN PARA PRUEBAS ---
// INSTRUCCIONES: Para probar el botón de reclamo, use el "VALOR DE PRUEBA".
// ANTES DE DESPLEGAR A PRODUCCIÓN, DEBE OBLIGATORIAMENTE cambiar al "VALOR DE PRODUCCIÓN".

// VALOR DE PRODUCCIÓN (24 horas): Descomente esta línea para producción.
// const CYCLE_DURATION_SECONDS = 24 * 60 * 60; 

// VALOR DE PRUEBA (30 segundos): Comente o elimine esta línea para producción.
const CYCLE_DURATION_SECONDS = 30; // <-- Ciclo de 30 segundos para pruebas
// --- FIN DE MODIFICACIÓN PARA PRUEBAS ---


/**
 * Hook para gestionar el temporizador y el estado de una fábrica individual.
 * @param {string | Date} lastClaimTimestamp - La fecha del último reclamo de la fábrica.
 */
export const useFactoryCycle = (lastClaimTimestamp) => {
  const [countdown, setCountdown] = useState('00:00:00');
  const [progress, setProgress] = useState(0);
  const [isClaimable, setIsClaimable] = useState(false);

  const cycleStartTime = useMemo(() => {
    return lastClaimTimestamp ? new Date(lastClaimTimestamp).getTime() : Date.now();
  }, [lastClaimTimestamp]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const secondsPassed = Math.floor((now - cycleStartTime) / 1000);

      if (secondsPassed >= CYCLE_DURATION_SECONDS) {
        setCountdown('00:00:00');
        setProgress(100);
        setIsClaimable(true);
        clearInterval(interval);
        return;
      }

      setIsClaimable(false);
      const secondsRemaining = CYCLE_DURATION_SECONDS - secondsPassed;
      
      const hours = Math.floor(secondsRemaining / 3600);
      const minutes = Math.floor((secondsRemaining % 3600) / 60);
      const seconds = secondsRemaining % 60;
      
      setCountdown(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
      
      const currentProgress = (secondsPassed / CYCLE_DURATION_SECONDS) * 100;
      setProgress(currentProgress);
    }, 1000);

    // Ejecutar una vez al inicio para evitar el parpadeo inicial
    const now = Date.now();
    const secondsPassed = Math.floor((now - cycleStartTime) / 1000);
    if (secondsPassed >= CYCLE_DURATION_SECONDS) {
        setCountdown('00:00:00');
        setProgress(100);
        setIsClaimable(true);
    } else {
        const secondsRemaining = CYCLE_DURATION_SECONDS - secondsPassed;
        const hours = Math.floor(secondsRemaining / 3600);
        const minutes = Math.floor((secondsRemaining % 3600) / 60);
        const seconds = secondsRemaining % 60;
        setCountdown(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        setProgress((secondsPassed / CYCLE_DURATION_SECONDS) * 100);
        setIsClaimable(false);
    }


    return () => clearInterval(interval);
  }, [cycleStartTime]);

  return { countdown, progress, isClaimable };
};