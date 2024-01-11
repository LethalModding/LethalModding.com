/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:          {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gcdn.thunderstore.io',
        port:     '',
        pathname: '**',
      }
    ]
  }
}

export default nextConfig
