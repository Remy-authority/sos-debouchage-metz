import Link from 'next/link'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { LiveDot } from '@/components/ui/LiveDot'
import { siteConfig } from '@/config/site.config'
import { getServices, getZones } from '@/lib/content'

export function Footer() {
  const year = new Date().getFullYear()
  const services = getServices()
  const zones = getZones()

  return (
    <footer className="relative bg-ink-950 text-sand-100">
      <div className="rule-glow absolute inset-x-0 top-0" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-6 max-w-md leading-relaxed text-sand-300">
              Débouchage, dégorgement et curage de canalisations à {siteConfig.city} et dans les
              communes de l&apos;agglomération. Un métier, un outillage dédié, un prix annoncé avant
              l&apos;intervention.
            </p>
            <LiveDot className="mt-8">Ligne urgence ouverte {siteConfig.availability}</LiveDot>
          </div>

          <div className="lg:col-span-3">
            <h2 className="mb-5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent-400">
              Prestations
            </h2>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-sand-300 transition-colors hover:text-accent-300"
                  >
                    {s.navTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="mb-5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent-400">
              Zones
            </h2>
            <ul className="space-y-3">
              {zones.map((z) => (
                <li key={z.slug}>
                  <Link
                    href={`/zones/${z.slug}`}
                    className="text-sm text-sand-300 transition-colors hover:text-accent-300"
                  >
                    {z.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="mb-5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent-400">
              Contact
            </h2>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-accent-400" />
                <a href={`tel:${siteConfig.phone}`} className="text-sand-100 hover:text-accent-300">
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 shrink-0 text-accent-400" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="break-all text-sand-100 hover:text-accent-300"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-accent-400" />
                <span className="text-sand-300">
                  {siteConfig.city} et un rayon d&apos;environ {siteConfig.serviceArea.radiusKm} km
                  <br />
                  {siteConfig.departmentName} ({siteConfig.department}), {siteConfig.region}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="mt-0.5 shrink-0 text-accent-400" />
                <span className="text-sand-300">{siteConfig.availability}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ink-800 pt-8 text-sm text-sand-400 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.businessName}. Tous droits réservés.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/mentions-legales" className="transition-colors hover:text-accent-300">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="transition-colors hover:text-accent-300">
              Confidentialité
            </Link>
            <Link href="/politique-cookies" className="transition-colors hover:text-accent-300">
              Cookies
            </Link>
            <Link href="/cgu" className="transition-colors hover:text-accent-300">
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
