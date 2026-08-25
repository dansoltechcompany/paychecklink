"use client";

import Link from "next/link";
import { useState } from "react";
import { LOCALES } from "@/lib/i18n/dictionaries";
import { SITE_NAME } from "@/lib/seo/pages";
import LogoMark from "./LogoMark";
import { useLocale } from "./LocaleProvider";
import { useTheme } from "./ThemeProvider";

const NAV_LINKS = [
  { href: "/salary-calculator", key: "nav.salary" as const },
  { href: "/take-home-pay-calculator", key: "nav.takeHome" as const },
  { href: "/hourly-paycheck-calculator", key: "nav.hourly" as const },
  { href: "/states", key: "nav.states" as const },
  { href: "/countries", label: "Countries" },
];

export default function Navbar() {
  const { t, locale, setLocale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className="site-header" suppressHydrationWarning>
      <div className="container header-inner">
        <Link href="/" className="logo" onClick={() => setMenuOpen(false)}>
          <LogoMark />
          <span className="logo-text">
            <span className="logo-text-full">{SITE_NAME}</span>
            <span className="logo-text-short">PaycheckLink</span>
          </span>
        </Link>

        <nav className="nav-desktop" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {"key" in link && link.key ? t(link.key) : link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <div className="lang-wrap">
            <button
              type="button"
              className="icon-btn"
              aria-expanded={langOpen}
              aria-haspopup="listbox"
              aria-label={`${t("lang.label")} — ${LOCALES.length} languages`}
              onClick={() => setLangOpen((v) => !v)}
            >
              <span className="lang-code">{locale.toUpperCase()}</span>
              <span className="lang-chevron" aria-hidden="true">
                ▾
              </span>
              <span className="lang-caret" aria-hidden="true">
                ▾
              </span>
              <span className="lang-caret" aria-hidden="true">
                ▾
              </span>
            </button>
            {langOpen && (
              <>
                <button
                  type="button"
                  className="dropdown-backdrop"
                  aria-label={t("nav.close")}
                  onClick={() => setLangOpen(false)}
                />
                <ul className="lang-menu" role="listbox">
                  {LOCALES.map((l) => (
                    <li key={l.code}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={locale === l.code}
                        className={locale === l.code ? "active" : ""}
                        onClick={() => {
                          setLocale(l.code);
                          setLangOpen(false);
                        }}
                      >
                        <span>{l.nativeLabel}</span>
                        <span className="lang-en">{l.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={t("theme.toggle")}
            title={theme === "light" ? t("theme.dark") : t("theme.light")}
          >
            {theme === "light" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            )}
          </button>

          <button
            type="button"
            className="icon-btn menu-toggle"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t("nav.close") : t("nav.menu")}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="nav-mobile" aria-label="Mobile">
          <div className="container">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {"key" in link && link.key ? t(link.key) : link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
