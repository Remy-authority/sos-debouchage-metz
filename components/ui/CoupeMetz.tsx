/**
 * CoupeMetz, le dessin du « bloc 1 qui plonge » (mise à jour 10/2026, scénario validé par Rémy le
 * 10/10/2026). Ce que le client paie sans jamais le voir : la canalisation sous son carrelage.
 *
 * Repère : celui de la photo `public/accueil/salle-de-bain-camera-*.avif` ramenée à 1600 px de
 * large (1600 x 893). Le dessin déborde de la photo à droite (le jardin, le regard, la rue) et en
 * bas (le sous-sol), de x -400 à 4200 et de y -400 à 2100. La coupe s'ouvre SOUS la photo : le bord
 * bas de la photo (y 893) est la face avant coupée de la dalle, la salle de bain reste entière.
 *
 * Relevés sur agrandissement quadrillé (pixels à 1600 px) :
 *   WC suspendu        x 734 à 865 (axe 800), bas de la cuvette y 677
 *   pied du mur        y 672 sous le WC (haut de la plinthe y 654)
 *   mallette caméra    x 882 à 1067, écran y 600 à 665
 *
 * Le scénario, piloté par `poserCoupe(svg, p)` avec p (0 à 1) l'avancée de la piste :
 *   1. le carrelage s'ouvre : carreau, chape, dalle, hérisson, remblai ;
 *   2. la canalisation part du WC, passe sous la dalle et la façade, file sous la pelouse ;
 *   3. un joint fissuré, les racines de l'arbre entrées dans le tuyau, l'eau bloquée derrière ;
 *   4. la caméra entre par le regard et trouve la cause, puis le jet découpe les racines ;
 *   5. l'eau repart vers l'égout ; « Sans casser le carrelage ».
 * Attributs lus : `data-trace` (trait qui se dessine), `data-fondu` (apparition), `data-sortie`
 * (disparition), chacun « début,fin » en p ; `data-glisse` (« début,fin,x0,x1 », translation
 * horizontale) ; `data-ep` (épaisseur en pixels d'ÉCRAN) ; `data-echelle` (groupe d'étiquette
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
/** Face coupée de la dalle : le bord bas de la photo. */
export const SOL = HAUTEUR_PHOTO
/** Débord du dessin autour de la photo. */
export const CADRE = { x0: -400, x1: 4200, y0: -400, y1: 2100 }

/* ---------- Couleurs ---------- */
const NUIT = '#0B1E23'
const CREME = '#FBF3DC'
const ENCRE = '#0B2429'
const MIEL = '#FCD680'
const EAU = '#2FA7C4'
const EAU_CLAIRE = '#9EE3F2'
const TUYAU = '#9AA6AB'
const DEDANS = '#13262B'

/* ---------- Couches sous le carrelage ---------- */
const CARREAU = { haut: SOL, bas: SOL + 9 }
const CHAPE = { haut: SOL + 9, bas: SOL + 28 }
const DALLE = { haut: SOL + 28, bas: SOL + 66 }
const HERISSON = { haut: SOL + 66, bas: SOL + 88 }
/** La façade, coupée : pierre de Jaumont, fondation plus profonde. */
const FACADE = { x0: 1560, x1: 1640, haut: 120, pied: 1100 }
const SEMELLE = { x0: 1528, x1: 1672, haut: 1100, bas: 1132 }
/** Le jardin, un peu plus bas que le sol de la maison. */
const PELOUSE = SOL + 28
const REGARD = { x0: 2066, x1: 2134, paroi: 14, bas: 1077 }
const REGARD_AXE = (REGARD.x0 + REGARD.x1) / 2
const ARBRE = { x: 1880, pied: PELOUSE, tete: 580 }

/* ---------- La canalisation ---------- */
type P = readonly [number, number]
const r1 = (v: number) => Math.round(v * 10) / 10
const chemin = (pts: readonly P[]) => `M${pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L')}`
/** Pente régulière du collecteur, de l'aplomb du WC jusqu'à la rue. */
const PENTE = 0.018
const pente = (x: number) => 1030 + (x - AXE) * PENTE
const DIAM = 30
const JOINT = 1765
const RACINES = { x0: 1700, x1: 1792 }
/** Tracé du collecteur : descente sous le WC, coude, puis la longue pente vers la rue. */
const TRACE = `M${AXE} ${SOL}L${AXE} ${pente(AXE) - 34}Q${AXE} ${pente(AXE)} ${AXE + 34} ${r1(pente(AXE + 34))}L${CADRE.x1} ${r1(pente(CADRE.x1))}`
const EN_AMONT = `M${AXE} ${SOL}L${AXE} ${pente(AXE) - 34}Q${AXE} ${pente(AXE)} ${AXE + 34} ${r1(pente(AXE + 34))}L${RACINES.x0} ${r1(pente(RACINES.x0))}`

/** Nombre pseudo-aléatoire stable (même dessin au serveur et au navigateur). */
const hasard = (n: number) => {
  const v = Math.sin(n * 91.37 + 17.13) * 24634.6345
  return v - Math.floor(v)
}

/** Les racines dans le tuyau : un chevelu serré, entré par le joint. */
const CHEVELU = (() => {
  let d = ''
  for (let i = 0; i < 26; i++) {
    const x0 = JOINT - 2 + (hasard(i) - 0.5) * 8
    const y0 = pente(JOINT) - DIAM / 2 + 3
    const x1 = RACINES.x0 + hasard(i + 40) * (RACINES.x1 - RACINES.x0)
    const y1 = pente(x1) + (hasard(i + 80) - 0.5) * (DIAM - 8)
    const cx = (x0 + x1) / 2 + (hasard(i + 120) - 0.5) * 30
    const cy = (y0 + y1) / 2 + (hasard(i + 160) - 0.5) * 14
    d += `M${r1(x0)} ${r1(y0)}Q${r1(cx)} ${r1(cy)} ${r1(x1)} ${r1(y1)}`
  }
  return d
})()
/** Les racines de l'arbre, sous la pelouse ; la première descend jusqu'au joint. */
const RACINES_ARBRE = [
  `M${ARBRE.x - 6} ${PELOUSE + 4}C${ARBRE.x - 40} 951 ${JOINT + 60} 981 ${JOINT + 4} ${r1(pente(JOINT) - DIAM / 2 - 1)}`,
  `M${ARBRE.x + 4} ${PELOUSE + 4}C${ARBRE.x + 30} 961 ${ARBRE.x + 120} 981 ${ARBRE.x + 190} 1011`,
  `M${ARBRE.x - 2} ${PELOUSE + 6}C${ARBRE.x - 10} 981 ${ARBRE.x - 40} 1021 ${ARBRE.x - 70} 1101`,
  `M${ARBRE.x + 2} ${PELOUSE + 6}C${ARBRE.x + 18} 991 ${ARBRE.x + 50} 1041 ${ARBRE.x + 60} 1121`,
  `M${ARBRE.x - 4} ${PELOUSE + 3}C${ARBRE.x - 60} 933 ${ARBRE.x - 130} 941 ${ARBRE.x - 200} 966`,
]
/** Les morceaux de racines emportés par l'eau, vers le regard. */
const MORCEAUX = Array.from({ length: 7 }, (_, i) => ({
  x: RACINES.x0 + 8 + i * 13,
  dy: (hasard(i + 300) - 0.5) * 12,
  r: hasard(i + 330) * 50,
}))

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
  sortie?: [number, number]
  fort?: boolean
}
const ETIQUETTES: Etiquette[] = [
  {
    vise: [700, (DALLE.haut + DALLE.bas) / 2],
    ordi: { dx: -30, dy: 90, texte: 'Sous le carrelage, la chape et la dalle' },
    mobile: { dx: -20, dy: 30, texte: ['Sous le carrelage,', 'la chape et la dalle'], vise: [1000, (DALLE.haut + DALLE.bas) / 2] },
    fondu: [0.2, 0.26],
    sortie: [0.62, 0.66],
  },
  {
    vise: [1150, pente(1150)],
    ordi: { dx: -40, dy: 58, texte: 'La canalisation part vers le jardin' },
    mobile: { dx: -20, dy: 52, texte: ['La canalisation part', 'vers le jardin'], vise: [960, pente(960)] },
    fondu: [0.29, 0.35],
  },
  {
    vise: [JOINT + 2, pente(JOINT) - DIAM / 2],
    ordi: { dx: 24, dy: -92, texte: 'Un joint fissuré' },
    mobile: { dx: 14, dy: -64, texte: ['Un joint fissuré'] },
    fondu: [0.37, 0.42],
    sortie: [0.66, 0.7],
  },
  {
    vise: [RACINES.x0 + 30, pente(RACINES.x0 + 30) + 6],
    ordi: { dx: -40, dy: 70, texte: 'Les racines bouchent le tuyau' },
    mobile: { dx: 8, dy: 150, texte: ['Les racines', 'bouchent le tuyau'] },
    fondu: [0.41, 0.46],
    sortie: [0.57, 0.6],
  },
  {
    vise: [(REGARD.x0 + REGARD.x1) / 2, PELOUSE - 6],
    ordi: { dx: 30, dy: -70, texte: 'Le regard' },
    mobile: { dx: -16, dy: 150, texte: ['Le regard'], vise: [REGARD_AXE, REGARD.bas + 16] },
    fondu: [0.39, 0.44],
  },
  {
    vise: [1840, pente(1840)],
    ordi: { dx: 40, dy: 74, texte: 'La caméra trouve la cause' },
    mobile: { dx: 10, dy: 70, texte: ['La caméra', 'trouve la cause'] },
    fondu: [0.48, 0.52],
    sortie: [0.535, 0.56],
  },
  {
    vise: [1745, pente(1745)],
    ordi: { dx: 40, dy: 74, texte: 'Le jet découpe les racines' },
    mobile: { dx: 10, dy: 70, texte: ['Le jet découpe', 'les racines'] },
    fondu: [0.56, 0.6],
    sortie: [0.635, 0.66],
  },
  {
    vise: [2400, pente(2400)],
    ordi: { dx: -30, dy: 64, texte: "L'eau repart vers l'égout" },
    mobile: { dx: -60, dy: 110, texte: ["L'eau repart", "vers l'égout"], vise: [1880, pente(1880)] },
    fondu: [0.64, 0.69],
  },
  {
    vise: [1300, CARREAU.haut + 1],
    ordi: { dx: -20, dy: -110, texte: 'Sans casser le carrelage' },
    mobile: { dx: 0, dy: -104, texte: ['Sans casser', 'le carrelage'], vise: [1175, CARREAU.haut + 1] },
    fondu: [0.72, 0.8],
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
    <g data-sortie={e.sortie ? `${e.sortie[0]},${e.sortie[1]}` : undefined}>
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
      aria-label="Coupe sous une salle de bain à Metz : sous le carrelage, la chape et la dalle ; la canalisation part du WC vers le jardin ; un joint fissuré laisse entrer les racines d'un arbre qui bouchent le tuyau ; la caméra entre par le regard et trouve la cause, le jet haute pression découpe les racines, l'eau repart vers l'égout, sans casser le carrelage"
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
        <radialGradient id={`${id}-feuillage`} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#7FA75A" />
          <stop offset="1" stopColor="#4E7536" />
        </radialGradient>
      </defs>

      {/* ── 1. Dehors : le ciel, puis la pelouse (apparaissent avec la façade) ── */}
      <g data-fondu="0.28,0.34">
        {/* Le ciel commence au bord de la photo : au-dessus du mur cassé, on voit dehors. */}
        <rect x={LARGEUR} y={CADRE.y0} width={CADRE.x1 - LARGEUR} height={PELOUSE - CADRE.y0} fill={m('ciel')} />
      </g>

      {/* ── 2. Sous le carrelage : le sol s'ouvre couche après couche ── */}
      <rect x={CADRE.x0} y={SOL} width={W} height={CADRE.y1 - SOL} fill={NUIT} data-fondu="0.12,0.17" />
      <rect {...sousSol(HERISSON.bas, CADRE.y1, CADRE.x0, FACADE.x1 + 2)} fill={m('terre')} data-fondu="0.2,0.26" />
      <rect {...sousSol(HERISSON.haut, HERISSON.bas)} fill={m('gravier')} data-fondu="0.18,0.23" />
      <rect {...sousSol(DALLE.haut, DALLE.bas)} fill={m('beton')} data-fondu="0.16,0.21" />
      <rect {...sousSol(CHAPE.haut, CHAPE.bas)} fill="#B9B3A6" data-fondu="0.15,0.2" />
      <rect {...sousSol(CARREAU.haut, CARREAU.bas)} fill={m('carreau')} data-fondu="0.14,0.19" />
      {/* Le jardin : terre végétale et remblai, sous la pelouse. */}
      <g data-fondu="0.28,0.34">
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
      {/* La ligne de coupe, tracée de gauche à droite sous le carrelage. */}
      <path d={`M${CADRE.x0} ${SOL}H${FACADE.x0}`} stroke={MIEL} strokeOpacity={0.9} pathLength={1} data-ep="1.6" data-trace="0.13,0.2" />

      {/* ── 3. La façade coupée, en pierre de Jaumont, et sa fondation ── */}
      <g data-fondu="0.27,0.33">
        <rect x={FACADE.x0} y={FACADE.haut} width={FACADE.x1 - FACADE.x0} height={FACADE.pied - FACADE.haut} fill="#C9A44E" />
        <path d={ASSISES} stroke="#8E6E2C" strokeWidth={2} fill="none" />
        <rect x={SEMELLE.x0} y={SEMELLE.haut} width={SEMELLE.x1 - SEMELLE.x0} height={SEMELLE.bas - SEMELLE.haut} fill={m('beton')} />
        {/* Arrachement en haut du mur : la coupe s'arrête là. */}
        <path d={`M${FACADE.x0} ${FACADE.haut}l14 -10 12 8 16 -12 14 10 14 -6V${FACADE.haut + 4}H${FACADE.x0}Z`} fill="#C9A44E" />
      </g>

      {/* ── 4. L'arbre et ses racines ── */}
      <g data-fondu="0.32,0.38">
        <path d={`M${ARBRE.x - 13} ${ARBRE.pied}C${ARBRE.x - 9} 781 ${ARBRE.x - 4} 701 ${ARBRE.x - 6} ${ARBRE.tete}H${ARBRE.x + 8}C${ARBRE.x + 6} 701 ${ARBRE.x + 10} 781 ${ARBRE.x + 15} ${ARBRE.pied}Z`} fill="#5B4331" />
        <path d={`M${ARBRE.x} 691l-46 -58M${ARBRE.x + 2} 651l40 -50`} stroke="#5B4331" strokeWidth={9} strokeLinecap="round" />
        {[
          [ARBRE.x - 70, 581, 92],
          [ARBRE.x + 70, 571, 96],
          [ARBRE.x, 511, 112],
          [ARBRE.x - 20, 621, 84],
          [ARBRE.x + 30, 631, 78],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={m('feuillage')} />
        ))}
      </g>
      <g fill="none" stroke="#7A5A3E" strokeLinecap="round">
        {RACINES_ARBRE.map((d, i) => (
          <path key={i} d={d} strokeWidth={i === 0 ? 7 : 5 - i * 0.6} pathLength={1} data-trace={`${0.34 + i * 0.008},${0.43 + i * 0.006}`} />
        ))}
      </g>

      {/* ── 5. Le regard, dans le jardin ── */}
      <g data-fondu="0.33,0.39">
        <rect x={REGARD.x0 - REGARD.paroi} y={PELOUSE} width={REGARD.paroi} height={REGARD.bas - PELOUSE} fill={m('beton')} />
        <rect x={REGARD.x1} y={PELOUSE} width={REGARD.paroi} height={REGARD.bas - PELOUSE} fill={m('beton')} />
        <rect x={REGARD.x0 - REGARD.paroi} y={REGARD.bas} width={REGARD.x1 - REGARD.x0 + 2 * REGARD.paroi} height={16} fill={m('beton')} />
        <rect x={REGARD.x0} y={PELOUSE} width={REGARD.x1 - REGARD.x0} height={REGARD.bas - PELOUSE} fill={DEDANS} />
        <rect x={REGARD.x0 - REGARD.paroi - 8} y={PELOUSE - 12} width={REGARD.x1 - REGARD.x0 + 2 * REGARD.paroi + 16} height={12} rx={1.5} fill="#3D4549" />
        <path d={`M${REGARD.x0 - 14} ${PELOUSE - 6}H${REGARD.x1 + 14}`} stroke="#5D676C" strokeWidth={2} strokeDasharray="6 5" />
      </g>

      {/* ── 6. La canalisation, du WC à la rue ── */}
      <g fill="none" strokeLinejoin="round">
        <path d={TRACE} stroke={TUYAU} strokeWidth={DIAM + 6} pathLength={1} data-trace="0.19,0.4" />
        <path d={TRACE} stroke={DEDANS} strokeWidth={DIAM - 6} pathLength={1} data-trace="0.19,0.4" />
      </g>
      {/* Sous le WC, le départ de la canalisation en pointillé à travers le carrelage de la photo. */}
      <path
        d={`M${AXE - 12} ${PIED_WC + 8}V${SOL}M${AXE + 12} ${PIED_WC + 8}V${SOL}`}
        stroke={MIEL}
        strokeDasharray="7 6"
        fill="none"
        data-ep="2"
        data-fondu="0.17,0.22"
      />
      {/* Le passage dans la fondation, et l'emboîture fissurée près de l'arbre. */}
      <g data-fondu="0.3,0.36">
        <rect x={FACADE.x0 - 4} y={pente(FACADE.x0) - DIAM / 2 - 7} width={FACADE.x1 - FACADE.x0 + 8} height={DIAM + 14} fill="none" stroke="#3D4549" strokeWidth={3} />
      </g>
      <g data-fondu="0.36,0.41">
        <rect x={JOINT - 10} y={pente(JOINT) - DIAM / 2 - 6} width={20} height={DIAM + 12} rx={1.5} fill="#828E93" />
        <path d={`M${JOINT - 4} ${pente(JOINT) - DIAM / 2 - 6}l4 6-3 4 5 5`} stroke={NUIT} strokeWidth={2.4} fill="none" strokeLinejoin="round" />
      </g>

      {/* L'eau bloquée derrière le bouchon (en amont), qui ne s'écoule pas. */}
      <path d={EN_AMONT} fill="none" stroke={EAU} strokeOpacity={0.8} strokeWidth={DIAM - 12} data-fondu="0.42,0.47" data-sortie="0.6,0.64" />
      {/* Le bouchon de racines. */}
      <path d={CHEVELU} fill="none" stroke="#C49A6C" strokeWidth={2.4} strokeLinecap="round" data-fondu="0.4,0.45" data-sortie="0.56,0.61" />
      {/* Les morceaux coupés, emportés vers le regard. */}
      <g data-fondu="0.57,0.6" data-sortie="0.66,0.7">
        <g data-glisse="0.58,0.7,0,330">
          {MORCEAUX.map((b, i) => (
            <path key={i} d={`M${b.x - 5} ${r1(pente(b.x) + b.dy)}l10 ${r1((b.r - 25) / 12)}`} stroke="#C49A6C" strokeWidth={3} strokeLinecap="round" />
          ))}
        </g>
      </g>

      {/* ── 7. La caméra d'inspection descend par le regard puis remonte le tuyau ── */}
      <g data-fondu="0.46,0.48" data-sortie="0.535,0.555">
        <path d={`M${REGARD_AXE} ${PELOUSE - 4}L${REGARD_AXE} ${pente(REGARD_AXE)}`} fill="none" stroke="#E8C23A" strokeWidth={4} />
        <g clipPath={`url(#${id}-avant-regard)`}>
          <g data-glisse="0.46,0.51,240,0">
            <path d={`M1848 ${pente(1848)}L${REGARD_AXE + 300} ${pente(REGARD_AXE + 300)}`} fill="none" stroke="#E8C23A" strokeWidth={4} />
            <rect x={1838} y={pente(1838) - 7} width={22} height={14} rx={2} fill="#C9D0D3" />
            <path d={`M1838 ${pente(1838)}L1760 ${pente(1760) - 13}L1760 ${pente(1760) + 13}Z`} fill={m('cone')} data-fondu="0.49,0.52" />
          </g>
        </g>
      </g>

      {/* ── 8. Le jet haute pression traverse le bouchon ── */}
      <g data-fondu="0.53,0.55" data-sortie="0.62,0.645">
        <path d={`M${REGARD_AXE} ${PELOUSE - 4}L${REGARD_AXE} ${pente(REGARD_AXE)}`} fill="none" stroke="#1E1E1E" strokeWidth={5} />
        <g clipPath={`url(#${id}-avant-regard)`}>
          <g data-glisse="0.53,0.6,330,0">
            <path d={`M1712 ${pente(1712)}L${REGARD_AXE + 400} ${pente(REGARD_AXE + 400)}`} fill="none" stroke="#1E1E1E" strokeWidth={5} />
            <rect x={1700} y={pente(1700) - 6} width={18} height={12} rx={2} fill="#D7DCDE" />
            {/* Jets vers l'avant et vers l'arrière, qui pulsent en continu. */}
            <g className="cm-jet" stroke={EAU_CLAIRE} strokeWidth={2.4} strokeLinecap="round">
              <path d={`M1700 ${pente(1700) - 3}l-30 -7M1700 ${pente(1700) + 3}l-30 7M1700 ${pente(1700)}h-34`} />
              <path d={`M1718 ${pente(1718) - 4}l26 -8M1718 ${pente(1718) + 4}l26 8`} />
            </g>
          </g>
        </g>
      </g>

      {/* ── 9. L'eau repart, du WC jusqu'à la rue, en continu ── */}
      <g data-fondu="0.6,0.66">
        <path d={TRACE} fill="none" stroke={EAU} strokeWidth={DIAM - 14} strokeLinejoin="round" />
        <path d={TRACE} className="cm-flux" fill="none" stroke={EAU_CLAIRE} strokeWidth={4} strokeLinejoin="round" pathLength={1} strokeDasharray="0.012 0.018" />
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
