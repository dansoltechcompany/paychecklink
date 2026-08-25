import Link from "next/link";
import type { SEOPage } from "@/lib/seo/pages";
import {
  YEAR,
  getAllCountryPages,
  getAllProvincePages,
  getAllStatePages,
} from "@/lib/seo/pages";
import {
  getStateExamplePays,
  getStateTaxSummary,
} from "@/lib/seo/state-content";
import Calculator from "./Calculator";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface Props {
  page: SEOPage;
  related: SEOPage[];
}

function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function calculatorChipLabel(h1: string): string {
  return h1.replace(/\s+Paycheck Calculators?/gi, "").trim();
}

export default function PageLayout({ page, related }: Props) {
  const isHome = page.slug === "";
  const isStatePage =
    page.category === "state" || page.category === "state-variant";
  const isIntlPage =
    page.category === "country" ||
    page.category === "province" ||
    page.category === "europe";
  const allStates = getAllStatePages();
  const allCountries = getAllCountryPages();
  const allProvinces = getAllProvincePages();
  const taxSummary = page.stateCode
    ? getStateTaxSummary(page.stateCode)
    : null;
  const examples = page.stateCode
    ? getStateExamplePays(page.stateCode)
    : null;

  return (
    <div className="page-shell">
      <Navbar />

      <section
        className={`hero-band${isHome ? " hero-band-home" : ""}`}
        style={{ background: "#0466c8", color: "#ffffff" }}
      >
        <div className="container hero">
          {!isHome && (
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              {" / "}
              {isStatePage && (
                <>
                  <Link href="/states">States</Link>
                  {" / "}
                </>
              )}
              {isIntlPage && (
                <>
                  <Link href="/countries">Countries</Link>
                  {" / "}
                </>
              )}
              <span>{page.h1}</span>
            </nav>
          )}
          <div className="hero-copy">
            <h1 style={{ color: "#ffffff" }}>{page.h1}</h1>
            <p style={{ color: "rgba(255,255,255,0.9)" }}>{page.description}</p>
            {taxSummary && (
              <p className="tax-badge">
                {taxSummary.hasIncomeTax
                  ? page.stateCode === "NY"
                    ? `${taxSummary.name} state tax: ${taxSummary.rateLabel} · NYC residents: enter ZIP for city tax`
                    : `${taxSummary.name} state tax: ${taxSummary.rateLabel}`
                  : `${taxSummary.name}: No income tax`}
              </p>
            )}
          </div>
        </div>
        <div className="container calculator-wrap">
          <Calculator defaults={page.defaults} />
        </div>
      </section>

      <main className="container">

        {page.scenarios && page.scenarios.length > 0 && (
          <section className="content-section" aria-labelledby="scenarios-heading">
            <h2 id="scenarios-heading">Real-world paycheck scenarios</h2>
            <p>
              Unique {YEAR} examples for this page — plug similar numbers into
              the calculator above to customize.
            </p>
            <div className="scenario-grid">
              {page.scenarios.map((s) => (
                <article key={s.title} className="scenario-card">
                  <h3>{s.title}</h3>
                  <p className="scenario-setup">{s.setup}</p>
                  <dl className="scenario-stats">
                    <div>
                      <dt>Est. annual take-home</dt>
                      <dd>{formatMoney(s.netAnnual)}</dd>
                    </div>
                    <div>
                      <dt>Est. biweekly net</dt>
                      <dd>{formatMoney(s.netBiweekly)}</dd>
                    </div>
                    <div>
                      <dt>Effective tax</dt>
                      <dd>{s.effectiveRate.toFixed(1)}%</dd>
                    </div>
                  </dl>
                  <p className="scenario-highlight">{s.highlight}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {examples && taxSummary && (
          <section className="content-section">
            <h2>
              {taxSummary.name} Take-Home Pay Examples ({YEAR})
            </h2>
            <p>
              Estimated net pay for a single filer with no 401(k) or local tax.
            </p>
            <div className="example-table-wrap">
              <table className="example-table">
                <thead>
                  <tr>
                    <th>Gross salary</th>
                    <th>Est. annual take-home</th>
                    <th>Est. biweekly net</th>
                    <th>Effective tax rate</th>
                  </tr>
                </thead>
                <tbody>
                  {examples.map((ex) => (
                    <tr key={ex.annualGross}>
                      <td>{ex.label}</td>
                      <td>{formatMoney(ex.netAnnual)}</td>
                      <td>{formatMoney(ex.netBiweekly)}</td>
                      <td>{ex.effectiveRate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {page.contentSections.map((section) => (
          <section key={section.heading} className="content-section">
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}

        {(page.category === "hub" || page.slug === "take-home-pay-calculator" || page.slug === "hourly-paycheck-calculator") && (
          <section className="content-section">
            <h2>Popular state paycheck calculators</h2>
            <p>Start with the highest-traffic states, then browse all 50.</p>
            <div className="states-grid">
              {[
                ["california-paycheck-calculator", "California"],
                ["texas-paycheck-calculator", "Texas"],
                ["new-york-paycheck-calculator", "New York"],
                ["florida-paycheck-calculator", "Florida"],
                ["states", "All states"],
              ].map(([href, label]) => (
                <Link key={href} href={href === "states" ? "/states" : `/${href}`}>
                  {label}
                </Link>
              ))}
            </div>
          </section>
        )}

        {(page.category === "hub" || isStatePage) && (
          <section className="content-section">
            <h2>
              {isStatePage
                ? "Paycheck Calculators for Other States"
                : "Paycheck Calculators by State"}
            </h2>
            <p>
              Each state page preloads that state’s tax rules for a faster
              estimate.
            </p>
            <div className="states-grid">
              {allStates
                .filter((p) => p.slug !== page.slug)
                .map((p) => (
                  <Link key={p.slug} href={`/${p.slug}`}>
                    {p.h1.replace(" Paycheck Calculator", "")}
                  </Link>
                ))}
            </div>
          </section>
        )}

        {(page.category === "hub" || isIntlPage) && (
          <section className="content-section">
            <h2>
              {page.category === "province"
                ? "Canada Province Calculators"
                : page.category === "europe"
                  ? "European Country Calculators"
                  : "International Paycheck Calculators"}
            </h2>
            <p>
              UK, Canada provinces, Australia, and Tier-1 European countries —
              each with its own tax engine.
            </p>
            <div className="states-grid">
              {(page.category === "province" ? allProvinces : allCountries)
                .filter((p) => p.slug !== page.slug)
                .map((p) => (
                  <Link key={p.slug} href={`/${p.slug}`}>
                    {calculatorChipLabel(p.h1)}
                  </Link>
                ))}
              {page.category !== "province" && (
                <Link href="/countries">All countries</Link>
              )}
            </div>
          </section>
        )}

        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          {page.faqs.map((faq) => (
            <details key={faq.question} className="faq-item">
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </section>

        {related.length > 0 && (
          <section className="related-links">
            <h2>Related Calculators</h2>
            <div className="link-grid">
              {related
                .filter((p) => p.category !== "state" || !isStatePage)
                .slice(0, 8)
                .map((p) => (
                  <Link key={p.slug} href={p.slug ? `/${p.slug}` : "/"}>
                    {p.h1}
                  </Link>
                ))}
            </div>
          </section>
        )}

        <div className="disclaimer">
          <strong>Disclaimer:</strong> This paycheck calculator provides
          estimates only and is not tax advice. Actual withholdings may differ
          based on W-4 settings, local taxes, benefits, and employer policies.
          Consult a tax professional for personalized guidance.{" "}
          <Link href="/methodology">See our methodology</Link> for sources (IRS Pub
          15-T, FICA, state &amp; local taxes).
        </div>
      </main>

      <Footer />
    </div>
  );
}
