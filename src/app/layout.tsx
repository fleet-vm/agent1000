import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// Carries the wordmark numerals, every count, and every metadata line, so its
// tabular figures are load-bearing: counts must not reflow as filters change.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  // Everything relative in a child page's metadata -- canonicals, OG images --
  // resolves against this. Without it, Next emits relative OG URLs, which
  // crawlers and link unfurlers both ignore.
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_NAME,
    // Child pages set a bare title and get the suffix for free, so no page can
    // ship a title that forgets whose site it is.
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,

  alternates: { canonical: "/" },

  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    // en_ZA: the audience is South African public institutions, and the copy
    // uses SA terms of art throughout -- PFMA schedules, CIPC, SETAs.
    locale: "en_ZA",
    url: "/",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },

  // Card type only. Setting a title or description here would pin every page to
  // the site-level text, because a child page overriding `openGraph` does not
  // touch `twitter` -- and X falls back to the og: tags when the twitter: ones
  // are absent. Less duplication, and it cannot drift out of step.
  twitter: { card: "summary_large_image" },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Stops Safari turning registration numbers and the like into tel: links.
  formatDetection: { telephone: false, address: false, email: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-ZA"
      className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
