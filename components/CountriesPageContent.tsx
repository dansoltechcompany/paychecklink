"use client";

import Link from "next/link";
import {
  getAllProvincePages,
} from "@/lib/seo/pages";
import { COUNTRIES, EUROPE_COUNTRIES } from "@/lib/types";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useLocale } from "@/components/LocaleProvider";

const HUBS = [
  { name: "United Kingdom", href: "/uk-paycheck-calculator", currency: "GBP" },
  { name: "Canada", href: "/canada-paycheck-calculator", currency: "CAD" },
  { name: "Australia", href: "/australia-paycheck-calculator", currency: "AUD" },
  { name: "Ireland", href: "/ireland-paycheck-calculator", currency: "EUR" },
  { name: "Germany", href: "/germany-paycheck-calculator", currency: "EUR" },
  { name: "Netherlands", href: "/netherlands-paycheck-calculator", currency: "EUR" },
  { name: "France", href: "/france-paycheck-calculator", currency: "EUR" },
  { name: "Spain", href: "/spain-paycheck-calculator", currency: "EUR" },
  { name: "Italy", href: "/italy-paycheck-calculator", currency: "EUR" },
  { name: "Sweden", href: "/sweden-paycheck-calculator", currency: "SEK" },
  { name: "Switzerland", href: "/switzerland-paycheck-calculator", currency: "CHF" },
];

export default function CountriesPageContent() {
  const { t } = useLocale();
  const provinces = getAllProvincePages();

  return (
    <div className="page-shell">
      <Navbar />

      <section
        className="hero-band hero-band-page"
        style={{ background: "#0466c8", color: "#ffffff" }}
      >
        <div className="container hero">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">{t("ui.home")}</Link>
            {" / "}
            <span>Countries</span>
          </nav>
          <div className="hero-copy">
            <h1 style={{ color: "#ffffff" }}>International Paycheck Calculators</h1>
            <p style={{ color: "rgba(255,255,255,0.9)" }}>
              Take-home pay calculators for the UK, Canada, Australia, and major
              European countries — same structure as our US state pages.
            </p>
          </div>
        </div>
      </section>

      <main className="container">
        <section className="content-section">
          <h2>Countries</h2>
          <div className="states-list">
            <Link href="/" className="state-list-item">
              <span className="state-name">United States</span>
              <span className="state-rate">50 states · USD</span>
            </Link>
            {HUBS.map((c) => (
              <Link key={c.href} href={c.href} className="state-list-item">
                <span className="state-name">{c.name}</span>
                <span className="state-rate">{c.currency}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="content-section">
          <h2>Canada Provinces</h2>
          <p>
            Like US states — each province page preloads Canadian federal +
            provincial tax settings.
          </p>
          <div className="states-grid">
            {provinces.map((p) => (
              <Link key={p.slug} href={`/${p.slug}`}>
                {p.h1.replace(" Paycheck Calculator", "")}
              </Link>
            ))}
          </div>
        </section>

        <section className="content-section">
          <h2>Europe (Tier-1)</h2>
          <p>
            Country-level calculators for{" "}
            {EUROPE_COUNTRIES.map((c) => COUNTRIES[c].name).join(", ")}.
          </p>
          <div className="states-grid">
            {EUROPE_COUNTRIES.map((code) => (
              <Link key={code} href={`/${COUNTRIES[code].slug}`}>
                {COUNTRIES[code].name}
              </Link>
            ))}
            <Link href="/europe-paycheck-calculator">Europe hub</Link>
          </div>
        </section>

        <div className="disclaimer">
          <strong>Disclaimer:</strong> {t("ui.disclaimer")}
        </div>
      </main>

      <Footer />
    </div>
  );
}
