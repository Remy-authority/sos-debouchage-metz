import type { Metadata } from 'next'
import Link from 'next/link'
import { getZones } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { siteConfig } from '@/config/site.config'
import ServiceAreaMap from '@/components/sections/ServiceAreaMap'
import Faq from '@/components/ui/Faq'
import CtaBanner from '@/components/ui/CtaBanner'

export const metadata: Metadata = buildMetadata({
  title: `Zones d'intervention, recherche de fuite près d'${siteConfig.city}`,
  description: `Communes desservies autour d'${siteConfig.city} pour la recherche de fuite d'eau : rayon d'environ ${siteConfig.serviceArea.radiusKm} km.`,
  path: '/zones',
})

export default function ZonesHub() {
  const zones = getZones()
  const names = zones.map((z) => z.name)
  // Réponse courte factuelle « citable » (activité + zone + liste des communes).
  const citable = `${siteConfig.businessName} couvre ${siteConfig.city} et ${zones.length} communes de l'agglomération angevine dans un rayon de ${siteConfig.serviceArea.radiusKm} km : ${names.join(', ')}. Recherche et détection de fuite d'eau en méthode non destructive, 7j/7.`

  const hubFaq = [
    {
      q: `Quelles communes couvrez-vous autour d'${siteConfig.city} ?`,
      a: `Nous intervenons à ${siteConfig.city} (tous quartiers) et dans les communes de l'agglomération dans un rayon d'environ ${siteConfig.serviceArea.radiusKm} km : ${names.join(', ')}.`,
    },
    {
      q: 'Ma commune ne figure pas dans la liste, intervenez-vous quand même ?',
      a: `La liste ci-dessus regroupe les communes disposant d'une page dédiée, mais notre zone est plus large. Nous couvrons ${siteConfig.city} et ses environs dans un rayon d'environ ${siteConfig.serviceArea.radiusKm} km. En cas de doute sur votre secteur, appelez-nous : nous étudions chaque demande au cas par cas.`,
    },
    {
      q: 'Quel est le délai pour une intervention en dehors d’Angers ?',
      a: "Le délai dépend de la commune et de notre planning du moment. Les communes limitrophes sont accessibles rapidement. Nous vous donnons une estimation lors de votre appel et intervenons 7j/7, y compris les week-ends et jours fériés pour les urgences.",
    },
    {
      q: 'Le déplacement dans les communes voisines est-il facturé en plus ?',
      a: `Le déplacement et le diagnostic de base sont gratuits et sans engagement dans notre zone d'intervention autour d'${siteConfig.city}. Le tarif de l'intervention dépend ensuite de la méthode nécessaire pour localiser la fuite. Contactez-nous pour un devis.`,
    },
  ]

  return (
    <>
      <section className="container-site section">
        <div className="text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Zone d'intervention</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Nos zones d'intervention autour d'{siteConfig.city}</h1>
        </div>

        {/* Réponse courte factuelle « citable » (GEO) */}
        <p className="mt-5 max-w-3xl rounded-card bg-light p-5 text-slate-700">{citable}</p>

        {/* Cartes enrichies : contexte par commune */}
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((z) => (
            <li key={z.slug}>
              <Link
                href={`/zones/${z.slug}`}
                className="card group flex h-full flex-col items-center text-center transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:items-stretch sm:text-left"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-lg font-bold text-slate-900 group-hover:text-primary">{z.name}</span>
                  <span className="shrink-0 text-sm text-slate-400">{z.postalCode}</span>
                </div>
                {z.context && <p className="mt-2 text-sm leading-relaxed text-slate-600">{z.context}</p>}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Recherche de fuite à {z.name}
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Carte de couverture (composant partagé) */}
      <ServiceAreaMap />

      {/* FAQ + FAQPage JSON-LD (émis par le composant Faq) */}
      <Faq items={hubFaq} title="Questions sur notre zone d'intervention" />

      <CtaBanner />
    </>
  )
}
