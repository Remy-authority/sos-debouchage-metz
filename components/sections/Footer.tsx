import Link from 'next/link'
import { siteConfig } from '@/config/site.config'
import { getServices, getZones } from '@/lib/content'
import Logo from '@/components/ui/Logo'

export default function Footer() {
  const services = getServices()
  const zones = getZones()
  const year = 2026

  return (
    <footer className="mb-14 bg-dark text-slate-300 md:mb-0" role="contentinfo">
      {/* Bande téléphone */}
      <div className="border-b border-white/10 bg-primary/10">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
          <p className="text-sm font-medium text-slate-300">
            {siteConfig.trade} à {siteConfig.city} · {siteConfig.availability}
          </p>
          <a
            href={`tel:${siteConfig.phone}`}
            className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-accent/20 transition hover:bg-accent/90"
            aria-label={`Appeler le ${siteConfig.phoneDisplay}`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
            </svg>
            {siteConfig.phoneDisplay}
          </a>
        </div>
      </div>

      {/* Grille nav */}
      <div className="container-site grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Identité */}
        <div>
          <Link href="/" className="inline-flex items-center" aria-label={`${siteConfig.businessName}, accueil`}>
            <Logo textColor="white" iconColor="white" accentColor="#F97316" className="h-8 w-auto" />
          </Link>
          <p className="mt-3 text-sm">{siteConfig.city} · {siteConfig.region}</p>
          <p className="mt-1 text-sm">
            <a href={`mailto:${siteConfig.email}`} className="hover:text-white transition-colors">
              {siteConfig.email}
            </a>
          </p>
          <ul className="mt-4 flex flex-wrap gap-1" role="list" aria-label="Engagements">
            {siteConfig.usps.map((u) => (
              <li key={u} className="rounded-full bg-white/5 px-2 py-0.5 text-xs">{u}</li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <nav aria-label="Services">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-300">Nos services</p>
          <ul className="space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="transition-colors hover:text-white">{s.navTitle}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Zones */}
        <nav aria-label="Zones d'intervention">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-300">Zones</p>
          <ul className="space-y-2 text-sm">
            {zones.map((z) => (
              <li key={z.slug}>
                <Link href={`/zones/${z.slug}`} className="transition-colors hover:text-white">{z.name}</Link>
              </li>
            ))}
            <li>
              <Link href="/zones" className="font-medium text-accent hover:text-white transition-colors">Toutes les zones →</Link>
            </li>
          </ul>
        </nav>

        {/* Info */}
        <nav aria-label="Informations légales">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-300">Informations</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/contact" className="transition-colors hover:text-white">Contact & devis</Link></li>
            {siteConfig.features.blog && (
              <li><Link href="/conseils" className="transition-colors hover:text-white">Conseils</Link></li>
            )}
            <li><Link href="/mentions-legales" className="transition-colors hover:text-white">Mentions légales</Link></li>
            <li><Link href="/politique-confidentialite" className="transition-colors hover:text-white">Confidentialité</Link></li>
            <li><Link href="/cgu" className="transition-colors hover:text-white">CGU</Link></li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site py-4 text-xs text-slate-400">
          © {year} {siteConfig.businessName}. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}
