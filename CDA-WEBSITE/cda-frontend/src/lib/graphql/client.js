// CDA-WEBSITE-PROJECT/CDA-FRONTEND/src/lib/graphql/client.js
import { GraphQLClient } from 'graphql-request';

const graphqlClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT ||
  'http://localhost/CDA-WORDPRESS/graphql'
);

export default graphqlClient;