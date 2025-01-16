/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'omnisocial.vercel.app',
      'scontent.cdninstagram.com',
      'graph.instagram.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.cdninstagram.com'
      },
      {
        protocol: 'https',
        hostname: '*.fbcdn.net'
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com'
      }
    ],
    unoptimized: true
  },
};

export default nextConfig;
