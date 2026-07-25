import Link from 'next/link'
import { siteConfig } from '@/config/site.config'
import { getZones } from '@/lib/content'

const REASSURANCE_CARDS = [
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: 'Intervention rapide',
    desc: `Déplacement sous ${siteConfig.responseTime.toLowerCase()} et réponse garantie en 30 min, week-ends et jours fériés inclus.`,
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 2 3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: 'Artisan local certifié',
    desc: "Pas d'intermédiaire. Un artisan indépendant du Maine-et-Loire, joignable directement à tout moment.",
  },
]

export default function ServiceAreaMap() {
  const zones = getZones()

  return (
    <section className="section bg-light" aria-labelledby="area-title">
      <div className="container-site">
        {/* En-tête centré */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
            Zone d'intervention
          </p>
          <h2 id="area-title" className="text-2xl font-bold text-slate-900 md:text-3xl">
            Basés à {siteConfig.city}, nous couvrons un rayon de {siteConfig.serviceArea.radiusKm} km
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Artisan local en {siteConfig.region}, nous intervenons rapidement dans toute
            l'agglomération d'{siteConfig.city} et ses communes voisines.
          </p>
        </div>

        {/* Grille 2 colonnes */}
        <div className="grid gap-6 lg:grid-cols-[3fr_2fr] lg:items-start">

          {/* Carte sombre premium, villes et quartiers */}
          <div className="rounded-card bg-dark p-7 md:p-8 border border-white/10">
            {/* Label département */}
            <div className="mb-3 flex items-center gap-2">
              <svg
                className="h-4 w-4 text-accent"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-[2px] text-slate-400">
                {siteConfig.region} · {siteConfig.department}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white">Communes et quartiers desservis</h3>

            {/* Pastilles villes, communes vague 1 (liées) */}
            <ul
              className="mt-5 flex flex-wrap gap-2"
              role="list"
              aria-label="Communes avec page dédiée"
            >
              {/* Angers en premier, ville principale */}
              <li>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {siteConfig.city}
                </span>
              </li>
              {zones.map((z) => (
                <li key={z.slug}>
                  <Link
                    href={`/zones/${z.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:border-accent/40 hover:bg-accent/10 hover:text-white"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" aria-hidden="true" />
                    {z.name}
                  </Link>
                </li>
              ))}
              {/* Quartiers d'Angers, chips secondaires non liés (mais bien lisibles) */}
              {siteConfig.serviceArea.districts.map((d) => (
                <li key={d}>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" aria-hidden="true" />
                    {d}
                  </span>
                </li>
              ))}
            </ul>

            {/* Appel à l'action secondaire */}
            <p className="mt-6 text-sm text-slate-400">
              Un doute sur votre secteur ? Appelez-nous, nous étudions chaque demande au cas par cas.
            </p>
            <Link
              href="/zones"
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent/80"
            >
              Voir toutes nos zones
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>

          {/* Colonne droite : cartes réassurance + CTA orange */}
          <div className="flex flex-col gap-4">
            {REASSURANCE_CARDS.map((card) => (
              <div key={card.title} className="card flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {card.icon}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900">{card.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">{card.desc}</p>
                </div>
              </div>
            ))}

            {/* CTA orange principal, façon template */}
            <a
              href={`tel:${siteConfig.phone}`}
              className="btn-accent w-full justify-center rounded-2xl py-4 text-base"
              aria-label={`Vérifier ma zone, appeler le ${siteConfig.phoneDisplay}`}
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
              </svg>
              Vérifier ma zone · {siteConfig.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
