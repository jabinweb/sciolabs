import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
      dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Add cache headers for static assets
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate', // 1 hour cache, then revalidate
          },
        ],
      },
      {
        // Cache static assets for longer
        source: '/(.*)\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year cache for static assets
          },
        ],
      },
      {
        // Don't cache API routes
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        // Don't cache admin pages
        source: '/admin/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },

  // Generate build ID for cache busting
  generateBuildId: async () => {
    // You can use git commit hash or timestamp
    return `build-${Date.now()}`;
  },

  // Enable compression
  compress: true,
};

export default nextConfig;
      