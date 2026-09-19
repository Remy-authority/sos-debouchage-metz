import type { Metadata } from 'next'
import { siteConfig } from '@/config/site.config'
import { getServices, getZones } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { Hero } from '@/components/sections/Hero'
import { TrustBar } from '@/components/sections/TrustBar'
import { About } from '@/components/sections/About'
import { Services } from '@/components/sections/Services'
import { Process } from '@/components/sections/Process'
import { Stats } from '@/components/sections/Stats'
import { WhyUs } from '@/components/sections/WhyUs'
import { Gallery } from '@/components/sections/Gallery'
import { ServiceArea } from '@/components/sections/ServiceArea'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { LeadForm } from '@/components/ui/LeadForm'
import { Faq } from '@/components/ui/Faq'
import { CtaBanner } from '@/components/ui/CtaBanner'

// Requête d'argent visée : « débouchage canalisation Metz » (24 impressions en
// 28 jours, position 76) et « sos canalisation bouchée » (40 impressions).
const TITLE = `Débouchage canalisation ${siteConfig.city}, SOS urgence 7j/7`
const DESC = `Canalisation bouchée à ${siteConfig.city} ? WC, évier, douche, regard ou colonne d'immeuble débouchés sans casse, 7j/7. Prix annoncé avant l'intervention.`

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESC, path: '/' })

export default function HomePage() {
  const services = getServices()
  const zones = getZones()

  return (
    <>
      <Hero />
      <TrustBar />
      <About />
      <Services services={services} />
      <Process />
      <Stats />
      <WhyUs />
      {/* Communes desservies en bloc 8, jamais plus haut (règle Rémy 18/09/2026). */}
      <ServiceArea zones={zones} />
      {siteConfig.features.gallery && <Gallery />}

      <section id="devis" className="bg-sand-100 py-24 lg:py-32" aria-labelledby="devis-title">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <SectionHeader
            id="devis-title"
            eyebrow="Décrire ma situation"
            title={
              <>
                Trois questions,
                <span className="text-gradient-ink italic"> et on vous rappelle</span>
              </>
            }
            subtitle="Plus vous êtes précis sur ce qui refoule et depuis quand, plus notre estimation au téléphone sera juste."
          />
          <div className="mt-12">
            <LeadForm />
          </div>
        </div>
      </section>

      <Faq
        items={siteConfig.homeFaq as unknown as { q: string; a: string }[]}
        subtitle={`Prix, urgence, produits déboucheurs, responsabilité locataire ou propriétaire : ce qu'on nous demande le plus souvent à ${siteConfig.city}.`}
      />

      <CtaBanner />
    </>
  )
}
