// RUTA: frontend/src/pages/SupportPage.jsx (DISEÑO CRISTALINO)

import React from 'react';
import { useTranslation } from 'react-i18next';
import StaticPageLayout from '../components/layout/StaticPageLayout';

const SupportPage = () => {
  const { t } = useTranslation();
  return (
    // Se elimina el 'div' contenedor innecesario
    <StaticPageLayout title={t('supportPage.title', 'Soporte')}>
      {/* Contenido envuelto en una tarjeta de cristal */}
      <div className="bg-card/70 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-subtle space-y-4 text-text-secondary">
        <p>{t('supportPage.p1', 'Si tienes alguna pregunta o necesitas ayuda con tu cuenta, nuestro CEO puede asistirle de igual manera.')}</p>
        <div>
          <h3 className="font-bold text-text-primary mb-1">{t('supportPage.supportLink', 'Canal de Soporte Oficial:')}</h3>
          <a 
            href="https://t.me/EverChai" // Asegúrate de que este es el enlace correcto
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-accent-primary font-semibold hover:underline break-all"
          >
           https://t.me/EverChai
          </a>
        </div>
      </div>
    </StaticPageLayout>
  );
};

export default SupportPage;