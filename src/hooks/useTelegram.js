// RUTA: frontend/src/hooks/useTelegram.js (NUEVO ARCHIVO)

import { useMemo } from 'react';

/**
 * Hook personalizado para interactuar de forma segura con el objeto
 * de la WebApp de Telegram.
 * @returns {{isTelegramWebApp: boolean, tg: object | null}}
 */
export function useTelegram() {
  const tg = useMemo(() => {
    // Accedemos a window de forma segura, ya que en SSR podría no existir.
    if (typeof window !== 'undefined') {
      return window.Telegram?.WebApp;
    }
    return null;
  }, []);

  return {
    // Un booleano simple para saber si estamos en el contexto de Telegram.
    isTelegramWebApp: !!tg,
    // El objeto 'tg' completo para futuras interacciones (ej: tg.expand()).
    tg
  };
}