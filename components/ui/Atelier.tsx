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

/** « Note Google 5,0 sur 5, d’après 50 avis » (le logo Google est dessiné à part, aucune étoile : Rémy 22/11/2026). */
export function noteTexte(a: Atelier & { note: number; avis: number }) {
  const note = a.note.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  return `Note Google ${note} sur 5, d’après ${a.avis} avis`
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

/** Le « G » de Google, en quatre couleurs. */
export function LogoGoogle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.27a12 12 0 0 0 0 10.76z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.27 6.62l4.01 3.1C6.22 6.88 8.87 4.77 12 4.77z" />
    </svg>
  )
}

/** Petite ligne du bloc 1 : le logo Google et la note, rien d'autre (ni adresse, ni étoile, ni lien). */
export function NoteGoogle({ className = '' }: { className?: string }) {
  if (!noteAffichable(atelier)) return null
  const note = atelier.note.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  // Encadré blanc sur UNE ligne (Rémy 22/11/2026 : ni « 5,0/5 · 50 avis » illisible, ni deux lignes) :
  // logo Google, « 5,0 sur 5 · 50 avis clients ». Pas d'étoile, pas de lien vers Google.
  return (
    <div className={`flex justify-center lg:justify-start ${className}`}>
      <p className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-[4px] bg-white px-3 py-1.5 text-[14px] leading-none text-ink-950 shadow-[0_8px_24px_-12px_rgba(9,30,34,0.45)] ring-1 ring-ink-950/5">
        <LogoGoogle className="h-[18px] w-[18px] shrink-0" />
        <span>
          <strong className="font-semibold">{note} sur 5</strong>
          <span className="text-ink-900/65"> · {atelier.avis} avis clients</span>
        </span>
      </p>
    </div>
  )
}
