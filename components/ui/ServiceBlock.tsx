import Image from 'next/image'
import { BlockIcon } from './ServiceIcon'
import { extractNumberedSteps } from '@/lib/text'
import type { ContentBlock } from '@/lib/content'

/**
 * ServiceBlock, un bloc H2 de page service (content/services/*.json).
 *
 * Aère le mur de texte sans jamais changer le texte lui-même (SEO/GEO déjà bon,
 * on ne touche qu'au visuel) :
 *  - icône badge à côté du H2, déduite du titre (voir `matchBlockIcon`)
 *  - si le corps contient une liste "1. … 2. … 3. …" déjà rédigée, elle est
 *    détectée et rendue en checklist numérotée au lieu d'un paragraphe brut.
 *  - si le bloc a un visuel explicatif (`block.image`), il est intégré en pied
 *    de bloc. `eager` : ne concerne que la 1ère image de la page (les suivantes
 *    restent en lazy loading par défaut de next/image).
 */
export default function ServiceBlock({ block, eager = false }: { block: ContentBlock; eager?: boolean }) {
  const parsed = extractNumberedSteps(block.body)

  return (
    <section>
      <h2 className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true">
          <BlockIcon heading={block.heading} className="h-5 w-5" />
        </span>
        {block.heading}
      </h2>

      {parsed ? (
        <>
          {parsed.lead && <p>{parsed.lead}</p>}
          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            {parsed.steps.map((step, i) => {
              // Nombre d'étapes impair : la dernière carte prend toute la largeur
              // sur la dernière ligne (évite une carte orpheline seule à gauche).
              const isLoneLast = i === parsed.steps.length - 1 && parsed.steps.length % 2 === 1
              return (
              <li key={i} className={`flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm${isLoneLast ? ' sm:col-span-2' : ''}`}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-slate-700">{step}</span>
              </li>
              )
            })}
          </ol>
        </>
      ) : (
        <p>{block.body}</p>
      )}

      {block.image && (
        <figure className="mt-5">
          {/* Largeur pleine colonne, alignée sur `.article-prose img` (w-full + cadre léger). */}
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-card border border-slate-200 shadow-sm">
            <Image
              src={block.image}
              alt={block.imageAlt || block.heading}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
              loading={eager ? 'eager' : 'lazy'}
            />
          </div>
          {block.imageCaption && (
            <figcaption className="mt-2 text-sm text-slate-500">{block.imageCaption}</figcaption>
          )}
        </figure>
      )}
    </section>
  )
}
