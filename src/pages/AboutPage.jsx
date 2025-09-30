// --- START OF FILE AboutPage.jsx ---

// RUTA: frontend/src/pages/AboutPage.jsx (v3.0 - "QUANTUM LEAP": CONTENIDO Y DISEÑO ACTUALIZADO)

import React from 'react';
import { useTranslation } from 'react-i18next';
import StaticPageLayout from '../components/layout/StaticPageLayout';

// Componente interno para los elementos de la lista, para un estilo consistente
const ListItem = ({ children }) => (
  <li className="flex items-start gap-3">
    <span className="text-accent mt-1">🔷</span>
    <span className="flex-1">{children}</span>
  </li>
);

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <StaticPageLayout title={t('aboutPage.title', 'Sobre Nosotros')}>
      <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-subtle text-text-secondary">
        
        <h2 className="text-2xl font-bold text-accent text-center mb-6">
          🔷 HASH POWERBOT — SOBRE NOSOTROS 🔷
        </h2>

        <div className="space-y-6 text-sm leading-relaxed">
          <p>
            Hash PowerBot es una plataforma de minería en la nube diseñada para ofrecer a los usuarios acceso sencillo y seguro a la minería de criptomonedas sin necesidad de contar con hardware propio. Nuestro objetivo es democratizar el acceso a la minería, permitiendo que cualquier persona pueda participar y monitorear su actividad desde el bot.
          </p>

          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-3">¿Cómo funciona?</h3>
            <ul className="space-y-3">
              <ListItem><strong>Compra de potencia (hash power):</strong> los usuarios adquieren paquetes de potencia que se asignan a pools y operaciones de minería profesional.</ListItem>
              <ListItem><strong>Minería gestionada:</strong> nuestro equipo técnico administra los equipos y la infraestructura (pools, refrigeración, mantenimiento y optimización) para maximizar la eficiencia.</ListItem>
              <ListItem><strong>Reparto de ingresos:</strong> las recompensas minadas se distribuyen periódicamente entre los participantes según la potencia contratada, descontando comisiones operativas y de mantenimiento.</ListItem>
              <ListItem><strong>Pagos automáticos:</strong> las ganancias se acreditan en la cuenta del usuario en intervalos regulares y pueden retirarse según las condiciones y límites establecidos.</ListItem>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-3">¿Por qué elegir Hash PowerBot?</h3>
            <ul className="space-y-3">
              <ListItem><strong>Acceso sencillo:</strong> sin instalar ni configurar hardware; todo se administra desde el bot.</ListItem>
              <ListItem><strong>Infraestructura profesional:</strong> operamos rigs y pools con monitoreo 24/7 y mantenimiento especializado.</ListItem>
              <ListItem><strong>Transparencia:</strong> publicamos direcciones de pago, informes periódicos de rendimiento y avisos sobre mantenimiento.</ListItem>
              <ListItem><strong>Seguridad:</strong> usamos conexiones cifradas (SSL/TLS), almacenamiento seguro de fondos y prácticas de seguridad estándar en la industria.</ListItem>
              <ListItem><strong>Soporte al cliente:</strong> atención a través del canal oficial para resolver dudas y guiar en procesos de depósito y retiro.</ListItem>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-3">Transparencia y auditoría</h3>
            <ul className="space-y-3">
              <ListItem>Publicamos reportes de actividad y disponemos (cuando sea aplicable) de comprobantes on-chain para validar movimientos.</ListItem>
              <ListItem>Recomendamos revisar nuestras políticas y reportes antes de invertir.</ListItem>
            </ul>
          </div>

          <div className="bg-status-danger/10 border border-status-danger/20 rounded-lg p-4">
            <h3 className="text-xl font-semibold text-status-danger mb-3">Aviso de riesgos (muy importante)</h3>
            <ul className="space-y-3">
              <ListItem>La minería de criptomonedas implica riesgos de mercado y operativos. Los rendimientos pueden variar según el precio de la criptomoneda, la dificultad de la red, costes de operación y otros factores.</ListItem>
              <ListItem>todas las inversiones están garantizadas. ofrecemos rentabilidades fijas y garantías de capital.</ListItem>
              <ListItem>Antes de invertir, lea los términos y condiciones, la política y consulte con un asesor si lo considera necesario.</ListItem>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-3">Requisitos y cumplimiento</h3>
            <ul className="space-y-3">
              <ListItem>Implementamos procesos KYC/AML para cumplir con normativas y proteger a la comunidad.</ListItem>
              <ListItem>Algunas funciones (retiros, compras avanzadas) requieren verificación completa.</ListItem>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-3">Contacto y soporte</h3>
            <ul className="space-y-3">
              <ListItem>Soporte en el canal oficial: <a href="https://t.me/HashPowerSupport1" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">https://t.me/HashPowerSupport1</a></ListItem>
              <ListItem>Horario de atención: 24/7 (respuestas escaladas según prioridad)</ListItem>
            </ul>
          </div>

          <hr className="my-6 border-border opacity-50" />

          <p className="text-center font-semibold">
            📌 Nota final: Hash PowerBot facilita acceso profesional a minería en la nube, pero siempre recomendamos operar con responsabilidad.
          </p>
        </div>

      </div>
    </StaticPageLayout>
  );
};

export default AboutPage;

// --- END OF FILE AboutPage.jsx ---