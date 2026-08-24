import type { Metadata } from "next";
import StatesPageContent from "@/components/StatesPageContent";
import {
  buildBreadcrumbSchema,
  buildCanonical,
  SITE_NAME,
  YEAR,
} from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: `State Paycheck Calculators ${YEAR} — All 50 US States`,
  description: `Free salary paycheck calculators for every US state. Texas, California, Colorado, New York, Florida, and all 50 states with local tax rates.`,
  alternates: { canonical: buildCanonical("states") },
};

export default function StatesIndexPage() {
  const url = buildCanonical("states");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbSchema([
              { name: SITE_NAME, url: buildCanonical("") },
              { name: "State Calculators", url },
            ])
          ),
        }}
      />
      <StatesPageContent />
    </>
  );
}
