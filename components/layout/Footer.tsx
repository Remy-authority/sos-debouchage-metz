import Link from 'next/link'
import { Clock, Mail, MapPin, Phone, Warehouse } from 'lucide-react'
import { atelier, adresseAtelier } from '@/components/ui/Atelier'
import { Logo } from '@/components/ui/Logo'
import { FooterLinks } from '@/components/layout/FooterLinks'
import { siteConfig } from '@/config/site.config'
import { getServices, getZones } from '@/lib/content'

export function Footer() {
  const year = new Date().getFullYear()
  const services = getServices()
  const zones = getZones()

  return (
    <footer className="relative bg-ink-950 text-sand-100">
      <div className="rule-glow absolute inset-x-0 top-0" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-5 pb-24 pt-10 lg:px-10 lg:pb-20 lg:pt-20">
        {/* Téléphone : le logo et la ligne d'urgence, puis Prestations, Zones et Contact sur UNE
            ligne de trois intitulés dépliables (Rémy 22/11/2026, pied de page trop haut). */}
        <div className="grid grid-cols-3 lg:grid-cols-12 lg:gap-12">
          <div className="col-span-3 flex flex-col items-center pb-6 text-center lg:col-span-4 lg:items-start lg:pb-0 lg:text-left">
            <Logo tone="light" />
            <p className="mt-4 inline-flex items-center gap-2 text-[13px] text-sand-300 lg:mt-6 lg:text-sm">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22C55E]" />
              </span>
              Ligne urgence ouverte {siteConfig.availability}
            </p>
          </div>

          <div className="contents lg:col-span-3 lg:block">
            <FooterLinks
              title="Prestations"
              items={[
                ...services.map((s) => ({ href: `/services/${s.slug}`, label: s.navTitle })),
                { href: '/tarifs', label: 'Tarifs et prix' },
              ]}
            />
          </div>

          <div className="contents lg:col-span-2 lg:block">
            <FooterLinks
              title="Zones"
              items={[
                ...zones.map((z) => ({ href: `/zones/${z.slug}`, label: z.name })),
                { href: '/zones', label: 'Toutes les communes' },
              ]}
            />
          </div>

          <div className="contents lg:col-span-3 lg:block">
            <FooterLinks title="Contact">
              <ul className="space-y-2.5 text-center text-[13px] lg:space-y-4 lg:text-left lg:text-sm">
                <li className="flex items-start justify-center gap-3 lg:justify-start">
                  <Phone size={16} className="mt-0.5 shrink-0 text-accent-400" />
                  <a href={`tel:${siteConfig.phone}`} className="text-sand-100 hover:text-accent-300">
                    {siteConfig.phoneDisplay}
                  </a>
                </li>
                <li className="flex items-start justify-center gap-3 lg:justify-start">
                  <Mail size={16} className="mt-0.5 shrink-0 text-accent-400" />
                  <a href={`mailto:${siteConfig.email}`} className="break-all text-sand-100 hover:text-accent-300">
                    {siteConfig.email}
                  </a>
                </li>
                {atelier && (
                  <li className="flex items-start justify-center gap-3 lg:justify-start lg:text-left">
                    <Warehouse size={16} className="mt-0.5 shrink-0 text-accent-400" />
                    <span className="text-sand-300">
                      {atelier.mot}
                      <br />
                      {adresseAtelier(atelier)}
                    </span>
                  </li>
                )}
                <li className="flex items-start justify-center gap-3 lg:justify-start lg:text-left">
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
            </FooterLinks>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 text-center text-[12px] text-sand-400 md:flex-row md:items-center md:justify-between md:text-left lg:mt-16 lg:gap-4 lg:border-t lg:border-ink-800 lg:pt-8 lg:text-sm">
          <p>
            © {year} {siteConfig.businessName}. Tous droits réservés.
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 md:justify-start lg:gap-x-6 lg:gap-y-2">
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
