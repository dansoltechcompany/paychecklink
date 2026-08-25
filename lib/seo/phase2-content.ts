/**
 * Phase 2 SEO content — remaining 40 states (not in Phase 1).
 *
 * Data-driven from the verified tax engine (STATE_TAX + calculatePaycheck).
 * Not mail-merge only: each page gets tax-type-specific FAQs, a distinctive
 * overview section with live $60k numbers, and 4 scenarios.
 */
import { calculatePaycheck } from "../calculator";
import { STATE_TAX } from "../tax/state";
import type { StateCode } from "../types";
import { ALL_STATES, STATE_NAMES } from "../types";
import { isPhase1State, PHASE1_STATES } from "./phase1-content";
import type { PayScenario } from "./types";

const YEAR = 2026;

export const PHASE2_STATES: StateCode[] = ALL_STATES.filter(
  (c) => !PHASE1_STATES.includes(c)
);

function money(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function moneyExact(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function pct(rate: number): string {
  const p = rate * 100;
  return `${p % 1 === 0 ? p.toFixed(0) : p.toFixed(2)}%`;
}

function runSalary(opts: {
  state: StateCode;
  annual: number;
  filingStatus?: "single" | "married" | "head";
  preTax401kPercent?: number;
  zip?: string;
  title: string;
  setup: string;
  highlight: string;
}): PayScenario {
  const result = calculatePaycheck({
    country: "US",
    payType: "salary",
    grossAmount: opts.annual / 26,
    payFrequency: "biweekly",
    filingStatus: opts.filingStatus ?? "single",
    state: opts.state,
    preTax401kPercent: opts.preTax401kPercent ?? 0,
    zip: opts.zip,
  });
  return {
    title: opts.title,
    setup: opts.setup,
    annualGross: opts.annual,
    netAnnual: result.netAnnual,
    netBiweekly: result.netPay,
    effectiveRate: result.effectiveTaxRate,
    highlight: opts.highlight,
  };
}

function runHourly(opts: {
  state: StateCode;
  hourly: number;
  overtime?: number;
  title: string;
  setup: string;
  highlight: string;
}): PayScenario {
  const result = calculatePaycheck({
    country: "US",
    payType: "hourly",
    grossAmount: opts.hourly,
    payFrequency: "biweekly",
    hoursPerWeek: 40,
    overtimeHours: opts.overtime ?? 0,
    filingStatus: "single",
    state: opts.state,
  });
  return {
    title: opts.title,
    setup: opts.setup,
    annualGross: result.grossAnnual,
    netAnnual: result.netAnnual,
    netBiweekly: result.netPay,
    effectiveRate: result.effectiveTaxRate,
    highlight: opts.highlight,
  };
}

function taxBlurb(code: StateCode): string {
  const cfg = STATE_TAX[code];
  const name = STATE_NAMES[code];
  if (cfg.type === "none") {
    return `${name} has no state wage income tax for ${YEAR}`;
  }
  if (cfg.type === "flat") {
    const sd = cfg.standardDeduction?.single;
    return sd
      ? `${name} uses a flat ${pct(cfg.rate)} state income tax (about ${money(sd)} single standard deduction in our model)`
      : `${name} uses a flat ${pct(cfg.rate)} state income tax`;
  }
  const rates = cfg.brackets.map((b) => b.rate);
  const min = Math.min(...rates);
  const max = Math.max(...rates);
  return `${name} uses progressive state brackets from ${pct(min)} to ${pct(max)}`;
}

/** Local-tax honesty lines for Phase 2 states with known gaps or samples */
export function localCaveat(code: StateCode): string | null {
  switch (code) {
    case "IN":
      return "Indiana counties also levy local income tax (not fully mapped here) — enter a custom local % if your county withholds one.";
    case "KY":
      return "Some Kentucky localities add occupational license taxes (Louisville is sampled) — use a custom local % when needed.";
    case "MI":
      return "Some Michigan cities (e.g. Detroit) add local income tax — enter a Detroit ZIP or custom local %.";
    case "MO":
      return "St. Louis and Kansas City may add earnings taxes — use mapped ZIPs or a custom local %.";
    case "AL":
      return "Some Alabama cities levy occupational taxes — Birmingham is sampled; use custom local % elsewhere.";
    case "DE":
      return "Wilmington has a local wage tax sample in our ZIP map; other DE localities may differ.";
    case "NJ":
      return "A few New Jersey cities have local payroll taxes — Newark is sampled; use custom local % if applicable.";
    case "OR":
      return "Portland / Multnomah support taxes may apply — enter a Portland ZIP or custom local %.";
    case "CO":
      return "Colorado has no broad employee city income tax like NYC; Denver OPT is nominal in our map.";
    case "SC":
      return "South Carolina’s 2026 H.4216 rates (1.99% / 5.21%) and SCIAD replace older bracket tables — prefer SCDOR over stale blogs.";
    case "UT":
      return "Utah’s 2026 flat rate is 4.45% (SB 60), not 4.50% — prefer Utah Tax Commission updates over older snapshots.";
    case "NC":
      return "North Carolina’s 2026 flat rate is 3.99% (NCDOR); further cuts depend on later revenue triggers.";
    default:
      return null;
  }
}

export function getPhase2Scenarios(state: StateCode): PayScenario[] {
  if (isPhase1State(state)) return [];
  const name = STATE_NAMES[state];
  const cfg = STATE_TAX[state];
  const none = cfg.type === "none";

  return [
    runSalary({
      state,
      annual: 60000,
      title: `${name} $60k baseline`,
      setup: `Single filer · $60,000/year · ${name}`,
      highlight: none
        ? `No state wage tax — take-home is driven by federal withholding and FICA.`
        : `${taxBlurb(state)}. Open the calculator to adjust filing status or 401(k).`,
    }),
    runSalary({
      state,
      annual: 95000,
      preTax401kPercent: 6,
      title: `${name} $95k with 6% 401(k)`,
      setup: `Single filer · $95,000/year · 6% traditional 401(k)`,
      highlight: none
        ? `401(k) mainly reduces federal taxable wages in ${name} (FICA still applies to 401k wages).`
        : `Pre-tax 401(k) lowers federal and usually ${name} taxable wages on the same paycheck.`,
    }),
    runSalary({
      state,
      annual: 145000,
      filingStatus: "married",
      title: `${name} married household`,
      setup: `Married filing jointly · $145,000/year · ${name}`,
      highlight: none
        ? `Joint federal brackets help; ${name} still adds $0 state wage tax.`
        : `Joint filing changes federal withholding; ${name} state rules still apply to each paycheck.`,
    }),
    runHourly({
      state,
      hourly: 24,
      overtime: 6,
      title: `${name} hourly + OT`,
      setup: `$24/hr · 40 regular + 6 OT hours (1.5×)`,
      highlight: none
        ? `OT weeks raise federal and FICA only — still no ${name} state income tax on wages.`
        : `OT increases gross quickly; federal, ${name} state, and FICA all move with the higher check.`,
    }),
  ];
}

export function phase2ExtraFaqs(
  code: StateCode
): { question: string; answer: string }[] {
  if (isPhase1State(code)) return [];

  const name = STATE_NAMES[code];
  const cfg = STATE_TAX[code];
  const mid = calculatePaycheck({
    country: "US",
    payType: "salary",
    grossAmount: 60000 / 26,
    payFrequency: "biweekly",
    filingStatus: "single",
    state: code,
  });
  const caveat = localCaveat(code);

  const faqs: { question: string; answer: string }[] = [];

  if (cfg.type === "none") {
    faqs.push({
      question: `Does ${name} have state income tax on wages?`,
      answer: `No. ${name} does not tax ordinary wage income at the state level for ${YEAR}. You still pay federal income tax, Social Security (6.2%), and Medicare (1.45%). At $60,000 single, estimated take-home is about ${money(mid.netAnnual)}/year (${moneyExact(mid.netPay)} biweekly).`,
    });
    faqs.push({
      question: `How does a ${name} paycheck compare to California or New York?`,
      answer: `At the same gross salary, ${name} usually withholds less than California (progressive state tax + SDI) or New York (state ± NYC local). Use our California, New York, Texas, and Florida calculators alongside ${name} for a side-by-side view.`,
    });
  } else if (cfg.type === "flat") {
    faqs.push({
      question: `What is the ${name} state income tax rate for ${YEAR}?`,
      answer: `${taxBlurb(code)}. At $60,000 single, our paycheck estimate is about ${money(mid.netAnnual)}/year (${moneyExact(mid.netPay)} biweekly) after federal tax and FICA as well. Rates come from the same tables as the calculator engine.`,
    });
    faqs.push({
      question: `Does ${name} have local income tax on paychecks?`,
      answer: caveat
        ? caveat
        : `${name}’s main paycheck state line is the flat ${pct(cfg.rate)} tax in our model. If your city or county withholds a local tax, enter a custom local % (or a mapped ZIP when available).`,
    });
  } else {
    const rates = cfg.brackets.map((b) => b.rate);
    faqs.push({
      question: `How does ${name} state income tax work?`,
      answer: `${taxBlurb(code)} (${cfg.brackets.length} brackets in our ${YEAR} model${cfg.standardDeduction ? `, after a state standard deduction` : ""}). At $60,000 single, estimated take-home is about ${money(mid.netAnnual)}/year (${moneyExact(mid.netPay)} biweekly).`,
    });
    faqs.push({
      question: `Do I need to worry about local tax in ${name}?`,
      answer: caveat
        ? caveat
        : `Our ${name} estimate focuses on state income tax plus federal and FICA. If your locality withholds an additional employee income or occupational tax, add a custom local % for a closer match to your stub.`,
    });
  }

  return faqs;
}

export function phase2ExtraSections(
  code: StateCode
): { heading: string; body: string }[] {
  if (isPhase1State(code)) return [];

  const name = STATE_NAMES[code];
  const cfg = STATE_TAX[code];
  const mid = calculatePaycheck({
    country: "US",
    payType: "salary",
    grossAmount: 60000 / 26,
    payFrequency: "biweekly",
    filingStatus: "single",
    state: code,
  });
  const caveat = localCaveat(code);

  let body: string;
  if (cfg.type === "none") {
    body = `${name} is a no-state-wage-tax state for ${YEAR}: paycheck withholding is mainly federal Pub 15-T income tax, Social Security, and Medicare. At $60,000 single, we estimate about ${money(mid.netAnnual)} take-home (${moneyExact(mid.netPay)} biweekly · ~${mid.effectiveTaxRate.toFixed(1)}% effective). Compare with California or New York to see how much state/local tax changes net pay. ${caveat ?? ""}`.trim();
  } else if (cfg.type === "flat") {
    body = `${taxBlurb(code)}. Because the rate does not climb with income, ${name} estimates scale more predictably than multi-bracket states. At $60,000 single, estimated net is about ${money(mid.netAnnual)}/year (${moneyExact(mid.netPay)} biweekly). ${caveat ?? "Enter ZIP or a custom local % if your city withholds local tax."}`.trim();
  } else {
    body = `${taxBlurb(code)}. Filing status and deductions change federal withholding and, when configured, ${name} taxable wages. At $60,000 single, estimated take-home is about ${money(mid.netAnnual)}/year (${moneyExact(mid.netPay)} biweekly). ${caveat ?? "Use advanced options for 401(k) and W-4 settings for a closer stub match."}`.trim();
  }

  return [
    {
      heading: `What makes a ${name} paycheck different (${YEAR})`,
      body,
    },
  ];
}

export { YEAR as PHASE2_YEAR };
