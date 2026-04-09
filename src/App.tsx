import { TaxCalculator } from "@/components/TaxCalculator"
import { useI18n } from "@/i18n/use-i18n"

function AppFooter() {
  const { t } = useI18n()
  return (
    <p className="mt-8 max-w-lg text-center text-xs text-muted-foreground">
      {t("app.footerPre")}
      <kbd className="rounded border bg-muted px-1 py-0.5 font-mono">{t("app.footerKey")}</kbd>
      {t("app.footerPost")}
    </p>
  )
}

export function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-start bg-muted/30 p-4 py-10 md:py-14">
      <TaxCalculator />
      <AppFooter />
    </div>
  )
}

export default App
