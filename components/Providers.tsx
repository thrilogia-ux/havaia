'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import ToastContainer from './ToastContainer'
import { DEFAULT_LOCALE, Locale, RTL_LOCALES, getInitialLocale, saveLocale } from '@/lib/i18n'

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
})

export function useI18n() {
  return useContext(I18nContext)
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    const initial = getInitialLocale()
    setLocaleState(initial)
    applyDirection(initial)
  }, [])

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    saveLocale(next)
    applyDirection(next)
  }

  const applyDirection = (loc: Locale) => {
    if (typeof document === 'undefined') return
    const html = document.documentElement
    const isRtl = RTL_LOCALES.includes(loc)
    html.dir = isRtl ? 'rtl' : 'ltr'
    html.lang = loc
    if (isRtl) {
      html.classList.add('rtl')
    } else {
      html.classList.remove('rtl')
    }
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      {children}
      <ToastContainer />
    </I18nContext.Provider>
  )
}

