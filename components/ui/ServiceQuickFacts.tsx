import { BlockIcon } from './ServiceIcon'

/**
 * ServiceQuickFacts, reprend `service.bullets` (déjà utilisées sur les cartes
 * de la home) sous forme de puces iconographiées, juste sous l'intro « en bref ».
 * Aucune donnée nouvelle : casse le mur de texte avec ce qui existe déjà.
 */
export default function ServiceQuickFacts({ bullets }: { bullets: string[] }) {
  if (!bullets?.length) return null
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-3" role="list">
      {bullets.map((b) => (
        <li key={b} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BlockIcon heading={b} className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-slate-800">{b}</span>
        </li>
      ))}
    </ul>
  )
}
