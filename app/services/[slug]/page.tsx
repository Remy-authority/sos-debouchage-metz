import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowRight, Phone } from 'lucide-react'
import { getRelatedArticles, getService, getServices, getZones } from '@/lib/content'
import { buildMetadata, jsonLdScript, serviceJsonLd } from '@/lib/seo'
import { siteConfig } from '@/config/site.config'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { Faq } from '@/components/ui/Faq'
import { CtaBanner } from '@/components/ui/CtaBanner'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { ServiceQuickFacts } from '@/components/ui/ServiceQuickFacts'
import { ServiceBlock } from '@/components/ui/ServiceBlock'

// 100 % SSG : une page statique par prestation.
export const dynamicParams = false

export function generateStaticParams() {
  return getServices().map((s) => ({ slug: s.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = getService(params.slug)
  if (!s) return {}
  return buildMetadata({
    title: s.metaTitle,
    description: s.metaDescription,
    path: `/services/${s.slug}`,
    ogImage: s.image,
  })
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = getService(params.slug)
  if (!service) notFound()

  const related = getServices().filter((s) => service.relatedServices.includes(s.slug))
  const articles = getRelatedArticles(service.slug)
  const zones = getZones().slice(0, 6)
  const firstImageIndex = service.blocks.findIndex((b) => b.image)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(serviceJsonLd(service)) }}
      />

      <Breadcrumbs
        items={[
          { name: 'Accueil', path: '/' },
          { name: 'Prestations', path: '/#prestations' },
          { name: service.navTitle, path: `/services/${service.slug}` },
        ]}
      />

      {/* En-tête sombre de la prestation */}
      <section className="noise-overlay relative overflow-hidden bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 py-16 lg:py-20">
        <div aria-hidden="true" className="bg-grid absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-7">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-400/25">
              <ServiceIcon icon={service.icon} className="h-6 w-6" />
            </span>
            <h1 className="mt-6 text-4xl leading-[1.1] text-sand-50 md:text-5xl">{service.h1}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-sand-200">{service.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={`tel:${siteConfig.phone}`} variant="accent" size="lg">
                <Phone size={18} strokeWidth={2.5} />
                {siteConfig.phoneDisplay}
              </Button>
              <Button href="/contact#formulaire" variant="ghost" size="lg">
                Décrire ma situation
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          {service.image && (
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-panel border border-brand-400/20 shadow-card">
                <Image
                  src={service.image}
                  alt={service.h1}
                  fill
                  priority
                  sizes="(min-width: 1024px) 460px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <article className="bg-sand-50 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <ServiceQuickFacts bullets={service.bullets} />

          <div className="prose-content mt-12 space-y-10">
            {service.blocks.map((b, i) => (
              <ServiceBlock key={b.heading} block={b} eager={i === firstImageIndex} />
            ))}
          </div>

          {related.length > 0 && (
            <AnimatedSection className="mt-16">
              <h2 className="text-2xl">Prestations liées</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/services/${r.slug}`}
                      className="group flex items-center gap-3 rounded-card border border-sand-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400/40 hover:shadow-card"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600">
                        <ServiceIcon icon={r.icon} className="h-5 w-5" />
                      </span>
                      <span className="font-medium text-ink-900 group-hover:text-brand-700">
                        {r.navTitle}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          )}

          <AnimatedSection className="mt-14">
            <h2 className="text-2xl">Cette prestation, près de chez vous</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {zones.map((z) => (
                <li key={z.slug}>
                  <Link
                    href={`/zones/${z.slug}`}
                    className="inline-flex rounded-full border border-sand-300 bg-white px-4 py-2 text-sm text-sand-700 transition-colors hover:border-brand-500 hover:text-brand-700"
                  >
                    {z.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/zones"
                  className="inline-flex rounded-full border border-brand-600 bg-brand-600/5 px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-600/10"
                >
                  Toutes les communes
                </Link>
              </li>
            </ul>
          </AnimatedSection>

          {articles.length > 0 && (
            <AnimatedSection className="mt-14 rounded-card border border-sand-200 bg-white p-8">
              <h2 className="text-2xl">À lire aussi</h2>
              <ul className="mt-4 space-y-2">
                {articles.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/conseils/${a.slug}`}
                      className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-500"
                    >
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          )}
        </div>
      </article>

      <Faq items={service.faq} eyebrow={service.navTitle} />

      <CtaBanner
        title={`${service.navTitle} à ${siteConfig.city} ?`}
        subtitle="Appelez pour une estimation immédiate, ou décrivez la situation en ligne et nous vous rappelons."
      />
    </>
  )
}
