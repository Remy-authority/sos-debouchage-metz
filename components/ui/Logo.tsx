import { siteConfig } from '@/config/site.config'

/**
 * Identité visuelle du site : un pictogramme de siphon (le coude en U sous chaque
 * évier) traversé par un filet de vermillon qui figure l'écoulement retrouvé.
 * Le bloc-marque teal reste lisible aussi bien sur le crème clair que sur le
 * pétrole sombre : un seul jeu de couleurs pour tous les fonds.
 *
 * Le pictogramme est en SVG, le nom en HTML : la typographie Fraunces du site
 * s'applique donc réellement au mot-symbole (pas de police système figée).
 */
export function LogoMark({ className = 'h-11 w-11' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <rect width="48" height="48" rx="14" className="fill-brand-600" />
      {/* Siphon : descente, coude en U, remontée. */}
      <path
        d="M14 12 V25 a10 10 0 0 0 20 0 V16"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        className="stroke-sand-50"
      />
      {/* Filet d'écoulement qui entre dans le siphon. */}
      <path
        d="M14 11 V18"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        className="stroke-accent-400"
      />
      {/* Sortie côté évacuation. */}
      <circle cx="34" cy="16" r="2.6" className="fill-accent-400" />
    </svg>
  )
}

export function Logo({
  tone = 'dark',
  className = '',
}: {
  /** `dark` : texte encre sur fond clair. `light` : texte crème sur fond sombre. */
  tone?: 'dark' | 'light'
  className?: string
}) {
  const light = tone === 'light'
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <LogoMark className="h-11 w-11 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[1.0625rem] font-medium tracking-tight ${
            light ? 'text-sand-50' : 'text-ink-950'
          }`}
        >
          SOS Débouchage
        </span>
        <span
          className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${
            light ? 'text-accent-300' : 'text-accent-600'
          }`}
        >
          {siteConfig.city} · {siteConfig.departmentName}
        </span>
      </span>
    </span>
  )
}

export default Logo
