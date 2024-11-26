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
  productionBrowserSourceMaps: true,
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8080',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  serverRuntimeConfig: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8080',
  }
}

module.exports = nextConfig;
