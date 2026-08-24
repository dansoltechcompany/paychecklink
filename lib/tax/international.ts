import type { CountryCode } from "../types";

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

type IntlResult = {
  incomeTax: number;
  social: number;
  other: number;
  labels: { incomeTax: string; social: string; other?: string };
};

/** Simplified Tier-1 country engines for take-home estimates */
export function calculateInternationalTax(
  country: Exclude<CountryCode, "US" | "UK" | "CA">,
  annualGross: number
): IntlResult {
  switch (country) {
    case "AU": {
      // Australian resident tax + Medicare levy (simplified)
      const incomeTax = progressive(annualGross, [
        { upTo: 18200, rate: 0 },
        { upTo: 45000, rate: 0.16 },
        { upTo: 135000, rate: 0.3 },
        { upTo: 190000, rate: 0.37 },
        { upTo: Infinity, rate: 0.45 },
      ]);
      const medicare = annualGross * 0.02;
      return {
        incomeTax,
        social: medicare,
        other: 0,
        labels: { incomeTax: "Income Tax", social: "Medicare Levy" },
      };
    }
    case "IE": {
      const standardRateBand = 44000;
      const incomeTax =
        Math.min(annualGross, standardRateBand) * 0.2 +
        Math.max(0, annualGross - standardRateBand) * 0.4;
      // Rough USC + PRSI blend
      const social = annualGross * 0.08;
      return {
        incomeTax: Math.max(0, incomeTax - 1875), // rough tax credit
        social,
        other: 0,
        labels: { incomeTax: "Income Tax", social: "USC + PRSI" },
      };
    }
    case "DE": {
      // Very simplified progressive + social blend
      const incomeTax = progressive(annualGross, [
        { upTo: 11604, rate: 0 },
        { upTo: 17005, rate: 0.14 },
        { upTo: 66760, rate: 0.24 },
        { upTo: 277826, rate: 0.42 },
        { upTo: Infinity, rate: 0.45 },
      ]);
      const social = Math.min(annualGross, 90600) * 0.2;
      // Solidarity surcharge largely phased out for typical earners
      const soli =
        annualGross > 80000 ? incomeTax * 0.055 : 0;
      return {
        incomeTax,
        social,
        other: soli,
        labels: {
          incomeTax: "Income Tax",
          social: "Social Contributions",
          other: "Solidarity Surcharge",
        },
      };
    }
    case "NL": {
      const incomeTax = progressive(annualGross, [
        { upTo: 75518, rate: 0.3693 },
        { upTo: Infinity, rate: 0.495 },
      ]);
      return {
        incomeTax,
        social: 0,
        other: 0,
        labels: { incomeTax: "Box 1 Tax (incl. national insurance)", social: "—" },
      };
    }
    case "FR": {
      const incomeTax = progressive(annualGross, [
        { upTo: 11294, rate: 0 },
        { upTo: 28797, rate: 0.11 },
        { upTo: 82341, rate: 0.3 },
        { upTo: 177106, rate: 0.41 },
        { upTo: Infinity, rate: 0.45 },
      ]);
      const social = annualGross * 0.097;
      return {
        incomeTax,
        social,
        other: 0,
        labels: { incomeTax: "Income Tax", social: "Social Charges (CSG/CRDS approx.)" },
      };
    }
    case "ES": {
      const incomeTax = progressive(annualGross, [
        { upTo: 12450, rate: 0.19 },
        { upTo: 20200, rate: 0.24 },
        { upTo: 35200, rate: 0.3 },
        { upTo: 60000, rate: 0.37 },
        { upTo: 300000, rate: 0.45 },
        { upTo: Infinity, rate: 0.47 },
      ]);
      const social = Math.min(annualGross, 56000) * 0.064;
      return {
        incomeTax,
        social,
        other: 0,
        labels: { incomeTax: "IRPF", social: "Social Security (employee)" },
      };
    }
    case "IT": {
      const incomeTax = progressive(annualGross, [
        { upTo: 28000, rate: 0.23 },
        { upTo: 50000, rate: 0.35 },
        { upTo: Infinity, rate: 0.43 },
      ]);
      const social = annualGross * 0.0919;
      return {
        incomeTax,
        social,
        other: 0,
        labels: { incomeTax: "IRPEF", social: "INPS Contributions" },
      };
    }
    case "SE": {
      const municipal = annualGross * 0.32;
      const national =
        annualGross > 598500 ? (annualGross - 598500) * 0.2 : 0;
      return {
        incomeTax: municipal + national,
        social: 0,
        other: 0,
        labels: { incomeTax: "Municipal + National Tax", social: "—" },
      };
    }
    case "CH": {
      // Rough federal + average cantonal/communal blend
      const federal = progressive(annualGross, [
        { upTo: 15200, rate: 0 },
        { upTo: 31600, rate: 0.01 },
        { upTo: 80000, rate: 0.05 },
        { upTo: 150000, rate: 0.09 },
        { upTo: Infinity, rate: 0.13 },
      ]);
      const cantonal = annualGross * 0.1;
      const social = annualGross * 0.064;
      return {
        incomeTax: federal + cantonal,
        social,
        other: 0,
        labels: {
          incomeTax: "Federal + Cantonal Tax (avg.)",
          social: "AHV/IV/EO + ALV",
        },
      };
    }
  }
}
