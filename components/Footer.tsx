"use client";

import Link from "next/link";
import { SITE_NAME, YEAR } from "@/lib/seo/pages";
import LogoMark from "./LogoMark";
import { useLocale } from "./LocaleProvider";

const CALC_LINKS = [
  { href: "/salary-calculator", key: "nav.salary" as const },
  { href: "/take-home-pay-calculator", key: "nav.takeHome" as const },
  { href: "/hourly-paycheck-calculator", key: "nav.hourly" as const },
  { href: "/biweekly-paycheck-calculator", label: "Biweekly" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];

const STATE_LINKS = [
  { href: "/california-paycheck-calculator", label: "California" },
  { href: "/texas-paycheck-calculator", label: "Texas" },
  { href: "/new-york-paycheck-calculator", label: "New York" },
  { href: "/florida-paycheck-calculator", label: "Florida" },
  { href: "/states", key: "nav.states" as const },
];

const COUNTRY_LINKS = [
  { href: "/uk-paycheck-calculator", label: "United Kingdom" },
  { href: "/canada-paycheck-calculator", label: "Canada" },
  { href: "/australia-paycheck-calculator", label: "Australia" },
  { href: "/germany-paycheck-calculator", label: "Germany" },
  { href: "/europe-paycheck-calculator", label: "Europe" },
  { href: "/countries", label: "All Countries" },
];

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="logo footer-logo">
            <LogoMark />
            <span className="logo-text">{SITE_NAME}</span>
          </Link>
          <p>{t("footer.tagline")}</p>
          <p className="footer-meta">{t("footer.languageNote")}</p>
        </div>

        <div>
          <h3>{t("footer.calculators")}</h3>
          <ul className="footer-links">
            {CALC_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  {"key" in link && link.key ? t(link.key) : link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>{t("footer.popularStates")}</h3>
          <ul className="footer-links">
            {STATE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  {"key" in link && link.key ? t(link.key) : link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Countries</h3>
          <ul className="footer-links">
            {COUNTRY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          © {YEAR} {SITE_NAME}. {t("footer.rights")}
        </p>
        <p>{t("footer.disclaimerShort")}</p>
      </div>
    </footer>
  );
}
