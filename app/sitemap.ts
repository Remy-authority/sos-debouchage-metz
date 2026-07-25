import type { MetadataRoute } from 'next'
import { absUrl } from '@/lib/seo'
import { siteConfig } from '@/config/site.config'
import { getServices, getZones, getArticles } from '@/lib/content'

/**
 * sitemap.xml généré au build (SSG). N'inclut QUE les pages indexables.
 * Les pages utilitaires noindex (merci, confidentialité, cgu, cookies) sont exclues.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  const staticPaths = ['/', '/zones', '/contact', '/mentions-legales']
  if (siteConfig.features.blog) staticPaths.push('/conseils')

  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: absUrl(p),
    lastModified: now,
    changeFrequency: p === '/' ? 'weekly' : 'monthly',
    priority: p === '/' ? 1 : 0.7,
  }))

  for (const s of getServices()) {
    entries.push({ url: absUrl(`/services/${s.slug}`), lastModified: now, changeFrequency: 'monthly', priority: 0.8 })
  }
  for (const z of getZones()) {
    entries.push({ url: absUrl(`/zones/${z.slug}`), lastModified: now, changeFrequency: 'monthly', priority: 0.6 })
  }
  if (siteConfig.features.blog) {
    for (const a of getArticles()) {
      entries.push({ url: absUrl(`/conseils/${a.slug}`), lastModified: a.date, changeFrequency: 'monthly', priority: 0.5 })
    }
  }

  return entries
}
