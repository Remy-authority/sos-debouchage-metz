import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TraceAuDefilement } from '@/components/ui/TraceAuDefilement'
import { atelier, adresseAtelier } from '@/components/ui/Atelier'
import { siteConfig } from '@/config/site.config'
import { CARTE, NOMS, PAGES } from './carte-secteur-data'

/**
 * Zone d'intervention de l'accueil (#R46, #R60 ; refaite le 22/11/2026, Rémy : « pourquoi les
 * autres villes ne sont pas mises en vert ? »). La VRAIE carte : toutes les communes à 40 km de
 * Metz ou moins, en vert, sans aucune zone grise dans le cercle ; contours officiels
 * (geo.api.gouv.fr) dans deux images statiques (scripts/carte-secteur.py) ; par-dessus, en code :
 * le rayon de 40 km, les noms (en gras les communes qui ont leur page, cliquables), le repère de
 * Metz et le point lumineux de l'atelier, expliqué par une seule ligne sous la carte.
 * Au défilement, le vert s'étend depuis Metz ; sans JavaScript ou avec « réduire les animations »,
 * carte entière et immobile (TraceAuDefilement reste en « fixe »).
 */

const STYLE = `
.carte-secteur .carte-vert{clip-path:circle(75% at var(--cx) var(--cy));transition:clip-path 1.8s cubic-bezier(.4,0,.2,1) .15s}
.carte-secteur[data-etat="cache"] .carte-vert{clip-path:circle(0% at var(--cx) var(--cy));transition:none}
.carte-secteur .carte-rayon{opacity:.85;transition:opacity .6s ease-out 1.6s}
.carte-secteur[data-etat="cache"] .carte-rayon{opacity:0;transition:none}
.carte-secteur .carte-onde{transform-box:fill-box;transform-origin:center;animation:carte-onde 2.6s ease-out infinite}
.carte-secteur .atelier-halo{transform-box:fill-box;transform-origin:center;opacity:.45;animation:atelier-pulse 2.4s ease-out infinite}
@keyframes carte-onde{from{transform:scale(1);opacity:.9}to{transform:scale(4.5);opacity:0}}
@keyframes atelier-pulse{0%{transform:scale(.6);opacity:.75}100%{transform:scale(1.6);opacity:0}}
@media (prefers-reduced-motion:reduce){
  .carte-secteur .carte-vert,.carte-secteur .carte-rayon{transition:none}
  .carte-secteur .carte-onde{animation:none;opacity:0}
  .carte-secteur .atelier-halo{animation:none}
}
`

export function CarteMetz() {
  const { city } = siteConfig
  const liste = [...PAGES].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
  const { w, h, cx, cy, rayon, cadre, metz } = CARTE
  // Typé à la main : le fichier généré écrit `null` quand l'atelier est vidé dans la config.
  const at = CARTE.atelier as { x: number; y: number } | null
  const angle = -Math.PI / 4
  const noms = [
    ...NOMS.map((n) => ({ ...n, gras: false })),
    ...PAGES.filter((p) => p.etiquette).map((p) => ({ nom: p.nom, etiquette: p.etiquette!, gras: true })),
  ]

  return (
    <section id="zone" className="relative bg-white py-16 lg:py-28" aria-labelledby="zone-title">
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <SectionHeader
          id="zone-title"
          eyebrow="Zone d'intervention"
          title={
            <>
              Toutes les communes à {CARTE.km}&nbsp;km{' '}
              <span className="text-gradient-ink italic">autour de {city}</span>
            </>
          }
        />

        <div className="mt-10 grid items-center gap-8 lg:mt-14 lg:grid-cols-[1.45fr_1fr] lg:gap-14">
          <figure className="m-0">
            <TraceAuDefilement className="carte-secteur mx-auto w-full max-w-[620px]">
              <div
                className="relative aspect-square"
                style={{ ['--cx' as string]: `${(cx / w) * 100}%`, ['--cy' as string]: `${(cy / h) * 100}%` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/carte/secteur-gris.svg" alt="" width={w} height={h} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/carte/secteur-vert.svg" alt="" width={w} height={h} loading="lazy" decoding="async" className="carte-vert absolute inset-0 h-full w-full" />
                <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 h-full w-full" role="group" aria-labelledby="carte-legende">
                  <title id="carte-legende">
                    {`Carte de ${city} et des ${CARTE.servies} communes où nous intervenons, en vert, dans un rayon de ${CARTE.km} km`}
                  </title>
                  {PAGES.map((p) => (
                    <Link key={p.slug} href={`/zones/${p.slug}`} aria-label={`Débouchage à ${p.nom}`} className="group">
                      <path
                        d={p.d}
                        className="fill-transparent stroke-brand-700/50 transition-[fill] duration-200 group-hover:fill-accent-500/30 group-focus-visible:fill-accent-500/30"
                        strokeWidth="1.6"
                      />
                    </Link>
                  ))}
                  <g aria-hidden="true" pointerEvents="none">
                    <circle cx={cx} cy={cy} r={rayon} fill="none" className="carte-rayon stroke-brand-700" strokeWidth="2.6" strokeDasharray="11 9" />
                    <circle cx={cx} cy={cy} r={cadre - 1.5} fill="none" stroke="#D9D4CC" strokeWidth="3" />
                    <text
                      x={cx + rayon * Math.cos(angle)}
                      y={cy + rayon * Math.sin(angle)}
                      className="carte-rayon fill-brand-700"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="28"
                      fontWeight="700"
                      stroke="#fff"
                      strokeWidth="8"
                      strokeLinejoin="round"
                      paintOrder="stroke"
                    >
                      {CARTE.km} km
                    </text>
                  </g>
                  <g aria-hidden="true" pointerEvents="none" stroke="rgb(255 255 255 / .9)" strokeLinejoin="round" paintOrder="stroke">
                    {noms.map(({ nom, etiquette: e, gras }) => (
                      <text
                        key={nom}
                        x={e.x}
                        y={e.y}
                        fontSize={e.taille}
                        strokeWidth={e.taille * 0.26}
                        fontWeight={gras ? 700 : 500}
                        fill={gras ? '#0F1A12' : '#3A423D'}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {e.lignes.length === 2 ? (
                          <>
                            <tspan x={e.x} dy="-0.56em">{e.lignes[0]}</tspan>
                            <tspan x={e.x} dy="1.12em">{e.lignes[1]}</tspan>
                          </>
                        ) : (
                          e.lignes[0]
                        )}
                      </text>
                    ))}
                    {/* Metz : le repère du centre et son nom. */}
                    <circle cx={metz.x} cy={metz.y} r="9" fill="#fff" className="stroke-brand-700" strokeWidth="5" />
                    <circle cx={metz.x} cy={metz.y} r="9" fill="none" className="carte-onde stroke-brand-700" strokeWidth="3" />
                    <text x={metz.x} y={metz.y - 30} fontSize="34" fontWeight="800" strokeWidth="8" fill="#0F1A12" textAnchor="middle" dominantBaseline="middle">
                      {city}
                    </text>
                    {/* L'atelier : un point lumineux, sans nom sur la carte (la ligne dessous le dit). */}
                    {atelier && at && (
                      <>
                        <circle cx={at.x} cy={at.y} r="15" className="atelier-halo fill-accent-400" stroke="none" />
                        <circle cx={at.x} cy={at.y} r="7.5" className="fill-accent-500" stroke="#fff" strokeWidth="3" />
                      </>
                    )}
                  </g>
                </svg>
              </div>
            </TraceAuDefilement>
            {atelier && (
              <figcaption className="mt-4 flex items-center justify-center gap-2 text-center text-[14px] text-ink-900/75">
                <span
                  className="inline-block h-3 w-3 shrink-0 rounded-full border-2 border-white bg-accent-500 shadow-[0_0_0_3px_rgb(var(--c-accent-400)/0.4)]"
                  aria-hidden="true"
                />
                {atelier.mot}, {adresseAtelier(atelier)}
              </figcaption>
            )}
          </figure>

          {/* Ordinateur seulement (décision du 22/11/2026, Niort) : la liste des communes qui ont
              leur page ; au téléphone, la carte suffit (noms cliquables, lien « Toutes les zones »). */}
          <div className="text-center lg:text-left">
            <div className="hidden lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-600">
                Les communes voisines de {city}
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-x-8 border-t border-sand-200">
                {liste.map((c) => (
                  <li key={c.slug} className="border-b border-sand-200">
                    <Link
                      href={`/zones/${c.slug}`}
                      className="group flex items-start gap-2.5 py-3 text-[15px] font-medium leading-snug text-ink-900 transition-colors hover:text-accent-500"
                    >
                      <span className="mt-[0.3em] h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[#9CCB8C] transition-colors group-hover:bg-accent-500" aria-hidden="true" />
                      {c.nom}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/zones"
              className="inline-flex items-center gap-1.5 text-[15px] font-medium text-brand-600 underline underline-offset-4 transition-colors hover:text-accent-500 lg:mt-5"
            >
              Toutes les zones
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
