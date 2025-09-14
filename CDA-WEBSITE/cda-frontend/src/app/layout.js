import './globals.css';
import '../styles/global.css';
import { Inter, Poppins } from 'next/font/google';

export const metadata = {
  title: 'CDA Systems - WordPress Integration Active',
  description: 'Professional web development services - Content loaded from WordPress',
};

// Load fonts with next/font for optimal performance and preload
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://cdanewwebsite.wpenginepowered.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdanewwebsite.wpenginepowered.com" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} bg-white`}>
        {children}
      </body>
    </html>
  );
}
