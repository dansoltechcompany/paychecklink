import type { FilingStatus, StateCode } from "../types";

type Bracket = { upTo: number; rate: number };

type StateTaxConfig =
  | { type: "none" }
  | { type: "flat"; rate: number }
  | {
      type: "progressive";
      brackets: Bracket[];
      /** Override brackets by filing status (e.g. CA Schedule X/Y/Z) */
      bracketsByStatus?: Partial<Record<FilingStatus, Bracket[]>>;
      standardDeduction?: Record<FilingStatus, number>;
    };

/**
 * FTB 2025 Schedule X — Single / Married filing separately
 * (tax year used for 2026 withholding estimates until FTB publishes 2026 schedules)
 */
const CA_SCHEDULE_X: Bracket[] = [
  { upTo: 11079, rate: 0.01 },
  { upTo: 26264, rate: 0.02 },
  { upTo: 41452, rate: 0.04 },
  { upTo: 57542, rate: 0.06 },
  { upTo: 72724, rate: 0.08 },
  { upTo: 371479, rate: 0.093 },
  { upTo: 445771, rate: 0.103 },
  { upTo: 742953, rate: 0.113 },
  { upTo: Infinity, rate: 0.123 },
];

/** FTB 2025 Schedule Y — Married filing jointly / Qualifying widow(er) */
const CA_SCHEDULE_Y: Bracket[] = [
  { upTo: 22158, rate: 0.01 },
  { upTo: 52528, rate: 0.02 },
  { upTo: 82904, rate: 0.04 },
  { upTo: 115084, rate: 0.06 },
  { upTo: 145448, rate: 0.08 },
  { upTo: 742958, rate: 0.093 },
  { upTo: 891542, rate: 0.103 },
  { upTo: 1485906, rate: 0.113 },
  { upTo: Infinity, rate: 0.123 },
];

/** FTB 2025 Schedule Z — Head of household */
const CA_SCHEDULE_Z: Bracket[] = [
  { upTo: 22173, rate: 0.01 },
  { upTo: 52530, rate: 0.02 },
  { upTo: 67716, rate: 0.04 },
  { upTo: 83805, rate: 0.06 },
  { upTo: 98990, rate: 0.08 },
  { upTo: 505208, rate: 0.093 },
  { upTo: 606251, rate: 0.103 },
  { upTo: 1010417, rate: 0.113 },
  { upTo: Infinity, rate: 0.123 },
];

/** Simplified 2026 state income tax configs */
export const STATE_TAX: Record<StateCode, StateTaxConfig> = {
  AL: { type: "progressive", brackets: [{ upTo: 500, rate: 0.02 }, { upTo: 3000, rate: 0.04 }, { upTo: Infinity, rate: 0.05 }] },
  AK: { type: "none" },
  AZ: { type: "flat", rate: 0.025 },
  AR: { type: "progressive", brackets: [{ upTo: 4300, rate: 0.02 }, { upTo: 8500, rate: 0.04 }, { upTo: Infinity, rate: 0.044 }] },
  CA: {
    type: "progressive",
    brackets: CA_SCHEDULE_X,
    bracketsByStatus: {
      single: CA_SCHEDULE_X,
      married: CA_SCHEDULE_Y,
      head: CA_SCHEDULE_Z,
    },
    // FTB 2025 standard deduction (Form 540)
    standardDeduction: {
      single: 5706,
      married: 11412,
      head: 11412,
    },
  },
  CO: { type: "flat", rate: 0.044 },
  CT: { type: "progressive", brackets: [{ upTo: 10000, rate: 0.02 }, { upTo: 50000, rate: 0.045 }, { upTo: 100000, rate: 0.055 }, { upTo: 200000, rate: 0.06 }, { upTo: 250000, rate: 0.065 }, { upTo: 500000, rate: 0.069 }, { upTo: Infinity, rate: 0.0699 }] },
  DE: { type: "progressive", brackets: [{ upTo: 2000, rate: 0.0 }, { upTo: 5000, rate: 0.022 }, { upTo: 10000, rate: 0.039 }, { upTo: 20000, rate: 0.048 }, { upTo: 25000, rate: 0.052 }, { upTo: 60000, rate: 0.0555 }, { upTo: Infinity, rate: 0.066 }] },
  FL: { type: "none" },
  GA: { type: "flat", rate: 0.0539 },
  HI: { type: "progressive", brackets: [{ upTo: 2400, rate: 0.014 }, { upTo: 4800, rate: 0.032 }, { upTo: 9600, rate: 0.055 }, { upTo: 14400, rate: 0.064 }, { upTo: 19200, rate: 0.068 }, { upTo: 24000, rate: 0.072 }, { upTo: 36000, rate: 0.076 }, { upTo: 48000, rate: 0.079 }, { upTo: 150000, rate: 0.0825 }, { upTo: 175000, rate: 0.09 }, { upTo: 200000, rate: 0.1 }, { upTo: Infinity, rate: 0.11 }] },
  ID: { type: "flat", rate: 0.058 },
  IL: { type: "flat", rate: 0.0495 },
  IN: { type: "flat", rate: 0.0305 },
  IA: { type: "flat", rate: 0.038 },
  KS: { type: "progressive", brackets: [{ upTo: 15000, rate: 0.052 }, { upTo: 30000, rate: 0.0558 }, { upTo: Infinity, rate: 0.057 }] },
  KY: { type: "flat", rate: 0.04 },
  LA: { type: "progressive", brackets: [{ upTo: 12500, rate: 0.0185 }, { upTo: 50000, rate: 0.035 }, { upTo: Infinity, rate: 0.0425 }] },
  ME: { type: "progressive", brackets: [{ upTo: 26050, rate: 0.058 }, { upTo: 61600, rate: 0.0675 }, { upTo: Infinity, rate: 0.0715 }] },
  MD: { type: "progressive", brackets: [{ upTo: 1000, rate: 0.02 }, { upTo: 2000, rate: 0.03 }, { upTo: 3000, rate: 0.04 }, { upTo: 100000, rate: 0.0475 }, { upTo: 125000, rate: 0.05 }, { upTo: 150000, rate: 0.0525 }, { upTo: 250000, rate: 0.055 }, { upTo: Infinity, rate: 0.0575 }] },
  MA: { type: "flat", rate: 0.05 },
  MI: { type: "flat", rate: 0.0425 },
  MN: { type: "progressive", brackets: [{ upTo: 31690, rate: 0.0535 }, { upTo: 104090, rate: 0.068 }, { upTo: 193240, rate: 0.0785 }, { upTo: Infinity, rate: 0.0985 }] },
  MS: { type: "progressive", brackets: [{ upTo: 5000, rate: 0.0 }, { upTo: 10000, rate: 0.03 }, { upTo: Infinity, rate: 0.05 }] },
  MO: { type: "progressive", brackets: [{ upTo: 1207, rate: 0.0 }, { upTo: 2414, rate: 0.02 }, { upTo: 3621, rate: 0.025 }, { upTo: 4828, rate: 0.03 }, { upTo: 6035, rate: 0.035 }, { upTo: 7242, rate: 0.04 }, { upTo: 8449, rate: 0.045 }, { upTo: Infinity, rate: 0.048 }] },
  MT: { type: "progressive", brackets: [{ upTo: 20500, rate: 0.047 }, { upTo: Infinity, rate: 0.059 }] },
  NE: { type: "progressive", brackets: [{ upTo: 3860, rate: 0.0246 }, { upTo: 23000, rate: 0.0351 }, { upTo: 37000, rate: 0.0501 }, { upTo: Infinity, rate: 0.0584 }] },
  NV: { type: "none" },
  NH: { type: "none" },
  NJ: { type: "progressive", brackets: [{ upTo: 20000, rate: 0.014 }, { upTo: 35000, rate: 0.0175 }, { upTo: 40000, rate: 0.035 }, { upTo: 75000, rate: 0.05525 }, { upTo: 500000, rate: 0.0637 }, { upTo: 1000000, rate: 0.0897 }, { upTo: Infinity, rate: 0.1075 }] },
  NM: { type: "progressive", brackets: [{ upTo: 5500, rate: 0.017 }, { upTo: 11000, rate: 0.032 }, { upTo: 16000, rate: 0.047 }, { upTo: 210000, rate: 0.049 }, { upTo: Infinity, rate: 0.059 }] },
  NY: {
    type: "progressive",
    brackets: [
      { upTo: 8500, rate: 0.04 },
      { upTo: 11700, rate: 0.045 },
      { upTo: 13900, rate: 0.0525 },
      { upTo: 80650, rate: 0.055 },
      { upTo: 215400, rate: 0.06 },
      { upTo: 1077550, rate: 0.0685 },
      { upTo: 5000000, rate: 0.0965 },
      { upTo: 25000000, rate: 0.103 },
      { upTo: Infinity, rate: 0.109 },
    ],
    // NY State standard deduction (2025, Form IT-201)
    standardDeduction: {
      single: 8000,
      married: 16050,
      head: 11200,
    },
  },
  NC: { type: "flat", rate: 0.045 },
  ND: { type: "progressive", brackets: [{ upTo: 44725, rate: 0.0195 }, { upTo: 225975, rate: 0.025 }, { upTo: Infinity, rate: 0.0259 }] },
  OH: { type: "progressive", brackets: [{ upTo: 26050, rate: 0.0 }, { upTo: 100000, rate: 0.0275 }, { upTo: Infinity, rate: 0.035 }] },
  OK: { type: "progressive", brackets: [{ upTo: 1000, rate: 0.0025 }, { upTo: 2500, rate: 0.0075 }, { upTo: 3750, rate: 0.0125 }, { upTo: 4900, rate: 0.0175 }, { upTo: 7200, rate: 0.0225 }, { upTo: Infinity, rate: 0.0475 }] },
  OR: { type: "progressive", brackets: [{ upTo: 4050, rate: 0.0475 }, { upTo: 10200, rate: 0.0675 }, { upTo: 125000, rate: 0.0875 }, { upTo: Infinity, rate: 0.099 }] },
  PA: { type: "flat", rate: 0.0307 },
  RI: { type: "progressive", brackets: [{ upTo: 77450, rate: 0.0375 }, { upTo: 176050, rate: 0.0475 }, { upTo: Infinity, rate: 0.0599 }] },
  SC: { type: "progressive", brackets: [{ upTo: 3460, rate: 0.0 }, { upTo: 17330, rate: 0.03 }, { upTo: Infinity, rate: 0.0625 }] },
  SD: { type: "none" },
  TN: { type: "none" },
  TX: { type: "none" },
  UT: { type: "flat", rate: 0.045 },
  VT: { type: "progressive", brackets: [{ upTo: 45400, rate: 0.0335 }, { upTo: 110050, rate: 0.066 }, { upTo: 229550, rate: 0.076 }, { upTo: Infinity, rate: 0.0875 }] },
  VA: { type: "progressive", brackets: [{ upTo: 3000, rate: 0.02 }, { upTo: 5000, rate: 0.03 }, { upTo: 17000, rate: 0.05 }, { upTo: Infinity, rate: 0.0575 }] },
  WA: { type: "none" },
  WV: { type: "progressive", brackets: [{ upTo: 10000, rate: 0.0222 }, { upTo: 25000, rate: 0.0296 }, { upTo: 40000, rate: 0.0333 }, { upTo: 60000, rate: 0.0444 }, { upTo: Infinity, rate: 0.0482 }] },
  WI: { type: "progressive", brackets: [{ upTo: 14320, rate: 0.035 }, { upTo: 28640, rate: 0.044 }, { upTo: 315310, rate: 0.053 }, { upTo: Infinity, rate: 0.0765 }] },
  WY: { type: "none" },
};

function calcProgressive(
  income: number,
  brackets: { upTo: number; rate: number }[]
): number {
  if (income <= 0) return 0;
  let tax = 0;
  let prev = 0;
  for (const { upTo, rate } of brackets) {
    const taxable = Math.min(income, upTo) - prev;
    if (taxable <= 0) break;
    tax += taxable * rate;
    prev = upTo;
  }
  return tax;
}

export function calculateStateTax(
  annualGross: number,
  state: StateCode,
  filingStatus: FilingStatus,
  preTaxDeductions = 0
): number {
  const taxable = getStateTaxableIncome(
    annualGross,
    state,
    filingStatus,
    preTaxDeductions
  );
  const config = STATE_TAX[state];

  if (config.type === "none") return 0;
  if (config.type === "flat") return taxable * config.rate;

  const brackets =
    config.bracketsByStatus?.[filingStatus] ?? config.brackets;
  return calcProgressive(taxable, brackets);
}

/** Taxable income after state standard deduction (if configured). */
export function getStateTaxableIncome(
  annualGross: number,
  state: StateCode,
  filingStatus: FilingStatus,
  preTaxDeductions = 0
): number {
  const config = STATE_TAX[state];
  const wages = Math.max(0, annualGross - preTaxDeductions);
  if (config.type !== "progressive" || !config.standardDeduction) {
    return wages;
  }
  const deduction = config.standardDeduction[filingStatus] ?? 0;
  return Math.max(0, wages - deduction);
}

export function hasStateIncomeTax(state: StateCode): boolean {
  return STATE_TAX[state].type !== "none";
}
