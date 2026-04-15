import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  images: {
    domains: ['avatars.steamstatic.com'],
  },
  serverExternalPackages: ['better-sqlite3'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Bloquea iframes de sitios externos (clickjacking)
          { key: 'X-Frame-Options', value: 'DENY' },
          // Evita que el browser adivine el content-type (MIME sniffing)
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // No enviar Referer a sitios externos
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Desactivar features del browser que no se usan
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // CSP: restringe de dónde pueden cargarse recursos
          // - scripts: solo mismo origen + inline (requerido por Next.js) + Vercel Speed Insights
          // - imágenes: mismo origen + Steam CDN + data URIs
          // - conecta solo a mismo origen + APIs de Steam
          // - no permite iframes (frame-ancestors)
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://avatars.steamstatic.com https://cdn.cloudflare.steamstatic.com https://cdn.akamai.steamstatic.com https://media.steampowered.com https://steamcdn-a.akamaihd.net",
              "connect-src 'self' https://api.steampowered.com https://store.steampowered.com",
              "font-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
};

export default nextConfig;
