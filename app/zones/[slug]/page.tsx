import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { notFound } from 'next/navigation'
import { MapPin, Phone } from 'lucide-react'
import { getServices, getZone, getZones } from '@/lib/content'
import { buildMetadata, jsonLdScript, zoneJsonLd } from '@/lib/seo'
import { siteConfig } from '@/config/site.config'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { Faq } from '@/components/ui/Faq'
import { CtaBanner } from '@/components/ui/CtaBanner'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { ServiceBlock } from '@/components/ui/ServiceBlock'
import { ServiceIcon } from '@/components/ui/ServiceIcon'

export const dynamicParams = false

export function generateStaticParams() {
  return getZones().map((z) => ({ slug: z.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const z = getZone(params.slug)
  if (!z) return {}
  return buildMetadata({
    title: z.metaTitle,
    description: z.metaDescription,
    path: `/zones/${z.slug}`,
  })
}

/**
 * Image de tête : UNIQUE par commune, câblée sur son slug (public/zones/<slug>.jpg).
 * Repli générique (logique template N+1) : si le visuel dédié n'a pas encore été
 * produit pour une nouvelle commune, on retombe sur une image de secours existante
 * plutôt que d'afficher une image cassée au build.
 */
const HERO_FALLBACK = '/zones/zone-rue.jpg'

function getHeroSrc(slug: string): string {
  const dedicated = `/zones/${slug}.jpg`
  const existsOnDisk = existsSync(join(process.cwd(), 'public', 'zones', `${slug}.jpg`))
  return existsOnDisk ? dedicated : HERO_FALLBACK
}

const BODY_POOL = [
  {
    src: '/zones/zone-regard.jpg',
    alt: 'Regard de visite ouvert dans une allée, flexible de curage engagé',
    caption: "Le regard de visite, premier point d'accès au réseau enterré.",
  },
  {
    src: '/zones/zone-siphon.jpg',
    alt: 'Siphon de lavabo démonté au-dessus d’un seau',
    caption: 'Sur un bouchon proche, le démontage du siphon suffit souvent.',
  },
  {
    src: '/zones/zone-camera.jpg',
    alt: "Écran d'inspection caméra montrant l'intérieur d'une canalisation",
    caption: "La caméra tranche entre bouchon d'usage et défaut de canalisation.",
  },
]

export default function ZonePage({ params }: { params: { slug: string } }) {
  const zone = getZone(params.slug)
  if (!zone) notFound()

  const zones = getZones()
  const idx = Math.max(
    0,
    zones.findIndex((z) => z.slug === zone.slug),
  )
  const hero = getHeroSrc(zone.slug)
  const body = BODY_POOL[(idx + 1) % BODY_POOL.length]

  // Maillage : les prestations les plus probables sur une commune résidentielle.
  const mainServices = getServices()
    .filter((s) =>
      [
        'urgence-debouchage-canalisation',
        'debouchage-wc-toilettes-bouchees',
        'debouchage-evier-lavabo-douche',
        'debouchage-canalisation-enterree-regard',
      ].includes(s.slug),
    )
    .slice(0, 4)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(zoneJsonLd(zone)) }}
      />

      <Breadcrumbs
        items={[
          { name: 'Accueil', path: '/' },
          { name: "Zones d'intervention", path: '/zones' },
          { name: zone.name, path: `/zones/${zone.slug}` },
        ]}
      />

      <section className="noise-overlay relative overflow-hidden bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 py-16 lg:py-20">
        <div aria-hidden="true" className="bg-grid absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-7">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent-400">
              <MapPin size={16} />
              {zone.name} · {zone.postalCode}
            </p>
            <h1 className="mt-5 text-4xl leading-[1.1] text-sand-50 md:text-5xl">{zone.h1}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-sand-200">{zone.intro}</p>
            <div className="mt-8">
              <Button href={`tel:${siteConfig.phone}`} variant="accent" size="lg">
                <Phone size={18} strokeWidth={2.5} />
                {siteConfig.phoneDisplay}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-panel border border-brand-400/20 shadow-card">
              <Image
                src={hero}
                alt={`${siteConfig.trade} à ${zone.name}`}
                fill
                priority
                sizes="(min-width: 1024px) 460px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <article className="bg-sand-50 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <div className="prose-content space-y-10">
            {zone.blocks.map((b, i) => (
              <div key={b.heading}>
                <ServiceBlock block={b} />
                {i === 0 && (
                  <figure className="mt-8">
                    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-card border border-sand-200 shadow-card">
                      <Image
                        src={body.src}
                        alt={body.alt}
                        fill
                        sizes="(min-width: 768px) 768px, 100vw"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                    <figcaption className="mt-3 text-sm text-sand-500">{body.caption}</figcaption>
                  </figure>
                )}
              </div>
            ))}
          </div>

          <AnimatedSection className="mt-16">
            <h2 className="text-2xl">Nos prestations à {zone.name}</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {mainServices.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex items-center gap-3 rounded-card border border-sand-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400/40 hover:shadow-card"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600">
                      <ServiceIcon icon={s.icon} className="h-5 w-5" />
                    </span>
                    <span className="font-medium text-ink-900 group-hover:text-brand-700">
                      {s.navTitle}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          {zone.neighbours.length > 0 && (
            <AnimatedSection className="mt-14">
              <h2 className="text-2xl">Communes limitrophes desservies</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {zone.neighbours.map((n) => {
                  const match = zones.find((z) => z.name === n)
                  return (
                    <li key={n}>
                      {match ? (
                        <Link
                          href={`/zones/${match.slug}`}
                          className="inline-flex rounded-full border border-sand-300 bg-white px-4 py-2 text-sm text-sand-700 transition-colors hover:border-brand-500 hover:text-brand-700"
                        >
                          {n}
                        </Link>
                      ) : (
                        <span className="inline-flex rounded-full border border-sand-200 bg-sand-100 px-4 py-2 text-sm text-sand-600">
                          {n}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </AnimatedSection>
          )}
        </div>
      </article>

      <Faq items={zone.faq} eyebrow={zone.name} />

      <CtaBanner
        title={`Canalisation bouchée à ${zone.name} ?`}
        subtitle={`Nous intervenons à ${zone.name} et dans les communes voisines. Appelez, nous vous donnons le tarif et un créneau réaliste.`}
      />
    </>
  )
}
