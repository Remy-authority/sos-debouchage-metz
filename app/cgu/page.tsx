import type { Metadata } from 'next'
import { siteConfig } from '@/config/site.config'
import { buildMetadata } from '@/lib/seo'
import { LegalPage } from '@/components/layout/LegalPage'

export const metadata: Metadata = buildMetadata({
  title: "Conditions générales d'utilisation",
  description: `Conditions générales d'utilisation du site ${siteConfig.businessName}.`,
  path: '/cgu',
  noindex: true,
})

export default function CGU() {
  return (
    <LegalPage
      title="Conditions générales d'utilisation"
      subtitle={`Règles d'usage du site ${siteConfig.businessName}.`}
    >
      <section>
        <h2>1. Acceptation</h2>
        <p>
          Naviguer sur {siteConfig.businessName} revient à accepter les règles ci-dessous. Une
          personne qui ne les accepte pas doit quitter le site et ne pas s&apos;en servir.
        </p>
      </section>
      <section>
        <h2>2. Objet du site</h2>
        <p>
          Le site présente des prestations de {siteConfig.trade.toLowerCase()} à {siteConfig.city} (
          {siteConfig.departmentName}, {siteConfig.department}) et dans les communes voisines. Les
          informations publiées ont une valeur indicative : seul le devis remis avant intervention
          fait foi sur le contenu et le prix de la prestation.
        </p>
      </section>
      <section>
        <h2>3. Demandes envoyées via le site</h2>
        <p>
          Remplir le formulaire de débouchage ne vous engage à rien et ne passe aucune commande.
          Nous vous rappelons, nous parlons de votre canalisation, et chacun reste libre de donner
          suite ou non à l&apos;intervention proposée.
        </p>
      </section>
      <section>
        <h2>4. Contenus des conseils</h2>
        <p>
          Nos conseils sur les WC, éviers et regards décrivent des cas courants, pas votre réseau
          à vous. Un geste appliqué sans avoir vérifié l&apos;état réel de la canalisation se fait
          sous votre seule responsabilité, l&apos;éditeur ne pouvant en répondre.
        </p>
      </section>
      <section>
        <h2>5. Responsabilité</h2>
        <p>
          Les pages sont relues avec soin, sans prétendre couvrir tous les cas. Une panne du site,
          une page indisponible ou un usage indirect de son contenu n&apos;ouvrent droit à aucune
          indemnité de la part de l&apos;éditeur.
        </p>
      </section>
      <section>
        <h2>6. Droit applicable</h2>
        <p>
          Ces règles relèvent du droit français, et un désaccord sur leur application se règle
          devant les juridictions françaises.
        </p>
      </section>
    </LegalPage>
  )
}
