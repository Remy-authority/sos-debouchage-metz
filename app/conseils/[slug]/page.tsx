import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Clock } from 'lucide-react'
import {
  getArticle,
  getArticles,
  getRelatedConseils,
  getServices,
  readingTimeMinutes,
} from '@/lib/content'
import { articleJsonLd, buildMetadata, jsonLdScript } from '@/lib/seo'
import { siteConfig } from '@/config/site.config'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Faq } from '@/components/ui/Faq'
import { CtaBanner } from '@/components/ui/CtaBanner'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { ServiceIcon } from '@/components/ui/ServiceIcon'

export const dynamicParams = false

export function generateStaticParams() {
  if (!siteConfig.features.blog) return []
  return getArticles().map((a) => ({ slug: a.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = getArticle(params.slug)
  if (!a) return {}
  return buildMetadata({
    title: a.title,
    description: a.description,
    path: `/conseils/${a.slug}`,
    ogImage: a.cover,
  })
}

const MOIS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

/** « 2026-07-24 » → « 24 juillet 2026 » (déterministe, sans fuseau horaire). */
function formatDateFr(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d || m < 1 || m > 12) return iso
  return `${d} ${MOIS[m - 1]} ${y}`
}

const mdxComponents = {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img loading="lazy" decoding="async" alt="" {...props} />
  ),
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug)
  if (!article) notFound()

  const linked = getServices().filter((s) => article.relatedServices.includes(s.slug))
  const related = getRelatedConseils(article, 3)
  const readingMin = readingTimeMinutes(article.content)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(articleJsonLd(article)) }}
      />

      <Breadcrumbs
        items={[
          { name: 'Accueil', path: '/' },
          { name: 'Conseils', path: '/conseils' },
          { name: article.title, path: `/conseils/${article.slug}` },
        ]}
      />

      <section className="noise-overlay relative overflow-hidden bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 py-16 lg:py-20">
        <div aria-hidden="true" className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-6 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-400">
            {article.category}
          </p>
          <h1 className="mt-4 text-4xl leading-[1.12] text-sand-50 md:text-5xl">{article.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-sand-200">{article.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-sand-400">
            <time dateTime={article.date}>{formatDateFr(article.date)}</time>
            <span className="h-1 w-1 rounded-full bg-sand-600" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} />
              {readingMin} min de lecture
            </span>
          </div>
        </div>
      </section>

      <article className="bg-sand-50 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          {article.cover && (
            <figure className="mb-12">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-panel border border-sand-200 shadow-card">
                <Image
                  src={article.cover}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 768px, 100vw"
                  className="object-cover"
                />
              </div>
            </figure>
          )}

          <div className="article-prose">
            <MDXRemote source={article.content} components={mdxComponents} />
          </div>

          {linked.length > 0 && (
            <AnimatedSection className="mt-14 rounded-card border border-brand-600/20 bg-brand-600/5 p-8">
              <h2 className="text-2xl">Nos prestations sur ce sujet</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {linked.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="group flex items-center gap-3 rounded-2xl border border-sand-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400/40"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/10 text-brand-600">
                        <ServiceIcon icon={s.icon} className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-medium text-ink-900 group-hover:text-brand-700">
                        {s.navTitle}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          )}
        </div>
      </article>

      <Faq items={article.faq} eyebrow="Questions sur cet article" />

      {related.length > 0 && (
        <section className="border-t border-sand-200 bg-sand-100 py-16 lg:py-20" aria-labelledby="a-lire-aussi">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h2 id="a-lire-aussi" className="text-3xl">
              À lire aussi
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a, idx) => (
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
                          sizes="(min-width: 1024px) 380px, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
                        {a.category}
                      </span>
                      <h3 className="mt-2 font-display text-lg font-medium leading-snug text-ink-950 group-hover:text-brand-700">
                        {a.title}
                      </h3>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBanner />
    </>
  )
}
