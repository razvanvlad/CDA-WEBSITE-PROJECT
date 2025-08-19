// CDA-WEBSITE-PROJECT/CDA-FRONTEND/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'cda.group'],
  },
  env: {
    NEXT_PUBLIC_WORDPRESS_URL: 'http://localhost/CDA-WEBSITE',
  },
};

module.exports = nextConfig;