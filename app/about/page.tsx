import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { YEAR } from "@/lib/seo/pages";

export const metadata: Metadata = {
  title: `About Us (${YEAR})`,
  description:
    "Learn who builds and maintains PaycheckLink, why it exists, and the official sources behind every estimate.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
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
            <span>About</span>
          </nav>
          <div className="hero-copy">
            <h1 style={{ color: "#ffffff" }}>About PaycheckLink</h1>
            <p style={{ color: "rgba(255,255,255,0.9)" }}>
              A free, independent paycheck estimation tool — built for workers,
              not payroll vendors.
            </p>
          </div>
        </div>
      </section>
      <main className="container">
        <section className="content-section">
          <h2>Why this site exists</h2>
          <p>
            Millions of employees search &quot;paycheck calculator&quot; every year to
            answer a simple question: <em>how much of my gross pay actually
            hits my bank account?</em> Most existing tools are either locked
            behind payroll-vendor sign-ups, cluttered with ads, or use outdated
            tax tables.
          </p>
          <p>
            We built PaycheckLink to be fast, transparent, and
            accurate — using the same IRS and state formulas that drive real
            payroll systems, published openly on our{" "}
            <Link href="/methodology">Methodology</Link> page.
          </p>
        </section>

        <section className="content-section">
          <h2>Who maintains it</h2>
          <p>
            This project is maintained by an independent team of developers and
            personal-finance enthusiasts. We are not a payroll company, CPA
            firm, or tax advisory service. Our goal is to provide the most
            useful free paycheck estimation tool on the web — no paywall, no
            mandatory sign-up.
          </p>
        </section>

        <section className="content-section">
          <h2>Official sources we rely on</h2>
          <p>
            Every calculation references published government data, updated
            annually:
          </p>
          <ul className="methodology-list">
            <li>
              <strong>Federal income tax withholding:</strong>{" "}
              <a
                href="https://www.irs.gov/publications/p15t"
                target="_blank"
                rel="noopener noreferrer"
              >
                IRS Publication 15-T
              </a>{" "}
              (Percentage Method Tables for Income Tax Withholding)
            </li>
            <li>
              <strong>Social Security wage base & rates:</strong>{" "}
              <a
                href="https://www.ssa.gov/oact/cola/cbb.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                SSA Contribution and Benefit Base
              </a>
            </li>
            <li>
              <strong>Medicare & Additional Medicare Tax:</strong>{" "}
              <a
                href="https://www.irs.gov/taxtopics/tc751"
                target="_blank"
                rel="noopener noreferrer"
              >
                IRS Topic 751
              </a>
            </li>
            <li>
              <strong>State income tax:</strong> Individual state Departments of
              Revenue withholding guides (linked per state on each state
              calculator page)
            </li>
            <li>
              <strong>Canada:</strong>{" "}
              <a
                href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                CRA federal/provincial rates
              </a>
            </li>
            <li>
              <strong>United Kingdom:</strong>{" "}
              <a
                href="https://www.gov.uk/income-tax-rates"
                target="_blank"
                rel="noopener noreferrer"
              >
                HMRC Income Tax rates and bands
              </a>
            </li>
          </ul>
        </section>

        <section className="content-section">
          <h2>Accuracy commitment</h2>
          <p>
            We target the same accuracy as leading free paycheck tools (ADP,
            PaycheckCity) — meaning employer <strong>withholding</strong>{" "}
            estimates, not year-end tax-return liability. Our engine uses IRS
            Pub 15-T's percentage method including W-4 Steps 2–4, which matches
            how most employers compute each paycheck.
          </p>
          <p>
            Results are estimates and may differ from your actual paystub due to
            employer-specific benefits, local taxes not in our ZIP map, or
            mid-year law updates. See our{" "}
            <Link href="/methodology">Methodology page</Link> for a full
            breakdown of how we calculate and where discrepancies can arise.
          </p>
        </section>

        <section className="content-section">
          <h2>Editorial independence</h2>
          <p>
            We do not accept payment from payroll companies to alter results or
            rankings. The calculator treats all states, frequencies, and pay
            types equally. Our only revenue goal (once ads are introduced) is
            non-intrusive display advertising that does not affect calculations.
          </p>
        </section>

        <section className="content-section">
          <h2>Contact</h2>
          <p>
            Found a tax-table error or have a feature suggestion? We update tax
            tables annually and patch errors as quickly as possible. Prefer
            reporting issues with the affected state or country and a sample
            gross pay so we can reproduce the estimate.
          </p>
        </section>

        <div className="disclaimer">
          <strong>Disclaimer:</strong> This site provides estimates for
          informational purposes only and does not constitute tax, legal, or
          financial advice. Consult a qualified professional for your specific
          situation.
        </div>
      </main>
      <Footer />
    </div>
  );
}
