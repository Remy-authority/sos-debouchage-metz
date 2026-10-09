import { memo } from 'react'

/**
 * MaisonMessine, le chantier de débouchage dessiné en couleur (bloc 3 de l'accueil, scénario
 * validé par Rémy le 10/10/2026) : une maison messine en pierre de Jaumont, écorchée sur sa
 * droite (salle de bain à l'étage, cuisine au rez-de-chaussée), le jardin et son regard, le
 * trottoir, la rue et l'égout sous la chaussée. La cathédrale au loin.
 *
 * Vue de côté, coupe verticale : la colonne descend du WC, le tuyau file sous le jardin jusqu'au
 * regard, le branchement rejoint l'égout. Repère : le sol est à y = 470.
 *
 * Le dessin sert la séquence `ChantierMetz` ; tout s'y pilote en progression globale `q`
 * (0 à 5, une unité par étape) :
 * - `data-pas="k"` + `data-debut` (0 à 1 dans l'étape) : le calque apparaît ; ses traits pleins
 *   se tracent, ses aplats arrivent en fondu ; `data-pose` : le groupe se pose d'un bloc ;
 * - `data-trace` : trait miel gardé, discret une fois l'étape passée ;
 * - `data-sort="q"` : le calque s'efface à cette progression ;
 * - `data-legende` : cartouche affiché SEULEMENT pendant son étape ;
 * - `data-engin` : objet qui se déplace le long de `data-chemin` (décalages, du départ à la place
 *   finale), selon `data-cles` (« q:s », s de 0 à 1) et l'opacité `data-opac`.
 *
 * `fixe` (repli sans animation) : l'état final seul, sans bouchon, outils ni cartouches.
 * Aucune cote, aucune distance, aucune durée : rien qui ne se vérifie sur place.
 */

type V2 = [number, number]
type Cote = 'haut' | 'bas' | 'gauche' | 'droite'

const r1 = (v: number) => String(Math.round(v * 10) / 10)
const plat = (pts: V2[], ferme = false) => `M${pts.map(([a, b]) => `${r1(a)} ${r1(b)}`).join('L')}${ferme ? 'Z' : ''}`

const ENCRE = '#1A1F21'
const MIEL = '#FCD680'
const FOND_CARTOUCHE = '#FFF8EA'
const EAU = '#4FA3C7'
const EAU_CLAIRE = '#8FD0EA'
const CABLE = '#F08A24'
const TUYAU = { bord: '#5E676A', creux: '#273033' }
const JAUMONT = { fond: '#D6AA52', joint: '#B98B38', clair: '#E7C47A', ombre: '#B48635', taille: '#E9CB8A' }

/* ── Repères (unités du dessin) ── */
const SOL = 470
const COL = 728 // colonne de chute, contre le mur côté rue
const REG = { g: 928, d: 1004, int: [940, 992] as V2, fond: 612 } // regard du jardin
const EGOUT = { cx: 1410, cy: 724 }
const BOUCHON: V2 = [850, 568]
/** Hauteur du collecteur (jardin) à l'abscisse x, du pied de la colonne au regard. */
const fil = (x: number) => 547 + (x - 752) * (41 / 188)

/** Zones toujours entières à l'écran : ordinateur, puis téléphone et tablette. */
export const CADRE = { x: 280, y: 16, w: 1280, h: 824 }
export const CADRE_MOBILE = { x: 560, y: 150, w: 940, h: 700 }

/* ── Cartouches (mesures en pixels d'écran ; le groupe est mis à l'échelle par `--kc`) ── */
export const CARTOUCHE = { corps: 12.5, padG: 9, padD: 9, haut: 25 }
export const placerCartouche = (cote: string, w: number, h: number): V2 => [
  cote === 'gauche' ? -w : cote === 'droite' ? 0 : -w / 2,
  cote === 'haut' ? -h : cote === 'bas' ? 0 : -h / 2,
]

/** Épaisseur en pixels d'écran, quel que soit le cadrage. */
const px = (n: number) => ({ strokeWidth: `calc(var(--k, 1) * ${n}px)` })

/** Trait miel cerné d'encre : les deux chemins ont la même longueur et se tracent ensemble. */
function Miel({ d, l = 3 }: { d: string; l?: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={ENCRE} strokeOpacity="0.78" strokeLinecap="round" strokeLinejoin="round" style={px(l + 2.4)} />
      <path d={d} fill="none" stroke={MIEL} strokeLinecap="round" strokeLinejoin="round" style={px(l)} />
    </>
  )
}

/** Étiquette d'étape : pastille miel sur l'objet, filet miel jusqu'au cartouche crème. */
function Etiquette({ pas, debut, sort, point, bout, cote, texte }: { pas: number; debut: number; sort?: number; point: V2; bout: V2; cote: Cote; texte: string }) {
  const h = CARTOUCHE.haut
  const w = Math.round(texte.length * 7 + CARTOUCHE.padG + CARTOUCHE.padD)
  const [bx, by] = placerCartouche(cote, w, h)
  const echelle = (p: V2) => ({ transform: `translate(${r1(p[0])}px, ${r1(p[1])}px) scale(var(--kc, var(--k, 1)))` })
  return (
    <g data-pas={pas} data-debut={debut} data-duree="0.12" data-sort={sort} data-legende="">
      <Miel d={plat([point, bout])} l={2.2} />
      <g style={echelle(point)}>
        <circle r="5.2" fill={MIEL} stroke={ENCRE} strokeWidth="1.5" />
        <circle r="1.6" fill={ENCRE} />
      </g>
      <g data-cartouche="" data-x={r1(bout[0])} data-y={r1(bout[1])} data-cote={cote} style={echelle(bout)}>
        <g data-boite="" transform={`translate(${r1(bx)} ${r1(by)})`}>
          <rect x="2" y="2.5" width={w} height={h} rx="2" fill={ENCRE} fillOpacity="0.24" />
          <rect width={w} height={h} rx="2" fill={FOND_CARTOUCHE} stroke={ENCRE} strokeWidth="1.25" />
          <text x={CARTOUCHE.padG} y={h / 2 + 4.3} fill={ENCRE} fontWeight="600" fontFamily="var(--font-inter), ui-sans-serif, system-ui" fontSize={CARTOUCHE.corps}>
            {texte}
          </text>
        </g>
      </g>
    </g>
  )
}

/** Tuyau en coupe : paroi grise, intérieur sombre (l'eau s'y dessine par-dessus). */
function Tuyau({ d, l = 20 }: { d: string; l?: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={TUYAU.bord} strokeWidth={l} strokeLinecap="butt" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={TUYAU.creux} strokeWidth={l - 7} strokeLinecap="butt" strokeLinejoin="round" />
    </>
  )
}

/* ── Les chemins de l'eau et des outils ── */
const D_COLONNE = `M704 268H${COL}V522Q${COL} 546 752 547`
const D_COLLECTEUR = `M752 547L${REG.int[0]} ${r1(fil(REG.int[0]))}`
const D_EVIER = `M665 440V452H${COL}`
const D_BRANCHEMENT = `M${REG.d} 598L1362 690`
/** L'eau qui remonte, tracée depuis le bouchon vers le WC et l'évier. */
const D_REMONTE = `M${BOUCHON[0] - 14} ${r1(fil(BOUCHON[0] - 14))}L752 547Q${COL} 546 ${COL} 522V268H704`
const D_REMONTE_EVIER = `M${COL} 452H665V440`
/** L'écoulement rétabli, du WC jusqu'à l'égout. */
const D_ECOULEMENT = `${D_COLONNE}L${REG.int[0]} ${r1(fil(REG.int[0]))}L966 594L${REG.d} 598L1366 694`
/** Câble de la caméra : de la mallette sur le trottoir, dans le regard, puis dans le tuyau. */
const D_CABLE = `M1122 458C1088 468 1046 468 1004 468Q968 468 966 486V574Q966 586 952 586L${BOUCHON[0] + 32} ${r1(fil(BOUCHON[0] + 32))}`
const D_CABLE_2 = `M1122 458C1088 468 1046 468 1004 468Q968 468 966 486V574Q966 586 952 586L${800} ${r1(fil(800))}`
/** Flexible haute pression : du dévidoir du camion, dans le regard, jusqu'au bouchon. */
const D_FLEXIBLE = `M1214 420C1180 426 1160 470 1112 470L1006 470Q972 470 971 490V576Q971 590 956 590L${BOUCHON[0] + 28} ${r1(fil(BOUCHON[0] + 28) + 2)}`

/* ── Pièces du décor ── */

/** Maison voisine, au loin à gauche : crépi clair, toit d'ardoise. */
function Voisine() {
  return (
    <g>
      <path d="M-120 470V214L10 132L140 214V470Z" fill="#E6DCC8" />
      <path d="M-132 220L10 128L152 220" fill="none" stroke="#5C6670" strokeWidth="14" strokeLinejoin="round" />
      <rect x="-80" y="250" width="40" height="66" fill="#AFC6CF" stroke="#CFC2A8" strokeWidth="6" />
      <rect x="40" y="250" width="40" height="66" fill="#AFC6CF" stroke="#CFC2A8" strokeWidth="6" />
      <rect x="-80" y="356" width="40" height="66" fill="#AFC6CF" stroke="#CFC2A8" strokeWidth="6" />
      <rect x="40" y="356" width="40" height="84" fill="#7D8C93" stroke="#CFC2A8" strokeWidth="6" />
      <path d="M150 470V300H262V470Z" fill="#DCD0B8" />
      <path d="M144 304L206 262L268 304" fill="none" stroke="#5C6670" strokeWidth="12" strokeLinejoin="round" />
      <rect x="186" y="380" width="40" height="90" fill="#8C9BA6" />
    </g>
  )
}

/** La cathédrale Saint-Étienne, silhouette pâle au loin, derrière le jardin. */
function Cathedrale() {
  return (
    <g fill="#BACBD1" opacity="0.85">
      {/* Nef haute et son toit raide */}
      <path d="M880 470V330L900 300H1040L1060 330V470Z" />
      <path d="M896 302L970 252L1044 302Z" />
      {/* Arcs-boutants et pinacles */}
      {[884, 912, 940, 968, 996, 1024, 1052].map((x) => (
        <path key={x} d={`M${x} 470V318L${x + 3} 300L${x + 6} 318V470Z`} />
      ))}
      {/* Tour de Mutte, à gauche, et sa flèche ajourée */}
      <path d="M846 470V262H882V470Z" />
      <path d="M846 262L864 196L882 262Z" />
      <path d="M861 196L864 170L867 196Z" />
      {/* Tour du Chapitre */}
      <path d="M1060 470V292H1088V470Z" />
      <path d="M1058 292L1074 268L1090 292Z" />
    </g>
  )
}

/** La maison messine : pignon en pierre de Jaumont, écorché à droite. */
function Maison() {
  // Bord de l'écorché (pierres arrachées), de la toiture au sol.
  const bord: V2[] = [
    [566, 51], [552, 78], [562, 104], [546, 132], [556, 152], [540, 176], [552, 204], [536, 232], [548, 258],
    [534, 284], [546, 310], [530, 336], [542, 364], [528, 392], [540, 420], [526, 446], [534, SOL],
  ]
  const toitInt = (x: number) => 36 + (x - 535) * (114 / 235)
  const cavite = `M${bord.map(([a, b]) => `${a} ${b}`).join('L')}L740 ${SOL}L740 ${r1(toitInt(740))}Z`
  return (
    <g>
      <defs>
        <pattern id="mm-jaumont" width="56" height="26" patternUnits="userSpaceOnUse">
          <rect width="56" height="26" fill={JAUMONT.fond} />
          <rect x="2" y="2" width="24" height="10" fill={JAUMONT.clair} opacity="0.35" />
          <rect x="30" y="15" width="22" height="9" fill={JAUMONT.ombre} opacity="0.28" />
          <path d="M0 13H56M0 0H56M28 0V13M0 13V26M42 13V26M14 13V26" stroke={JAUMONT.joint} strokeWidth="1.4" opacity="0.7" />
        </pattern>
        <pattern id="mm-coupe" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="10" height="10" fill="#C9A35A" />
          <path d="M0 0V10" stroke="#9C7A36" strokeWidth="2" />
        </pattern>
        <pattern id="mm-dalle" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="9" height="9" fill="#C3B9A8" />
          <path d="M0 0V9" stroke="#A39884" strokeWidth="1.6" />
        </pattern>
        <pattern id="mm-faience" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#E3EEEE" />
          <path d="M0 0H16M0 0V16" stroke="#C3D4D5" strokeWidth="1.2" />
        </pattern>
        <pattern id="mm-credence" width="14" height="10" patternUnits="userSpaceOnUse">
          <rect width="14" height="10" fill="#EFE9DE" />
          <path d="M0 0H14M0 0V10" stroke="#D6CDBC" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Fondations sous les murs */}
      <rect x="290" y={SOL} width="44" height="92" fill="#B9B1A3" />
      <rect x="730" y={SOL} width="58" height="96" fill="#B9B1A3" />
      <path d="M290 562H334M730 566H788" stroke="#9A9283" strokeWidth="3" />

      {/* Pignon en pierre de Jaumont */}
      <path d={`M300 ${SOL}V150L535 36L770 150V${SOL}Z`} fill="url(#mm-jaumont)" />
      {/* Chaînes d'angle en pierre de taille */}
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={i % 2 ? 300 : 300} y={160 + i * 26} width={i % 2 ? 26 : 40} height="25" fill={JAUMONT.taille} stroke={JAUMONT.joint} strokeWidth="1.2" />
      ))}
      {/* Soubassement et bandeau d'étage */}
      <rect x="300" y="444" width="240" height="26" fill={JAUMONT.ombre} />
      <rect x="300" y="282" width="244" height="12" fill={JAUMONT.taille} />
      {/* Fenêtres à encadrement de pierre et volets gris, comme dans les rues de Metz */}
      {[176, 334].map((y) => (
        <g key={y}>
          <rect x="324" y={y} width="28" height="92" fill="#8C9BA6" />
          <rect x="420" y={y} width="28" height="92" fill="#8C9BA6" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
            <path key={k} d={`M326 ${y + 8 + k * 11}H350M422 ${y + 8 + k * 11}H446`} stroke="#71808B" strokeWidth="2" />
          ))}
          <rect x="350" y={y - 8} width="72" height="108" fill={JAUMONT.taille} />
          <rect x="360" y={y} width="52" height="92" fill="#9FC2CE" />
          <path d={`M362 ${y + 4}L380 ${y + 4}L366 ${y + 40}Z`} fill="#D8EBF1" opacity="0.7" />
          <path d={`M386 ${y}V${y + 92}M360 ${y + 34}H412`} stroke="#F4F2EC" strokeWidth="4" />
          <rect x="356" y={y} width="60" height="92" fill="none" stroke="#F4F2EC" strokeWidth="4" />
          <rect x="346" y={y + 96} width="80" height="8" fill={JAUMONT.clair} />
        </g>
      ))}
      {/* Oculus du grenier */}
      <circle cx="430" cy="102" r="17" fill={JAUMONT.taille} />
      <circle cx="430" cy="102" r="10" fill="#7F99A3" />

      {/* ── L'écorché : l'intérieur à droite ── */}
      <path d={cavite} fill="#E8DDCB" />
      <clipPath id="mm-interieur">
        <path d={cavite} />
      </clipPath>
      <g clipPath="url(#mm-interieur)">
        {/* Grenier et charpente */}
        <rect x="520" y="30" width="230" height="122" fill="#E2D6C2" />
        {[590, 650, 710].map((x) => (
          <path key={x} d={`M${x} ${r1(toitInt(x))}V150`} stroke="#9A7046" strokeWidth="7" />
        ))}
        <path d={`M560 ${r1(toitInt(560) + 8)}L740 ${r1(toitInt(740) + 8)}`} stroke="#8C6239" strokeWidth="9" />
        <rect x="520" y="146" width="230" height="8" fill="#8C6239" />

        {/* Salle de bain, à l'étage */}
        <rect x="520" y="154" width="230" height="130" fill="#F4EEE4" />
        <rect x="520" y="214" width="230" height="70" fill="url(#mm-faience)" />
        <rect x="584" y="166" width="34" height="40" rx="2" fill="#CFE0E6" stroke="#B9C4C6" strokeWidth="2" />
        <path d="M576 222H626V228Q626 240 610 242H592Q576 240 576 228Z" fill="#FBFBF9" stroke="#C2C8CA" strokeWidth="2" />
        <rect x="596" y="242" width="10" height="38" fill="#F1F1EE" stroke="#C2C8CA" strokeWidth="2" />
        <path d="M601 222V212H609" fill="none" stroke="#9AA4A8" strokeWidth="3" strokeLinecap="round" />
        <rect x="548" y="176" width="4" height="40" fill="#9AA4A8" />
        <rect x="540" y="182" width="20" height="30" fill="#7FB7B3" opacity="0.9" />
        {/* WC posé contre le mur, son réservoir, sa sortie vers la colonne */}
        <rect x="700" y="194" width="22" height="52" rx="3" fill="#FAFAF8" stroke="#C2C8CA" strokeWidth="2" />
        <rect x="704" y="188" width="14" height="6" rx="1" fill="#DADFE1" />
        <path d="M646 246H714V252Q712 262 704 266L700 284H672L668 274Q648 270 646 252Z" fill="#FAFAF8" stroke="#C2C8CA" strokeWidth="2" />
        <path d="M654 252Q656 266 672 268H688Q694 266 698 252Z" fill="#E1E7E9" />
        <path d="M676 262H690L688 267H678Z" fill={EAU} />
        <rect x="642" y="241" width="76" height="6" rx="2" fill="#F1F1EE" stroke="#C2C8CA" strokeWidth="1.5" />
        <rect x="520" y="280" width="230" height="4" fill="#D9D4CB" />

        {/* Plancher de l'étage, en coupe */}
        <rect x="520" y="284" width="230" height="16" fill="url(#mm-dalle)" />

        {/* Cuisine, au rez-de-chaussée */}
        <rect x="520" y="300" width="230" height="170" fill="#F3E9D7" />
        <rect x="580" y="362" width="148" height="52" fill="url(#mm-credence)" />
        <rect x="600" y="318" width="112" height="42" fill="#E2C9A4" stroke="#C9AE86" strokeWidth="2" />
        <path d="M656 318V360" stroke="#C9AE86" strokeWidth="2" />
        <path d="M560 300V328" stroke="#5E676A" strokeWidth="2" />
        <path d="M548 328H572L566 340H554Z" fill="#2F5F66" />
        <rect x="586" y="422" width="132" height="44" fill="#D3A574" stroke="#B88B5C" strokeWidth="2" />
        <path d="M630 422V466M674 422V466" stroke="#B88B5C" strokeWidth="2" />
        <path d="M622 434V444M638 434V444M682 434V444" stroke="#7C5A36" strokeWidth="3" strokeLinecap="round" />
        <rect x="586" y="464" width="132" height="6" fill="#5A4632" />
        <path d="M640 422H690V436Q690 442 684 442H646Q640 442 640 436Z" fill="#BFC5C7" stroke="#9AA2A5" strokeWidth="2" />
        <rect x="578" y="414" width="148" height="8" fill="#3B4244" />
        <path d="M660 414V396Q660 388 668 388H674" fill="none" stroke="#9AA4A8" strokeWidth="4" strokeLinecap="round" />
        <rect x="520" y="466" width="230" height="4" fill="#B48A5A" />
      </g>
      {/* Ombre portée dans l'écorché et pierres arrachées au bord */}
      <path d={plat(bord)} fill="none" stroke="#7A5A22" strokeOpacity="0.35" strokeWidth="10" transform="translate(6 0)" />
      <path d={plat(bord)} fill="none" stroke={JAUMONT.taille} strokeWidth="7" strokeLinejoin="round" />

      {/* Mur côté rue, en coupe : fenêtre à l'étage, porte au rez-de-chaussée */}
      <path d={`M740 ${r1(toitInt(740))}L770 150V${SOL}H740Z`} fill="url(#mm-coupe)" />
      <rect x="740" y="186" width="30" height="66" fill="#E8DDCB" />
      <path d="M755 186V252" stroke="#9FC2CE" strokeWidth="5" />
      <rect x="736" y="252" width="38" height="7" fill={JAUMONT.taille} />
      <rect x="740" y="360" width="30" height="110" fill="#E8DDCB" />
      <rect x="752" y="362" width="7" height="108" fill="#6B7C80" />

      {/* Dalle du rez-de-chaussée et hérisson, en coupe */}
      <rect x="300" y={SOL} width="470" height="22" fill="url(#mm-dalle)" />
      <rect x="300" y={SOL + 22} width="470" height="12" fill="#A79F92" />

      {/* Toiture en tuiles rouges et cheminée */}
      <rect x="640" y="40" width="26" height="54" fill={JAUMONT.ombre} />
      <rect x="636" y="34" width="34" height="8" fill={JAUMONT.taille} />
      <path d="M266 164L535 26L804 164" fill="none" stroke="#8E3B28" strokeWidth="22" strokeLinejoin="round" />
      <path d="M266 164L535 26L804 164" fill="none" stroke="#B9553A" strokeWidth="14" strokeLinejoin="round" />
      <path d="M266 164L535 26L804 164" fill="none" stroke="#D06C4E" strokeWidth="14" strokeDasharray="4 10" strokeLinejoin="round" />
    </g>
  )
}

/** Le camion hydrocureur, dessiné à sa place de stationnement (il arrive de la droite). */
function Camion() {
  return (
    <g>
      <ellipse cx="1362" cy="472" rx="176" ry="5" fill="#000" opacity="0.18" />
      {/* Châssis */}
      <rect x="1196" y="422" width="332" height="30" rx="2" fill="#3A4246" />
      {/* Citerne */}
      <rect x="1212" y="342" width="214" height="84" rx="34" fill="#F2F2EE" stroke="#C9CDCB" strokeWidth="2.5" />
      <rect x="1212" y="392" width="214" height="11" fill="#0C666E" />
      <rect x="1212" y="406" width="214" height="3" fill="#D93B28" />
      <text x="1319" y="380" textAnchor="middle" fontFamily="var(--font-fraunces), Georgia, serif" fontSize="19" fontWeight="600" fill="#0C666E">
        SOS Débouchage
      </text>
      {/* Cabine */}
      <path d="M1430 448V350H1494L1528 392V448Z" fill="#F7F7F4" stroke="#C9CDCB" strokeWidth="2.5" />
      <path d="M1440 360H1490L1516 392H1440Z" fill="#A9C9D4" />
      <path d="M1446 364L1462 364L1446 386Z" fill="#DCEDF2" opacity="0.8" />
      <path d="M1470 398V444" stroke="#C9CDCB" strokeWidth="2" />
      <rect x="1476" y="406" width="12" height="4" rx="1" fill="#8E979B" />
      <rect x="1520" y="414" width="9" height="12" rx="2" fill="#FFE7A3" />
      <rect x="1431" y="366" width="6" height="22" fill="#3A4246" />
      <rect x="1436" y="340" width="20" height="6" rx="1" fill="#F0A13A" />
      {/* Dévidoir du flexible, à l'arrière */}
      <rect x="1188" y="372" width="10" height="56" fill="#6F7A7E" />
      <circle cx="1214" cy="396" r="30" fill="#6F7A7E" />
      <circle cx="1214" cy="396" r="25" fill="#2B3336" />
      <circle cx="1214" cy="396" r="18" fill="none" stroke="#3E484C" strokeWidth="3" />
      <circle cx="1214" cy="396" r="11" fill="none" stroke="#3E484C" strokeWidth="3" />
      <circle cx="1214" cy="396" r="5" fill="#B9C0C3" />
      <rect x="1196" y="430" width="8" height="10" fill="#D93B28" />
      {/* Roues */}
      {[1262, 1468].map((x) => (
        <g key={x}>
          <circle cx={x} cy="450" r="22" fill="#22282B" />
          <circle cx={x} cy="450" r="10" fill="#B9C0C3" />
          <circle cx={x} cy="450" r="3.5" fill="#22282B" />
        </g>
      ))}
    </g>
  )
}

/** La mallette caméra, posée sur le trottoir, écran ouvert sur l'image du tuyau. */
function Mallette({ bouchon }: { bouchon: boolean }) {
  return (
    <g>
      <rect x="1114" y="448" width="56" height="20" rx="2" fill="#2B3033" />
      <rect x="1136" y="452" width="12" height="3" rx="1" fill="#5D6569" />
      <path d="M1116 450L1110 400H1166L1168 450Z" fill="#2B3033" />
      <path d="M1118 444L1114 406H1162L1163 444Z" fill="#11181A" />
      <circle cx="1139" cy="425" r="14" fill="none" stroke="#6B767A" strokeWidth="3" />
      <circle cx="1139" cy="425" r="7" fill="#1D2629" />
      {bouchon ? (
        <path d="M1131 428Q1133 418 1141 419Q1150 420 1148 429Q1144 434 1136 433Z" fill="#E6DCC6" />
      ) : (
        <path d="M1133 431Q1139 433 1146 430" stroke={EAU_CLAIRE} strokeWidth="2.5" fill="none" />
      )}
    </g>
  )
}

/** Bouchon de lingettes et de graisse, froissé dans le tuyau. */
function Bouchon() {
  const [x, y] = BOUCHON
  return (
    <g transform={`translate(${x} ${y}) rotate(12.3) scale(1.45)`}>
      <path d="M-20 -5Q-16 -8 -8 -6Q0 -9 8 -5Q16 -8 20 -3L19 4Q12 7 4 5Q-4 8 -12 5Q-18 6 -21 2Z" fill="#E6DCC6" />
      <path d="M-14 -3Q-8 0 -2 -3Q4 1 12 -2" stroke="#C7B898" strokeWidth="1.6" fill="none" />
      <path d="M-10 3Q-2 1 6 4" stroke="#BFAF8C" strokeWidth="1.4" fill="none" />
      <circle cx="-20" cy="-1" r="2.6" fill="#D4C7A8" />
    </g>
  )
}

/** Tête de caméra orientée vers l'amont du tuyau, son faisceau de lumière devant elle. */
function TeteCamera() {
  return (
    <g transform="rotate(12.3) scale(1.7)">
      <path d="M-4 0L-30 -6V6Z" fill="#FFF3C4" opacity="0.75" />
      <rect x="-4" y="-4" width="16" height="8" rx="2" fill="#C9D0D3" stroke="#7D898E" strokeWidth="1.5" />
      <circle cx="-4" cy="0" r="2.4" fill="#FFF3C4" />
    </g>
  )
}

function MaisonMessine({ className, fixe = false }: { className?: string; fixe?: boolean }) {
  return (
    <svg
      viewBox={`${CADRE.x} ${CADRE.y} ${CADRE.w} ${CADRE.h}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Coupe d'une maison messine en pierre de Jaumont : le tuyau du WC descend sous le jardin jusqu'au regard, puis rejoint l'égout sous la rue, où se gare le camion hydrocureur."
    >
      <defs>
        <linearGradient id="mm-ciel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9DFE8" />
          <stop offset="1" stopColor="#EEF2E8" />
        </linearGradient>
        <pattern id="mm-terre" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#7A5A3B" />
          <circle cx="8" cy="10" r="2.2" fill="#5E4128" />
          <circle cx="28" cy="6" r="1.6" fill="#93734F" />
          <circle cx="20" cy="26" r="2.6" fill="#64472D" />
          <circle cx="34" cy="32" r="1.8" fill="#93734F" />
          <circle cx="6" cy="34" r="1.4" fill="#5E4128" />
        </pattern>
        <pattern id="mm-grave" width="18" height="12" patternUnits="userSpaceOnUse">
          <rect width="18" height="12" fill="#A39A8C" />
          <circle cx="4" cy="4" r="2" fill="#8C8374" />
          <circle cx="13" cy="8" r="2.4" fill="#B8AFA1" />
        </pattern>
      </defs>

      {/* Ciel, nuages */}
      <rect x="-700" y="-700" width="3200" height={700 + SOL} fill="url(#mm-ciel)" />
      <g fill="#FFFFFF" opacity="0.75">
        <ellipse cx="760" cy="230" rx="70" ry="16" />
        <ellipse cx="800" cy="216" rx="44" ry="18" />
        <ellipse cx="1290" cy="150" rx="90" ry="18" />
        <ellipse cx="1330" cy="134" rx="52" ry="20" />
      </g>
      <Cathedrale />
      <Voisine />

      {/* Sous-sol : terre du jardin, couches de la chaussée */}
      <rect x="-700" y={SOL} width="3200" height="900" fill="url(#mm-terre)" />
      <rect x="-700" y={SOL} width="1888" height="34" fill="#5E4027" />
      {/* Couches du sous-sol et quelques cailloux, pour que la terre ne soit pas un aplat */}
      <path d="M-700 668Q-200 650 300 672T1300 664T2500 676V720Q1900 708 1300 714T300 718T-700 712Z" fill="#6A4C30" opacity="0.55" />
      <path d="M-700 790Q0 776 700 796T2500 788V820Q1600 812 700 826T-700 818Z" fill="#6A4C30" opacity="0.45" />
      {[[420, 620, 9, 6], [610, 700, 7, 5], [1080, 700, 10, 6], [1240, 610, 8, 5], [520, 770, 11, 7], [1540, 640, 9, 6], [960, 790, 8, 5], [760, 640, 6, 4], [1180, 780, 7, 5]].map(([x, y, rx, ry]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={rx} ry={ry} fill="#A08463" />
      ))}
      <rect x="1188" y={SOL} width="1400" height="16" fill="#41484C" />
      <rect x="1188" y={SOL + 16} width="1400" height="38" fill="url(#mm-grave)" />
      <rect x="1108" y={SOL} width="80" height="24" fill="url(#mm-grave)" />

      {/* Jardin : pelouse, hortensias, érable, muret et grille */}
      <rect x="-700" y={SOL - 6} width="1808" height="10" fill="#6E9A45" />
      <path
        d={Array.from({ length: 90 }, (_, i) => `M${-80 + i * 13} ${SOL - 5}l3 -8l3 8`).join('')}
        fill="none"
        stroke="#83B356"
        strokeWidth="2"
      />
      <g>
        <circle cx="800" cy="446" r="20" fill="#5E8C3E" />
        <circle cx="822" cy="440" r="17" fill="#6E9A45" />
        <circle cx="796" cy="436" r="7" fill="#9DB6E0" />
        <circle cx="816" cy="430" r="7" fill="#B7A6DC" />
        <circle cx="830" cy="442" r="6" fill="#9DB6E0" />
      </g>
      <g>
        <path d="M1050 470V392" stroke="#6B4A2E" strokeWidth="8" />
        <path d="M1050 420L1032 400M1050 408L1068 390" stroke="#6B4A2E" strokeWidth="4" />
        <circle cx="1030" cy="378" r="26" fill="#A8432F" />
        <circle cx="1066" cy="372" r="28" fill="#B9553A" />
        <circle cx="1048" cy="350" r="26" fill="#C4623F" />
      </g>
      <rect x="1088" y="436" width="20" height="34" fill={JAUMONT.fond} />
      <rect x="1084" y="430" width="28" height="8" fill={JAUMONT.taille} />
      <path d="M1092 430V392M1098 430V392M1104 430V392" stroke="#39403F" strokeWidth="2.5" />
      <path d="M1090 396H1106" stroke="#39403F" strokeWidth="3" />

      {/* Trottoir, bordure, rue */}
      <rect x="1108" y={SOL - 4} width="80" height="6" fill="#CFC6B6" />
      <rect x="1176" y={SOL - 8} width="12" height="22" fill="#9C9A94" />
      <rect x="1188" y={SOL - 2} width="1400" height="4" fill="#545B5F" />
      <path d="M1640 470V250H1900V470Z" fill="#E4D6BC" />
      <rect x="1680" y="300" width="40" height="70" fill="#AFC6CF" stroke="#CFC2A8" strokeWidth="6" />
      <rect x="1780" y="300" width="40" height="70" fill="#AFC6CF" stroke="#CFC2A8" strokeWidth="6" />

      {/* L'égout sous la chaussée, ovoïde en béton */}
      <ellipse cx={EGOUT.cx} cy={EGOUT.cy} rx="66" ry="84" fill="#B4AFA5" stroke="#8E887D" strokeWidth="3" />
      <ellipse cx={EGOUT.cx} cy={EGOUT.cy} rx="51" ry="69" fill="#2C373B" />
      <path d={`M${EGOUT.cx - 44} ${EGOUT.cy + 34}Q${EGOUT.cx} ${EGOUT.cy + 30} ${EGOUT.cx + 44} ${EGOUT.cy + 34}Q${EGOUT.cx + 34} ${EGOUT.cy + 68} ${EGOUT.cx} ${EGOUT.cy + 69}Q${EGOUT.cx - 34} ${EGOUT.cy + 68} ${EGOUT.cx - 44} ${EGOUT.cy + 34}Z`} fill="#3F8FB5" />
      <path d={`M${EGOUT.cx - 40} ${EGOUT.cy + 34}Q${EGOUT.cx} ${EGOUT.cy + 30} ${EGOUT.cx + 40} ${EGOUT.cy + 34}`} fill="none" stroke={EAU_CLAIRE} strokeWidth="2.5" />

      <Maison />

      {/* Le regard du jardin, en coupe */}
      <rect x={REG.g} y={SOL} width={REG.d - REG.g} height={REG.fond + 14 - SOL} fill="#B9B3A7" />
      <rect x={REG.int[0]} y={SOL} width={REG.int[1] - REG.int[0]} height={REG.fond - SOL} fill="#2A3133" />
      {[500, 530, 560].map((y) => (
        <path key={y} d={`M${REG.int[1] - 2} ${y}h-10v6`} fill="none" stroke="#8E979B" strokeWidth="2.5" />
      ))}
      <path d={`M${REG.int[0]} ${REG.fond - 8}H${REG.int[1]}V${REG.fond}H${REG.int[0]}Z`} fill={EAU} opacity="0.8" />

      {/* Le réseau : colonne, évier, collecteur sous le jardin, branchement vers l'égout */}
      <Tuyau d={D_EVIER} l={14} />
      <Tuyau d={D_COLONNE} l={24} />
      <Tuyau d={D_COLLECTEUR} l={26} />
      <Tuyau d={D_BRANCHEMENT} l={26} />
      <circle cx="758" cy="548" r="15" fill="none" stroke="#9A9283" strokeWidth="3" />

      {/* Le tampon du regard : il s'ouvre pour la caméra et se referme à la fin */}
      <g data-engin="" data-chemin="0 0, -34 -26, -92 -4" data-cles="2.05:0 2.3:1 4.72:1 4.95:0">
        <rect x={REG.g - 4} y={SOL - 7} width={REG.d - REG.g + 8} height="9" rx="1.5" fill="#4B5154" />
        <path d={`M${REG.g + 6} ${SOL - 3}H${REG.d - 6}`} stroke="#6B7276" strokeWidth="2" strokeDasharray="6 5" />
      </g>

      {/* L'écoulement rétabli (étape 4), qui reste à la fin */}
      <g data-pas="4" data-debut="0.55" data-duree="0.4">
        <path d={D_ECOULEMENT} fill="none" stroke={EAU_CLAIRE} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Le camion arrive de la droite à l'étape 2 (dessiné à sa place dans le repli) */}
      <g data-engin="" data-chemin="560 0, 0 0" data-cles="1.08:0 1.62:1" data-opac="1.05:0 1.1:1">
        <Camion />
      </g>

      {!fixe && (
        <>
          {/* ── 1. L'appel : l'eau remonte derrière le bouchon, le téléphone sonne ── */}
          <g data-pas="1" data-debut="0" data-pose="" data-sort="3.5">
            <Bouchon />
          </g>
          <g data-pas="1" data-debut="0.12" data-duree="0.45" data-sort="3.56">
            <path d={D_REMONTE} fill="none" stroke={EAU} strokeWidth="13" strokeLinejoin="round" />
            <path d={D_REMONTE_EVIER} fill="none" stroke={EAU} strokeWidth="6" strokeLinejoin="round" />
          </g>
          <g data-pas="1" data-debut="0.5" data-pose="" data-sort="3.6">
            <path d="M654 252Q656 266 672 268H688Q694 266 698 252Z" fill={EAU} />
            <path d="M642 448V422H690V448Z" fill="none" />
            <path d="M642 424H688V434Q688 440 682 440H648Q642 440 642 434Z" fill={EAU} opacity="0.9" />
          </g>
          <g data-pas="1" data-debut="0.05" data-pose="" data-sort="1.04">
            <g transform="translate(605 414) scale(1.8) translate(-605 -414)">
              <rect x="598" y="394" width="14" height="22" rx="2.5" fill="#1D2427" />
              <rect x="600" y="397" width="10" height="15" rx="1" fill="#6FB7C9" />
              <path className="mm-onde" d="M618 398Q624 405 618 412M624 394Q633 405 624 416" fill="none" stroke="#D93B28" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </g>
          <Etiquette pas={1} debut={0.2} point={[BOUCHON[0], BOUCHON[1]]} bout={[892, 676]} cote="bas" texte="Le bouchon" />
          <Etiquette pas={1} debut={0.55} point={[676, 256]} bout={[612, 190]} cote="gauche" texte="L'eau remonte dans le WC" />
          <Etiquette pas={1} debut={0.3} point={[606, 400]} bout={[872, 336]} cote="droite" texte="Prix annoncé au téléphone" />

          {/* ── 2. Le camion hydrocureur arrive de la droite et se gare ── */}
          <Etiquette pas={2} debut={0.62} point={[1340, 414]} bout={[1340, 300]} cote="haut" texte="Le camion hydrocureur" />

          {/* ── 3. La caméra entre par le regard et remonte jusqu'au bouchon ── */}
          <g data-pas="3" data-debut="0.05" data-pose="" data-sort="4.9">
            <g transform="translate(1141 468) scale(1.35) translate(-1141 -468)">
              <Mallette bouchon />
            </g>
          </g>
          <g data-pas="3" data-debut="0.22" data-duree="0.38" data-sort="3.02">
            <path d={D_CABLE} fill="none" stroke={CABLE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g data-engin="" data-chemin={`${966 - BOUCHON[0] - 32} 11, 0 0`} data-cles="2.5:0 2.62:1" data-opac="2.47:0 2.5:1 3.0:1 3.04:0">
            <g transform={`translate(${BOUCHON[0] + 32} ${r1(fil(BOUCHON[0] + 32))})`}>
              <TeteCamera />
            </g>
          </g>
          <Etiquette pas={3} debut={0.66} point={[BOUCHON[0] + 32, fil(BOUCHON[0] + 32)]} bout={[920, 680]} cote="bas" texte="La caméra dans le tuyau" />
          <Etiquette pas={3} debut={0.4} point={[1139, 432]} bout={[1139, 330]} cote="haut" texte="L'image en direct" />

          {/* ── 4. Le jet haute pression découpe le bouchon, l'eau repart ── */}
          <g data-pas="4" data-debut="0.02" data-duree="0.34" data-sort="4.06">
            <path d={D_FLEXIBLE} fill="none" stroke="#D5DEE2" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g data-engin="" data-chemin="24 6, 0 0" data-cles="3.3:0 3.4:1" data-opac="3.28:0 3.31:1 3.92:1 3.96:0">
            <g transform={`translate(${BOUCHON[0] + 28} ${r1(fil(BOUCHON[0] + 28) + 2)}) rotate(12.3) scale(1.6)`}>
              <rect x="-2" y="-4" width="12" height="8" rx="2" fill="#7D898E" />
              <path d="M-2 -3L-26 -9M-2 0L-30 0M-2 3L-26 9M-2 -1.5L-28 -5M-2 1.5L-28 5" stroke="#E8F6FC" strokeWidth="1.8" strokeLinecap="round" className="mm-jet" />
            </g>
          </g>
          <g data-engin="" data-chemin="0 0, 90 20, 116 26, 152 28, 512 122, 540 150" data-cles="3.5:0 3.92:1" data-opac="3.48:0 3.52:1 3.86:1 3.94:0">
            <g transform={`translate(${BOUCHON[0]} ${BOUCHON[1]}) scale(1.6)`}>
              <path d="M-6 -4Q0 -7 6 -3L5 2Q0 4 -5 2Z" fill="#E6DCC6" />
              <path d="M-16 0Q-12 -3 -8 -1L-9 3Q-13 4 -16 2Z" fill="#D4C7A8" />
              <path d="M10 -1Q14 -4 18 -1L17 3Q13 4 10 2Z" fill="#E2D9C6" />
            </g>
          </g>
          <g data-pas="4" data-debut="0.72" data-duree="0.2" data-trace="">
            <Miel d="M1060 600l14 6-14 6" l={2.6} />
            <Miel d="M1170 630l14 6-14 6" l={2.6} />
            <Miel d="M1280 660l14 6-14 6" l={2.6} />
          </g>
          <Etiquette pas={4} debut={0.38} point={[BOUCHON[0] + 10, fil(BOUCHON[0] + 10)]} bout={[880, 678]} cote="bas" texte="Le jet découpe le bouchon" />
          <Etiquette pas={4} debut={0.78} point={[EGOUT.cx, EGOUT.cy + 40]} bout={[1320, 824]} cote="gauche" texte="L'eau repart à l'égout" />

          {/* ── 5. Contrôle caméra, regard refermé ── */}
          <g data-pas="5" data-debut="0.04" data-duree="0.28" data-sort="4.78">
            <path d={D_CABLE_2} fill="none" stroke={CABLE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g data-engin="" data-chemin="166 31, 0 0" data-cles="4.3:0 4.62:1" data-opac="4.27:0 4.3:1 4.76:1 4.8:0">
            <g transform={`translate(800 ${r1(fil(800))})`}>
              <TeteCamera />
            </g>
          </g>
          <g data-pas="5" data-debut="0.55" data-pose="">
            <circle cx="868" cy="528" r="15" fill="#2E8B57" stroke="#FFFFFF" strokeWidth="3" />
            <path d="M861 528l5 5 9-10" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <Etiquette pas={5} debut={0.6} point={[868, 528]} bout={[868, 664]} cote="bas" texte="Écoulement contrôlé" />
          <Etiquette pas={5} debut={0.75} point={[966, 462]} bout={[990, 384]} cote="haut" texte="Rien n'est cassé" />
        </>
      )}

      {fixe && (
        <g>
          <circle cx="868" cy="528" r="15" fill="#2E8B57" stroke="#FFFFFF" strokeWidth="3" />
          <path d="M861 528l5 5 9-10" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      <style>{`
        @keyframes mm-onde { 0%, 100% { opacity: 0.2 } 50% { opacity: 1 } }
        .mm-onde { animation: mm-onde 0.9s ease-in-out infinite }
        @keyframes mm-jet { 0%, 100% { opacity: 0.55 } 50% { opacity: 1 } }
        .mm-jet { animation: mm-jet 0.25s linear infinite }
        @media (prefers-reduced-motion: reduce) { .mm-onde, .mm-jet { animation: none } }
      `}</style>
    </svg>
  )
}

export default memo(MaisonMessine)
