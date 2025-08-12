// frontend/src/hooks/useFactoryCycle.js (NUEVO)
import { useState, useEffect, useMemo } from 'react';

const CYCLE_DURATION_SECONDS = 24 * 60 * 60; // 24 horas en segundos

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