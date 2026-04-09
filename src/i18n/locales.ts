export type AppLanguage = "en" | "vi"

export const en = {
  "app.title": "Tax Back — Vietnam PIT",
  "app.footerPre": "Press ",
  "app.footerPost":
    " to toggle dark mode. This tool is illustrative only; confirm with a qualified tax adviser or official guidance.",
  "app.footerKey": "d",

  "tax.title": "Vietnam PIT refund calculator",
  "tax.description":
    "Estimate taxable income, tax payable, and refund or balance due using progressive monthly brackets (simplified employment scenario).",
  "tax.langAria": "Language",
  "tax.langEn": "EN",
  "tax.langVi": "VI",

  "tax.periodMonthly": "Monthly",
  "tax.periodYearly": "Yearly",

  "tax.salaryMonthly": "Monthly salary",
  "tax.salaryAnnual": "Annual salary",

  "tax.dependents": "Number of dependents",

  "tax.insuranceMonthly": "Insurance (monthly)",
  "tax.insuranceAnnual": "Insurance (annual)",

  "tax.taxPaidMonthly": "Tax already paid (monthly)",
  "tax.taxPaidAnnual": "Tax already paid (annual)",

  "tax.optionalInParens": "optional",

  "tax.placeholderSalaryMonthly": "e.g. 25.000.000",
  "tax.placeholderSalaryAnnual": "e.g. 300.000.000",
  "tax.placeholderZero": "0",

  "tax.results": "Results ({period})",
  "tax.periodMonth": "month",
  "tax.periodYear": "year",

  "tax.ariaDeductions": "About deductions",

  "tax.invalidInput": "Enter valid non-negative numbers.",

  "tax.taxableIncome": "Taxable income",
  "tax.totalDeductions": "Total deductions",
  "tax.subPersonal": "Personal",
  "tax.subDependents": "Dependents",

  "tax.taxPayable": "Tax payable",
  "tax.taxPaid": "Tax paid",
  "tax.refundOrDue": "Refund / (amount due)",

  "tax.refundPositive": "You may be due a refund.",
  "tax.refundNegative": "Additional tax may be owed.",

  "tax.deductionTooltipMonthly":
    "Personal deduction (per month): {personal}. Dependent (per person, per month): {dependent}. (Circular 111/2013/TT-BTC.)",
  "tax.deductionTooltipYearly":
    "Personal deduction (per year): {personal}. Dependent (per person, per year): {dependent}. (Annualized from monthly amounts.)",
} as const

export type MessageKey = keyof typeof en

export const vi: Record<MessageKey, string> = {
  "app.title": "Tax Back — TNCN Việt Nam",
  "app.footerPre": "Nhấn ",
  "app.footerPost":
    " để bật/tắt chế độ tối. Công cụ chỉ mang tính minh họa; vui lòng đối chiếu với cơ quan thuế hoặc tư vấn chuyên môn.",
  "app.footerKey": "d",

  "tax.title": "Máy tính hoàn thuế TNCN Việt Nam",
  "tax.description":
    "Ước tính thu nhập chịu thuế, thuế phải nộp và hoàn thuế hoặc số phải nộp thêm theo biểu thuế lũy tiến từng phần theo tháng (kịch bản lao động đơn giản).",
  "tax.langAria": "Ngôn ngữ",
  "tax.langEn": "EN",
  "tax.langVi": "VI",

  "tax.periodMonthly": "Hàng tháng",
  "tax.periodYearly": "Hàng năm",

  "tax.salaryMonthly": "Lương hàng tháng",
  "tax.salaryAnnual": "Lương cả năm",

  "tax.dependents": "Số người phụ thuộc",

  "tax.insuranceMonthly": "Bảo hiểm (tháng)",
  "tax.insuranceAnnual": "Bảo hiểm (năm)",

  "tax.taxPaidMonthly": "Thuế đã nộp (tháng)",
  "tax.taxPaidAnnual": "Thuế đã nộp (năm)",

  "tax.optionalInParens": "tuỳ chọn",

  "tax.placeholderSalaryMonthly": "vd: 25.000.000",
  "tax.placeholderSalaryAnnual": "vd: 300.000.000",
  "tax.placeholderZero": "0",

  "tax.results": "Kết quả ({period})",
  "tax.periodMonth": "tháng",
  "tax.periodYear": "năm",

  "tax.ariaDeductions": "Giải thích khấu trừ",

  "tax.invalidInput": "Nhập số hợp lệ (không âm).",

  "tax.taxableIncome": "Thu nhập chịu thuế",
  "tax.totalDeductions": "Tổng khấu trừ",
  "tax.subPersonal": "Bản thân",
  "tax.subDependents": "Người phụ thuộc",

  "tax.taxPayable": "Thuế phải nộp",
  "tax.taxPaid": "Thuế đã nộp",
  "tax.refundOrDue": "Hoàn thuế / (phải nộp thêm)",

  "tax.refundPositive": "Bạn có thể được hoàn thuế.",
  "tax.refundNegative": "Có thể phải nộp thêm thuế.",

  "tax.deductionTooltipMonthly":
    "Khấu trừ bản thân (mỗi tháng): {personal}. Người phụ thuộc (mỗi người mỗi tháng): {dependent}. (Thông tư 111/2013/TT-BTC.)",
  "tax.deductionTooltipYearly":
    "Khấu trừ bản thân (mỗi năm): {personal}. Người phụ thuộc (mỗi người mỗi năm): {dependent}. (Quy đổi từ mức theo tháng.)",
}
