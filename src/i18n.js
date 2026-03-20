import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar arquivos de tradução
import ptCommon from './locales/pt/common.json';
import ptProducts from './locales/pt/products.json';
import ptUI from './locales/pt/ui.json';

import enCommon from './locales/en/common.json';
import enProducts from './locales/en/products.json';
import enUI from './locales/en/ui.json';

import frCommon from './locales/fr/common.json';
import frProducts from './locales/fr/products.json';
import frUI from './locales/fr/ui.json';

const resources = {
  pt: {
    common: ptCommon,
    products: ptProducts,
    ui: ptUI,
  },
  en: {
    common: enCommon,
    products: enProducts,
    ui: enUI,
  },
  fr: {
    common: frCommon,
    products: frProducts,
    ui: frUI,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
    ns: ['common', 'products', 'ui'],
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
