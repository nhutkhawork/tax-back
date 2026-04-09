import { TaxCalculator } from "@/components/TaxCalculator"

export function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-start bg-muted/30 p-4 py-10 md:py-14">
      <TaxCalculator />
      <p className="mt-8 max-w-lg text-center text-xs text-muted-foreground">
        Press <kbd className="rounded border bg-muted px-1 py-0.5 font-mono">d</kbd> to toggle dark mode.
        This tool is illustrative only; confirm with a qualified tax adviser or official guidance.
      </p>
    </div>
  )
}

export default App
