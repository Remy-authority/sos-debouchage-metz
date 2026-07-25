import Image from 'next/image'

/**
 * Section « Nos réalisations », grille de 4 cartes d'intervention.
 * Photos générées par IA (DEMO – à remplacer par de vraies photos du loueur).
 */

const REALISATIONS = [
  {
    id: 'thermique',
    category: 'Thermographie',
    categoryColor: 'bg-blue-600',
    title: 'Détection par caméra thermique',
    desc: "Fuite derrière carrelage localisée en 20 min sans casse, appartement Angers centre.",
    image: '/realisations/thermographie.jpg',
  },
  {
    id: 'acoustique',
    category: 'Détection acoustique',
    categoryColor: 'bg-violet-600',
    title: 'Fuite sous dalle par acoustique',
    desc: "Localisation à 3 cm près sous chape béton, maison individuelle Saint-Barthélemy.",
    image: '/realisations/acoustique.jpg',
  },
  {
    id: 'gaz-traceur',
    category: 'Gaz traceur',
    categoryColor: 'bg-emerald-600',
    title: 'Injection gaz traceur sur réseau',
    desc: "Détection fuite chauffage en cave, résidence Avrillé, sans destruction.",
    image: '/realisations/gaz-traceur.jpg',
  },
  {
    id: 'rapport',
    category: 'Bilan hydrique',
    categoryColor: 'bg-amber-600',
    title: 'Bilan complet + rapport officiel',
    desc: "Rapport de localisation remis pour prise en charge assurance, copropriété Les Ponts-de-Cé.",
    image: '/realisations/rapport.jpg',
  },
]

export default function Realisations() {
  return (
    <section className="section bg-light" aria-labelledby="realisations-title">
      <div className="container-site">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">Notre travail</p>
          <h2 id="realisations-title" className="text-2xl font-bold text-slate-900 md:text-3xl">
            Nos réalisations
          </h2>
          <p className="mt-3 text-slate-500 text-sm max-w-xl mx-auto">
            Quelques interventions récentes sur Angers et le Maine-et-Loire.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REALISATIONS.map((real) => (
            <article key={real.id} className="card overflow-hidden p-0">
              {/* Visuel, photo d'intervention */}
              <div className="relative aspect-square w-full bg-slate-800">
                <Image
                  src={real.image}
                  alt={`${real.category}, ${real.title}`}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="p-4 text-center sm:text-left">
                {/* Badge catégorie */}
                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${real.categoryColor} mb-2`}>
                  {real.category}
                </span>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{real.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{real.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
