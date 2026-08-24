import { calculatePaycheck } from "../calculator";
import type { StateCode } from "../types";
import type { SEOPage } from "./types";

const YEAR = 2026;

export interface PayScenario {
  title: string;
  setup: string;
  annualGross: number;
  netAnnual: number;
  netBiweekly: number;
  effectiveRate: number;
  highlight: string;
}

function money(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function runScenario(opts: {
  state: StateCode;
  annual: number;
  filingStatus?: "single" | "married" | "head";
  preTax401kPercent?: number;
  zip?: string;
  title: string;
  setup: string;
  highlight: string;
}): PayScenario {
  const periods = 26;
  const result = calculatePaycheck({
    country: "US",
    payType: "salary",
    grossAmount: opts.annual / periods,
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

function runHourlyScenario(opts: {
  state: StateCode;
  hourly: number;
  hours?: number;
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
    hoursPerWeek: opts.hours ?? 40,
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

/** Unique real-world scenarios for top SEO states */
export function getTopStateScenarios(state: StateCode): PayScenario[] {
  switch (state) {
    case "CA":
      return [
        runScenario({
          state: "CA",
          annual: 55000,
          title: "Bay Area starter salary",
          setup: "Single filer · $55,000/year · no 401(k)",
          highlight:
            "California’s progressive state tax starts early — mid salaries still feel state withholding.",
        }),
        runScenario({
          state: "CA",
          annual: 120000,
          preTax401kPercent: 8,
          title: "Tech salary with 8% 401(k)",
          setup: "Single filer · $120,000/year · 8% traditional 401(k)",
          highlight:
            "Pre-tax 401(k) lowers federal and CA taxable wages while building retirement savings.",
        }),
        runScenario({
          state: "CA",
          annual: 180000,
          filingStatus: "married",
          title: "Dual-income household (joint)",
          setup: "Married filing jointly · $180,000 combined · no extras",
          highlight:
            "Joint filing changes federal withholding; CA still applies progressive state brackets.",
        }),
        runHourlyScenario({
          state: "CA",
          hourly: 28,
          overtime: 6,
          title: "Hourly + overtime week",
          setup: "$28/hr · 40 regular + 6 OT hours (1.5×)",
          highlight:
            "Overtime boosts gross quickly — federal, CA, and FICA all rise with the higher paycheck.",
        }),
      ];
    case "TX":
      return [
        runScenario({
          state: "TX",
          annual: 50000,
          title: "No state income tax advantage",
          setup: "Single filer · $50,000/year · Texas (0% state income tax)",
          highlight:
            "Same federal + FICA as other states, but $0 Texas wage income tax keeps more take-home.",
        }),
        runScenario({
          state: "TX",
          annual: 95000,
          preTax401kPercent: 6,
          title: "Houston professional with 401(k)",
          setup: "Single filer · $95,000/year · 6% 401(k)",
          highlight:
            "In Texas, 401(k) mainly reduces federal withholding (and still leaves FICA on 401k wages).",
        }),
        runScenario({
          state: "TX",
          annual: 140000,
          filingStatus: "married",
          title: "Austin household",
          setup: "Married filing jointly · $140,000/year",
          highlight:
            "No state tax + joint federal brackets often means stronger net vs high-tax coastal states.",
        }),
        runHourlyScenario({
          state: "TX",
          hourly: 22,
          overtime: 8,
          title: "Trades hourly with OT",
          setup: "$22/hr · 40 hrs + 8 OT",
          highlight:
            "Overtime weeks in Texas still only face federal + FICA on the extra gross.",
        }),
      ];
    case "NY":
      return [
        runScenario({
          state: "NY",
          annual: 65000,
          title: "Upstate salary (state tax only)",
          setup: "Single filer · $65,000/year · NY state · no NYC ZIP",
          highlight:
            "New York State tax applies statewide; local NYC tax is separate if you live in the city.",
        }),
        runScenario({
          state: "NY",
          annual: 85000,
          zip: "10001",
          title: "NYC resident local tax",
          setup: "Single filer · $85,000/year · ZIP 10001 (NYC local)",
          highlight:
            "NYC resident local tax stacks on top of NY state — a major take-home difference vs upstate.",
        }),
        runScenario({
          state: "NY",
          annual: 150000,
          filingStatus: "married",
          preTax401kPercent: 10,
          zip: "10001",
          title: "NYC dual earners + 401(k)",
          setup: "Married · $150,000 · 10% 401(k) · NYC ZIP",
          highlight:
            "High NY/NYC combined rates make pre-tax 401(k) especially valuable for take-home planning.",
        }),
        runHourlyScenario({
          state: "NY",
          hourly: 30,
          overtime: 4,
          title: "NY hourly with light OT",
          setup: "$30/hr · 40 hrs + 4 OT",
          highlight:
            "Hourly workers in NY still withhold NY state tax each paycheck (plus local if NYC).",
        }),
      ];
    case "FL":
      return [
        runScenario({
          state: "FL",
          annual: 48000,
          title: "No state income tax paycheck",
          setup: "Single filer · $48,000/year · Florida",
          highlight:
            "Florida has no wage income tax — take-home is mostly federal + Social Security + Medicare.",
        }),
        runScenario({
          state: "FL",
          annual: 90000,
          preTax401kPercent: 5,
          title: "Miami professional",
          setup: "Single filer · $90,000/year · 5% 401(k)",
          highlight:
            "Without state tax, small 401(k) changes show up mainly in federal withholding.",
        }),
        runScenario({
          state: "FL",
          annual: 160000,
          filingStatus: "married",
          title: "Tampa Bay household",
          setup: "Married filing jointly · $160,000/year",
          highlight:
            "Florida’s no-income-tax rule helps high earners keep more vs CA/NY at similar gross.",
        }),
        runHourlyScenario({
          state: "FL",
          hourly: 20,
          overtime: 10,
          title: "Hospitality / OT heavy week",
          setup: "$20/hr · 40 hrs + 10 OT",
          highlight:
            "Busy OT weeks raise FICA and federal withholding — still no Florida state income tax.",
        }),
      ];
    default:
      return [];
  }
}

export function formatScenarioBlurb(s: PayScenario): string {
  return `${s.setup}. Estimated take-home about ${money(s.netAnnual)}/year (${money(s.netBiweekly)} biweekly) · effective tax ~${s.effectiveRate.toFixed(1)}%. ${s.highlight}`;
}

export function topStateExtraSections(state: StateCode): SEOPage["contentSections"] {
  const scenarios = getTopStateScenarios(state);
  if (!scenarios.length) return [];

  const name =
    state === "CA"
      ? "California"
      : state === "TX"
        ? "Texas"
        : state === "NY"
          ? "New York"
          : "Florida";

  return [
    {
      heading: `${name} paycheck scenarios (${YEAR})`,
      body: scenarios.map((s) => `${s.title}: ${formatScenarioBlurb(s)}`).join(" "),
    },
    {
      heading: `How to get a closer ${name} estimate`,
      body:
        state === "NY"
          ? `Use advanced options: set filing status, 401(k), and enter a NYC ZIP (like 10001) if you are a city resident so local tax is included. Compare with our ${name} hourly and take-home pages for different pay types.`
          : state === "CA"
            ? `Open advanced options for W-4 Step 2 (multiple jobs), dependents credit, and 401(k). California’s progressive brackets mean small salary changes can move your state withholding.`
            : `Because ${name} has no state wage income tax, focus on federal W-4 settings, FICA, and pre-tax benefits. Use the hourly calculator if you are paid by the hour or work overtime.`,
    },
  ];
}

export function enhanceTopHubFaqs(): SEOPage["faqs"] {
  return [
    {
      question: "How is take-home pay calculated?",
      answer:
        "We estimate employer-style withholding: federal income tax (IRS Pub 15-T / W-4), state income tax when applicable, local tax when ZIP-mapped, Social Security, and Medicare. Pre-tax 401(k) and benefits reduce taxable wages per IRS rules.",
    },
    {
      question: "What taxes are deducted from my paycheck?",
      answer:
        "Typical US paychecks withhold federal income tax, state income tax (unless you are in a no-tax state like TX/FL), Social Security (6.2% up to the wage base), Medicare (1.45%), and sometimes local city tax (e.g. NYC).",
    },
    {
      question: "Is this paycheck calculator accurate?",
      answer:
        "It is built for paycheck withholding accuracy using Pub 15-T, FICA, state tables, and local ZIP rates — the same category as ADP and PaycheckCity free tools. Your real payslip can still differ due to benefits, rounding, or employer setup. See /methodology.",
    },
    {
      question: "Should I use hourly or salary mode?",
      answer:
        "Use salary mode for fixed pay per period. Use hourly mode for an hourly rate, weekly hours, and overtime at 1.5×. Both produce federal, state, and FICA estimates.",
    },
    {
      question: "Which states matter most for take-home pay?",
      answer:
        "California and New York (especially NYC) generally withhold more state/local tax. Texas and Florida have no state wage income tax, so take-home is often higher at the same gross salary.",
    },
  ];
}
