import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "../styles/global.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CDA Website Solutions - Digital Marketing & Web Development",
    template: "%s | CDA Website Solutions"
  },
  description: "Leading digital marketing and web development agency specializing in custom solutions, eCommerce, B2B lead generation, and comprehensive digital strategies.",
  keywords: ["digital marketing", "web development", "eCommerce", "B2B lead generation", "SEO", "web design", "digital strategy"],
  authors: [{ name: "CDA Website Solutions" }],
  creator: "CDA Website Solutions",
  publisher: "CDA Website Solutions",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'CDA Website Solutions',
    title: 'CDA Website Solutions - Digital Marketing & Web Development',
    description: 'Leading digital marketing and web development agency specializing in custom solutions, eCommerce, B2B lead generation, and comprehensive digital strategies.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CDA Website Solutions - Digital Marketing & Web Development'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CDA Website Solutions - Digital Marketing & Web Development',
    description: 'Leading digital marketing and web development agency specializing in custom solutions, eCommerce, B2B lead generation, and comprehensive digital strategies.',
    images: ['/images/twitter-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CDA Website Solutions",
    "url": "https://cda-website-solutions.com",
    "logo": "https://cda-website-solutions.com/images/logo.png",
    "description": "Leading digital marketing and web development agency specializing in custom solutions, eCommerce, B2B lead generation, and comprehensive digital strategies.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://www.linkedin.com/company/cda-website-solutions",
      "https://twitter.com/cda_solutions"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-CDA-SITE",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Web Development Services",
        "description": "Custom web development and eCommerce solutions"
      },
      {
        "@type": "Offer", 
        "name": "Digital Marketing Services",
        "description": "SEO, PPC, and digital marketing strategies"
      }
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CDA Website Solutions",
    "url": "https://cda-website-solutions.com",
    "description": "Leading digital marketing and web development agency",
    "publisher": {
      "@type": "Organization",
      "name": "CDA Website Solutions"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://cda-website-solutions.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // Safely derive the WordPress GraphQL origin for preconnect/dns-prefetch
  const wpGraphQLEndpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT || 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql';
  let wpGraphQLOrigin: string | null = null;
  try {
    wpGraphQLOrigin = new URL(wpGraphQLEndpoint).origin;
  } catch {
    wpGraphQLOrigin = null;
  }

  // Minimal, non-intrusive performance observer that logs key metrics
  const perfObserverScript = `(() => { try {
    if (typeof window === 'undefined') return;
    const state = { lcp: null, cls: 0, inp: null, ttfb: null };
    // Expose initial state immediately
    try { window.__PERF__ = state; } catch (_) {}
    // TTFB from navigation timing
    const nav = performance.getEntriesByType('navigation');
    if (nav && nav[0]) { state.ttfb = Math.round(nav[0].responseStart); }

    // CLS observer
    let clsValue = 0;
    if ('PerformanceObserver' in window) {
      try {
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            const anyEntry = entry; // JS runtime
            if (!document.hidden && !(anyEntry.hadRecentInput)) {
              clsValue += anyEntry.value || 0;
              state.cls = Math.round((clsValue + Number.EPSILON) * 1000) / 1000;
              window.__PERF__ = state;
            }
          });
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (_) {}

      // LCP observer
      let lcpEntry = null;
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          lcpEntry = entries[entries.length - 1] || lcpEntry;
          if (lcpEntry) { state.lcp = Math.round(lcpEntry.startTime); window.__PERF__ = state; }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (_) {}

      // INP approximation via long-duration event entries
      try {
        if ('PerformanceEventTiming' in window) {
          const inpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const last = entries[entries.length - 1];
            if (last) { state.inp = Math.round(last.duration); window.__PERF__ = state; }
          });
          inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 40 });
        }
      } catch (_) {}

      const report = () => {
        try {
          const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
          const lcp = lcpEntries && lcpEntries.length ? lcpEntries[lcpEntries.length - 1] : null;
          state.lcp = lcp ? Math.round(lcp.startTime) : state.lcp;
          state.cls = Math.round((clsValue + Number.EPSILON) * 1000) / 1000;
          window.__PERF__ = state;
          console.log('[web-vitals]', state);
        } catch (e) {}
      };

      // Also update on load so values become available during active session
      window.addEventListener('load', report, { once: true });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') report();
      }, { once: true });
      window.addEventListener('pagehide', report, { once: true });
    }
  } catch (e) { /* swallow */ }})();`;

  return (
    <html lang="en">
      <head>
        {/* Resource Hints for WordPress GraphQL */}
        {wpGraphQLOrigin && (
          <>
            <link rel="dns-prefetch" href={wpGraphQLOrigin} />
            <link rel="preconnect" href={wpGraphQLOrigin} crossOrigin="anonymous" />
          </>
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        {/* Lightweight performance observer */}
        <script dangerouslySetInnerHTML={{ __html: perfObserverScript }} />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
