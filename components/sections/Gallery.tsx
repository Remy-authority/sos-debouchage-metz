import Image from 'next/image'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionHeader } from '@/components/ui/SectionHeader'

/**
 * Galerie des situations traitées.
 *
 * ⚠️ Cadrage éditorial : ce ne sont pas des « réalisations » revendiquées (le site
 * n'a pas encore d'historique d'intervention et le CLAUDE.md interdit d'inventer
 * une preuve). Ce sont les cas de figure du métier, présentés comme tels.
 */
const items = [
  {
    src: '/gallery/01-furet-electrique.jpg',
    alt: "Furet électrique déroulé devant un siphon d'évier ouvert",
    title: 'Furet électrique',
    caption: 'Le bouchon localisé, attaqué par le siphon ou le tampon de visite.',
  },
  {
    src: '/gallery/02-hydrocurage.jpg',
    alt: 'Flexible haute pression engagé dans un regard de visite ouvert',
    title: 'Hydrocurage',
    caption: 'Pour un réseau encrassé sur toute sa longueur, pas seulement bouché.',
  },
  {
    src: '/gallery/03-inspection-camera.jpg',
    alt: "Écran de contrôle d'une caméra d'inspection posé au bord d'un regard",
    title: 'Inspection caméra',
    caption: 'Quand la cause reste incertaine ou que le bouchon revient.',
  },
  {
    src: '/gallery/04-regard-exterieur.jpg',
    alt: 'Regard de visite en béton ouvert dans une allée pavée',
    title: 'Regard et canalisation enterrée',
    caption: 'Racines, affaissement, mauvaise pente : ça se voit au regard.',
  },
  {
    src: '/gallery/05-colonne-immeuble.jpg',
    alt: "Colonne d'évacuation en fonte dans un local technique d'immeuble",
    title: "Colonne d'immeuble",
    caption: 'Plusieurs logements qui refoulent en même temps, une seule cause.',
  },
  {
    src: '/gallery/06-bac-a-graisse.jpg',
    alt: 'Bac à graisse ouvert à l’arrière d’une cuisine professionnelle',
    title: 'Bac à graisse',
    caption: 'Restauration et collectivités, entretien à périodicité régulière.',
  },
]

export function Gallery() {
  return (
    <section
      className="noise-overlay relative overflow-hidden bg-ink-950 py-24 lg:py-32"
      aria-labelledby="gallery-title"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgb(var(--c-brand-600)/0.25),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeader
          id="gallery-title"
          eyebrow="Sur le terrain"
          title={
            <>
              Les situations
              <span className="text-gradient-accent"> que nous traitons</span>
            </>
          }
          subtitle="Six cas de figure qui reviennent tout le temps sur l'agglomération messine, et l'outil qui va avec."
          variant="dark"
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <AnimatedSection
              key={item.src}
              delay={(idx % 3) * 0.08}
              className="group relative overflow-hidden rounded-card border border-ink-700/50"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-900">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-transparent"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="font-display text-xl font-medium text-sand-50">{item.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-sand-300">{item.caption}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
