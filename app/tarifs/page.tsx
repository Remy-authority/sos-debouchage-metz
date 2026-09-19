import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Info, Phone } from 'lucide-react'
import tarifs from '@/content/tarifs.json'
import { siteConfig } from '@/config/site.config'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SourceNote, type Source } from '@/components/ui/SourceNote'
import { LeadForm } from '@/components/ui/LeadForm'
import { Faq } from '@/components/ui/Faq'
import { CtaBanner } from '@/components/ui/CtaBanner'

/**
 * Page /tarifs (SSG), contenu dans content/tarifs.json.
 *
 * RÈGLE DE LA PAGE : aucun montant sans sa source publique ET sa date, visibles
 * par le lecteur, rendues par le seul composant SourceNote. Aucun prix dans le
 * JSON-LD (pas de priceRange, pas d'Offer) : seulement le BreadcrumbList émis par
 * Breadcrumbs et la FAQPage émise par Faq.
 *
 * Maillage : la page n'est PAS au menu et n'a aucun bouton dans le bloc 1 de
 * l'accueil (règle Rémy du 18/09/2026). On y arrive par le pied de page, par les
 * pages prestation et par un paragraphe de corps.
 */

const SOURCES = tarifs.sources as Record<string, Source>

function resolve(keys: readonly string[]): Source[] {
  const seen = new Set<string>()
  const out: Source[] = []
  for (const k of keys) {
    const s = SOURCES[k]
    if (s && !seen.has(k)) {
      seen.add(k)
      out.push(s)
    }
  }
  return out
}

export const metadata: Metadata = buildMetadata({
  title: tarifs.metaTitle,
  description: tarifs.metaDescription,
  path: '/tarifs',
  absoluteTitle: true,
  ogImage: tarifs.image,
})

export default function TarifsPage() {
  const chiffresSources = resolve(tarifs.chiffresCles.flatMap((c) => c.sourceKeys))
  const toutesSources = resolve(Object.keys(SOURCES))

  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Accueil', path: '/' },
          { name: 'Tarifs', path: '/tarifs' },
        ]}
      />

      {/* ── Bloc 1 : H1 et photo de couverture du métier ── */}
      <section className="noise-overlay relative overflow-hidden bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 py-16 lg:py-20">
        <div aria-hidden="true" className="bg-grid absolute inset-0 hidden lg:block" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12 lg:px-10">
          <div className="order-2 text-center lg:order-none lg:col-span-7 lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-400">
              Tarifs {siteConfig.tradeShort.toLowerCase()} · {siteConfig.city}
            </p>
            <h1 className="mt-5 text-4xl leading-[1.1] text-sand-50 md:text-5xl lg:text-[3.25rem]">
              {tarifs.h1}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-sand-200 lg:mx-0">
              {tarifs.intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button href={`tel:${siteConfig.phone}`} variant="accent" size="lg">
                <Phone size={18} strokeWidth={2.5} />
                {siteConfig.phoneDisplay}
              </Button>
              <Button href="#devis" variant="ghost" size="lg">
                Faire estimer ma situation
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          <div className="order-1 lg:order-none lg:col-span-5">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-panel border border-brand-400/20 shadow-card lg:aspect-[4/3]">
              <Image
                src={tarifs.image}
                alt={tarifs.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 460px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <article className="bg-sand-50 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <AnimatedSection>
            <p className="rounded-card border-l-4 border-accent-500 bg-white px-6 py-5 text-center text-base leading-relaxed text-sand-700 shadow-card lg:text-left lg:text-lg">
              {tarifs.introSuite}
            </p>
          </AnimatedSection>

          {/* ── Trois chiffres clés ── */}
          <AnimatedSection className="mt-12">
            <div className="grid gap-4 sm:grid-cols-3">
              {tarifs.chiffresCles.map((c) => (
                <div
                  key={c.valeur}
                  className="rounded-card border border-sand-200 bg-white px-5 py-7 text-center shadow-card"
                >
                  <p className="font-display text-2xl font-medium leading-tight text-brand-600">
                    {c.valeur}
                  </p>
                  <span className="mx-auto mt-3 block h-[2px] w-8 bg-accent-500" aria-hidden="true" />
                  <p className="mt-3 text-sm leading-relaxed text-sand-600">{c.libelle}</p>
                </div>
              ))}
            </div>
            <SourceNote items={chiffresSources} className="mt-4 text-center lg:text-left" />
          </AnimatedSection>

          {/* ── Tableaux poste par poste ── */}
          <AnimatedSection className="mt-16">
            <h2 className="text-center text-3xl lg:text-left">Le prix poste par poste</h2>
            <p className="mt-4 text-center leading-relaxed text-sand-600 lg:text-left">
              Fourchettes nationales publiées par des guides de prix, reprises telles
              qu&apos;elles sont écrites. La source et sa date figurent sous chaque tableau.
            </p>
          </AnimatedSection>

          <div className="mt-8 space-y-10">
            {tarifs.tableGroups.map((groupe) => {
              const sources = resolve(groupe.rows.flatMap((r) => r.sourceKeys))
              return (
                <AnimatedSection key={groupe.titre}>
                  <h3 className="text-center text-xl text-ink-900 lg:text-left">{groupe.titre}</h3>
                  <div className="mt-4 overflow-hidden rounded-card border border-sand-200 bg-white shadow-card">
                    {/* Téléphone : une ligne = une carte. Un tableau à trois colonnes
                        sur 390 px casse chaque intitulé en cinq lignes. */}
                    <ul className="divide-y divide-sand-200 md:hidden">
                      {groupe.rows.map((row) => (
                        <li key={row.poste} className="px-5 py-4">
                          <p className="font-medium leading-snug text-ink-900">{row.poste}</p>
                          <p className="mt-1.5 font-semibold text-brand-700">{row.fourchette}</p>
                          <p className="mt-1 text-xs leading-relaxed text-sand-500">{row.inclus}</p>
                        </li>
                      ))}
                    </ul>

                    <table className="hidden w-full border-collapse text-left text-sm md:table">
                      <thead>
                        <tr className="bg-sand-100">
                          <th scope="col" className="px-5 py-3 font-semibold text-ink-900">
                            Prestation
                          </th>
                          <th scope="col" className="px-5 py-3 font-semibold text-ink-900">
                            Fourchette
                          </th>
                          <th scope="col" className="px-5 py-3 font-semibold text-ink-900">
                            Ce qui est compris
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupe.rows.map((row) => (
                          <tr key={row.poste} className="border-t border-sand-200">
                            <td className="px-5 py-3.5 align-top font-medium text-ink-900">
                              {row.poste}
                            </td>
                            <td className="px-5 py-3.5 align-top font-semibold text-brand-700">
                              {row.fourchette}
                            </td>
                            <td className="px-5 py-3.5 align-top text-sand-600">{row.inclus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <SourceNote items={sources} className="mt-3 text-center lg:text-left" />
                </AnimatedSection>
              )
            })}
          </div>

          {/* ── Majoration horaire ── */}
          <AnimatedSection className="mt-16 rounded-card border border-accent-400/30 bg-accent-500/5 p-7 lg:p-9">
            <h2 className="flex flex-col items-center gap-3 text-center text-2xl lg:flex-row lg:items-start lg:text-left">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent-500/15 text-accent-600">
                <Info size={20} />
              </span>
              <span>{tarifs.majoration.heading}</span>
            </h2>
            <p className="mt-5 text-center leading-relaxed text-sand-700 lg:text-left">
              {tarifs.majoration.body}
            </p>
            <SourceNote
              items={resolve(tarifs.majoration.sourceKeys)}
              className="mt-4 text-center lg:text-left"
            />
          </AnimatedSection>

          {/* ── Ce qui fait varier le prix ── */}
          <AnimatedSection className="mt-16">
            <h2 className="text-center text-3xl lg:text-left">{tarifs.variations.heading}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {tarifs.variations.items.map((item) => (
                <div
                  key={item.titre}
                  className="rounded-card border border-sand-200 bg-white p-6 text-center shadow-card lg:text-left"
                >
                  <h3 className="text-lg text-ink-900">{item.titre}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-sand-600">{item.texte}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* ── Notre façon d'annoncer le prix ── */}
          <AnimatedSection className="mt-16">
            <h2 className="text-center text-3xl lg:text-left">{tarifs.engagement.heading}</h2>
            <div className="mt-5 space-y-4 text-center leading-relaxed text-sand-700 lg:text-left">
              {tarifs.engagement.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <p className="mt-5 text-center leading-relaxed text-sand-700 lg:text-left">
              Le détail de chaque intervention est décrit sur sa page :{' '}
              <Link href="/services/urgence-debouchage-canalisation" className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-600">
                urgence débouchage
              </Link>
              ,{' '}
              <Link href="/services/curage-canalisation-haute-pression" className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-600">
                curage haute pression
              </Link>{' '}
              et{' '}
              <Link href="/services/inspection-camera-canalisation" className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-600">
                inspection caméra
              </Link>
              .
            </p>
          </AnimatedSection>

          {/* ── Toutes les sources, en clair ── */}
          <AnimatedSection className="mt-14 rounded-card border border-sand-200 bg-sand-100/70 p-6">
            <h2 className="text-center text-base font-semibold uppercase tracking-[0.14em] text-sand-600 lg:text-left">
              D&apos;où viennent ces chiffres
            </h2>
            <ul className="mt-4 space-y-2">
              {toutesSources.map((s) => (
                <li key={s.url}>
                  <SourceNote items={[s]} />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-sand-500">
              Ces fourchettes sont des prix publiés au niveau national, relevés le 20 septembre
              2026. Elles ne constituent pas un devis et n&apos;engagent pas leurs éditeurs.
            </p>
          </AnimatedSection>
        </div>
      </article>

      {/* ── Formulaire ── */}
      <section id="devis" className="bg-sand-100 py-20 lg:py-28" aria-labelledby="devis-tarifs">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <SectionHeader
            id="devis-tarifs"
            eyebrow="Faire estimer ma situation"
            title={
              <>
                Trois questions,
                <span className="text-gradient-ink italic"> et on vous rappelle</span>
              </>
            }
            subtitle="Décrivez ce qui refoule et depuis quand : c'est ce qui nous permet d'annoncer une prestation et son prix, plutôt qu'une fourchette générale."
          />
          <div className="mt-12">
            <LeadForm />
          </div>
        </div>
      </section>

      <Faq
        items={tarifs.faq}
        eyebrow="Prix et devis"
        subtitle={`Ce qu'on nous demande le plus souvent avant de faire intervenir quelqu'un sur une canalisation à ${siteConfig.city}.`}
      />

      <CtaBanner
        title={
          <>
            Un prix, avant
            <br />
            <span className="text-gradient-accent">de sortir le matériel.</span>
          </>
        }
        subtitle="Décrivez le symptôme en deux phrases. Nous vous disons quelle prestation s'impose, ce qu'elle coûte et sous quel délai nous pouvons passer."
      />
    </>
  )
}
