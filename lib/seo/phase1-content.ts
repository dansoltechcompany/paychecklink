/**
 * Phase 1 SEO content — CA, TX, NY, FL, MD, GA, IL, PA, OH, WA
 *
 * Unique FAQs + explanatory sections. Rate claims must match verified
 * engine sources (state DOR / primary bills), not stale aggregators.
 *
 * Note: does not import state-content.ts (avoids circular deps).
 */
import { calculatePaycheck } from "../calculator";
import type { StateCode } from "../types";

const YEAR = 2026;

export const PHASE1_STATES: StateCode[] = [
  "CA",
  "TX",
  "NY",
  "FL",
  "MD",
  "GA",
  "IL",
  "PA",
  "OH",
  "WA",
];

export function isPhase1State(code: StateCode): boolean {
  return PHASE1_STATES.includes(code);
}

function money(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function mid60kNet(code: StateCode): { netAnnual: number; netBiweekly: number } {
  const zip =
    code === "NY" ? "10001" : code === "MD" ? "20814" : undefined;
  const result = calculatePaycheck({
    country: "US",
    payType: "salary",
    grossAmount: 60000 / 26,
    payFrequency: "biweekly",
    filingStatus: "single",
    state: code,
    zip,
  });
  return { netAnnual: result.netAnnual, netBiweekly: result.netPay };
}

/** Extra FAQs appended after the shared 5 — state-specific long-tail queries */
export function phase1ExtraFaqs(
  code: StateCode
): { question: string; answer: string }[] {
  const mid = mid60kNet(code);

  switch (code) {
    case "CA":
      return [
        {
          question: "What is California SDI on my paycheck?",
          answer: `California State Disability Insurance (SDI) is an employee payroll tax at 1.3% for ${YEAR} with no wage cap (EDD). On a $60,000 salary that is about $780/year (~$30 biweekly), separate from federal, CA state income tax, Social Security, and Medicare.`,
        },
        {
          question:
            "Why is my California take-home lower than Texas at the same salary?",
          answer: `California withholds progressive state income tax (FTB Schedule X/Y/Z) plus SDI. Texas has no state wage income tax. At $60,000 single, our estimate is about ${money(mid.netAnnual)}/year in California vs a higher net in Texas after only federal + FICA — use both state calculators to compare.`,
        },
      ];
    case "TX":
      return [
        {
          question: "Is Texas really tax-free?",
          answer:
            "Texas has no state income tax on wages, so your paycheck skips state income withholding. You still pay federal income tax, Social Security (6.2%), and Medicare (1.45%). Property and sales taxes are separate and do not usually appear as paycheck income-tax lines.",
        },
        {
          question: "How does a Texas paycheck compare to California or New York?",
          answer: `At the same $60,000 gross, Texas take-home is often higher because there is $0 state wage tax. California adds progressive state tax + SDI; New York (especially NYC) adds state and local tax. Our estimate for Texas at $60,000 single is about ${money(mid.netAnnual)}/year.`,
        },
      ];
    case "NY":
      return [
        {
          question: "Does New York City have a separate local income tax?",
          answer:
            "Yes. NYC residents pay progressive city resident tax on top of New York State tax. Enter a NYC ZIP (e.g. 10001) in the calculator so local tax is included. Upstate or non-city ZIPs show NY state tax only.",
        },
        {
          question: "What is the difference between NY state tax and NYC tax?",
          answer:
            "NY State tax uses progressive brackets plus a standard deduction. NYC local tax is a separate progressive schedule on NY taxable income. On this page we preload ZIP 10001 so NYC local is included by default — clear the ZIP for a state-only estimate.",
        },
      ];
    case "FL":
      return [
        {
          question: "Does Florida have state income tax?",
          answer:
            "No. Florida does not tax wage income at the state level. A Florida paycheck typically withholds federal income tax, Social Security, and Medicare only (plus any benefits you elect).",
        },
        {
          question: "Is Florida a good state for take-home pay?",
          answer: `For paycheck income tax, Florida ranks with other no-wage-tax states (TX, WA, etc.). At $60,000 single, estimated take-home is about ${money(mid.netAnnual)}/year. Sales and property taxes still affect overall cost of living.`,
        },
      ];
    case "MD":
      return [
        {
          question: "Does Maryland have local income tax?",
          answer:
            "Yes — every Maryland resident pays a county or Baltimore City local income tax on top of state tax (Comptroller of Maryland). 2026 local rates range about 2.25%–3.30%. Enter your Maryland ZIP so we apply your county rate; otherwise we default to 3.20%.",
        },
        {
          question: "What is Maryland piggyback tax?",
          answer:
            "“Piggyback” means the local income tax is collected with your Maryland state return/withholding — you do not file a separate county return. Rates differ by county (e.g. Montgomery and Baltimore City 3.20%, Worcester 2.25%).",
        },
      ];
    case "GA":
      return [
        {
          question: "What is Georgia’s income tax rate in 2026?",
          answer:
            "Georgia’s flat individual income tax rate for 2026 is 4.99% under HB 463 (signed May 11, 2026, retroactive to January 1, 2026), down from 5.19%. The standard deduction is $15,000 single / $30,000 married filing jointly (Georgia DOR / Governor’s office).",
        },
        {
          question: "Did Georgia cut taxes in 2026?",
          answer:
            "Yes. HB 463 lowered the flat rate to 4.99% and raised standard deductions. Further cuts toward a 3.99% floor are authorized if revenue targets are met in later years.",
        },
      ];
    case "IL":
      return [
        {
          question: "What is the Illinois state income tax rate?",
          answer:
            "Illinois uses a flat 4.95% individual income tax (constitutional flat-rate structure). There is no Illinois standard deduction in our estimate; personal exemptions exist on returns but are not fully modeled in the paycheck engine.",
        },
        {
          question: "Does Illinois have local income tax on paychecks?",
          answer:
            "Illinois does not generally add city income tax like NYC or Philly. Most Illinois paycheck difference vs neighbors comes from the 4.95% flat state rate plus federal and FICA.",
        },
      ];
    case "PA":
      return [
        {
          question: "What is Pennsylvania EIT / local earned income tax?",
          answer:
            "Pennsylvania’s state wage tax is a flat 3.07%. Separately, many municipalities and school districts levy a local Earned Income Tax (EIT). There are roughly 2,500 local jurisdictions — we map Philadelphia and Pittsburgh samples; enter a custom local % for other PA localities.",
        },
        {
          question: "Does Philadelphia have a city wage tax?",
          answer:
            "Yes. Philadelphia imposes a resident city wage tax (we use about 3.75% for mapped Philly ZIPs) on top of Pennsylvania’s 3.07% state tax. Enter a Philadelphia ZIP or a custom local rate to include it.",
        },
      ];
    case "OH":
      return [
        {
          question: "Does Ohio have local income tax?",
          answer:
            "Yes. Many Ohio cities levy municipal income tax (often administered via RITA or the city). We sample Cincinnati, Columbus, and Cleveland — enter a custom local % for other Ohio cities. State tax for 2026 is 0% to $26,050 then 2.75% above.",
        },
        {
          question: "What is Ohio RITA?",
          answer:
            "RITA (Regional Income Tax Agency) collects municipal income tax for many Ohio cities. Rates and rules vary by city. Use our custom local tax field if your city’s rate is not in the ZIP samples.",
        },
      ];
    case "WA":
      return [
        {
          question: "Does Washington state have income tax?",
          answer:
            "Washington has no state wage income tax on typical W-2 paychecks. High earners may face a separate capital gains excise tax on certain long-term gains — that is not ordinary paycheck withholding.",
        },
        {
          question: "Is Washington a no-income-tax state for salary?",
          answer: `Yes for wages. At $60,000 single, estimated take-home is about ${money(mid.netAnnual)}/year after federal tax and FICA only (same pattern as TX/FL for salary withholding).`,
        },
      ];
    default:
      return [];
  }
}

/** Extra unique H2 sections for Phase 1 pages */
export function phase1ExtraSections(
  code: StateCode
): { heading: string; body: string }[] {
  const mid = mid60kNet(code);

  switch (code) {
    case "CA":
      return [
        {
          heading: `What makes a California paycheck different (${YEAR})`,
          body: `California stacks progressive FTB state income tax, employee SDI (1.3%, no wage cap), federal Pub 15-T withholding, and FICA. Form 540 personal exemption credits ($153 single / $306 married) reduce state tax after brackets. For a single filer at $60,000, we estimate about ${money(mid.netAnnual)} take-home (${money(mid.netBiweekly)} biweekly). Compare with Texas or Florida pages to see the no-state-tax gap.`,
        },
      ];
    case "TX":
      return [
        {
          heading: `What “no state income tax” means for a Texas paycheck`,
          body: `Texas does not withhold state income tax on wages. Your stub still shows federal income tax, Social Security, and Medicare. At $60,000 single, estimated net is about ${money(mid.netAnnual)}/year. That advantage vs California or New York is real for paycheck planning — but Texas often funds services through property and sales taxes outside the paycheck.`,
        },
      ];
    case "NY":
      return [
        {
          heading: `New York State vs New York City take-home`,
          body: `Every NY wage earner faces progressive state tax (with a NY standard deduction). NYC residents add progressive city tax — often another ~3–4% effective on mid salaries. This calculator preloads ZIP 10001 so NYC local is included; clear the ZIP for upstate/state-only. At $60,000 single with NYC ZIP, estimated net is about ${money(mid.netAnnual)}/year.`,
        },
      ];
    case "FL":
      return [
        {
          heading: `Florida paycheck basics with no state wage tax`,
          body: `Florida withholds no state income tax on wages. Model federal W-4 settings and FICA carefully — that is where most of the paycheck difference comes from. At $60,000 single, estimated take-home is about ${money(mid.netAnnual)}/year. Compare with Georgia (flat 4.99% in ${YEAR}) if you are weighing Southeast relocation.`,
        },
      ];
    case "MD":
      return [
        {
          heading: `Maryland state tax + mandatory county local tax`,
          body: `Maryland uses progressive state brackets plus a mandatory local income tax for every resident (Comptroller 2026 rates ~2.25%–3.30%). Enter your ZIP (e.g. Montgomery 20814) for the county rate; otherwise we apply a 3.20% default. At $60,000 single with a typical 3.20% local, estimated net is about ${money(mid.netAnnual)}/year — noticeably below no-tax states at the same gross.`,
        },
      ];
    case "GA":
      return [
        {
          heading: `Georgia ${YEAR} flat rate (HB 463)`,
          body: `Georgia’s flat rate is 4.99% for ${YEAR} under HB 463 (Governor Kemp, May 11, 2026), with a $15,000 single / $30,000 joint standard deduction — not the older 5.19% / $12,000 figures. At $60,000 single, estimated take-home is about ${money(mid.netAnnual)}/year. Always prefer Georgia DOR / official bill text over older aggregator snapshots.`,
        },
      ];
    case "IL":
      return [
        {
          heading: `Illinois flat 4.95% paycheck withholding`,
          body: `Illinois applies a flat 4.95% state income tax on wages. There is no progressive bracket climb, so estimates scale linearly with taxable wages. At $60,000 single, estimated net is about ${money(mid.netAnnual)}/year. Personal exemption amounts on Form IL-1040 are not fully modeled here — treat results as paycheck estimates.`,
        },
      ];
    case "PA":
      return [
        {
          heading: `Pennsylvania 3.07% state tax vs local EIT`,
          body: `Pennsylvania’s state wage tax is a flat 3.07% with no standard deduction in our model. Local Earned Income Tax (EIT) is separate and can add roughly 1%–4% depending on municipality/school district — Philadelphia and Pittsburgh are sampled; other PA towns need a custom local %. At $60,000 single (state only), estimated net is about ${money(mid.netAnnual)}/year.`,
        },
      ];
    case "OH":
      return [
        {
          heading: `Ohio state tax and city municipal tax`,
          body: `For ${YEAR}, Ohio taxes wages at 0% up to $26,050 then 2.75% above (flat structure after the exempt amount). Many cities add municipal income tax (RITA or city-administered). We sample Cincinnati, Columbus, and Cleveland — use custom local % elsewhere. At $60,000 single without city tax, estimated net is about ${money(mid.netAnnual)}/year.`,
        },
      ];
    case "WA":
      return [
        {
          heading: `Washington paycheck without wage income tax`,
          body: `Washington does not withhold state income tax on ordinary wages. Capital gains excise tax can apply to high earners on certain gains, but it is not a standard W-2 paycheck line. At $60,000 single, estimated take-home is about ${money(mid.netAnnual)}/year after federal + FICA — comparable to Texas and Florida for salary withholding.`,
        },
      ];
    default:
      return [];
  }
}

export { YEAR as PHASE1_YEAR };
