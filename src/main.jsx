// RUTA: frontend/src/main.jsx (ACTUALIZADO CON REACT-QUERY Y TOASTER)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; 
import './i18n'; 

// --- INICIO DE NUEVAS IMPORTACIONES ---

// 1. Importar los componentes necesarios de react-query
import { QueryClient, QueryClientProvider } from 'react-query';

// 2. Importar el componente Toaster para las notificaciones
import { Toaster } from 'react-hot-toast';

// --- FIN DE NUEVAS IMPORTACIONES ---


// --- INICIO DE NUEVA CONFIGURACIÓN ---

// 3. Crear una instancia del cliente de query. Esto gestionará el caché y estado de las peticiones.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita que la app recargue datos solo por cambiar de pestaña
      retry: 1,                   // Reintenta peticiones fallidas solo una vez
    },
  },
});

// --- FIN DE NUEVA CONFIGURACIÓN ---


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 4. Envolver la aplicación con el QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      
      <App />

      {/* 5. Añadir el componente Toaster para que las notificaciones puedan aparecer en cualquier parte de la app */}
      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'text-sm font-sans',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />

    </QueryClientProvider>
  </React.StrictMode>,
);