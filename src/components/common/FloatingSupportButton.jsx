// RUTA: frontend/src/components/common/FloatingSupportButton.jsx (REDISÉÑO "MEGA FÁBRICA")

import React from 'react';
import { motion } from 'framer-motion';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';

const FloatingSupportButton = ({ dragRef }) => {
  // El enlace de soporte se mantiene configurable aquí.
  const supportLink = 'https://t.me/ServicioFabrica24h';

  const handleSupportClick = () => {
    try {
      // Intenta usar la API de Telegram para una mejor experiencia de usuario.
      window.Telegram.WebApp.openTelegramLink(supportLink);
    } catch (error) {
      // Si la API no está disponible (ej. en un navegador normal), abre en una nueva pestaña.
      console.warn("Telegram WebApp API no disponible. Abriendo en nueva pestaña.");
      window.open(supportLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={dragRef}
      dragMomentum={false}
      onTap={handleSupportClick}
      className="fixed bottom-24 right-4 z-50 cursor-pointer"
      initial={{ scale: 0, y: 100 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }} // Pequeño efecto de zoom al pasar el cursor
    >
      {/* 
        MODIFICADO: El diseño ahora usa los colores semánticos.
        - bg-accent-primary: Nuestro azul eléctrico principal.
        - text-text-primary: Nuestro color de texto principal (blanco hueso).
        - shadow-accent-glow: La nueva sombra azul que definimos.
      */}
      <div className="w-14 h-14 bg-accent-primary rounded-full flex items-center justify-center shadow-accent-glow">
        <HiChatBubbleLeftRight className="w-8 h-8 text-text-primary" />
      </div>
    </motion.div>
  );
};

export default FloatingSupportButton;