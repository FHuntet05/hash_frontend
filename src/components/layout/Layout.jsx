// RUTA: frontend/src/components/layout/Layout.jsx (CON LÓGICA DE FONDO DINÁMICO RESTAURADA)

import React, { useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // Se importa useLocation
import { Toaster } from 'react-hot-toast';

import BottomNav from './BottomNavBar'; // Usamos el nombre correcto del archivo
import useUserStore from '../../store/userStore';
import Loader from '../common/Loader';
import FloatingSupportButton from '../common/FloatingSupportButton';

const Layout = () => {
  const dragContainerRef = useRef(null);
  const location = useLocation(); // Hook para obtener la ruta actual

  // Lógica para determinar la clase de fondo
  const isHomePage = location.pathname === '/home' || location.pathname === '/';
  const backgroundClass = isHomePage ? 'bg-space-background' : 'bg-internal-background';

  // --- GUARDIA DE AUTENTICACIÓN (Sin cambios, pero ahora se mostrará sobre el fondo correcto) ---
  const { isAuthenticated, isLoadingAuth } = useUserStore();
  if (isLoadingAuth) {
    return (
      // Se usa la clase semántica, que es un color sólido, para la pantalla de carga.
      // Esto es intencional para que sea simple y claro.
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader text="Autenticando..." />
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center p-4 bg-background text-text-secondary">
        Error de autenticación. Por favor, reinicia la app desde Telegram.
      </div>
    );
  }
  // --- FIN DE LA GUARDIA ---

  return (
    // Contenedor exterior. bg-black asegura que los bordes del dispositivo simulado sean negros.
    <div className="h-screen w-screen flex justify-center bg-black">
      {/* 
        Contenedor principal de la app.
        - Se asigna la referencia para el botón de arrastre.
        - Se aplica la clase de fondo dinámica.
        - bg-cover y bg-center aseguran que la imagen de fondo cubra el área sin distorsionarse.
      */}
      <div 
        ref={dragContainerRef} 
        className={`h-full w-full max-w-lg relative text-text-primary font-sans overflow-hidden ${backgroundClass} bg-cover bg-center`}
      >
        <main className="h-full w-full overflow-y-auto">
          {/* Un velo semitransparente sobre el fondo para mejorar la legibilidad del texto */}
          <div className="absolute inset-0 bg-black/30 z-0"></div>
          {/* El contenido se renderiza por encima del velo */}
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
        
        <BottomNav />
        <FloatingSupportButton dragRef={dragContainerRef} />
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: 'var(--color-card)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)'
            },
          }}
        />
      </div>
    </div>
  );
};

export default Layout;