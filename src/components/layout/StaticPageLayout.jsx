// RUTA: frontend/src/components/layout/StaticPageLayout.jsx (RECONSTRUIDO PARA TEMA CRISTALINO)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiChevronLeft } from 'react-icons/hi2';

const StaticPageLayout = ({ title, children }) => {
  const navigate = useNavigate();

  return (
    // Contenedor principal con el padding superior para el header de Telegram
    <div className="flex flex-col h-full p-4 pt-6">
      <header className="flex items-center mb-6 relative">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute left-0 p-2 bg-card/70 backdrop-blur-md rounded-full border border-white/20 shadow-subtle"
        >
          <HiChevronLeft className="w-6 h-6 text-text-primary" />
        </button>
        <h1 className="text-xl font-bold text-text-primary flex-grow text-center">{title}</h1>
        {/* Espaciador para asegurar que el título quede perfectamente centrado */}
        <div className="w-10"></div> 
      </header>

      {/* El contenido principal ya no necesita fondo propio, hereda el de la página */}
      <main className="flex-grow space-y-4 overflow-y-auto no-scrollbar">
        {children}
      </main>
    </div>
  );
};

export default StaticPageLayout;