// CDA-WEBSITE-PROJECT/CDA-WEBSITE/cda-frontend/src/app/layout.js
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import '../styles/globals.css';
import { ApolloWrapper } from './providers';

export const metadata = {
  title: 'CDA Systems Limited',
  description: 'Innovative digital solutions for businesses',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'CDA Systems Limited',
    description: 'Innovative digital solutions for businesses',
    url: 'https://cda.group',
    siteName: 'CDA Systems Limited',
    images: [
      {
        url: 'https://cda.group/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-MVQM4K5');`
        }} />
        {/* End Google Tag Manager */}
      </head>
      <body className="min-h-screen bg-gray-50">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MVQM4K5"
            height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
        </noscript>
        
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          {children}
        </ApolloWrapper>
      </body>
    </html>
  );
}