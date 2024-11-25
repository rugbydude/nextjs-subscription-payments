/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/signin',
        permanent: false,
      },
    ]
  },
  experimental: {
    turbo: {
      enabled: true
    }
  },
  productionBrowserSourceMaps: true, // Enable source maps in production
  env: {
    NEXT_PUBLIC_SITE_URL: 'http://localhost:3000'
  }
}

module.exports = nextConfig;
