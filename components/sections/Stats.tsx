import { siteConfig } from '@/config/site.config'

export default function Stats() {
  return (
    <div className="bg-primary" aria-label="Chiffres clés">
      <div className="container-site">
        <ul className="grid grid-cols-3 divide-x divide-white/10 py-0" role="list">
          {siteConfig.stats.map((stat) => (
            <li key={stat.label} className="flex flex-col items-center px-4 py-8 text-center">
              <span className="text-3xl font-extrabold text-white sm:text-4xl">{stat.value}</span>
              <span className="mt-1 text-xs font-medium text-white/70 sm:text-sm">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
