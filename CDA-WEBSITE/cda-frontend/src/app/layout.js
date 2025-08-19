// CDA-WEBSITE-PROJECT/CDA-WEBSITE/cda-frontend/src/app/layout.js
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import '../styles/globals.css';

export const metadata = {
  title: 'CDA Systems Limited',
  description: 'Innovative digital solutions for businesses',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}