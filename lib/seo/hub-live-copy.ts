/**
 * Hub-page illustrative copy driven by calculatePaycheck so tax examples
 * stay in sync with the engine (content-drift audit prefers these over
 * hardcoded round numbers).
 */
import { calculatePaycheck } from "../calculator";
import type { StateCode } from "../types";

function money(n: number, digits = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}

function biweekly60k(state: StateCode) {
  return calculatePaycheck({
    country: "US",
    payType: "salary",
    grossAmount: 60000 / 26,
    payFrequency: "biweekly",
    filingStatus: "single",
    state,
  });
}

function annual75k(state: StateCode) {
  return calculatePaycheck({
    country: "US",
    payType: "salary",
    grossAmount: 75000,
    payFrequency: "annual",
    filingStatus: "single",
    state,
  });
}

function weeklyHourly(opts: {
  state: StateCode;
  hourly: number;
  overtimeHours: number;
}) {
  return calculatePaycheck({
    country: "US",
    payType: "hourly",
    grossAmount: opts.hourly,
    payFrequency: "weekly",
    hoursPerWeek: 40,
    overtimeHours: opts.overtimeHours,
    overtimeMultiplier: 1.5,
    filingStatus: "single",
    state: opts.state,
  });
}

/** Biweekly hub — CA vs TX line-item example at $60k */
export function hubBiweeklyTaxBreakdownBody(): string {
  const ca = biweekly60k("CA");
  const tx = biweekly60k("TX");
  const gross = money(ca.grossPay);
  return (
    `On a $60,000 salary (about ${gross} gross per period), a single filer in California ` +
    `sees about ${money(ca.federalTax)} federal tax, ${money(ca.stateTax)} state tax` +
    (ca.stateDisability > 0 ? `, ${money(ca.stateDisability)} SDI` : "") +
    `, ${money(ca.socialSecurity)} Social Security, and ${money(ca.medicare)} Medicare withheld — ` +
    `leaving about ${money(ca.netPay)} net. In Texas (no state wage tax), the same gross yields about ` +
    `${money(tx.netPay)}. Use the calculator above with your exact state and filing status for a personalized breakdown.`
  );
}

/** Salary→hourly hub — CA vs TX net at $75k */
export function hubNetHourlyAfterTaxBody(): string {
  const ca = annual75k("CA");
  const tx = annual75k("TX");
  const hours = 2080;
  const caHourlyNet = ca.netAnnual / hours;
  const txHourlyNet = tx.netAnnual / hours;
  return (
    `Your true take-home per hour is lower than gross hourly because taxes apply. ` +
    `On a $75,000 salary in California, after federal, state, and FICA taxes we estimate about ` +
    `${money(ca.netAnnual)} net — roughly ${money(caHourlyNet, 2)}/hour worked. ` +
    `In Texas, the same salary nets about ${money(tx.netAnnual)} (${money(txHourlyNet, 2)}/hour). ` +
    `Use the state selector above to see your specific after-tax hourly equivalent.`
  );
}

/** 401(k) hub — live net drop vs contribution at $60k / 6% (CA) */
export function hub401kImpactBody(): string {
  const none = biweekly60k("CA");
  const with6 = calculatePaycheck({
    country: "US",
    payType: "salary",
    grossAmount: 60000 / 26,
    payFrequency: "biweekly",
    filingStatus: "single",
    state: "CA",
    preTax401kPercent: 6,
  });
  const contribAnnual = 60000 * 0.06;
  const netDropAnnual = none.netAnnual - with6.netAnnual;
  const taxSaveAnnual = contribAnnual - netDropAnnual;
  return (
    `Pre-tax 401(k) lowers federal income tax withholding while Social Security and Medicare generally still apply to those wages. ` +
    `For example, contributing 6% of a $60,000 salary (${money(contribAnnual)}/year) in California ` +
    `reduces take-home by about ${money(netDropAnnual)}/year in our estimate — not the full ${money(contribAnnual)} — ` +
    `because lower taxable wages save about ${money(taxSaveAnnual)} in income tax withholding. ` +
    `Model your own rate above to see the biweekly impact.`
  );
}

/** OT hub — $25/hr + 5 OT in Texas (no state tax) with live keep */
export function hubOvertimeExampleBody(): string {
  const hourly = 25;
  const otHours = 5;
  const otRate = hourly * 1.5;
  const base = weeklyHourly({ state: "TX", hourly, overtimeHours: 0 });
  const ot = weeklyHourly({ state: "TX", hourly, overtimeHours: otHours });
  const extraGross = ot.grossPay - base.grossPay;
  const keep = ot.netPay - base.netPay;
  const caOt = weeklyHourly({ state: "CA", hourly, overtimeHours: otHours });
  const caBase = weeklyHourly({ state: "CA", hourly, overtimeHours: 0 });
  const caKeep = caOt.netPay - caBase.netPay;
  return (
    `At $${hourly}/hour with 40 regular hours plus ${otHours} overtime hours (at ${money(otRate, 2)}/hour), ` +
    `your weekly gross jumps from ${money(base.grossPay)} to ${money(ot.grossPay)} — an extra ${money(extraGross)} before taxes. ` +
    `In Texas, our estimate keeps about ${money(keep)} of that OT bump after federal and FICA; ` +
    `in California (with state tax + SDI) about ${money(caKeep)}. ` +
    `Enter your exact rate and state above to see a personalized breakdown.`
  );
}
