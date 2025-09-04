// 3. Update your src/app/layout.js
import CustomApolloProvider from '../components/providers/ApolloProvider';

export const metadata = {
  title: 'CDA Systems',
  description: 'Professional web development and digital marketing services',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CustomApolloProvider>
          {children}
        </CustomApolloProvider>
      </body>
    </html>
  );
}