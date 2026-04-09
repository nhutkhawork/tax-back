import * as React from "react"
import { Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  type CalculationPeriod,
  calculateVietnamPit,
  formatVnd,
  PERSONAL_DEDUCTION_MONTHLY,
  DEPENDENT_DEDUCTION_MONTHLY,
} from "@/utils/tax"

function parseOptionalMoney(raw: string): number {
  const trimmed = raw.trim().replace(/\s/g, "")
  if (trimmed === "") return 0
  const n = Number.parseFloat(trimmed.replace(",", "."))
  if (!Number.isFinite(n)) return NaN
  return Math.max(0, n)
}

function parseDependents(raw: string): number {
  const trimmed = raw.trim()
  if (trimmed === "") return 0
  const n = Number.parseInt(trimmed, 10)
  if (!Number.isFinite(n)) return NaN
  return Math.max(0, Math.floor(n))
}

function SummaryRow({
  label,
  value,
  valueClassName,
}: {
  label: React.ReactNode
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={["font-mono text-sm tabular-nums", valueClassName].filter(Boolean).join(" ")}>
        {value}
      </span>
    </div>
  )
}

export function TaxCalculator() {
  const [period, setPeriod] = React.useState<CalculationPeriod>("monthly")
  const [salary, setSalary] = React.useState("")
  const [dependents, setDependents] = React.useState("")
  const [taxPaid, setTaxPaid] = React.useState("")
  const [insurance, setInsurance] = React.useState("")

  const salaryNum = parseOptionalMoney(salary)
  const dependentsNum = parseDependents(dependents)
  const taxPaidNum = parseOptionalMoney(taxPaid)
  const insuranceNum = parseOptionalMoney(insurance)

  const hasInvalid =
    Number.isNaN(salaryNum) ||
    Number.isNaN(dependentsNum) ||
    Number.isNaN(taxPaidNum) ||
    Number.isNaN(insuranceNum)

  const breakdown = React.useMemo(() => {
    if (hasInvalid) return null
    return calculateVietnamPit({
      salary: salaryNum,
      dependents: dependentsNum,
      taxPaid: taxPaidNum,
      insurance: insuranceNum,
      period,
    })
  }, [hasInvalid, salaryNum, dependentsNum, taxPaidNum, insuranceNum, period])

  const periodLabel = period === "monthly" ? "month" : "year"
  const salaryLabel = period === "monthly" ? "Monthly salary" : "Annual salary"
  const insuranceLabel = period === "monthly" ? "Insurance (monthly)" : "Insurance (annual)"
  const taxPaidLabel = period === "monthly" ? "Tax already paid (monthly)" : "Tax already paid (annual)"

  const deductionTooltip =
    period === "monthly"
      ? `Personal deduction: ${formatVnd(PERSONAL_DEDUCTION_MONTHLY)}/month. Dependent: ${formatVnd(DEPENDENT_DEDUCTION_MONTHLY)}/dependent/month (Circular 111/2013/TT-BTC).`
      : `Personal deduction: ${formatVnd(PERSONAL_DEDUCTION_MONTHLY * 12)}/year. Dependent: ${formatVnd(DEPENDENT_DEDUCTION_MONTHLY * 12)}/dependent/year (annualized from monthly amounts).`

  const refundTone =
    breakdown === null
      ? ""
      : breakdown.refund > 0
        ? "text-emerald-600 dark:text-emerald-400"
        : breakdown.refund < 0
          ? "text-destructive"
          : "text-foreground"

  return (
    <Card className="mx-auto w-full max-w-lg shadow-sm">
      <CardHeader className="border-b border-border/80 pb-4">
        <CardTitle>Vietnam PIT refund calculator</CardTitle>
        <CardDescription>
          Estimate taxable income, tax payable, and refund or balance due using progressive monthly
          brackets (simplified employment scenario).
        </CardDescription>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            type="button"
            size="sm"
            variant={period === "monthly" ? "default" : "outline"}
            onClick={() => setPeriod("monthly")}
            aria-pressed={period === "monthly"}
          >
            Monthly
          </Button>
          <Button
            type="button"
            size="sm"
            variant={period === "yearly" ? "default" : "outline"}
            onClick={() => setPeriod("yearly")}
            aria-pressed={period === "yearly"}
          >
            Yearly
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 pt-2">
        <div className="grid gap-2">
          <Label htmlFor="salary">{salaryLabel}</Label>
          <Input
            id="salary"
            inputMode="decimal"
            autoComplete="off"
            placeholder={period === "monthly" ? "e.g. 25000000" : "e.g. 300000000"}
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            aria-invalid={Number.isNaN(salaryNum) && salary.trim() !== ""}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="dependents">Number of dependents</Label>
          <Input
            id="dependents"
            inputMode="numeric"
            autoComplete="off"
            placeholder="0"
            value={dependents}
            onChange={(e) => setDependents(e.target.value.replace(/\D/g, ""))}
            aria-invalid={Number.isNaN(dependentsNum) && dependents.trim() !== ""}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="insurance">{insuranceLabel} (optional)</Label>
          <Input
            id="insurance"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0"
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
            aria-invalid={Number.isNaN(insuranceNum) && insurance.trim() !== ""}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="taxPaid">{taxPaidLabel} (optional)</Label>
          <Input
            id="taxPaid"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0"
            value={taxPaid}
            onChange={(e) => setTaxPaid(e.target.value)}
            aria-invalid={Number.isNaN(taxPaidNum) && taxPaid.trim() !== ""}
          />
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex flex-col items-stretch gap-4 pt-2 pb-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>Results ({periodLabel})</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="About deductions"
              >
                <Info className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-balance">{deductionTooltip}</TooltipContent>
          </Tooltip>
        </div>

        {hasInvalid ? (
          <p className="text-sm text-destructive">Enter valid non-negative numbers.</p>
        ) : breakdown ? (
          <div className="grid gap-3">
            <SummaryRow label="Taxable income" value={formatVnd(breakdown.taxableIncome)} />
            <SummaryRow label="Total deductions" value={formatVnd(breakdown.totalDeductions)} />
            <div className="grid gap-1 pl-2 text-xs text-muted-foreground">
              <div className="flex justify-between gap-2">
                <span>Personal</span>
                <span className="font-mono tabular-nums">{formatVnd(breakdown.personalDeduction)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span>Dependents</span>
                <span className="font-mono tabular-nums">{formatVnd(breakdown.dependentDeduction)}</span>
              </div>
            </div>
            <Separator />
            <SummaryRow label="Tax payable" value={formatVnd(breakdown.taxPayable)} />
            <SummaryRow label="Tax paid" value={formatVnd(breakdown.taxPaid)} />
            <Separator />
            <SummaryRow
              label="Refund / (amount due)"
              value={
                breakdown.refund === 0
                  ? formatVnd(0)
                  : `${breakdown.refund > 0 ? "+" : "−"}${formatVnd(Math.abs(breakdown.refund))}`
              }
              valueClassName={`font-medium ${refundTone}`}
            />
            {breakdown.refund > 0 && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">You may be due a refund.</p>
            )}
            {breakdown.refund < 0 && (
              <p className="text-xs text-destructive">Additional tax may be owed.</p>
            )}
          </div>
        ) : null}
      </CardFooter>
    </Card>
  )
}
