// src/lib/graphql/client.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create HTTP link
const httpLink = createHttpLink({
  uri:
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT ||
    (process.env.NEXT_PUBLIC_WORDPRESS_URL
      ? `${process.env.NEXT_PUBLIC_WORDPRESS_URL.replace(/\/$/, '')}/graphql`
      : 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql'),
});

// Create auth link for headers if needed
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;