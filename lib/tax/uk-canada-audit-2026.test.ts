/**
 * UK + Canada paycheck engine audit — tax year 2026 (UK 2026/27 / CA calendar 2026).
 *
 * Primary sources:
 *   UK  — HMRC employer rates 2025/26; GOV.UK Income Tax bands (rUK);
 *         mygov.scot Scottish Income Tax 2026/27
 *   CA  — CRA T4032 Jan 2026 (federal brackets, BPA, CPP YMPE, EI);
 *         CRA/KPMG 2026 ON & QC provincial brackets
 *
 * Goldens pin annual engine outputs (not employer PAYE table rounding).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculatePaycheck } from "../calculator";
import { calculateUkTax, ukPersonalAllowance, UK_TAX_SOURCE } from "./uk";
import { calculateCanadaTax, CANADA_TAX_SOURCE } from "./canada";

describe(`UK Income Tax + NI (${UK_TAX_SOURCE})`, () => {
  it("personal allowance is £12,570 under £100k and tapers above", () => {
    assert.equal(ukPersonalAllowance(45000), 12570);
    assert.equal(ukPersonalAllowance(100000), 12570);
    assert.equal(ukPersonalAllowance(110000), 7570);
    assert.equal(ukPersonalAllowance(125140), 0);
  });

  it("England £45k: income tax £6,486 and NI £2,594.40", () => {
    const r = calculateUkTax(45000, "england");
    assert.ok(Math.abs(r.incomeTax - 6486) < 0.02);
    assert.ok(Math.abs(r.nationalInsurance - 2594.4) < 0.02);
  });

  it("Scotland £45k taxes more than England (2026/27 bands)", () => {
    const eng = calculateUkTax(45000, "england");
    const sco = calculateUkTax(45000, "scotland");
    assert.ok(Math.abs(sco.incomeTax - 6882.05) < 0.05);
    assert.ok(sco.incomeTax > eng.incomeTax);
    assert.ok(Math.abs(sco.nationalInsurance - eng.nationalInsurance) < 0.01);
  });

  it("England £60k crosses higher-rate band + NI upper earnings limit", () => {
    const r = calculateUkTax(60000, "england");
    assert.ok(Math.abs(r.incomeTax - 11432) < 0.02);
    assert.ok(Math.abs(r.nationalInsurance - 3210.6) < 0.02);
  });

  it("paycheck path: England vs Scotland monthly net differs; NI labeled", () => {
    const base = {
      country: "UK" as const,
      payType: "salary" as const,
      grossAmount: 45000 / 12,
      payFrequency: "monthly" as const,
      filingStatus: "single" as const,
    };
    const eng = calculatePaycheck({ ...base, ukNation: "england" });
    const sco = calculatePaycheck({ ...base, ukNation: "scotland" });
    assert.ok(eng.breakdown.some((b) => b.label === "National Insurance"));
    assert.ok(eng.netPay > sco.netPay);
    assert.ok(Math.abs(eng.federalTax * 12 - 6486) < 0.5);
    assert.ok(Math.abs(sco.federalTax * 12 - 6882.05) < 0.5);
  });
});

describe(`Canada federal + provincial (${CANADA_TAX_SOURCE})`, () => {
  it("Ontario $70k: federal, ON tax, CPP, EI match 2026 CRA-sourced goldens", () => {
    const r = calculateCanadaTax(70000, "ON");
    assert.ok(Math.abs(r.federalTax - 7496.72) < 0.05);
    assert.ok(Math.abs(r.provincialTax - 2704.17) < 0.05);
    assert.ok(Math.abs(r.cpp - 3956.75) < 0.05);
    // EI capped at $68,900 × 1.63% = $1,123.07
    assert.ok(Math.abs(r.ei - 1123.07) < 0.05);
  });

  it("Quebec $70k uses higher pension rate and lower EI than Ontario", () => {
    const on = calculateCanadaTax(70000, "ON");
    const qc = calculateCanadaTax(70000, "QC");
    assert.ok(Math.abs(qc.provincialTax - 7496.72) < 0.05);
    assert.ok(Math.abs(qc.cpp - 4256) < 0.05);
    // QC EI 1.30% on MIE $68,900 = $895.70
    assert.ok(Math.abs(qc.ei - 895.7) < 0.05);
    assert.ok(qc.cpp > on.cpp);
    assert.ok(qc.ei < on.ei);
  });

  it("BC $70k provincial tax matches 2026 bracket walk", () => {
    const r = calculateCanadaTax(70000, "BC");
    assert.ok(Math.abs(r.provincialTax - 2822.23) < 0.05);
  });

  it("paycheck path: ON vs QC labels CPP/QPP and QC nets lower", () => {
    const base = {
      country: "CA" as const,
      payType: "salary" as const,
      grossAmount: 70000 / 26,
      payFrequency: "biweekly" as const,
      filingStatus: "single" as const,
    };
    const on = calculatePaycheck({ ...base, province: "ON" });
    const qc = calculatePaycheck({ ...base, province: "QC" });
    assert.ok(on.breakdown.some((b) => b.label === "CPP"));
    assert.ok(qc.breakdown.some((b) => b.label === "QPP"));
    assert.ok(qc.netPay < on.netPay);
    assert.ok(Math.abs(on.federalTax * 26 - 7496.72) < 1);
    assert.ok(Math.abs(on.stateTax * 26 - 2704.17) < 1);
  });
});
