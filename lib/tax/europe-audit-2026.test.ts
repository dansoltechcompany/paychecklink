/**
 * Europe Tier-1 audit — DE / IE / NL tax year 2026.
 *
 * Primary sources:
 *   DE — 2026 Grundfreibetrag €12,348; BBG pension/unemp €101,400; health/care €69,750
 *   IE — Revenue.ie 2026 standard-rate band, credits, USC bands, Class A PRSI 4.2%
 *   NL — Belastingdienst Box 1 2026 (under AOW): 35.75% / 37.56% / 49.50%
 *
 * Engines remain simplified estimates (DE continuous tariff & NL heffingskortingen omitted).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculatePaycheck } from "../calculator";
import {
  calculateInternationalTax,
  EUROPE_TAX_SOURCE,
} from "./international";

describe(`Europe Tier-1 engines (${EUROPE_TAX_SOURCE})`, () => {
  it("Ireland €45k single: IT after credits + USC + PRSI goldens", () => {
    const r = calculateInternationalTax("IE", 45000);
    assert.ok(Math.abs(r.incomeTax - 5200) < 0.05);
    assert.ok(Math.abs(r.social - 2772.82) < 0.05);
    assert.equal(r.other, 0);
  });

  it("Germany €50k: updated Grundfreibetrag zone + capped social shares", () => {
    const r = calculateInternationalTax("DE", 50000);
    assert.ok(Math.abs(r.incomeTax - 8528.28) < 0.05);
    assert.ok(Math.abs(r.social - 10575) < 0.05);
    assert.equal(r.other, 0);
  });

  it("Germany does not add solidarity surcharge on €50k", () => {
    const mid = calculatePaycheck({
      country: "DE",
      payType: "salary",
      grossAmount: 50000 / 12,
      payFrequency: "monthly",
      filingStatus: "single",
    });
    assert.ok(!mid.breakdown.some((b) => b.label === "Solidarity Surcharge"));
  });

  it("Netherlands €50k Box 1 matches Belastingdienst 2026 schedule (pre-credits)", () => {
    const r = calculateInternationalTax("NL", 50000);
    assert.ok(Math.abs(r.incomeTax - 18076.22) < 0.05);
    assert.equal(r.social, 0);
  });

  it("Netherlands €80k crosses third Box 1 bracket", () => {
    const r = calculateInternationalTax("NL", 80000);
    assert.ok(Math.abs(r.incomeTax - 29532.15) < 0.1);
  });

  it("paycheck paths return positive net under gross for DE/IE/NL", () => {
    for (const country of ["DE", "IE", "NL"] as const) {
      const r = calculatePaycheck({
        country,
        payType: "salary",
        grossAmount: 50000 / 12,
        payFrequency: "monthly",
        filingStatus: "single",
      });
      assert.ok(r.netPay > 0);
      assert.ok(r.netPay < r.grossPay);
      assert.equal(r.currency, "EUR");
    }
  });
});
