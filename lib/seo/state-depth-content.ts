/**
 * Phase 3 — unique depth for all 50 US state paycheck pages.
 *
 * Each state gets: 1 “how tax works here” section + 2 long-tail FAQs.
 * Live $60k nets come from the calculator. Avoid new static tax %/$ claims
 * that are not already covered by the content-drift audit (use engine blurbs
 * or qualitative wording instead).
 */
import { calculatePaycheck } from "../calculator";
import type { StateCode } from "../types";
import { STATE_NAMES } from "../types";

const YEAR = 2026;

type DepthCopy = {
  /** Unique H2 angle — not a name-swapped template */
  howHeading: string;
  /** Qualitative + geography; optional {net} {biweekly} {effective} placeholders */
  howBody: string;
  faqs: { question: string; answer: string }[];
};

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

function mid60k(code: StateCode) {
  const zip =
    code === "NY" ? "10001" : code === "MD" ? "20814" : undefined;
  return calculatePaycheck({
    country: "US",
    payType: "salary",
    grossAmount: 60000 / 26,
    payFrequency: "biweekly",
    filingStatus: "single",
    state: code,
    zip,
  });
}

function fill(template: string, code: StateCode): string {
  const mid = mid60k(code);
  const name = STATE_NAMES[code];
  return template
    .replaceAll("{name}", name)
    .replaceAll("{net}", money(mid.netAnnual))
    .replaceAll("{biweekly}", moneyExact(mid.netPay))
    .replaceAll("{effective}", mid.effectiveTaxRate.toFixed(1));
}

/**
 * Unique editorial depth — one entry per state.
 * Placeholders: {name} {net} {biweekly} {effective}
 */
const DEPTH: Record<StateCode, DepthCopy> = {
  AL: {
    howHeading: "Alabama paycheck taxes beyond the state brackets",
    howBody:
      "Alabama’s progressive state income tax is only part of the story. Some cities add occupational license taxes (Birmingham is sampled in our ZIP map). Federal Pub 15-T withholding and FICA still dominate most stubs. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly · ~{effective}% effective). Enter a custom local % if your city withholds more than our sample.",
    faqs: [
      {
        question: "Do Alabama cities tax wages on top of state income tax?",
        answer:
          "Some do. Occupational or privilege taxes appear on certain city stubs. Use a mapped Birmingham ZIP when it applies, or set a custom local rate for other Alabama cities so the estimate matches your payslip more closely.",
      },
      {
        question: "Is Alabama take-home closer to Georgia or Florida?",
        answer:
          "Florida has no state wage tax; Georgia uses a flat statewide rate. Alabama sits between them for many mid salaries because of progressive state brackets plus possible city occupational tax. Compare our Alabama, Georgia, and Florida calculators at the same gross.",
      },
    ],
  },
  AK: {
    howHeading: "Why Alaska paychecks skip state income withholding",
    howBody:
      "Alaska has no state wage income tax and no statewide sales tax — rare nationally. Your paycheck still withholds federal income tax, Social Security, and Medicare. Permanent Fund Dividend income is separate from W-2 withholding. At $60,000 single, estimated net is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Does the Alaska Permanent Fund affect my paycheck calculator?",
        answer:
          "No. PFD payments are not ordinary wage withholding. This calculator models federal tax and FICA on wages only. Treat PFD as separate cash flow when budgeting annual take-home.",
      },
      {
        question: "How does Alaska compare to Washington for salary take-home?",
        answer:
          "Both skip state wage income tax on typical W-2 pay, so paycheck nets are often similar at the same salary and filing status. Cost of living and remote-work logistics differ more than the state income-tax line.",
      },
    ],
  },
  AZ: {
    howHeading: "Arizona flat-rate withholding for offer comparisons",
    howBody:
      "Arizona’s flat state income tax keeps paycheck math simpler than multi-bracket neighbors. Federal withholding and FICA still move with filing status and pre-tax benefits. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly). Compare with California and Nevada when weighing Southwest relocation.",
    faqs: [
      {
        question: "Will my Arizona paycheck change if I get a raise?",
        answer:
          "State withholding scales with taxable wages at the flat rate, so there is no bracket jump at the state level. Federal brackets can still change your effective combined rate after a raise.",
      },
      {
        question: "Does Arizona have city income tax on wages?",
        answer:
          "Arizona does not generally add NYC-style city income tax on employee wages. Most paycheck differences vs California come from Arizona’s flat state rate versus California’s progressive stack plus SDI.",
      },
    ],
  },
  AR: {
    howHeading: "Arkansas progressive tax on a typical salary stub",
    howBody:
      "Arkansas uses progressive state brackets, so lower wages face lighter state rates than high earners. Pair that with federal Pub 15-T and FICA for a full stub view. At $60,000 single, estimated net is about {net}/year ({biweekly} biweekly). Neighboring Texas (no state wage tax) is a common relocation comparison.",
    faqs: [
      {
        question: "Should I compare Arkansas take-home to Texas?",
        answer:
          "Yes if you are considering a move across the state line. Texas withholds $0 state wage tax; Arkansas adds progressive state tax on top of federal and FICA. Run both calculators at the same salary and filing status.",
      },
      {
        question: "Does filing jointly help an Arkansas paycheck estimate?",
        answer:
          "Joint filing mainly changes federal withholding brackets and the standard deduction. Arkansas state rules still apply to taxable wages — update filing status in the calculator to see both layers move together.",
      },
    ],
  },
  CA: {
    howHeading: "California paycheck stack: FTB, SDI, federal, and FICA",
    howBody:
      "A California stub usually shows progressive Franchise Tax Board withholding, employee SDI, federal income tax, Social Security, and Medicare. Form 540 exemption credits reduce state tax after brackets. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly · ~{effective}% effective). That is why CA vs TX/FL comparisons are so popular.",
    faqs: [
      {
        question: "Does California tax overtime the same as regular wages?",
        answer:
          "For this estimate, overtime increases gross wages and flows through federal, California state, SDI, and FICA like other wage income. Employer supplemental withholding methods can differ on short-term bonuses — use the bonus field when modeling a one-time payout.",
      },
      {
        question: "How do I model living in California but remote for an out-of-state employer?",
        answer:
          "Residency and work location rules can get complex. Start by selecting California so state + SDI apply, then confirm with payroll whether they also withhold another state’s tax. This tool is a planning estimate, not multi-state residency advice.",
      },
    ],
  },
  CO: {
    howHeading: "Colorado flat tax and paycheck predictability",
    howBody:
      "Colorado’s flat state income tax makes mid-career raise modeling straightforward: state withholding scales without bracket cliffs. Denver OPT in our map is nominal compared with NYC-style locals. At $60,000 single, estimated net is about {net}/year ({biweekly} biweekly). Compare with Utah and Arizona for Mountain West offers.",
    faqs: [
      {
        question: "Is Colorado better for take-home than California?",
        answer:
          "Often yes on the state income-tax line alone, because California adds progressive brackets plus SDI. Run identical salaries in both calculators — federal and FICA stay similar; the state/SDI gap drives most of the difference.",
      },
      {
        question: "Do Colorado TABOR refunds show up on my paycheck?",
        answer:
          "TABOR-related refunds or credits are usually handled on the annual return or as separate payments, not as a standard every-paycheck withholding line. Model ongoing wages here; treat one-time refunds separately.",
      },
    ],
  },
  CT: {
    howHeading: "Connecticut progressive tax for Tri-State workers",
    howBody:
      "Connecticut’s progressive brackets matter for earners commuting or comparing offers with New York and Massachusetts. Higher incomes face higher statewide marginal rates. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly). Local wage taxes are uncommon compared with NYC.",
    faqs: [
      {
        question: "How does Connecticut compare to New York for the same salary?",
        answer:
          "New York State tax plus NYC local (if you live in the city) often withholds more than Connecticut at mid-to-high salaries. Use ZIP 10001 on the NY page for a city-resident view, then compare with Connecticut at the same gross.",
      },
      {
        question: "Does Connecticut have a city wage tax like New York City?",
        answer:
          "Connecticut does not use an NYC-style city income tax on wages for most workers. Your main state paycheck line is Connecticut’s progressive income tax on top of federal and FICA.",
      },
    ],
  },
  DE: {
    howHeading: "Delaware progressive tax without statewide sales tax",
    howBody:
      "Delaware combines progressive state income tax with no statewide sales tax — paycheck withholding feels different from sales-tax-heavy no-income-tax states. Wilmington has a local wage tax sample in our ZIP map. At $60,000 single, estimated net is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Should Wilmington workers enter a ZIP on this calculator?",
        answer:
          "Yes if you want the sampled Wilmington local wage tax included. Other Delaware localities may differ — use a custom local % when your stub shows a line we do not map.",
      },
      {
        question: "Is Delaware take-home better than Pennsylvania?",
        answer:
          "It depends on PA local EIT. Pennsylvania’s state wage tax is flat, but many towns add local EIT; Delaware’s progressive state tax may be higher or lower after locals. Compare both pages at the same salary and add local % where needed.",
      },
    ],
  },
  FL: {
    howHeading: "Florida take-home when state wage tax is zero",
    howBody:
      "Florida withholds no state income tax on wages, so paycheck planning focuses on federal W-4 settings and FICA. Sales and property taxes affect cost of living but not the state income-tax line on your stub. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "What should Florida remote workers watch on their W-4?",
        answer:
          "Because there is no state wage tax, federal steps (multiple jobs, dependents credit, extra withholding) drive most of the paycheck variance. Match filing status and Step 2/3/4 carefully so federal withholding tracks your expected annual tax.",
      },
      {
        question: "Florida vs Georgia paycheck — which keeps more?",
        answer:
          "Georgia withholds a flat statewide income tax; Florida does not. At the same gross and filing status, Florida often nets more on the paycheck — confirm with both calculators, then weigh sales/property taxes separately.",
      },
    ],
  },
  GA: {
    howHeading: "Georgia flat-rate paychecks after recent rate cuts",
    howBody:
      "Georgia’s flat individual income tax and updated standard deduction shape {YEAR} withholding. The rate is easier to reason about than progressive neighbors, but it still stacks under federal and FICA. At $60,000 single, estimated net is about {net}/year ({biweekly} biweekly). Prefer Georgia DOR figures over older blog snapshots.",
    faqs: [
      {
        question: "How do I compare Atlanta offers to Florida offers?",
        answer:
          "Use the same salary, filing status, and 401(k) % in our Georgia and Florida calculators. Florida’s $0 state wage tax usually wins on the stub; Georgia’s flat rate is the main gap after federal and FICA.",
      },
      {
        question: "Does Georgia local income tax show on paychecks?",
        answer:
          "Georgia does not generally add NYC-style city income tax on wages. Most of the state paycheck line is the flat statewide tax in our model, plus federal and FICA.",
      },
    ],
  },
  HI: {
    howHeading: "Hawaii’s multi-bracket tax on island wages",
    howBody:
      "Hawaii’s progressive schedule has many brackets, so mid-level wages can reach higher state rates sooner than in flatter Midwestern systems. Federal and FICA still apply the same way as mainland states. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Why does Hawaii feel high-tax on a mid salary?",
        answer:
          "Progressive brackets with relatively low thresholds mean a larger share of ordinary wages can sit in higher state rates. Compare Hawaii with Washington or California at the same gross to see the paycheck gap.",
      },
      {
        question: "Are military or COLA payments handled differently?",
        answer:
          "Some military allowances are treated differently for tax purposes. This calculator models ordinary wage withholding. Confirm special pay types with your finance office or a tax professional.",
      },
    ],
  },
  ID: {
    howHeading: "Idaho paycheck estimates after the federal deduction link",
    howBody:
      "Idaho’s structure ties closely to federal taxable income concepts in our model, then applies the statewide rate after a small zero bracket. That keeps estimates predictable for salaried workers. At $60,000 single, estimated net is about {net}/year ({biweekly} biweekly). Compare with Washington and Utah for Northwest/Mountain offers.",
    faqs: [
      {
        question: "Idaho vs Washington — who nets more on salary?",
        answer:
          "Washington has no state wage income tax; Idaho does. At equal gross pay, Washington usually withholds less state tax. Run both calculators before relocating for remote or hybrid roles.",
      },
      {
        question: "Does Boise have a city income tax?",
        answer:
          "Idaho does not generally add large city income taxes like NYC. Focus on statewide withholding plus federal and FICA unless your stub shows a local line.",
      },
    ],
  },
  IL: {
    howHeading: "Illinois flat 4.95% — linear paycheck scaling",
    howBody:
      "Illinois uses a constitutional flat rate, so state withholding scales linearly with taxable wages in our estimate. City income taxes are uncommon compared with New York or Ohio. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly). Personal exemptions on the annual return are not fully modeled here.",
    faqs: [
      {
        question: "How does Illinois compare to Indiana for take-home?",
        answer:
          "Both use flat statewide structures, but Indiana counties often add local income tax. Illinois usually has no city income tax layer. Compare both pages and add an Indiana county local % when your stub includes one.",
      },
      {
        question: "Will a Chicago ZIP add local income tax here?",
        answer:
          "Chicago does not generally impose an employee city income tax like NYC. An Illinois estimate is mainly the flat state rate plus federal and FICA unless you enter a custom local % for a special case.",
      },
    ],
  },
  IN: {
    howHeading: "Indiana flat state tax plus county locals",
    howBody:
      "Indiana’s flat statewide rate is only the base layer — many counties add local income tax that payroll withholds automatically. Enter a custom local % when your county rate is not mapped. At $60,000 single (state only), estimated net is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Why is my Indiana stub higher than this estimate?",
        answer:
          "County local income tax is the most common gap. Add your county’s local percentage in advanced options (or a mapped ZIP when available) so state + local match your payslip.",
      },
      {
        question: "Indiana vs Ohio for city workers?",
        answer:
          "Ohio cities often levy municipal income tax (RITA/city). Indiana leans on county locals. Neither is “set and forget” without the local line — model both with the local % from your stub.",
      },
    ],
  },
  IA: {
    howHeading: "Iowa flat-rate paychecks after tax reform",
    howBody:
      "Iowa’s move to a flat statewide structure simplifies paycheck estimates compared with older multi-bracket years. Federal withholding and FICA still drive most period-to-period swings. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Does Iowa still use many state tax brackets?",
        answer:
          "Recent reforms flattened the individual income tax structure used in our engine. Treat older blog posts with multi-bracket Iowa tables as outdated unless they match current Iowa DOR guidance.",
      },
      {
        question: "How does Iowa compare to Illinois on a $60k salary?",
        answer:
          "Both are relatively flat statewide systems, but rates and deductions differ. Use the Iowa and Illinois calculators with identical inputs — the net gap is usually smaller than Iowa vs a no-tax state like South Dakota.",
      },
    ],
  },
  KS: {
    howHeading: "Kansas progressive brackets for Plains salaries",
    howBody:
      "Kansas progressive rates mean effective state tax rises as taxable income climbs. That matters when modeling promotions or moving from Missouri or Colorado. At $60,000 single, estimated net is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Kansas City, KS vs Kansas City, MO paycheck taxes?",
        answer:
          "They sit in different state systems. Missouri may add city earnings taxes in KCMO; Kansas uses statewide progressive brackets. Run both state pages and add local % when your city withholds it.",
      },
      {
        question: "Does Kansas have local income tax on wages?",
        answer:
          "Most Kansas paycheck variance vs neighbors comes from state brackets plus federal and FICA. If your locality withholds an extra employee tax, enter a custom local %.",
      },
    ],
  },
  KY: {
    howHeading: "Kentucky flat state tax and occupational licenses",
    howBody:
      "Kentucky’s flat statewide rate is straightforward, but some localities add occupational license taxes (Louisville is sampled). Always check the local line on your stub. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "What is a Kentucky occupational license tax?",
        answer:
          "It is a local tax on wages or net profits levied by some cities/counties. It appears separately from state income tax. Use a Louisville ZIP when sampled, or a custom local % for other Kentucky localities.",
      },
      {
        question: "Kentucky vs Tennessee take-home on wages?",
        answer:
          "Tennessee has no wage income tax; Kentucky withholds a flat state tax (plus possible local occupational tax). Tennessee usually nets more on the paycheck at the same gross — confirm with both calculators.",
      },
    ],
  },
  LA: {
    howHeading: "Louisiana flat tax after recent reforms",
    howBody:
      "Louisiana’s flat statewide rate and standard deduction simplify mid-salary estimates versus older bracket tables. Federal and FICA remain the other large paycheck lines. At $60,000 single, estimated net is about {net}/year ({biweekly} biweekly). Texas is the common no-tax neighbor comparison.",
    faqs: [
      {
        question: "Should I trust older Louisiana bracket charts online?",
        answer:
          "Often no. Reforms changed the structure toward a flat rate with a state standard deduction. Prefer Louisiana Department of Revenue updates and this calculator’s {YEAR} engine over outdated aggregator pages.",
      },
      {
        question: "Louisiana vs Texas for the same offer?",
        answer:
          "Texas withholds no state wage tax; Louisiana does. At equal salary and filing status, Texas typically shows higher net on the stub. Compare both calculators before accepting a Gulf Coast relocation.",
      },
    ],
  },
  ME: {
    howHeading: "Maine progressive tax for New England paychecks",
    howBody:
      "Maine’s progressive brackets rise with income, so high earners see a steeper statewide bite than entry-level wages. New Hampshire (no wage tax) is a frequent comparison for remote and border workers. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Maine vs New Hampshire — which paycheck is larger?",
        answer:
          "New Hampshire does not tax ordinary wages at the state level; Maine does. All else equal, NH usually withholds less state tax. Run both pages at the same gross to quantify the gap.",
      },
      {
        question: "Do Maine towns add local income tax?",
        answer:
          "Maine does not generally mirror Ohio/NYC local income taxes. Focus on statewide progressive tax plus federal and FICA unless your stub shows an unusual local line.",
      },
    ],
  },
  MD: {
    howHeading: "Maryland’s mandatory local “piggyback” income tax",
    howBody:
      "Every Maryland resident pays county or Baltimore City local income tax with state withholding — there is no opting out. Enter your ZIP (Montgomery 20814 is our default sample) so the county rate applies. At $60,000 single with a typical local, estimated net is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Why is Maryland take-home lower than Virginia at the same salary?",
        answer:
          "Maryland stacks progressive state brackets with mandatory local income tax. Virginia has progressive state tax but no Maryland-style county piggyback on every resident. Compare both calculators with realistic ZIPs.",
      },
      {
        question: "Can I pick a lower Maryland county rate in the calculator?",
        answer:
          "Yes — enter a ZIP for that county when mapped, or set a custom local % from the Comptroller’s published rates. Worcester’s lower local rate versus Montgomery/Baltimore City is a common example.",
      },
    ],
  },
  MA: {
    howHeading: "Massachusetts flat tax and high-earner surtax context",
    howBody:
      "Massachusetts applies a flat statewide tax on most wage income; very high earners may face an additional surtax on income above a high threshold (not the main mid-salary driver). At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly). Compare with NH and NY for New England/Tri-State offers.",
    faqs: [
      {
        question: "Does the Massachusetts surtax affect a $60k paycheck?",
        answer:
          "Usually no. The surtax targets much higher incomes. Mid-salary estimates are dominated by the flat statewide rate plus federal and FICA.",
      },
      {
        question: "Massachusetts vs New Hampshire remote-work take-home?",
        answer:
          "New Hampshire has no wage income tax; Massachusetts does. Residency and work location can affect which state taxes you — start with the state where you are taxed on wages, then confirm with payroll.",
      },
    ],
  },
  MI: {
    howHeading: "Michigan flat tax and city income tax pockets",
    howBody:
      "Michigan’s flat statewide rate covers most of the state line, but cities like Detroit add local income tax. Enter a Detroit ZIP or custom local % when that applies. At $60,000 single (state only), estimated net is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Does Detroit tax wages on top of Michigan state tax?",
        answer:
          "Yes. Detroit residents/workers can see city income tax on the stub. Use a Detroit ZIP when mapped or enter the city’s local rate so the estimate is not state-only.",
      },
      {
        question: "Michigan vs Ohio for auto-industry salaries?",
        answer:
          "Both can involve local layers (MI cities; OH municipal/RITA). Model state tax first, then add the local % from your actual stub — that local line often explains “calculator vs paycheck” gaps.",
      },
    ],
  },
  MN: {
    howHeading: "Minnesota progressive rates in the Upper Midwest",
    howBody:
      "Minnesota’s progressive brackets and relatively high top rates make high salaries feel heavier than in flat-tax Illinois or no-tax South Dakota. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly). Filing status still moves federal withholding materially.",
    faqs: [
      {
        question: "Minnesota vs Wisconsin take-home — which is closer?",
        answer:
          "Both use progressive systems; the gap depends on salary and filing status more than a single headline rate. Run identical inputs on both state pages for a fair offer comparison.",
      },
      {
        question: "Does Minneapolis add city income tax?",
        answer:
          "Minnesota estimates here focus on state income tax plus federal and FICA. If your locality withholds an extra employee tax, add a custom local %.",
      },
    ],
  },
  MS: {
    howHeading: "Mississippi’s simple wage tax threshold",
    howBody:
      "Mississippi’s structure taxes wages above a low untaxed amount at a flat-style statewide rate in our model — easier to explain than deep progressive stacks. At $60,000 single, estimated net is about {net}/year ({biweekly} biweekly). Alabama, Louisiana, and Tennessee are natural compare links.",
    faqs: [
      {
        question: "Is the first slice of Mississippi wages untaxed by the state?",
        answer:
          "Yes — our engine treats a portion of income as untaxed at the state rate before the statewide percentage applies. Federal income tax and FICA still apply from the first dollar of covered wages.",
      },
      {
        question: "Mississippi vs Tennessee paycheck comparison?",
        answer:
          "Tennessee has no wage income tax; Mississippi does. Tennessee usually nets more on the stub at the same gross. Use both calculators when comparing Southeast offers.",
      },
    ],
  },
  MO: {
    howHeading: "Missouri state tax plus KC / St. Louis earnings taxes",
    howBody:
      "Missouri uses progressive state brackets, and St. Louis or Kansas City workers may also see city earnings taxes. Mapped ZIPs help; otherwise enter a custom local %. At $60,000 single (state-focused), estimated take-home is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Do St. Louis and Kansas City tax wages locally?",
        answer:
          "They can. City earnings taxes are a frequent reason Missouri stubs differ from a state-only estimate. Use a mapped ZIP or custom local % from your payslip.",
      },
      {
        question: "Missouri vs Kansas for a border commute?",
        answer:
          "Different state systems and possible city taxes on either side make ZIP/local settings essential. Compare both state calculators with the local rates that actually appear on your stub.",
      },
    ],
  },
  MT: {
    howHeading: "Montana progressive tax without a general sales tax",
    howBody:
      "Montana pairs progressive income tax with no general statewide sales tax — paycheck withholding carries more of the state revenue story than sales-tax states. At $60,000 single, estimated net is about {net}/year ({biweekly} biweekly). Idaho and Wyoming are common relocation compares.",
    faqs: [
      {
        question: "Montana vs Wyoming take-home on salary?",
        answer:
          "Wyoming has no state wage income tax; Montana does. Wyoming usually shows higher net on the paycheck at the same gross — confirm with both calculators.",
      },
      {
        question: "Are Montana local wage taxes common?",
        answer:
          "Most Montana paycheck planning focuses on statewide progressive tax plus federal and FICA. Add a custom local % only if your stub shows an extra employee local line.",
      },
    ],
  },
  NE: {
    howHeading: "Nebraska progressive brackets for Midwest offers",
    howBody:
      "Nebraska’s progressive schedule means effective state tax rises with taxable income — important when modeling raises from $60k toward six figures. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly). Iowa and Kansas are nearby flat/progressive peers.",
    faqs: [
      {
        question: "How sensitive is a Nebraska paycheck to a raise?",
        answer:
          "Federal brackets and Nebraska progressive rates can both increase marginal withholding after a raise. Re-run the calculator at the new salary rather than scaling the old net linearly.",
      },
      {
        question: "Does Omaha add city income tax?",
        answer:
          "Nebraska estimates center on state income tax plus federal and FICA. If your city withholds a local tax, enter it as a custom local %.",
      },
    ],
  },
  NV: {
    howHeading: "Nevada’s no-income-tax paycheck advantage",
    howBody:
      "Nevada withholds no state income tax on wages, so stubs look closer to Texas/Florida than to California. Federal tax and FICA still apply every period. At $60,000 single, estimated net is about {net}/year ({biweekly} biweekly). Sales and tourism-driven taxes sit outside the wage line.",
    faqs: [
      {
        question: "Nevada vs California remote salary — who keeps more?",
        answer:
          "California adds progressive state tax and SDI; Nevada does not tax wages at the state level. At the same gross, Nevada often nets more on the paycheck — verify with both calculators and confirm residency rules with payroll.",
      },
      {
        question: "Do casino or tip jobs change Nevada withholding math?",
        answer:
          "Tips and service wages can have special reporting rules, but this tool still models ordinary wage withholding once gross is entered. Use your typical tipped gross for a planning estimate.",
      },
    ],
  },
  NH: {
    howHeading: "New Hampshire wages without state income tax",
    howBody:
      "New Hampshire does not tax ordinary W-2 wages at the state level — a major reason border workers compare NH with Massachusetts, Vermont, and Maine. Federal and FICA still withhold. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Is New Hampshire completely tax-free?",
        answer:
          "No. There is no wage income tax on typical salaries, but other taxes (and federal/FICA) still exist. This calculator focuses on paycheck wage withholding.",
      },
      {
        question: "NH vs MA for the same remote job offer?",
        answer:
          "If you are taxed as a New Hampshire wage earner, you usually skip MA state withholding on those wages. Residency and work location matter — use the state that matches how payroll taxes you, then compare nets.",
      },
    ],
  },
  NJ: {
    howHeading: "New Jersey progressive tax in the NYC metro orbit",
    howBody:
      "New Jersey’s progressive brackets and high top rates matter for earners comparing Jersey suburbs with NYC. A few cities have local payroll samples (Newark). Property taxes are separate from paycheck withholding. At $60,000 single, estimated net is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Should NJ residents who work in NYC use the NY calculator?",
        answer:
          "Multi-state commuting can involve NY wages and NJ residency credits — too complex for a single default. Start with where wages are taxed, then talk to payroll/tax pro for reciprocal/credit situations. Use both calculators for rough planning only.",
      },
      {
        question: "Does Newark local tax always apply?",
        answer:
          "Only when your situation matches a local payroll tax. Use a Newark ZIP when sampled or a custom local %; otherwise NJ state + federal + FICA is the core estimate.",
      },
    ],
  },
  NM: {
    howHeading: "New Mexico progressive tax for Southwest salaries",
    howBody:
      "New Mexico’s progressive brackets are moderate versus coastal high-tax states but still reduce take-home versus Texas’s $0 state wage tax. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly). Arizona and Colorado are frequent compare states.",
    faqs: [
      {
        question: "New Mexico vs Texas offer comparison tips?",
        answer:
          "Hold salary, filing status, and 401(k) equal in both calculators. Texas’s lack of state wage tax usually widens net pay; New Mexico adds progressive state withholding on top of federal and FICA.",
      },
      {
        question: "Does Albuquerque levy city income tax?",
        answer:
          "New Mexico estimates focus on statewide progressive tax plus federal and FICA. Add a custom local % only if your stub shows an employee local tax.",
      },
    ],
  },
  NY: {
    howHeading: "New York State vs NYC: two layers on one stub",
    howBody:
      "New York State progressive tax applies statewide; NYC residents add city resident tax. This page preloads ZIP 10001 so city local is included — clear the ZIP for upstate/state-only. At $60,000 single with NYC ZIP, estimated net is about {net}/year ({biweekly} biweekly · ~{effective}% effective).",
    faqs: [
      {
        question: "How do I estimate upstate New York take-home?",
        answer:
          "Clear the ZIP field (or use a non-NYC ZIP) so city resident tax is not applied. You will still see New York State tax plus federal and FICA.",
      },
      {
        question: "Why is my NYC paycheck lower than a Texas offer at the same salary?",
        answer:
          "NYC stacks state and city progressive taxes on top of federal and FICA; Texas has no state wage tax. The gap is expected — compare both calculators with identical gross and filing status.",
      },
    ],
  },
  NC: {
    howHeading: "North Carolina flat-rate withholding in {YEAR}",
    howBody:
      "North Carolina’s flat statewide rate (phase-down schedule) makes raise modeling simpler than progressive neighbors. Further cuts may depend on later revenue triggers — prefer NCDOR over stale blogs. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "North Carolina vs South Carolina for the same salary?",
        answer:
          "Both updated {YEAR} structures, but they are not identical. Run both calculators with the same inputs; do not reuse older multi-bracket SC tables or outdated NC rates from third-party posts.",
      },
      {
        question: "Does Charlotte or Raleigh add city income tax?",
        answer:
          "North Carolina paycheck estimates here are driven by the flat state rate plus federal and FICA. Enter a custom local % only if your stub shows an extra local wage tax.",
      },
    ],
  },
  ND: {
    howHeading: "North Dakota’s relatively light progressive tax",
    howBody:
      "North Dakota’s progressive brackets are mild compared with many coastal states, so federal and FICA dominate mid-salary stubs. At $60,000 single, estimated net is about {net}/year ({biweekly} biweekly). Minnesota and South Dakota are the natural compare pair (progressive vs no wage tax).",
    faqs: [
      {
        question: "North Dakota vs South Dakota take-home?",
        answer:
          "South Dakota has no state wage income tax; North Dakota has light progressive brackets. SD usually nets slightly more on the paycheck at the same gross — quantify it with both calculators.",
      },
      {
        question: "Are local wage taxes common in North Dakota?",
        answer:
          "Most estimates need only state tax plus federal and FICA. Add a custom local % if your locality withholds an employee tax.",
      },
    ],
  },
  OH: {
    howHeading: "Ohio state brackets and city municipal tax",
    howBody:
      "Ohio’s {YEAR} state structure exempts a slice of wages then applies a flat rate above that amount. Many cities add municipal income tax via RITA or the city — Cincinnati, Columbus, and Cleveland are sampled. At $60,000 single without city tax, estimated net is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Why doesn’t the Ohio estimate match my Columbus stub?",
        answer:
          "City municipal tax is the usual missing piece. Enter a Columbus ZIP when mapped or your city’s local percentage so state + municipal align with payroll.",
      },
      {
        question: "What is RITA on an Ohio paycheck?",
        answer:
          "RITA collects municipal income tax for many Ohio cities. The rate is city-specific. Use our custom local field when your city is not in the sample ZIP list.",
      },
    ],
  },
  OK: {
    howHeading: "Oklahoma progressive tax next to Texas",
    howBody:
      "Oklahoma’s progressive brackets sit beside Texas’s no-wage-tax regime — a frequent cross-border comparison for energy and logistics roles. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Oklahoma vs Texas — how big is the paycheck gap?",
        answer:
          "Texas withholds $0 state wage tax; Oklahoma adds progressive state tax. The dollar gap grows with salary. Compare both calculators before accepting a relocation package.",
      },
      {
        question: "Does Oklahoma City levy local income tax?",
        answer:
          "Oklahoma estimates focus on statewide progressive tax plus federal and FICA. Use a custom local % if your stub shows an additional employee local tax.",
      },
    ],
  },
  OR: {
    howHeading: "Oregon high progressive rates and no sales tax",
    howBody:
      "Oregon’s progressive income tax with high top rates — and no statewide sales tax — puts more of the tax burden on the paycheck than on the cash register. Portland / Multnomah support taxes may apply. At $60,000 single, estimated net is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Should Portland workers enter a ZIP?",
        answer:
          "Yes if you want Portland/Multnomah support taxes reflected. Use a Portland ZIP when mapped or a custom local % from your stub.",
      },
      {
        question: "Oregon vs Washington take-home comparison?",
        answer:
          "Washington has no state wage income tax; Oregon has relatively high progressive rates. Washington usually nets more on salary withholding — confirm with both calculators.",
      },
    ],
  },
  PA: {
    howHeading: "Pennsylvania’s flat state tax vs local EIT maze",
    howBody:
      "Pennsylvania’s state wage tax is a flat statewide rate, but thousands of municipalities/school districts may add local Earned Income Tax. Philadelphia and Pittsburgh are sampled; other towns need a custom local %. At $60,000 single (state only), estimated net is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Why is PA local tax so confusing?",
        answer:
          "EIT rates are set locally across many jurisdictions, not one statewide local rate. Always copy the local percentage from your stub or municipal site into the custom local field when your town is unmapped.",
      },
      {
        question: "Philadelphia wage tax vs Pennsylvania state tax?",
        answer:
          "They stack. Residents can see city wage tax on top of the flat state wage tax. Enter a Philadelphia ZIP or the city rate so both layers appear in the estimate.",
      },
    ],
  },
  RI: {
    howHeading: "Rhode Island progressive tax in a small-state market",
    howBody:
      "Rhode Island’s progressive brackets sit in the middle of New England — usually heavier than New Hampshire’s $0 wage tax and lighter than some NYC metro stacks. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Rhode Island vs Massachusetts paycheck at the same salary?",
        answer:
          "Both tax wages at the state level but with different structures (RI progressive vs MA flat on most wages). Run identical inputs on both calculators rather than assuming one is always lower.",
      },
      {
        question: "Does Providence add city income tax?",
        answer:
          "Rhode Island estimates focus on statewide progressive tax plus federal and FICA. Add a custom local % only if your payslip includes an employee local tax.",
      },
    ],
  },
  SC: {
    howHeading: "South Carolina’s {YEAR} two-rate structure",
    howBody:
      "South Carolina’s updated {YEAR} structure (and SCIAD in place of a federal-style standard deduction) replaced older multi-bracket tables — ignore stale blogs. At $60,000 single, estimated net is about {net}/year ({biweekly} biweekly). North Carolina and Georgia are the usual Southeast compares.",
    faqs: [
      {
        question: "Why do old South Carolina tax charts disagree with this calculator?",
        answer:
          "Law changes for {YEAR} updated rates and deduction mechanics. Prefer SCDOR and this engine over aggregator pages that still show prior-year brackets.",
      },
      {
        question: "South Carolina vs Florida relocation math?",
        answer:
          "Florida has no state wage tax; South Carolina does. Florida often wins on the paycheck line — compare both calculators, then factor sales/property taxes separately.",
      },
    ],
  },
  SD: {
    howHeading: "South Dakota paycheck without state wage tax",
    howBody:
      "South Dakota withholds no state income tax on wages. Federal income tax and FICA are the primary paycheck deductions. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly). North Dakota and Minnesota are common compare states.",
    faqs: [
      {
        question: "Is South Dakota good for take-home pay?",
        answer:
          "For wage income tax, yes — it ranks with other no-income-tax states. Overall cost of living still depends on property, sales, and housing costs outside the paycheck.",
      },
      {
        question: "SD vs MN for Upper Midwest offers?",
        answer:
          "Minnesota’s progressive state tax usually withholds more than South Dakota’s $0 state wage tax at the same salary. Quantify the gap with both calculators before relocating.",
      },
    ],
  },
  TN: {
    howHeading: "Tennessee wages with no state income tax",
    howBody:
      "Tennessee does not tax ordinary wages at the state level, so take-home often beats Kentucky, Alabama, or Georgia at the same gross. Federal and FICA still apply. At $60,000 single, estimated net is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Did Tennessee used to tax investment income?",
        answer:
          "Older Hall tax rules are not ordinary W-2 wage withholding. This calculator models wage paychecks: federal tax and FICA only for Tennessee salaries.",
      },
      {
        question: "Nashville vs Atlanta take-home on the same offer?",
        answer:
          "Georgia withholds flat state income tax; Tennessee does not tax wages. Tennessee usually nets more on the stub — confirm with the Tennessee and Georgia calculators.",
      },
    ],
  },
  TX: {
    howHeading: "Texas paycheck math when state income tax is zero",
    howBody:
      "Texas withholds no state income tax on wages — one of the clearest take-home advantages versus California or New York. Your stub still shows federal income tax, Social Security, and Medicare. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly). Property and sales taxes sit outside paycheck income-tax lines.",
    faqs: [
      {
        question: "Will moving to Texas increase my net pay immediately?",
        answer:
          "If you leave a state that withheld state income tax, yes — that line should drop to $0 on Texas wages (all else equal). Federal and FICA remain. Confirm with payroll that your work state/residency is set correctly.",
      },
      {
        question: "Texas vs Colorado for tech salaries?",
        answer:
          "Colorado withholds a flat state income tax; Texas does not. At equal gross and filing status, Texas usually nets more on the paycheck — compare both calculators side by side.",
      },
    ],
  },
  UT: {
    howHeading: "Utah flat-rate paychecks after SB 60",
    howBody:
      "Utah’s flat statewide rate for {YEAR} is slightly lower than older 4.50% snapshots — prefer Utah Tax Commission updates. Flat structure makes raise modeling linear at the state level. At $60,000 single, estimated net is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Utah vs Colorado take-home — are they similar?",
        answer:
          "Both use flat statewide structures, so mid-salary nets are often in the same neighborhood after federal and FICA. Run both calculators with identical inputs rather than assuming a large gap.",
      },
      {
        question: "Does Salt Lake City add local income tax?",
        answer:
          "Utah estimates focus on the flat state rate plus federal and FICA. Enter a custom local % only if your stub shows an employee local tax.",
      },
    ],
  },
  VT: {
    howHeading: "Vermont progressive tax for small-state employers",
    howBody:
      "Vermont’s progressive brackets rise with income, so six-figure roles withhold more state tax than entry-level wages. New Hampshire’s no-wage-tax regime is the frequent border comparison. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Vermont vs New Hampshire paycheck gap?",
        answer:
          "New Hampshire does not tax ordinary wages; Vermont does. NH usually nets more on the stub at the same gross — use both calculators for a precise dollar gap.",
      },
      {
        question: "Do Vermont towns levy local income tax?",
        answer:
          "Vermont estimates center on statewide progressive tax plus federal and FICA. Add a custom local % if your locality withholds an extra employee tax.",
      },
    ],
  },
  VA: {
    howHeading: "Virginia progressive tax without Maryland-style county piggyback",
    howBody:
      "Virginia uses progressive statewide brackets. Northern Virginia cost of living is high, but paycheck state tax follows statewide rules — there is no Maryland-style mandatory county income tax on every resident. At $60,000 single, estimated net is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Virginia vs Maryland for DC-metro workers?",
        answer:
          "Maryland adds mandatory county/Baltimore City local income tax; Virginia does not use that piggyback model. Many mid salaries net more in Virginia on the tax line alone — compare both calculators with realistic assumptions.",
      },
      {
        question: "Does Northern Virginia add a regional paycheck tax?",
        answer:
          "Virginia estimates here use statewide progressive tax plus federal and FICA. Enter a custom local % only if your stub shows an additional employee local tax.",
      },
    ],
  },
  WA: {
    howHeading: "Washington salary withholding without wage income tax",
    howBody:
      "Washington does not withhold state income tax on ordinary W-2 wages. Capital gains excise tax can hit certain high-earner gains but is not a standard paycheck line. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly) after federal and FICA.",
    faqs: [
      {
        question: "Washington vs Oregon for Seattle–Portland comparisons?",
        answer:
          "Oregon has high progressive state rates; Washington has $0 state wage tax. Washington usually nets more on salary withholding — confirm with both calculators.",
      },
      {
        question: "Does Seattle add city income tax on wages?",
        answer:
          "Washington paycheck estimates for ordinary wages are federal + FICA only in our model. If a special local deduction appears on your stub, enter a custom local %.",
      },
    ],
  },
  WV: {
    howHeading: "West Virginia progressive tax in Appalachian labor markets",
    howBody:
      "West Virginia’s progressive brackets are moderate for the region. Virginia, Ohio, and Pennsylvania are common compare states — each with different local-tax wrinkles. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "West Virginia vs Ohio when city tax is involved?",
        answer:
          "Ohio often adds municipal income tax; West Virginia estimates are mostly statewide progressive tax. Always include Ohio city % when comparing a Columbus/Cleveland offer to a WV salary.",
      },
      {
        question: "Are West Virginia local wage taxes common?",
        answer:
          "Most planning needs state tax plus federal and FICA. Use a custom local % if your city or county withholds an occupational or employee local tax.",
      },
    ],
  },
  WI: {
    howHeading: "Wisconsin progressive brackets for Great Lakes salaries",
    howBody:
      "Wisconsin’s progressive rates climb with income, so modeling a raise from $60k to $95k changes more than a flat-tax state would. At $60,000 single, estimated net is about {net}/year ({biweekly} biweekly). Illinois and Minnesota are the usual peer compares.",
    faqs: [
      {
        question: "Wisconsin vs Illinois flat-tax take-home?",
        answer:
          "Illinois uses a flat statewide rate; Wisconsin is progressive. Which nets more depends on salary band — compare both calculators at your exact offer instead of relying on a single headline rate.",
      },
      {
        question: "Does Milwaukee add city income tax?",
        answer:
          "Wisconsin estimates focus on statewide progressive tax plus federal and FICA. Enter a custom local % if your stub includes an employee local tax.",
      },
    ],
  },
  WY: {
    howHeading: "Wyoming’s no-income-tax paycheck profile",
    howBody:
      "Wyoming withholds no state income tax on wages. Federal income tax and FICA remain the primary paycheck deductions — similar to Texas, Florida, and South Dakota for salary withholding. At $60,000 single, estimated take-home is about {net}/year ({biweekly} biweekly).",
    faqs: [
      {
        question: "Wyoming vs Colorado for Mountain West offers?",
        answer:
          "Colorado withholds flat state income tax; Wyoming does not tax wages. Wyoming usually nets more on the paycheck at the same gross — verify with both calculators.",
      },
      {
        question: "Is Wyoming tax-free overall?",
        answer:
          "No. There is no state wage income tax on typical salaries, but federal tax, FICA, and other non-paycheck taxes can still apply. This tool estimates wage withholding only.",
      },
    ],
  },
};

/** Replace {YEAR} after other placeholders */
function finalize(text: string, code: StateCode): string {
  return fill(text, code).replaceAll("{YEAR}", String(YEAR));
}

export function stateDepthExtraSections(
  code: StateCode
): { heading: string; body: string }[] {
  const d = DEPTH[code];
  return [
    {
      heading: finalize(d.howHeading, code),
      body: finalize(d.howBody, code),
    },
  ];
}

export function stateDepthExtraFaqs(
  code: StateCode
): { question: string; answer: string }[] {
  const d = DEPTH[code];
  return d.faqs.map((f) => ({
    question: finalize(f.question, code),
    answer: finalize(f.answer, code),
  }));
}

/** For drift audit: qualitative static blurbs only (no live nets). */
export function collectStateDepthStaticBlobs(): { id: string; text: string }[] {
  const blobs: { id: string; text: string }[] = [];
  for (const code of Object.keys(DEPTH) as StateCode[]) {
    const d = DEPTH[code];
    // Strip live placeholders so audit does not treat {net} as money claims
    const staticHow = `${d.howHeading} ${d.howBody}`
      .replaceAll("{net}", "")
      .replaceAll("{biweekly}", "")
      .replaceAll("{effective}", "")
      .replaceAll("{name}", STATE_NAMES[code])
      .replaceAll("{YEAR}", String(YEAR));
    blobs.push({ id: `state-depth-how:${code}`, text: staticHow });
    d.faqs.forEach((f, i) => {
      const text = `${f.question} ${f.answer}`
        .replaceAll("{net}", "")
        .replaceAll("{biweekly}", "")
        .replaceAll("{effective}", "")
        .replaceAll("{name}", STATE_NAMES[code])
        .replaceAll("{YEAR}", String(YEAR));
      blobs.push({ id: `state-depth-faq:${code}:${i}`, text });
    });
  }
  return blobs;
}

export { YEAR as STATE_DEPTH_YEAR };
