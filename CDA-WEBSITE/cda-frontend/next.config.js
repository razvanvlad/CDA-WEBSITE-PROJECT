/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_WORDPRESS_URL: 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend',
    NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT: '/api/wp-graphql',
    // Ensure server-side relative endpoints resolve correctly on Windows (avoid IPv6 localhost issues)
    NEXT_PUBLIC_SITE_URL: 'http://127.0.0.1:3000',
    SITE_URL: 'http://127.0.0.1:3000',
  },
  // Allow Next/Image to optimize images served from local WordPress uploads
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/wp-content/uploads/**',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/eCommerce', destination: '/services/ecommerce', permanent: true },
      { source: '/sectors', destination: '/services', permanent: true },
    ];
  },
  async rewrites() {
    const wpBase = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend';
    return [
      // Proxy GraphQL to WP
      {
        source: '/api/wp-graphql',
        destination: `${wpBase.replace(/\/$/, '')}/graphql`,
      },
      // Legacy blog permalink structure to Next.js route
      {
        source: '/blog/:year/:month/:day/:slug',
        destination: '/news-article/:slug',
      },
    ];
  },
};

module.exports = nextConfig;