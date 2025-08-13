// RUTA: frontend/src/pages/AboutPage.jsx (DISEÑO CRISTALINO)

import React from 'react';
import { useTranslation } from 'react-i18next';
import StaticPageLayout from '../components/layout/StaticPageLayout';

const AboutPage = () => {
  const { t } = useTranslation();
  return (
    // Se elimina el 'div' contenedor innecesario
    <StaticPageLayout title={t('aboutPage.title', 'Sobre Nosotros')}>
      {/* Contenido envuelto en una tarjeta de cristal */}
      <div className="bg-card/70 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-subtle space-y-4 text-text-secondary">
        <p>{t('aboutPage.p1', 'Mega Fábrica es una plataforma innovadora que te permite generar ingresos pasivos a través de un sistema de producción virtual.')}</p>
        <p>{t('aboutPage.p2', 'Nuestro objetivo es proporcionar una experiencia de usuario emocionante y gratificante, combinando tecnología de vanguardia con un modelo de negocio accesible para todos.')}</p>
      </div>
    </StaticPageLayout>
  );
};

export default AboutPage;