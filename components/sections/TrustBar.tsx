'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { siteConfig } from '@/config/site.config'

/**
 * Bande des quatre engagements, juste sous le bloc 1 (refaite le 10/10/2026 :
 * les icônes de bibliothèque, statiques et rondes, ne disaient pas le métier).
 *
 * Quatre tuiles, chacune avec un PETIT DESSIN AU TRAIT du débouchage, dans
 * l'esprit de la coupe de la maison messine (encre fine, aplats jaune miel,
 * une touche d'eau) : le téléphone qui sonne, la feuille de prix, la caméra
 * dans le tuyau, la cathédrale de Metz. Chaque dessin SE TRACE une seule fois
 * quand sa tuile entre à l'écran (stroke-dashoffset), puis ses aplats se posent.
 *
 * Tout est VISIBLE par défaut (rendu serveur, robots, sans JavaScript) et n'est
 * masqué au montage que si la tuile est encore sous l'écran. « Réduire les
 * animations » : dessins affichés d'emblée. Aucune promesse nouvelle : ce sont
 * les engagements déjà écrits au site, aucune certification.
 */

const ENCRE = '#1A1F21'
const MIEL = '#FCD680'
const CREME = '#F4EFE3'
const EAU = '#4FA3C7'
const CABLE = '#F08A24'

/** Trait qui se trace. `r` = rang dans le dessin, pour l'ordre du tracé. */
function T({ d, r = 0, fin = false, couleur }: { d: string; r?: number; fin?: boolean; couleur?: string }) {
  return (
    <path
      d={d}
      pathLength={1}
      data-t=""
      stroke={couleur}
      strokeWidth={fin ? 1.1 : undefined}
      strokeOpacity={fin ? 0.55 : undefined}
      style={{ '--d': `${r * 110}ms` } as CSSProperties}
    />
  )
}

/** Aplat qui se pose après le trait. */
function F({ d, r = 0, couleur = MIEL, opacite = 1 }: { d: string; r?: number; couleur?: string; opacite?: number }) {
  return (
    <path
      d={d}
      fill={couleur}
      fillOpacity={opacite}
      stroke="none"
      data-f=""
      style={{ '--d': `${r * 110}ms` } as CSSProperties}
    />
  )
}

/** Cadre commun des quatre dessins : même boîte, même encre. */
function Dessin({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 160 96"
      className="mx-auto block h-[74px] w-auto lg:mx-0 lg:h-[96px]"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke={ENCRE} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  )
}

/* ── 1. Jour et nuit : le combiné qui sonne, la lune et le soleil ─────────── */
function Appel() {
  return (
    <Dessin>
      {/* Combiné */}
      <F d="M58 22 c-8 2 -12 10 -8 22 c5 14 15 26 29 32 c10 4 18 1 21 -6 l-11 -11 l-9 6 c-8 -4 -15 -12 -18 -21 l7 -8 Z" r={2} />
      <T d="M58 22 c-8 2 -12 10 -8 22 c5 14 15 26 29 32 c10 4 18 1 21 -6 l-11 -11 l-9 6 c-8 -4 -15 -12 -18 -21 l7 -8 Z" r={0} />
      <T d="M58 22 l9 10 M100 70 l-10 -11" r={1} fin />
      {/* Ondes de la sonnerie */}
      <T d="M84 30 a14 14 0 0 1 12 12" r={3} />
      <T d="M86 18 a26 26 0 0 1 22 22" r={4} />
      {/* Lune et soleil : jour et nuit */}
      <F d="M28 20 a10 10 0 1 0 12 12 a8 8 0 0 1 -12 -12 Z" r={5} couleur={ENCRE} opacite={0.12} />
      <T d="M28 20 a10 10 0 1 0 12 12 a8 8 0 0 1 -12 -12 Z" r={5} />
      <F d="M126 66 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0" r={6} />
      <T d="M126 66 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0" r={5} />
      <T d="M134 52 v-4 M134 84 v-4 M120 66 h-4 M152 66 h-4 M124 56 l-3 -3 M147 79 l-3 -3 M144 56 l3 -3 M121 79 l3 -3" r={6} fin />
    </Dessin>
  )
}

/* ── 2. Le prix annoncé : une étiquette chiffrée, attachée avant de venir ─── */
function Prix() {
  return (
    <Dessin>
      {/* Étiquette */}
      <F d="M44 30 L84 14 L126 46 L92 86 L50 66 Z" couleur="#FFFFFF" r={0} />
      <T d="M44 30 L84 14 L126 46 L92 86 L50 66 Z" r={0} />
      <T d="M60 32 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0" r={1} />
      {/* Ficelle */}
      <T d="M62 30 C48 18 30 20 22 34 S24 60 14 66" r={2} fin />
      {/* Signe euro */}
      <F d="M74 48 h34 v16 h-34 Z" r={3} opacite={0.9} />
      <T d="M100 46 a10 10 0 1 0 0 18 M84 52 h12 M84 58 h12" r={4} />
      {/* Lignes du détail */}
      <T d="M70 72 h14 M78 78 h8" r={5} fin />
    </Dessin>
  )
}

/* ── 3. La caméra : le tuyau en coupe, la tête qui éclaire le bouchon ─────── */
function Camera() {
  return (
    <Dessin>
      {/* Tuyau en coupe */}
      <F d="M8 34 H152 V62 H8 Z" couleur={ENCRE} opacite={0.06} r={0} />
      <T d="M8 34 H152 M8 62 H152" r={0} />
      {/* Bouchon au bout */}
      <F d="M118 36 c6 -2 12 2 14 8 c4 4 2 10 -2 12 c-2 6 -10 6 -14 2 c-6 0 -8 -8 -4 -12 c-2 -6 2 -10 6 -10 Z" r={3} couleur="#8A6A45" opacite={0.75} />
      <T d="M118 36 c6 -2 12 2 14 8 c4 4 2 10 -2 12 c-2 6 -10 6 -14 2 c-6 0 -8 -8 -4 -12 c-2 -6 2 -10 6 -10 Z" r={3} />
      {/* Câble orange et tête de caméra */}
      <T d="M8 48 H58" r={1} couleur={CABLE} />
      <F d="M58 42 h22 l6 6 l-6 6 h-22 Z" r={2} />
      <T d="M58 42 h22 l6 6 l-6 6 h-22 Z" r={1} />
      {/* Faisceau de lumière */}
      <F d="M86 48 L114 38 V58 Z" r={4} opacite={0.55} />
      <T d="M86 48 L114 38 M86 48 L114 58" r={4} fin />
      {/* Écran de contrôle au-dessus */}
      <T d="M60 8 h40 v20 h-40 Z" r={5} />
      <F d="M66 12 h28 v12 h-28 Z" r={6} couleur={EAU} opacite={0.35} />
      <T d="M80 28 v6" r={5} fin />
      {/* Eau qui stagne derrière */}
      <T d="M14 58 q6 -3 12 0 t12 0 t12 0" r={6} couleur={EAU} />
    </Dessin>
  )
}

/* ── 4. Metz : la cathédrale Saint-Étienne et le repère de la zone ─────────── */
function Metz() {
  return (
    <Dessin>
      {/* Nef et grand toit */}
      <F d="M36 56 L58 34 H118 L132 56 Z" couleur={ENCRE} opacite={0.07} r={1} />
      <T d="M36 56 L58 34 H118 L132 56" r={0} />
      <T d="M36 56 V84 H132 V56" r={1} />
      {/* Tour de Mutte */}
      <T d="M60 84 V30 H76 V84" r={1} />
      <T d="M60 30 L68 10 L76 30" r={2} />
      <T d="M64 40 v10 M72 40 v10" r={2} fin />
      {/* Arcs-boutants et verrières */}
      <T d="M88 84 V64 a6 6 0 0 1 12 0 V84 M108 84 V64 a6 6 0 0 1 12 0 V84" r={3} />
      <F d="M90 66 a4 4 0 0 1 8 0 V82 h-8 Z M110 66 a4 4 0 0 1 8 0 V82 h-8 Z" r={4} opacite={0.85} />
      {/* Repère de la zone */}
      <F d="M140 14 c-8 0 -12 6 -12 11 c0 8 12 19 12 19 s12 -11 12 -19 c0 -5 -4 -11 -12 -11 Z" r={5} />
      <T d="M140 14 c-8 0 -12 6 -12 11 c0 8 12 19 12 19 s12 -11 12 -19 c0 -5 -4 -11 -12 -11 Z" r={4} />
      <T d="M136 25 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0" r={5} fin />
      {/* La Moselle au pied */}
      <T d="M6 90 q10 -4 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" r={5} couleur={EAU} />
    </Dessin>
  )
}

const TUILES = [
  { cle: 'appel', titre: 'Ouvert 24h/24, 7j/7', ligne: 'Week-ends et jours fériés compris.', dessin: <Appel /> },
  { cle: 'prix', titre: 'Le prix annoncé avant', ligne: 'Le tarif est dit avant de venir.', dessin: <Prix /> },
  { cle: 'camera', titre: 'La caméra si besoin', ligne: 'Nous voyons la cause avant de forcer.', dessin: <Camera /> },
  {
    cle: 'metz',
    titre: `${siteConfig.city} et environs`,
    ligne: `Dans un rayon d'environ ${siteConfig.serviceArea.radiusKm} km.`,
    dessin: <Metz />,
  },
]

const STYLE = `
.bande-trace{--t:var(--t-tel)}
@media (min-width:1024px){.bande-trace{--t:var(--t-ord)}}
.bande-trace [data-t]{stroke-dasharray:1 2;stroke-dashoffset:0}
.bande-trace[data-etat="cache"] [data-t]{stroke-dashoffset:1.02}
.bande-trace[data-etat="cache"] [data-f]{opacity:0}
.bande-trace[data-etat="vu"] [data-t]{transition:stroke-dashoffset 760ms cubic-bezier(.45,0,.2,1) calc(var(--t,0ms) + var(--d,0ms))}
.bande-trace[data-etat="vu"] [data-f]{transition:opacity 520ms ease-out calc(var(--t,0ms) + var(--d,0ms) + 560ms)}
@media (prefers-reduced-motion:reduce){
  .bande-trace [data-t]{stroke-dashoffset:0!important;transition:none!important}
  .bande-trace [data-f]{opacity:1!important;transition:none!important}
}
`

function Tuile({ index, titre, ligne, dessin }: { index: number; titre: string; ligne: string; dessin: ReactNode }) {
  const ref = useRef<HTMLLIElement>(null)
  const [etat, setEtat] = useState<'fixe' | 'cache' | 'vu'>('fixe')

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      // Déjà à l'écran au chargement : on trace quand même, juste après l'arrivée.
      setEtat('cache')
      const id = window.setTimeout(() => setEtat('vu'), 60)
      return () => window.clearTimeout(id)
    }
    setEtat('cache')
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setEtat('vu')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <li
      ref={ref}
      data-etat={etat}
      className="bande-trace flex h-full flex-col overflow-hidden rounded-[3px] border border-ink-900/10 bg-white"
      style={{ '--t-tel': `${(index % 2) * 160}ms`, '--t-ord': `${index * 160}ms` } as CSSProperties}
    >
      <div className="border-b border-ink-900/[0.07] px-3 pb-2 pt-3 lg:px-5 lg:pb-3 lg:pt-4" style={{ backgroundColor: CREME }}>
        {dessin}
      </div>
      <div className="flex flex-1 flex-col justify-center px-3 pb-3.5 pt-3 text-center lg:justify-start lg:px-5 lg:pb-5 lg:pt-4 lg:text-left">
        <p className="text-balance text-[14.5px] font-semibold leading-snug text-ink-950 lg:text-[16.5px]">{titre}</p>
        <p className="mt-1 text-balance text-[12.5px] leading-snug text-sand-600 lg:mt-1.5 lg:text-[13.5px]">{ligne}</p>
      </div>
    </li>
  )
}

export function TrustBar() {
  return (
    <section className="border-b border-sand-200 bg-sand-50 py-4 lg:py-8" aria-label="Nos engagements">
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <ul className="grid auto-rows-fr grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-5" role="list">
          {TUILES.map((t, i) => (
            <Tuile key={t.cle} index={i} titre={t.titre} ligne={t.ligne} dessin={t.dessin} />
          ))}
        </ul>
      </div>
    </section>
  )
}
