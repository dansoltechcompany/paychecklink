import type { FilingStatus, PayFrequency } from "../types";
import { PAY_PERIODS } from "../types";

/**
 * IRS Publication 15-T style federal income tax WITHHOLDING (percentage method).
 * This matches employer paycheck withholding more closely than year-end liability brackets alone.
 * Tables aligned to 2026 planning year — update annually from IRS Pub 15-T.
 */

/** Tentative withholding adjustment subtracted when Step 2 is NOT checked (annual) */
const STEP2_UNCHECKED_ADJUSTMENT: Record<FilingStatus, number> = {
  single: 15700,
  married: 31400,
  head: 23550,
};

/** Annual percentage-method tax brackets (Pub 15-T Schedule) */
const WITHHOLDING_BRACKETS: Record<
  FilingStatus,
  { upTo: number; rate: number; base: number }[]
> = {
  single: [
    { upTo: 6400, rate: 0, base: 0 },
    { upTo: 18325, rate: 0.1, base: 0 },
    { upTo: 54875, rate: 0.12, base: 1192.5 },
    { upTo: 109750, rate: 0.22, base: 5578.5 },
    { upTo: 203700, rate: 0.24, base: 17651 },
    { upTo: 256925, rate: 0.32, base: 40199 },
    { upTo: 632750, rate: 0.35, base: 57231 },
    { upTo: Infinity, rate: 0.37, base: 188769.75 },
  ],
  married: [
    { upTo: 17100, rate: 0, base: 0 },
    { upTo: 40950, rate: 0.1, base: 0 },
    { upTo: 112050, rate: 0.12, base: 2385 },
    { upTo: 221750, rate: 0.22, base: 10917 },
    { upTo: 409650, rate: 0.24, base: 35051 },
    { upTo: 516100, rate: 0.32, base: 80147 },
    { upTo: 760400, rate: 0.35, base: 114211 },
    { upTo: Infinity, rate: 0.37, base: 199716 },
  ],
  head: [
    { upTo: 13600, rate: 0, base: 0 },
    { upTo: 30450, rate: 0.1, base: 0 },
    { upTo: 78050, rate: 0.12, base: 1685 },
    { upTo: 112700, rate: 0.22, base: 7397 },
    { upTo: 206650, rate: 0.24, base: 15020 },
    { upTo: 259900, rate: 0.32, base: 37568 },
    { upTo: 635700, rate: 0.35, base: 54608 },
    { upTo: Infinity, rate: 0.37, base: 186138 },
  ],
};

/** When Step 2 is checked — dual-income / multiple-jobs schedule (no adjustment) */
const STEP2_CHECKED_BRACKETS: Record<
  FilingStatus,
  { upTo: number; rate: number; base: number }[]
> = {
  single: [
    { upTo: 7465, rate: 0, base: 0 },
    { upTo: 13375, rate: 0.1, base: 0 },
    { upTo: 31150, rate: 0.12, base: 591 },
    { upTo: 58575, rate: 0.22, base: 2724 },
    { upTo: 105550, rate: 0.24, base: 8757.5 },
    { upTo: 132150, rate: 0.32, base: 20031.5 },
    { upTo: 320050, rate: 0.35, base: 28543.5 },
    { upTo: Infinity, rate: 0.37, base: 94288.5 },
  ],
  married: [
    { upTo: 14930, rate: 0, base: 0 },
    { upTo: 26750, rate: 0.1, base: 0 },
    { upTo: 62300, rate: 0.12, base: 1182 },
    { upTo: 117150, rate: 0.22, base: 5448 },
    { upTo: 211100, rate: 0.24, base: 17515 },
    { upTo: 264300, rate: 0.32, base: 40063 },
    { upTo: 640100, rate: 0.35, base: 57087 },
    { upTo: Infinity, rate: 0.37, base: 188577 },
  ],
  head: [
    { upTo: 11190, rate: 0, base: 0 },
    { upTo: 19420, rate: 0.1, base: 0 },
    { upTo: 43050, rate: 0.12, base: 823 },
    { upTo: 65525, rate: 0.22, base: 3658.6 },
    { upTo: 112500, rate: 0.24, base: 8603.1 },
    { upTo: 139100, rate: 0.32, base: 19877.1 },
    { upTo: 327000, rate: 0.35, base: 28389.1 },
    { upTo: Infinity, rate: 0.37, base: 94134.1 },
  ],
};

const SUPPLEMENTAL_RATE = 0.22;
const SUPPLEMENTAL_RATE_HIGH = 0.37;
const SUPPLEMENTAL_HIGH_THRESHOLD = 1_000_000;

function taxFromBracketTable(
  annualWage: number,
  brackets: { upTo: number; rate: number; base: number }[]
): number {
  if (annualWage <= 0) return 0;
  let prev = 0;
  for (const row of brackets) {
    if (annualWage <= row.upTo) {
      return row.base + (annualWage - prev) * row.rate;
    }
    prev = row.upTo;
  }
  const last = brackets[brackets.length - 1];
  return last.base + (annualWage - prev) * last.rate;
}

export interface FederalWithholdingInput {
  /** Taxable wages for FIT for the pay period (after pre-tax deductions that reduce FIT) */
  wagesPerPeriod: number;
  payFrequency: PayFrequency;
  filingStatus: FilingStatus;
  /** Form W-4 Step 2(c) — multiple jobs / spouse works */
  w4Step2?: boolean;
  /** Form W-4 Step 3 — annual dollar credit for dependents */
  w4DependentsCredit?: number;
  /** Form W-4 Step 4(a) — other income (annual) */
  w4OtherIncome?: number;
  /** Form W-4 Step 4(b) — deductions (annual) */
  w4Deductions?: number;
  /** Form W-4 Step 4(c) — extra withholding per period */
  w4ExtraWithholding?: number;
  /** Treat this period's bonus with supplemental flat rate */
  supplementalBonus?: number;
  useSupplementalRate?: boolean;
}

export interface FederalWithholdingResult {
  /** Federal income tax withheld for the pay period */
  perPeriod: number;
  annualized: number;
  method: "percentage" | "supplemental-blend";
}

/**
 * Calculate federal income tax withholding for one paycheck (Pub 15-T percentage method).
 */
export function calculateFederalWithholding(
  input: FederalWithholdingInput
): FederalWithholdingResult {
  const {
    wagesPerPeriod,
    payFrequency,
    filingStatus,
    w4Step2 = false,
    w4DependentsCredit = 0,
    w4OtherIncome = 0,
    w4Deductions = 0,
    w4ExtraWithholding = 0,
    supplementalBonus = 0,
    useSupplementalRate = false,
  } = input;

  const periods = PAY_PERIODS[payFrequency];

  let regularWages = wagesPerPeriod;
  let bonus = supplementalBonus;
  if (useSupplementalRate && bonus <= 0 && wagesPerPeriod > 0) {
    // caller may pass bonus separately; if not, no-op
  }

  // Optional: withhold bonus at supplemental rate, regular wages via percentage method
  let supplementalWithholding = 0;
  if (useSupplementalRate && bonus > 0) {
    const rate =
      bonus * periods > SUPPLEMENTAL_HIGH_THRESHOLD
        ? SUPPLEMENTAL_RATE_HIGH
        : SUPPLEMENTAL_RATE;
    supplementalWithholding = bonus * rate;
  } else if (bonus > 0) {
    regularWages += bonus;
    bonus = 0;
  }

  // Annualize
  let annualWages = regularWages * periods;
  annualWages += w4OtherIncome;
  annualWages = Math.max(0, annualWages - w4Deductions);

  if (!w4Step2) {
    annualWages = Math.max(
      0,
      annualWages - STEP2_UNCHECKED_ADJUSTMENT[filingStatus]
    );
  }

  const brackets = w4Step2
    ? STEP2_CHECKED_BRACKETS[filingStatus]
    : WITHHOLDING_BRACKETS[filingStatus];

  const annualTax = taxFromBracketTable(annualWages, brackets);
  let perPeriod = annualTax / periods;

  // Step 3 dependent credit (annual → per period)
  perPeriod = Math.max(0, perPeriod - w4DependentsCredit / periods);

  // Step 4(c)
  perPeriod += Math.max(0, w4ExtraWithholding);

  perPeriod += supplementalWithholding;

  return {
    perPeriod: Math.max(0, perPeriod),
    annualized: Math.max(0, perPeriod * periods),
    method:
      useSupplementalRate && supplementalBonus > 0
        ? "supplemental-blend"
        : "percentage",
  };
}

/** Flat supplemental rate helper for bonuses paid separately */
export function supplementalFederalRate(annualBonusTotal: number): number {
  return annualBonusTotal > SUPPLEMENTAL_HIGH_THRESHOLD
    ? SUPPLEMENTAL_RATE_HIGH
    : SUPPLEMENTAL_RATE;
}

export const FEDERAL_WITHHOLDING_SOURCE =
  "IRS Publication 15-T (Percentage Method) — updated for 2026 planning year";
