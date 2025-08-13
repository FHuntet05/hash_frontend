// RUTA: frontend/src/components/layout/Layout.jsx (RECONSTRUIDO PARA TEMA CRISTALINO)

import React, { useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import BottomNavBar from './BottomNavBar';
import FloatingSupportButton from '../common/FloatingSupportButton';
import useUserStore from '../../store/userStore';
import Loader from '../common/Loader';

const Layout = () => {
  const dragContainerRef = useRef(null);
  const { isAuthenticated, isLoadingAuth } = useUserStore();

  if (isLoadingAuth) {
    return (
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

  return (
    // El contenedor exterior 'bg-black' se mantiene para un buen aspecto en desktop.
    <div className="h-screen w-screen flex justify-center bg-black">
      {/* 
        Contenedor principal de la app.
        - Ahora es un lienzo simple. El fondo blanco hueso viene del 'body'.
        - 'overflow-hidden' es importante para contener los bordes redondeados de los componentes.
      */}
      <div 
        ref={dragContainerRef} 
        className="h-full w-full max-w-lg relative font-sans"
      >
        <main className="h-full w-full overflow-y-auto">
          <Outlet />
        </main>
        
        <BottomNavBar />
        <FloatingSupportButton dragRef={dragContainerRef} />
        
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: 'var(--color-card)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
            },
            success: {
              iconTheme: {
                primary: 'var(--color-status-success)',
                secondary: 'var(--color-card)',
              },
            },
            error: {
               iconTheme: {
                primary: 'var(--color-status-danger)',
                secondary: 'var(--color-card)',
              },
            }
          }}
        />
      </div>
    </div>
  );
};

export default Layout;