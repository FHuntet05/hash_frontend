// RUTA: frontend/src/pages/FaqPage.jsx (DISEÑO CRISTALINO)

import React from 'react';
import { useTranslation } from 'react-i18next';
import StaticPageLayout from '../components/layout/StaticPageLayout';

// Componente FaqItem rediseñado con efecto de cristal
const FaqItem = ({ question, answer }) => (
  <div className="bg-card/70 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-subtle">
    <h3 className="font-bold text-text-primary mb-2">{question}</h3>
    <p className="text-sm text-text-secondary">{answer}</p>
  </div>
);

const FaqPage = () => {
  const { t } = useTranslation();
  
  // Lista de FAQs para facilitar la gestión
  const faqList = [
    { key: 'q1', question: t('faqPage.q1'), answer: t('faqPage.a1') },
    { key: 'q2', question: t('faqPage.q2'), answer: t('faqPage.a2') },
    { key: 'q3', question: t('faqPage.q3'), answer: t('faqPage.a3') },
    { key: 'q4', question: t('faqPage.q4'), answer: t('faqPage.a4') },
  ];

  return (
    // Se elimina el 'div' contenedor innecesario, StaticPageLayout ya lo provee.
    <StaticPageLayout title={t('faqPage.title', 'Preguntas Frecuentes')}>
      {/* El layout de StaticPageLayout ya incluye un space-y-4, por lo que no necesitamos un div extra */}
      {faqList.map(faq => (
        <FaqItem key={faq.key} question={faq.question} answer={faq.answer} />
      ))}
    </StaticPageLayout>
  );
};

export default FaqPage;