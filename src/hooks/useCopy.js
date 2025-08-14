// RUTA: frontend/src/hooks/useCopy.js (NUEVO ARCHIVO)

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

/**
 * Hook personalizado para manejar la funcionalidad de copiar texto al portapapeles.
 * @returns {[boolean, function(string): void]} Un array que contiene:
 * - isCopied (boolean): Estado que indica si el texto fue copiado recientemente.
 * - handleCopy (function): Función para ejecutar la copia.
 */
const useCopy = () => {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback((textToCopy) => {
    // navigator.clipboard está disponible en contextos seguros (HTTPS)
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setIsCopied(true);
          toast.success(t('common.copied', 'Copiado al portapapeles'));
          // Resetea el estado después de un tiempo para que el ícono vuelva a la normalidad
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(err => {
          console.error('Error al copiar al portapapeles:', err);
          toast.error(t('common.copyError', 'No se pudo copiar'));
        });
    } else {
      // Fallback para entornos no seguros (como HTTP local)
      try {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        setIsCopied(true);
        toast.success(t('common.copied', 'Copiado al portapapeles'));
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Fallback de copia fallido:', err);
        toast.error(t('common.copyError', 'No se pudo copiar'));
      }
    }
  }, [t]); // t se incluye como dependencia por si las traducciones cambian

  return [isCopied, handleCopy];
};

export default useCopy;