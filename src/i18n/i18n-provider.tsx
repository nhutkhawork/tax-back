import * as React from "react"

import { I18nContext } from "@/i18n/i18n-context"
import { type AppLanguage, en, type MessageKey, vi } from "@/i18n/locales"

const STORAGE_KEY = "tax-back-language"

const messages: Record<AppLanguage, Record<MessageKey, string>> = {
  en: en as unknown as Record<MessageKey, string>,
  vi,
}

function interpolate(
  template: string,
  vars: Record<string, string | undefined>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const v = vars[key]
    return v !== undefined && v !== null ? String(v) : ""
  })
}

function readInitialLanguage(): AppLanguage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "en" || stored === "vi") return stored
  } catch {
    /* ignore */
  }

  return "vi"
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<AppLanguage>(readInitialLanguage)

  const setLanguage = React.useCallback((lang: AppLanguage) => {
    setLanguageState(lang)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang
    }
  }, [])

  React.useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const t = React.useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => {
      const raw = messages[language][key]
      if (!vars) return raw
      const stringVars: Record<string, string | undefined> = {}
      for (const [k, v] of Object.entries(vars)) {
        stringVars[k] = typeof v === "number" ? String(v) : v
      }
      return interpolate(raw, stringVars)
    },
    [language],
  )

  React.useEffect(() => {
    document.title = t("app.title")
  }, [language, t])

  const value = React.useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
