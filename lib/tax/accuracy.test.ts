/**
 * Accuracy regression checks — run with: npm test
 * Compares engine behavior to expected Pub 15-T / FICA relationships.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculatePaycheck } from "../calculator";
import { calculateFederalWithholding } from "./federal-withholding";
import { calculateFICA } from "./fica";
import { lookupLocalTax } from "./local";

describe("FICA", () => {
  it("applies 6.2% SS up to wage base", () => {
    const { socialSecurity } = calculateFICA(100000);
    assert.equal(Math.round(socialSecurity), 6200);
  });

  it("caps Social Security at wage base", () => {
    const { socialSecurity } = calculateFICA(300000);
    assert.equal(Math.round(socialSecurity), Math.round(176100 * 0.062));
  });

  it("adds Additional Medicare above threshold", () => {
    const low = calculateFICA(150000).medicare;
    const high = calculateFICA(250000).medicare;
    assert.ok(high > low);
    assert.ok(high > 250000 * 0.0145);
  });
});

describe("Federal Pub 15-T withholding", () => {
  it("withholds more when W-4 Step 2 is checked", () => {
    const base = calculateFederalWithholding({
      wagesPerPeriod: 5000,
      payFrequency: "biweekly",
      filingStatus: "single",
      w4Step2: false,
    });
    const multi = calculateFederalWithholding({
      wagesPerPeriod: 5000,
      payFrequency: "biweekly",
      filingStatus: "single",
      w4Step2: true,
    });
    assert.ok(multi.perPeriod > base.perPeriod);
  });

  it("reduces withholding when dependents credit is applied", () => {
    const none = calculateFederalWithholding({
      wagesPerPeriod: 4000,
      payFrequency: "biweekly",
      filingStatus: "single",
      w4DependentsCredit: 0,
    });
    const kids = calculateFederalWithholding({
      wagesPerPeriod: 4000,
      payFrequency: "biweekly",
      filingStatus: "single",
      w4DependentsCredit: 4000,
    });
    assert.ok(kids.perPeriod < none.perPeriod);
  });

  it("applies 22% supplemental rate on bonus when enabled", () => {
    const result = calculateFederalWithholding({
      wagesPerPeriod: 3000,
      payFrequency: "biweekly",
      filingStatus: "single",
      supplementalBonus: 1000,
      useSupplementalRate: true,
    });
    // At least the supplemental portion should contribute ~220
    assert.ok(result.perPeriod > 220);
  });
});

describe("Local ZIP taxes", () => {
  it("maps NYC ZIP 10001", () => {
    const info = lookupLocalTax("10001");
    assert.ok(info);
    assert.ok((info?.rate ?? 0) > 0.04);
  });

  it("returns null for unknown ZIP", () => {
    assert.equal(lookupLocalTax("99999"), null);
  });
});

describe("End-to-end US paycheck", () => {
  it("401k reduces FIT but not FICA wages relationship", () => {
    const no401k = calculatePaycheck({
      country: "US",
      payType: "salary",
      grossAmount: 5000,
      payFrequency: "biweekly",
      filingStatus: "single",
      state: "TX",
      preTax401kPercent: 0,
    });
    const with401k = calculatePaycheck({
      country: "US",
      payType: "salary",
      grossAmount: 5000,
      payFrequency: "biweekly",
      filingStatus: "single",
      state: "TX",
      preTax401kPercent: 10,
    });
    assert.ok(with401k.federalTax < no401k.federalTax);
    // FICA should be nearly identical (401k does not reduce FICA)
    assert.ok(
      Math.abs(with401k.socialSecurity - no401k.socialSecurity) < 0.01
    );
    assert.ok(with401k.netPay < no401k.netPay);
  });

  it("section 125 benefits reduce FICA", () => {
    const none = calculatePaycheck({
      country: "US",
      payType: "salary",
      grossAmount: 5000,
      payFrequency: "biweekly",
      filingStatus: "single",
      state: "FL",
      preTaxBenefitsPercent: 0,
    });
    const benefits = calculatePaycheck({
      country: "US",
      payType: "salary",
      grossAmount: 5000,
      payFrequency: "biweekly",
      filingStatus: "single",
      state: "FL",
      preTaxBenefitsPercent: 5,
    });
    assert.ok(benefits.socialSecurity < none.socialSecurity);
    assert.ok(benefits.medicare < none.medicare);
  });

  it("NYC ZIP increases total tax vs same wages in no-local ZIP", () => {
    const plain = calculatePaycheck({
      country: "US",
      payType: "salary",
      grossAmount: 4000,
      payFrequency: "biweekly",
      filingStatus: "single",
      state: "NY",
    });
    const nyc = calculatePaycheck({
      country: "US",
      payType: "salary",
      grossAmount: 4000,
      payFrequency: "biweekly",
      filingStatus: "single",
      state: "NY",
      zip: "10001",
    });
    assert.ok(nyc.localTax > 0);
    assert.ok(nyc.totalTaxes > plain.totalTaxes);
    assert.ok(nyc.netPay < plain.netPay);
  });

  it("no-income-tax states still withhold federal + FICA", () => {
    const tx = calculatePaycheck({
      country: "US",
      payType: "salary",
      grossAmount: 60000 / 26,
      payFrequency: "biweekly",
      filingStatus: "single",
      state: "TX",
    });
    assert.equal(tx.stateTax, 0);
    assert.ok(tx.federalTax > 0);
    assert.ok(tx.socialSecurity > 0);
    assert.ok(tx.netPay > 0);
    assert.ok(tx.accuracyNotes.length > 0);
  });
});

describe("International engines", () => {
  it("UK Scotland withholds differently from England", () => {
    const base = {
      country: "UK" as const,
      payType: "salary" as const,
      grossAmount: 45000 / 12,
      payFrequency: "monthly" as const,
      filingStatus: "single" as const,
    };
    const eng = calculatePaycheck({ ...base, ukNation: "england" });
    const sco = calculatePaycheck({ ...base, ukNation: "scotland" });
    assert.ok(eng.netPay > 0 && sco.netPay > 0);
    assert.notEqual(Math.round(eng.federalTax), Math.round(sco.federalTax));
    assert.ok(eng.breakdown.some((b) => b.label === "National Insurance"));
  });

  it("Quebec uses QPP label and lower net than Ontario at same gross", () => {
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
  });

  it("Australia, Germany, and France return positive net under gross", () => {
    for (const country of ["AU", "DE", "FR"] as const) {
      const r = calculatePaycheck({
        country,
        payType: "salary",
        grossAmount: 50000 / 12,
        payFrequency: "monthly",
        filingStatus: "single",
      });
      assert.ok(r.netPay > 0);
      assert.ok(r.netPay < r.grossPay);
      assert.ok(r.breakdown.length >= 1);
      assert.equal(r.currency === "AUD" || r.currency === "EUR", true);
    }
  });

  it("Germany does not add solidarity surcharge on typical mid salaries", () => {
    const mid = calculatePaycheck({
      country: "DE",
      payType: "salary",
      grossAmount: 50000 / 12,
      payFrequency: "monthly",
      filingStatus: "single",
    });
    assert.ok(!mid.breakdown.some((b) => b.label === "Solidarity Surcharge"));
  });
});
