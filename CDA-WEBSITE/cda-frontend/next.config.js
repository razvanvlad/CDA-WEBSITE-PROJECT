/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Prefer environment variables (Vercel or .env.*). Provide sensible defaults.
    NEXT_PUBLIC_WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://cdanewwebsite.wpenginepowered.com',
    NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT:
      process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT ||
      `${(process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://cdanewwebsite.wpenginepowered.com').replace(/\/$/, '')}/graphql`,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://127.0.0.1:3000',
    SITE_URL: process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://127.0.0.1:3000',
  },
  // Allow Next/Image to optimize images served from WP Engine uploads and local uploads
  images: {
    remotePatterns: [
      // Local WP (when running locally)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/wp-content/uploads/**',
      },
      // WP Engine dev
      {
        protocol: 'https',
        hostname: 'cdanewwebsite.wpenginepowered.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  // Temporarily ignore ESLint errors during builds to unblock production.
  eslint: {
    ignoreDuringBuilds: true,
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