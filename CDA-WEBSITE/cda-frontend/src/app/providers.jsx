'use client';

import { ApolloProvider } from '@apollo/client';
import { useMemo } from 'react';
import { createClient } from '../lib/apollo-client';

export function ApolloWrapper({ children }) {
  const client = useMemo(() => createClient(), []);
  
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}