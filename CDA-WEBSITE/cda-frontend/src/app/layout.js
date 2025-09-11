import './globals.css';
import '../styles/global.css';

export const metadata = {
  title: 'CDA Systems - WordPress Integration Active',
  description: 'Professional web development services - Content loaded from WordPress',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://cdanewwebsite.wpenginepowered.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdanewwebsite.wpenginepowered.com" />
      </head>
      <body className="bg-white">
        {children}
      </body>
    </html>
  );
}
