import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cda-website-solutions.com'),
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

  return (
    <html lang="en">
      <head>
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
