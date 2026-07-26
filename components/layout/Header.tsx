'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Menu, Phone, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { EASE } from '@/lib/motion'
import { siteConfig } from '@/config/site.config'

export type NavService = { slug: string; navTitle: string }

/**
 * En-tête fixe. Deux états visuels : posé sur le hero sombre (translucide, texte
 * crème) et décollé au scroll (crème dépoli, texte encre), avec une transition de
 * 500 ms. Le menu des prestations s'ouvre en panneau animé au survol sur desktop,
 * en accordéon sur mobile : c'est la version multi-pages du header de référence.
 */
export function Header({ services }: { services: NavService[] }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fermer les panneaux à chaque changement de page.
  useEffect(() => {
    setMobileOpen(false)
    setServicesOpen(false)
    setMobileServicesOpen(false)
  }, [pathname])

  const links = [
    { href: '/zones', label: "Zones d'intervention" },
    { href: '/conseils', label: 'Conseils' },
    { href: '/contact', label: 'Contact' },
  ]

  // Le menu mobile ouvert force l'en-tête clair : sinon la barre sombre flotte
  // au-dessus d'un panneau crème, sans cohérence.
  const solid = scrolled || mobileOpen

  const linkTone = solid
    ? 'text-ink-900 hover:text-brand-600'
    : 'text-sand-100 hover:text-accent-300'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? 'bg-sand-50/90 shadow-[0_1px_0_rgb(7_26_30/0.07)] backdrop-blur-xl'
          : 'bg-ink-950/35 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5 lg:px-10">
        <Link href="/" aria-label={`${siteConfig.businessName}, accueil`} className="transition-opacity hover:opacity-80">
          <Logo tone={solid ? 'dark' : 'light'} />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((v) => !v)}
              className={`group relative flex items-center gap-1.5 py-2 text-sm font-medium transition-colors ${linkTone}`}
            >
              Prestations
              <ChevronDown
                size={15}
                className={`transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`}
              />
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent-500 transition-all duration-300 group-hover:w-[calc(100%-1.4rem)]" />
            </button>

            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  className="absolute left-1/2 top-full w-[22rem] -translate-x-1/2 pt-3"
                >
                  <div className="overflow-hidden rounded-panel border border-sand-200 bg-sand-50/95 p-2 shadow-card-hover backdrop-blur-xl">
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-brand-600/10 hover:text-brand-700"
                      >
                        {s.navTitle}
                        <span className="text-accent-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative py-2 text-sm font-medium transition-colors ${linkTone}`}
            >
              {item.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex">
          <Button href={`tel:${siteConfig.phone}`} variant="accent" size="sm">
            <Phone size={16} strokeWidth={2.5} />
            {siteConfig.phoneDisplay}
          </Button>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-900 text-sand-50 lg:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-sand-200 bg-sand-50 shadow-card-hover lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-6" aria-label="Navigation mobile">
              <button
                type="button"
                aria-expanded={mobileServicesOpen}
                onClick={() => setMobileServicesOpen((v) => !v)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium text-ink-900 transition-colors hover:bg-brand-600/10"
              >
                Prestations
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {mobileServicesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="ml-3 border-l border-sand-200 pl-3">
                      {services.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          className="block rounded-xl px-4 py-2.5 text-sm text-sand-700 transition-colors hover:bg-brand-600/10 hover:text-brand-700"
                        >
                          {s.navTitle}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl px-4 py-3 text-base font-medium text-ink-900 transition-colors hover:bg-brand-600/10"
                >
                  {item.label}
                </Link>
              ))}

              <Button href={`tel:${siteConfig.phone}`} variant="accent" size="md" className="mt-4">
                <Phone size={18} strokeWidth={2.5} />
                {siteConfig.phoneDisplay}
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
