import { siteConfig, type Atelier } from '@/config/site.config'

/**
 * Atelier de l'entreprise et note Google (Rémy 22/11/2026). Tout lit le seul
 * réglage `siteConfig.atelier` : à null, plus rien ne s'affiche nulle part.
 * La note ne sort qu'à 4,5 au moins ET 15 avis au moins. Aucun lien, aucun
 * nom, aucune date, et rien dans les données structurées.
 */

export const atelier: Atelier | null = siteConfig.atelier

export function noteAffichable(a: Atelier | null = atelier): a is Atelier & { note: number; avis: number } {
  return !!a && a.note != null && a.avis != null && a.note >= 4.5 && a.avis >= 15
}

/** « rue Victor Poulain, Woippy » */
export function adresseAtelier(a: Atelier) {
  return `${a.rue}, ${a.ville}`
}

/** « 5,0/5 sur Google · 50 avis » (l'étoile est dessinée à part). */
export function noteTexte(a: Atelier & { note: number; avis: number }) {
  const note = a.note.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  return `${note}/5 sur Google · ${a.avis} avis`
}

/** Petit repère de carte dessiné. */
export function RepereAtelier({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path
        d="M8 15s5-4.7 5-8.7A5 5 0 0 0 3 6.3C3 10.3 8 15 8 15z"
        fill="currentColor"
        fillOpacity=".14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.4" r="1.9" fill="currentColor" />
    </svg>
  )
}

export function Etoile({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M8 1.2l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 12l-4.2 2.2.8-4.7L1.2 6.2l4.7-.7z" fill="#E8A317" />
    </svg>
  )
}

/** Ligne sobre du bloc 1 : adresse de l'atelier puis note Google, sans pilule ni badge. */
export function LigneAtelier({ className = '' }: { className?: string }) {
  if (!atelier) return null
  return (
    <p className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12px] leading-snug text-ink-900/75 min-[360px]:text-[13px] lg:justify-start lg:text-[14px] ${className}`}>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <RepereAtelier className="h-[15px] w-[15px] shrink-0 text-brand-700" />
        {atelier.mot} · {adresseAtelier(atelier)}
      </span>
      {noteAffichable(atelier) && (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <Etoile className="h-[14px] w-[14px] shrink-0" />
          {noteTexte(atelier)}
        </span>
      )}
    </p>
  )
}
