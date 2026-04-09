/** Vietnam PIT progressive brackets (monthly taxable income, VND). Marginal rates. */
export const VIETNAM_MONTHLY_BRACKETS: readonly TaxBracketTier[] = [
  { limit: 5_000_000, rate: 0.05 },
  { limit: 10_000_000, rate: 0.1 },
  { limit: 18_000_000, rate: 0.15 },
  { limit: 32_000_000, rate: 0.2 },
  { limit: 52_000_000, rate: 0.25 },
  { limit: 80_000_000, rate: 0.3 },
  { limit: Infinity, rate: 0.35 },
] as const

export const PERSONAL_DEDUCTION_MONTHLY = 11_000_000
export const DEPENDENT_DEDUCTION_MONTHLY = 4_400_000

export type CalculationPeriod = "monthly" | "yearly"

export interface TaxBracketTier {
  limit: number
  rate: number
}

export interface TaxCalculatorInputs {
  salary: number
  dependents: number
  taxPaid: number
  insurance: number
  period: CalculationPeriod
}

export interface TaxBreakdown {
  period: CalculationPeriod
  taxableIncome: number
  personalDeduction: number
  dependentDeduction: number
  totalDeductions: number
  taxPayable: number
  taxPaid: number
  /** Positive = refund due; negative = additional tax owed. */
  refund: number
}

function clampNonNegative(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0
  return n
}

function clampNonNegativeInt(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.floor(n)
}

/** Brackets for yearly mode: same marginal structure with limits × 12. */
export function getBracketsForPeriod(period: CalculationPeriod): TaxBracketTier[] {
  if (period === "monthly") {
    return VIETNAM_MONTHLY_BRACKETS.map((b) => ({
      limit: b.limit,
      rate: b.rate,
    }))
  }
  return VIETNAM_MONTHLY_BRACKETS.map((b) => ({
    limit: b.limit === Infinity ? Infinity : b.limit * 12,
    rate: b.rate,
  }))
}

/**
 * Marginal (progressive) tax on positive taxable income using ordered brackets.
 * Each tier's `limit` is the inclusive upper bound of that band (last tier unbounded).
 */
export function computeProgressiveTax(taxableIncome: number, brackets: readonly TaxBracketTier[]): number {
  const t = clampNonNegative(taxableIncome)
  if (t <= 0) return 0

  let tax = 0
  let lower = 0

  for (const { limit, rate } of brackets) {
    const upper = limit
    if (t <= lower) break
    const slice = Math.min(t, upper) - lower
    if (slice > 0) {
      tax += slice * rate
    }
    lower = upper
    if (t <= upper) break
  }

  return Math.round(tax)
}

export function getDeductions(period: CalculationPeriod, dependents: number): {
  personalDeduction: number
  dependentDeduction: number
} {
  const d = clampNonNegativeInt(dependents)
  const months = period === "yearly" ? 12 : 1
  const personalDeduction = PERSONAL_DEDUCTION_MONTHLY * months
  const dependentDeduction = DEPENDENT_DEDUCTION_MONTHLY * d * months
  return { personalDeduction, dependentDeduction }
}

export function calculateVietnamPit(inputs: TaxCalculatorInputs): TaxBreakdown {
  const salary = clampNonNegative(inputs.salary)
  const insurance = clampNonNegative(inputs.insurance)
  const taxPaid = clampNonNegative(inputs.taxPaid)
  const dependents = clampNonNegativeInt(inputs.dependents)
  const { personalDeduction, dependentDeduction } = getDeductions(inputs.period, dependents)

  const grossAfterInsurance = salary - insurance
  const taxableIncome = Math.max(0, grossAfterInsurance - personalDeduction - dependentDeduction)
  const totalDeductions = personalDeduction + dependentDeduction

  const brackets = getBracketsForPeriod(inputs.period)
  const taxPayable = computeProgressiveTax(taxableIncome, brackets)
  const refund = Math.round(taxPaid - taxPayable)

  return {
    period: inputs.period,
    taxableIncome,
    personalDeduction,
    dependentDeduction,
    totalDeductions,
    taxPayable,
    taxPaid,
    refund,
  }
}

export function formatVnd(amount: number): string {
  const n = Math.round(amount)
  const formatted = new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(n)
  return `${formatted} ₫`
}

const groupedIntegerFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 0,
})

/** Formats raw input to vi-VN grouped digits (e.g. 25.000.000). Strips non-digits first. */
export function formatGroupedIntegerInput(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  if (digits === "") return ""
  const n = Number.parseInt(digits, 10)
  if (!Number.isFinite(n)) return ""
  return groupedIntegerFormatter.format(n)
}

/** Parses grouped integer input to a non-negative integer; empty → 0. */
export function parseGroupedInteger(raw: string): number {
  const digits = raw.replace(/\D/g, "")
  if (digits === "") return 0
  const n = Number.parseInt(digits, 10)
  if (!Number.isFinite(n)) return NaN
  return Math.max(0, n)
}
