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
import { useI18n } from "@/i18n/use-i18n"
import {
  type CalculationPeriod,
  calculateVietnamPit,
  formatGroupedIntegerInput,
  formatVnd,
  parseGroupedInteger,
  PERSONAL_DEDUCTION_MONTHLY,
  DEPENDENT_DEDUCTION_MONTHLY,
} from "@/utils/tax"

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
      <span
        className={["font-mono text-sm tabular-nums", valueClassName]
          .filter(Boolean)
          .join(" ")}
      >
        {value}
      </span>
    </div>
  )
}

export function TaxCalculator() {
  const { t, language, setLanguage } = useI18n()
  const [period, setPeriod] = React.useState<CalculationPeriod>("monthly")
  const [salary, setSalary] = React.useState("")
  const [dependents, setDependents] = React.useState("")
  const [taxPaid, setTaxPaid] = React.useState("")
  const [insurance, setInsurance] = React.useState("")

  const salaryNum = parseGroupedInteger(salary)
  const dependentsNum = parseGroupedInteger(dependents)
  const taxPaidNum = parseGroupedInteger(taxPaid)
  const insuranceNum = parseGroupedInteger(insurance)

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

  const salaryLabel =
    period === "monthly" ? t("tax.salaryMonthly") : t("tax.salaryAnnual")
  const insuranceLabel =
    period === "monthly" ? t("tax.insuranceMonthly") : t("tax.insuranceAnnual")
  const taxPaidLabel =
    period === "monthly" ? t("tax.taxPaidMonthly") : t("tax.taxPaidAnnual")

  const optionalParen = ` (${t("tax.optionalInParens")})`

  const deductionTooltip =
    period === "monthly"
      ? t("tax.deductionTooltipMonthly", {
          personal: formatVnd(PERSONAL_DEDUCTION_MONTHLY),
          dependent: formatVnd(DEPENDENT_DEDUCTION_MONTHLY),
        })
      : t("tax.deductionTooltipYearly", {
          personal: formatVnd(PERSONAL_DEDUCTION_MONTHLY * 12),
          dependent: formatVnd(DEPENDENT_DEDUCTION_MONTHLY * 12),
        })

  const resultsPeriodWord =
    period === "monthly" ? t("tax.periodMonth") : t("tax.periodYear")
  const resultsHeading = t("tax.results", { period: resultsPeriodWord })

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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <CardTitle>{t("tax.title")}</CardTitle>
            <CardDescription>{t("tax.description")}</CardDescription>
          </div>
          <div
            className="flex shrink-0 items-center gap-1 self-start rounded-lg border border-border bg-muted/40 p-0.5"
            role="group"
            aria-label={t("tax.langAria")}
          >
            <Button
              type="button"
              size="sm"
              variant={language === "en" ? "default" : "ghost"}
              className="h-7 px-2.5 text-xs"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
            >
              {t("tax.langEn")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={language === "vi" ? "default" : "ghost"}
              className="h-7 px-2.5 text-xs"
              onClick={() => setLanguage("vi")}
              aria-pressed={language === "vi"}
            >
              {t("tax.langVi")}
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            type="button"
            size="sm"
            variant={period === "monthly" ? "default" : "outline"}
            onClick={() => setPeriod("monthly")}
            aria-pressed={period === "monthly"}
          >
            {t("tax.periodMonthly")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={period === "yearly" ? "default" : "outline"}
            onClick={() => setPeriod("yearly")}
            aria-pressed={period === "yearly"}
          >
            {t("tax.periodYearly")}
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
            placeholder={
              period === "monthly"
                ? t("tax.placeholderSalaryMonthly")
                : t("tax.placeholderSalaryAnnual")
            }
            value={salary}
            onChange={(e) =>
              setSalary(formatGroupedIntegerInput(e.target.value))
            }
            aria-invalid={Number.isNaN(salaryNum) && salary.trim() !== ""}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="dependents">{t("tax.dependents")}</Label>
          <Input
            id="dependents"
            inputMode="numeric"
            autoComplete="off"
            placeholder={t("tax.placeholderZero")}
            value={dependents}
            onChange={(e) =>
              setDependents(formatGroupedIntegerInput(e.target.value))
            }
            aria-invalid={
              Number.isNaN(dependentsNum) && dependents.trim() !== ""
            }
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="insurance">
            {insuranceLabel}
            {optionalParen}
          </Label>
          <Input
            id="insurance"
            inputMode="decimal"
            autoComplete="off"
            placeholder={t("tax.placeholderZero")}
            value={insurance}
            onChange={(e) =>
              setInsurance(formatGroupedIntegerInput(e.target.value))
            }
            aria-invalid={Number.isNaN(insuranceNum) && insurance.trim() !== ""}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="taxPaid">
            {taxPaidLabel}
            {optionalParen}
          </Label>
          <Input
            id="taxPaid"
            inputMode="decimal"
            autoComplete="off"
            placeholder={t("tax.placeholderZero")}
            value={taxPaid}
            onChange={(e) =>
              setTaxPaid(formatGroupedIntegerInput(e.target.value))
            }
            aria-invalid={Number.isNaN(taxPaidNum) && taxPaid.trim() !== ""}
          />
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex flex-col items-stretch gap-4 pt-2 pb-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>{resultsHeading}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={t("tax.ariaDeductions")}
              >
                <Info className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-balance">
              {deductionTooltip}
            </TooltipContent>
          </Tooltip>
        </div>

        {hasInvalid ? (
          <p className="text-sm text-destructive">{t("tax.invalidInput")}</p>
        ) : breakdown ? (
          <div className="grid gap-3">
            <SummaryRow
              label={t("tax.taxableIncome")}
              value={formatVnd(breakdown.taxableIncome)}
            />
            <SummaryRow
              label={t("tax.totalDeductions")}
              value={formatVnd(breakdown.totalDeductions)}
            />
            <div className="grid gap-1 pl-2 text-xs text-muted-foreground">
              <div className="flex justify-between gap-2">
                <span>{t("tax.subPersonal")}</span>
                <span className="font-mono tabular-nums">
                  {formatVnd(breakdown.personalDeduction)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span>{t("tax.subDependents")}</span>
                <span className="font-mono tabular-nums">
                  {formatVnd(breakdown.dependentDeduction)}
                </span>
              </div>
            </div>
            <Separator />
            <SummaryRow
              label={t("tax.taxPayable")}
              value={formatVnd(breakdown.taxPayable)}
            />
            <SummaryRow
              label={t("tax.taxPaid")}
              value={formatVnd(breakdown.taxPaid)}
            />
            <Separator />
            <SummaryRow
              label={t("tax.refundOrDue")}
              value={
                breakdown.refund === 0
                  ? formatVnd(0)
                  : `${breakdown.refund > 0 ? "+" : "−"}${formatVnd(Math.abs(breakdown.refund))}`
              }
              valueClassName={`font-medium ${refundTone}`}
            />
            {breakdown.refund > 0 && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                {t("tax.refundPositive")}
              </p>
            )}
            {breakdown.refund < 0 && (
              <p className="text-xs text-destructive">{t("tax.refundNegative")}</p>
            )}
          </div>
        ) : null}
      </CardFooter>
    </Card>
  )
}
