import type { Metadata } from 'next'
import { siteConfig } from '@/config/site.config'
import { buildMetadata } from '@/lib/seo'
import LeadForm from '@/components/ui/LeadForm'
import PhoneButton from '@/components/ui/PhoneButton'

export const metadata: Metadata = buildMetadata({
  title: `Contact, ${siteConfig.businessName}`,
  description: `Contactez ${siteConfig.businessName} pour une recherche de fuite d'eau à ${siteConfig.city}. Devis gratuit, réponse rapide.`,
  path: '/contact',
})

export default function ContactPage() {
  return (
    <section className="container-site section">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl md:text-4xl">Contact & devis gratuit</h1>
          <p className="mt-4 text-slate-600">
            Une fuite d'eau à {siteConfig.city} ou dans les environs ? Appelez-nous ou
            remplissez le formulaire : nous vous recontactons rapidement.
          </p>
          <div className="mt-6 space-y-3 text-slate-700">
            <p><strong>Téléphone :</strong> {siteConfig.phoneDisplay}</p>
            <p><strong>Email :</strong> {siteConfig.email}</p>
            <p><strong>Disponibilité :</strong> {siteConfig.availability}</p>
            <p><strong>Zone :</strong> {siteConfig.serviceArea.base} + rayon ~{siteConfig.serviceArea.radiusKm} km</p>
          </div>
          <div className="mt-6">
            <PhoneButton label={`Appeler ${siteConfig.phoneDisplay}`} />
          </div>
        </div>
        <div id="formulaire">
          <LeadForm />
        </div>
      </div>
    </section>
  )
}
