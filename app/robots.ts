import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/metadata";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Cloudflare email-obfuscation URLs 404 and showed up in GSC as
      // "Not found (404)". Do not send Google to /cdn-cgi/.
      disallow: ["/cdn-cgi/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
