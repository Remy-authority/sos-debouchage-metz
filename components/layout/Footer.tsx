import Link from 'next/link'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { FooterLinks } from '@/components/layout/FooterLinks'
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

      <div className="mx-auto max-w-7xl px-6 pb-32 pt-16 lg:px-10 lg:pb-20 lg:pt-20">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col items-center text-center lg:col-span-4 lg:items-start lg:text-left">
            <Logo tone="light" />
            <p className="mt-6 max-w-md leading-relaxed text-sand-300">
              Débouchage, dégorgement et curage de canalisations à {siteConfig.city} et dans les
              communes de l&apos;agglomération. Un métier, un outillage dédié, un prix annoncé avant
              l&apos;intervention.
            </p>
            <LiveDot className="mt-8">Ligne urgence ouverte {siteConfig.availability}</LiveDot>
          </div>

          <div className="border-t border-ink-800 pt-4 lg:col-span-3 lg:border-0 lg:pt-0">
            <FooterLinks
              title="Prestations"
              items={[
                ...services.map((s) => ({ href: `/services/${s.slug}`, label: s.navTitle })),
                { href: '/tarifs', label: 'Tarifs et prix' },
              ]}
            />
          </div>

          <div className="border-t border-ink-800 pt-4 lg:col-span-2 lg:border-0 lg:pt-0">
            <FooterLinks
              title="Zones"
              items={[
                ...zones.map((z) => ({ href: `/zones/${z.slug}`, label: z.name })),
                { href: '/zones', label: 'Toutes les communes' },
              ]}
            />
          </div>

          <div className="border-t border-ink-800 pt-6 text-center lg:col-span-3 lg:border-0 lg:pt-0 lg:text-left">
            <h2 className="mb-5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent-400">
              Contact
            </h2>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start justify-center gap-3 lg:justify-start">
                <Phone size={16} className="mt-0.5 shrink-0 text-accent-400" />
                <a href={`tel:${siteConfig.phone}`} className="text-sand-100 hover:text-accent-300">
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start justify-center gap-3 lg:justify-start">
                <Mail size={16} className="mt-0.5 shrink-0 text-accent-400" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="break-all text-sand-100 hover:text-accent-300"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start justify-center gap-3 text-left lg:justify-start">
                <MapPin size={16} className="mt-0.5 shrink-0 text-accent-400" />
                <span className="text-sand-300">
                  {siteConfig.city} et un rayon d&apos;environ {siteConfig.serviceArea.radiusKm} km
                  <br />
                  {siteConfig.departmentName} ({siteConfig.department}), {siteConfig.region}
                </span>
              </li>
              <li className="flex items-start justify-center gap-3 lg:justify-start">
                <Clock size={16} className="mt-0.5 shrink-0 text-accent-400" />
                <span className="text-sand-300">{siteConfig.availability}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 lg:mt-16 border-t border-ink-800 pt-8 text-center text-sm text-sand-400 md:flex-row md:items-center md:justify-between md:text-left">
          <p>
            © {year} {siteConfig.businessName}. Tous droits réservés.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-start">
            <Link href="/tarifs" className="transition-colors hover:text-accent-300">
              Tarifs
            </Link>
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
