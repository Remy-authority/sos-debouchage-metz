import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { siteConfig } from '@/config/site.config'

/**
 * Déroulé d'intervention en 4 étapes, sur fond sombre. Les cartes sont reliées par
 * un filet dégradé qui matérialise l'écoulement d'une étape à la suivante.
 */
export function Process() {
  const steps = siteConfig.process

  return (
    <section
      id="deroulement"
      className="noise-overlay relative overflow-hidden bg-gradient-to-b from-ink-950 to-ink-900 py-24 lg:py-32"
      aria-labelledby="process-title"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgb(var(--c-brand-500)/0.18),transparent_52%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeader
          id="process-title"
          eyebrow="Comment ça se passe"
          title={
            <>
              De votre appel
              <span className="text-gradient-accent"> à l&apos;écoulement retrouvé</span>
            </>
          }
          subtitle="Quatre étapes, sans zone d'ombre. Vous savez à chaque moment ce que nous faisons et pourquoi."
          variant="dark"
        />

        <ol className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <AnimatedSection key={step.step} delay={idx * 0.1} as="li" className="relative">
              {idx < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[calc(100%-1rem)] top-12 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r from-brand-400/50 to-transparent lg:block"
                />
              )}

              <div className="group relative h-full overflow-hidden rounded-card border border-ink-700/55 bg-gradient-to-br from-ink-800/45 to-ink-950/65 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-brand-400/45">
                <div className="flex items-center justify-between">
                  <span className="font-display text-5xl font-medium text-brand-400/30">{step.step}</span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/12 text-brand-300 ring-1 ring-brand-400/25 transition-transform duration-500 group-hover:scale-110">
                    <ServiceIcon icon={step.icon} className="h-5 w-5" strokeWidth={2} />
                  </span>
                </div>

                <h3 className="mt-6 text-xl text-sand-50">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-sand-300">{step.desc}</p>

                <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-ink-900/70 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-400" aria-hidden="true" />
                  {step.duration}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </ol>
      </div>
    </section>
  )
}
