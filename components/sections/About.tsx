import Image from 'next/image'
import { Quote } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { siteConfig } from '@/config/site.config'

/**
 * Bloc « qui sommes-nous » : texte à gauche, portrait de l'intervenant à droite
 * avec une pastille de citation posée en débord. Les méthodes du métier servent
 * de pastilles de bas de colonne (pas de certification, pas de chiffre inventé).
 */
export function About() {
  const { about, persona, methods } = siteConfig

  return (
    <section id="a-propos" className="relative bg-sand-50 py-24 lg:py-32" aria-labelledby="about-title">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* items-start : les deux colonnes démarrent sur la même ligne, pas de blanc
            asymétrique au-dessus du texte quand la colonne visuelle est plus haute. */}
        <div className="grid items-start gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeader
              id="about-title"
              eyebrow={about.eyebrow}
              title={
                <>
                  Le débouchage,
                  <br />
                  <span className="text-gradient-ink italic">notre seul métier</span>
                </>
              }
              align="left"
            />

            <AnimatedSection delay={0.15} className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-sand-600">
              {about.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </AnimatedSection>

            <AnimatedSection delay={0.25} className="mt-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-sand-500">
                Les techniques que nous utilisons
              </p>
              <ul className="flex flex-wrap gap-2.5">
                {methods.map((m) => (
                  <li
                    key={m}
                    className="inline-flex items-center gap-2 rounded-full border border-sand-200 bg-white px-4 py-2 text-sm text-sand-700"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden="true" />
                    {m}
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>

          <div className="lg:col-span-5">
            <AnimatedSection delay={0.2} className="relative mx-auto max-w-sm lg:max-w-none">
              <div
                aria-hidden="true"
                className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-brand-500/15 via-transparent to-accent-500/10 blur-2xl"
              />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-panel border border-sand-200 shadow-card">
                <Image
                  src={persona.photo}
                  alt={`${persona.name}, ${persona.title.toLowerCase()}`}
                  fill
                  sizes="(min-width: 1024px) 420px, 90vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950/85 to-transparent"
                />
                {/* pb généreux : le nom reste lisible au-dessus de la carte de
                    citation qui vient chevaucher le bas du portrait. */}
                <div className="absolute inset-x-0 bottom-0 p-6 pb-16">
                  <p className="font-display text-xl font-medium text-sand-50">{persona.name}</p>
                  <p className="mt-1 text-sm text-sand-300">{persona.title}</p>
                </div>
              </div>

              <div className="relative -mt-8 ml-auto mr-4 w-[85%] rounded-card border border-sand-200 bg-white p-6 shadow-card">
                <Quote size={20} className="text-accent-500" aria-hidden="true" />
                <blockquote className="mt-3 font-display text-lg font-medium italic leading-snug text-ink-950">
                  {persona.quote}
                </blockquote>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-card border border-brand-600/20 bg-brand-600/5 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white">
                  <ServiceIcon icon="tool" className="h-5 w-5" />
                </span>
                <p className="text-sm font-medium text-brand-700">{about.highlight}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}
