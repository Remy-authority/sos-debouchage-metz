import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { TraceAuDefilement } from '@/components/ui/TraceAuDefilement'
import { siteConfig } from '@/config/site.config'
import { CARTE_H, CARTE_W, COMMUNES_SERVIES, COMMUNES_VOISINES, MOSELLE } from '@/lib/carte-metz'
import type { Zone } from '@/lib/content'

/**
 * Bloc 7 de l'accueil (mise à jour du 10/10/2026, règles #R60 et #R46) : CARTE DE
 * L'AGGLOMÉRATION dessinée, jamais une photo. Chaque commune desservie est une
 * zone cliquable vers sa page ; Metz, l'accueil lui-même, est en teinte forte.
 * Contours réels (geo.api.gouv.fr, IGN Admin Express), figés dans lib/carte-metz.ts :
 * aucune requête au rendu. Les communes voisines sans page restent en gris clair.
 *
 * Au défilement : la Moselle se trace, puis les communes se colorent de Metz vers
 * l'extérieur, puis les noms se posent. Tout est visible sans JavaScript.
 */

type Etiquette = { x: number; y: number; ancre?: 'start' | 'middle' | 'end'; trait?: [number, number] }

/** Place du nom de chaque commune. Les petites communes de la côte ouest, serrées
 *  autour du Mont Saint-Quentin, ont leur nom sorti à gauche avec un trait fin. */
const ETIQUETTES: Record<string, Etiquette> = {
  'marange-silvange': { x: 205, y: 82 },
  woippy: { x: 290, y: 234 },
  'saint-julien-les-metz': { x: 410, y: 258, trait: [400, 264] },
  plappeville: { x: 158, y: 300, ancre: 'end', trait: [162, 296] },
  'le-ban-saint-martin': { x: 158, y: 331, ancre: 'end', trait: [162, 327] },
  'scy-chazelles': { x: 158, y: 362, ancre: 'end', trait: [162, 358] },
  'longeville-les-metz': { x: 158, y: 393, ancre: 'end', trait: [162, 389] },
  'moulins-les-metz': { x: 158, y: 433, ancre: 'end', trait: [162, 429] },
  'ars-sur-moselle': { x: 76, y: 478 },
  'montigny-les-metz': { x: 290, y: 446 },
  marly: { x: 282, y: 520 },
  augny: { x: 211, y: 552 },
}

const METZ = COMMUNES_SERVIES.find((c) => c.slug === 'metz')!
const AUTRES = COMMUNES_SERVIES.filter((c) => c.slug !== 'metz')

/** Rang d'apparition : de Metz vers l'extérieur. */
function delai(cx: number, cy: number) {
  return Math.round(Math.hypot(cx - METZ.cx, cy - METZ.cy) * 2.4)
}

const STYLE = `
.carte-metz [data-moselle]{stroke-dasharray:1 2;stroke-dashoffset:0}
.carte-metz [data-commune]{transition:fill .2s ease}
.carte-metz[data-etat="cache"] [data-moselle]{stroke-dashoffset:1.02}
.carte-metz[data-etat="cache"] [data-commune],.carte-metz[data-etat="cache"] [data-metz]{fill-opacity:0}
.carte-metz[data-etat="cache"] [data-nom]{opacity:0}
.carte-metz[data-etat="vu"] [data-moselle]{transition:stroke-dashoffset 1400ms cubic-bezier(.45,0,.2,1)}
.carte-metz[data-etat="vu"] [data-metz]{transition:fill-opacity 600ms ease-out 300ms}
.carte-metz[data-etat="vu"] [data-commune]{transition:fill-opacity 520ms ease-out calc(500ms + var(--d,0ms)),fill .2s ease}
.carte-metz[data-etat="vu"] [data-nom]{transition:opacity 420ms ease-out calc(800ms + var(--d,0ms))}
.carte-metz a:hover [data-commune],.carte-metz a:focus-visible [data-commune]{fill:rgb(var(--c-accent-500));fill-opacity:.9}
.carte-metz a:focus-visible{outline:none}
@media (max-width:639px){.carte-metz [data-nom] text{font-size:15.5px}}
@media (prefers-reduced-motion:reduce){
  .carte-metz *{transition:none!important}
  .carte-metz [data-moselle]{stroke-dashoffset:0!important}
  .carte-metz [data-nom]{opacity:1!important}
}
`

export function CarteMetz({ zones }: { zones: Zone[] }) {
  const { city, serviceArea } = siteConfig
  const pages = new Set(zones.map((z) => z.slug))
  const communes = AUTRES.filter((c) => pages.has(c.slug)).sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))

  return (
    <section id="zone" className="relative bg-white py-16 lg:py-28" aria-labelledby="zone-title">
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeader
          id="zone-title"
          eyebrow="Zone d'intervention"
          title={
            <>
              {city} et{' '}
              <span className="text-gradient-ink italic">son agglomération</span>
            </>
          }
          subtitle={`Nous intervenons dans un rayon d'environ ${serviceArea.radiusKm} km. Choisissez votre commune sur la carte.`}
        />

        <div className="mt-10 grid gap-8 lg:mt-16 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16">
          <TraceAuDefilement className="carte-metz mx-auto w-full max-w-[560px]">
            <svg
              viewBox={`0 0 ${CARTE_W} ${CARTE_H}`}
              className="h-auto w-full"
              role="img"
              aria-label={`Carte de ${city} et des communes desservies`}
            >
              <defs>
                <clipPath id="cadre-carte">
                  <rect width={CARTE_W} height={CARTE_H} rx="3" />
                </clipPath>
              </defs>
              <g clipPath="url(#cadre-carte)">
                <rect width={CARTE_W} height={CARTE_H} fill="rgb(var(--c-sand-50))" />
                {COMMUNES_VOISINES.map((d, i) => (
                  <path key={i} d={d} fill="rgb(var(--c-sand-200))" fillOpacity="0.55" stroke="#FFFFFF" strokeWidth="1" />
                ))}

                <path
                  d={METZ.d}
                  data-metz=""
                  fill="rgb(var(--c-brand-700))"
                  fillOpacity="0.92"
                  stroke="#FFFFFF"
                  strokeWidth="1.6"
                />
                {communes.map((c) => (
                  <a key={c.slug} href={`/zones/${c.slug}`} aria-label={`Débouchage à ${c.nom}`}>
                    <title>{c.nom}</title>
                    <path
                      d={c.d}
                      data-commune=""
                      fill="rgb(var(--c-brand-500))"
                      fillOpacity="0.5"
                      stroke="#FFFFFF"
                      strokeWidth="1.6"
                      style={{ '--d': `${delai(c.cx, c.cy)}ms`, cursor: 'pointer' } as CSSProperties}
                    />
                  </a>
                ))}

                <path
                  d={MOSELLE}
                  data-moselle=""
                  pathLength={1}
                  fill="none"
                  stroke="#4FA3C7"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pointerEvents="none"
                />
                <text
                  x="356"
                  y="168"
                  transform="rotate(-84 356 168)"
                  fontSize="11.5"
                  fontStyle="italic"
                  fill="#2D7FA6"
                  data-nom=""
                  pointerEvents="none"
                >
                  la Moselle
                </text>

                <g pointerEvents="none" fontSize="12.5" fontWeight="600" fill="rgb(var(--c-ink-950))">
                  {communes.map((c) => {
                    const e = ETIQUETTES[c.slug]
                    if (!e) return null
                    return (
                      <g key={c.slug} data-nom="" style={{ '--d': `${delai(c.cx, c.cy)}ms` } as CSSProperties}>
                        {e.trait && (
                          <path
                            d={`M${c.cx} ${c.cy} L${e.trait[0]} ${e.trait[1]}`}
                            stroke="rgb(var(--c-ink-950))"
                            strokeOpacity="0.55"
                            strokeWidth="1"
                            fill="none"
                          />
                        )}
                        {e.trait && (
                          <circle cx={c.cx} cy={c.cy} r="3.4" fill="#FFFFFF" stroke="rgb(var(--c-ink-950))" strokeWidth="1.4" />
                        )}
                        <text
                          x={e.x}
                          y={e.y}
                          textAnchor={e.ancre ?? 'middle'}
                          stroke="#FFFFFF"
                          strokeWidth="3.5"
                          strokeLinejoin="round"
                          paintOrder="stroke"
                        >
                          {c.nom}
                        </text>
                      </g>
                    )
                  })}
                  <text
                    x={METZ.cx + 14}
                    y={METZ.cy + 10}
                    textAnchor="middle"
                    fontSize="24"
                    fontWeight="700"
                    fill="#FFFFFF"
                    data-nom=""
                  >
                    {city}
                  </text>
                </g>
              </g>
            </svg>
          </TraceAuDefilement>

          <div className="text-center lg:text-left">
            <h3 className="text-2xl text-ink-950 lg:text-3xl">Les communes desservies</h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 border-t border-sand-200 sm:gap-x-8" role="list">
              {communes.map((c) => (
                <li key={c.slug} className="border-b border-sand-200">
                  <Link
                    href={`/zones/${c.slug}`}
                    className="group flex min-h-[44px] items-center justify-center gap-1.5 py-2 text-[15px] text-ink-900 transition-colors hover:text-accent-500 lg:justify-between"
                  >
                    {c.nom}
                    <ArrowRight
                      size={15}
                      aria-hidden="true"
                      className="hidden shrink-0 text-sand-400 transition-transform group-hover:translate-x-1 group-hover:text-accent-500 lg:block"
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[15px] leading-relaxed text-sand-600">
              Et tous les quartiers de {city}, du {serviceArea.districts[1]} à {serviceArea.districts[3]}.
            </p>
            <div className="mt-7 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button href={`tel:${siteConfig.phone}`} variant="accent" size="lg">
                <Phone size={18} strokeWidth={2.5} aria-hidden="true" />
                Vérifier ma commune
              </Button>
              <Link
                href="/zones"
                className="inline-flex items-center gap-1.5 text-[15px] font-medium text-brand-600 underline underline-offset-4 transition-colors hover:text-accent-500"
              >
                Toutes les zones
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
