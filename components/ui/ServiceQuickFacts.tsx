import { Check } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

/** Trois points clés d'une prestation, en bandeau juste sous la réponse courte. */
export function ServiceQuickFacts({ bullets }: { bullets: string[] }) {
  if (!bullets?.length) return null

  return (
    <AnimatedSection delay={0.1} className="mt-6 grid gap-3 sm:grid-cols-3">
      {bullets.map((b) => (
        <div
          key={b}
          className="flex items-start gap-3 rounded-card border border-sand-200 bg-white px-5 py-4 shadow-card"
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
            <Check size={12} strokeWidth={3.5} aria-hidden="true" />
          </span>
          <span className="text-sm font-medium leading-snug text-ink-900">{b}</span>
        </div>
      ))}
    </AnimatedSection>
  )
}

export default ServiceQuickFacts
