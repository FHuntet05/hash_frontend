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
        <p>{t('aboutPage.p1', '📅 Lanzamiento: 17 de agosto de 2025♾️ Duración: Permanente🔐 Respaldo tecnológico: BlueChain Security Network (blockchain orientada a finanzas, con validadores distribuidos y cifrado de última generación)📜 Contratos inteligentes: Verificados por SmartAudit Pro🔍 Auditoría independiente: BlockSafe Audits (reporte público y aprobado)💼 Fondo de Respaldo para Inversores: 5,000,000 USDT (liquidez dedicada a pagos y estabilidad)')}</p>
        <p>{t('aboutPage.p2', '🔐 SEGURIDAD Y TRANSPARENCIA• BlueChain Security Network: - Consenso con validadores globales y registro inmutable de transacciones.- Monitoreo anti-fraude en tiempo real.• Contratos inteligentes:- Publicados y verificados (reglas de depósitos, retiros y recompensas inmutables).• Auditorías periódicas:- Revisión trimestral de código y reservas por BlockSafe Audits.• Controles internos:- Listas de riesgo, revisión de cuentas y alertas tempranas.⚙️ OPERATIVA• Depósitos: Automáticos (acreditación en segundos una vez confirmada la red).• Retiros: Automáticos tras revisión rápida de seguridad (tiempo promedio: 1–3 min).• Estatus en tiempo real: Saldos, recompensas y trazabilidad de movimientos visibles en el panel.📊 PLANES Y RENTABILIDAD• Beneficio estimado: 35% o 45% según la “fábrica” que adquieras.⚙️ OPERATIVA • Depósitos: Automáticos (acreditación en segundos una vez confirmada la red). • Retiros: Automáticos tras revisión rápida de seguridad (tiempo promedio: 1–3 min). • Estatus en tiempo real: Saldos, recompensas y trazabilidad de movimientos visibles en el panel. 📊 PLANES Y RENTABILIDAD • Beneficio estimado: 35% o 45% según la “fábrica” que adquieras. • Diseño de ciclos para liquidez continua y crecimiento sostenible. • Escalable: puedes iniciar con un plan básico y ampliar con tus ganancias. 🤝 INGRESOS ADICIONALES • Programa de Referidos: - Bono directo por cada invitado que invierte. - Escalado progresivo según el crecimiento de tu red. • Tareas y Misiones: - Recompensas por invitar amigos, completar actividades y metas del ecosistema. 📞 SOPORTE Y COMUNIDAD • Soporte 24/7 (respuestas rápidas). • Equipo multilingüe (ES/EN/RU). • Canal de anuncios y documentación para actualizaciones y guías. 📈 RAZONES PARA CONFIAR • Respaldo en blockchain con validadores distribuidos y contratos verificados. • Auditoría independiente continua y reportes públicos. • Fondo de Respaldo de 5M USDT dedicado a liquidez y pagos. • Modelo híbrido: inversión + tareas (ingresos activos y pasivos). • Transparencia operativa y métricas visibles en el panel.')}</p>
      </div>
    </StaticPageLayout>
  );
};

export default AboutPage;