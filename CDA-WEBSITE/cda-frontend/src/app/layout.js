import './globals.css';

export const metadata = {
  title: 'CDA Systems - WordPress Integration Active',
  description: 'Professional web development services - Content loaded from WordPress',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white">
        {children}
      </body>
    </html>
  );
}
