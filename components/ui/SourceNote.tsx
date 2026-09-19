import { ExternalLink } from 'lucide-react'

export type Source = { label: string; url: string; date: string }

/**
 * Note de source sous un chiffre.
 *
 * Règle de la page Tarifs : aucun montant n'est affiché sans sa source publique
 * ET sa date, visibles par le lecteur. Ce composant est le seul endroit qui les
 * rend, pour qu'aucun chiffre ne puisse être posé sans passer par lui.
 */
export function SourceNote({
  items,
  className = '',
  tone = 'light',
}: {
  items: Source[]
  className?: string
  tone?: 'light' | 'dark'
}) {
  if (!items.length) return null
  const base = tone === 'dark' ? 'text-sand-400' : 'text-sand-500'
  const link = tone === 'dark' ? 'text-brand-300' : 'text-brand-600'

  return (
    <p className={`text-xs leading-relaxed ${base} ${className}`}>
      <span className="font-semibold uppercase tracking-[0.14em]">
        {items.length > 1 ? 'Sources' : 'Source'}
      </span>{' '}
      {items.map((s, i) => (
        <span key={s.url}>
          {i > 0 && ' · '}
          <a
            href={s.url}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className={`underline decoration-dotted underline-offset-2 transition-colors hover:no-underline ${link}`}
          >
            {s.label}
            <ExternalLink size={11} className="ml-1 inline-block align-[-1px]" aria-hidden="true" />
          </a>
          , {s.date}
        </span>
      ))}
    </p>
  )
}

export default SourceNote
