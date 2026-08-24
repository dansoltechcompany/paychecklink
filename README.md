# PaycheckLink

Free paycheck, salary, and take-home pay calculator — [paychecklink.com](https://paychecklink.com).

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build & Deploy

```bash
npm run build
npm start
```

Set your production domain in `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://paychecklink.com
```

Deploy to Vercel, Netlify, or any Node host that supports Next.js.

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
