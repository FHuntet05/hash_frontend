// RUTA: frontend/src/pages/NotFoundPage.jsx (DISEÑO LIMPIO Y COHERENTE)

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-center p-4">
      <h1 className="text-6xl font-bold text-accent-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-text-primary mb-2">
        {t('notFoundPage.title', 'Página no encontrada')}
      </h2>
      <p className="text-text-secondary mb-8 max-w-sm">
        {t('notFoundPage.description', 'Lo sentimos, la página que buscas no existe o ha sido movida.')}
      </p>
      <Link
        to="/home" // La ruta correcta para volver es /home
        className="px-6 py-3 font-bold text-white rounded-full bg-accent-primary shadow-medium transform transition-transform active:scale-95 hover:bg-accent-primary-hover"
      >
        {t('notFoundPage.button', 'Volver al Inicio')}
      </Link>
    </div>
  );
};

export default NotFoundPage;