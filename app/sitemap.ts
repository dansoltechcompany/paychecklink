import type { MetadataRoute } from "next";
import { buildCanonical } from "@/lib/seo/metadata";
import { SEO_PAGES, getAllSlugs } from "@/lib/seo/pages";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllSlugs();
  const now = new Date();

  return [
    {
      url: buildCanonical(""),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: buildCanonical("states"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: buildCanonical("countries"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: buildCanonical("methodology"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.65,
    },
    {
      url: buildCanonical("about"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: buildCanonical("privacy"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.55,
    },
    ...slugs.map((slug) => {
      const page = SEO_PAGES.find((p) => p.slug === slug);
      const isVariant = page?.category === "state-variant";
      const isMainState =
        page?.category === "state" && slug.endsWith("-paycheck-calculator");
      const isTopState =
        page?.priority === "high" ||
        /^(california|texas|new-york|florida)-paycheck-calculator$/.test(slug);

      let priority = 0.7;
      if (isVariant) priority = 0.68;
      else if (isTopState) priority = 0.95;
      else if (isMainState) priority = 0.82;
      else if (slug.includes("paycheck") || slug.includes("salary"))
        priority = 0.78;

      return {
        url: buildCanonical(slug),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority,
      };
    }),
  ];
}
