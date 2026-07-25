import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import PhoneButton from '@/components/ui/PhoneButton'
import { siteConfig } from '@/config/site.config'
import { getServices } from '@/lib/content'
import HeaderNavMobile from './HeaderNavMobile'

export default function Header() {
  const services = getServices()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="container-site relative flex items-center justify-between gap-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          aria-label={`${siteConfig.businessName}, accueil`}
        >
          {/* Logo inline SVG, texte sombre sur fond blanc header */}
          <Logo textColor="#0F172A" iconColor="#0B4F8A" />
        </Link>

        {/* Nav desktop */}
        <nav aria-label="Navigation principale" className="hidden items-center gap-0.5 text-sm font-medium text-slate-700 lg:flex">
          <Link href="/" className="rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 hover:text-primary">Accueil</Link>

          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 hover:text-primary"
            >
              Services
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div className="invisible absolute left-0 top-full z-10 mt-1 w-64 rounded-xl border border-slate-200 bg-white p-1.5 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-primary/5 hover:text-primary"
                >
                  {s.navTitle}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/zones" className="rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 hover:text-primary">Zones</Link>
          {siteConfig.features.blog && (
            <Link href="/conseils" className="rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 hover:text-primary">Conseils</Link>
          )}
          <Link href="/contact" className="rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 hover:text-primary">Contact</Link>
        </nav>

        {/* CTA droite + menu mobile */}
        <div className="flex items-center gap-2">
          <div className="hidden text-right lg:block">
            <p className="text-xs font-semibold text-slate-900">{siteConfig.availability}</p>
            <p className="text-xs text-slate-500">{siteConfig.responseTime}</p>
          </div>
          <PhoneButton className="btn-accent hidden !px-4 !py-2 text-sm sm:inline-flex" />
          <HeaderNavMobile
            services={services.map((s) => ({ slug: s.slug, navTitle: s.navTitle }))}
            blogEnabled={siteConfig.features.blog}
          />
        </div>
      </div>
    </header>
  )
}
