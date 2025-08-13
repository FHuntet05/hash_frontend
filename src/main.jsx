// RUTA: frontend/src/main.jsx (CORRECCIÓN CRÍTICA DE IMPORTACIÓN CSS)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// --- CORRECCIÓN CRÍTICA DE RUTA DE ESTILOS ---
// La línea anterior importaba './styles/global.css', que no contiene los estilos de Tailwind.
// Se ha cambiado a './index.css', que es el archivo correcto con los estilos de Tailwind.
import './index.css'; 
// --- FIN DE LA CORRECCIÓN ---

// La importación de i18n se mantiene aquí, ya es correcta.
import './i18n'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);