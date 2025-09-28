// RUTA: frontend/src/hooks/useTelegram.js (v2.0 - LÓGICA DE DETECCIÓN CORREGIDA)

import { useMemo } from 'react';

/**
 * Hook personalizado para interactuar de forma segura con el objeto
 * de la WebApp de Telegram.
 * @returns {{isTelegramWebApp: boolean, tg: object | null}}
 */
export function useTelegram() {
  const tgContext = useMemo(() => {
    // Accedemos a window de forma segura.
    if (typeof window === 'undefined') {
      return { isTelegramWebApp: false, tg: null };
    }

    const tg = window.Telegram?.WebApp;

    // --- LA CORRECCIÓN CRÍTICA ---
    // La verdadera prueba para saber si estamos en una WebApp de Telegram real
    // no es solo si el objeto 'tg' existe, sino si tiene 'initData'.
    // En un navegador normal, 'tg' existe pero 'tg.initData' está vacío.
    const isTelegramWebApp = tg && tg.initData && tg.initData.length > 0;
    
    return { isTelegramWebApp, tg };
  }, []);

  return tgContext;
}