# PaycheckLink

Free paycheck, salary, and take-home pay calculator — [paychecklink.com](https://paychecklink.com).

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:43123](http://localhost:43123) if you start with `npx next dev --port 43123`, or the port printed by `npm run dev`.

## Build & Deploy

```bash
npm run build
```

Static export lands in `out/` (Cloudflare Pages via `wrangler.jsonc`).

Set your production domain in `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://paychecklink.com
```

After deploy:

1. Search Console → Sitemaps → resubmit `https://paychecklink.com/sitemap.xml`
2. Cloudflare → Rules → Redirects: `www.paychecklink.com` → `https://paychecklink.com` (301)
3. Cloudflare → Scrape Shield: turn **off** Email Address Obfuscation (it creates `/cdn-cgi/l/email-protection` 404s in Search Console)

## SEO Architecture

| Cluster | URLs | Example |
|---|---|---|
| Hub | `/`, `/salary-calculator` | Primary keywords |
| Frequency | `/weekly-paycheck-calculator`, etc. | Pay schedule intent |
| Pay type | `/hourly-paycheck-calculator`, converters | Hourly/salary intent |
| Tax angle | `/take-home-pay-calculator`, `/paycheck-tax-calculator` | After-tax intent |
| Extras | `/401k-paycheck-calculator`, overtime, bonus | Modifier intent |
| States | `/california-paycheck-calculator` (×50) | Geo intent |
| State variants | CA/TX/NY/FL deep pages | High-volume states |

## Tax Engine

- Federal income tax (IRS Pub 15-T / W-4 compatible)
- FICA: Social Security + Medicare
- State income tax (all 50 states)
- Local ZIP lookups (selected cities)
- UK, Canada, Australia, and Tier-1 Europe engines

Estimates only — not tax advice.
