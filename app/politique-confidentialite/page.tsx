import type { Metadata } from 'next'
import legal from '@/content/legal.json'
import { siteConfig } from '@/config/site.config'
import { buildMetadata } from '@/lib/seo'

// Page utilitaire → noindex, follow (cf. brief SEO §7).
export const metadata: Metadata = buildMetadata({
  title: 'Politique de confidentialité',
  description: `Politique de confidentialité de ${siteConfig.businessName}.`,
  path: '/politique-confidentialite',
  noindex: true,
})

export default function PolitiqueConfidentialite() {
  const c = legal.confidentialite
  return (
    <section className="container-site section max-w-3xl">
      <h1 className="text-3xl md:text-4xl">Politique de confidentialité</h1>
      <div className="mt-8 space-y-6 text-slate-700">
        <section>
          <h2 className="text-xl">Finalité du traitement</h2>
          <p className="mt-2">{c.finalite}</p>
          <p className="mt-1"><strong>Base légale :</strong> {c.baseLegale}</p>
        </section>
        <section>
          <h2 className="text-xl">Données collectées</h2>
          <p className="mt-2">{c.donneesCollectees.join(', ')}.</p>
        </section>
        <section>
          <h2 className="text-xl">Durée de conservation</h2>
          <p className="mt-2">{c.conservation}</p>
        </section>
        <section>
          <h2 className="text-xl">Destinataires</h2>
          <p className="mt-2">{c.destinataires}</p>
        </section>
        <section>
          <h2 className="text-xl">Vos droits</h2>
          <p className="mt-2">{c.droits}</p>
        </section>
        <section>
          <h2 className="text-xl">Cookies</h2>
          <p className="mt-2">{c.cookies}</p>
        </section>
      </div>
    </section>
  )
}
