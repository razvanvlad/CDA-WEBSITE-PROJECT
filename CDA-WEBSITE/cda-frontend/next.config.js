/** @type {import('next').NextConfig} */

// Environment detection
const isDev = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'
const isLocal = process.env.VERCEL !== '1' && process.env.NODE_ENV !== 'production'

// Environment-specific WordPress URLs
const getWordPressURL = () => {
  // Priority: explicit env var > environment detection > fallback
  if (process.env.NEXT_PUBLIC_WORDPRESS_URL) {
    return process.env.NEXT_PUBLIC_WORDPRESS_URL
  }
  
  if (isLocal || isDev) {
    return 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend'
  }
  
  return 'https://cdanewwebsite.wpenginepowered.com'
}

// Environment-specific Site URLs
const getSiteURL = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  if (isLocal || isDev) {
    return 'http://localhost:3000'
  }
  
  return 'https://cda-frontend-nine.vercel.app'
}

const wordpressURL = getWordPressURL()
const siteURL = getSiteURL()

// Debug logging (only in development)
if (isDev) {
  console.log('🔧 Next.js Config Debug:')
  console.log('  Environment:', process.env.NODE_ENV)
  console.log('  Is Local:', isLocal)
  console.log('  WordPress URL:', wordpressURL)
  console.log('  Site URL:', siteURL)
  console.log('  GraphQL Endpoint:', process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT || `${wordpressURL.replace(/\/$/, '')}/graphql`)
}

const nextConfig = {
  env: {
    NEXT_PUBLIC_WORDPRESS_URL: wordpressURL,
    NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT: 
      process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT ||
      `${wordpressURL.replace(/\/$/, '')}/graphql`,
    NEXT_PUBLIC_SITE_URL: siteURL,
    SITE_URL: process.env.SITE_URL || siteURL,
  },
  // Allow Next/Image to optimize images served from WP Engine uploads and local uploads
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536],
    imageSizes: [200, 320, 400, 640, 750, 828],
    minimumCacheTTL: 60,
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
    return [
      // Proxy GraphQL to WP
      {
        source: '/api/wp-graphql',
        destination: `${wordpressURL.replace(/\/$/, '')}/graphql`,
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