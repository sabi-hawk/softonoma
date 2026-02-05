import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable compression
  compress: true,
  
  // Rewrites for SEO-friendly URLs
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/sitemap',
      },
    ];
  },
  
  // Image: CloudFront as origin; Next.js does resize/format unless CloudFront serves optimized
  images: {
    // Skip optimization when CloudFront/Lambda@Edge serves AVIF/WebP/resized (set NEXT_PUBLIC_IMAGE_UNOPTIMIZED=true)
    unoptimized: process.env.NEXT_PUBLIC_IMAGE_UNOPTIMIZED === 'true',
    formats: ['image/avif', 'image/webp'],
    // Breakpoints for srcset; covers common viewports and retina
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // Match Cache-Control: max-age=31536000, immutable on origin
    qualities: [75, 85],
    remotePatterns: [
      // Production: images served via CloudFront (required; set NEXT_PUBLIC_CDN_HOSTNAME)
      ...(process.env.NEXT_PUBLIC_CDN_HOSTNAME
        ? [{ protocol: 'https' as const, hostname: process.env.NEXT_PUBLIC_CDN_HOSTNAME, pathname: '/**' as const }]
        : []),
      // CloudFront CDN (explicit hostname so next/image works without env)
      { protocol: 'https', hostname: 'd3tfd0wde8b9wy.cloudfront.net', pathname: '/**' },
      { protocol: 'https', hostname: 'ik.imagekit.io', pathname: '/**' },
      { protocol: 'https', hostname: 'cloud.appwrite.io', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      // Partner / external logos (add more hostnames as needed)
      { protocol: 'https', hostname: 'saigontechnology.com', pathname: '/**' },
      { protocol: 'http', hostname: 'saigontechnology.com', pathname: '/**' },
      // Fallback for dev without CDN; remove in prod or keep for local S3
      { protocol: 'https', hostname: 'softonoma-s3-bucket.s3.eu-north-1.amazonaws.com', pathname: '/**' },
    ],
  },
  
  // Compiler options for modern browsers
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  
  // Turbopack configuration (for dev mode)
  turbopack: {},
  
  // Webpack optimizations (for production builds)
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Enable tree shaking and better code splitting
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        // Minimize bundle size
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for node_modules
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
              minChunks: 1,
            },
            // Common chunk for shared code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
            },
            // Separate React chunks
            react: {
              name: 'react',
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              chunks: 'all',
              priority: 30,
            },
          },
        },
      };
    }
    return config;
  },
  
  // Target modern browsers only (ES2020+)
  // This prevents transpiling modern JavaScript features
  transpilePackages: [],
};

export default nextConfig;
