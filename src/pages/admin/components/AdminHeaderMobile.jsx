// RUTA: frontend/src/pages/admin/components/AdminHeaderMobile.jsx (NUEVO)

import React from 'react';
import { HiBars3 } from 'react-icons/hi2';

const AdminHeaderMobile = ({ onMenuClick, title }) => {
  return (
    <header className="bg-dark-secondary p-4 flex items-center gap-4 border-b border-white/10 md:hidden">
      <button 
        onClick={onMenuClick} 
        className="text-white p-2 rounded-md hover:bg-white/10 transition-colors"
        aria-label="Abrir menú"
      >
        <HiBars3 className="w-6 h-6" />
      </button>
      <h1 className="text-lg font-semibold text-white">{title}</h1>
    </header>
  );
};

export default AdminHeaderMobile;