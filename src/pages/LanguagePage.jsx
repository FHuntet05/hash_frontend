// RUTA: frontend/src/pages/LanguagePage.jsx (DISEÑO CRISTALINO)

import React from 'react';
import { useTranslation } from 'react-i18next';
import StaticPageLayout from '../components/layout/StaticPageLayout';
import { HiCheckCircle } from 'react-icons/hi2'; // Usamos un ícono más visible

const languages = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
];

const LanguagePage = () => {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <StaticPageLayout title={t('languagePage.title', 'Idioma')}>
      <div className="flex flex-col gap-3">
        {languages.map((lang) => {
          const isActive = currentLanguage.startsWith(lang.code);
          return (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              // --- ESTILO DE TARJETA CRISTALINA ---
              className={`w-full flex justify-between items-center p-4 rounded-2xl text-left transition-all duration-300
                ${isActive
                  ? 'bg-accent-primary/10 border-accent-primary shadow-medium' // Estilo activo más prominente
                  : 'bg-card/70 backdrop-blur-md border border-white/20 shadow-subtle hover:border-accent-primary/50'
                }`
              }
            >
              <span className={`font-semibold ${isActive ? 'text-accent-primary' : 'text-text-primary'}`}>{lang.name}</span>
              {isActive && (
                <HiCheckCircle className="w-6 h-6 text-accent-primary" />
              )}
            </button>
          )
        })}
      </div>
    </StaticPageLayout>
  );
};

export default LanguagePage;