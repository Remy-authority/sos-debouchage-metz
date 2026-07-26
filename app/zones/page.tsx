import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getZones } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { siteConfig } from '@/config/site.config'
import { PageHeader } from '@/components/layout/PageHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Faq } from '@/components/ui/Faq'
import { CtaBanner } from '@/components/ui/CtaBanner'

export const metadata: Metadata = buildMetadata({
  title: `Zones d'intervention, débouchage autour de ${siteConfig.city}`,
  description: `Communes desservies autour de ${siteConfig.city} pour le débouchage et le curage de canalisations : rayon d'environ ${siteConfig.serviceArea.radiusKm} km.`,
  path: '/zones',
})

export default function ZonesHub() {
  const zones = getZones()
  const names = zones.map((z) => z.name)
  const { city, serviceArea, businessName, departmentName, department } = siteConfig

  // Réponse courte factuelle « citable » (activité + zone + liste des communes).
  const citable = `${businessName} intervient à ${city} (${departmentName}, ${department}) et dans ${zones.length} communes de l'agglomération, dans un rayon d'environ ${serviceArea.radiusKm} km : ${names.join(', ')}. Débouchage de canalisations, curage haute pression et inspection caméra, 7j/7.`

  const hubFaq = [
    {
      q: `Quelles communes couvrez-vous autour de ${city} ?`,
      a: `Nous intervenons à ${city} (tous les quartiers : ${serviceArea.districts.slice(0, 6).join(', ')} et les autres) et dans les communes de l'agglomération dans un rayon d'environ ${serviceArea.radiusKm} km : ${names.join(', ')}.`,
    },
    {
      q: 'Ma commune ne figure pas dans la liste, intervenez-vous quand même ?',
      a: `La liste ci-dessus regroupe les communes qui ont une page dédiée, mais notre zone est plus large. Nous couvrons ${city} et ses environs dans un rayon d'environ ${serviceArea.radiusKm} km. En cas de doute sur votre secteur, appelez-nous : nous vous répondons tout de suite.`,
    },
    {
      q: `Le délai est-il plus long en dehors de ${city} ?`,
      a: "Le délai dépend surtout du planning en cours, pas de la distance : les communes de l'agglomération sont toutes à quelques minutes de route. Nous vous annonçons un créneau réaliste au moment de l'appel plutôt qu'une promesse générique.",
    },
    {
      q: 'Le déplacement dans une commune voisine est-il facturé en plus ?',
      a: `Le tarif que nous annonçons au téléphone couvre l'intervention dans notre zone autour de ${city}. S'il devait y avoir un supplément lié à un secteur particulièrement éloigné, vous le sauriez avant de nous engager, pas au moment de la facture.`,
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Zones d'intervention"
        title={
          <>
            {city} et les communes
            <br />
            <span className="text-gradient-accent">de l&apos;agglomération</span>
          </>
        }
        subtitle={`Nous couvrons ${city} et ${zones.length} communes voisines, dans un rayon d'environ ${serviceArea.radiusKm} km.`}
      />

      <section className="bg-sand-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* Réponse courte factuelle « citable » (levier GEO). */}
          <AnimatedSection className="mx-auto max-w-3xl rounded-card border border-brand-600/20 bg-brand-600/5 p-6 lg:p-8">
            <p className="leading-relaxed text-ink-900">{citable}</p>
          </AnimatedSection>

          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {zones.map((z, idx) => (
              <AnimatedSection key={z.slug} delay={(idx % 3) * 0.07} as="li">
                <Link
                  href={`/zones/${z.slug}`}
                  className="group flex h-full flex-col rounded-card border border-sand-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/40 hover:shadow-card-hover"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-xl font-medium text-ink-950 transition-colors group-hover:text-brand-700">
                      {z.name}
                    </span>
                    <span className="shrink-0 text-sm text-sand-400">{z.postalCode}</span>
                  </div>
                  {z.context && (
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-sand-600">{z.context}</p>
                  )}
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent-600 transition-all group-hover:gap-3">
                    Débouchage à {z.name}
                    <ArrowRight size={16} />
                  </span>
                </Link>
              </AnimatedSection>
            ))}
          </ul>

          <AnimatedSection className="mt-12 rounded-card border border-sand-200 bg-white p-8">
            <h2 className="text-2xl">Et à {city} même</h2>
            <p className="mt-3 leading-relaxed text-sand-600">
              {city} n&apos;a pas de page dédiée : c&apos;est notre ville de base. Nous intervenons
              dans tous les quartiers, du centre aux faubourgs.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {serviceArea.districts.map((d) => (
                <li
                  key={d}
                  className="inline-flex rounded-full border border-sand-200 bg-sand-100 px-4 py-2 text-sm text-sand-700"
                >
                  {d}
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </section>

      <Faq
        items={hubFaq}
        eyebrow="Zone d'intervention"
        title={
          <>
            Vos questions
            <span className="text-gradient-ink italic"> sur notre secteur</span>
          </>
        }
      />

      <CtaBanner />
    </>
  )
}
