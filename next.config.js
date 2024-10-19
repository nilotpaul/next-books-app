const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  optimizeFonts: true,
  swcMinify: true,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  logging: { fetches: { fullUrl: true } },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'next-books-app.s3.ap-southeast-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'next-books-app.s3.amazonaws.com',
      },
    ],
  },
  rewrites: async () => [
    {
      source: '/docs',
      destination: '/docs/introduction',
    },
  ],
};

module.exports = withContentlayer(nextConfig);
