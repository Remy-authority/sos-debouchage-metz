import Image from 'next/image'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { extractNumberedSteps } from '@/lib/text'
import type { ContentBlock } from '@/lib/content'

/**
 * Bloc de contenu d'une page service ou zone.
 *
 * Si le corps contient une liste numérotée rédigée en prose (« 1. … 2. … »), elle
 * est rendue en checklist visuelle plutôt qu'en pavé : le texte SEO reste identique,
 * seule sa mise en forme change.
 */
export function ServiceBlock({ block, eager = false }: { block: ContentBlock; eager?: boolean }) {
  const steps = extractNumberedSteps(block.body)

  return (
    <AnimatedSection as="section" className="scroll-mt-28">
      <h2>{block.heading}</h2>

      {steps ? (
        <>
          {steps.lead && <p>{steps.lead}</p>}
          <ol className="mt-6 space-y-3">
            {steps.steps.map((s, i) => (
              <li
                key={s.slice(0, 32)}
                className="flex gap-4 rounded-card border border-sand-200 bg-white p-5 shadow-card"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-500 font-display text-sm font-medium text-white">
                  {i + 1}
                </span>
                <span className="leading-relaxed text-sand-700">{s}</span>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <p>{block.body}</p>
      )}

      {block.image && (
        <figure className="mt-8">
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-card border border-sand-200 shadow-card">
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
            <figcaption className="mt-3 text-sm text-sand-500">{block.imageCaption}</figcaption>
          )}
        </figure>
      )}
    </AnimatedSection>
  )
}

export default ServiceBlock
