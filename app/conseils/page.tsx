import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowRight, Clock } from 'lucide-react'
import { getArticles, readingTimeMinutes } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { siteConfig } from '@/config/site.config'
import { PageHeader } from '@/components/layout/PageHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { CtaBanner } from '@/components/ui/CtaBanner'

export const metadata: Metadata = buildMetadata({
  title: `Conseils canalisations, ${siteConfig.city} et Moselle`,
  description: `Guides pratiques sur les canalisations bouchées : gestes à faire, causes, entretien préventif, curage et inspection caméra à ${siteConfig.city}.`,
  path: '/conseils',
})

const MOIS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

function formatDateFr(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d || m < 1 || m > 12) return iso
  return `${d} ${MOIS[m - 1]} ${y}`
}

export default function ConseilsListing() {
  if (!siteConfig.features.blog) notFound()
  const articles = getArticles()

  return (
    <>
      <PageHeader
        eyebrow="Conseils"
        title={
          <>
            Comprendre
            <span className="text-gradient-accent"> ses canalisations</span>
          </>
        }
        subtitle="Ce qu'il faut faire, ce qu'il ne faut surtout pas faire, et comment éviter que le bouchon revienne."
      />

      <section className="bg-gradient-to-b from-sand-50 to-sand-100 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {articles.length === 0 ? (
            <AnimatedSection className="mx-auto max-w-xl rounded-card border border-sand-200 bg-white p-10 text-center">
              <p className="font-display text-2xl font-medium text-ink-950">
                Les premiers articles arrivent bientôt
              </p>
              <p className="mt-4 leading-relaxed text-sand-600">
                En attendant, une question sur une canalisation qui s&apos;écoule mal&nbsp;? Appelez,
                on vous répond directement.
              </p>
              <a
                href={`tel:${siteConfig.phone}`}
                className="mt-6 inline-flex items-center gap-2 font-medium text-accent-600 transition-colors hover:text-accent-500"
              >
                {siteConfig.phoneDisplay}
                <ArrowRight size={16} />
              </a>
            </AnimatedSection>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a, idx) => (
                <AnimatedSection key={a.slug} delay={(idx % 3) * 0.07} as="li">
                  <Link
                    href={`/conseils/${a.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-card border border-sand-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    {a.cover && (
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-sand-100">
                        <Image
                          src={a.cover}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-7">
                      <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-sand-500">
                        <time dateTime={a.date}>{formatDateFr(a.date)}</time>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={13} />
                          {readingTimeMinutes(a.content)} min
                        </span>
                      </div>
                      <h2 className="mt-3 font-display text-xl font-medium leading-snug text-ink-950 transition-colors group-hover:text-brand-700">
                        {a.title}
                      </h2>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-sand-600">
                        {a.description}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent-600 transition-all group-hover:gap-3">
                        Lire l&apos;article
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </ul>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
