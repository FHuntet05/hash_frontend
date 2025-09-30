// RUTA: frontend/src/pages/AboutPage.jsx (v2.0 - CONTENIDO Hash Power BOT)

import React from 'react';
import { useTranslation } from 'react-i18next';
import StaticPageLayout from '../components/layout/StaticPageLayout';

const AboutPage = () => {
  const { t } = useTranslation();

  // Componente interno para renderizar secciones y evitar repetición de código
  const InfoSection = ({ title, items }) => (
    <>
      <hr className="my-6 border-border opacity-50" />
      <h3 className="text-lg font-semibold text-text-primary mb-3">{title}</h3>
      <ul className="space-y-3 text-text-secondary">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-3 mt-1 text-accent-primary">{item.icon}</span>
            <div>
              <strong>{item.title}</strong>
              {item.details && item.details.map((detail, dIndex) => (
                <p key={dIndex} className="pl-1 text-sm text-text-secondary/80">- {detail}</p>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <StaticPageLayout title={t('aboutPage.title', 'Informe Oficial del Proyecto')}>
      <div className="bg-card/70 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-border shadow-subtle text-text-secondary">
        
        <h2 className="text-2xl font-bold text-accent-primary text-center mb-2">
          🤖🔗 Hash Power BOT
        </h2>
        <p className="text-center text-text-secondary mb-6">
          Informe Oficial de Proyecto (Versión Comunidad)
        </p>

        {/* --- Bloque de Información Clave --- */}
        <div className="space-y-2 text-sm">
          <p>📅 <strong>Lanzamiento:</strong> 22 de agosto de 2025</p>
          <p>♾️ <strong>Duración:</strong> Permanente (operación autónoma sobre blockchain)</p>
          <p>🔐 <strong>Infraestructura:</strong> Hash Power Core (red de validadores distribuidos + cifrado cuántico-resistente)</p>
          <p>📜 <strong>Contratos:</strong> Certificados por ChainAudit Global</p>
          <p>🔍 <strong>Auditoría:</strong> SecureBlocks Ltd. (informes públicos y en cadena)</p>
          <p>💼 <strong>Fondo de Protección:</strong> 10,000,000 USDT (reserva en stablecoins para estabilidad)</p>
        </div>

        <InfoSection 
          title="🔐 SEGURIDAD Y CONFIANZA"
          items={[
            { title: 'Hash Power Core Network:', details: ['Blockchain de consenso híbrido (Proof-of-Stake + Proof-of-Verification).', 'Nodos validados en más de 30 países.', 'Registro inmutable y trazabilidad en tiempo real.'] },
            { title: 'Contratos inteligentes:', details: ['Código abierto y auditable.', 'Reglas inmutables de depósitos, retiros y distribución de recompensas.'] },
            { title: 'Auditoría de terceros:', details: ['Revisión continua por SecureBlocks Ltd.', 'Reportes trimestrales publicados en cadena para máxima transparencia.'] },
            { title: 'Protección activa:', details: ['Sistema de alertas anti-anomalías con IA propia.', 'Revisión automática de direcciones sospechosas y listas negras globales.'] },
          ]}
        />

        <InfoSection 
          title="⚙ FUNCIONAMIENTO DE Hash Power BOT"
          items={[
            { title: 'Depósitos:', details: ['Acreditación inmediata tras validación en red.'] },
            { title: 'Retiros:', details: ['Procesados en promedio en 60 segundos, con filtros de seguridad integrados.'] },
            { title: 'Panel de Control:', details: ['Acceso 24/7 a saldos, recompensas, historial y auditorías.'] },
            { title: 'Automatización total:', details: ['El bot ejecuta tareas financieras sin intervención humana.'] },
          ]}
        />
        
        <InfoSection 
          title="📊 MODELO DE CRECIMIENTO Y RENTABILIDAD"
          items={[
            { title: 'Planes Flexibles:', details: ['Desde micro-inversión hasta escalamiento empresarial.'] },
            { title: 'Rentabilidad proyectada:', details: ['Entre 28% y 52% anual, según estrategia elegida.'] },
            { title: 'Modelo sostenible:', details: ['Ciclos diseñados para mantener liquidez continua.'] },
            { title: 'Recompensas dinámicas:', details: ['Ajustes automáticos basados en métricas de red y estabilidad global.'] },
          ]}
        />

        <InfoSection 
          title="🤝 OPORTUNIDADES DE INGRESO ADICIONAL"
          items={[
            { title: 'Programa de Referidos:', details: ['Bonos escalables en varios niveles.', 'Recompensas adicionales por volumen de red.'] },
            { title: 'Módulo de Tareas Digitales:', details: ['Ganancias extra al completar acciones dentro del ecosistema.', 'Actividades diseñadas para impulsar la comunidad y la red.'] },
          ]}
        />

        <InfoSection 
          title="📞 SOPORTE Y COMUNIDAD"
          items={[
            { title: 'Atención 24/7:', details: ['Chat en vivo + tickets.'] },
            { title: 'Equipo multilingüe:', details: ['Español, inglés, ruso, chino.'] },
            { title: 'Canal oficial:', details: ['Noticias, manuales y reportes auditados.'] },
            { title: 'Comunidad abierta:', details: ['Foros y grupos con participación global.'] },
          ]}
        />

        <InfoSection 
          title="📈 POR QUÉ CONFIAR EN Hash Power BOT"
          items={[
            { title: 'Blockchain Hash Power Core:', details: ['Validadores distribuidos, consenso híbrido, resistencia a ataques.'] },
            { title: 'Contratos auditados:', details: ['Certificados por entidades externas.'] },
            { title: 'Fondo de Protección:', details: ['10M USDT dedicado a estabilidad y respaldo de pagos.'] },
            { title: 'Modelo híbrido:', details: ['Rentabilidad automatizada + ingresos comunitarios.'] },
            { title: 'Transparencia total:', details: ['Panel de métricas en tiempo real y auditorías públicas.'] },
          ]}
        />
        
        <hr className="my-6 border-border opacity-50" />

        <p className="text-center text-text-secondary font-semibold">
          🔗 Hash Power Bot no es solo un bot: es una infraestructura autónoma sobre blockchain que combina seguridad, liquidez y crecimiento sostenible.
        </p>

      </div>
    </StaticPageLayout>
  );
};

export default AboutPage;