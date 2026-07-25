import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import {
  getArticle,
  getArticles,
  getServices,
  getRelatedConseils,
  readingTimeMinutes,
} from '@/lib/content'
import { buildMetadata, articleJsonLd, jsonLdScript } from '@/lib/seo'
import { siteConfig } from '@/config/site.config'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Faq from '@/components/ui/Faq'
import CtaBanner from '@/components/ui/CtaBanner'

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

// Images markdown du corps : lazy + décodage async (le style vient de .article-prose).
const mdxComponents = {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img loading="lazy" decoding="async" alt="" {...props} />
  ),
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug)
  if (!article) notFound()

  // Maillage interne automatique via front-matter relatedServices.
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

      <article className="container-site section">
        {/* En-tête d'article */}
        <header className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">{article.category}</p>
          <h1 className="mt-2 text-3xl leading-tight md:text-4xl">{article.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            <time dateTime={article.date}>{formatDateFr(article.date)}</time>
            <span className="text-slate-300" aria-hidden="true">•</span>
            <span>{readingMin} min de lecture</span>
            <span className="text-slate-300" aria-hidden="true">•</span>
            <span>{article.category}</span>
          </div>
        </header>

        {/* Cover */}
        {article.cover && (
          <figure className="mx-auto mt-8 max-w-4xl">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-card shadow-sm">
              <Image
                src={article.cover}
                alt={article.title}
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </figure>
        )}

        {/* Corps */}
        <div className="prose-content article-prose mx-auto mt-10 max-w-3xl">
          <MDXRemote source={article.content} components={mdxComponents} />
        </div>

        {/* Maillage interne : services liés */}
        {linked.length > 0 && (
          <nav aria-label="Nos services liés" className="mx-auto mt-12 max-w-3xl rounded-card bg-light p-6">
            <h2 className="text-lg font-bold text-slate-900">Nos services liés</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {linked.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
                  >
                    {s.navTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </article>

      {/* FAQ de l'article (accordéon partagé + FAQPage JSON-LD, gros gain GEO) */}
      <Faq items={article.faq} />

      {/* À lire aussi */}
      {related.length > 0 && (
        <section className="border-t border-slate-100" aria-labelledby="a-lire-aussi">
          <div className="container-site section">
            <div className="mx-auto max-w-5xl">
              <h2 id="a-lire-aussi" className="text-2xl font-bold text-slate-900">À lire aussi</h2>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/conseils/${a.slug}`}
                      className="card group block h-full overflow-hidden p-0 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      {a.cover && (
                        <div className="relative aspect-[16/9] w-full overflow-hidden">
                          <Image
                            src={a.cover}
                            alt={a.title}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <span className="text-xs font-semibold uppercase tracking-wide text-primary">{a.category}</span>
                        <h3 className="mt-1 text-base font-bold leading-snug text-slate-900 group-hover:text-primary">{a.title}</h3>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <CtaBanner />
    </>
  )
}
