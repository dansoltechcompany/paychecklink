import type { UkNation } from "../types";

/** Simplified UK PAYE / NI estimates with nation-specific income tax bands */

function progressive(
  income: number,
  brackets: { upTo: number; rate: number }[]
): number {
  if (income <= 0) return 0;
  let tax = 0;
  let prev = 0;
  for (const { upTo, rate } of brackets) {
    const slice = Math.min(income, upTo) - prev;
    if (slice <= 0) break;
    tax += slice * rate;
    prev = upTo;
  }
  return tax;
}

const PERSONAL_ALLOWANCE_FULL = 12570;
const PA_TAPER_START = 100000;
const PA_TAPER_END = 125140;

/** Personal Allowance shrinks £1 for every £2 over £100k */
export function ukPersonalAllowance(annualGross: number): number {
  if (annualGross <= PA_TAPER_START) return PERSONAL_ALLOWANCE_FULL;
  if (annualGross >= PA_TAPER_END) return 0;
  const reduction = Math.floor((annualGross - PA_TAPER_START) / 2);
  return Math.max(0, PERSONAL_ALLOWANCE_FULL - reduction);
}

/** England / Wales / NI taxable-income bands (after personal allowance) */
const RUK_BANDS = [
  { upTo: 37700, rate: 0.2 },
  { upTo: 125140 - PERSONAL_ALLOWANCE_FULL, rate: 0.4 },
  { upTo: Infinity, rate: 0.45 },
];

/** Scotland taxable-income bands (simplified 2025/26 style) */
const SCOTLAND_BANDS = [
  { upTo: 2306, rate: 0.19 },
  { upTo: 13991, rate: 0.2 },
  { upTo: 31092, rate: 0.21 },
  { upTo: 62430, rate: 0.42 },
  { upTo: 125140 - PERSONAL_ALLOWANCE_FULL, rate: 0.45 },
  { upTo: Infinity, rate: 0.48 },
];

export function calculateUkTax(
  annualGross: number,
  nation: UkNation = "england"
): {
  incomeTax: number;
  nationalInsurance: number;
} {
  const allowance = ukPersonalAllowance(annualGross);
  const taxable = Math.max(0, annualGross - allowance);

  const bands =
    nation === "scotland" ? SCOTLAND_BANDS : RUK_BANDS;
  const incomeTax = progressive(taxable, bands);

  // Employee Class 1 NI (same UK-wide thresholds)
  const niPrimaryThreshold = 12570;
  const niUpper = 50270;
  let nationalInsurance = 0;
  if (annualGross > niPrimaryThreshold) {
    const basic = Math.min(annualGross, niUpper) - niPrimaryThreshold;
    nationalInsurance += Math.max(0, basic) * 0.08;
    if (annualGross > niUpper) {
      nationalInsurance += (annualGross - niUpper) * 0.02;
    }
  }

  return { incomeTax, nationalInsurance };
}

export const UK_TAX_SOURCE =
  "HMRC Income Tax bands + Class 1 NI (simplified; Scotland uses Scottish rates)";
