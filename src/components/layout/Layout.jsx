// RUTA: frontend/src/components/layout/Layout.jsx (VERSIÓN FINAL CON PADDING SUPERIOR)

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
    <div className="h-screen w-screen flex justify-center bg-black">
      <div 
        ref={dragContainerRef} 
        className="h-full w-full max-w-lg relative font-sans bg-background text-text-primary"
      >
        {/* 
          --- CORRECCIÓN CRÍTICA ---
          El 'main' ahora tiene un padding superior (pt-16) para dejar espacio al header
          nativo de la Telegram Web App. El padding inferior (pb-28) deja espacio
          para el BottomNavBar flotante.
        */}
        <main className="h-full w-full overflow-y-auto pt-16 pb-28">
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
            success: { iconTheme: { primary: 'var(--color-status-success)', secondary: 'var(--color-card)' } },
            error: { iconTheme: { primary: 'var(--color-status-danger)', secondary: 'var(--color-card)' } }
          }}
        />
      </div>
    </div>
  );
};

export default Layout;