// CDA-WEBSITE-PROJECT/CDA-WEBSITE/cda-frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'cda.group'],
  },
  env: {
    // Point to the correct local WordPress instance
    NEXT_PUBLIC_WORDPRESS_URL: 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend',
    // Explicit GraphQL endpoint used by apollo clients
    NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT: 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql',
  },
  async redirects() {
    return [
      // Temporary: fix casing mismatch and missing route
      { source: '/eCommerce', destination: '/services/ecommerce', permanent: false },
      // Temporary: avoid 404 until Sectors page is implemented
      { source: '/sectors', destination: '/services', permanent: false },
    ];
  },
  async rewrites() {
    return [
      // Map legacy WordPress blog permalinks to Next.js dynamic route
      { source: '/index.php/blog/:slug', destination: '/news-article/:slug' },
      { source: '/index.php/blog/:slug/', destination: '/news-article/:slug' },
      { source: '/blog/:slug', destination: '/news-article/:slug' },
      { source: '/blog/:slug/', destination: '/news-article/:slug' },
    ];
  },
};

module.exports = nextConfig;