import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HiBolt } from 'react-icons/hi2';

const LightningLoader = () => {
  return (
    <div className="relative flex items-center justify-center w-20 h-20">
      
      {/* ONDA EXPANSIVA 1 (Círculo de Energía) */}
      <motion.div
        className="absolute w-full h-full rounded-full border border-accent opacity-0"
        animate={{
          scale: [0.5, 1.5],
          opacity: [0.8, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />

      {/* ONDA EXPANSIVA 2 (Retrasada) */}
      <motion.div
        className="absolute w-full h-full rounded-full border border-accent opacity-0"
        animate={{
          scale: [0.5, 1.5],
          opacity: [0.8, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.5
        }}
      />

      {/* NÚCLEO DEL RAYO (Hexágono o Círculo contenedor) */}
      <div className="relative z-10 bg-surface rounded-full p-4 border border-accent/30 shadow-[0_0_20px_rgba(249,115,22,0.4)]">
        
        {/* EL RAYO (Animación de pálpito eléctrico) */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
            filter: ["drop-shadow(0 0 2px rgba(249,115,22,0.5))", "drop-shadow(0 0 10px rgba(249,115,22,1))", "drop-shadow(0 0 2px rgba(249,115,22,0.5))"]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <HiBolt className="w-8 h-8 text-accent" />
        </motion.div>

      </div>
    </div>
  );
};

const Loader = ({ text }) => {
  const { t } = useTranslation();
  const displayText = text || t('common.loading', 'Iniciando sistemas...');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center h-full w-full min-h-[200px]"
    >
      <div className="flex flex-col items-center justify-center gap-6">
        <LightningLoader />
        {displayText && (
          <motion.p 
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-accent font-bold text-sm tracking-widest uppercase"
          >
            {displayText}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default Loader;