# Tax Back - Vietnam PIT Refund Calculator

A clean React + TypeScript calculator for estimating **Vietnam Personal Income Tax (PIT/TNCN)** and potential refund amount.

The app supports monthly/yearly mode, progressive tax calculation, dependent deductions, and bilingual UI (English/Vietnamese).

## Features

- Real-time PIT calculation (no submit button needed)
- Vietnam progressive PIT brackets (marginal calculation)
- Inputs:
  - Salary
  - Number of dependents
  - Insurance amount (optional)
  - Tax already paid (optional)
- Output summary:
  - Taxable income
  - Total deductions
  - Tax payable
  - Tax paid
  - Refund / additional amount due
- Number formatting with Vietnamese grouping
- Language toggle: `EN` / `VI`
- Built with Tailwind + shadcn/ui components

## Tech Stack

- React (functional components + hooks)
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

## Project Structure

- `src/components/TaxCalculator.tsx` - Main calculator UI
- `src/utils/tax.ts` - Tax logic and formatting helpers
- `src/i18n/*` - Lightweight localization (EN/VI)

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Start development server

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Type check

```bash
npm run typecheck
```

## Tax Logic Notes

- Personal deduction: `11,000,000 VND / month`
- Dependent deduction: `4,400,000 VND / dependent / month`
- Uses Vietnam progressive PIT brackets in marginal form
- Yearly mode annualizes deductions and bracket limits

## Important Disclaimer

- This project is an **educational/reference tool** for quick estimation.
- Source code and content were **generated with AI assistance**.
- I (the repository owner) **do not claim this as legal/tax advice** and do not assume legal liability for tax decisions made using this calculator.
- Always verify with official regulations and/or a qualified tax professional before filing taxes.
