"use client";

import Link from "next/link";
import {
  getAllStatePages,
} from "@/lib/seo/pages";
import { getStateTaxSummary } from "@/lib/seo/state-content";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useLocale } from "@/components/LocaleProvider";

export default function StatesPageContent() {
  const { t } = useLocale();
  const states = getAllStatePages();

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
            <span>{t("ui.breadcrumbStates")}</span>
          </nav>
          <div className="hero-copy">
            <h1 style={{ color: "#ffffff" }}>{t("states.title")}</h1>
            <p style={{ color: "rgba(255,255,255,0.9)" }}>{t("states.subtitle")}</p>
          </div>
        </div>
      </section>

      <main className="container">
        <section className="content-section">
          <h2>{t("states.allStates")}</h2>
          <div className="states-list">
            {states.map((page) => {
              const code = page.stateCode!;
              const summary = getStateTaxSummary(code);
              return (
                <Link
                  key={page.slug}
                  href={`/${page.slug}`}
                  className="state-list-item"
                >
                  <span className="state-name">{summary.name}</span>
                  <span className="state-rate">
                    {summary.hasIncomeTax
                      ? summary.rateLabel
                      : t("states.noTax")}
                  </span>
                </Link>
              );
            })}
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
