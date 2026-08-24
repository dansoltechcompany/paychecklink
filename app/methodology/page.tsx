import type { Metadata } from "next";
import {
  buildBreadcrumbSchema,
  buildCanonical,
  SITE_NAME,
  YEAR,
} from "@/lib/seo/metadata";
import MethodologyContent from "@/components/MethodologyContent";

export const metadata: Metadata = {
  title: `Paycheck Calculator Methodology ${YEAR} — Accuracy & Sources`,
  description: `How our paycheck calculator estimates take-home pay using IRS Publication 15-T, FICA, state tax tables, and local ZIP rates — built for ADP/PaycheckCity-level accuracy.`,
  alternates: { canonical: buildCanonical("methodology") },
};

export default function MethodologyPage() {
  const url = buildCanonical("methodology");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbSchema([
              { name: SITE_NAME, url: buildCanonical("") },
              { name: "Methodology", url },
            ])
          ),
        }}
      />
      <MethodologyContent />
    </>
  );
}
