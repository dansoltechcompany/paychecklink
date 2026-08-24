import type { StateCode } from "../types";

/**
 * Local / city income tax estimates for common US payroll localities.
 * ZIP → rate mapping for high-traffic metros. Users can also enter a custom rate.
 */

export interface LocalTaxInfo {
  name: string;
  rate: number;
  state: StateCode;
  note?: string;
}

/** Representative ZIPs for major local income-tax cities */
export const LOCAL_TAX_BY_ZIP: Record<string, LocalTaxInfo> = {
  // New York City
  "10001": { name: "New York City, NY", rate: 0.0485, state: "NY", note: "NYC resident local tax (approx.)" },
  "10002": { name: "New York City, NY", rate: 0.0485, state: "NY" },
  "10013": { name: "New York City, NY", rate: 0.0485, state: "NY" },
  "11201": { name: "New York City, NY", rate: 0.0485, state: "NY" },
  "10451": { name: "New York City, NY", rate: 0.0485, state: "NY" },
  "10301": { name: "New York City, NY", rate: 0.0485, state: "NY" },
  // Philadelphia
  "19103": { name: "Philadelphia, PA", rate: 0.0375, state: "PA", note: "City wage tax (resident approx.)" },
  "19107": { name: "Philadelphia, PA", rate: 0.0375, state: "PA" },
  "19146": { name: "Philadelphia, PA", rate: 0.0375, state: "PA" },
  // Detroit
  "48201": { name: "Detroit, MI", rate: 0.024, state: "MI" },
  "48226": { name: "Detroit, MI", rate: 0.024, state: "MI" },
  // San Francisco (payroll expense often employer-side; gross receipts — use optional)
  "94102": { name: "San Francisco, CA", rate: 0, state: "CA", note: "No employee city income tax; CA state still applies" },
  "94103": { name: "San Francisco, CA", rate: 0, state: "CA" },
  // Denver (occupational privilege — small; approximate)
  "80202": { name: "Denver, CO", rate: 0.0, state: "CO", note: "OPT is nominal; enter custom if needed" },
  // Portland Metro / Multnomah (simplified support)
  "97201": { name: "Portland / Multnomah, OR", rate: 0.02, state: "OR", note: "Metro + Multnomah support approx." },
  "97209": { name: "Portland / Multnomah, OR", rate: 0.02, state: "OR" },
  // St. Louis / Kansas City earnings taxes
  "63101": { name: "St. Louis, MO", rate: 0.01, state: "MO" },
  "64101": { name: "Kansas City, MO", rate: 0.01, state: "MO" },
  // Cincinnati / Columbus / Cleveland Ohio municipal
  "45202": { name: "Cincinnati, OH", rate: 0.018, state: "OH" },
  "43215": { name: "Columbus, OH", rate: 0.025, state: "OH" },
  "44113": { name: "Cleveland, OH", rate: 0.025, state: "OH" },
  // Pittsburgh
  "15222": { name: "Pittsburgh, PA", rate: 0.03, state: "PA", note: "Earned income + local approx." },
  // Baltimore
  "21201": { name: "Baltimore City, MD", rate: 0.032, state: "MD", note: "Local income tax approx." },
  "21230": { name: "Baltimore City, MD", rate: 0.032, state: "MD" },
  // Wilmington DE
  "19801": { name: "Wilmington, DE", rate: 0.0125, state: "DE" },
  // Birmingham AL occupational
  "35203": { name: "Birmingham, AL", rate: 0.01, state: "AL" },
  // Louisville
  "40202": { name: "Louisville, KY", rate: 0.022, state: "KY" },
  // Newark NJ
  "07102": { name: "Newark, NJ", rate: 0.01, state: "NJ" },
};

export function lookupLocalTax(zip: string): LocalTaxInfo | null {
  const normalized = zip.trim().slice(0, 5);
  if (!/^\d{5}$/.test(normalized)) return null;
  return LOCAL_TAX_BY_ZIP[normalized] ?? null;
}

export function calculateLocalTax(
  annualTaxableWages: number,
  options: { zip?: string; customRate?: number }
): { annual: number; rate: number; label: string } {
  if (options.customRate != null && options.customRate > 0) {
    return {
      annual: annualTaxableWages * options.customRate,
      rate: options.customRate,
      label: `Local tax (${(options.customRate * 100).toFixed(2)}%)`,
    };
  }
  if (options.zip) {
    const info = lookupLocalTax(options.zip);
    if (info && info.rate > 0) {
      return {
        annual: annualTaxableWages * info.rate,
        rate: info.rate,
        label: `Local tax — ${info.name}`,
      };
    }
    if (info && info.rate === 0) {
      return { annual: 0, rate: 0, label: info.note || info.name };
    }
  }
  return { annual: 0, rate: 0, label: "Local tax" };
}

export const LOCAL_TAX_SOURCE =
  "City/county published earned-income or local income tax rates for common ZIPs (approximate; verify locally)";
