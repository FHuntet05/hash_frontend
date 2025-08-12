// RUTA: frontend/src/components/layout/Layout.jsx (VERSIÓN ESTABLE CON GUARDIA DE DATOS)
import React, { useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNavBar from './BottomNavBar';
import FloatingSupportButton from '../common/FloatingSupportButton';
import './LayoutAnimations.css';
import useUserStore from '../../store/userStore'; // Importación clave
import Loader from '../common/Loader'; // Se asume que tiene un componente Loader

const Layout = () => {
  const location = useLocation();
  const dragContainerRef = useRef(null);

  // --- INICIO DE LA MODIFICACIÓN CRÍTICA ---
  // Nos suscribimos al estado de autenticación del usuario.
  const { isAuthenticated, isLoadingAuth } = useUserStore();

  // GUARDIA DE CARGA: Mientras se verifica la autenticación, mostramos un loader.
  // Esto previene que cualquier componente hijo intente renderizar con datos nulos.
  if (isLoadingAuth) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-internal-background bg-cover bg-center">
        <Loader text="Cargando sesión..." />
      </div>
    );
  }

  // GUARDIA DE ERROR: Si la autenticación falla, mostramos un mensaje claro.
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-internal-background bg-cover bg-center p-4">
        <div className="text-center text-white bg-red-900/50 p-6 rounded-lg border border-red-500">
            <h2 className="text-xl font-bold">Error de Autenticación</h2>
            <p className="mt-2 text-text-secondary">No se pudo verificar tu sesión. Por favor, reinicia la aplicación desde Telegram.</p>
        </div>
      </div>
    );
  }
  // --- FIN DE LA MODIFICACIÓN CRÍTICA ---

  // Si pasamos las guardias, significa que 'isAuthenticated' es true y el objeto 'user' está disponible.
  // Ahora es seguro renderizar el resto de la aplicación.
  const backgroundClass = location.pathname === '/home' // Ajustado para la ruta correcta
    ? 'bg-space-background bg-cover bg-center' 
    : 'bg-internal-background bg-cover bg-center';

  return (
    <div ref={dragContainerRef} className={`w-full min-h-screen text-text-primary font-sans ${backgroundClass} overflow-hidden`}>
      <div className="container mx-auto max-w-lg min-h-screen flex flex-col bg-transparent">
        <main className="flex-grow p-4 pb-28 flex flex-col overflow-y-auto">
          <div key={location.pathname} className="flex flex-col flex-grow fade-in">
            <Outlet />
          </div>
        </main>
        
        <footer className="fixed bottom-0 left-0 right-0 w-full max-w-lg mx-auto z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-white/10">
            <BottomNavBar />
          </div>
        </footer>

        <FloatingSupportButton dragRef={dragContainerRef} />
      </div>
    </div>
  );
};

export default Layout;