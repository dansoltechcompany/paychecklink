import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import {
  buildBreadcrumbSchema,
  buildCanonical,
  buildFAQSchema,
  buildSoftwareSchema,
  SITE_NAME,
} from "@/lib/seo/metadata";
import {
  getAllSlugs,
  getPageBySlug,
  getRelatedPages,
} from "@/lib/seo/pages";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: buildCanonical(slug) },
    openGraph: {
      title: page.title,
      description: page.description,
      type: "website",
      url: buildCanonical(slug),
    },
    twitter: {
      card: "summary",
      title: page.title,
      description: page.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) notFound();

  const related = getRelatedPages(page);
  const url = buildCanonical(slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildSoftwareSchema(page.title, page.description, url)
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFAQSchema(page.faqs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbSchema([
              { name: SITE_NAME, url: buildCanonical("") },
              { name: page.h1, url },
            ])
          ),
        }}
      />
      <PageLayout page={page} related={related} />
    </>
  );
}
