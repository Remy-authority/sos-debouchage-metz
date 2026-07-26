import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { breadcrumbJsonLd, jsonLdScript } from '@/lib/seo'

/**
 * Fil d'Ariane posé sous le header fixe, sur le fond crème. Émet aussi le
 * BreadcrumbList JSON-LD correspondant.
 */
export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="border-b border-sand-200 bg-sand-100/70 pt-24 lg:pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd(items)) }}
      />
      <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-1.5 px-6 py-4 text-sm text-sand-500 lg:px-10">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={14} className="text-sand-400" aria-hidden="true" />}
              {last ? (
                <span className="max-w-[22rem] truncate font-medium text-ink-900" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="transition-colors hover:text-brand-600">
                  {item.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
