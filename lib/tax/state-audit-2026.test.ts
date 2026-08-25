/**
 * 2026 state income-tax audit — remaining 46 states (CA / TX / NY locked elsewhere).
 *
 * Primary source (state rates, brackets, standard deductions):
 *   Tax Foundation, “State Income Tax Rates and Brackets 2026” (as of Jan 1, 2026)
 *   https://taxfoundation.org/data/all/state/state-income-tax-rates-2026/
 *   Compiled from state statutes, forms, and instructions.
 *
 * Maryland local:
 *   Comptroller of Maryland, Withholding Tax Facts January–December 2026
 *   https://www.marylandcomptroller.gov/content/dam/mdcomp/tax/legal-publications/facts/withholding-tax-facts-2026.pdf
 *
 * Scenario: $75,000 annual wages, single, no pre-tax deductions.
 * Expected annual state tax = engine output after applying TF 2026 tables ± SD.
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
const SOURCE = STATE_TAX_SOURCE_2026;

/** Annual state tax goldens @ $75k single (Tax Foundation 2026 tables as modeled). */
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
  GA: 3269.7,
  HI: 4256.8,
  ID: 3121.7,
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
  SC: 3342.9,
  SD: 0,
  TN: 0,
  UT: 3375.0,
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

const FLAT_RATES_2026: Partial<Record<StateCode, number>> = {
  AZ: 0.025,
  CO: 0.044,
  GA: 0.0519,
  ID: 0.053,
  IL: 0.0495,
  IN: 0.0295,
  IA: 0.038,
  KY: 0.035,
  LA: 0.03,
  MA: 0.05,
  MI: 0.0425,
  NC: 0.0399,
  PA: 0.0307,
  UT: 0.045,
};

describe(`No-income-tax states (${SOURCE})`, () => {
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

describe(`Flat-rate states (${SOURCE})`, () => {
  for (const [state, rate] of Object.entries(FLAT_RATES_2026) as [
    StateCode,
    number,
  ][]) {
    it(`${state} uses flat ${(rate * 100).toFixed(2)}%`, () => {
      const cfg = STATE_TAX[state];
      assert.equal(cfg.type, "flat");
      if (cfg.type === "flat") assert.equal(cfg.rate, rate);
      const expected = STATE_TAX_75K_SINGLE[state as keyof typeof STATE_TAX_75K_SINGLE];
      const actual = calculateStateTax(WAGES, state, "single");
      assert.ok(
        Math.abs(actual - expected) < 0.02,
        `${state}: got ${actual}, expected ${expected}`
      );
    });
  }
});

describe(`Progressive / special structure states (${SOURCE})`, () => {
  const progressive = (
    Object.keys(STATE_TAX_75K_SINGLE) as (keyof typeof STATE_TAX_75K_SINGLE)[]
  ).filter((s) => !NO_INCOME_TAX.includes(s) && !(s in FLAT_RATES_2026));

  for (const state of progressive) {
    it(`${state} $75k single annual tax matches TF-sourced golden`, () => {
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
    assert.equal(lookupLocalTax("17101"), null); // Harrisburg — unmapped EIT
  });

  it("OH maps three sample cities — not full RITA", () => {
    assert.ok(lookupLocalTax("43215")); // Columbus
    assert.equal(lookupLocalTax("43604"), null); // Toledo — unmapped
  });

  it("KY maps Louisville sample only", () => {
    assert.ok(lookupLocalTax("40202"));
    assert.equal(lookupLocalTax("40502"), null); // Lexington — unmapped
  });
});

describe("Structural checks vs Tax Foundation 2026 categories", () => {
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

  it("Indiana flat rate is 2.95% for 2026", () => {
    const cfg = STATE_TAX.IN;
    assert.equal(cfg.type, "flat");
    if (cfg.type === "flat") assert.equal(cfg.rate, 0.0295);
  });

  it("Kentucky flat rate is 3.50% for 2026", () => {
    const cfg = STATE_TAX.KY;
    assert.equal(cfg.type, "flat");
    if (cfg.type === "flat") assert.equal(cfg.rate, 0.035);
  });

  it("North Carolina flat rate is 3.99% for 2026", () => {
    const cfg = STATE_TAX.NC;
    assert.equal(cfg.type, "flat");
    if (cfg.type === "flat") assert.equal(cfg.rate, 0.0399);
  });
});
