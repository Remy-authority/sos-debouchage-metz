import Link from 'next/link'
import { siteConfig } from '@/config/site.config'
import PhoneButton from '@/components/ui/PhoneButton'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-dark" aria-labelledby="hero-title">
      {/* Motif grille de points très discret */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Halo statique principal, ancré en haut à gauche */}
      <div
        className="pointer-events-none absolute -left-48 -top-48 h-[640px] w-[640px] rounded-full bg-primary/20 blur-[80px]"
        aria-hidden="true"
      />

      {/* HALO ANIMÉ, lumière qui se déplace lentement (demande répétée Rémy).
          Désactivé si prefers-reduced-motion activé (motion-safe). */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-[480px] w-[480px] rounded-full bg-primary/30 blur-[100px] motion-safe:animate-hero-glow"
        aria-hidden="true"
      />

      {/* Halo accent bas-droite, chaleur visuelle */}
      <div
        className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-accent/[0.08] blur-3xl"
        aria-hidden="true"
      />

      {/* Balayage lumineux diagonal, façon sniperpestcontrol3dservices.fr */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 motion-safe:animate-hero-shine"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)',
        }}
      />

      <div className="container-site relative grid gap-10 py-14 md:grid-cols-2 md:items-center md:py-20 lg:gap-16">
        {/* ── Colonne texte ── */}
        <div>
          {/* Badge urgence avec pulse */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent ring-1 ring-accent/20">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" aria-hidden="true" />
            {siteConfig.availability}
          </div>

          {/* H1, "Angers" avec soulignage dégradé accent */}
          <h1
            id="hero-title"
            className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Recherche de fuite d'eau à{' '}
            <span className="relative inline-block text-accent">
              {siteConfig.city}
              {/* Trait dégradé sous "Angers" */}
              <span
                className="absolute -bottom-1 left-0 h-[3px] w-4/5 rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, rgb(var(--color-accent-rgb)) 0%, transparent 100%)',
                }}
                aria-hidden="true"
              />
            </span>
          </h1>

          <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
            {siteConfig.responseTime}. Détection non destructive par{' '}
            {siteConfig.methods.join(', ')}. Devis gratuit, sans engagement.
          </p>

          {/* USPs, icônes SVG checkmark, zéro emoji */}
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-300" role="list">
            {siteConfig.usps.map((u) => (
              <li key={u} className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 shrink-0 text-accent"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {u}
              </li>
            ))}
          </ul>

          {/* CTAs mobile */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row md:hidden">
            <PhoneButton
              label={`Appeler le ${siteConfig.phoneDisplay}`}
              className="btn-accent justify-center text-base"
            />
            <Link
              href="/contact"
              className="btn-outline !border-white/30 !bg-transparent !text-white hover:!bg-white/10 justify-center"
            >
              Devis en 30 s →
            </Link>
          </div>

          {/* CTAs desktop */}
          <div className="mt-8 hidden md:flex md:items-center md:gap-4">
            <a
              href={`tel:${siteConfig.phone}`}
              className="flex items-center gap-3 rounded-2xl bg-accent px-6 py-4 text-white shadow-lg shadow-accent/30 transition hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label={`Appeler le ${siteConfig.phoneDisplay}`}
            >
              <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
              </svg>
              <div>
                <p className="text-xs font-medium text-white/80">Appelez maintenant</p>
                <p className="text-xl font-bold tracking-wide">{siteConfig.phoneDisplay}</p>
              </div>
            </a>
            <Link
              href="/contact"
              className="rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
            >
              Devis en 30 s →
            </Link>
          </div>
        </div>

        {/* ── Colonne droite : Carte Garantie (façon template Pest Control) ── */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
          {/* Ligne supérieure : badge + stat vedette */}
          <div className="flex items-start justify-between gap-4">
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
              Garantie
            </span>
            <span className="text-4xl font-black leading-none text-accent">100 %</span>
          </div>

          {/* Titre */}
          <h2 className="mt-4 text-lg font-bold leading-snug text-white">
            Fuite trouvée ou nous revenons
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Si la fuite n'est pas localisée lors de notre passage, nous revenons sans frais
            supplémentaire.
          </p>

          {/* 2 stats */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/5 px-4 py-3.5">
              <p className="text-2xl font-black text-accent">30 min</p>
              <p className="mt-0.5 text-xs text-slate-400">Réponse garantie</p>
            </div>
            <div className="rounded-xl bg-white/5 px-4 py-3.5">
              <p className="text-2xl font-black text-accent">24h/7j</p>
              <p className="mt-0.5 text-xs text-slate-400">Disponible</p>
            </div>
          </div>

          {/* Pied de carte */}
          <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4">
            <svg
              className="h-4 w-4 shrink-0 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 2 3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <p className="text-xs text-slate-400">
              Artisan local · Devis gratuit · Sans engagement
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
