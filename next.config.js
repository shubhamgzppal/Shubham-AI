/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  images: {
    domains: ['lh3.googleusercontent.com'], // For Google Auth profile pictures
  },
}

module.exports = nextConfig
