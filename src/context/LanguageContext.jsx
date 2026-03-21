import React, { createContext, useContext, useState, useCallback } from 'react'
import { translations } from '../lib/translations'

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => localStorage.getItem('lang') || 'tr')

  const setLang = useCallback((l) => {
    setLangState(l)
    localStorage.setItem('lang', l)
  }, [])

  const t = useCallback(
    (key) => translations[lang]?.[key] ?? translations.tr[key] ?? key,
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
