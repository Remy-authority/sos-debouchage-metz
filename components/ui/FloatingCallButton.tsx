import { siteConfig } from '@/config/site.config'

/**
 * FloatingCallButton, bouton d'appel rond flottant, fixé en bas à droite.
 * Reste visible au scroll (position fixed). Style façon template Pest Control
 * (bouton orange, sans WhatsApp). Desktop uniquement : sur mobile la
 * MobileStickyBar assure déjà l'appel en bas d'écran (évite le doublon).
 */
export default function FloatingCallButton() {
  return (
    <a
      href={`tel:${siteConfig.phone}`}
      className="group fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 transition hover:scale-105 hover:bg-accent/90 md:flex"
      aria-label={`Appeler le ${siteConfig.phoneDisplay}`}
      data-cta="phone-floating"
    >
      {/* Halo pulsé pour attirer l'œil */}
      <span className="absolute inset-0 rounded-full bg-accent/40 motion-safe:animate-ping" aria-hidden="true" />
      {/* Étiquette au survol */}
      <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg bg-dark px-3 py-1.5 text-sm font-semibold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
        {siteConfig.phoneDisplay}
      </span>
      <svg className="relative h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
      </svg>
    </a>
  )
}
