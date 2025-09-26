// RUTA: frontend/src/components/common/Loader.jsx (v2.0 - ANIMACIÓN DE PUNTOS PULSANTES)

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const BouncingDotsLoader = () => {
  const bounceTransition = {
    y: {
      duration: 0.4,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeOut',
    },
  };

  return (
    <motion.div
      className="flex justify-around items-end w-16 h-8"
      transition={{ staggerChildren: 0.1 }}
      initial="initial"
      animate="animate"
    >
      <motion.span
        className="block w-3 h-3 bg-text-secondary rounded-full"
        variants={{ initial: { y: "0%" }, animate: { y: "-100%" } }}
        transition={bounceTransition}
      />
      <motion.span
        className="block w-3 h-3 bg-accent rounded-full"
        variants={{ initial: { y: "0%" }, animate: { y: "-100%" } }}
        transition={bounceTransition}
      />
      <motion.span
        className="block w-3 h-3 bg-text-secondary rounded-full"
        variants={{ initial: { y: "0%" }, animate: { y: "-100%" } }}
        transition={bounceTransition}
      />
    </motion.div>
  );
};

const Loader = ({ text }) => {
  const { t } = useTranslation();
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
        className="bg-surface/50 backdrop-blur-md p-6 rounded-2xl flex flex-col items-center justify-center gap-4 border border-border shadow-medium"
      >
        <BouncingDotsLoader />
        {displayText && <p className="text-text-primary text-sm font-semibold mt-2">{displayText}</p>}
      </div>
    </motion.div>
  );
};

export default Loader;