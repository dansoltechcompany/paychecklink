/**
 * 2026 state income-tax audit — remaining 46 states (CA / TX / NY locked elsewhere).
 *
 * Primary sources (prefer these over aggregators when they disagree):
 *   GA — HB 463 / gov.georgia.gov press release (May 11, 2026), ERSGA, Paylocity
 *   UT — SB 60 / Utah Tax Commission Publication 14 (withholding, June 1, 2026); EY Tax Alert
 *   SC — H.4216 / Act 110 / SCDOR “Information about H. 4216” (Mar 30, 2026)
 *   KY — HB 1 (2025 RS) / Kentucky Chamber; rate confirmed 3.5% for TY 2026
 *   IN — Indiana DOR Rates Fees & Penalties + DN-01 (2.95% for 2026)
 *   NC — NCDOR Tax Rate Schedules (Session Law 2023-134 → 3.99% after 2025)
 *   ID — Idaho STC Form 40 / Individual Income Tax Rate Schedule (5.3% + zero bracket)
 *
 * Secondary cross-check:
 *   Tax Foundation, “State Income Tax Rates and Brackets 2026” (as of Jan 1, 2026)
 *   WARNING: TF is a point-in-time snapshot. Mid-2026 session bills (GA HB 463, UT SB 60,
 *   SC H.4216) were signed AFTER that snapshot and are retroactive to Jan 1, 2026.
 *
 * Scenario: $75,000 annual wages, single, no pre-tax deductions.
 * Personal exemption credits (non-CA) are NOT subtracted — flagged as partial.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculatePaycheck } from "../calculator";
import { calculateLocalTax, lookupLocalTax } from "./local";
import {
  MD_COUNTY_RATES_2026,
  MD_DEFAULT_LOCAL_RATE,
  lookupMdLocalByZip,
} from "./md-local";
import {
  calculateStateTax,
  getStateTaxableIncome,
  STATE_TAX,
  STATE_TAX_SOURCE_2026,
} from "./state";
import type { StateCode } from "../types";

const WAGES = 75_000;

/** Annual state tax goldens @ $75k single after primary-source corrections. */
const STATE_TAX_75K_SINGLE: Record<
  Exclude<StateCode, "CA" | "TX" | "NY">,
  number
> = {
  AL: 3560.0,
  AK: 0,
  AZ: 1666.25,
  AR: 2741.27,
  CO: 2591.6,
  CT: 3375.0,
  DE: 3719.0,
  FL: 0,
  // HB 463: (75000 − 15000) × 4.99% = $2,994
  GA: 2994.0,
  HI: 4256.8,
  // Idaho STC: after SD $16,100 then zero bracket $4,811 → (58900 − 4811) × 5.3%
  ID: 2866.717,
  IL: 3712.5,
  IN: 2212.5,
  IA: 2238.2,
  KS: 3896.44,
  KY: 2507.4,
  LA: 1863.75,
  ME: 4245.79,
  MD: 3350.88,
  MA: 3750.0,
  MI: 3187.5,
  MN: 3576.61,
  MS: 2508.0,
  MO: 2587.67,
  MT: 2876.6,
  NE: 2708.96,
  NV: 0,
  NH: 0,
  NJ: 2653.0,
  NM: 2359.3,
  NC: 2483.775,
  ND: 203.2875,
  OH: 1346.125,
  OK: 2874.5,
  OR: 5988.875,
  PA: 2302.5,
  RI: 2392.5,
  // H.4216: SCIAD $15k; 1.99% on first $30k + 5.21% above = $2,160
  SC: 2160.0,
  SD: 0,
  TN: 0,
  // SB 60: 75000 × 4.45% = $3,337.50
  UT: 3337.5,
  VT: 2839.6,
  VA: 3551.875,
  WA: 0,
  WV: 2776.5,
  WI: 2631.58,
  WY: 0,
};

const NO_INCOME_TAX: StateCode[] = [
  "AK",
  "FL",
  "NV",
  "NH",
  "SD",
  "TN",
  "WA",
  "WY",
];

/** Flat rates verified against primary sources where noted. */
const FLAT_RATES_2026: Partial<
  Record<StateCode, { rate: number; primary: string }>
> = {
  AZ: { rate: 0.025, primary: "AZ DOR / TF 2026 (stable 2.5%)" },
  CO: { rate: 0.044, primary: "Colorado DOR / TF 2026" },
  GA: {
    rate: 0.0499,
    primary: "HB 463 / gov.georgia.gov (May 11, 2026)",
  },
  IL: { rate: 0.0495, primary: "Illinois DOR / TF 2026" },
  IN: { rate: 0.0295, primary: "Indiana DOR Rates page + DN-01 (2026)" },
  IA: { rate: 0.038, primary: "Iowa DOR / TF 2026" },
  KY: { rate: 0.035, primary: "KY HB 1 (2025 RS) — 3.5% TY 2026" },
  LA: { rate: 0.03, primary: "Louisiana DOR / TF 2026 flat 3%" },
  MA: { rate: 0.05, primary: "Massachusetts DOR / TF 2026" },
  MI: { rate: 0.0425, primary: "Michigan Treasury / TF 2026" },
  NC: {
    rate: 0.0399,
    primary: "NCDOR Tax Rate Schedules (S.L. 2023-134)",
  },
  PA: { rate: 0.0307, primary: "PA DOR / TF 2026" },
  UT: {
    rate: 0.0445,
    primary: "UT SB 60 / Utah Tax Commission Pub 14 (2026)",
  },
};

describe(`No-income-tax states (${STATE_TAX_SOURCE_2026})`, () => {
  for (const state of NO_INCOME_TAX) {
    it(`${state} state tax is $0.00 on wage income`, () => {
      assert.equal(STATE_TAX[state].type, "none");
      assert.equal(calculateStateTax(WAGES, state, "single"), 0);
      assert.equal(calculateStateTax(150_000, state, "married"), 0);
      const paycheck = calculatePaycheck({
        country: "US",
        payType: "salary",
        grossAmount: WAGES / 26,
        payFrequency: "biweekly",
        filingStatus: "single",
        state,
      });
      assert.equal(paycheck.stateTax, 0);
    });
  }
});

describe("Flat-rate states (primary-source verified where cited)", () => {
  for (const [state, meta] of Object.entries(FLAT_RATES_2026) as [
    StateCode,
    { rate: number; primary: string },
  ][]) {
    it(`${state} uses flat ${(meta.rate * 100).toFixed(2)}% — ${meta.primary}`, () => {
      const cfg = STATE_TAX[state];
      assert.equal(cfg.type, "flat");
      if (cfg.type === "flat") assert.equal(cfg.rate, meta.rate);
      const expected =
        STATE_TAX_75K_SINGLE[state as keyof typeof STATE_TAX_75K_SINGLE];
      const actual = calculateStateTax(WAGES, state, "single");
      assert.ok(
        Math.abs(actual - expected) < 0.02,
        `${state}: got ${actual}, expected ${expected}`
      );
    });
  }
});

describe("Mid-2026 legislative corrections (post–Tax Foundation snapshot)", () => {
  it("Georgia HB 463: 4.99% + SD $15,000/$30,000 (gov.georgia.gov May 11, 2026)", () => {
    const cfg = STATE_TAX.GA;
    assert.equal(cfg.type, "flat");
    if (cfg.type === "flat") {
      assert.equal(cfg.rate, 0.0499);
      assert.equal(cfg.standardDeduction?.single, 15000);
      assert.equal(cfg.standardDeduction?.married, 30000);
    }
    // (75000 − 15000) × 0.0499 = 2994
    assert.equal(calculateStateTax(WAGES, "GA", "single"), 2994);
    assert.equal(
      calculateStateTax(WAGES, "GA", "married"),
      (WAGES - 30000) * 0.0499
    );
  });

  it("Utah SB 60: 4.45% flat retroactive Jan 1, 2026 (Tax Commission Pub 14)", () => {
    const cfg = STATE_TAX.UT;
    assert.equal(cfg.type, "flat");
    if (cfg.type === "flat") assert.equal(cfg.rate, 0.0445);
    assert.equal(calculateStateTax(WAGES, "UT", "single"), 3337.5);
  });

  it("South Carolina H.4216: 1.99%/5.21% + SCIAD (SCDOR Apr 2026)", () => {
    const cfg = STATE_TAX.SC;
    assert.equal(cfg.type, "progressive");
    if (cfg.type === "progressive") {
      assert.equal(cfg.standardDeduction?.single, 15000);
      assert.equal(cfg.standardDeduction?.married, 30000);
      assert.equal(cfg.standardDeduction?.head, 22500);
      assert.equal(cfg.brackets[0].rate, 0.0199);
      assert.equal(cfg.brackets[0].upTo, 30000);
      assert.equal(cfg.brackets[1].rate, 0.0521);
    }
    // Taxable 60k → 30k×1.99% + 30k×5.21% = 2160
    assert.equal(calculateStateTax(WAGES, "SC", "single"), 2160);
  });
});

describe(`Progressive / special structure states (${STATE_TAX_SOURCE_2026})`, () => {
  const progressive = (
    Object.keys(STATE_TAX_75K_SINGLE) as (keyof typeof STATE_TAX_75K_SINGLE)[]
  ).filter((s) => !NO_INCOME_TAX.includes(s) && !(s in FLAT_RATES_2026));

  for (const state of progressive) {
    it(`${state} $75k single annual tax matches primary/TF-sourced golden`, () => {
      const cfg = STATE_TAX[state];
      assert.ok(cfg.type === "progressive" || cfg.type === "flat");
      const expected = STATE_TAX_75K_SINGLE[state];
      const actual = calculateStateTax(WAGES, state, "single");
      assert.ok(
        Math.abs(actual - expected) < 0.05,
        `${state}: got ${actual}, expected ${expected}`
      );
    });
  }
});

describe("Maryland mandatory local income tax (Comptroller 2026)", () => {
  it("Montgomery ZIP 20814 applies 3.20% on MD taxable income", () => {
    const info = lookupMdLocalByZip("20814");
    assert.ok(info);
    assert.equal(info!.rate, 0.032);
    assert.match(info!.county, /Montgomery/i);

    const mdTaxable = getStateTaxableIncome(WAGES, "MD", "single");
    const local = calculateLocalTax(WAGES, {
      state: "MD",
      filingStatus: "single",
      zip: "20814",
    });
    assert.ok(Math.abs(local.annual - mdTaxable * 0.032) < 0.02);
    assert.ok(Math.abs(local.annual - 2292.8) < 0.05);
  });

  it("defaults to 3.20% when MD selected without ZIP", () => {
    assert.equal(MD_DEFAULT_LOCAL_RATE, 0.032);
    const local = calculateLocalTax(WAGES, {
      state: "MD",
      filingStatus: "single",
    });
    assert.equal(local.rate, 0.032);
    assert.ok(local.annual > 0);
  });

  it("Worcester ZIP uses lowest county rate 2.25%", () => {
    const info = lookupMdLocalByZip("21811");
    assert.ok(info);
    assert.equal(info!.rate, 0.0225);
  });

  it("paycheck with MD ZIP includes state + local lines", () => {
    const result = calculatePaycheck({
      country: "US",
      payType: "salary",
      grossAmount: WAGES / 26,
      payFrequency: "biweekly",
      filingStatus: "single",
      state: "MD",
      zip: "20814",
    });
    assert.ok(result.stateTax > 0);
    assert.ok(result.localTax > 0);
    assert.ok(
      result.breakdown.some((b) => /MD local|Montgomery/i.test(b.label))
    );
  });

  it("publishes all 23 counties + Baltimore City rates", () => {
    assert.ok(Object.keys(MD_COUNTY_RATES_2026).length >= 24);
  });
});

describe("Local tax coverage limits (methodology flags)", () => {
  it("PA maps Philadelphia/Pittsburgh samples only — not full EIT", () => {
    const philly = lookupLocalTax("19103");
    assert.ok(philly);
    assert.equal(philly!.rate, 0.0375);
    assert.equal(lookupLocalTax("17101"), null);
  });

  it("OH maps three sample cities — not full RITA", () => {
    assert.ok(lookupLocalTax("43215"));
    assert.equal(lookupLocalTax("43604"), null);
  });

  it("KY maps Louisville sample only", () => {
    assert.ok(lookupLocalTax("40202"));
    assert.equal(lookupLocalTax("40502"), null);
  });
});

describe("Structural checks vs primary 2026 law", () => {
  it("Ohio is 0% to $26,050 then 2.75% (no 3.5% bracket)", () => {
    const cfg = STATE_TAX.OH;
    assert.equal(cfg.type, "progressive");
    if (cfg.type === "progressive") {
      assert.equal(cfg.brackets.length, 2);
      assert.equal(cfg.brackets[0].upTo, 26050);
      assert.equal(cfg.brackets[0].rate, 0);
      assert.equal(cfg.brackets[1].rate, 0.0275);
    }
  });

  it("Louisiana is flat 3% (not progressive)", () => {
    const cfg = STATE_TAX.LA;
    assert.equal(cfg.type, "flat");
    if (cfg.type === "flat") assert.equal(cfg.rate, 0.03);
  });

  it("Mississippi taxes 4% above $10,000", () => {
    const cfg = STATE_TAX.MS;
    assert.equal(cfg.type, "progressive");
    if (cfg.type === "progressive") {
      assert.equal(cfg.brackets[0].upTo, 10000);
      assert.equal(cfg.brackets[0].rate, 0);
      assert.equal(cfg.brackets[1].rate, 0.04);
    }
  });

  it("Indiana flat rate is 2.95% for 2026 (IN DOR)", () => {
    const cfg = STATE_TAX.IN;
    assert.equal(cfg.type, "flat");
    if (cfg.type === "flat") assert.equal(cfg.rate, 0.0295);
  });

  it("Kentucky flat rate is 3.50% for 2026 (HB 1)", () => {
    const cfg = STATE_TAX.KY;
    assert.equal(cfg.type, "flat");
    if (cfg.type === "flat") assert.equal(cfg.rate, 0.035);
  });

  it("North Carolina flat rate is 3.99% for 2026 (NCDOR)", () => {
    const cfg = STATE_TAX.NC;
    assert.equal(cfg.type, "flat");
    if (cfg.type === "flat") assert.equal(cfg.rate, 0.0399);
  });

  it("Idaho 5.3% with $4,811 single zero bracket (Idaho STC Form 40)", () => {
    const cfg = STATE_TAX.ID;
    assert.equal(cfg.type, "progressive");
    if (cfg.type === "progressive") {
      const single = cfg.bracketsByStatus?.single ?? cfg.brackets;
      assert.equal(single[0].upTo, 4811);
      assert.equal(single[0].rate, 0);
      assert.equal(single[1].rate, 0.053);
    }
  });
});
