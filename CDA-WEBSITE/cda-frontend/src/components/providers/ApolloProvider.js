// 2. Create src/components/providers/ApolloProvider.js
'use client';

import { ApolloProvider } from '@apollo/client';
import client from '../../lib/graphql/client';

export default function CustomApolloProvider({ children }) {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}