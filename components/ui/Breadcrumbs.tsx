import Link from 'next/link'
import { breadcrumbJsonLd, jsonLdScript } from '@/lib/seo'

/**
 * Breadcrumbs, fil d'Ariane sur les pages profondes (services, zones, articles)
 * + JSON-LD BreadcrumbList. `items` = liste ordonnée (dernier = page courante).
 */
export default function Breadcrumbs({
  items,
}: {
  items: { name: string; path: string }[]
}) {
  return (
    <nav aria-label="Fil d'Ariane" className="container-site pt-4 text-sm text-slate-500">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd(items)) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-slate-700">{item.name}</span>
              ) : (
                <>
                  <Link href={item.path} className="hover:underline">{item.name}</Link>
                  <span aria-hidden="true">›</span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
