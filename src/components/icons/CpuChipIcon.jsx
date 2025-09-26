// RUTA: frontend/src/components/icons/CpuChipIcon.jsx (NUEVO COMPONENTE)

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Un icono SVG animado de un CPU/Chip.
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.className - Clases de Tailwind para aplicar al SVG (controla tamaño, color, etc.).
 * @param {number} props.animationDuration - Duración de la animación de pulso en segundos.
 */
const CpuChipIcon = ({ className = 'w-8 h-8', animationDuration = 4 }) => {

  const pathVariants = {
    initial: {
      pathLength: 0,
      opacity: 0,
    },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
      },
    },
  };

  const glowVariants = {
    animate: {
      opacity: [0, 0.5, 0], // Pulso de opacidad
      scale: [1, 1.2, 1],   // Pulso de escala
      transition: {
        duration: animationDuration, // Duración controlada por props
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial="initial"
      animate="animate"
    >
      {/* Resplandor animado de fondo */}
      <motion.rect 
        x="4" y="4" width="16" height="16" rx="2" 
        className="text-current opacity-20"
        variants={glowVariants}
      />

      {/* Caja principal del chip */}
      <motion.rect 
        x="4" y="4" width="16" height="16" rx="2" 
        variants={pathVariants} 
      />
      
      {/* Caja interna */}
      <motion.rect 
        x="9" y="9" width="6" height="6" 
        variants={pathVariants} 
        transition={{ ...pathVariants.animate.transition, delay: 0.2 }}
      />
      
      {/* Pines de conexión (animados en secuencia) */}
      <motion.line x1="9" y1="1" x2="9" y2="4" variants={pathVariants} transition={{ ...pathVariants.animate.transition, delay: 0.4 }} />
      <motion.line x1="15" y1="1" x2="15" y2="4" variants={pathVariants} transition={{ ...pathVariants.animate.transition, delay: 0.5 }} />
      <motion.line x1="9" y1="20" x2="9" y2="23" variants={pathVariants} transition={{ ...pathVariants.animate.transition, delay: 0.6 }} />
      <motion.line x1="15" y1="20" x2="15" y2="23" variants={pathVariants} transition={{ ...pathVariants.animate.transition, delay: 0.7 }} />
      <motion.line x1="1" y1="9" x2="4" y2="9" variants={pathVariants} transition={{ ...pathVariants.animate.transition, delay: 0.8 }} />
      <motion.line x1="1" y1="15" x2="4" y2="15" variants={pathVariants} transition={{ ...pathVariants.animate.transition, delay: 0.9 }} />
      <motion.line x1="20" y1="9" x2="23" y2="9" variants={pathVariants} transition={{ ...pathVariants.animate.transition, delay: 1.0 }} />
      <motion.line x1="20" y1="15" x2="23" y2="15" variants={pathVariants} transition={{ ...pathVariants.animate.transition, delay: 1.1 }} />
    </motion.svg>
  );
};

export default CpuChipIcon;