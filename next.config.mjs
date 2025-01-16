/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'scontent.cdninstagram.com',
      'scontent-iad3-1.cdninstagram.com',
      'scontent-iad3-2.cdninstagram.com',
      'instagram.fpnq13-1.fna.fbcdn.net',
      'graph.instagram.com',
      'scontent-lga3-1.cdninstagram.com',
      'scontent-lga3-2.cdninstagram.com',
      'hebbkx1anhila5yf.public.blob.vercel-storage.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.cdninstagram.com'
      },
      {
        protocol: 'https',
        hostname: '*.fbcdn.net'
      }
    ],
    unoptimized: true
  },
};

export default nextConfig;
