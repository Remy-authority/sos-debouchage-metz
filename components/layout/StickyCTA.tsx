'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FileText, Phone } from 'lucide-react'
import { EASE } from '@/lib/motion'
import { siteConfig } from '@/config/site.config'

/**
 * Rappel d'action flottant, apparaît après 600 px de scroll.
 * Desktop : deux pastilles rondes en bas à droite, l'appel pulse.
 * Mobile : barre pleine largeur, la cible d'appel occupe les deux tiers.
 */
export function StickyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed bottom-8 right-8 z-40 hidden flex-col gap-3 lg:flex"
          >
            <a
              href="/contact#formulaire"
              aria-label="Demander un devis"
              className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-glow-brand transition-all duration-300 hover:scale-110"
            >
              <FileText size={21} strokeWidth={2.2} />
              <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink-950 px-3 py-1.5 text-xs font-medium text-sand-50 group-hover:block">
                Demander un devis
              </span>
            </a>
            <a
              href={`tel:${siteConfig.phone}`}
              aria-label={`Appeler ${siteConfig.phoneDisplay}`}
              className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-accent-500 text-white shadow-glow transition-all duration-300 hover:scale-110"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-accent-400/40" aria-hidden="true" />
              <Phone size={21} strokeWidth={2.5} className="relative" />
              <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink-950 px-3 py-1.5 text-xs font-medium text-sand-50 group-hover:block">
                Appeler maintenant
              </span>
            </a>
          </motion.div>

          {/* Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-ink-800 bg-ink-950/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
          >
            <a
              href={`tel:${siteConfig.phone}`}
              className="flex min-h-[52px] flex-[2] items-center justify-center gap-2 rounded-full bg-accent-500 px-4 font-semibold text-white"
            >
              <Phone size={18} strokeWidth={2.5} />
              {siteConfig.phoneDisplay}
            </a>
            <a
              href="/contact#formulaire"
              className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full border border-sand-50/20 bg-white/10 px-4 text-sm font-semibold text-sand-50"
            >
              <FileText size={16} />
              Devis
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
