'use client'

import { useState } from 'react'
import Link from 'next/link'
import { siteConfig } from '@/config/site.config'

interface NavItem {
  slug: string
  navTitle: string
}

export default function HeaderNavMobile({ services, blogEnabled }: { services: NavItem[]; blogEnabled: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg text-slate-700 transition hover:bg-slate-100 lg:hidden"
      >
        <span className={`block h-0.5 w-5 rounded bg-current transition-all duration-200 ${open ? 'translate-y-2 rotate-45' : ''}`} />
        <span className={`block h-0.5 w-5 rounded bg-current transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
        <span className={`block h-0.5 w-5 rounded bg-current transition-all duration-200 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
      </button>

      {open && (
        <div
          id="mobile-nav"
          className="absolute inset-x-0 top-full z-50 border-b border-slate-200 bg-white shadow-lg lg:hidden"
        >
          <nav aria-label="Navigation mobile" className="container-site py-4">
            <ul className="space-y-1">
              <li>
                <Link href="/" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 font-medium text-slate-700 hover:bg-primary/5 hover:text-primary">
                  Accueil
                </Link>
              </li>
              <li>
                <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Services</p>
                <ul>
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        onClick={() => setOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-primary/5 hover:text-primary"
                      >
                        {s.navTitle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Link href="/zones" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 font-medium text-slate-700 hover:bg-primary/5 hover:text-primary">
                  Zones d'intervention
                </Link>
              </li>
              {blogEnabled && (
                <li>
                  <Link href="/conseils" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 font-medium text-slate-700 hover:bg-primary/5 hover:text-primary">
                    Conseils
                  </Link>
                </li>
              )}
              <li>
                <Link href="/contact" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 font-medium text-slate-700 hover:bg-primary/5 hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
            <div className="mt-4 border-t border-slate-100 pt-4">
              <a
                href={`tel:${siteConfig.phone}`}
                className="btn-accent w-full justify-center text-base"
                onClick={() => setOpen(false)}
              >
                <PhoneIcon />
                {siteConfig.phoneDisplay}
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
    </svg>
  )
}
