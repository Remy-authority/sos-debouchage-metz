import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getZone, getZones, getServices } from '@/lib/content'
import { buildMetadata, zoneJsonLd, jsonLdScript } from '@/lib/seo'
import { siteConfig } from '@/config/site.config'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Faq from '@/components/ui/Faq'
import CtaBanner from '@/components/ui/CtaBanner'

export const dynamicParams = false

export function generateStaticParams() {
  return getZones().map((z) => ({ slug: z.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const z = getZone(params.slug)
  if (!z) return {}
  return buildMetadata({ title: z.metaTitle, description: z.metaDescription, path: `/zones/${z.slug}` })
}

// Pool d'images partagé (template N+1) : chaque commune reçoit un hero + une image
// de corps, assignés de façon déterministe par position dans la liste triée. Un
// nouveau JSON de commune récupère donc automatiquement des visuels, sans génération.
const HERO_POOL = [
  '/zones/zone-pavillon.jpg',
  '/zones/zone-rue.jpg',
  '/zones/zone-interieur.jpg',
]
const BODY_POOL = [
  { src: '/zones/zone-sol.jpg', alt: 'Corrélateur acoustique et géophone posés sur une pelouse pour localiser une fuite enterrée', caption: 'Localisation d’une fuite enterrée par corrélation acoustique, sans tranchée à l’aveugle.' },
  { src: '/zones/zone-thermique.jpg', alt: 'Caméra thermique révélant une zone froide sur un mur intérieur', caption: 'La caméra thermique repère l’humidité et la fuite cachées sous l’enduit.' },
  { src: '/zones/zone-rapport.jpg', alt: 'Marquage à la craie de l’emplacement exact d’une fuite sur un carrelage', caption: 'Emplacement exact marqué au sol : votre plombier n’ouvre qu’au bon endroit.' },
]

export default function ZonePage({ params }: { params: { slug: string } }) {
  const zone = getZone(params.slug)
  if (!zone) notFound()

  const zones = getZones()
  const idx = Math.max(0, zones.findIndex((z) => z.slug === zone.slug))
  const hero = HERO_POOL[idx % HERO_POOL.length]
  const body = BODY_POOL[(idx + 1) % BODY_POOL.length]

  // Maillage : service principal = détection non destructive + urgence.
  const mainServices = getServices().filter((s) =>
    ['detection-fuite-non-destructive', 'urgence-fuite-eau'].includes(s.slug),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(zoneJsonLd(zone)) }}
      />
      <Breadcrumbs
        items={[
          { name: 'Accueil', path: '/' },
          { name: 'Zones', path: '/zones' },
          { name: zone.name, path: `/zones/${zone.slug}` },
        ]}
      />

      <article className="container-site section">
        <h1 className="text-3xl md:text-4xl">{zone.h1}</h1>
        <p className="mt-2 text-sm text-slate-500">{zone.name} ({zone.postalCode}) · {siteConfig.region}</p>

        {/* Image d'en-tête */}
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-card shadow-sm md:aspect-[21/9]">
          <Image
            src={hero}
            alt={`Recherche de fuite d'eau à ${zone.name}`}
            fill
            sizes="(min-width: 1200px) 1152px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Réponse courte factuelle « citable » (GEO) */}
        <p className="mt-6 rounded-card bg-light p-4 text-slate-700">{zone.intro}</p>

        <div className="prose-content mt-8 mx-auto max-w-3xl">
          {zone.blocks.map((b, i) => (
            <section key={b.heading}>
              <h2>{b.heading}</h2>
              <p>{b.body}</p>

              {/* Image de corps insérée après le 1er bloc */}
              {i === 0 && (
                <figure className="mt-6">
                  {/* Largeur pleine colonne, alignée sur `.article-prose img` (w-full + cadre léger). */}
                  <div className="relative aspect-[3/2] w-full overflow-hidden rounded-card border border-slate-200 shadow-sm">
                    <Image
                      src={body.src}
                      alt={body.alt}
                      fill
                      sizes="(min-width: 768px) 768px, 100vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="mt-2 text-sm text-slate-500">{body.caption}</figcaption>
                </figure>
              )}
            </section>
          ))}
        </div>

        <nav aria-label="Nos services" className="mt-10 mx-auto max-w-3xl">
          <h2 className="text-xl">Nos services de recherche de fuite</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {mainServices.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="rounded-full border border-slate-300 px-3 py-1.5 text-sm hover:border-primary hover:text-primary">
                  {s.navTitle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </article>

      <Faq items={zone.faq} />
      <CtaBanner title={`Recherche de fuite à ${zone.name} ?`} />
    </>
  )
}
