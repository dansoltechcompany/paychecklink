import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Sora } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { SITE_NAME } from "@/lib/seo/pages";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0466c8" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1624" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://paychecklink.com"
  ),
  title: {
    default: `${SITE_NAME} — Free Paycheck & Salary Calculator`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Free paycheck calculator for all 50 US states. Calculate salary after taxes, take-home pay, and net pay using IRS Pub 15-T withholding.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/",
  },
  other: {
    "format-detection": "telephone=no",
  },
};

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('spc-theme');
    if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    var l = localStorage.getItem('spc-locale');
    if (l) {
      document.documentElement.lang = l;
      if (l === 'ar') document.documentElement.dir = 'rtl';
    }
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <style
          dangerouslySetInnerHTML={{
            __html: `html,body{max-width:100%;overflow-x:clip}.site-header,.hero-band{background:#0466c8!important;color:#fff!important;max-width:100%}.hero-band .hero h1,.hero-band .hero p{color:#fff!important}select,input{max-width:100%;min-width:0}`,
          }}
        />
      </head>
      <body className={`${sora.className} ${sora.variable} ${bricolage.variable}`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
