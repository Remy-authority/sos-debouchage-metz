import type { Metadata } from 'next'
import { siteConfig } from '@/config/site.config'
import { getServices } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { HeroPlongee } from '@/components/sections/HeroPlongee'
import { TrustBar } from '@/components/sections/TrustBar'
import { Services } from '@/components/sections/Services'
import { ChantierMetz } from '@/components/sections/ChantierMetz'
import { Gallery } from '@/components/sections/Gallery'
import { CarteMetz } from '@/components/sections/CarteMetz'
import { Faq } from '@/components/ui/Faq'
import { CtaBanner } from '@/components/ui/CtaBanner'

// Requête d'argent visée : « débouchage canalisation Metz » (24 impressions en
// 28 jours, position 76) et « sos canalisation bouchée » (40 impressions).
const TITLE = `Débouchage canalisation ${siteConfig.city}, SOS urgence 7j/7`
const DESC = `Canalisation bouchée à ${siteConfig.city} ? WC, évier, douche, regard ou colonne d'immeuble débouchés sans casse, 7j/7. Prix annoncé avant l'intervention.`

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESC, path: '/' })

export default function HomePage() {
  const services = getServices()

  return (
    <>
      <HeroPlongee />
      <TrustBar />
      <Services services={services} />
      <ChantierMetz />
      {siteConfig.features.gallery && <Gallery />}

      <Faq
        items={siteConfig.homeFaq as unknown as { q: string; a: string }[]}
        subtitle={`Prix, urgence, produits déboucheurs, responsabilité locataire ou propriétaire. Ce qu'on nous demande le plus souvent à ${siteConfig.city}.`}
      />

      {/* Carte des communes en bloc 7 (après la FAQ), jamais plus haut (règles Rémy 18/09 et 01/10/2026). */}
      <CarteMetz />

      <CtaBanner />
    </>
  )
}
