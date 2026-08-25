import { calculatePaycheck } from "../calculator";
import type { StateCode } from "../types";
import { STATE_NAMES } from "../types";
import { getPhase2Scenarios } from "./phase2-content";
import { isPhase1State } from "./phase1-content";
import type { PayScenario, SEOPage } from "./types";

const YEAR = 2026;

export type { PayScenario };

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
    case "MD":
      return [
        runScenario({
          state: "MD",
          annual: 60000,
          zip: "20814",
          title: "Montgomery County $60k",
          setup: "Single · $60,000 · ZIP 20814 (3.20% local)",
          highlight:
            "Maryland state tax plus mandatory county local — every resident owes local income tax.",
        }),
        runScenario({
          state: "MD",
          annual: 95000,
          zip: "21201",
          preTax401kPercent: 6,
          title: "Baltimore City + 401(k)",
          setup: "Single · $95,000 · Baltimore City ZIP · 6% 401(k)",
          highlight:
            "Pre-tax 401(k) reduces Maryland taxable wages that both state and local tax use.",
        }),
        runScenario({
          state: "MD",
          annual: 140000,
          filingStatus: "married",
          zip: "20850",
          title: "Dual-income MD household",
          setup: "Married filing jointly · $140,000 · Montgomery ZIP",
          highlight:
            "Joint federal brackets help, but MD state + local still stack on each paycheck.",
        }),
        runHourlyScenario({
          state: "MD",
          hourly: 26,
          overtime: 5,
          title: "MD hourly with OT",
          setup: "$26/hr · 40 hrs + 5 OT",
          highlight:
            "OT raises federal, MD state, and (with a ZIP) county local withholding together.",
        }),
      ];
    case "GA":
      return [
        runScenario({
          state: "GA",
          annual: 60000,
          title: "Atlanta $60k at 4.99%",
          setup: "Single · $60,000 · Georgia HB 463 rate",
          highlight:
            "2026 flat 4.99% with $15,000 standard deduction — not the old 5.19% / $12k figures.",
        }),
        runScenario({
          state: "GA",
          annual: 110000,
          preTax401kPercent: 8,
          title: "Georgia professional + 401(k)",
          setup: "Single · $110,000 · 8% traditional 401(k)",
          highlight:
            "401(k) lowers Georgia taxable wages after the state standard deduction.",
        }),
        runScenario({
          state: "GA",
          annual: 160000,
          filingStatus: "married",
          title: "Married Georgia household",
          setup: "Married filing jointly · $160,000 · $30,000 GA SD",
          highlight:
            "HB 463 raised the joint standard deduction to $30,000 for 2026.",
        }),
        runHourlyScenario({
          state: "GA",
          hourly: 24,
          overtime: 6,
          title: "Georgia hourly + OT",
          setup: "$24/hr · 40 hrs + 6 OT",
          highlight:
            "Flat 4.99% keeps state withholding proportional when OT spikes gross.",
        }),
      ];
    case "IL":
      return [
        runScenario({
          state: "IL",
          annual: 60000,
          title: "Chicago-area $60k flat tax",
          setup: "Single · $60,000 · Illinois 4.95%",
          highlight:
            "Flat 4.95% scales linearly — no progressive state-bracket jump at mid salaries.",
        }),
        runScenario({
          state: "IL",
          annual: 100000,
          preTax401kPercent: 7,
          title: "Illinois $100k with 401(k)",
          setup: "Single · $100,000 · 7% 401(k)",
          highlight:
            "Pre-tax 401(k) cuts federal and Illinois taxable wages on the same paycheck.",
        }),
        runScenario({
          state: "IL",
          annual: 155000,
          filingStatus: "married",
          title: "Illinois dual earners",
          setup: "Married filing jointly · $155,000",
          highlight:
            "Joint federal status helps; Illinois still withholds flat 4.95% on state wages.",
        }),
        runHourlyScenario({
          state: "IL",
          hourly: 27,
          overtime: 4,
          title: "Illinois hourly week",
          setup: "$27/hr · 40 hrs + 4 OT",
          highlight:
            "OT weeks raise FICA and the flat Illinois line together.",
        }),
      ];
    case "PA":
      return [
        runScenario({
          state: "PA",
          annual: 60000,
          title: "PA state tax only (no EIT)",
          setup: "Single · $60,000 · 3.07% state · no local ZIP",
          highlight:
            "State flat 3.07% is only part of the story — many towns add EIT separately.",
        }),
        runScenario({
          state: "PA",
          annual: 75000,
          zip: "19103",
          title: "Philadelphia wage tax",
          setup: "Single · $75,000 · Philly ZIP (city wage tax)",
          highlight:
            "Philadelphia city wage tax stacks on Pennsylvania’s 3.07% state tax.",
        }),
        runScenario({
          state: "PA",
          annual: 120000,
          zip: "15222",
          preTax401kPercent: 6,
          title: "Pittsburgh + 401(k)",
          setup: "Single · $120,000 · Pittsburgh ZIP · 6% 401(k)",
          highlight:
            "Local EIT samples (Pittsburgh) plus state tax — other PA towns need a custom local %.",
        }),
        runHourlyScenario({
          state: "PA",
          hourly: 25,
          overtime: 5,
          title: "PA hourly + OT",
          setup: "$25/hr · 40 hrs + 5 OT",
          highlight:
            "Without a local ZIP this shows PA state tax only — add EIT if your municipality levies it.",
        }),
      ];
    case "OH":
      return [
        runScenario({
          state: "OH",
          annual: 60000,
          title: "Ohio state tax (no city)",
          setup: "Single · $60,000 · OH state only",
          highlight:
            "2026 structure: 0% to $26,050 then 2.75% — city tax is extra if your town levies it.",
        }),
        runScenario({
          state: "OH",
          annual: 80000,
          zip: "43215",
          title: "Columbus municipal tax",
          setup: "Single · $80,000 · Columbus ZIP",
          highlight:
            "Columbus municipal income tax stacks on Ohio state withholding.",
        }),
        runScenario({
          state: "OH",
          annual: 110000,
          zip: "44113",
          preTax401kPercent: 5,
          title: "Cleveland + 401(k)",
          setup: "Single · $110,000 · Cleveland ZIP · 5% 401(k)",
          highlight:
            "RITA/city rates vary — we sample major cities; enter custom % for others.",
        }),
        runHourlyScenario({
          state: "OH",
          hourly: 23,
          overtime: 8,
          title: "Ohio hourly OT week",
          setup: "$23/hr · 40 hrs + 8 OT",
          highlight:
            "OT increases state tax once wages exceed the $26,050 exempt amount.",
        }),
      ];
    case "WA":
      return [
        runScenario({
          state: "WA",
          annual: 55000,
          title: "No wage income tax",
          setup: "Single · $55,000 · Washington",
          highlight:
            "No state wage tax — paycheck lines are mainly federal + FICA.",
        }),
        runScenario({
          state: "WA",
          annual: 100000,
          preTax401kPercent: 8,
          title: "Seattle-area $100k + 401(k)",
          setup: "Single · $100,000 · 8% 401(k)",
          highlight:
            "401(k) reduces federal withholding; Washington still adds $0 state income tax.",
        }),
        runScenario({
          state: "WA",
          annual: 170000,
          filingStatus: "married",
          title: "Washington household",
          setup: "Married filing jointly · $170,000",
          highlight:
            "High earners still skip state wage tax; capital gains excise is separate from W-2 withholding.",
        }),
        runHourlyScenario({
          state: "WA",
          hourly: 29,
          overtime: 5,
          title: "Washington hourly + OT",
          setup: "$29/hr · 40 hrs + 5 OT",
          highlight:
            "OT weeks raise federal and FICA only — still no WA state income tax on wages.",
        }),
      ];
    default:
      return [];
  }
}

/** Phase 1 hand-crafted scenarios, or Phase 2 generated scenarios for all other states */
export function getStateScenarios(state: StateCode): PayScenario[] {
  const top = getTopStateScenarios(state);
  if (top.length) return top;
  return getPhase2Scenarios(state);
}

export function formatScenarioBlurb(s: PayScenario): string {
  return `${s.setup}. Estimated take-home about ${money(s.netAnnual)}/year (${money(s.netBiweekly)} biweekly) · effective tax ~${s.effectiveRate.toFixed(1)}%. ${s.highlight}`;
}

/** Phase 1 “how to get a closer estimate” tips — static rate claims audited for drift */
export function resolvePhase1StateTips(
  name: string
): Partial<Record<StateCode, string>> {
  return {
    NY: `Use advanced options: set filing status, 401(k), and enter a NYC ZIP (like 10001) if you are a city resident so local tax is included. Compare with our ${name} hourly and take-home pages for different pay types.`,
    CA: `Open advanced options for W-4 Step 2 (multiple jobs), dependents credit, and 401(k). California’s progressive brackets and SDI mean small salary changes can move your paycheck noticeably.`,
    TX: `Because ${name} has no state wage income tax, focus on federal W-4 settings, FICA, and pre-tax benefits. Use the hourly calculator if you are paid by the hour or work overtime.`,
    FL: `Because ${name} has no state wage income tax, focus on federal W-4 settings, FICA, and pre-tax benefits. Compare with Georgia’s 4.99% flat tax if you are weighing a move.`,
    MD: `Enter your Maryland ZIP so county local tax is correct (Comptroller rates differ). Without a ZIP we default to 3.20%. Pair with 401(k) modeling in advanced options.`,
    GA: `Confirm the ${YEAR} 4.99% rate and $15,000/$30,000 standard deduction (HB 463). Older articles citing 5.19% are stale.`,
    IL: `Illinois is a flat 4.95% — filing status mainly changes federal withholding. Use advanced options for 401(k) and dependents credit.`,
    PA: `Add a Philadelphia/Pittsburgh ZIP or a custom local % for EIT. State 3.07% alone understates many PA paystubs.`,
    OH: `Add a city ZIP (Columbus, Cleveland, Cincinnati) or custom municipal %. State tax alone misses RITA/city withholding.`,
    WA: `No state wage tax — prioritize federal W-4 and FICA. Capital gains excise is separate from ordinary paycheck withholding.`,
  };
}

export function topStateExtraSections(state: StateCode): SEOPage["contentSections"] {
  const scenarios = getStateScenarios(state);
  if (!scenarios.length) return [];

  const name = STATE_NAMES[state] ?? state;

  const tips = resolvePhase1StateTips(name);

  const genericTip = isPhase1State(state)
    ? `Use advanced options for W-4 settings, 401(k), and local ZIP when applicable. Compare neighboring state calculators for relocation planning.`
    : `Use advanced options for W-4 settings and 401(k). If your city withholds local tax, enter a ZIP or custom local %. Compare with California, Texas, New York, or Florida for take-home context.`;

  return [
    {
      heading: `${name} paycheck scenarios (${YEAR})`,
      body: scenarios.map((s) => `${s.title}: ${formatScenarioBlurb(s)}`).join(" "),
    },
    {
      heading: `How to get a closer ${name} estimate`,
      body: tips[state] ?? genericTip,
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
