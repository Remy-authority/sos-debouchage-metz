import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site.config'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.businessName,
    short_name: siteConfig.city,
    description: `${siteConfig.trade} à ${siteConfig.city}`,
    start_url: '/',
    display: 'standalone',
    background_color: siteConfig.colors.light,
    theme_color: siteConfig.colors.accent,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
