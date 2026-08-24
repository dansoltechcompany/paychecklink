import type { Metadata } from "next";
import CountriesPageContent from "@/components/CountriesPageContent";
import {
  buildBreadcrumbSchema,
  buildCanonical,
  SITE_NAME,
  YEAR,
} from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: `International Paycheck Calculators ${YEAR} — UK, Canada, Europe`,
  description: `Take-home pay calculators for the UK, Canada (all provinces), Australia, and major European countries including Germany, France, Netherlands, and Ireland.`,
  alternates: { canonical: buildCanonical("countries") },
};

export default function CountriesIndexPage() {
  const url = buildCanonical("countries");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbSchema([
              { name: SITE_NAME, url: buildCanonical("") },
              { name: "Countries", url },
            ])
          ),
        }}
      />
      <CountriesPageContent />
    </>
  );
}
