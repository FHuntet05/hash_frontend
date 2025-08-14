// RUTA: frontend/src/components/MaintenanceScreen.jsx (MEJORADO)

import React from 'react';
import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2';

const MaintenanceScreen = ({ message }) => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-background text-center p-6">
      <HiOutlineWrenchScrewdriver className="w-16 h-16 text-accent-primary mb-6" />
      <h1 className="text-3xl font-bold text-text-primary mb-2">
        En Mantenimiento
      </h1>
      <p className="text-lg text-text-secondary max-w-md">
        {message || 'Estamos realizando mejoras en la plataforma. Por favor, vuelve más tarde.'}
      </p>
    </div>
  );
};

export default MaintenanceScreen;