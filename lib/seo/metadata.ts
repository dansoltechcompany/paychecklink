import { SITE_NAME, YEAR } from "./pages";

/** Apex origin with no trailing slash. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://paychecklink.com"
).replace(/\/$/, "");

/**
 * Absolute canonical URL with a trailing slash.
 * next.config trailingSlash is true, so slashless URLs 308 and GSC
 * reports them as "Page with redirect" if the sitemap omits the slash.
 */
export function pagePath(slug: string): string {
  const clean = slug.replace(/^\/+|\/+$/g, "");
  return clean ? `/${clean}/` : "/";
}

export function buildCanonical(slug: string): string {
  return `${SITE_URL}${pagePath(slug)}`;
}

export function buildSoftwareSchema(title: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    description,
    url,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Organization", name: SITE_NAME },
  };
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export { SITE_NAME, YEAR };
