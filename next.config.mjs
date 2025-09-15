/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['blob.v0.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blob.v0.app',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
}

export default nextConfig
