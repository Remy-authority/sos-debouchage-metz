import { Plus } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import type { FaqItem } from '@/lib/content'

/**
 * FAQ fermée (refaite le 10/10/2026, règle « FAQ fermée ») : chaque question est un
 * <details> natif, toutes fermées au chargement. Les réponses restent dans le HTML
 * (Google et les IA les lisent), le visiteur n'ouvre que celle qui l'intéresse.
 * Aucun JavaScript : le plus tourne en croix à l'ouverture.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <AnimatedSection className="mt-10 space-y-3 lg:mt-14">
      {items.map((item) => (
        <details
          key={item.q}
          className="group overflow-hidden rounded-card border border-sand-200 bg-white/70 transition-colors duration-300 open:border-accent-300 open:bg-white open:shadow-card hover:border-sand-300"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left lg:px-8 lg:py-6 [&::-webkit-details-marker]:hidden">
            <h3 className="flex-1 text-center lg:text-left font-display text-[17px] font-medium leading-snug text-ink-900 group-open:text-ink-950 lg:text-xl">
              {item.q}
            </h3>
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[3px] bg-brand-600/10 text-brand-700 transition-all duration-300 group-open:rotate-45 group-open:bg-accent-500 group-open:text-white"
              aria-hidden="true"
            >
              <Plus size={16} strokeWidth={2.5} />
            </span>
          </summary>
          <p className="px-5 pb-5 leading-relaxed text-sand-600 lg:px-8 lg:pb-8">{item.a}</p>
        </details>
      ))}
    </AnimatedSection>
  )
}
