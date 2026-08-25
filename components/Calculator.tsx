"use client";

import { useMemo, useState } from "react";
import { calculatePaycheck } from "@/lib/calculator";
import { lookupLocalTax } from "@/lib/tax/local";
import type {
  CalculatorInput,
  CountryCode,
  FilingStatus,
  PayFrequency,
  PayType,
  ProvinceCode,
  StateCode,
  UkNation,
} from "@/lib/types";
import {
  ALL_COUNTRIES,
  ALL_PROVINCES,
  ALL_STATES,
  COUNTRIES,
  PROVINCE_NAMES,
  STATE_NAMES,
} from "@/lib/types";
import type { PageDefaults } from "@/lib/seo/pages";
import { useLocale } from "./LocaleProvider";

interface Props {
  defaults?: PageDefaults;
}

export default function Calculator({ defaults }: Props) {
  const { t } = useLocale();
  const [country, setCountry] = useState<CountryCode>(
    defaults?.country ?? "US"
  );
  const [payType, setPayType] = useState<PayType>(defaults?.payType ?? "salary");
  const [grossAmount, setGrossAmount] = useState(
    defaults?.grossAmount ?? COUNTRIES[defaults?.country ?? "US"].defaultGross
  );
  const [payFrequency, setPayFrequency] = useState<PayFrequency>(
    defaults?.payFrequency ??
      (defaults?.country && defaults.country !== "US" ? "monthly" : "biweekly")
  );
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [overtimeHours, setOvertimeHours] = useState(
    defaults?.overtimeHours ?? 0
  );
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [state, setState] = useState<StateCode>(defaults?.state ?? "CA");
  const [province, setProvince] = useState<ProvinceCode>(
    defaults?.province ?? "ON"
  );
  const [ukNation, setUkNation] = useState<UkNation>(
    defaults?.ukNation ?? "england"
  );
  const [preTax401kPercent, setPreTax401kPercent] = useState(
    defaults?.preTax401kPercent ?? 0
  );
  const [preTaxBenefitsPercent, setPreTaxBenefitsPercent] = useState(0);
  const [postTaxDeductions, setPostTaxDeductions] = useState(0);
  const [bonusAmount, setBonusAmount] = useState(defaults?.bonusAmount ?? 0);
  const [bonusSupplemental, setBonusSupplemental] = useState(true);
  const [w4Step2, setW4Step2] = useState(false);
  const [w4DependentsCredit, setW4DependentsCredit] = useState(0);
  const [w4OtherIncome, setW4OtherIncome] = useState(0);
  const [w4Deductions, setW4Deductions] = useState(0);
  const [w4ExtraWithholding, setW4ExtraWithholding] = useState(0);
  const [zip, setZip] = useState(defaults?.zip ?? "");
  const [localTaxRatePct, setLocalTaxRatePct] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const meta = COUNTRIES[country];
  const localHint = zip.length >= 5 ? lookupLocalTax(zip) : null;
  const isNy = country === "US" && state === "NY";


  const input: CalculatorInput = useMemo(
    () => ({
      country,
      payType,
      grossAmount,
      payFrequency,
      hoursPerWeek,
      overtimeHours,
      filingStatus,
      state,
      province,
      ukNation,
      preTax401kPercent,
      preTaxBenefitsPercent,
      postTaxDeductions,
      bonusAmount,
      bonusSupplemental,
      w4Step2,
      w4DependentsCredit,
      w4OtherIncome,
      w4Deductions,
      w4ExtraWithholding,
      zip: zip || undefined,
      localTaxRate:
        localTaxRatePct > 0 ? localTaxRatePct / 100 : undefined,
    }),
    [
      country,
      payType,
      grossAmount,
      payFrequency,
      hoursPerWeek,
      overtimeHours,
      filingStatus,
      state,
      province,
      ukNation,
      preTax401kPercent,
      preTaxBenefitsPercent,
      postTaxDeductions,
      bonusAmount,
      bonusSupplemental,
      w4Step2,
      w4DependentsCredit,
      w4OtherIncome,
      w4Deductions,
      w4ExtraWithholding,
      zip,
      localTaxRatePct,
    ]
  );

  const result = useMemo(() => calculatePaycheck(input), [input]);
  const hasNycLocal = result.breakdown.some((b) =>
    b.label.includes("NYC resident tax")
  );

  function formatMoney(n: number): string {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: meta.currency,
        minimumFractionDigits: 2,
      }).format(n);
    } catch {
      return `${meta.currencySymbol}${n.toFixed(2)}`;
    }
  }

  function onCountryChange(next: CountryCode) {
    setCountry(next);
    setGrossAmount(COUNTRIES[next].defaultGross);
    setPayFrequency(next === "US" || next === "CA" ? "biweekly" : "monthly");
  }

  function onPayTypeChange(next: PayType) {
    setPayType(next);
    if (next === "hourly") {
      setGrossAmount(25);
      setHoursPerWeek(40);
    } else {
      setGrossAmount(COUNTRIES[country].defaultGross);
      setOvertimeHours(0);
    }
  }

  function onGrossChange(raw: string) {
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0) {
      setGrossAmount(0);
      return;
    }
    setGrossAmount(Math.round(n * 100) / 100);
  }

  const freqOptions: {
    key: PayFrequency;
    labelKey:
      | "freq.weekly"
      | "freq.biweekly"
      | "freq.semimonthly"
      | "freq.monthly"
      | "freq.annual";
  }[] = [
    { key: "weekly", labelKey: "freq.weekly" },
    { key: "biweekly", labelKey: "freq.biweekly" },
    { key: "semimonthly", labelKey: "freq.semimonthly" },
    { key: "monthly", labelKey: "freq.monthly" },
    { key: "annual", labelKey: "freq.annual" },
  ];

  return (
    <div className="calculator-grid">
      <div className="card card-form">
        <h2>{t("calc.enterDetails")}</h2>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            value={country}
            onChange={(e) => onCountryChange(e.target.value as CountryCode)}
          >
            {ALL_COUNTRIES.map((code) => (
              <option key={code} value={code}>
                {COUNTRIES[code].name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="payType">{t("calc.payType")}</label>
          <select
            id="payType"
            value={payType}
            onChange={(e) => onPayTypeChange(e.target.value as PayType)}
          >
            <option value="salary">{t("calc.salary")}</option>
            <option value="hourly">{t("calc.hourly")}</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gross">
              {payType === "hourly"
                ? `Hourly rate (${meta.currencySymbol.trim()})`
                : `Gross pay / period (${meta.currencySymbol.trim()})`}
            </label>
            <input
              id="gross"
              type="number"
              min="0"
              step="0.01"
              value={grossAmount}
              onChange={(e) => onGrossChange(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="frequency">{t("calc.payFrequency")}</label>
            <select
              id="frequency"
              value={payFrequency}
              onChange={(e) =>
                setPayFrequency(e.target.value as PayFrequency)
              }
            >
              {freqOptions.map(({ key, labelKey }) => (
                <option key={key} value={key}>
                  {t(labelKey)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {payType === "hourly" && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hours">{t("calc.hoursPerWeek")}</label>
              <input
                id="hours"
                type="number"
                min="1"
                max="80"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="overtime">{t("calc.overtimeHours")}</label>
              <input
                id="overtime"
                type="number"
                min="0"
                max="40"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(Number(e.target.value))}
              />
            </div>
          </div>
        )}

        {(country === "US" || country === "CA" || country === "UK") && (
        <div className="form-row">
          {country === "US" && (
            <div className="form-group">
              <label htmlFor="filing">{t("calc.filingStatus")}</label>
              <select
                id="filing"
                value={filingStatus}
                onChange={(e) =>
                  setFilingStatus(e.target.value as FilingStatus)
                }
              >
                <option value="single">{t("calc.single")}</option>
                <option value="married">{t("calc.married")}</option>
                <option value="head">{t("calc.head")}</option>
              </select>
            </div>
          )}

          {country === "US" && (
            <div className="form-group">
              <label htmlFor="state">{t("calc.state")}</label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value as StateCode)}
              >
                {ALL_STATES.map((code) => (
                  <option key={code} value={code}>
                    {STATE_NAMES[code]}
                  </option>
                ))}
              </select>
            </div>
          )}

          {country === "CA" && (
            <div className="form-group">
              <label htmlFor="province">Province / Territory</label>
              <select
                id="province"
                value={province}
                onChange={(e) =>
                  setProvince(e.target.value as ProvinceCode)
                }
              >
                {ALL_PROVINCES.map((code) => (
                  <option key={code} value={code}>
                    {PROVINCE_NAMES[code]}
                  </option>
                ))}
              </select>
            </div>
          )}

          {country === "UK" && (
            <div className="form-group">
              <label htmlFor="ukNation">Tax nation</label>
              <select
                id="ukNation"
                value={ukNation}
                onChange={(e) => setUkNation(e.target.value as UkNation)}
              >
                <option value="england">England</option>
                <option value="wales">Wales</option>
                <option value="ni">Northern Ireland</option>
                <option value="scotland">Scotland</option>
              </select>
            </div>
          )}
        </div>
        )}

        {country === "US" && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="401k">{t("calc.401k")}</label>
                <input
                  id="401k"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={preTax401kPercent}
                  onChange={(e) =>
                    setPreTax401kPercent(Number(e.target.value))
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="bonus">{t("calc.bonus")}</label>
                <input
                  id="bonus"
                  type="number"
                  min="0"
                  step="100"
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="zip">
                  {isNy ? "ZIP code (NYC / Yonkers local tax)" : "ZIP (local tax)"}
                </label>
                <input
                  id="zip"
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  placeholder={isNy ? "e.g. 10001 (Manhattan)" : "e.g. 10001"}
                  value={zip}
                  onChange={(e) =>
                    setZip(e.target.value.replace(/\D/g, "").slice(0, 5))
                  }
                />
                {localHint && (
                  <span className="field-hint">
                    {localHint.name}
                    {localHint.note ? ` · ${localHint.note}` : ""}
                    {hasNycLocal
                      ? " · NYC resident tax applied"
                      : localHint.rate > 0
                        ? ` · ${(localHint.rate * 100).toFixed(2)}%`
                        : ""}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="local">Custom local tax %</label>
                <input
                  id="local"
                  type="number"
                  min="0"
                  max="15"
                  step="0.05"
                  value={localTaxRatePct}
                  onChange={(e) =>
                    setLocalTaxRatePct(Number(e.target.value))
                  }
                />
              </div>
            </div>

            {isNy && (
              <p className={`local-tax-callout${hasNycLocal ? " is-applied" : ""}`}>
                {hasNycLocal ? (
                  <>
                    NYC resident tax is included for ZIP {zip}. Clear the ZIP to
                    see NY state tax only (upstate / non-city).
                  </>
                ) : (
                  <>
                    <strong>NYC residents:</strong> enter a city ZIP (e.g.{" "}
                    <button
                      type="button"
                      className="linkish"
                      onClick={() => setZip("10001")}
                    >
                      10001
                    </button>
                    ) — NYC local tax often lowers take-home by about 3–4%.
                    Without a ZIP, this estimate is NY state tax only.
                  </>
                )}
              </p>
            )}

            <button
              type="button"
              className="advanced-toggle"
              onClick={() => setShowAdvanced((v) => !v)}
              aria-expanded={showAdvanced}
            >
              {showAdvanced ? "Hide" : "Show"} advanced accuracy options (W-4,
              benefits)
            </button>

            {showAdvanced && (
              <div className="advanced-panel">
                <p className="advanced-intro">
                  These fields mirror ADP / PaycheckCity-style inputs for closer
                  paycheck withholding estimates.
                </p>

                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={w4Step2}
                    onChange={(e) => setW4Step2(e.target.checked)}
                  />
                  W-4 Step 2 — Multiple jobs / spouse works
                </label>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dep">W-4 Step 3 — Dependents credit ($/yr)</label>
                    <input
                      id="dep"
                      type="number"
                      min="0"
                      step="100"
                      value={w4DependentsCredit}
                      onChange={(e) =>
                        setW4DependentsCredit(Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="extra">W-4 Step 4(c) — Extra withholding $/period</label>
                    <input
                      id="extra"
                      type="number"
                      min="0"
                      step="10"
                      value={w4ExtraWithholding}
                      onChange={(e) =>
                        setW4ExtraWithholding(Number(e.target.value))
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="otherInc">W-4 Step 4(a) — Other income $/yr</label>
                    <input
                      id="otherInc"
                      type="number"
                      min="0"
                      step="100"
                      value={w4OtherIncome}
                      onChange={(e) =>
                        setW4OtherIncome(Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="w4ded">W-4 Step 4(b) — Deductions $/yr</label>
                    <input
                      id="w4ded"
                      type="number"
                      min="0"
                      step="100"
                      value={w4Deductions}
                      onChange={(e) =>
                        setW4Deductions(Number(e.target.value))
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="benefits">Pre-tax benefits % (health/HSA/FSA)</label>
                    <input
                      id="benefits"
                      type="number"
                      min="0"
                      max="40"
                      step="0.5"
                      value={preTaxBenefitsPercent}
                      onChange={(e) =>
                        setPreTaxBenefitsPercent(Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="posttax">Post-tax deductions $/period</label>
                    <input
                      id="posttax"
                      type="number"
                      min="0"
                      step="10"
                      value={postTaxDeductions}
                      onChange={(e) =>
                        setPostTaxDeductions(Number(e.target.value))
                      }
                    />
                  </div>
                </div>

                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={bonusSupplemental}
                    onChange={(e) => setBonusSupplemental(e.target.checked)}
                  />
                  Bonus: use IRS supplemental flat rate (22%)
                </label>
              </div>
            )}
          </>
        )}
      </div>

      <div className="card card-result">
        <h2>{t("calc.breakdown")}</h2>

        {isNy && !hasNycLocal && (
          <p className="result-local-tip">
            This estimate is <strong>NY state tax only</strong>. Enter a NYC ZIP
            above (e.g. 10001) to include city resident tax.
          </p>
        )}

        <div className="net-pay-display">
          <div className="label">{t("calc.takeHome")}</div>
          <div className="amount" key={result.netPay}>
            {formatMoney(result.netPay)}
          </div>
          <div className="annual">
            {formatMoney(result.netAnnual)} {t("calc.perYear")} ·{" "}
            {t("calc.effectiveRate")} {result.effectiveTaxRate.toFixed(1)}%
          </div>
        </div>

        <ul className="breakdown-list">
          <li>
            <span>{t("calc.gross")}</span>
            <span>{formatMoney(result.grossPay)}</span>
          </li>
          {result.breakdown.map((item) => (
            <li key={item.label} className={item.amount < 0 ? "deduction" : ""}>
              <span>{item.label}</span>
              <span>
                {item.amount < 0 ? "-" : ""}
                {formatMoney(Math.abs(item.amount))}
              </span>
            </li>
          ))}
          <li className="total">
            <span>{t("calc.netPay")}</span>
            <span>{formatMoney(result.netPay)}</span>
          </li>
        </ul>

        {result.accuracyNotes.length > 0 && (
          <ul className="accuracy-notes">
            {result.accuracyNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
