// RUTA: frontend/src/Layout.jsx (VERSIÓN "MEGA FÁBRICA" - REVISIÓN CON SOPORTE)

import React, { useRef } from 'react'; // Importamos useRef
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import BottomNav from './components/nav/BottomNav';
import useUserStore from './store/userStore';
import Loader from './components/common/Loader';
import FloatingSupportButton from './components/common/FloatingSupportButton'; // Importamos el botón

const Layout = () => {
  const dragContainerRef = useRef(null); // Creamos la referencia para el contenedor de arrastre

  // --- GUARDIA DE AUTENTICACIÓN (Sin cambios) ---
  const { isAuthenticated, isLoadingAuth } = useUserStore();

  if (isLoadingAuth) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900">
        <Loader text="Cargando sesión..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="text-center bg-slate-800 p-6 rounded-lg border border-red-500/50">
            <h2 className="text-xl font-bold text-slate-50">Error de Autenticación</h2>
            <p className="mt-2 text-slate-400">No se pudo verificar tu sesión. Por favor, reinicia la aplicación desde Telegram.</p>
        </div>
      </div>
    );
  }
  // --- FIN DE LA GUARDIA ---

  return (
    <div className="h-screen w-screen flex justify-center bg-black">
      {/* 
        NOTA DE ARQUITECTURA: Asignamos la referencia al contenedor principal de la app.
        Cualquier elemento arrastrable dentro de este div (como el botón de soporte)
        estará confinado a sus límites.
      */}
      <div ref={dragContainerRef} className="h-full w-full max-w-lg relative bg-slate-900 text-slate-50 font-sans overflow-hidden">
        
        <main className="h-full w-full overflow-y-auto">
          <Outlet />
        </main>
        
        <BottomNav />
        
        {/* REINTEGRADO: El botón de soporte flotante se renderiza aquí */}
        <FloatingSupportButton dragRef={dragContainerRef} />

        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            className: '',
            style: {
              background: '#1e293b', // bg-slate-800
              color: '#f8fafc', // text-slate-50
              border: '1px solid #334155' // border-slate-700
            },
          }}
        />
      </div>
    </div>
  );
};

export default Layout;