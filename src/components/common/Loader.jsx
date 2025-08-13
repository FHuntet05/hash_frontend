// RUTA: frontend/src/components/common/Loader.jsx (DISEÑO CRISTALINO)

import React from 'react';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';

// Obtenemos los colores de Tailwind para usarlos en el componente de spinner.
// Es mejor definir esto fuera del componente para que no se recalcule en cada render.
const themeColors = {
  accentPrimary: '#0ea5e9' // Corresponde a accent.primary (sky-500) en tailwind.config.js
};

const Loader = ({ text }) => {
  const { t } = useTranslation();
  // Si no se pasa texto, se usa uno por defecto y traducible.
  const displayText = text || t('common.loading', 'Cargando...');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center"
    >
      <div 
        className="bg-card/70 backdrop-blur-md p-6 rounded-2xl flex flex-col items-center justify-center gap-4 border border-white/20 shadow-medium"
      >
        <ClipLoader color={themeColors.accentPrimary} size={35} speedMultiplier={0.8} />
        {displayText && <p className="text-text-primary text-sm font-semibold">{displayText}</p>}
      </div>
    </motion.div>
  );
};

export default Loader;