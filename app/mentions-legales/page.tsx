import type { Metadata } from 'next'
import legal from '@/content/legal.json'
import { siteConfig } from '@/config/site.config'
import { buildMetadata } from '@/lib/seo'

/*
 * Mentions légales, conformité droit FR (éditeur identifié).
 * GABARIT piloté par content/legal.json. Les champs vides s'affichent « À compléter »
 * (données éditeur / SIREN à fournir par Rémy avant la prod, Gate C).
 * INDEXABLE (signal E-E-A-T, cf. brief SEO §7).
 */
export const metadata: Metadata = buildMetadata({
  title: 'Mentions légales',
  description: `Mentions légales de ${siteConfig.businessName}.`,
  path: '/mentions-legales',
})

// Affiche la valeur, ou un marqueur « À compléter » si vide (jamais de valeur factice).
function V({ children }: { children?: string }) {
  const val = (children || '').trim()
  return val ? <>{val}</> : <em className="text-amber-700">À compléter</em>
}

export default function MentionsLegales() {
  const e = legal.editeur
  return (
    <section className="container-site section max-w-3xl">
      <h1 className="text-3xl md:text-4xl">Mentions légales</h1>

      <div className="mt-8 space-y-8 text-slate-700">
        <section>
          <h2 className="text-xl">Éditeur du site</h2>
          <ul className="mt-2 space-y-1">
            <li><strong>Dénomination :</strong> <V>{e.raisonSociale}</V></li>
            <li><strong>Forme juridique :</strong> <V>{e.formeJuridique}</V></li>
            <li><strong>Numéro d'immatriculation :</strong> <V>{e.numeroImmatriculation}</V>, <V>{e.registre}</V></li>
            <li><strong>Siège social :</strong> <V>{e.adresse}</V></li>
            <li><strong>Directeur de la publication :</strong> <V>{e.directeurPublication}</V></li>
            <li><strong>Contact :</strong> {e.emailContact} · {e.telephone}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl">Assurance professionnelle</h2>
          <p className="mt-2">{legal.assurance.couverture}</p>
          <p><strong>Assureur :</strong> <V>{legal.assurance.assureur}</V> · <strong>Police n° :</strong> <V>{legal.assurance.police}</V></p>
        </section>

        <section>
          <h2 className="text-xl">Hébergeur</h2>
          <p className="mt-2">
            {legal.hebergeur.nom}, {legal.hebergeur.adresse}.{' '}
            <a href={legal.hebergeur.site} className="underline" rel="noopener noreferrer" target="_blank">
              {legal.hebergeur.site}
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl">Propriété intellectuelle</h2>
          <p className="mt-2">
            L'ensemble des contenus de ce site est protégé par le droit de la propriété
            intellectuelle. Toute reproduction est interdite sans autorisation préalable.
          </p>
        </section>

        <section>
          <h2 className="text-xl">Données personnelles</h2>
          <p className="mt-2">
            Voir notre{' '}
            <a href="/politique-confidentialite" className="underline">politique de confidentialité</a>.
          </p>
        </section>
      </div>
    </section>
  )
}
