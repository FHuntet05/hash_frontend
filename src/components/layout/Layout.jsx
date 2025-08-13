// RUTA: frontend/src/components/layout/Layout.jsx (ADAPTADO AL NUEVO TEMA CLARO)

import React, { useRef } from 'react';
import { Outlet } from 'react-router-dom'; // Se elimina useLocation
import { Toaster } from 'react-hot-toast';

import BottomNav from './BottomNavBar';
import useUserStore from '../../store/userStore';
import Loader from '../common/Loader';
import FloatingSupportButton from '../common/FloatingSupportButton';

const Layout = () => {
  const dragContainerRef = useRef(null);
  
  // --- GUARDIA DE AUTENTICACIÓN (Adaptada a tema claro) ---
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
  // --- FIN DE LA GUARDIA ---

  return (
    // Contenedor exterior. bg-black se mantiene para los bordes del dispositivo simulado.
    <div className="h-screen w-screen flex justify-center bg-black">
      {/* 
        Contenedor principal de la app.
        - Aplica el nuevo fondo 'bg-background' (gris claro).
        - La lógica de fondos de imagen ha sido eliminada.
      */}
      <div 
        ref={dragContainerRef} 
        className="h-full w-full max-w-lg relative bg-background text-text-primary font-sans overflow-hidden"
      >
        <main className="h-full w-full overflow-y-auto">
          {/* El 'Outlet' ahora se renderiza directamente. El velo ha sido eliminado. */}
          <Outlet />
        </main>
        
        <BottomNav />
        <FloatingSupportButton dragRef={dragContainerRef} />
        
        {/* MODIFICADO: Estilos del Toaster adaptados al tema claro */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: 'var(--color-card)',        // Fondo blanco
              color: 'var(--color-text-primary)',      // Texto oscuro
              border: '1px solid var(--color-border)', // Borde gris claro
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