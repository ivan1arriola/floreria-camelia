/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  images: {
    domains: ['imagenescamelia.blob.core.windows.net']
  }
}

module.exports = nextConfig
