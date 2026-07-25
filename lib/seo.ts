/**
 * lib/seo.ts, Metadata API helpers + JSON-LD builders (Lot 6 SEO infra).
 *
 * Règles NOU-33 :
 *  - Schema LocalBusiness → sous-type **Plumber**, avec `areaServed`.
 *  - **PAS d'`address`** par défaut (siteConfig.legal.showAddress=false) tant que
 *    Rémy n'a pas tranché l'adresse.
 *  - **Aucun `AggregateRating` / `Review`** (pas d'avis réels).
 *  - Canonical absolu partout ; preview => noindex via env (voir robots.ts / metadata).
 */
import type { Metadata } from 'next'
import { siteConfig } from '@/config/site.config'
import type { Article, Service, Zone } from '@/lib/content'

const BASE = siteConfig.seo.canonicalBase.replace(/\/$/, '')

/** URL absolue à partir d'un chemin relatif. */
export function absUrl(path = '/'): string {
  return `${BASE}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Sur les previews Vercel (ou quand SEO_NOINDEX=1) on bloque l'indexation pour
 * ne jamais exposer un site non validé aux moteurs. En prod (Gate C) : indexable.
 */
export const IS_NOINDEX =
  process.env.SEO_NOINDEX === '1' ||
  (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production')

type BuildMetaArgs = {
  title: string
  description: string
  path: string
  /** Force noindex sur une page utilitaire (merci, cgu, cookies…). */
  noindex?: boolean
  ogImage?: string
}

/** Fabrique une Metadata Next complète (canonical, OG, robots). */
export function buildMetadata({
  title,
  description,
  path,
  noindex = false,
  ogImage,
}: BuildMetaArgs): Metadata {
  const url = absUrl(path)
  const index = !noindex && !IS_NOINDEX
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: siteConfig.seo.locale,
      siteName: siteConfig.businessName,
      images: [{ url: absUrl(ogImage || siteConfig.seo.defaultOgImage) }],
    },
    robots: {
      index,
      follow: true, // toujours follow, même sur les pages noindex
      googleBot: { index, follow: true },
    },
  }
}

/* ────────────────────────────── JSON-LD ────────────────────────────── */

const ORG_ID = `${BASE}/#business`

/** LocalBusiness → Plumber (global, layout). Sans address par défaut. */
export function plumberJsonLd() {
  const areaServed = [
    siteConfig.serviceArea.base,
    ...siteConfig.serviceArea.districts,
  ]
  const node: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Plumber',
    '@id': ORG_ID,
    name: siteConfig.businessName,
    description: `${siteConfig.trade} à ${siteConfig.city} et ses environs. Détection non destructive, intervention rapide.`,
    url: BASE,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    image: absUrl(siteConfig.seo.defaultOgImage),
    priceRange: '€€',
    areaServed: areaServed.map((name) => ({ '@type': 'City', name })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday',
          'Friday', 'Saturday', 'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    knowsAbout: siteConfig.methods,
  }
  // address UNIQUEMENT si Rémy a tranché (showAddress=true).
  if (siteConfig.legal.showAddress) {
    node.address = {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.legal.address.street,
      postalCode: siteConfig.legal.address.postalCode,
      addressLocality: siteConfig.legal.address.city,
      addressCountry: 'FR',
    }
  }
  // ⛔ Aucun aggregateRating / review tant que features.reviews=false.
  return node
}

export function serviceJsonLd(service: Service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.h1,
    serviceType: service.navTitle,
    description: service.metaDescription,
    provider: { '@id': ORG_ID },
    areaServed: {
      '@type': 'City',
      name: siteConfig.serviceArea.base,
    },
    url: absUrl(`/services/${service.slug}`),
  }
}

export function faqJsonLd(faq: { q: string; a: string }[]) {
  if (!faq?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absUrl(item.path),
    })),
  }
}

export function zoneJsonLd(zone: Zone) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: zone.h1,
    description: zone.metaDescription,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'City', name: zone.name },
    url: absUrl(`/zones/${zone.slug}`),
  }
}

export function articleJsonLd(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    author: { '@type': 'Organization', name: siteConfig.businessName },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: absUrl(`/conseils/${article.slug}`),
    ...(article.cover ? { image: absUrl(article.cover) } : {}),
  }
}

/** Sérialise un ou plusieurs nœuds JSON-LD pour <script>. */
export function jsonLdScript(...nodes: (object | null)[]): string {
  const clean = nodes.filter(Boolean)
  return JSON.stringify(clean.length === 1 ? clean[0] : clean)
}
