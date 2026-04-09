import * as React from "react"

import type { AppLanguage, MessageKey } from "@/i18n/locales"

export type I18nContextValue = {
  language: AppLanguage
  setLanguage: (lang: AppLanguage) => void
  t: (key: MessageKey, vars?: Record<string, string | number>) => string
}

export const I18nContext = React.createContext<I18nContextValue | null>(null)
