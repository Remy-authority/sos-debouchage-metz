/**
 * CoupeMetz, le dessin du « bloc 1 qui plonge » (mise à jour 10/2026, scénario revu avec Rémy le
 * 10/10/2026). Ce que le client paie sans jamais le voir : la canalisation sous son carrelage.
 *
 * Repère : celui de la photo `public/accueil/salle-de-bain-camera-*.avif` ramenée à 1600 px de
 * large (1600 x 893). Le dessin déborde de la photo à droite (le jardin, le regard, la rue) et en
 * bas (le sous-sol), de x -400 à 4200 et de y -400 à 1900. La coupe passe AU PIED DU MUR (y 690) :
 * au-dessus, le mur et le WC suspendu de la photo ; dessous, le sol coupé. Le tuyau sort donc du
 * mur, sous le WC, comme dans une vraie maison, et jamais à travers le carrelage de la photo.
 *
 * Relevés sur agrandissement quadrillé (pixels à 1600 px) :
 *   WC suspendu        x 734 à 865 (axe 800), bas de la cuvette y 677
 *   pied du mur        y 672 sous le WC (haut de la plinthe y 654)
 *   mallette caméra    couvercle x 905 à 1068, de y 556 au sol ; au-dessus de la coupe, elle est
 *                      remplacée par `mur-sans-mallette.webp` (mur reconstruit ligne par ligne
 *                      entre les pixels nets de part et d'autre, x 896 à 1076, y 546 à 692)
 *
 * Le scénario, piloté par `poserCoupe(svg, p)` avec p (0 à 1) l'avancée de la piste :
 *   1. le sol s'ouvre au pied du mur : carreau, chape, dalle, hérisson, remblai ;
 *   2. le tuyau du WC descend sous la dalle, passe sous la façade et file vers le regard ;
 *   3. un bouchon de lingettes dans le tuyau, l'eau bloquée derrière ;
 *   4. la caméra entre par le regard et trouve le bouchon, puis le jet le dégage ;
 *   5. l'eau repart vers l'égout ; le sol se referme sur la salle de bain intacte,
 *      « Sans casser le carrelage ».
 * Attributs lus : `data-trace` (trait qui se dessine), `data-fondu` (apparition), `data-sortie`
 * (disparition), chacun « début,fin » en p ; `data-glisse` (« début,fin,x0,x1 », translation
 * le long du tuyau) ; `data-ep` (épaisseur en pixels d'ÉCRAN) ; `data-echelle` (groupe d'étiquette
 * dessiné en pixels d'écran, posé au point visé).
 *
 * Aucune cote, aucun chiffre : coupe de principe. Les étiquettes sont du vrai texte (SVG).
 */

import { useId, type CSSProperties, type Ref } from 'react'

/* ---------- Repère ---------- */
export const LARGEUR = 1600
export const HAUTEUR_PHOTO = 893
export const AXE = 800
/** Pied du WC, point visé par la caméra pendant l'avancée. */
export const PIED_WC = 672
/** Ligne de coupe : le sol, juste devant le pied du mur, sous la cuvette. */
export const SOL = 690
/** Débord du dessin autour de la photo. */
export const CADRE = { x0: -400, x1: 4200, y0: -400, y1: 1900 }
/** Avancée de la piste où la coupe est complète, l'eau repartie (repli sans animation). */
export const P_COUPE_COMPLETE = 0.62

/* ---------- Couleurs ---------- */
const NUIT = '#0B1E23'
const CREME = '#FBF3DC'
const ENCRE = '#0B2429'
const MIEL = '#FCD680'
const EAU = '#2FA7C4'
const EAU_CLAIRE = '#9EE3F2'
const TUYAU = '#9AA6AB'
const DEDANS = '#13262B'
/** Câble de la caméra : orange, pour ne jamais se confondre avec le câble jaune de la photo. */
const CABLE = '#F08A24'
const FLEXIBLE = '#E6EBED'

/* ---------- Couches sous le carrelage ---------- */
const CARREAU = { haut: SOL, bas: SOL + 9 }
const CHAPE = { haut: SOL + 9, bas: SOL + 28 }
const DALLE = { haut: SOL + 28, bas: SOL + 66 }
const HERISSON = { haut: SOL + 66, bas: SOL + 88 }
/** La façade, coupée : pierre de Jaumont, fondation plus profonde. */
const FACADE = { x0: 1560, x1: 1640, haut: 120, pied: SOL + 207 }
const SEMELLE = { x0: 1528, x1: 1672, haut: SOL + 207, bas: SOL + 239 }
/** Le jardin, un peu plus bas que le sol de la maison. */
const PELOUSE = SOL + 28
const REGARD = { x0: 2066, x1: 2134, paroi: 14, bas: SOL + 184 }
const REGARD_AXE = (REGARD.x0 + REGARD.x1) / 2
/** La mallette de la photo, posée sur le sol coupé : le mur reconstruit derrière elle. */
const MUR_NET = { href: '/accueil/mur-sans-mallette.webp', x: 896, y: 546, w: 180, h: 146 }

/* ---------- La canalisation ---------- */
type P = readonly [number, number]
const r1 = (v: number) => Math.round(v * 10) / 10
/** Pente régulière du collecteur, de l'aplomb du WC jusqu'à la rue. */
const PENTE = 0.018
const pente = (x: number) => SOL + 137 + (x - AXE) * PENTE
const DIAM = 30
const BOUCHON = { x0: 1700, x1: 1792 }
/** Tracé du collecteur : descente sous le WC, coude, puis la longue pente vers la rue. */
const coude = `M${AXE} ${SOL}L${AXE} ${r1(pente(AXE) - 34)}Q${AXE} ${r1(pente(AXE))} ${AXE + 34} ${r1(pente(AXE + 34))}`
const TRACE = `${coude}L${CADRE.x1} ${r1(pente(CADRE.x1))}`
const EN_AMONT = `${coude}L${BOUCHON.x0} ${r1(pente(BOUCHON.x0))}`

/** Nombre pseudo-aléatoire stable (même dessin au serveur et au navigateur). */
const hasard = (n: number) => {
  const v = Math.sin(n * 91.37 + 17.13) * 24634.6345
  return v - Math.floor(v)
}

/** Une lingette froissée : un polygone irrégulier et un pli. */
const froisse = (cx: number, cy: number, rx: number, ry: number, n: number) => {
  const pts = Array.from({ length: 7 }, (_, k) => {
    const a = (k / 7) * Math.PI * 2 + hasard(n + k) * 0.5
    const r = 0.72 + hasard(n + k + 20) * 0.4
    return `${r1(cx + Math.cos(a) * rx * r)} ${r1(cy + Math.sin(a) * ry * r)}`
  })
  return { forme: `M${pts.join('L')}Z`, pli: `M${r1(cx - rx * 0.5)} ${r1(cy - 1)}Q${r1(cx)} ${r1(cy + ry * 0.4)} ${r1(cx + rx * 0.45)} ${r1(cy - ry * 0.2)}` }
}
const TEINTES = ['#F4F0E6', '#E2D9C6', '#D0C4AC']
/** Le bouchon : des lingettes tassées qui remplissent le tuyau. */
const LINGETTES = Array.from({ length: 10 }, (_, i) => {
  const x = BOUCHON.x0 + 7 + i * 9 + (hasard(i + 500) - 0.5) * 5
  return { ...froisse(x, pente(x) + (hasard(i + 520) - 0.5) * 7, 8 + hasard(i + 540) * 5, 5 + hasard(i + 560) * 2.5, i * 31), teinte: TEINTES[i % 3] }
})
/** Les morceaux dégagés par le jet, emportés vers le regard puis l'égout. */
const MORCEAUX = Array.from({ length: 8 }, (_, i) => {
  const x = BOUCHON.x0 + 6 + i * 12
  return { ...froisse(x, pente(x) + (hasard(i + 300) - 0.5) * 9, 4 + hasard(i + 330) * 2.5, 3 + hasard(i + 350) * 1.5, i * 17 + 400), teinte: TEINTES[i % 3] }
})

/* ---------- La façade en pierre de Jaumont ---------- */
const ASSISES = (() => {
  let d = ''
  for (let y = FACADE.haut + 34, i = 0; y < FACADE.pied; y += 34, i++) {
    d += `M${FACADE.x0} ${y}H${FACADE.x1}`
    const x = FACADE.x0 + (i % 2 ? 28 : 52)
    d += `M${x} ${y - 34}V${y}`
  }
  return d
})()

/* ---------- Étiquettes ---------- */
type Etiquette = {
  /** Point visé, dans le repère de la photo. */
  vise: P
  /** Position de la cartouche, en pixels d'écran depuis le point visé (coin le plus proche). */
  ordi: { dx: number; dy: number; texte: string; vise?: P }
  mobile: { dx: number; dy: number; texte: string[]; vise?: P }
  fondu: [number, number]
  sortie: [number, number]
  fort?: boolean
}
/** Toutes les étiquettes de la coupe s'effacent quand le sol se referme. */
const REFERME: [number, number] = [0.78, 0.81]
const ETIQUETTES: Etiquette[] = [
  {
    vise: [700, (DALLE.haut + DALLE.bas) / 2],
    ordi: { dx: -30, dy: 90, texte: 'Sous le carrelage, la chape et la dalle' },
    mobile: { dx: -20, dy: 30, texte: ['Sous le carrelage,', 'la chape et la dalle'], vise: [1000, (DALLE.haut + DALLE.bas) / 2] },
    fondu: [0.17, 0.22],
    sortie: [0.26, 0.29],
  },
  {
    vise: [1150, pente(1150)],
    ordi: { dx: -40, dy: 58, texte: 'Le tuyau du WC file vers le regard' },
    mobile: { dx: -20, dy: 52, texte: ['Le tuyau du WC', 'file vers le regard'], vise: [960, pente(960)] },
    fondu: [0.25, 0.31],
    sortie: REFERME,
  },
  {
    vise: [BOUCHON.x0 + 30, pente(BOUCHON.x0 + 30) + 4],
    ordi: { dx: -40, dy: 70, texte: 'Des lingettes bouchent le tuyau' },
    mobile: { dx: 8, dy: 150, texte: ['Des lingettes', 'bouchent le tuyau'] },
    fondu: [0.37, 0.42],
    sortie: [0.53, 0.56],
  },
  {
    vise: [REGARD_AXE, PELOUSE - 6],
    ordi: { dx: 30, dy: -70, texte: 'Le regard' },
    mobile: { dx: -16, dy: 150, texte: ['Le regard'], vise: [REGARD_AXE, REGARD.bas + 16] },
    fondu: [0.31, 0.36],
    sortie: REFERME,
  },
  {
    vise: [1840, pente(1840)],
    ordi: { dx: 40, dy: 74, texte: 'La caméra trouve le bouchon' },
    mobile: { dx: 10, dy: 70, texte: ['La caméra', 'trouve le bouchon'] },
    fondu: [0.45, 0.48],
    sortie: [0.495, 0.51],
  },
  {
    vise: [1745, pente(1745)],
    ordi: { dx: 40, dy: 74, texte: 'Le jet haute pression le dégage' },
    mobile: { dx: 10, dy: 70, texte: ['Le jet haute pression', 'le dégage'] },
    fondu: [0.51, 0.54],
    sortie: [0.565, 0.585],
  },
  {
    vise: [1960, pente(1960)],
    ordi: { dx: -30, dy: 64, texte: "L'eau repart vers l'égout" },
    mobile: { dx: -60, dy: 110, texte: ["L'eau repart", "vers l'égout"], vise: [1880, pente(1880)] },
    fondu: [0.57, 0.61],
    sortie: REFERME,
  },
  {
    // Sur la photo revenue : le carrelage, intact, devant le mur.
    vise: [610, 706],
    ordi: { dx: 0, dy: -150, texte: 'Sans casser le carrelage' },
    mobile: { dx: 0, dy: -96, texte: ['Sans casser', 'le carrelage'] },
    fondu: [0.85, 0.89],
    sortie: [0.93, 0.95],
    fort: true,
  },
]

const CORPS = { ordi: 13, mobile: 11.5 }
/** Largeur approchée d'une ligne (Inter demi-gras), pour tailler la cartouche. */
const largeurTexte = (t: string, corps: number) => t.length * corps * 0.56

function Cartouche({ e, version }: { e: Etiquette; version: 'ordi' | 'mobile' }) {
  const corps = (e.fort ? 1.25 : 1) * CORPS[version]
  const lignes = version === 'ordi' ? [e.ordi.texte] : e.mobile.texte
  const { dx, dy } = version === 'ordi' ? e.ordi : e.mobile
  const pad = { x: 9, y: 6 }
  const interligne = corps * 1.25
  const w = Math.max(...lignes.map((l) => largeurTexte(l, corps))) + pad.x * 2 + (e.fort ? 22 : 0)
  const h = lignes.length * interligne + pad.y * 2 - (interligne - corps) + 2
  // La cartouche s'accroche par le coin le plus proche du point visé.
  const x = dx >= 0 ? dx : dx - w
  const y = dy >= 0 ? dy : dy - h
  const fondu = `${e.fondu[0]},${e.fondu[1]}`
  const amorce = `${e.fondu[0]},${(e.fondu[0] + e.fondu[1]) / 2}`
  return (
    <g data-sortie={`${e.sortie[0]},${e.sortie[1]}`}>
      <path d={`M0 0L${dx} ${dy}`} stroke={MIEL} strokeWidth={1.4} pathLength={1} data-trace={amorce} />
      <rect x={-3.5} y={-3.5} width={7} height={7} fill={MIEL} data-fondu={amorce} />
      <g data-fondu={fondu}>
        <rect x={x} y={y} width={w} height={h} rx={2} fill={e.fort ? MIEL : CREME} />
        {e.fort && <path d={`M${x + 9} ${y + h / 2}l4.5 4.5 8.5-9`} fill="none" stroke={ENCRE} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />}
        <text x={x + pad.x + (e.fort ? 22 : 0)} y={y + pad.y + corps * 0.86} fill={ENCRE} fontSize={corps} fontWeight={600}>
          {lignes.map((l, i) => (
            <tspan key={l} x={x + pad.x + (e.fort ? 22 : 0)} dy={i === 0 ? 0 : interligne}>
              {l}
            </tspan>
          ))}
        </text>
      </g>
    </g>
  )
}

function Etiquettes({ version }: { version: 'ordi' | 'mobile' }) {
  return (
    <>
      {ETIQUETTES.map((e) => (
        <g key={e.ordi.texte} data-echelle={`${(e[version].vise ?? e.vise)[0]},${(e[version].vise ?? e.vise)[1]}`}>
          <Cartouche e={e} version={version} />
        </g>
      ))}
    </>
  )
}

export function CoupeMetz({ className, style, svgRef }: { className?: string; style?: CSSProperties; svgRef?: Ref<SVGSVGElement> }) {
  const id = useId().replace(/:/g, '')
  const m = (n: string) => `url(#${id}-${n})`
  const W = CADRE.x1 - CADRE.x0
  const H = CADRE.y1 - CADRE.y0
  const sousSol = (haut: number, bas: number, x0 = CADRE.x0, x1 = FACADE.x0) => ({ x: x0, y: haut, width: x1 - x0, height: bas - haut })

  return (
    <svg
      ref={svgRef}
      viewBox={`${CADRE.x0} ${CADRE.y0} ${W} ${H}`}
      overflow="visible"
      className={className}
      style={style}
      role="img"
      aria-label="Coupe sous une salle de bain à Metz : sous le carrelage, la chape et la dalle ; le tuyau du WC descend sous la dalle et file vers le regard du jardin ; des lingettes bouchent le tuyau ; la caméra entre par le regard et trouve le bouchon, le jet haute pression le dégage, l'eau repart vers l'égout, sans casser le carrelage"
    >
      <defs>
        <pattern id={`${id}-carreau`} width="64" height="9" patternUnits="userSpaceOnUse">
          <rect width="64" height="9" fill="#D9D5CD" />
          <path d="M63.5 0v9" stroke="#A9A39A" strokeWidth="1" />
        </pattern>
        <pattern id={`${id}-beton`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <rect width="10" height="10" fill="#8C8983" />
          <path d="M0 0v10" stroke="#A9A69F" strokeWidth="1.6" />
        </pattern>
        <pattern id={`${id}-gravier`} width="14" height="12" patternUnits="userSpaceOnUse">
          <rect width="14" height="12" fill="#6F6A60" />
          <circle cx="4" cy="4" r="3" fill="#9C968A" />
          <circle cx="11" cy="9" r="2.6" fill="#87816F" />
        </pattern>
        <pattern id={`${id}-terre`} width="30" height="20" patternUnits="userSpaceOnUse">
          <rect width="30" height="20" fill="#4A3828" />
          <circle cx="6" cy="6" r="1.7" fill="#6E5440" />
          <circle cx="21" cy="14" r="1.3" fill="#6E5440" />
          <path d="M24 4l3 2M10 16l3-1" stroke="#5E4634" strokeWidth="1.2" />
        </pattern>
        <linearGradient id={`${id}-ciel`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9D9DF" />
          <stop offset="1" stopColor="#E7ECE6" />
        </linearGradient>
        <linearGradient id={`${id}-cone`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#FFF4C8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFF4C8" stopOpacity="0" />
        </linearGradient>
        {/* Le câble glisse dans le tuyau mais ne dépasse jamais l'axe du regard, d'où il descend. */}
        <clipPath id={`${id}-avant-regard`} clipPathUnits="userSpaceOnUse">
          <rect x={CADRE.x0} y={CADRE.y0} width={REGARD_AXE + 2 - CADRE.x0} height={CADRE.y1 - CADRE.y0} />
        </clipPath>
      </defs>

      {/* Tout le dessin de la coupe s'efface quand le sol se referme sur la salle de bain. */}
      <g data-sortie="0.8,0.86">
        {/* ── 1. Dehors : le ciel, puis la pelouse (apparaissent avec la façade) ── */}
        <g data-fondu="0.24,0.3">
          {/* Le ciel commence au bord de la photo : au-dessus du mur cassé, on voit dehors. */}
          <rect x={LARGEUR} y={CADRE.y0} width={CADRE.x1 - LARGEUR} height={PELOUSE - CADRE.y0} fill={m('ciel')} />
        </g>

        {/* ── 2. Le sol s'ouvre au pied du mur, couche après couche ── */}
        {/* La mallette, posée sur le sol coupé, laisse place au mur voisin. */}
        <image href={MUR_NET.href} x={MUR_NET.x} y={MUR_NET.y} width={MUR_NET.w} height={MUR_NET.h} preserveAspectRatio="none" data-fondu="0.1,0.15" />
        <rect x={CADRE.x0} y={SOL} width={W} height={CADRE.y1 - SOL} fill={NUIT} data-fondu="0.1,0.15" />
        <rect {...sousSol(HERISSON.bas, CADRE.y1, CADRE.x0, FACADE.x1 + 2)} fill={m('terre')} data-fondu="0.17,0.23" />
        <rect {...sousSol(HERISSON.haut, HERISSON.bas)} fill={m('gravier')} data-fondu="0.15,0.2" />
        <rect {...sousSol(DALLE.haut, DALLE.bas)} fill={m('beton')} data-fondu="0.13,0.18" />
        <rect {...sousSol(CHAPE.haut, CHAPE.bas)} fill="#B9B3A6" data-fondu="0.12,0.17" />
        <rect {...sousSol(CARREAU.haut, CARREAU.bas)} fill={m('carreau')} data-fondu="0.11,0.16" />
        {/* Le jardin : terre végétale et remblai, sous la pelouse. */}
        <g data-fondu="0.24,0.3">
          <rect x={FACADE.x1} y={PELOUSE} width={CADRE.x1 - FACADE.x1} height={CADRE.y1 - PELOUSE} fill={m('terre')} />
          <rect x={FACADE.x1} y={PELOUSE} width={CADRE.x1 - FACADE.x1} height={48} fill="#3B2C20" />
          <rect x={FACADE.x1} y={PELOUSE - 7} width={CADRE.x1 - FACADE.x1} height={9} fill="#5F8F3C" />
          <path
            d={Array.from({ length: Math.ceil((CADRE.x1 - FACADE.x1) / 16) }, (_, i) => {
              const x = FACADE.x1 + 6 + i * 16 + hasard(i) * 8
              return `M${r1(x)} ${PELOUSE - 6}l${r1(-3 + hasard(i + 9) * 6)} ${r1(-7 - hasard(i + 5) * 6)}`
            }).join('')}
            stroke="#6FA246"
            strokeWidth={2.2}
            strokeLinecap="round"
          />
        </g>
        {/* La ligne de coupe, tracée de gauche à droite au pied du mur. */}
        <path d={`M${CADRE.x0} ${SOL}H${FACADE.x0}`} stroke={MIEL} strokeOpacity={0.9} pathLength={1} data-ep="1.6" data-trace="0.1,0.17" />

        {/* ── 3. La façade coupée, en pierre de Jaumont, et sa fondation ── */}
        <g data-fondu="0.23,0.29">
          <rect x={FACADE.x0} y={FACADE.haut} width={FACADE.x1 - FACADE.x0} height={FACADE.pied - FACADE.haut} fill="#C9A44E" />
          <path d={ASSISES} stroke="#8E6E2C" strokeWidth={2} fill="none" />
          <rect x={SEMELLE.x0} y={SEMELLE.haut} width={SEMELLE.x1 - SEMELLE.x0} height={SEMELLE.bas - SEMELLE.haut} fill={m('beton')} />
          {/* Arrachement en haut du mur : la coupe s'arrête là. */}
          <path d={`M${FACADE.x0} ${FACADE.haut}l14 -10 12 8 16 -12 14 10 14 -6V${FACADE.haut + 4}H${FACADE.x0}Z`} fill="#C9A44E" />
        </g>

        {/* ── 4. Le regard, dans le jardin ── */}
        <g data-fondu="0.29,0.35">
          <rect x={REGARD.x0 - REGARD.paroi} y={PELOUSE} width={REGARD.paroi} height={REGARD.bas - PELOUSE} fill={m('beton')} />
          <rect x={REGARD.x1} y={PELOUSE} width={REGARD.paroi} height={REGARD.bas - PELOUSE} fill={m('beton')} />
          <rect x={REGARD.x0 - REGARD.paroi} y={REGARD.bas} width={REGARD.x1 - REGARD.x0 + 2 * REGARD.paroi} height={16} fill={m('beton')} />
          <rect x={REGARD.x0} y={PELOUSE} width={REGARD.x1 - REGARD.x0} height={REGARD.bas - PELOUSE} fill={DEDANS} />
          <rect x={REGARD.x0 - REGARD.paroi - 8} y={PELOUSE - 12} width={REGARD.x1 - REGARD.x0 + 2 * REGARD.paroi + 16} height={12} rx={1.5} fill="#3D4549" />
          <path d={`M${REGARD.x0 - 14} ${PELOUSE - 6}H${REGARD.x1 + 14}`} stroke="#5D676C" strokeWidth={2} strokeDasharray="6 5" />
        </g>

        {/* ── 5. La canalisation, du pied du WC à la rue ── */}
        <g fill="none" strokeLinejoin="round">
          <path d={TRACE} stroke={TUYAU} strokeWidth={DIAM + 6} pathLength={1} data-trace="0.16,0.36" />
          <path d={TRACE} stroke={DEDANS} strokeWidth={DIAM - 6} pathLength={1} data-trace="0.16,0.36" />
        </g>
        {/* Le passage dans la fondation. */}
        <g data-fondu="0.27,0.32">
          <rect x={FACADE.x0 - 4} y={pente(FACADE.x0) - DIAM / 2 - 7} width={FACADE.x1 - FACADE.x0 + 8} height={DIAM + 14} fill="none" stroke="#3D4549" strokeWidth={3} />
        </g>

        {/* L'eau bloquée derrière le bouchon (en amont), qui ne s'écoule pas. */}
        <path d={EN_AMONT} fill="none" stroke={EAU} strokeOpacity={0.8} strokeWidth={DIAM - 12} data-fondu="0.37,0.41" data-sortie="0.55,0.58" />
        {/* Le bouchon de lingettes. */}
        <g data-fondu="0.34,0.38" data-sortie="0.53,0.56" stroke="#9C907A" strokeWidth={1.1} strokeLinejoin="round">
          {LINGETTES.map((l, i) => (
            <g key={i}>
              <path d={l.forme} fill={l.teinte} />
              <path d={l.pli} fill="none" />
            </g>
          ))}
        </g>
        {/* Les morceaux dégagés, emportés vers le regard puis l'égout. */}
        <g data-fondu="0.53,0.55" data-sortie="0.6,0.64">
          <g data-glisse="0.53,0.64,0,520" stroke="#9C907A" strokeWidth={0.9} strokeLinejoin="round">
            {MORCEAUX.map((b, i) => (
              <path key={i} d={b.forme} fill={b.teinte} />
            ))}
          </g>
        </g>

        {/* ── 6. La caméra d'inspection descend par le regard puis remonte le tuyau ── */}
        <g data-fondu="0.42,0.44" data-sortie="0.495,0.51">
          <path d={`M${REGARD_AXE} ${PELOUSE - 4}L${REGARD_AXE} ${pente(REGARD_AXE)}`} fill="none" stroke={CABLE} strokeWidth={4} />
          <g clipPath={`url(#${id}-avant-regard)`}>
            <g data-glisse="0.42,0.47,240,0">
              <path d={`M1848 ${pente(1848)}L${REGARD_AXE + 300} ${pente(REGARD_AXE + 300)}`} fill="none" stroke={CABLE} strokeWidth={4} />
              <rect x={1838} y={pente(1838) - 7} width={22} height={14} rx={2} fill="#C9D0D3" />
              <path d={`M1838 ${pente(1838)}L1760 ${pente(1760) - 13}L1760 ${pente(1760) + 13}Z`} fill={m('cone')} data-fondu="0.45,0.47" />
            </g>
          </g>
        </g>

        {/* ── 7. Le jet haute pression remonte jusqu'au bouchon et le dégage ── */}
        <g data-fondu="0.5,0.515" data-sortie="0.57,0.59">
          <path d={`M${REGARD_AXE} ${PELOUSE - 4}L${REGARD_AXE} ${pente(REGARD_AXE)}`} fill="none" stroke={FLEXIBLE} strokeWidth={5} />
          <g clipPath={`url(#${id}-avant-regard)`}>
            <g data-glisse="0.505,0.55,330,0">
              <path d={`M1712 ${pente(1712)}L${REGARD_AXE + 400} ${pente(REGARD_AXE + 400)}`} fill="none" stroke={FLEXIBLE} strokeWidth={5} />
              <rect x={1700} y={pente(1700) - 6} width={18} height={12} rx={2} fill="#7D898E" />
              {/* Jets vers l'avant et vers l'arrière, qui pulsent en continu. */}
              <g className="cm-jet" stroke={EAU_CLAIRE} strokeWidth={2.4} strokeLinecap="round">
                <path d={`M1700 ${pente(1700) - 3}l-30 -7M1700 ${pente(1700) + 3}l-30 7M1700 ${pente(1700)}h-34`} />
                <path d={`M1718 ${pente(1718) - 4}l26 -8M1718 ${pente(1718) + 4}l26 8`} />
              </g>
            </g>
          </g>
        </g>

        {/* ── 8. L'eau repart, du WC jusqu'à la rue, en continu ── */}
        <g data-fondu="0.56,0.6">
          <path d={TRACE} fill="none" stroke={EAU} strokeWidth={DIAM - 14} strokeLinejoin="round" />
          <path d={TRACE} className="cm-flux" fill="none" stroke={EAU_CLAIRE} strokeWidth={4} strokeLinejoin="round" pathLength={1} strokeDasharray="0.012 0.018" />
        </g>
      </g>

      {/* Étiquettes : deux jeux, ordinateur et téléphone. */}
      <g style={{ fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif' }}>
        <g className="hidden lg:block">
          <Etiquettes version="ordi" />
        </g>
        <g className="lg:hidden">
          <Etiquettes version="mobile" />
        </g>
      </g>
    </svg>
  )
}

/** Animations continues du dessin (le jet qui pulse, l'eau qui court), coupées si l'on demande moins de mouvement. */
export const CSS_COUPE = `
@keyframes cm-flux{to{stroke-dashoffset:-0.06}}
@keyframes cm-jet{0%,100%{opacity:.35}50%{opacity:1}}
.cm-flux{animation:cm-flux 1.1s linear infinite}
.cm-jet{animation:cm-jet .32s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.cm-flux,.cm-jet{animation:none}}`

/* -------------------------------------------------------------------------------------------- */
/* Pilotage direct du DOM : aucune mise à jour React pendant le défilement.                       */
/* -------------------------------------------------------------------------------------------- */
type Piste = {
  el: SVGElement
  trace?: [number, number]
  fondu?: [number, number]
  sortie?: [number, number]
  glisse?: [number, number, number, number]
}
const memo = new WeakMap<SVGSVGElement, Piste[]>()
const doux = (t: number) => t * t * (3 - 2 * t)
const borne = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)))
const lire = (s: string | undefined) => (s ? s.split(',').map(Number) : undefined)

function pistesDe(svg: SVGSVGElement): Piste[] {
  let l = memo.get(svg)
  if (!l) {
    l = Array.from(svg.querySelectorAll<SVGElement>('[data-trace],[data-fondu],[data-sortie],[data-glisse]')).map((el) => ({
      el,
      trace: lire(el.dataset.trace) as Piste['trace'],
      fondu: lire(el.dataset.fondu) as Piste['fondu'],
      sortie: lire(el.dataset.sortie) as Piste['sortie'],
      glisse: lire(el.dataset.glisse) as Piste['glisse'],
    }))
    memo.set(svg, l)
  }
  return l
}

/** Pose l'état du dessin pour une avancée p (0 à 1) de la piste. */
export function poserCoupe(svg: SVGSVGElement, p: number) {
  for (const t of pistesDe(svg)) {
    let opacite = 1
    if (t.trace) {
      const k = doux(borne(p, t.trace[0], t.trace[1]))
      t.el.style.strokeDasharray = '1 1'
      t.el.style.strokeDashoffset = (1 - k).toFixed(4)
      if (k === 0) opacite = 0
    }
    if (t.fondu) opacite *= doux(borne(p, t.fondu[0], t.fondu[1]))
    if (t.sortie) opacite *= 1 - doux(borne(p, t.sortie[0], t.sortie[1]))
    if (t.trace || t.fondu || t.sortie) {
      t.el.style.opacity = opacite.toFixed(3)
      t.el.style.visibility = opacite < 0.005 ? 'hidden' : ''
    }
    if (t.glisse) {
      const [a, b, x0, x1] = t.glisse
      const dx = x0 + (x1 - x0) * doux(borne(p, a, b))
      // Ce qui glisse suit le tuyau, donc sa pente.
      t.el.setAttribute('transform', `translate(${dx.toFixed(1)} ${(dx * PENTE).toFixed(2)})`)
    }
  }
}

/** Traits fins et étiquettes gardent leur taille à l'écran quel que soit le zoom `s`. */
export function ajusterCoupe(svg: SVGSVGElement, s: number) {
  const k = 1 / Math.max(0.05, s)
  svg.querySelectorAll<SVGElement>('[data-ep]').forEach((el) => el.setAttribute('stroke-width', (Number(el.dataset.ep) * k).toFixed(2)))
  svg.querySelectorAll<SVGElement>('[data-echelle]').forEach((el) => {
    const [x, y] = el.dataset.echelle!.split(',')
    el.setAttribute('transform', `translate(${x} ${y}) scale(${k.toFixed(4)})`)
  })
}

export default CoupeMetz
