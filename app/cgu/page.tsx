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
          En consultant ce site, vous acceptez les présentes conditions générales
          d&apos;utilisation. Si vous les refusez, il vous appartient de ne pas utiliser le site.
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
          L&apos;envoi d&apos;une demande via le formulaire ne vaut ni commande ni engagement
          contractuel. Elle déclenche une prise de contact, à l&apos;issue de laquelle une
          prestation peut être proposée, acceptée ou refusée par l&apos;une ou l&apos;autre partie.
        </p>
      </section>
      <section>
        <h2>4. Contenus des conseils</h2>
        <p>
          Les articles de la rubrique conseils sont des informations générales. Ils ne remplacent
          pas un diagnostic sur place. Aucune responsabilité ne saurait être engagée en cas de
          dommage résultant de la mise en oeuvre d&apos;un geste décrit sans vérification préalable
          de la situation réelle.
        </p>
      </section>
      <section>
        <h2>5. Responsabilité</h2>
        <p>
          L&apos;éditeur met tout en oeuvre pour assurer l&apos;exactitude des informations
          publiées, sans garantie d&apos;exhaustivité. Il ne peut être tenu responsable des dommages
          indirects résultant de l&apos;utilisation du site ou d&apos;une interruption de service.
        </p>
      </section>
      <section>
        <h2>6. Droit applicable</h2>
        <p>
          Les présentes conditions sont régies par le droit français. Tout litige relève de la
          compétence des tribunaux français.
        </p>
      </section>
    </LegalPage>
  )
}
