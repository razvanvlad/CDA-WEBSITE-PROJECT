# Environment Configuration Guide

This Next.js application supports multiple environment configurations for seamless development and production deployments.

## How It Works

The `next.config.js` automatically detects your environment and applies appropriate settings:

- **Development**: Uses localhost WordPress by default
- **Production**: Uses production WordPress URL
- **Vercel/Netlify**: Auto-detects deployment URLs

## Environment Files Priority

Next.js loads environment files in this order (higher priority wins):

1. `.env.production.local` (production builds only)
2. `.env.local` (always loaded, except on Vercel)
3. `.env.production` (production builds only)
4. `.env.development` (development builds only)
5. `.env` (always loaded)

## Quick Setup

### For Local Development

1. Copy `.env.development` settings or create `.env.local`:

```bash
# .env.local
NEXT_PUBLIC_WORDPRESS_URL=http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend
NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT=http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### For Production

1. Copy `.env.production.example` to `.env.production.local`
2. Update the values with your production URLs:

```bash
# .env.production.local
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT=https://your-wordpress-site.com/graphql
NEXT_PUBLIC_SITE_URL=https://your-nextjs-site.com
```

### For Vercel/Netlify Deployment

Set environment variables in your hosting platform dashboard:

- `NEXT_PUBLIC_WORDPRESS_URL`
- `NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT`
- `NEXT_PUBLIC_SITE_URL` (optional, auto-detected on Vercel)

## Environment Variables Reference

| Variable | Description | Development Default | Production Default |
|----------|-------------|-------|---------|
| `NEXT_PUBLIC_WORDPRESS_URL` | WordPress base URL | `http://localhost/...` | `https://cdanewwebsite...` |
| `NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT` | GraphQL endpoint | Local GraphQL | Production GraphQL |
| `NEXT_PUBLIC_SITE_URL` | Next.js site URL | `http://localhost:3000` | Auto-detected |
| `NEXT_PUBLIC_GRAPHQL_REVALIDATE` | Cache revalidation (seconds) | 300 (5 min) | 3600 (1 hour) |

## Debugging

In development mode, the config will log environment details to the console:

```
🔧 Next.js Config Debug:
  Environment: development
  Is Local: true
  WordPress URL: http://localhost/...
  Site URL: http://localhost:3000
  GraphQL Endpoint: http://localhost/.../graphql
```

## Switching Between Local and Remote WordPress

### Option 1: Use Local WordPress (Default)
```bash
# .env.local
NEXT_PUBLIC_WORDPRESS_URL=http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend
NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT=http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql
```

### Option 2: Use Remote WordPress for Development
```bash
# .env.local
NEXT_PUBLIC_WORDPRESS_URL=https://cdanewwebsite.wpenginepowered.com
NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT=https://cdanewwebsite.wpenginepowered.com/graphql
```

## Common Issues

### GraphQL Endpoint Not Found
- Verify WordPress GraphQL plugin is installed and active
- Check the endpoint URL in your browser
- Ensure CORS is properly configured in WordPress

### Images Not Loading
- Check `remotePatterns` in `next.config.js`
- Verify image URLs match the patterns
- For new domains, add them to `remotePatterns`

### Environment Variables Not Loading
- Restart the development server after changing `.env` files
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Check file naming (`.env.local` not `.env.local.txt`)
