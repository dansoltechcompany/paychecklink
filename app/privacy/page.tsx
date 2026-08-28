import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { YEAR } from "@/lib/seo/pages";

const CONTACT_EMAIL = "info@dansoltech.com";
const LAST_UPDATED = "August 28, 2026";

export const metadata: Metadata = {
  title: `Privacy Policy (${YEAR})`,
  description:
    "Privacy policy for PaycheckLink (paychecklink.com) and the PaycheckLink Android app, operated by Dansol Tech Pvt. Ltd.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
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
            <span>Privacy</span>
          </nav>
          <div className="hero-copy">
            <h1 style={{ color: "#ffffff" }}>Privacy Policy</h1>
            <p style={{ color: "rgba(255,255,255,0.9)" }}>
              PaycheckLink website and Android app — plain-language summary of
              what we collect and what we do not.
            </p>
          </div>
        </div>
      </section>
      <main className="container">
        <section className="content-section">
          <p>
            <strong>Last updated:</strong> {LAST_UPDATED}
          </p>
        </section>

        <section className="content-section">
          <h2>Who we are</h2>
          <p>
            PaycheckLink is operated by <strong>Dansol Tech Pvt. Ltd.</strong>{" "}
            (&quot;Dansol Tech,&quot; &quot;we,&quot; &quot;us&quot;). This
            policy applies to:
          </p>
          <ul className="methodology-list">
            <li>
              The website at{" "}
              <Link href="/">paychecklink.com</Link> (and related pages)
            </li>
            <li>
              The <strong>PaycheckLink</strong> Android app on Google Play
              (package name: <code>com.paychecklink.calculator</code>)
            </li>
          </ul>
        </section>

        <section className="content-section">
          <h2>Quick summary</h2>
          <ul className="methodology-list">
            <li>
              <strong>No account or login</strong> is required on the website
              or in the app.
            </li>
            <li>
              <strong>Paycheck calculations run on your device</strong> in the
              Android app. We do not receive your salary, hourly rate, state, or
              take-home results.
            </li>
            <li>
              We are <strong>not tax preparers</strong>. PaycheckLink provides
              estimates only — not tax, legal, or financial advice.
            </li>
            <li>
              We do <strong>not</strong> sell your personal information.
            </li>
          </ul>
        </section>

        <section className="content-section">
          <h2>PaycheckLink Android app</h2>
          <h3>How the app works</h3>
          <p>
            When you enter a salary, hourly rate, state, or other inputs, the
            app calculates take-home pay <strong>locally on your phone</strong>.
            Those numbers are not uploaded to our servers because we do not
            operate a backend that stores paycheck data for the app.
          </p>
          <h3>What the app does not collect</h3>
          <p>The PaycheckLink app does not ask for access to, and does not send us:</p>
          <ul className="methodology-list">
            <li>Your contacts, photos, or files</li>
            <li>Your precise location (GPS)</li>
            <li>Your microphone or camera</li>
            <li>Paycheck amounts, tax inputs, or calculation results</li>
            <li>An email address, name, or user account (there is no sign-up)</li>
          </ul>
          <p>
            If you uninstall the app, any values you typed exist only on your
            device and are removed with the app unless your phone OS keeps
            unrelated backups.
          </p>
        </section>

        <section className="content-section">
          <h2>PaycheckLink website (paychecklink.com)</h2>
          <p>
            Like most websites, when you visit paychecklink.com your browser
            sends standard technical information needed to load pages — for
            example your IP address, browser type, and the pages you request.
          </p>
          <p>
            The site is hosted on <strong>Cloudflare Pages</strong>. Cloudflare
            may process connection and security logs as part of hosting and
            protecting the site. We do not use those logs to identify individual
            users for marketing.
          </p>
          <p>
            We do <strong>not</strong> currently run third-party advertising or
            analytics scripts (such as Google Analytics) on the calculator pages.
            If we add analytics or ads in the future, we will update this policy
            and describe what is collected.
          </p>
          <p>
            Calculator inputs on the website are processed in your browser to
            show results. We do not ask you to create an account and we do not
            store your salary or paycheck entries on our servers.
          </p>
        </section>

        <section className="content-section">
          <h2>Google Play and your device</h2>
          <p>
            When you install the app from Google Play, <strong>Google</strong>{" "}
            may collect information as described in{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google&apos;s Privacy Policy
            </a>{" "}
            — for example device type, install events, and crash reports if you
            opt in to share them with developers. That collection is handled by
            Google and your device manufacturer, not by Dansol Tech directly.
          </p>
          <p>
            You can review app permissions in Android Settings before or after
            install. PaycheckLink is designed to work without sensitive
            permissions.
          </p>
        </section>

        <section className="content-section">
          <h2>Not tax preparers — estimates only</h2>
          <p>
            PaycheckLink helps you <em>estimate</em> take-home pay using
            published tax tables and withholding methods. We are not a CPA firm,
            payroll provider, or tax preparation service. Results may differ from
            your actual paystub. Do not rely on PaycheckLink as your only source
            for tax filing or legal decisions. See our{" "}
            <Link href="/methodology">Methodology</Link> page for how estimates
            are built.
          </p>
        </section>

        <section className="content-section">
          <h2>Children</h2>
          <p>
            PaycheckLink is intended for adults managing employment income. We do
            not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section className="content-section">
          <h2>Changes to this policy</h2>
          <p>
            We may update this page when our products or legal requirements
            change. The &quot;Last updated&quot; date at the top will change
            when we do. Continued use of the site or app after an update means
            you accept the revised policy.
          </p>
        </section>

        <section className="content-section">
          <h2>Contact us</h2>
          <p>
            Questions about this privacy policy or the PaycheckLink app listing
            on Google Play? Contact Dansol Tech Pvt. Ltd.:
          </p>
          <p>
            Email:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
          <p>
            This is the same contact used for our Google Play developer account
            (Dansol Tech Pvt. Ltd.).
          </p>
        </section>

        <div className="disclaimer">
          <strong>Disclaimer:</strong> This privacy policy is provided for
          transparency and Google Play compliance. It is not legal advice. If
          you need advice about privacy law in your country, consult a qualified
          professional.
        </div>
      </main>
      <Footer />
    </div>
  );
}
