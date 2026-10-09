import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { Service } from '@/lib/content'

/**
 * Grille des prestations, sur fond sombre : une PHOTO de la prestation par carte, son nom et une
 * phrase courte (Rémy 10/10/2026 : « on veut des photos sur les prestations »). Chaque carte est
 * un lien vers sa page dédiée, porte d'entrée du maillage interne. 4 colonnes sur ordinateur,
 * 2 sur téléphone (photo et nom seuls, la phrase reste sur la page de la prestation).
 */
export function Services({ services }: { services: Service[] }) {
  return (
    <section
      id="prestations"
      className="noise-overlay relative overflow-hidden bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 py-20 lg:py-28"
      aria-labelledby="prestations-title"
    >
      <div aria-hidden="true" className="bg-grid absolute inset-0" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeader
          id="prestations-title"
          eyebrow="Nos prestations"
          title={
            <>
              Chaque bouchon a
              <span className="text-gradient-accent"> sa bonne méthode</span>
            </>
          }
          subtitle="Du siphon de la salle de bain à la colonne d’immeuble, nous choisissons la technique qui débouche sans abîmer."
          variant="dark"
        />

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-16 lg:grid-cols-4 lg:gap-6" role="list">
          {services.map((service, idx) => (
            <AnimatedSection key={service.slug} as="li" delay={(idx % 4) * 0.08} className="h-full">
              <Link
                href={`/services/${service.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[3px] border border-ink-700/60 bg-ink-900/60 transition-colors duration-300 hover:border-brand-400/60"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
                  {service.image && (
                    <Image
                      src={service.image}
                      alt={service.navTitle}
                      fill
                      sizes="(min-width: 1024px) 300px, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col items-center px-3 pb-4 pt-3 text-center sm:px-5 sm:pb-5 sm:pt-4 lg:items-start lg:text-left">
                  <h3 className="font-sans text-[15px] font-semibold leading-snug text-sand-50 [text-wrap:balance] sm:text-lg">
                    {service.navTitle}
                  </h3>
                  {service.carte && (
                    <p className="mt-2 hidden text-sm leading-relaxed text-sand-300 sm:block">{service.carte}</p>
                  )}
                  <span className="mt-auto hidden items-center gap-1.5 pt-4 text-sm font-medium text-accent-400 transition-colors group-hover:text-accent-300 sm:inline-flex">
                    Voir la prestation
                    <ArrowRight size={15} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </ul>

        {/* Renvoi vers /tarifs : paragraphe de corps uniquement. La page Tarifs
            n'est jamais au menu ni en bouton du bloc 1 (règle Rémy, 18/09/2026). */}
        <p className="mx-auto mt-10 max-w-2xl text-center text-base leading-relaxed text-sand-300">
          Un ordre de prix d&apos;abord&nbsp;? Les fourchettes publiées pour chaque intervention, avec
          leur source, sont sur{' '}
          <Link
            href="/tarifs"
            className="inline-flex items-center gap-1.5 font-medium text-accent-400 underline underline-offset-4 transition-colors hover:text-accent-300"
          >
            notre page des tarifs
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
