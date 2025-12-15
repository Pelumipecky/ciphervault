import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import zh from './locales/zh.json'
import ja from './locales/ja.json'
import pt from './locales/pt.json'
import ptBR from './locales/pt-BR.json'

const resources = {
  en: {
    translation: en
  },
  es: {
    translation: es
  },
  fr: {
    translation: fr
  },
  de: {
    translation: de
  },
  zh: {
    translation: zh
  },
  ja: {
    translation: ja
  }
  ,
  pt: {
    translation: pt
  },
  'pt-BR': {
    translation: ptBR
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    // Explicit list of supported languages prevents language detector from
    // using malformed or unexpected locale values from localStorage.
    supportedLngs: ['en', 'es', 'fr', 'de', 'zh', 'ja', 'pt', 'pt-BR'],
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  })

export default i18n

// Ensure any invalid or legacy language value stored in localStorage doesn't
// break content. If a stored value is present but unsupported, reset it to
// the default so the UI shows English text again.
try {
  const stored = localStorage.getItem('i18nextLng')
  const allowed = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'pt', 'pt-BR']
  if (stored && !allowed.includes(stored)) {
    localStorage.setItem('i18nextLng', 'en')
  }
} catch (e) {
  // localStorage may not be available in some test environments — ignore.
}