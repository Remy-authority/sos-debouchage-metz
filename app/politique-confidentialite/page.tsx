import type { Metadata } from 'next'
import legal from '@/content/legal.json'
import { siteConfig } from '@/config/site.config'
import { buildMetadata } from '@/lib/seo'
import { LegalPage } from '@/components/layout/LegalPage'

// Page utilitaire → noindex, follow.
export const metadata: Metadata = buildMetadata({
  title: 'Politique de confidentialité',
  description: `Politique de confidentialité de ${siteConfig.businessName}.`,
  path: '/politique-confidentialite',
  noindex: true,
})

export default function PolitiqueConfidentialite() {
  const c = legal.confidentialite

  return (
    <LegalPage
      title="Politique de confidentialité"
      subtitle="Ce que deviennent les informations que vous nous transmettez."
    >
      <section>
        <h2>Responsable du traitement</h2>
        <p>{c.responsableTraitement}</p>
      </section>
      <section>
        <h2>Finalité du traitement</h2>
        <p>{c.finalite}</p>
        <p>
          <strong>Base légale :</strong> {c.baseLegale}
        </p>
      </section>
      <section>
        <h2>Données collectées</h2>
        <p>{c.donneesCollectees.join(', ')}.</p>
      </section>
      <section>
        <h2>Durée de conservation</h2>
        <p>{c.conservation}</p>
      </section>
      <section>
        <h2>Destinataires</h2>
        <p>{c.destinataires}</p>
      </section>
      <section>
        <h2>Vos droits</h2>
        <p>{c.droits}</p>
      </section>
      <section>
        <h2>Cookies</h2>
        <p>{c.cookies}</p>
      </section>
    </LegalPage>
  )
}
