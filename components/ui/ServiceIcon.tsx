/**
 * ServiceIcon, set d'icônes SVG partagé (cartes services accueil + pages services).
 *
 * `SERVICE_ICON_PATHS` (rempli, `fill="currentColor"`) est indexé sur `service.icon`
 * (content/services/*.json). `ServiceIcon` est utilisé sur les cartes de la home.
 *
 * `BLOCK_ICON_PATHS` (contour, `stroke="currentColor"`) sert aux badges des blocs H2
 * des pages services. `matchBlockIcon` associe un intitulé de bloc à une icône par
 * mots-clés, générique, réutilisable sur les prochains sites du template (N+1).
 */

/* ── Icônes pleines (cartes service) ───────────────────────────────────── */
export const SERVICE_ICON_PATHS: Record<string, string> = {
  alert: 'M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
  search: 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z',
  droplet: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z',
  tools: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  pool: 'M2 12h20M2 18h20M2 6h20',
  water: 'M4.5 12.5c3.5 0 3.5-3 7-3s3.5 3 7 3M4.5 18.5c3.5 0 3.5-3 7-3s3.5 3 7 3',
  // Ajoutés (NOU-29) : ces 3 clés étaient utilisées par content/services/*.json
  // (canalisation-enterree="pipe", encastree="wall", assechement="dry") mais absentes
  // de la table -> repli silencieux sur l'icône "search" pour ces 3 services. Corrigé.
  pipe: 'M4 14h5a3 3 0 0 0 3-3V6a3 3 0 0 1 3-3h5M4 14l3-3M4 14l3 3M20 14v4a3 3 0 0 1-3 3H7',
  wall: 'M3 4h18v6H3zM3 14h8v6H3zM13 14h8v6h-8z',
  dry: 'M9.5 2a5 5 0 0 0 3 8.5A5.5 5.5 0 1 1 4 15c0-2.5 2-4 3-6.5C8 5.5 9 4 9.5 2zM17 13a3 3 0 0 0 1.5 5.5A2.5 2.5 0 1 1 15 21c0-1.2.8-2 1.3-3',
}

export function ServiceIcon({ icon, className = 'h-5 w-5' }: { icon: string; className?: string }) {
  const d = SERVICE_ICON_PATHS[icon] ?? SERVICE_ICON_PATHS.search
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

/* ── Icônes contour (badges de bloc H2, pages services) ────────────────── */
const BLOCK_ICON_PATHS = {
  gas: 'M9 2v6.5L4 19a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3l-5-10.5V2M9 2h6M9 8.5h6',
  thermal: 'M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z',
  acoustic: 'M2 10v4M6 6v12M10 3v18M14 6v12M18 10v4M22 11v2',
  checklist: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  warning: 'M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
  map: 'M9 20l-6-3V4l6 3 6-3 6 3v13l-6-3-6 3zM9 7v13M15 4v13',
  doc: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h6M9 9h1',
  pipe: 'M4 14h5a3 3 0 0 0 3-3V6a3 3 0 0 1 3-3h5M4 14l3-3M4 14l3 3M20 14v4a3 3 0 0 1-3 3H7',
  wall: 'M3 4h18v6H3zM3 14h8v6H3zM13 14h8v6h-8z',
  floor: 'M3 4h18M3 12h18M3 20h18',
  pool: 'M2 12h20M2 18h20M2 6h20',
  dry: 'M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2',
  droplet: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z',
} as const

type BlockIconKey = keyof typeof BLOCK_ICON_PATHS

const BLOCK_ICON_RULES: [RegExp, BlockIconKey][] = [
  [/gaz traceur/i, 'gas'],
  [/thermiqu|thermographi/i, 'thermal'],
  [/acoustiqu|corrélation/i, 'acoustic'],
  [/protocole|déroulé|intervention|étape/i, 'checklist'],
  [/attendant|que faire/i, 'checklist'],
  [/signe|détrempé/i, 'warning'],
  [/zone|couvert/i, 'map'],
  [/assurance|irsi|rapport/i, 'doc'],
  [/canalisation|enterrée/i, 'pipe'],
  [/mur\b/i, 'wall'],
  [/sol\b|plancher/i, 'floor'],
  [/piscine|liner|bassin/i, 'pool'],
  [/assèchement|séchage|humidité/i, 'dry'],
]

/** Associe un intitulé de bloc (H2) à une icône par mots-clés. Repli : goutte d'eau. */
export function matchBlockIcon(heading: string): BlockIconKey {
  for (const [re, key] of BLOCK_ICON_RULES) {
    if (re.test(heading)) return key in BLOCK_ICON_PATHS ? key : 'droplet'
  }
  return 'droplet'
}

export function BlockIcon({ heading, className = 'h-5 w-5' }: { heading: string; className?: string }) {
  const key = matchBlockIcon(heading)
  const d = BLOCK_ICON_PATHS[key] ?? BLOCK_ICON_PATHS.droplet
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}
