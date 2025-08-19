// CDA-WEBSITE-PROJECT/CDA-WEBSITE/cda-frontend/src/lib/graphql/client.js
import { GraphQLClient } from 'graphql-request';

const graphqlClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT || 
  'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql'
);

export default graphqlClient;