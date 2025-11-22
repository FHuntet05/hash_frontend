// --- START OF FILE AboutPage.jsx ---

import React from 'react';
import { useTranslation } from 'react-i18next';
import StaticPageLayout from '../components/layout/StaticPageLayout';
import { HiCheckCircle } from 'react-icons/hi2';

// Componente interno para listas
const ListItem = ({ children }) => (
  <li className="flex items-start gap-3 mb-2">
    <HiCheckCircle className="text-accent mt-0.5 w-5 h-5 flex-shrink-0" />
    <span className="flex-1 text-text-secondary text-sm leading-relaxed">{children}</span>
  </li>
);

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <StaticPageLayout title={t('aboutPage.title', 'Sobre Nosotros')}>
      <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-border shadow-medium text-text-primary relative overflow-hidden">
        
        {/* Fondo decorativo */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>

        <h2 className="text-2xl font-bold text-white text-center mb-6 flex items-center justify-center gap-2">
          📌 Sobre Nosotros <span className="text-accent">NovMining</span>
        </h2>

        <div className="space-y-8">
          
          {/* INTRO */}
          <p className="text-sm text-text-secondary leading-relaxed">
            En <strong>NovMining</strong> somos una plataforma especializada en minería de criptomonedas y gestión de inversiones digitales. Nuestro objetivo es ofrecer a cada usuario un sistema transparente, seguro y altamente rentable, respaldado por la tecnología blockchain.
          </p>

          {/* SECCIÓN 1: CÓMO FUNCIONA */}
          <div className="bg-background/50 p-5 rounded-2xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              ⚙️ ¿Cómo generamos las ganancias?
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              Las inversiones realizadas por nuestros usuarios se integran directamente en procesos de minería y cuantificación digital. Cada depósito se procesa en tiempo real dentro de la blockchain, garantizando trazabilidad y seguridad absoluta. Los fondos invertidos comienzan a trabajar de inmediato, generando rendimientos que oscilan entre un <strong>10% y 30%</strong>, dependiendo del monto y la estrategia de inversión aplicada.
            </p>
            
            <div className="pl-2 border-l-2 border-accent/30 mt-4">
              <p className="text-sm text-text-secondary font-semibold mb-2">Sistema de Multiplicación:</p>
              <ul className="space-y-2">
                <li className="text-xs text-text-secondary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                  Comisiones desde 8% hasta 1%, según nivel de depósito.
                </li>
                <li className="text-xs text-text-secondary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                  Bonificaciones escalonadas por expansión de red.
                </li>
              </ul>
            </div>
          </div>

          {/* SECCIÓN 2: BENEFICIOS */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              💼 Beneficios otorgados:
            </h3>
            <ul className="space-y-1">
              <ListItem><strong>Transparencia total:</strong> cada movimiento queda registrado en la blockchain.</ListItem>
              <ListItem><strong>Pagos constantes:</strong> tus ganancias se acreditan de forma puntual y verificada.</ListItem>
              <ListItem><strong>Seguridad garantizada:</strong> fondos protegidos por infraestructura descentralizada.</ListItem>
              <ListItem><strong>Escalabilidad:</strong> cuanto mayor sea tu inversión, mayor será tu rendimiento.</ListItem>
              <ListItem><strong>Comunidad activa:</strong> acceso a líderes y grupos de apoyo que fortalecen tu experiencia.</ListItem>
            </ul>
          </div>

          <hr className="border-white/10" />

          {/* OUTRO */}
          <div className="text-center bg-gradient-to-r from-accent/10 to-transparent p-4 rounded-xl border border-accent/20">
            <p className="text-sm font-medium text-white">
              🚀 En <strong>NovMining</strong> creemos que la minería digital no es solo una inversión, sino una oportunidad de crecimiento colectivo.
            </p>
            <p className="text-xs text-text-secondary mt-2">
              Nuestro compromiso es que cada usuario recupere su inversión y obtenga beneficios adicionales, construyendo confianza y estabilidad.
            </p>
          </div>

        </div>
      </div>
    </StaticPageLayout>
  );
};

export default AboutPage;

// --- END OF FILE AboutPage.jsx ---