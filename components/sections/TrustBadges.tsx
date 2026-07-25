import { siteConfig } from '@/config/site.config'

const ICONS: Record<string, React.ReactNode> = {
  shield: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  clock: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  check: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m20 6-11 11-5-5" />
    </svg>
  ),
  star: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
}

const BADGES = [
  { icon: 'clock', label: siteConfig.availability },
  { icon: 'shield', label: 'Intervention non destructive' },
  { icon: 'check', label: 'Devis gratuit & sans engagement' },
  { icon: 'star', label: 'Artisan local indépendant' },
]

export default function TrustBadges() {
  return (
    <div className="bg-white shadow-sm">
      <div className="container-site">
        <ul
          className="grid grid-cols-2 divide-x divide-slate-100 md:grid-cols-4"
          role="list"
          aria-label="Nos engagements"
        >
          {BADGES.map((b) => (
            <li key={b.label} className="flex flex-col items-center gap-2 px-4 py-5 text-center sm:flex-row sm:text-left">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                {ICONS[b.icon]}
              </span>
              <span className="text-xs font-semibold text-slate-700 sm:text-sm">{b.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
