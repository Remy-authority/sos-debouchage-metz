import Link from 'next/link'
import { ArrowUpRight, MapPin, Phone, Timer } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/config/site.config'
import type { Zone } from '@/lib/content'

/**
 * Zone d'intervention : panneau sombre listant les communes desservies (chacune
 * cliquable vers sa page dédiée, c'est un point de maillage important), et colonne
 * de droite avec les quartiers de Metz et le rappel d'appel.
 */
export function ServiceArea({ zones }: { zones: Zone[] }) {
  const { city, serviceArea, departmentName, department } = siteConfig

  return (
    <section id="zone" className="relative bg-sand-50 py-24 lg:py-32" aria-labelledby="zone-title">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeader
          id="zone-title"
          eyebrow="Zone d'intervention"
          title={
            <>
              {city} et les communes
              <br />
              <span className="text-gradient-ink italic">de l&apos;agglomération</span>
            </>
          }
          subtitle={`Nous intervenons à ${city} et dans un rayon d'environ ${serviceArea.radiusKm} km. Chaque commune ci-dessous a sa page dédiée.`}
        />

        <div className="mt-20 grid gap-10 lg:grid-cols-12">
          <AnimatedSection className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-panel border border-sand-200 bg-gradient-to-br from-ink-900 to-ink-950 p-10 lg:p-12">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgb(var(--c-brand-500)/0.22),transparent_58%)]"
              />
              <div aria-hidden="true" className="bg-grid-tight absolute inset-0 opacity-70" />

              <div className="relative">
                <p className="flex items-center gap-3 text-brand-300">
                  <MapPin size={22} />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                    {departmentName} · {department}
                  </span>
                </p>

                <h3 className="mt-6 text-3xl text-sand-50">Communes desservies</h3>

                <ul className="mt-8 flex flex-wrap gap-2.5">
                  {zones.map((z) => (
                    <li key={z.slug}>
                      <Link
                        href={`/zones/${z.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-brand-400/20 bg-brand-500/5 px-4 py-2 text-sm text-sand-200 transition-colors hover:border-accent-400/50 hover:bg-accent-500/10 hover:text-sand-50"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-400" aria-hidden="true" />
                        {z.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className="mt-8 text-sm leading-relaxed text-sand-400">
                  Votre commune n&apos;est pas dans la liste ? Notre zone est plus large que ces
                  pages dédiées. Appelez, nous vous dirons tout de suite si nous couvrons votre rue.
                </p>

                <Link
                  href="/zones"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent-400 transition-colors hover:text-accent-300"
                >
                  Voir toutes les zones
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </AnimatedSection>

          <div className="space-y-5 lg:col-span-5">
            <AnimatedSection delay={0.1} className="rounded-card border border-sand-200 bg-white p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600">
                <MapPin size={22} />
              </span>
              <h3 className="mt-5 text-xl">Tous les quartiers de {city}</h3>
              <p className="mt-3 text-sm leading-relaxed text-sand-600">
                {serviceArea.districts.join(', ')}.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="rounded-card border border-sand-200 bg-white p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600">
                <Timer size={22} />
              </span>
              <h3 className="mt-5 text-xl">Le délai, dit au téléphone</h3>
              <p className="mt-3 text-sm leading-relaxed text-sand-600">
                Nous vous annonçons un créneau réaliste au moment de l&apos;appel, en fonction du
                planning en cours. Pas de promesse tenue au hasard.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <Button href={`tel:${siteConfig.phone}`} variant="accent" size="lg" className="w-full">
                <Phone size={18} strokeWidth={2.5} />
                Vérifier ma commune
              </Button>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}
