import type { ProvinceCode } from "../types";

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

/** Federal brackets (approx) + basic personal amount simplification */
const FEDERAL_BRACKETS = [
  { upTo: 57375, rate: 0.15 },
  { upTo: 114750, rate: 0.205 },
  { upTo: 177882, rate: 0.26 },
  { upTo: 253414, rate: 0.29 },
  { upTo: Infinity, rate: 0.33 },
];

const BASIC_PERSONAL_AMOUNT = 15705;

/** Simplified progressive provincial rates for estimates */
const PROVINCIAL: Record<ProvinceCode, { upTo: number; rate: number }[]> = {
  // Alberta moved from flat 10% to progressive brackets
  AB: [
    { upTo: 60000, rate: 0.08 },
    { upTo: 151234, rate: 0.1 },
    { upTo: 181481, rate: 0.12 },
    { upTo: 241974, rate: 0.13 },
    { upTo: 362961, rate: 0.14 },
    { upTo: Infinity, rate: 0.15 },
  ],
  BC: [
    { upTo: 47937, rate: 0.0506 },
    { upTo: 95875, rate: 0.077 },
    { upTo: 110076, rate: 0.105 },
    { upTo: 133664, rate: 0.1229 },
    { upTo: 181232, rate: 0.147 },
    { upTo: Infinity, rate: 0.168 },
  ],
  MB: [
    { upTo: 47000, rate: 0.108 },
    { upTo: 100000, rate: 0.1275 },
    { upTo: Infinity, rate: 0.174 },
  ],
  NB: [
    { upTo: 49958, rate: 0.094 },
    { upTo: 99916, rate: 0.14 },
    { upTo: 185064, rate: 0.16 },
    { upTo: Infinity, rate: 0.195 },
  ],
  NL: [
    { upTo: 43198, rate: 0.087 },
    { upTo: 86395, rate: 0.145 },
    { upTo: 154244, rate: 0.158 },
    { upTo: Infinity, rate: 0.208 },
  ],
  NS: [
    { upTo: 29590, rate: 0.0879 },
    { upTo: 59180, rate: 0.1495 },
    { upTo: 93000, rate: 0.1667 },
    { upTo: 150000, rate: 0.175 },
    { upTo: Infinity, rate: 0.21 },
  ],
  NT: [
    { upTo: 50597, rate: 0.059 },
    { upTo: 101198, rate: 0.086 },
    { upTo: 164525, rate: 0.122 },
    { upTo: Infinity, rate: 0.1405 },
  ],
  NU: [
    { upTo: 53268, rate: 0.04 },
    { upTo: 106537, rate: 0.07 },
    { upTo: 173205, rate: 0.09 },
    { upTo: Infinity, rate: 0.115 },
  ],
  ON: [
    { upTo: 51446, rate: 0.0505 },
    { upTo: 102894, rate: 0.0915 },
    { upTo: 150000, rate: 0.1116 },
    { upTo: 220000, rate: 0.1216 },
    { upTo: Infinity, rate: 0.1316 },
  ],
  PE: [
    { upTo: 32656, rate: 0.0965 },
    { upTo: 64313, rate: 0.1363 },
    { upTo: Infinity, rate: 0.1665 },
  ],
  QC: [
    { upTo: 51780, rate: 0.14 },
    { upTo: 103545, rate: 0.19 },
    { upTo: 126000, rate: 0.24 },
    { upTo: Infinity, rate: 0.2575 },
  ],
  SK: [
    { upTo: 52057, rate: 0.105 },
    { upTo: 148734, rate: 0.125 },
    { upTo: Infinity, rate: 0.145 },
  ],
  YT: [
    { upTo: 57375, rate: 0.064 },
    { upTo: 114750, rate: 0.09 },
    { upTo: 177882, rate: 0.109 },
    { upTo: 500000, rate: 0.128 },
    { upTo: Infinity, rate: 0.15 },
  ],
};

export function calculateCanadaTax(
  annualGross: number,
  province: ProvinceCode
): {
  federalTax: number;
  provincialTax: number;
  cpp: number;
  ei: number;
} {
  const taxable = Math.max(0, annualGross - BASIC_PERSONAL_AMOUNT);
  const federalTax = progressive(taxable, FEDERAL_BRACKETS);

  const provincialTax = progressive(taxable, PROVINCIAL[province]);

  // CPP / QPP + EI employee (simplified 2026-ish)
  // Quebec uses QPP (higher rate) and a lower EI rate; QPIP omitted for simplicity
  const isQuebec = province === "QC";
  const pensionMax = 68500;
  const pensionExempt = 3500;
  const pensionRate = isQuebec ? 0.064 : 0.0595;
  const cpp = Math.min(
    Math.max(0, annualGross - pensionExempt),
    pensionMax - pensionExempt
  ) * pensionRate;
  const eiRate = isQuebec ? 0.0131 : 0.0166;
  const ei = Math.min(annualGross, 65700) * eiRate;

  return { federalTax, provincialTax, cpp, ei };
}
