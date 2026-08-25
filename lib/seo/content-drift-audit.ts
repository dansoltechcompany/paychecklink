/**
 * SEO content drift audit — static rate/$ claims vs live tax engine.
 *
 * Scans Phase 1 tips/FAQs/sections, STATE_NOTES, Phase 2 localCaveat lines,
 * Phase 1 scenario highlights, and hub illustrative copy. Every extracted
 * tax-like % or $ must be either:
 *   - covered by an ASSERTABLE claim (checked against STATE_TAX / constants), or
 *   - listed in MANUAL_REVIEW_CLAIMS (cannot be exact-matched to the engine).
 */
import { calculatePaycheck } from "../calculator";
import { CA_EXEMPTION_CREDITS_2025 } from "../tax/ca-credits";
import { CA_SDI_2026, calculateCaSdi } from "../tax/ca-sdi";
import { FICA_2026 } from "../tax/fica";
import { lookupLocalTax } from "../tax/local";
import {
  MD_COUNTY_RATES_2026,
  MD_DEFAULT_LOCAL_RATE,
} from "../tax/md-local";
import { STATE_TAX } from "../tax/state";
import type { StateCode } from "../types";
import { ALL_STATES } from "../types";
import { PHASE1_STATES, phase1ExtraFaqs, phase1ExtraSections } from "./phase1-content";
import { localCaveat } from "./phase2-content";
import { SEO_PAGES } from "./pages";
import { STATE_NOTES } from "./state-content";
import { getTopStateScenarios, resolvePhase1StateTips } from "./top-content";

export type ProseBlob = {
  id: string;
  text: string;
};

export type ExtractedFigure = {
  blobId: string;
  kind: "pct" | "money";
  /** Normalized: percent points (4.99) or dollars (15000) */
  value: number;
  raw: string;
};

export type AssertableClaim = {
  id: string;
  /** Must appear in collected prose */
  proseMatch: string;
  kind: "pct" | "money";
  /** Percent points (4.99) or whole dollars */
  expected: number;
  /** Engine value used for the assertion */
  engineValue: () => number;
  note?: string;
};

export type ManualReviewClaim = {
  id: string;
  proseMatch: string;
  reason: string;
};

function flatRate(code: StateCode): number {
  const cfg = STATE_TAX[code];
  if (cfg.type !== "flat") throw new Error(`${code} is not flat`);
  return cfg.rate * 100;
}

function flatSd(code: StateCode, status: "single" | "married"): number {
  const cfg = STATE_TAX[code];
  if (cfg.type === "none" || !cfg.standardDeduction) {
    throw new Error(`${code} has no standard deduction`);
  }
  return cfg.standardDeduction[status];
}

function bracketRate(code: StateCode, index: number): number {
  const cfg = STATE_TAX[code];
  if (cfg.type !== "progressive") throw new Error(`${code} is not progressive`);
  return cfg.brackets[index].rate * 100;
}

function bracketUpTo(code: StateCode, index: number): number {
  const cfg = STATE_TAX[code];
  if (cfg.type !== "progressive") throw new Error(`${code} is not progressive`);
  return cfg.brackets[index].upTo;
}

function mdRateBounds(): { min: number; max: number } {
  const rates = Object.values(MD_COUNTY_RATES_2026).map((r) => r.rate);
  return { min: Math.min(...rates) * 100, max: Math.max(...rates) * 100 };
}

/**
 * Static / editorial prose only — the surfaces that can drift from the engine.
 * Skips main state pages’ live $60k FAQ numbers, state-variant duplicates, and
 * scenario net/effective-rate blurbs (those call calculatePaycheck at build time).
 */
export function collectStaticProseBlobs(): ProseBlob[] {
  const blobs: ProseBlob[] = [];

  for (const code of ALL_STATES) {
    blobs.push({ id: `state-notes:${code}`, text: STATE_NOTES[code] });
  }

  for (const code of PHASE1_STATES) {
    for (const faq of phase1ExtraFaqs(code)) {
      blobs.push({
        id: `phase1-faq:${code}:${faq.question.slice(0, 48)}`,
        text: `${faq.question} ${faq.answer}`,
      });
    }
    for (const sec of phase1ExtraSections(code)) {
      blobs.push({
        id: `phase1-section:${code}:${sec.heading}`,
        text: `${sec.heading} ${sec.body}`,
      });
    }
    // Scenario titles/setups/highlights often hardcode rates (GA 4.99%, OH 2.75%).
    // Contribution % and example salaries are classified as ignored below.
    for (const s of getTopStateScenarios(code)) {
      blobs.push({
        id: `phase1-scenario:${code}:${s.title}`,
        text: `${s.title} ${s.setup} ${s.highlight}`,
      });
    }
  }

  for (const [code, tip] of Object.entries(resolvePhase1StateTips("STATE"))) {
    blobs.push({ id: `phase1-tip:${code}`, text: tip });
  }

  for (const code of ALL_STATES) {
    const caveat = localCaveat(code);
    if (caveat) blobs.push({ id: `phase2-caveat:${code}`, text: caveat });
  }

  // Hub / frequency / pay-type illustrative copy only (not state or state-variant pages)
  const hubCategories = new Set([
    "hub",
    "tax",
    "frequency",
    "paytype",
    "extra",
  ]);
  for (const page of SEO_PAGES) {
    if (!hubCategories.has(page.category)) continue;
    for (const faq of page.faqs ?? []) {
      blobs.push({
        id: `hub-faq:${page.slug}:${faq.question.slice(0, 40)}`,
        text: `${faq.question} ${faq.answer}`,
      });
    }
    for (const sec of page.contentSections ?? []) {
      blobs.push({
        id: `hub-section:${page.slug}:${sec.heading}`,
        text: `${sec.heading} ${sec.body}`,
      });
    }
  }

  return blobs;
}

/** Live calculator outputs that appear in prose but are not static rate claims. */
export function liveComputedIgnoreAmounts(): Set<number> {
  const amounts = new Set<number>();
  const add = (n: number) => {
    amounts.add(Math.round(n));
    amounts.add(Math.round(n * 100) / 100);
  };

  for (const code of ALL_STATES) {
    const zip =
      code === "NY" ? "10001" : code === "MD" ? "20814" : undefined;
    const mid = calculatePaycheck({
      country: "US",
      payType: "salary",
      grossAmount: 60000 / 26,
      payFrequency: "biweekly",
      filingStatus: "single",
      state: code,
      zip,
    });
    add(mid.netAnnual);
    add(mid.netPay);
  }

  for (const code of PHASE1_STATES) {
    for (const s of getTopStateScenarios(code)) {
      add(s.netAnnual);
      add(s.netBiweekly);
    }
  }

  return amounts;
}

/** Example gross salaries / hours / pay-period math — not tax rates or credits. */
const EXAMPLE_GROSS_DOLLARS = new Set([
  20, 22, 23, 24, 25, 26, 27, 28, 29, 36, // hourly / hourly-equiv (not $30 SDI biweekly)
  37.5, // OT hourly illustration
  187.5, 1000, 1187.5, // OT week illustrations on hub
  1145, 1154, 1742, 1842, 2308, 5000, // period gross / hub illustrations
  3600, 2808, 792, // 401(k) illustrative math on hub
  48000, 50000, 52000, 55000, 60000, 62400, 65000, 75000, 80000, 85000, 90000,
  95000, 100000, 110000, 120000, 140000, 145000, 150000, 155000, 160000, 170000,
  180000,
]);

const PCT_RE = /(\d+(?:\.\d+)?)\s*%/g;
/** Do not treat `$60k` / `$100k` / `$1 million` as bare dollar amounts. */
const MONEY_RE =
  /\$(\d{1,3}(?:,\d{3})+)(?:\.(\d{2}))?\b|\$(\d+)(?:\.(\d{2}))?(?![kKmM\d])(?!\s*million)/gi;

export function extractFigures(blobs: ProseBlob[]): ExtractedFigure[] {
  const out: ExtractedFigure[] = [];
  for (const blob of blobs) {
    for (const m of blob.text.matchAll(PCT_RE)) {
      out.push({
        blobId: blob.id,
        kind: "pct",
        value: Number(m[1]),
        raw: m[0],
      });
    }
    for (const m of blob.text.matchAll(MONEY_RE)) {
      const intPart = (m[1] ?? m[3]).replace(/,/g, "");
      const frac = m[2] ?? m[4];
      const whole = Number(intPart);
      const cents = frac ? Number(`0.${frac}`) : 0;
      out.push({
        blobId: blob.id,
        kind: "money",
        value: whole + cents,
        raw: m[0],
      });
    }
  }
  return out;
}

/**
 * Claims we can pin to STATE_TAX / FICA / SDI / MD local / CA credits / local ZIP map.
 * `proseMatch` is the exact substring as it appears in content.
 */
export const ASSERTABLE_CLAIMS: AssertableClaim[] = [
  // —— FICA ——
  {
    id: "fica-ss-6.2",
    proseMatch: "6.2%",
    kind: "pct",
    expected: 6.2,
    engineValue: () => FICA_2026.socialSecurityRate * 100,
  },
  {
    id: "fica-medicare-1.45",
    proseMatch: "1.45%",
    kind: "pct",
    expected: 1.45,
    engineValue: () => FICA_2026.medicareRate * 100,
  },

  // —— CA SDI + credits ——
  {
    id: "ca-sdi-1.3",
    proseMatch: "1.3%",
    kind: "pct",
    expected: 1.3,
    engineValue: () => CA_SDI_2026.rate * 100,
  },
  {
    id: "ca-sdi-780-on-60k",
    proseMatch: "$780",
    kind: "money",
    expected: 780,
    engineValue: () => calculateCaSdi(60000),
    note: "1.3% × $60,000",
  },
  {
    id: "ca-credit-153",
    proseMatch: "$153",
    kind: "money",
    expected: 153,
    engineValue: () => CA_EXEMPTION_CREDITS_2025.personalSingleOrHead,
  },
  {
    id: "ca-credit-306",
    proseMatch: "$306",
    kind: "money",
    expected: 306,
    engineValue: () => CA_EXEMPTION_CREDITS_2025.personalMarried,
  },
  {
    id: "ca-top-above-10",
    proseMatch: "above 10%",
    kind: "pct",
    expected: 10,
    engineValue: () => {
      const cfg = STATE_TAX.CA;
      if (cfg.type !== "progressive") throw new Error("CA not progressive");
      return Math.max(...cfg.brackets.map((b) => b.rate)) * 100;
    },
    note: "Asserts top CA bracket is above 10% (engine max vs prose floor)",
  },

  // —— GA HB 463 ——
  {
    id: "ga-rate-4.99",
    proseMatch: "4.99%",
    kind: "pct",
    expected: 4.99,
    engineValue: () => flatRate("GA"),
  },
  {
    id: "ga-sd-single-15000",
    proseMatch: "$15,000",
    kind: "money",
    expected: 15000,
    engineValue: () => flatSd("GA", "single"),
  },
  {
    id: "ga-sd-joint-30000",
    proseMatch: "$30,000",
    kind: "money",
    expected: 30000,
    engineValue: () => flatSd("GA", "married"),
  },

  // —— IL / PA / KY / NC / UT / ID / MS / LA ——
  {
    id: "il-rate-4.95",
    proseMatch: "4.95%",
    kind: "pct",
    expected: 4.95,
    engineValue: () => flatRate("IL"),
  },
  {
    id: "pa-rate-3.07",
    proseMatch: "3.07%",
    kind: "pct",
    expected: 3.07,
    engineValue: () => flatRate("PA"),
  },
  {
    id: "philly-local-3.75",
    proseMatch: "3.75%",
    kind: "pct",
    expected: 3.75,
    engineValue: () => (lookupLocalTax("19107")?.rate ?? 0) * 100,
  },
  {
    id: "ky-rate-3.5",
    proseMatch: "3.5%",
    kind: "pct",
    expected: 3.5,
    engineValue: () => flatRate("KY"),
  },
  {
    id: "nc-rate-3.99",
    proseMatch: "3.99%",
    kind: "pct",
    expected: 3.99,
    engineValue: () => flatRate("NC"),
  },
  {
    id: "ut-rate-4.45",
    proseMatch: "4.45%",
    kind: "pct",
    expected: 4.45,
    engineValue: () => flatRate("UT"),
  },
  {
    id: "id-rate-5.3",
    proseMatch: "5.3%",
    kind: "pct",
    expected: 5.3,
    engineValue: () => bracketRate("ID", 1),
  },
  {
    id: "ms-rate-4",
    proseMatch: "4%",
    kind: "pct",
    expected: 4,
    engineValue: () => {
      const cfg = STATE_TAX.MS;
      if (cfg.type !== "progressive") throw new Error("MS not progressive");
      return cfg.brackets[cfg.brackets.length - 1].rate * 100;
    },
  },
  {
    id: "ms-zero-band-10000",
    proseMatch: "$10,000",
    kind: "money",
    expected: 10000,
    engineValue: () => bracketUpTo("MS", 0),
  },
  {
    id: "la-rate-3",
    proseMatch: "flat 3%",
    kind: "pct",
    expected: 3,
    engineValue: () => flatRate("LA"),
  },

  // —— OH ——
  {
    id: "oh-rate-0",
    proseMatch: "0%",
    kind: "pct",
    expected: 0,
    engineValue: () => bracketRate("OH", 0),
    note: "OH zero bracket; also matches “$0 / 0% state tax” wording when asserted carefully",
  },
  {
    id: "oh-rate-2.75",
    proseMatch: "2.75%",
    kind: "pct",
    expected: 2.75,
    engineValue: () => bracketRate("OH", 1),
  },
  {
    id: "oh-exempt-26050",
    proseMatch: "$26,050",
    kind: "money",
    expected: 26050,
    engineValue: () => bracketUpTo("OH", 0),
  },

  // —— SC ——
  {
    id: "sc-rate-1.99",
    proseMatch: "1.99%",
    kind: "pct",
    expected: 1.99,
    engineValue: () => bracketRate("SC", 0),
  },
  {
    id: "sc-rate-5.21",
    proseMatch: "5.21%",
    kind: "pct",
    expected: 5.21,
    engineValue: () => bracketRate("SC", 1),
  },

  // —— MD local ——
  {
    id: "md-default-3.20",
    proseMatch: "3.20%",
    kind: "pct",
    expected: 3.2,
    engineValue: () => MD_DEFAULT_LOCAL_RATE * 100,
  },
  {
    id: "md-worcester-2.25",
    proseMatch: "2.25%",
    kind: "pct",
    expected: 2.25,
    engineValue: () => MD_COUNTY_RATES_2026.worcester.rate * 100,
  },
  {
    id: "md-range-high-3.30",
    proseMatch: "3.30%",
    kind: "pct",
    expected: 3.3,
    engineValue: () => mdRateBounds().max,
  },
];

/**
 * Figures that appear in static prose but cannot be exact-matched to a single
 * current engine constant (historical rates, ranges, hub approximations, etc.).
 * Keep this list explicit — do not silently ignore unmatched tax claims.
 */
export const MANUAL_REVIEW_CLAIMS: ManualReviewClaim[] = [
  {
    id: "ga-historical-5.19",
    proseMatch: "5.19%",
    reason:
      "Prior-year GA flat rate cited as “down from / stale” — not in current STATE_TAX",
  },
  {
    id: "ga-historical-sd-12000",
    proseMatch: "$12,000",
    reason: "Pre–HB 463 Georgia standard deduction cited as obsolete — not in STATE_TAX",
  },
  {
    id: "ga-future-floor-3.99-in-ga-faq",
    proseMatch: "3.99% floor",
    reason:
      "Authorized future GA rate floor if revenue targets met — not current STATE_TAX.GA.rate",
  },
  {
    id: "ut-historical-4.50",
    proseMatch: "4.50%",
    reason: "Prior UT rate (“not 4.50%”) — superseded; not current STATE_TAX",
  },
  {
    id: "nyc-effective-approx-3-4",
    proseMatch: "~3–4%",
    reason:
      "Effective NYC local burden on mid salaries — approximate, not a single bracket rate",
  },
  {
    id: "pa-eit-range-1-4",
    proseMatch: "1%–4%",
    reason: "PA local EIT range across municipalities — not a single mapped ZIP rate",
  },
  {
    id: "hub-biweekly-illustrative-withholding",
    proseMatch: "roughly $290 federal tax",
    reason:
      "Hub biweekly page uses round illustrative CA/TX withholding ($290/$100/$143/$33/$1,742/$1,842) — not pinned to live calculatePaycheck output",
  },
  {
    id: "hub-hourly-illustrative-nets",
    proseMatch: "might net roughly $55,000",
    reason:
      "Hub hourly→salary page uses round CA/TX annual net illustrations ($55k / $58,500) — not live engine figures",
  },
  {
    id: "hub-bonus-supplemental-22",
    proseMatch: "22%",
    reason:
      "IRS supplemental wage flat rate mentioned on bonus hub — not stored as a STATE_TAX / FICA constant today",
  },
  {
    id: "hub-bonus-supplemental-37",
    proseMatch: "37%",
    reason: "IRS supplemental rate above $1M — federal policy prose, not in paycheck STATE_TAX",
  },
  {
    id: "hub-401k-limit-23500",
    proseMatch: "$23,500",
    reason: "IRS employee 401(k) deferral limit in hub copy — not modeled as an engine constant file",
  },
  {
    id: "hub-401k-catchup-31000",
    proseMatch: "$31,000",
    reason: "Age-50+ 401(k) catch-up limit in hub copy — not an engine tax-rate constant",
  },
  {
    id: "hub-bls-biweekly-43",
    proseMatch: "43%",
    reason: "BLS statistic on biweekly pay prevalence — not a tax rate",
  },
  {
    id: "ca-sdi-biweekly-approx-30",
    proseMatch: "~$30 biweekly",
    reason: "Rounded SDI biweekly ($780/26 ≈ $30) — approximate wording, not exact engine period split",
  },
  {
    id: "hub-ot-net-range",
    proseMatch: "around $130–$150",
    reason: "Overtime hub keeps a rounded after-tax range, not a live calculatePaycheck result",
  },
  {
    id: "hub-bonus-marginal-approx-32",
    proseMatch: "32%",
    reason:
      "Bonus hub “combined marginal (~32%)” illustration — not a stored federal/state constant",
  },
  {
    id: "tx-zero-state-rate-wording",
    proseMatch: "0% state income tax",
    reason:
      "Narrative “0% state income tax” for no-tax states — engine uses type:\"none\", not rate:0",
  },
];

export type FigureClass =
  | { status: "asserted"; claimId: string }
  | { status: "manual"; claimId: string }
  | { status: "ignored"; reason: string }
  | { status: "uncovered" };

function nearlyEqual(a: number, b: number, eps = 0.0001): boolean {
  return Math.abs(a - b) < eps;
}

function claimCoversFigure(claim: AssertableClaim, fig: ExtractedFigure): boolean {
  if (claim.kind !== fig.kind) {
    if (claim.id === "ca-top-above-10" && fig.kind === "pct" && fig.value === 10) {
      return true;
    }
    return false;
  }
  return nearlyEqual(claim.expected, fig.value);
}

function claimAppliesToBlob(claim: AssertableClaim, blobText: string): boolean {
  if (claim.id === "oh-rate-0") {
    return /Ohio|OH state|0%\s+to\s+\$26,050/i.test(blobText);
  }
  if (claim.id === "ca-top-above-10") {
    return blobText.includes("above 10%");
  }
  if (claim.id.startsWith("fica-")) {
    return blobText.includes(claim.proseMatch);
  }
  return blobText.includes(claim.proseMatch);
}

function manualCoversFigure(
  claim: ManualReviewClaim,
  fig: ExtractedFigure,
  blobText: string
): boolean {
  if (!blobText.includes(claim.proseMatch) && claim.id !== "tx-zero-state-rate-wording") {
    // tx-zero may match “0% Texas” / “0% state” variants
    if (claim.id !== "tx-zero-state-rate-wording") return false;
  }
  if (claim.id === "ga-historical-5.19" && fig.kind === "pct" && fig.value === 5.19)
    return true;
  if (claim.id === "ut-historical-4.50" && fig.kind === "pct" && fig.value === 4.5)
    return true;
  if (claim.id === "ga-future-floor-3.99-in-ga-faq") {
    return (
      fig.kind === "pct" &&
      fig.value === 3.99 &&
      blobText.includes("floor")
    );
  }
  if (claim.id === "ga-historical-sd-12000" && fig.kind === "money" && fig.value === 12000)
    return true;
  if (claim.id === "nyc-effective-approx-3-4") {
    return fig.kind === "pct" && (fig.value === 3 || fig.value === 4);
  }
  if (claim.id === "pa-eit-range-1-4") {
    return fig.kind === "pct" && (fig.value === 1 || fig.value === 4);
  }
  if (claim.id === "hub-bonus-supplemental-22" && fig.kind === "pct" && fig.value === 22)
    return true;
  if (claim.id === "hub-bonus-supplemental-37" && fig.kind === "pct" && fig.value === 37)
    return true;
  if (claim.id === "hub-bls-biweekly-43" && fig.kind === "pct" && fig.value === 43)
    return true;
  if (claim.id === "hub-401k-limit-23500" && fig.kind === "money" && fig.value === 23500)
    return true;
  if (claim.id === "hub-401k-catchup-31000" && fig.kind === "money" && fig.value === 31000)
    return true;
  if (claim.id === "hub-biweekly-illustrative-withholding") {
    return (
      fig.kind === "money" &&
      [290, 100, 143, 33, 1742, 1842].includes(Math.round(fig.value))
    );
  }
  if (claim.id === "hub-hourly-illustrative-nets") {
    return (
      fig.kind === "money" &&
      [55000, 58500, 26.44, 28.13].some((v) => nearlyEqual(v, fig.value, 0.01))
    );
  }
  if (claim.id === "ca-sdi-biweekly-approx-30" && fig.kind === "money" && fig.value === 30)
    return true;
  if (claim.id === "hub-ot-net-range") {
    return fig.kind === "money" && (fig.value === 130 || fig.value === 150);
  }
  if (claim.id === "hub-bonus-marginal-approx-32" && fig.kind === "pct" && fig.value === 32)
    return true;
  if (claim.id === "tx-zero-state-rate-wording") {
    return (
      fig.kind === "pct" &&
      fig.value === 0 &&
      /0%\s+(state|Texas|Washington)|no state wage income tax|\$0\s+Texas/i.test(
        blobText
      ) &&
      !/Ohio|0%\s+to\s+\$26,050/i.test(blobText)
    );
  }
  return false;
}

function isIgnoredFigure(
  fig: ExtractedFigure,
  blobText: string,
  liveIgnores: Set<number>
): string | null {
  if (fig.kind === "money") {
    if (EXAMPLE_GROSS_DOLLARS.has(fig.value) || EXAMPLE_GROSS_DOLLARS.has(Math.round(fig.value))) {
      if (fig.value !== 780) return "example gross / pay-period illustration";
    }
    // Hourly wage examples like $30/hr — not tax credits
    if (
      fig.value >= 15 &&
      fig.value <= 40 &&
      /\$\d+(?:\.\d+)?\s*\/\s*hr|\$\d+(?:\.\d+)?\/hour|\$\d+\s*hour/i.test(blobText)
    ) {
      return "hourly wage example";
    }
    if (fig.value === 0) return "zero dollar ($0 tax) wording";
    for (const live of liveIgnores) {
      if (nearlyEqual(fig.value, live, 0.6)) return "live calculatePaycheck output";
    }
  }
  if (fig.kind === "pct") {
    // Employee 401(k) contribution rates in scenario setups, not tax rates
    if (
      /\d+(?:\.\d+)?%\s*(traditional\s+)?401\s*\(\s*k\s*\)/i.test(blobText) ||
      /401\s*\(\s*k\s*\).*?\d+(?:\.\d+)?%/i.test(blobText)
    ) {
      // Only ignore if this figure is the contribution percent near 401(k)
      const contrib = blobText.match(
        /(\d+(?:\.\d+)?)\s*%\s*(?:traditional\s+)?401\s*\(\s*k\s*\)|401\s*\(\s*k\s*\).*?(\d+(?:\.\d+)?)\s*%/i
      );
      if (contrib) {
        const v = Number(contrib[1] ?? contrib[2]);
        if (nearlyEqual(v, fig.value)) return "401(k) contribution percent (not a tax rate)";
      }
    }
    // Hub “capture your employer match (commonly 3–6%)”
    if (
      /employer match|contribution rates|401\(k\) percentage/i.test(blobText) &&
      (fig.value === 3 || fig.value === 6)
    ) {
      return "401(k) contribution guidance (not a tax rate)";
    }
  }
  return null;
}

export function classifyFigure(
  fig: ExtractedFigure,
  blobText: string,
  liveIgnores: Set<number>
): FigureClass {
  const ignore = isIgnoredFigure(fig, blobText, liveIgnores);
  if (ignore) return { status: "ignored", reason: ignore };

  for (const claim of MANUAL_REVIEW_CLAIMS) {
    if (manualCoversFigure(claim, fig, blobText)) {
      return { status: "manual", claimId: claim.id };
    }
  }

  for (const claim of ASSERTABLE_CLAIMS) {
    if (claimAppliesToBlob(claim, blobText) && claimCoversFigure(claim, fig)) {
      return { status: "asserted", claimId: claim.id };
    }
  }

  return { status: "uncovered" };
}

export type AuditReport = {
  blobCount: number;
  figuresFound: number;
  ignored: number;
  asserted: number;
  manualReview: number;
  uncovered: ExtractedFigure[];
  assertableClaimCount: number;
  manualClaimCount: number;
  /** Distinct assertable claim ids that matched at least one figure */
  assertedClaimIds: string[];
  /** Distinct manual claim ids that matched at least one figure */
  manualClaimIds: string[];
  /** Manual claims listed but not observed in current prose (stale list entries) */
  staleManualClaimIds: string[];
};

export function runContentDriftAudit(): AuditReport {
  const blobs = collectStaticProseBlobs();
  const byId = new Map(blobs.map((b) => [b.id, b.text]));
  const figures = extractFigures(blobs);
  const liveIgnores = liveComputedIgnoreAmounts();

  let ignored = 0;
  let asserted = 0;
  let manualReview = 0;
  const uncovered: ExtractedFigure[] = [];
  const assertedClaimIds = new Set<string>();
  const manualClaimIds = new Set<string>();

  for (const fig of figures) {
    const text = byId.get(fig.blobId) ?? "";
    const cls = classifyFigure(fig, text, liveIgnores);
    if (cls.status === "ignored") ignored++;
    else if (cls.status === "asserted") {
      asserted++;
      assertedClaimIds.add(cls.claimId);
    } else if (cls.status === "manual") {
      manualReview++;
      manualClaimIds.add(cls.claimId);
    } else uncovered.push(fig);
  }

  const allText = blobs.map((b) => b.text).join("\n");
  const staleManualClaimIds = MANUAL_REVIEW_CLAIMS.filter(
    (c) => !allText.includes(c.proseMatch)
  ).map((c) => c.id);

  return {
    blobCount: blobs.length,
    figuresFound: figures.length,
    ignored,
    asserted,
    manualReview,
    uncovered,
    assertableClaimCount: ASSERTABLE_CLAIMS.length,
    manualClaimCount: MANUAL_REVIEW_CLAIMS.length,
    assertedClaimIds: [...assertedClaimIds].sort(),
    manualClaimIds: [...manualClaimIds].sort(),
    staleManualClaimIds,
  };
}

export function assertClaimsMatchEngine(): string[] {
  const failures: string[] = [];
  for (const claim of ASSERTABLE_CLAIMS) {
    let engine: number;
    try {
      engine = claim.engineValue();
    } catch (e) {
      failures.push(`${claim.id}: engineValue threw ${e}`);
      continue;
    }
    if (claim.id === "ca-top-above-10") {
      if (!(engine > claim.expected)) {
        failures.push(
          `${claim.id}: expected CA top rate > ${claim.expected}%, engine=${engine}`
        );
      }
      continue;
    }
    if (!nearlyEqual(engine, claim.expected)) {
      failures.push(
        `${claim.id}: prose expects ${claim.expected} but engine has ${engine}`
      );
    }
  }
  return failures;
}

export function assertProseContainsClaimMatches(): string[] {
  const allText = collectStaticProseBlobs()
    .map((b) => b.text)
    .join("\n");
  const failures: string[] = [];
  for (const claim of ASSERTABLE_CLAIMS) {
    if (!allText.includes(claim.proseMatch)) {
      failures.push(
        `${claim.id}: proseMatch "${claim.proseMatch}" not found in static SEO blobs`
      );
    }
  }
  return failures;
}
