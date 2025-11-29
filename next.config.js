/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Forzar regeneración en cada build para evitar caché
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
  // Headers para evitar caché en producción
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0, must-revalidate',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig




