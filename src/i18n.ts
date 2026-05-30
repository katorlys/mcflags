import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from './locales'

const languageStorageKey = "mcflags-language"
const supportedLanguages = ["en", "zh"] as const

function getInitialLanguage() {
  if (typeof window === "undefined") {
    return "en"
  }
  const storedLanguage = window.localStorage.getItem(languageStorageKey)
  if (storedLanguage && supportedLanguages.includes(storedLanguage as typeof supportedLanguages[number])) {
    return storedLanguage
  }
  const browserLanguage = window.navigator.language.toLowerCase()
  if (browserLanguage.startsWith("zh")) {
    return "zh"
  }
  return "en"
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
})

i18n.on("languageChanged", (language) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(languageStorageKey, language)
  }
})

export { i18n }
