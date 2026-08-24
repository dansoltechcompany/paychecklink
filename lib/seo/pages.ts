import type {
  CountryCode,
  PayFrequency,
  PayType,
  ProvinceCode,
  StateCode,
} from "../types";
import { ALL_STATES, STATE_NAMES } from "../types";
import { buildInternationalPages } from "./international-pages";
import {
  buildStateContentSections,
  buildStateFaqs,
  getStateTaxSummary,
} from "./state-content";
import {
  enhanceTopHubFaqs,
  getTopStateScenarios,
  topStateExtraSections,
} from "./top-content";
import type { PageCategory, PageDefaults, SEOPage } from "./types";

export type { PageCategory, PageDefaults, SEOPage };

const SITE_NAME = "PaycheckLink";
const YEAR = 2026;

const TOP_STATES: StateCode[] = ["CA", "TX", "NY", "FL"];

function hubFaqs(): SEOPage["faqs"] {
  return enhanceTopHubFaqs();
}

function buildStatePages(): SEOPage[] {
  return ALL_STATES.map((code) => {
    const s = getStateTaxSummary(code);
    const slug = `${s.name.toLowerCase().replace(/\s+/g, "-")}-paycheck-calculator`;
    const isTop = TOP_STATES.includes(code);

    return {
      slug,
      title: `${s.name} Paycheck Calculator ${YEAR} — Salary After Taxes`,
      h1: `${s.name} Paycheck Calculator`,
      description: s.hasIncomeTax
        ? `Free ${s.name} paycheck calculator for ${YEAR}. Estimate take-home pay after ${s.name} state tax (${s.rateLabel}), federal tax, Social Security, and Medicare.`
        : `Free ${s.name} paycheck calculator for ${YEAR}. ${s.name} has no state income tax — see take-home pay after federal tax, Social Security, and Medicare.`,
      keywords: [
        `${s.name.toLowerCase()} paycheck calculator`,
        `${s.name.toLowerCase()} salary paycheck calculator`,
        `${s.name.toLowerCase()} salary calculator`,
        `${s.name.toLowerCase()} take home pay calculator`,
        `${s.name.toLowerCase()} paycheck tax calculator`,
        `${s.name.toLowerCase()} salary after tax`,
        `${s.name.toLowerCase()} hourly paycheck calculator`,
      ],
      category: "state" as const,
      stateCode: code,
      priority: isTop ? "high" : "normal",
      defaults: {
        country: "US",
        state: code,
        payFrequency: "biweekly",
        grossAmount: Math.round((60000 / 26) * 100) / 100,
      },
      faqs: buildStateFaqs(code),
      contentSections: [
        ...buildStateContentSections(code),
        ...(isTop ? topStateExtraSections(code) : []),
      ],
      scenarios: isTop ? getTopStateScenarios(code) : undefined,
    };
  });
}

function buildStateVariants(): SEOPage[] {
  const variants: { state: StateCode; type: string; suffix: string; titleSuffix: string }[] = [
    { state: "CA", type: "salary", suffix: "salary-calculator", titleSuffix: "Salary Calculator" },
    { state: "TX", type: "salary", suffix: "salary-calculator", titleSuffix: "Salary Calculator" },
    { state: "NY", type: "salary", suffix: "salary-calculator", titleSuffix: "Salary Calculator" },
    { state: "FL", type: "salary", suffix: "salary-calculator", titleSuffix: "Salary Calculator" },
    { state: "CA", type: "takehome", suffix: "take-home-pay-calculator", titleSuffix: "Take Home Pay Calculator" },
    { state: "TX", type: "takehome", suffix: "take-home-pay-calculator", titleSuffix: "Take Home Pay Calculator" },
    { state: "NY", type: "takehome", suffix: "take-home-pay-calculator", titleSuffix: "Take Home Pay Calculator" },
    { state: "FL", type: "takehome", suffix: "take-home-pay-calculator", titleSuffix: "Take Home Pay Calculator" },
    { state: "CA", type: "tax", suffix: "paycheck-tax-calculator", titleSuffix: "Paycheck Tax Calculator" },
    { state: "TX", type: "tax", suffix: "paycheck-tax-calculator", titleSuffix: "Paycheck Tax Calculator" },
    { state: "NY", type: "tax", suffix: "paycheck-tax-calculator", titleSuffix: "Paycheck Tax Calculator" },
    { state: "FL", type: "tax", suffix: "paycheck-tax-calculator", titleSuffix: "Paycheck Tax Calculator" },
    { state: "CA", type: "hourly", suffix: "hourly-paycheck-calculator", titleSuffix: "Hourly Paycheck Calculator" },
    { state: "TX", type: "hourly", suffix: "hourly-paycheck-calculator", titleSuffix: "Hourly Paycheck Calculator" },
    { state: "NY", type: "hourly", suffix: "hourly-paycheck-calculator", titleSuffix: "Hourly Paycheck Calculator" },
    { state: "FL", type: "hourly", suffix: "hourly-paycheck-calculator", titleSuffix: "Hourly Paycheck Calculator" },
  ];

  return variants.map(({ state, type, suffix, titleSuffix }) => {
    const s = getStateTaxSummary(state);
    const slug = `${s.name.toLowerCase().replace(/\s+/g, "-")}-${suffix}`;
    const payType = type === "hourly" ? ("hourly" as const) : ("salary" as const);
    const gross = type === "hourly" ? 25 : Math.round((60000 / 26) * 100) / 100;
    const focus =
      type === "hourly"
        ? "hourly wage and overtime"
        : type === "takehome"
          ? "net take-home pay"
          : type === "tax"
            ? "paycheck tax withholding"
            : "annual and biweekly salary";

    return {
      slug,
      title: `${s.name} ${titleSuffix} ${YEAR} — After Tax`,
      h1: `${s.name} ${titleSuffix}`,
      description: `Free ${s.name} ${titleSuffix.toLowerCase()} for ${YEAR}. Calculate ${focus} after federal${s.hasIncomeTax ? `, ${s.name} state (${s.rateLabel}),` : ""} and FICA taxes.`,
      keywords: [
        `${s.name.toLowerCase()} ${suffix.replace(/-/g, " ")}`,
        `${s.name.toLowerCase()} salary after tax`,
        `${s.name.toLowerCase()} net pay calculator`,
        `${s.name.toLowerCase()} paycheck calculator`,
      ],
      category: "state-variant" as const,
      stateCode: state,
      priority: "high" as const,
      defaults: {
        country: "US",
        state,
        payType,
        payFrequency: "biweekly",
        grossAmount: gross,
      },
      faqs: buildStateFaqs(state),
      contentSections: [
        {
          heading: `${s.name} ${titleSuffix}`,
          body: `Use this ${s.name} ${titleSuffix.toLowerCase()} to estimate ${focus}. ${s.rateDetail} ${s.notes}`,
        },
        ...buildStateContentSections(state).slice(1, 3),
        ...topStateExtraSections(state),
      ],
      scenarios: getTopStateScenarios(state),
    };
  });
}

export const SEO_PAGES: SEOPage[] = [
  {
    slug: "",
    title: `Paycheck Calculator ${YEAR} — Salary, Take Home Pay & After Tax`,
    h1: "Paycheck Calculator",
    description: `Free paycheck calculator for ${YEAR}. Estimate take-home pay after federal (IRS Pub 15-T), state, FICA, and local taxes. Built for all 50 states — start with CA, TX, NY, or FL.`,
    keywords: [
      "paycheck calculator",
      "salary calculator",
      "pay calculator",
      "take home pay calculator",
      "payroll calculator",
      "calculator for paycheck",
      "calculator paycheck",
      "net pay calculator",
      "net salary calculator",
      "payroll check calculator",
      "gross pay calculator",
      "net earnings calculator",
      "take home salary calculator",
    ],
    category: "hub",
    priority: "high",
    defaults: {
      country: "US",
      payFrequency: "biweekly",
      grossAmount: Math.round((60000 / 26) * 100) / 100,
    },
    faqs: hubFaqs(),
    contentSections: [
      {
        heading: "How this paycheck calculator works",
        body: "Enter gross salary or hourly wages, pay frequency, filing status, and state. We estimate federal withholding with IRS Publication 15-T (W-4 compatible), state income tax, Social Security, Medicare, and optional local tax by ZIP — then show your net pay.",
      },
      {
        heading: "Compare top states: CA, TX, NY, FL",
        body: "California and New York generally withhold more state (and NYC local) tax. Texas and Florida have no state wage income tax, so take-home is often higher at the same gross. Use each state page for scenarios and preloaded tax settings.",
      },
      {
        heading: "Salary, hourly, and take-home tools",
        body: "Use the salary calculator for annual pay, the hourly calculator for rate + overtime, and the take-home pay calculator when you want a net-pay-first view. Advanced options unlock W-4 steps, 401(k), benefits, and local tax.",
      },
      {
        heading: "Paycheck calculator for all 50 states",
        body: "Every US state has a dedicated page with local tax notes and example net pay. International users can switch to UK, Canada, Australia, or Tier-1 European country calculators.",
      },
    ],
  },
  {
    slug: "salary-calculator",
    title: `Salary Calculator ${YEAR} — After Taxes & Take Home Pay`,
    h1: "Salary Calculator",
    description: `Free salary calculator for ${YEAR}. Convert annual salary to biweekly/monthly take-home pay after federal, state, and FICA taxes.`,
    keywords: [
      "salary calculator",
      "salary calculator after taxes",
      "salary after tax calculator",
      "after tax salary calculator",
      "annual salary calculator",
      "net salary calculator",
    ],
    category: "hub",
    priority: "high",
    defaults: { country: "US", payFrequency: "annual", grossAmount: 75000 },
    faqs: hubFaqs(),
    contentSections: [
      {
        heading: "Salary after tax calculator",
        body: "Enter your annual salary to see estimated federal withholding, state tax, FICA, and net pay per year and per paycheck. Switch states to compare California vs Texas vs Florida take-home.",
      },
      {
        heading: "Annual vs paycheck view",
        body: "Start with annual gross, then change frequency to biweekly or monthly to match how you are paid. The engine annualizes wages the same way payroll systems do.",
      },
    ],
  },
  {
    slug: "take-home-pay-calculator",
    title: `Take Home Pay Calculator ${YEAR} — Net Pay After Taxes`,
    h1: "Take Home Pay Calculator",
    description: `Free take home pay calculator for ${YEAR}. See net salary after federal, state, Social Security, Medicare, and optional local tax — with W-4 and 401(k) controls.`,
    keywords: [
      "take home pay calculator",
      "take home salary calculator",
      "net pay calculator",
      "net earnings calculator",
      "after tax salary calculator",
    ],
    category: "tax",
    priority: "high",
    defaults: {
      country: "US",
      payFrequency: "biweekly",
      grossAmount: Math.round((60000 / 26) * 100) / 100,
    },
    faqs: [
      {
        question: "What is take-home pay?",
        answer:
          "Take-home pay (net pay) is what hits your bank account after taxes and deductions. Gross pay is before those withholdings.",
      },
      {
        question: "Why is my take-home lower in CA or NY than TX or FL?",
        answer:
          "California and New York withhold state income tax (NYC adds local tax). Texas and Florida do not tax wages at the state level, so more of your gross usually remains after federal and FICA.",
      },
      {
        question: "How can I increase take-home pay legally?",
        answer:
          "Review W-4 extra withholding, contribute to pre-tax 401(k)/HSA where appropriate, and confirm your state and local settings. This calculator shows the paycheck impact instantly.",
      },
      ...hubFaqs(),
    ],
    contentSections: [
      {
        heading: "What is take-home pay?",
        body: "Take-home pay is gross wages minus federal income tax, state income tax (if any), local tax (if any), Social Security, Medicare, and elected deductions like 401(k).",
      },
      {
        heading: "How to use this take-home pay calculator",
        body: "Enter your gross pay and frequency, choose your state, then open advanced options for W-4 Step 2/3/4, 401(k), benefits, and ZIP-based local tax. Compare CA, TX, NY, and FL to see how state rules change net pay.",
      },
      {
        heading: "Take-home pay vs salary",
        body: "A $75,000 salary is not $75,000 in the bank. Use this page for net-pay planning, then jump to state pages for localized examples and scenarios.",
      },
    ],
  },
  {
    slug: "paycheck-tax-calculator",
    title: `Paycheck Tax Calculator ${YEAR} — Income Tax on Your Paycheck`,
    h1: "Paycheck Tax Calculator",
    description: `See how much tax is withheld from your paycheck. Federal (Pub 15-T), state, Social Security, and Medicare breakdown for ${YEAR}.`,
    keywords: [
      "paycheck tax calculator",
      "paycheck calculator after taxes",
      "income tax calculator",
      "salary calculator after taxes",
    ],
    category: "tax",
    priority: "high",
    defaults: {
      country: "US",
      payFrequency: "biweekly",
      grossAmount: Math.round((60000 / 26) * 100) / 100,
    },
    faqs: hubFaqs(),
    contentSections: [
      {
        heading: "Paycheck tax breakdown",
        body: "This tool separates federal income tax withholding, state tax, local tax, Social Security, and Medicare so you can see where each dollar goes.",
      },
      {
        heading: "Withholding vs year-end tax bill",
        body: "Paycheck calculators estimate employer withholding. Your April refund or balance due can differ. See /methodology for sources.",
      },
    ],
  },
  {
    slug: "weekly-paycheck-calculator",
    title: `Weekly Paycheck Calculator ${YEAR}`,
    h1: "Weekly Paycheck Calculator",
    description: `Calculate your weekly take-home pay after taxes. Free weekly paycheck calculator for ${YEAR}.`,
    keywords: ["weekly paycheck calculator"],
    category: "frequency",
    defaults: {
      country: "US",
      payFrequency: "weekly",
      grossAmount: Math.round((60000 / 52) * 100) / 100,
    },
    faqs: hubFaqs(),
    contentSections: [
      {
        heading: "Weekly pay calculator",
        body: "If you are paid weekly (52 paychecks per year), enter your weekly gross to estimate net pay after federal, state, and FICA taxes. Weekly pay is common in hospitality, retail, and construction — industries where workers need frequent cash flow.",
      },
      {
        heading: "How weekly pay affects withholding",
        body: "Employers annualize your weekly wages (multiply by 52) to determine the correct federal withholding bracket, then divide back down to one period. This means each weekly check reflects the same effective annual tax rate as biweekly or monthly pay — the per-period amount is simply smaller. FICA (Social Security at 6.2% and Medicare at 1.45%) applies identically regardless of pay frequency.",
      },
      {
        heading: "Weekly vs biweekly paycheck comparison",
        body: "A $60,000 annual salary splits into about $1,154 gross per week (52 checks) versus $2,308 gross per two weeks (26 checks). Net take-home per dollar is the same, but weekly pay helps with short-term budgeting while biweekly may align better with monthly bills. Use this calculator to see exact net for your weekly scenario, including state tax and optional 401(k) deductions.",
      },
      {
        heading: "Tips for weekly-paid workers",
        body: "Track overtime carefully — hours over 40 in a single week qualify for 1.5× pay under federal rules, and that extra income is taxed in the same period. If your gross fluctuates week to week, run the calculator with your typical and high-OT weeks separately to plan savings and expenses.",
      },
    ],
  },
  {
    slug: "biweekly-paycheck-calculator",
    title: `Biweekly Paycheck Calculator ${YEAR}`,
    h1: "Biweekly Paycheck Calculator",
    description: `Calculate your bi-weekly take-home pay after taxes. Most common pay schedule — 26 paychecks per year.`,
    keywords: ["biweekly paycheck calculator"],
    category: "frequency",
    priority: "high",
    defaults: {
      country: "US",
      payFrequency: "biweekly",
      grossAmount: Math.round((60000 / 26) * 100) / 100,
    },
    faqs: hubFaqs(),
    contentSections: [
      {
        heading: "Bi-weekly pay calculator",
        body: "Bi-weekly pay means 26 paychecks per year — the most common schedule for salaried employees in the United States. Enter your gross bi-weekly amount to see federal, state, and FICA withholding plus net pay. If you know only your annual salary, divide by 26 to get the per-period figure.",
      },
      {
        heading: "Why biweekly is the most popular pay frequency",
        body: "According to the Bureau of Labor Statistics, roughly 43% of U.S. private-sector workers are paid biweekly. Employers prefer it because it standardizes payroll processing to every other Friday while giving employees reasonably frequent deposits. Two months per year contain three pay dates — a useful budgeting detail many workers overlook.",
      },
      {
        heading: "Biweekly paycheck tax breakdown",
        body: "On a $60,000 salary (about $2,308 gross per period), a single filer in a state like California might see roughly $290 federal tax, $100 state tax, $143 Social Security, and $33 Medicare withheld — leaving approximately $1,742 net. In Texas (no state tax), the same gross yields roughly $1,842. Use the calculator above with your exact state and filing status for a personalized breakdown.",
      },
      {
        heading: "Optimizing your biweekly take-home",
        body: "If too much is withheld each period, review your W-4 — increasing allowable deductions (Step 4b) or dependents credit (Step 3) can raise net pay without waiting for a tax refund. Conversely, contributing to a pre-tax 401(k) reduces taxable income now. Model different scenarios instantly with our advanced options.",
      },
    ],
  },
  {
    slug: "monthly-paycheck-calculator",
    title: `Monthly Paycheck Calculator ${YEAR}`,
    h1: "Monthly Paycheck Calculator",
    description: `Calculate your monthly take-home pay after all taxes and deductions for ${YEAR}.`,
    keywords: ["monthly paycheck calculator"],
    category: "frequency",
    defaults: {
      country: "US",
      payFrequency: "monthly",
      grossAmount: Math.round((60000 / 12) * 100) / 100,
    },
    faqs: hubFaqs(),
    contentSections: [
      {
        heading: "Monthly net pay calculator",
        body: "See monthly net salary after federal tax, state tax, and FICA. Monthly pay (12 paychecks per year) is common among salaried professionals, educators, and government employees. Each paycheck is larger than biweekly but arrives less often — budgeting around one deposit per month requires planning for all expenses in a single cycle.",
      },
      {
        heading: "Monthly vs biweekly: which is better?",
        body: "Neither is inherently better for taxes — the annual withholding total is the same. However, monthly-paid workers receive about $5,000 gross per period on a $60,000 salary versus $2,308 biweekly. The higher single deposit can simplify rent and mortgage payments that are also monthly, but requires discipline to cover expenses through the full 30-day gap between checks.",
      },
      {
        heading: "How monthly withholding is calculated",
        body: "Your employer annualizes monthly wages (multiply by 12) to find the correct IRS withholding bracket, then divides the annual tax by 12 for each period. State tax and FICA work identically. The calculator above performs this exact annualization so your estimate matches real payroll math. Enter your monthly gross, select your state, and see the line-by-line deduction breakdown instantly.",
      },
    ],
  },
  {
    slug: "hourly-paycheck-calculator",
    title: `Hourly Paycheck Calculator ${YEAR} — Hourly to Salary`,
    h1: "Hourly Paycheck Calculator",
    description: `Free hourly paycheck calculator for ${YEAR}. Convert hourly wage + overtime to take-home pay after federal, state, and FICA taxes.`,
    keywords: [
      "hourly paycheck calculator",
      "hourly salary calculator",
      "hourly to salary calculator",
      "hourly take home pay",
    ],
    category: "paytype",
    priority: "high",
    defaults: {
      country: "US",
      payType: "hourly",
      payFrequency: "biweekly",
      grossAmount: 25,
    },
    faqs: [
      {
        question: "How do you calculate hourly take-home pay?",
        answer:
          "We convert your hourly rate and weekly hours (plus overtime at 1.5×) into pay-period wages, then apply federal withholding, state tax, Social Security, and Medicare.",
      },
      {
        question: "Does overtime change my tax rate?",
        answer:
          "Overtime increases gross wages for that period, so federal/state withholding and FICA usually rise. Your W-4 settings still drive the federal method.",
      },
      {
        question: "Hourly in Texas vs California — what’s different?",
        answer:
          "Texas has no state wage income tax; California withholds progressive state tax. Federal and FICA apply in both. Try each state page for scenario examples.",
      },
      ...hubFaqs().slice(0, 2),
    ],
    contentSections: [
      {
        heading: "Hourly wage to paycheck",
        body: "Enter your hourly rate, hours per week, and overtime hours. We estimate biweekly or weekly take-home after taxes so you can plan OT weeks.",
      },
      {
        heading: "Hourly vs salary comparison",
        body: "Switch to annual frequency to see equivalent salary, or use the hourly-to-salary converter. State choice (especially CA/TX/NY/FL) changes net pay a lot.",
      },
      {
        heading: "Tips for hourly workers",
        body: "Model a normal week and an OT-heavy week separately. Add 401(k)% in advanced options if your employer offers pre-tax retirement withholding.",
      },
    ],
  },
  {
    slug: "hourly-to-salary-calculator",
    title: `Hourly to Salary Calculator ${YEAR}`,
    h1: "Hourly to Salary Calculator",
    description: `Convert hourly wage to annual salary and see take-home pay. Free hourly to salary calculator for ${YEAR}.`,
    keywords: ["hourly to salary calculator"],
    category: "paytype",
    defaults: {
      country: "US",
      payType: "hourly",
      payFrequency: "annual",
      grossAmount: 25,
    },
    faqs: hubFaqs(),
    contentSections: [
      {
        heading: "Convert hourly to annual salary",
        body: "Multiply hourly rate × hours/week × 52 to get gross annual salary, then view after-tax take-home with state taxes applied. For example, $25/hour at 40 hours/week equals $52,000 gross per year before any taxes or deductions.",
      },
      {
        heading: "Why the conversion matters",
        body: "Job offers are often quoted as hourly or salary depending on the role. Converting between the two lets you compare positions fairly. A $30/hour job sounds different from $62,400/year — but they are the same gross. This tool shows both the conversion and the net take-home after federal, state, and FICA taxes so you can make informed career decisions.",
      },
      {
        heading: "Factors that affect the real salary equivalent",
        body: "Overtime, paid time off, and benefits change the true annual value of an hourly role. If you regularly work 45+ hours with 1.5× overtime, your effective annual income is higher than rate × 40 × 52. Use the overtime field in advanced options to model your actual work pattern and see a realistic salary-equivalent take-home.",
      },
    ],
  },
  {
    slug: "salary-to-hourly-calculator",
    title: `Salary to Hourly Calculator ${YEAR}`,
    h1: "Salary to Hourly Calculator",
    description: `Convert annual salary to hourly wage and calculate per-paycheck take-home pay for ${YEAR}.`,
    keywords: ["salary to hourly calculator"],
    category: "paytype",
    defaults: {
      country: "US",
      payType: "salary",
      payFrequency: "annual",
      grossAmount: 75000,
    },
    faqs: hubFaqs(),
    contentSections: [
      {
        heading: "Convert salary to hourly rate",
        body: "Divide annual salary by 2,080 hours (40 × 52) for a standard full-time hourly equivalent, then estimate taxes per paycheck. A $75,000 salary equals approximately $36.06/hour before taxes.",
      },
      {
        heading: "When this conversion is useful",
        body: "Freelancers setting rates, salaried workers evaluating overtime-eligible roles, or anyone comparing a salary offer against a contract rate benefit from this conversion. Knowing your effective hourly rate helps you value your time — especially when factoring in unpaid overtime that salaried exempt employees often work.",
      },
      {
        heading: "Net hourly rate after taxes",
        body: "Your true take-home per hour is lower than gross hourly because taxes apply. On a $75,000 salary in California, after federal, state, and FICA taxes you might net roughly $55,000 — which works out to about $26.44 per hour worked. In Texas, the same salary nets closer to $58,500 ($28.13/hour). Use the state selector above to see your specific after-tax hourly equivalent.",
      },
    ],
  },
  {
    slug: "401k-paycheck-calculator",
    title: `401k Paycheck Calculator ${YEAR} — See Impact on Take-Home Pay`,
    h1: "401(k) Paycheck Calculator",
    description: `See how 401(k) contributions affect your take-home pay and taxes. Free 401k paycheck calculator for ${YEAR}.`,
    keywords: ["401k paycheck calculator"],
    category: "extra",
    defaults: {
      country: "US",
      payFrequency: "biweekly",
      grossAmount: Math.round((60000 / 26) * 100) / 100,
      preTax401kPercent: 6,
    },
    faqs: [
      {
        question: "How does 401(k) affect my paycheck?",
        answer:
          "Traditional 401(k) contributions are pre-tax for federal (and usually state) income tax, but still subject to FICA. Your net pay drops by less than the contribution amount because taxable wages fall.",
      },
      ...hubFaqs(),
    ],
    contentSections: [
      {
        heading: "401(k) impact on paycheck",
        body: "Pre-tax 401(k) lowers federal income tax withholding while Social Security and Medicare generally still apply to those wages. For example, contributing 6% of a $60,000 salary ($3,600/year) reduces your taxable income and saves roughly $792 in federal tax annually at the 22% bracket — meaning your net pay only drops by about $2,808 even though $3,600 goes into retirement.",
      },
      {
        heading: "Traditional 401(k) vs Roth 401(k)",
        body: "Traditional (pre-tax) 401(k) reduces your current taxable wages — you pay less tax now but owe tax on withdrawals in retirement. Roth 401(k) contributions are post-tax — your current paycheck is smaller, but withdrawals in retirement are tax-free. This calculator models traditional pre-tax contributions. For Roth, enter the same amount under post-tax deductions to see the net-pay impact.",
      },
      {
        heading: "Choosing the right 401(k) percentage",
        body: `Financial planners often recommend contributing at least enough to capture your employer match (commonly 3–6%). Beyond that, the IRS allows up to $23,500 in employee contributions for ${YEAR} ($31,000 if age 50+). Use the 401(k) percentage field above to model different contribution rates and instantly see how each level affects your biweekly or monthly take-home pay.`,
      },
    ],
  },
  {
    slug: "overtime-paycheck-calculator",
    title: `Overtime Paycheck Calculator ${YEAR}`,
    h1: "Overtime Paycheck Calculator",
    description: `Calculate take-home pay with overtime hours at 1.5x rate. Free overtime paycheck calculator for ${YEAR}.`,
    keywords: ["overtime paycheck calculator"],
    category: "extra",
    defaults: {
      country: "US",
      payType: "hourly",
      payFrequency: "biweekly",
      grossAmount: 25,
      overtimeHours: 5,
    },
    faqs: hubFaqs(),
    contentSections: [
      {
        heading: "Overtime pay calculation",
        body: "Under the Fair Labor Standards Act (FLSA), non-exempt employees must receive at least 1.5× their regular hourly rate for hours worked beyond 40 in a workweek. This calculator estimates taxes on the higher gross during overtime weeks so you can see exactly how much extra take-home each OT hour actually yields after withholding.",
      },
      {
        heading: "How overtime affects your tax withholding",
        body: "Overtime boosts your gross for that pay period, which can temporarily push withholding into a higher annualized bracket. However, your year-end effective rate smooths out — meaning the extra withholding on OT paychecks may come back as a refund if you do not work overtime consistently. Use this tool to model both a typical 40-hour week and a heavy OT week side by side.",
      },
      {
        heading: "Overtime example: $25/hour with 5 OT hours",
        body: "At $25/hour with 40 regular hours plus 5 overtime hours (at $37.50/hour), your weekly gross jumps from $1,000 to $1,187.50 — an extra $187.50 before taxes. After federal, state, and FICA withholding, you might keep around $130–$150 of that depending on your state and bracket. Enter your exact rate above to see a personalized breakdown.",
      },
    ],
  },
  {
    slug: "bonus-paycheck-calculator",
    title: `Bonus Paycheck Calculator ${YEAR}`,
    h1: "Bonus Paycheck Calculator",
    description: `Calculate take-home pay on bonus payments after taxes. Free bonus paycheck calculator for ${YEAR}.`,
    keywords: ["bonus paycheck calculator"],
    category: "extra",
    defaults: {
      country: "US",
      payFrequency: "biweekly",
      grossAmount: Math.round((60000 / 26) * 100) / 100,
      bonusAmount: 1000,
    },
    faqs: hubFaqs(),
    contentSections: [
      {
        heading: "Bonus tax withholding",
        body: "Bonuses are classified as supplemental wages by the IRS. Employers can withhold federal tax using either the flat supplemental rate (22% for most workers, 37% on amounts exceeding $1 million annually) or the aggregate method which combines the bonus with regular pay and withholds based on the combined total. This calculator models a bonus added to the current paycheck (enable the flat 22% supplemental option in advanced settings for the most common bonus-paycheck scenario).",
      },
      {
        heading: "Why bonuses seem heavily taxed",
        body: "Many workers feel their bonus is \"taxed more\" because the flat 22% supplemental rate can exceed their normal effective rate. In reality, the withholding is just an estimate — if your actual marginal rate is lower, you receive the difference back as a refund. Conversely, high earners in the 32%+ brackets may owe additional tax on bonuses at filing time. This calculator helps you plan by showing the net bonus after withholding.",
      },
      {
        heading: "Maximizing your bonus take-home",
        body: "Consider timing 401(k) contributions or charitable donations around bonus pay to reduce taxable income in that period. If your employer uses the aggregate method, your bonus check might show higher withholding than 22% — but again, this adjusts at tax filing. Enter the bonus amount for this paycheck above along with your regular pay to see a combined estimate. The bonus field is per paycheck, not a one-time annual figure.",
      },
    ],
  },
  ...buildStatePages(),
  ...buildStateVariants(),
  ...buildInternationalPages(),
];

export function getPageBySlug(slug: string): SEOPage | undefined {
  return SEO_PAGES.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return SEO_PAGES.filter((p) => p.slug !== "").map((p) => p.slug);
}

export function getRelatedPages(page: SEOPage, limit = 8): SEOPage[] {
  const related: SEOPage[] = [];
  const statePages = SEO_PAGES.filter((p) => p.category === "state");
  const intlPages = SEO_PAGES.filter(
    (p) =>
      p.category === "country" ||
      p.category === "europe" ||
      p.category === "province"
  );

  if (page.category === "state" || page.category === "state-variant") {
    related.push(...SEO_PAGES.filter((p) => p.category === "frequency").slice(0, 3));
    related.push(...SEO_PAGES.filter((p) => p.category === "tax").slice(0, 2));
    if (page.defaults?.state) {
      const stateSlug = `${STATE_NAMES[page.defaults.state].toLowerCase().replace(/\s+/g, "-")}-paycheck-calculator`;
      const main = SEO_PAGES.find((p) => p.slug === stateSlug);
      if (main && main.slug !== page.slug) related.unshift(main);
    }
    related.push(
      ...statePages.filter(
        (p) =>
          p.slug !== page.slug &&
          ["california", "texas", "new-york", "florida", "colorado"].some((s) =>
            p.slug.startsWith(s)
          )
      )
    );
  } else if (
    page.category === "country" ||
    page.category === "province" ||
    page.category === "europe"
  ) {
    related.push(...SEO_PAGES.filter((p) => p.category === "country").slice(0, 4));
    related.push(...SEO_PAGES.filter((p) => p.category === "europe").slice(0, 4));
    if (page.countryCode === "CA") {
      related.push(
        ...SEO_PAGES.filter((p) => p.category === "province").slice(0, 6)
      );
    }
  } else if (page.category === "hub") {
    related.push(...statePages);
    related.push(...intlPages.filter((p) => p.category === "country"));
  } else {
    related.push(...statePages.slice(0, 4));
    related.push(...intlPages.filter((p) => p.category === "country").slice(0, 4));
    related.push(...SEO_PAGES.filter((p) => p.category === "frequency"));
  }

  return related.filter((p) => p.slug !== page.slug).slice(0, limit);
}

export function getAllStatePages(): SEOPage[] {
  return SEO_PAGES.filter((p) => p.category === "state");
}

export function getAllCountryPages(): SEOPage[] {
  return SEO_PAGES.filter(
    (p) => p.category === "country" || p.category === "europe"
  );
}

export function getAllProvincePages(): SEOPage[] {
  return SEO_PAGES.filter((p) => p.category === "province");
}

export { SITE_NAME, YEAR };
