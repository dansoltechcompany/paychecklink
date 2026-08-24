import { calculatePaycheck } from "../calculator";
import type { StateCode } from "../types";
import type { SEOPage } from "./types";

const YEAR = 2026;

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
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export interface PayScenario {
  title: string;
  setup: string;
  annualNet: string;
  periodNet: string;
  periodLabel: string;
  effectiveRate: string;
  tip: string;
}

function scenario(opts: {
  title: string;
  setup: string;
  tip: string;
  state: StateCode;
  annual?: number;
  hourly?: number;
  hours?: number;
  overtime?: number;
  frequency?: "biweekly" | "weekly" | "monthly";
  filingStatus?: "single" | "married" | "head";
  preTax401kPercent?: number;
  zip?: string;
}): PayScenario {
  const frequency = opts.frequency ?? "biweekly";
  const filingStatus = opts.filingStatus ?? "single";

  if (opts.hourly != null) {
    const result = calculatePaycheck({
      country: "US",
      payType: "hourly",
      grossAmount: opts.hourly,
      hoursPerWeek: opts.hours ?? 40,
      overtimeHours: opts.overtime ?? 0,
      payFrequency: frequency,
      filingStatus,
      state: opts.state,
      preTax401kPercent: opts.preTax401kPercent ?? 0,
      zip: opts.zip,
    });
    return {
      title: opts.title,
      setup: opts.setup,
      annualNet: moneyExact(result.netAnnual),
      periodNet: money(result.netPay),
      periodLabel: frequency,
      effectiveRate: `${result.effectiveTaxRate.toFixed(1)}%`,
      tip: opts.tip,
    };
  }

  const annual = opts.annual ?? 60000;
  const periods = frequency === "weekly" ? 52 : frequency === "monthly" ? 12 : 26;
  const result = calculatePaycheck({
    country: "US",
    payType: "salary",
    grossAmount: annual / periods,
    payFrequency: frequency,
    filingStatus,
    state: opts.state,
    preTax401kPercent: opts.preTax401kPercent ?? 0,
    zip: opts.zip,
  });

  return {
    title: opts.title,
    setup: opts.setup,
    annualNet: moneyExact(result.netAnnual),
    periodNet: money(result.netPay),
    periodLabel: frequency,
    effectiveRate: `${result.effectiveTaxRate.toFixed(1)}%`,
    tip: opts.tip,
  };
}

/** Unique real-number scenarios for CA / TX / NY / FL */
export const TOP_STATE_SCENARIOS: Partial<Record<StateCode, PayScenario[]>> = {
  CA: [
    scenario({
      title: "$75k single in California",
      setup: "Single filer · $75,000 salary · biweekly · no 401(k)",
      annual: 75000,
      state: "CA",
      tip: "California’s progressive brackets make mid salaries feel the state tax more than flat-tax states.",
    }),
    scenario({
      title: "$25/hr with overtime (CA)",
      setup: "Hourly $25 · 40 hrs + 5 OT at 1.5x · biweekly · single",
      hourly: 25,
      hours: 40,
      overtime: 5,
      state: "CA",
      tip: "Overtime raises gross quickly — check how FICA and CA tax scale with the extra hours.",
    }),
    scenario({
      title: "$120k married + 6% 401(k)",
      setup: "Married filing jointly · $120,000 · 6% traditional 401(k)",
      annual: 120000,
      filingStatus: "married",
      preTax401kPercent: 6,
      state: "CA",
      tip: "Pre-tax 401(k) lowers federal and California taxable wages on each paycheck.",
    }),
  ],
  TX: [
    scenario({
      title: "$75k single in Texas",
      setup: "Single filer · $75,000 salary · biweekly · no state income tax",
      annual: 75000,
      state: "TX",
      tip: "Texas take-home is mostly federal + FICA — often higher net than CA/NY at the same salary.",
    }),
    scenario({
      title: "$22/hr full time (TX)",
      setup: "Hourly $22 · 40 hrs/week · biweekly · single",
      hourly: 22,
      state: "TX",
      tip: "Use hourly mode to compare job offers when Texas employers quote wages by the hour.",
    }),
    scenario({
      title: "$100k + 10% 401(k) (TX)",
      setup: "Single · $100,000 · 10% traditional 401(k)",
      annual: 100000,
      preTax401kPercent: 10,
      state: "TX",
      tip: "Even with no state tax, 401(k) still cuts federal withholding and builds retirement savings.",
    }),
  ],
  NY: [
    scenario({
      title: "$75k upstate New York",
      setup: "Single · $75,000 · biweekly · NY state tax only (no NYC ZIP)",
      annual: 75000,
      state: "NY",
      tip: "Upstate vs NYC is a big swing — add ZIP 10001 in advanced options for city tax.",
    }),
    scenario({
      title: "$75k New York City resident",
      setup: "Single · $75,000 · biweekly · ZIP 10001 (NYC local tax)",
      annual: 75000,
      state: "NY",
      zip: "10001",
      tip: "NYC local tax stacks on top of NY state — net pay drops versus the same salary upstate.",
    }),
    scenario({
      title: "$30/hr NYC hourly",
      setup: "Hourly $30 · 40 hrs · biweekly · ZIP 10001 · single",
      hourly: 30,
      state: "NY",
      zip: "10001",
      tip: "Hourly workers in NYC should model local tax — it’s easy to miss on a national calculator.",
    }),
  ],
  FL: [
    scenario({
      title: "$75k single in Florida",
      setup: "Single · $75,000 · biweekly · no state income tax",
      annual: 75000,
      state: "FL",
      tip: "Like Texas, Florida withholds federal + FICA only for most wage employees.",
    }),
    scenario({
      title: "$20/hr + tips planning (FL)",
      setup: "Hourly $20 · 40 hrs · weekly pay · single",
      hourly: 20,
      frequency: "weekly",
      state: "FL",
      tip: "Hospitality and seasonal roles often use weekly pay — switch frequency to match your stub.",
    }),
    scenario({
      title: "$90k married in Florida",
      setup: "Married filing jointly · $90,000 · biweekly",
      annual: 90000,
      filingStatus: "married",
      state: "FL",
      tip: "Married status changes federal brackets — Florida still adds no state wage tax.",
    }),
  ],
};

export function getTopStateScenarios(code?: StateCode): PayScenario[] {
  if (!code) return [];
  return TOP_STATE_SCENARIOS[code] ?? [];
}

export function homePageExtras(): Pick<
  SEOPage,
  "contentSections" | "faqs"
> {
  return {
    contentSections: [
      {
        heading: `Free Paycheck Calculator for ${YEAR}`,
        body: `Estimate take-home pay in seconds. Enter salary or hourly wages, choose your state, and see federal income tax (IRS Pub 15-T withholding), state tax, Social Security, Medicare, and optional local tax. Built for the same job as ADP and PaycheckCity — fast, clear paycheck estimates.`,
      },
      {
        heading: "Salary, hourly, and take-home in one tool",
        body: "Switch between salary and hourly, model overtime, 401(k), and bonuses, and compare biweekly vs monthly net pay. Advanced options unlock full W-4 fields and ZIP-based local tax for cities like New York City and Philadelphia.",
      },
      {
        heading: "Popular states people search first",
        body: "Most visitors start with California, Texas, New York, or Florida. Each has a dedicated paycheck calculator with local tax notes and real example scenarios so you can benchmark offers before you accept.",
      },
      {
        heading: "How accurate is this paycheck calculator?",
        body: "We use IRS Publication 15-T percentage-method withholding, current FICA rates, state tax tables, and mapped local rates. Results are estimates — your employer’s benefits and exact W-4 can differ. See our methodology page for sources.",
      },
    ],
    faqs: [
      {
        question: "How is take-home pay calculated?",
        answer:
          "Take-home pay equals gross pay minus federal income tax withholding, state tax, local tax (if any), Social Security, Medicare, and pre-tax deductions like 401(k). Our US engine follows IRS Pub 15-T for federal withholding.",
      },
      {
        question: "Does this work for all 50 states?",
        answer:
          "Yes. Pick your state in the calculator or open a dedicated state page (for example California or Texas paycheck calculator). No-income-tax states like Texas and Florida still show federal tax and FICA.",
      },
      {
        question: "Can I calculate hourly take-home pay?",
        answer:
          "Yes. Choose hourly pay, enter your rate and hours (plus overtime). Or open the hourly paycheck calculator page for examples and FAQs focused on wage workers.",
      },
      {
        question: "Is this the same as ADP or PaycheckCity?",
        answer:
          "It’s the same category of tool: a free gross-to-net paycheck estimate. We add Pub 15-T W-4 controls, local ZIP tax, and clear methodology. No free calculator can guarantee a perfect match to every employer payslip.",
      },
    ],
  };
}

export function takeHomePageExtras(): Pick<
  SEOPage,
  "contentSections" | "faqs"
> {
  return {
    contentSections: [
      {
        heading: "What is take-home pay?",
        body: "Take-home pay (net pay) is what hits your bank account after taxes and deductions. Gross pay is before those cuts. This take-home pay calculator shows both per paycheck and annualized.",
      },
      {
        heading: "Gross vs net: why the gap feels large",
        body: "Federal withholding, FICA (7.65% for most wage levels), and state/local tax explain most of the gap. Pre-tax 401(k) or health premiums lower taxable wages but also reduce the cash you see today.",
      },
      {
        heading: "How to raise take-home pay (legally)",
        body: "Update your W-4 if you over-withhold, contribute to pre-tax benefits if that fits your plan, or compare offers in no-income-tax states. Use advanced options to model Step 2 (multiple jobs) and dependents credits.",
      },
      {
        heading: "Take-home pay by pay frequency",
        body: "Biweekly (26 checks) is most common. Weekly, semi-monthly, and monthly change the size of each deposit but not your true annual net — this calculator shows both views.",
      },
    ],
    faqs: [
      {
        question: "Is take-home pay the same as net pay?",
        answer:
          "Yes. Take-home pay and net pay both mean wages after taxes and deductions. Gross pay is before those amounts.",
      },
      {
        question: "Why is my take-home lower than a friend’s at the same salary?",
        answer:
          "Filing status, state, local tax, 401(k), health premiums, and W-4 extras all change withholding. Two people on $70k can have very different net pay.",
      },
      {
        question: "Does this calculator include state tax?",
        answer:
          "Yes. Select your state (or open a state page). Texas and Florida show $0 state income tax; California and New York apply state tax, and NYC can add local tax via ZIP.",
      },
    ],
  };
}

export function hourlyPageExtras(): Pick<
  SEOPage,
  "contentSections" | "faqs"
> {
  return {
    contentSections: [
      {
        heading: "Hourly paycheck calculator",
        body: "Enter your hourly rate, hours per week, and overtime to estimate net pay after federal, state, and FICA taxes. Perfect when offers are quoted as $/hour instead of salary.",
      },
      {
        heading: "Hourly to salary (quick math)",
        body: "Annual gross ≈ hourly rate × hours per week × 52. Example: $25 × 40 × 52 = $52,000 gross before tax. This page also converts that into take-home pay.",
      },
      {
        heading: "Overtime and take-home pay",
        body: "FLSA overtime is typically 1.5× after 40 hours. Extra gross increases federal withholding and FICA — use the overtime field to see the real net, not just 1.5× cash.",
      },
      {
        heading: "Hourly workers in high-tax cities",
        body: "If you work in New York City or another locality with wage tax, open advanced options and enter your ZIP so local tax is included in the hourly estimate.",
      },
    ],
    faqs: [
      {
        question: "How do I convert hourly wage to annual salary?",
        answer:
          "Multiply hourly rate by weekly hours and 52. Then run that through this calculator (or our hourly-to-salary page) to see after-tax pay.",
      },
      {
        question: "Does overtime get taxed higher?",
        answer:
          "Overtime is still ordinary wage income. It can push you into higher withholding for that period, but it is not a special higher tax bracket by itself.",
      },
      {
        question: "What if my hours change every week?",
        answer:
          "Enter an average week, or run best- and worst-case hours. Biweekly stubs often blend two different weeks.",
      },
    ],
  };
}

export { YEAR as TOP_CONTENT_YEAR };
