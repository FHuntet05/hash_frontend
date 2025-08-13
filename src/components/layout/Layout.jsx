// RUTA: frontend/src/components/layout/Layout.jsx (VERSIÓN CON RUTA CORREGIDA)

import React, { useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// --- INICIO DE LA CORRECCIÓN CRÍTICA ---
// La ruta anterior era './components/nav/BottomNav', lo cual es incorrecto desde este archivo.
// La ruta correcta sube un nivel ('..') desde 'layout' para llegar a 'components',
// y luego baja a 'nav'.
import BottomNav from '../nav/BottomNav'; 
// --- FIN DE LA CORRECCIÓN CRÍTICA ---

import useUserStore from '../../store/userStore';
import Loader from '../common/Loader';
import FloatingSupportButton from '../common/FloatingSupportButton';

const Layout = () => {
  const dragContainerRef = useRef(null);

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

  return (
    <div className="h-screen w-screen flex justify-center bg-black">
      <div ref={dragContainerRef} className="h-full w-full max-w-lg relative bg-slate-900 text-slate-50 font-sans overflow-hidden">
        
        <main className="h-full w-full overflow-y-auto">
          <Outlet />
        </main>
        
        <BottomNav />
        
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