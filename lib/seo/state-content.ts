import { calculatePaycheck } from "../calculator";
import { STATE_TAX } from "../tax/state";
import type { StateCode } from "../types";
import { STATE_NAMES } from "../types";
import { phase1ExtraFaqs, phase1ExtraSections } from "./phase1-content";

const YEAR = 2026;

export interface StateTaxSummary {
  code: StateCode;
  name: string;
  hasIncomeTax: boolean;
  taxType: "none" | "flat" | "progressive";
  rateLabel: string;
  rateDetail: string;
  notes: string;
}

function formatPct(rate: number): string {
  return `${(rate * 100).toFixed(rate * 100 % 1 === 0 ? 0 : 2)}%`;
}

function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Unique editorial notes per state — not just name swaps */
const STATE_NOTES: Record<StateCode, string> = {
  AL: "Alabama uses a progressive state income tax with relatively low top brackets. Local occupational taxes may also apply in some cities.",
  AK: "Alaska has no state income tax and no state sales tax. Residents still pay federal income tax and FICA on wages.",
  AZ: "Arizona uses a flat state income tax rate. Paychecks are simpler to estimate than in progressive-tax states.",
  AR: "Arkansas has a progressive income tax. Lower earners face smaller rates; higher brackets apply as income rises.",
  CA: "California combines progressive FTB income tax (top brackets above 10%), Form 540 exemption credits, and employee SDI at 1.3% with no wage cap — a heavier paycheck stack than most states.",
  CO: "Colorado uses a flat state income tax. Your marginal state rate does not increase as your income rises.",
  CT: "Connecticut uses progressive brackets. Higher earners pay a higher statewide marginal rate than lower-income residents.",
  DE: "Delaware has progressive income tax brackets. There is no state sales tax, which affects overall cost of living more than paycheck withholding.",
  FL: "Florida has no state income tax on wages, which typically increases take-home pay versus high-tax states. Federal and FICA taxes still apply.",
  GA: "Georgia’s 2026 flat rate is 4.99% under HB 463 (down from 5.19%), with a $15,000 single / $30,000 joint standard deduction — verify against Georgia DOR, not older aggregator snapshots.",
  HI: "Hawaii has a multi-bracket progressive income tax. Even mid-level wages can land in higher state brackets.",
  ID: "Idaho uses a 5.3% rate after the federal standard deduction and a small zero bracket (Idaho STC Form 40).",
  IL: "Illinois uses a flat 4.95% state income tax. Local city income taxes are uncommon compared with NY, PA, or OH.",
  IN: "Indiana uses a flat state income tax. Counties may add local income taxes that further reduce take-home pay.",
  IA: "Iowa uses a flat state income tax after recent reforms, simplifying paycheck estimates statewide.",
  KS: "Kansas uses progressive income tax brackets. Your effective state rate rises with taxable income.",
  KY: "Kentucky uses a flat 3.5% state income tax for 2026 (HB 1). Some localities also levy occupational license taxes.",
  LA: "Louisiana uses a flat 3% state income tax after recent reforms, with a state standard deduction.",
  ME: "Maine has progressive income tax brackets. Higher incomes face a higher statewide marginal rate.",
  MD: "Maryland uses progressive state brackets, and every resident also pays a mandatory county or Baltimore City local income tax (about 2.25%–3.30% in 2026).",
  MA: "Massachusetts uses a flat state income tax on most wage income, with a surtax possible for very high earners.",
  MI: "Michigan uses a flat state income tax. Some cities (such as Detroit) add local income taxes.",
  MN: "Minnesota has progressive brackets with relatively high top rates compared with many Midwestern states.",
  MS: "Mississippi taxes 4% on income above $10,000 (first $10,000 untaxed at the state rate).",
  MO: "Missouri uses progressive brackets. St. Louis and Kansas City may add earnings taxes for city workers.",
  MT: "Montana uses progressive income tax brackets. There is no general statewide sales tax.",
  NE: "Nebraska uses progressive brackets. Effective state tax rises as taxable income moves into higher tiers.",
  NV: "Nevada has no state income tax on wages. Take-home pay is typically higher than in income-tax states after federal and FICA.",
  NH: "New Hampshire has no wage income tax. Most W-2 wages face no state income tax.",
  NJ: "New Jersey has progressive brackets with high top rates. Property taxes are separate from paycheck withholding.",
  NM: "New Mexico uses progressive income tax brackets. State rates are moderate compared with coastal high-tax states.",
  NY: "New York has progressive state income tax, and New York City residents also face local income tax — a major take-home difference vs upstate.",
  NC: "North Carolina uses a flat 3.99% state income tax for 2026 (NCDOR), down from prior years’ phase-down schedule.",
  ND: "North Dakota has progressive brackets with relatively low rates compared with many states.",
  OH: "Ohio’s 2026 state tax is 0% to $26,050 then 2.75% above; many cities also levy municipal income tax (RITA/city).",
  OK: "Oklahoma uses progressive brackets. State withholding applies on top of federal income tax and FICA.",
  OR: "Oregon has progressive income tax with high top rates and no statewide sales tax — paycheck tax can feel heavier than sales-tax states.",
  PA: "Pennsylvania’s state wage tax is a flat 3.07%; thousands of municipalities/school districts may add local EIT on top (Philly/Pittsburgh sampled).",
  RI: "Rhode Island uses progressive brackets. State rates sit in the mid range for New England.",
  SC: "South Carolina’s 2026 H.4216 structure uses 1.99% then 5.21% (SCIAD replaces the federal standard deduction).",
  SD: "South Dakota has no state income tax on wages. Federal tax and FICA still apply to every paycheck.",
  TN: "Tennessee has no wage income tax. Take-home pay after federal and FICA is typically higher than in taxed states.",
  TX: "Texas has no state income tax on wages — one of the biggest take-home advantages versus high-tax states. Federal and FICA still apply.",
  UT: "Utah’s 2026 flat rate is 4.45% under SB 60 (down from 4.50%), retroactive to January 1, 2026.",
  VT: "Vermont uses progressive brackets. Higher earners face higher statewide marginal rates.",
  VA: "Virginia uses progressive brackets. Northern Virginia cost of living is high, but state withholding follows statewide rates.",
  WA: "Washington has no state wage income tax on typical W-2 pay. High earners may face capital gains excise rules separately — not ordinary paycheck withholding.",
  WV: "West Virginia uses progressive brackets. State rates are moderate for the region.",
  WI: "Wisconsin uses progressive brackets. Higher incomes move into higher state marginal rates.",
  WY: "Wyoming has no state income tax on wages. Federal income tax and FICA remain the primary paycheck deductions.",
};

export function getStateTaxSummary(code: StateCode): StateTaxSummary {
  const name = STATE_NAMES[code];
  const config = STATE_TAX[code];

  if (config.type === "none") {
    return {
      code,
      name,
      hasIncomeTax: false,
      taxType: "none",
      rateLabel: "No state income tax",
      rateDetail: `${name} does not tax wage income at the state level.`,
      notes: STATE_NOTES[code],
    };
  }

  if (config.type === "flat") {
    return {
      code,
      name,
      hasIncomeTax: true,
      taxType: "flat",
      rateLabel: `${formatPct(config.rate)} flat`,
      rateDetail: `${name} applies a flat state income tax of ${formatPct(config.rate)} on taxable wages.`,
      notes: STATE_NOTES[code],
    };
  }

  const rates = config.brackets.map((b) => b.rate);
  const min = Math.min(...rates);
  const max = Math.max(...rates);
  const bracketCount = config.brackets.length;

  return {
    code,
    name,
    hasIncomeTax: true,
    taxType: "progressive",
    rateLabel: `${formatPct(min)} – ${formatPct(max)}`,
    rateDetail: `${name} uses a progressive state income tax with ${bracketCount} brackets, ranging from ${formatPct(min)} to ${formatPct(max)}.`,
    notes: STATE_NOTES[code],
  };
}

export interface ExamplePay {
  label: string;
  annualGross: number;
  netAnnual: number;
  netBiweekly: number;
  effectiveRate: number;
}

export function getStateExamplePays(code: StateCode): ExamplePay[] {
  const salaries = [40000, 60000, 100000];
  // Phase 1 accuracy: include typical local where mandatory / defaulted
  const zip =
    code === "NY" ? "10001" : code === "MD" ? "20814" : undefined;
  return salaries.map((annual) => {
    const result = calculatePaycheck({
      country: "US",
      payType: "salary",
      grossAmount: annual / 26,
      payFrequency: "biweekly",
      filingStatus: "single",
      state: code,
      zip,
    });
    return {
      label: formatMoney(annual),
      annualGross: annual,
      netAnnual: result.netAnnual,
      netBiweekly: result.netPay,
      effectiveRate: result.effectiveTaxRate,
    };
  });
}

export function buildStateContentSections(code: StateCode): {
  heading: string;
  body: string;
}[] {
  const s = getStateTaxSummary(code);
  const examples = getStateExamplePays(code);
  const mid = examples[1];

  return [
    {
      heading: `${s.name} Paycheck & State Tax Overview (${YEAR})`,
      body: `${s.rateDetail} ${s.notes} This ${s.name} paycheck calculator estimates federal income tax, ${s.hasIncomeTax ? "state income tax, " : ""}Social Security, and Medicare so you can see take-home pay per paycheck.`,
    },
    {
      heading: `Example ${s.name} Take-Home Pay`,
      body: `For a single filer earning $60,000/year in ${s.name}${code === "NY" ? " (NYC ZIP 10001)" : code === "MD" ? " (Montgomery County ZIP 20814)" : ""}, estimated take-home is about ${formatMoney(mid.netAnnual)} per year (${formatMoney(mid.netBiweekly)} biweekly), with an effective combined tax rate near ${mid.effectiveRate.toFixed(1)}%. Use the calculator above to plug in your exact salary, hourly wage, 401(k), or bonus.`,
    },
    {
      heading: `How to Use the ${s.name} PaycheckLink Calculator`,
      body: `Enter your gross salary or hourly rate, choose weekly, biweekly, or monthly pay, set filing status, and keep ${s.name} selected. Instantly see net pay after taxes — the same workflow as major payroll tools, built for ${s.name} ${YEAR} rates.`,
    },
    {
      heading: `What Comes Out of a ${s.name} Paycheck?`,
      body: s.hasIncomeTax
        ? `A typical ${s.name} paycheck deducts federal income tax, ${s.name} state income tax (${s.rateLabel}), Social Security (6.2% up to the wage base), and Medicare (1.45%). Pre-tax 401(k) contributions reduce taxable income and usually increase take-home later by lowering current tax.`
        : `Because ${s.name} has no state wage income tax, a typical paycheck mainly deducts federal income tax, Social Security (6.2%), and Medicare (1.45%). That often means higher take-home pay than in taxed states at the same gross salary.`,
    },
    {
      heading: `${s.name} Paycheck Calculator Tips for ${YEAR}`,
      body: s.hasIncomeTax
        ? `To get the most accurate estimate for ${s.name}, make sure your filing status matches your W-4. If you contribute to a traditional 401(k) or HSA, enter those in advanced options — they reduce federal (and usually ${s.name} state) taxable wages. Workers in cities with local taxes should enter their ZIP code or set a custom local rate. If your actual paycheck differs from the estimate, the most common causes are employer-specific benefits, local withholding not in our database, or supplemental wage handling for bonuses.`
        : `Even without state income tax, ${s.name} workers can optimize take-home further. Pre-tax 401(k) and HSA contributions lower federal taxable wages, reducing withholding on every paycheck. Use the advanced options to model different contribution levels and see how much more net pay you keep per period. If your paycheck still shows a local deduction, some ${s.name} jurisdictions levy small occupational or transit taxes — enter a custom local rate to account for those.`,
    },
    {
      heading: `Comparing ${s.name} to Other States`,
      body: s.hasIncomeTax
        ? `${s.name}'s state tax (${s.rateLabel}) means take-home on the same $60,000 salary will differ from no-tax states like Texas, Florida, Nevada, or Wyoming. Compare with our California, Texas, New York, and Florida calculators for side-by-side context. Keep in mind that lower state income tax does not always mean lower overall cost — property taxes, sales taxes, and cost of living also matter.`
        : `Because ${s.name} has no state income tax, workers keep more gross pay compared with states like California, New York, or Maryland (state + local). However, states without income tax may rely more heavily on sales or property taxes. Use our state calculators for California, Texas, New York, Florida, and Georgia to compare net paychecks.`,
    },
    ...phase1ExtraSections(code),
  ];
}

export function buildStateFaqs(code: StateCode): { question: string; answer: string }[] {
  const s = getStateTaxSummary(code);
  const examples = getStateExamplePays(code);
  const mid = examples[1];

  return [
    {
      question: `How much will I take home on a $60,000 salary in ${s.name}?`,
      answer: `A single filer earning $60,000 in ${s.name}${code === "NY" ? " with a NYC ZIP" : code === "MD" ? " with a typical county local tax" : ""} takes home roughly ${formatMoney(mid.netAnnual)} per year, or about ${formatMoney(mid.netBiweekly)} every two weeks, before benefits${code === "PA" || code === "OH" ? " (add local tax if your city levies it)" : ""}. Adjust the calculator for your filing status and deductions for a tighter estimate.`,
    },
    {
      question: `Does ${s.name} have state income tax?`,
      answer: s.hasIncomeTax
        ? `Yes. ${s.rateDetail} Your exact withholding also depends on W-4 settings and any local taxes.`
        : `No. ${s.name} does not tax wage income at the state level. You still pay federal income tax, Social Security, and Medicare.`,
    },
    {
      question: `Is ${s.name} a high-tax or low-tax state for paychecks?`,
      answer: !s.hasIncomeTax
        ? `${s.name} is among the no-income-tax states, so paycheck take-home is often higher than in progressive high-tax states — though cost of living and sales/property taxes still matter.`
        : s.taxType === "flat"
          ? `${s.name} uses a flat ${s.rateLabel} state income tax, which is simpler than progressive systems. Whether it feels high or low depends on your bracket elsewhere and local taxes.`
          : `${s.name} uses progressive rates (${s.rateLabel}). Lower incomes face lower state rates; higher earners pay more. Compare with our other state calculators to see the difference.`,
    },
    {
      question: `Can I calculate hourly take-home pay in ${s.name}?`,
      answer: `Yes. Switch to hourly pay in the calculator, enter your rate and hours (plus overtime if needed). The ${s.name} tax settings stay applied so you see net pay per paycheck.`,
    },
    {
      question: `How accurate is this ${s.name} paycheck calculator?`,
      answer: `It uses current federal brackets, FICA rates, and ${s.name} state tax rules for ${YEAR} from verified sources (state DOR / enacted bills where we have spot-checked). Actual paystubs can differ due to local taxes, benefits, extra withholdings, or employer rounding. Treat results as estimates, not tax advice. See our methodology page.`,
    },
    ...phase1ExtraFaqs(code),
  ];
}

export function getNeighborStateLinks(code: StateCode, limit = 8): StateCode[] {
  const order = Object.keys(STATE_NAMES) as StateCode[];
  const idx = order.indexOf(code);
  const neighbors: StateCode[] = [];
  for (let i = 1; neighbors.length < limit; i++) {
    const left = order[(idx - i + order.length) % order.length];
    const right = order[(idx + i) % order.length];
    if (left !== code) neighbors.push(left);
    if (neighbors.length < limit && right !== code) neighbors.push(right);
  }
  return neighbors.slice(0, limit);
}

export { YEAR as CONTENT_YEAR };
