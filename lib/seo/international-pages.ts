import type { CountryCode, ProvinceCode } from "../types";
import {
  ALL_PROVINCES,
  COUNTRIES,
  EUROPE_COUNTRIES,
  PROVINCE_NAMES,
} from "../types";
import type { SEOPage } from "./types";

const YEAR = 2026;

function countryFaqs(name: string, currency: string): SEOPage["faqs"] {
  return [
    {
      question: `How is take-home pay calculated in ${name}?`,
      answer: `Enter your gross salary in ${currency}, choose your pay frequency, and the calculator estimates income tax and mandatory social contributions for ${name}, then shows your net (take-home) pay.`,
    },
    {
      question: `Is the ${name} paycheck calculator accurate?`,
      answer: `It provides estimates using simplified ${YEAR} tax and social contribution rules for ${name}. Actual pay may differ due to personal allowances, local taxes, benefits, pension schemes, or employer deductions. Not tax advice.`,
    },
    {
      question: `Can I use this for hourly wages in ${name}?`,
      answer: `Yes. Switch to hourly pay, enter your rate and hours, and see estimated net pay after ${name} taxes and contributions.`,
    },
    {
      question: `What does take-home pay exclude?`,
      answer: `Estimates focus on income tax and mandatory social contributions. Optional pensions, student loans, union dues, and some local levies may not be included unless noted on the page.`,
    },
  ];
}

const COUNTRY_EXTRA: Partial<
  Record<CountryCode, { heading: string; body: string }[]>
> = {
  UK: [
    {
      heading: "England, Wales, Scotland & Northern Ireland",
      body: `Income Tax bands differ in Scotland. Use the Tax nation selector for Scotland vs England/Wales/Northern Ireland. National Insurance Class 1 employee rates are UK-wide. Personal Allowance (£12,570) tapers once annual income exceeds £100,000.`,
    },
    {
      heading: "What this UK calculator does not include yet",
      body: "Student loan repayments, workplace pension contributions, Scottish Student Awards, and some benefits-in-kind are not modeled. Add those manually against net pay if you need a closer payslip match.",
    },
  ],
  CA: [
    {
      heading: "Federal + provincial tax, CPP/QPP, and EI",
      body: `Canadian paystubs usually show federal income tax, provincial tax, Canada Pension Plan (or QPP in Quebec), and Employment Insurance. Select your province for a closer estimate — Ontario, British Columbia, Alberta, and Quebec are the highest-traffic lookups.`,
    },
    {
      heading: "Quebec differences",
      body: "Quebec uses QPP instead of CPP and a different EI rate. This calculator switches those labels and rates when Quebec is selected. Quebec Parental Insurance Plan (QPIP) is not included yet.",
    },
  ],
  AU: [
    {
      heading: "Australian resident tax + Medicare levy",
      body: `Australian take-home pay estimates combine resident income tax brackets with a simplified Medicare levy. Low-income Medicare exemptions, HELP/HECS repayments, and salary-sacrifice arrangements are not fully modeled.`,
    },
    {
      heading: "Pay frequency tips for Australia",
      body: "Most Australian salaried workers are paid fortnightly or monthly. Enter the gross for one pay period and match the frequency so annualised tax lines up with how payroll systems annualise wages.",
    },
  ],
  DE: [
    {
      heading: "German income tax and social contributions",
      body: `Germany combines progressive Lohnsteuer with employee social contributions (pension, health, unemployment, long-term care). Solidarity surcharge now applies mainly to higher earners — this tool only adds it above a simplified income threshold.`,
    },
  ],
  FR: [
    {
      heading: "French income tax and social charges",
      body: "France estimates include progressive income tax plus approximate employee social charges (CSG/CRDS-style). Family quotient, tax households, and mutuelle deductions can change real net pay.",
    },
  ],
  IE: [
    {
      heading: "Irish PAYE, USC, and PRSI",
      body: "Ireland estimates blend standard/higher rate Income Tax with a simplified USC + PRSI social component and a basic tax credit. Exact USC bands and PRSI classes can differ by employment type.",
    },
  ],
  NL: [
    {
      heading: "Netherlands Box 1 tax",
      body: "Dutch estimates use Box 1 rates that already blend income tax and national insurance for employees. 30% ruling, holiday allowance, and pension schemes are not modeled.",
    },
  ],
  ES: [
    {
      heading: "Spanish IRPF and social security",
      body: "Spain estimates combine progressive IRPF brackets with a capped employee Social Security contribution. Autonomous community IRPF adjustments are not fully modeled.",
    },
  ],
  IT: [
    {
      heading: "Italian IRPEF and INPS",
      body: "Italy estimates use simplified IRPEF brackets plus approximate INPS employee contributions. Regional/municipal add-ons and CCNL-specific deductions can change your payslip.",
    },
  ],
  SE: [
    {
      heading: "Swedish municipal and national tax",
      body: "Sweden estimates apply an average municipal tax rate plus national tax above the high-income threshold. Exact municipal rates vary by commune; employer social fees are separate from employee take-home.",
    },
  ],
  CH: [
    {
      heading: "Swiss federal + average cantonal tax",
      body: "Switzerland estimates blend federal progressive tax with an average cantonal/communal rate plus AHV/IV/EO and ALV. Actual cantonal rates vary widely — treat results as planning estimates.",
    },
  ],
};

function provinceExtra(name: string): { heading: string; body: string }[] {
  return [
    {
      heading: `${name} paycheck deductions explained`,
      body: `A typical ${name} paystub shows federal income tax, ${name} provincial or territorial tax, CPP or QPP, and Employment Insurance. Net pay is what remains after those mandatory withholdings (and any optional benefits your employer deducts).`,
    },
    {
      heading: `Tips for ${name} take-home estimates`,
      body: `Use annual or biweekly gross that matches your offer letter. If you contribute to an RRSP via payroll, your real taxable income may be lower than this estimate. Compare ${name} against Ontario, Alberta, or British Columbia pages if you are relocating within Canada.`,
    },
  ];
}

export function buildInternationalPages(): SEOPage[] {
  const pages: SEOPage[] = [];

  pages.push({
    slug: "uk-paycheck-calculator",
    title: `UK Paycheck Calculator ${YEAR} — Take Home Pay After Tax`,
    h1: "UK Paycheck Calculator",
    description: `Free UK take-home pay calculator for ${YEAR}. Estimate salary after income tax and National Insurance for England, Wales, Scotland & Northern Ireland.`,
    keywords: [
      "uk paycheck calculator",
      "uk take home pay calculator",
      "uk salary calculator after tax",
      "uk tax calculator salary",
      "take home pay calculator uk",
    ],
    category: "country",
    countryCode: "UK",
    defaults: {
      country: "UK",
      payFrequency: "monthly",
      grossAmount: COUNTRIES.UK.defaultGross,
      ukNation: "england",
    },
    faqs: countryFaqs("UK", "£"),
    contentSections: [
      {
        heading: `UK Take-Home Pay Calculator (${YEAR})`,
        body: `This UK paycheck calculator estimates net pay after Income Tax and employee National Insurance. Use it for monthly or annual salary, or switch to hourly wages. Choose England, Wales, Northern Ireland, or Scotland so Income Tax bands match your tax nation.`,
      },
      {
        heading: "What comes out of a UK paycheck?",
        body: "Most UK employees pay Income Tax (via PAYE) and Class 1 National Insurance. Personal Allowance, pension contributions, and student loan repayments can change your exact take-home pay. This tool models Income Tax + NI first — the core of UK payslip planning.",
      },
      ...(COUNTRY_EXTRA.UK ?? []),
    ],
  });

  pages.push({
    slug: "canada-paycheck-calculator",
    title: `Canada Paycheck Calculator ${YEAR} — Salary After Tax`,
    h1: "Canada Paycheck Calculator",
    description: `Free Canada salary paycheck calculator for ${YEAR}. Estimate take-home pay after federal tax, provincial tax, CPP, and EI for every province.`,
    keywords: [
      "canada paycheck calculator",
      "canada salary calculator",
      "canada take home pay calculator",
      "canadian tax calculator salary",
    ],
    category: "country",
    countryCode: "CA",
    defaults: {
      country: "CA",
      province: "ON",
      payFrequency: "biweekly",
      grossAmount: COUNTRIES.CA.defaultGross,
    },
    faqs: countryFaqs("Canada", "C$"),
    contentSections: [
      {
        heading: `Canada Salary After Tax (${YEAR})`,
        body: `Canadian take-home pay depends on federal tax brackets, your province, CPP (or QPP in Quebec), and EI. Select your province above for a closer estimate, then open a dedicated province page for more local context.`,
      },
      {
        heading: "Provincial paycheck calculators",
        body: "Use province pages for Ontario, British Columbia, Alberta, Quebec, and more — each preloads that province’s tax settings so you do not have to re-select every time.",
      },
      ...(COUNTRY_EXTRA.CA ?? []),
    ],
  });

  for (const code of ALL_PROVINCES) {
    const name = PROVINCE_NAMES[code];
    const slug = `${name.toLowerCase().replace(/\s+/g, "-")}-paycheck-calculator`;
    pages.push({
      slug,
      title: `${name} Paycheck Calculator ${YEAR} — Canada Take Home Pay`,
      h1: `${name} Paycheck Calculator`,
      description: `Free ${name} paycheck calculator for ${YEAR}. Estimate Canadian take-home pay after federal tax, ${name} provincial tax, CPP/QPP, and EI.`,
      keywords: [
        `${name.toLowerCase()} paycheck calculator`,
        `${name.toLowerCase()} salary calculator`,
        `${name.toLowerCase()} take home pay`,
        `canada ${name.toLowerCase()} tax calculator`,
      ],
      category: "province",
      countryCode: "CA",
      defaults: {
        country: "CA",
        province: code as ProvinceCode,
        payFrequency: "biweekly",
        grossAmount: COUNTRIES.CA.defaultGross,
      },
      faqs: countryFaqs(name, "C$"),
      contentSections: [
        {
          heading: `${name} Take-Home Pay`,
          body: `This ${name} paycheck calculator applies federal Canadian tax plus ${name} provincial/territorial tax, ${code === "QC" ? "QPP" : "CPP"}, and EI to estimate your net pay for ${YEAR}.`,
        },
        {
          heading: `How to calculate salary after tax in ${name}`,
          body: `Enter your gross salary or hourly wage, keep Canada / ${name} selected, and review federal, provincial, pension, and EI deductions per paycheck. Switch frequency to match how you are paid.`,
        },
        ...provinceExtra(name),
      ],
    });
  }

  const intl: CountryCode[] = ["AU", ...EUROPE_COUNTRIES];
  for (const code of intl) {
    const c = COUNTRIES[code];
    const isEurope = EUROPE_COUNTRIES.includes(code);
    pages.push({
      slug: c.slug,
      title: `${c.name} Paycheck Calculator ${YEAR} — Salary After Tax`,
      h1: `${c.name} Paycheck Calculator`,
      description: `Free ${c.name} paycheck / take-home pay calculator for ${YEAR}. Estimate net salary after income tax and social contributions (${c.currency}).`,
      keywords: [
        `${c.name.toLowerCase()} paycheck calculator`,
        `${c.name.toLowerCase()} salary calculator`,
        `${c.name.toLowerCase()} take home pay calculator`,
        `${c.name.toLowerCase()} salary after tax`,
        ...(isEurope
          ? [`${c.name.toLowerCase()} net salary calculator`]
          : []),
      ],
      category: isEurope ? "europe" : "country",
      countryCode: code,
      defaults: {
        country: code,
        payFrequency: "monthly",
        grossAmount: c.defaultGross,
      },
      faqs: countryFaqs(c.name, c.currencySymbol.trim()),
      contentSections: [
        {
          heading: `${c.name} Salary After Tax (${YEAR})`,
          body: `Estimate take-home pay in ${c.name} after income tax and mandatory contributions. Figures use simplified ${YEAR} rules for quick planning — not a full tax return or payroll software replacement.`,
        },
        {
          heading: `Using the ${c.name} net pay calculator`,
          body: `Enter gross pay in ${c.currency}, choose weekly/monthly/annual frequency, and see an instant net pay breakdown for ${c.name}. Compare with UK, Canada, or other European calculators if you are relocating.`,
        },
        ...(COUNTRY_EXTRA[code] ?? [
          {
            heading: `${c.name} estimate notes`,
            body: `${c.name} tax systems include local nuances (credits, family status, regional rates). This calculator gives a fast net-pay baseline so you can compare offers and pay frequencies.`,
          },
        ]),
      ],
    });
  }

  pages.push({
    slug: "europe-paycheck-calculator",
    title: `Europe Paycheck Calculators ${YEAR} — Take Home Pay by Country`,
    h1: "Europe Paycheck Calculators",
    description: `Take-home pay calculators for major European countries — Germany, France, Netherlands, Ireland, Spain, Italy, Sweden, Switzerland — updated for ${YEAR}.`,
    keywords: [
      "europe paycheck calculator",
      "europe take home pay calculator",
      "european salary calculator after tax",
    ],
    category: "country",
    countryCode: "DE",
    defaults: {
      country: "DE",
      payFrequency: "monthly",
      grossAmount: COUNTRIES.DE.defaultGross,
    },
    faqs: [
      {
        question: "Does Europe have one tax system?",
        answer:
          "No. Each European country has its own income tax and social contribution rules. Use the country calculators below for Germany, France, Netherlands, Ireland, and more.",
      },
      ...countryFaqs("Europe", "€"),
    ],
    contentSections: [
      {
        heading: "Paycheck calculators for major European countries",
        body: "Pick your country for a dedicated take-home pay calculator. Europe is structured like our US state pages — one page per tax jurisdiction, each with its own engine and currency.",
      },
      {
        heading: "How European take-home pay differs from the US",
        body: "European net pay often includes larger mandatory social contributions than a typical US FICA line, while income tax schedules and credits vary by country. Use Germany, France, Netherlands, Ireland, Spain, Italy, Sweden, or Switzerland pages for local estimates.",
      },
      {
        heading: "Choosing the right country page",
        body: "Start with the country where you are taxed as a resident employee. Cross-border workers, posted workers, and dual-tax treaties are outside this tool’s scope — those cases need local advice.",
      },
    ],
  });

  return pages;
}

export function getInternationalCountryLinks(): {
  name: string;
  href: string;
}[] {
  return [
    { name: "United Kingdom", href: "/uk-paycheck-calculator" },
    { name: "Canada", href: "/canada-paycheck-calculator" },
    { name: "Australia", href: "/australia-paycheck-calculator" },
    { name: "Ireland", href: "/ireland-paycheck-calculator" },
    { name: "Germany", href: "/germany-paycheck-calculator" },
    { name: "Netherlands", href: "/netherlands-paycheck-calculator" },
    { name: "France", href: "/france-paycheck-calculator" },
    { name: "Spain", href: "/spain-paycheck-calculator" },
    { name: "Italy", href: "/italy-paycheck-calculator" },
    { name: "Sweden", href: "/sweden-paycheck-calculator" },
    { name: "Switzerland", href: "/switzerland-paycheck-calculator" },
  ];
}
