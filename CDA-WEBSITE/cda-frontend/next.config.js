// CDA-WEBSITE-PROJECT/CDA-WEBSITE/cda-frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'cda.group'],
  },
  env: {
    NEXT_PUBLIC_WORDPRESS_URL: 'http://localhost/CDA-WEBSITE/wordpress-backend',
  },
};

module.exports = nextConfig;