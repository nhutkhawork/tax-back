import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { I18nProvider } from "@/i18n/i18n-provider"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { TooltipProvider } from "@/components/ui/tooltip"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider delayDuration={200}>
        <I18nProvider>
          <App />
        </I18nProvider>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
)
