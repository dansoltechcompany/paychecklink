import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import {
  buildCanonical,
  buildFAQSchema,
  buildSoftwareSchema,
} from "@/lib/seo/metadata";
import { getPageBySlug, getRelatedPages, SEO_PAGES } from "@/lib/seo/pages";

const page = SEO_PAGES[0];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  keywords: page.keywords,
  alternates: { canonical: buildCanonical("") },
  openGraph: {
    title: page.title,
    description: page.description,
    type: "website",
  },
};

export default function HomePage() {
  const related = getRelatedPages(page, 50);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildSoftwareSchema(page.title, page.description, buildCanonical(""))
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFAQSchema(page.faqs)),
        }}
      />
      <PageLayout page={page} related={related} />
    </>
  );
}
