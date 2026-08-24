"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { YEAR } from "@/lib/seo/pages";

export default function MethodologyContent() {
  return (
    <div className="page-shell">
      <Navbar />
      <section
        className="hero-band hero-band-page"
        style={{ background: "#0466c8", color: "#ffffff" }}
      >
        <div className="container hero">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            {" / "}
            <span>Methodology</span>
          </nav>
          <div className="hero-copy">
            <h1 style={{ color: "#ffffff" }}>Accuracy & Methodology</h1>
            <p style={{ color: "rgba(255,255,255,0.9)" }}>
              How we estimate paychecks — designed to match employer withholding
              as closely as free calculators like ADP and PaycheckCity.
            </p>
          </div>
        </div>
      </section>
      <main className="container">
        <section className="content-section">
          <h2>What “accurate” means</h2>
          <p>
            We optimize for <strong>paycheck withholding</strong> (what a typical
            employer remits each pay period), not a full year-end tax return.
            That is the same goal ADP and PaycheckCity free tools target.
          </p>
        </section>

        <section className="content-section">
          <h2>United States engine ({YEAR})</h2>
          <ul className="methodology-list">
            <li>
              <strong>Federal income tax:</strong> IRS Publication 15-T
              percentage method, including Form W-4 Step 2 (multiple jobs), Step
              3 (dependents credit), and Step 4 (other income, deductions, extra
              withholding).
            </li>
            <li>
              <strong>Bonus / supplemental wages:</strong> optional IRS flat
              supplemental rate (22%, or 37% above the annual high threshold).
            </li>
            <li>
              <strong>FICA:</strong> Social Security 6.2% up to the SSA wage
              base; Medicare 1.45% plus Additional Medicare where applicable.
              Traditional 401(k) reduces FIT only; Section 125-style benefits
              reduce FIT and FICA.
            </li>
            <li>
              <strong>State income tax:</strong> current state rate tables (flat
              or progressive) for all 50 states.
            </li>
            <li>
              <strong>Local tax:</strong> ZIP lookup for major cities (NYC,
              Philadelphia, Detroit, Ohio municipals, etc.) plus custom local
              rate override.
            </li>
          </ul>
        </section>

        <section className="content-section">
          <h2>International engines</h2>
          <p>
            UK (Income Tax + NI), Canada (federal + provincial + CPP/EI),
            Australia, and Tier-1 European countries use country-specific
            simplified official tables. Expand advanced W-4-style detail is
            US-first because that is where ADP/PaycheckCity compete hardest.
          </p>
        </section>

        <section className="content-section">
          <h2>Sources we follow</h2>
          <ul className="methodology-list">
            <li>
              <a
                href="https://www.irs.gov/publications/p15t"
                target="_blank"
                rel="noopener noreferrer"
              >
                IRS Publication 15-T
              </a>{" "}
              — Federal income tax withholding (Percentage Method)
            </li>
            <li>
              <a
                href="https://www.ssa.gov/oact/cola/cbb.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                SSA Contribution and Benefit Base
              </a>{" "}
              — Social Security wage base for {YEAR}
            </li>
            <li>
              <a
                href="https://www.irs.gov/taxtopics/tc751"
                target="_blank"
                rel="noopener noreferrer"
              >
                IRS Topic 751
              </a>{" "}
              — Medicare tax rates and Additional Medicare Tax
            </li>
            <li>
              State Departments of Revenue withholding guides — e.g.{" "}
              <a
                href="https://www.ftb.ca.gov/file/personal/tax-basics/index.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                California FTB
              </a>,{" "}
              <a
                href="https://www.tax.ny.gov/pit/file/tax_tables.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                New York DTF
              </a>
            </li>
            <li>
              Published city/county earned-income or local income tax rates
              (NYC, Philadelphia, Ohio municipals, etc.)
            </li>
            <li>
              <a
                href="https://www.gov.uk/income-tax-rates"
                target="_blank"
                rel="noopener noreferrer"
              >
                HMRC
              </a>{" "}
              (UK) /{" "}
              <a
                href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                CRA
              </a>{" "}
              (Canada) / national revenue tables for other countries
            </li>
          </ul>
        </section>

        <section className="content-section">
          <h2>Why results can still differ from your payslip</h2>
          <ul className="methodology-list">
            <li>Employer-specific benefits, garnishments, or rounding</li>
            <li>State withholding formulas that differ slightly from liability brackets</li>
            <li>Local taxes not in our ZIP map (enter a custom %)</li>
            <li>Mid-year law changes before our annual update</li>
          </ul>
          <p>
            Use <Link href="/">the calculator</Link> with advanced W-4 and ZIP
            fields for the closest estimate. This is not tax advice.
          </p>
        </section>

        <div className="disclaimer">
          <strong>Disclaimer:</strong> Estimates only for {YEAR}. Not a
          substitute for payroll software, a CPA, or your employer’s paystub.
        </div>
      </main>
      <Footer />
    </div>
  );
}
