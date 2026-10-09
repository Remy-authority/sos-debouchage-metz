import type { Metadata } from 'next'
import { siteConfig } from '@/config/site.config'
import { buildMetadata } from '@/lib/seo'
import { LegalPage } from '@/components/layout/LegalPage'

export const metadata: Metadata = buildMetadata({
  title: 'Politique de cookies',
  description: `Utilisation des cookies sur le site ${siteConfig.businessName}.`,
  path: '/politique-cookies',
  noindex: true,
})

export default function PolitiqueCookies() {
  return (
    <LegalPage
      title="Politique de cookies"
      subtitle="Pas de publicité ni de pisteur extérieur sur ces pages."
    >
      <section>
        <h2>Qu&apos;est-ce qu&apos;un cookie</h2>
        <p>
          Le navigateur garde parfois, à la demande d&apos;un site, un court fichier qu&apos;on
          appelle cookie. On s&apos;en sert, entre autres, pour garder la langue choisie ou pour qu&apos;un
          formulaire se souvienne de l&apos;étape atteinte.
        </p>
      </section>
      <section>
        <h2>Cookies utilisés sur ce site</h2>
        <p>
          Sur {siteConfig.businessName}, seul un cookie indispensable à l&apos;affichage des pages peut être posé.
          <strong> Aucun cookie publicitaire, aucun traceur tiers, aucune mesure d&apos;audience</strong>{' '}
          n&apos;est utilisé en l&apos;état.
        </p>
      </section>
      <section>
        <h2>Gérer les cookies</h2>
        <p>
          Les réglages de votre navigateur permettent de bloquer ces fichiers ou d&apos;être prévenu
          avant chacun d&apos;eux, sans vous empêcher de consulter nos pages.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Pour toute question sur ce point :{' '}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </section>
    </LegalPage>
  )
}
