import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/metadata";
import { SEO_PAGES, getAllSlugs } from "@/lib/seo/pages";

export const dynamic = "force-static";

const HIGH_SLUGS = new Set(
  SEO_PAGES.filter((p) => p.priority === "high" && p.slug).map((p) => p.slug)
);

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllSlugs();
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/states`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/countries`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/methodology`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.65,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    ...slugs.map((slug) => {
      const isTopState =
        /^(california|texas|new-york|florida)-/.test(slug) ||
        HIGH_SLUGS.has(slug);
      return {
        url: `${SITE_URL}/${slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: isTopState
          ? 0.95
          : slug.endsWith("-paycheck-calculator")
            ? 0.82
            : slug.includes("paycheck") || slug.includes("salary")
              ? 0.78
              : 0.7,
      };
    }),
  ];
}
