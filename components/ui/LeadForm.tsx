'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { siteConfig } from '@/config/site.config'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LE FORMULAIRE DE DEMANDE, en 3 étapes (formulaire court, `tasks/regle-formulaire.md`,
 *  #R84 ; mis en place le 22/11/2026 à la demande de Rémy, modèle SOS Chauffage Besançon).
 *  Remplace le formulaire à 8 cases (étape 2 : commune tapée + urgence ; étape 3 : email).
 * ─────────────────────────────────────────────────────────────────────────────
 *  ⛔ INTOUCHABLE : les noms de champs et l'ORDRE des clés du corps envoyé (`VIDE`, puis
 *  `company`), les valeurs de `probleme` et `urgence` AU CARACTÈRE PRÈS (les mêmes qu'avant),
 *  le piège `company`, `data-clic-formulaire` et `data-lead-form` (compteur `SuiviVisite`).
 *
 *   - Étape 1 : « Qu’est-ce qui est bouché ? », 4 situations en 2 x 2, un clic avance. Les
 *     autres valeurs d'avant (odeurs, colonne, bac à graisse, autre) ne sont plus proposées,
 *     la route les accepte toujours.
 *   - Étape 2 : « C'est pressé ? », 3 réponses (la dernière en pleine largeur), un clic avance.
 *     La réponse part dans `urgence` ET en tête de `message` (le mail et le SMS lisent `message`).
 *   - Étape 3 : Nom | Prénom (envoyés ensemble dans `nom`), Téléphone | Code postal, puis
 *     « Précisions (facultatif) » à la suite dans `message`. La commune se trouve toute seule
 *     par le code postal (public/cp/, copié de Poitou) et part dans `ville` (« Metz 57000 »).
 *   - Part VIDE (plus demandé) : email.
 *   - Bouton d'envoi toujours actif : au clic, les cases manquantes s'allument en rouge.
 *   - UN seul dessin partout. `ecran1` : carte posée sur la photo du bloc 1, translucide à
 *     l'arrivée puis noire pleine au premier choix ; ailleurs, noire.
 *   - Chaque étape atteinte (2 puis 3) envoie `rr-etape`, compté par `SuiviVisite`.
 *   - `memoire` (bloc 1 de l'accueil) : le premier choix envoie `leadform:touche`, le film du
 *     bloc 1 s'arrête pour de bon et le formulaire ne s'efface plus au défilement.
 */

type Etape = 1 | 2 | 3

interface Champs {
  probleme: string
  ville: string
  urgence: string
  nom: string
  telephone: string
  email: string
  message: string
}

/** Ordre des clés = ordre du corps JSON envoyé (inchangé). Ne pas le changer. */
const VIDE: Champs = {
  probleme: '',
  ville: '',
  urgence: '',
  nom: '',
  telephone: '',
  email: '',
  message: '',
}

const trait = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

/** `id` = valeur envoyée, jamais changée ; `label` = texte affiché. */
const SITUATIONS: readonly { id: string; label: string; icone: ReactNode }[] = [
  {
    id: 'WC ou toilettes bouchés',
    label: 'WC, toilettes',
    icone: (
      <svg {...trait}>
        <path d="M6 3h6v7H6z" />
        <path d="M4 10h16c0 3.9-3.1 7-7 7h-2a6 6 0 0 1-6-6z" />
        <path d="M9.5 17 9 21h6l-.5-4" />
      </svg>
    ),
  },
  {
    id: 'Évier ou lavabo bouché',
    label: 'Évier, lavabo',
    icone: (
      <svg {...trait}>
        <path d="M3 11h18l-1.6 4.3A3 3 0 0 1 16.6 17H7.4a3 3 0 0 1-2.8-1.7z" />
        <path d="M12 11V5.5a2.5 2.5 0 0 1 5 0" />
        <path className="lf-goutte" d="M17 8.5v1.2" />
        <path d="M12 17v4" />
      </svg>
    ),
  },
  {
    id: 'Douche ou baignoire bouchée',
    label: 'Douche, baignoire',
    icone: (
      <svg {...trait}>
        <path d="M6 21V7a4 4 0 0 1 8 0" />
        <path d="M10 10h8l-1.5-3h-5z" />
        <path className="lf-goutte" d="M11.5 13v1.5M14 13v1.5M16.5 13v1.5" />
        <path d="M3 21h18" />
      </svg>
    ),
  },
  {
    id: 'Canalisation enterrée ou regard',
    label: 'Regard, canalisation',
    icone: (
      <svg {...trait}>
        <path d="M3 8h18" />
        <path d="M8 8v13h8V8" />
        <path d="M7 5h10" />
        <path className="lf-flux" d="M3 16h5M16 16h5" />
      </svg>
    ),
  },
]

/** Mêmes valeurs qu'avant dans `urgence`. */
const URGENCES: readonly { id: string; icone: ReactNode }[] = [
  {
    id: "C'est urgent",
    icone: (
      <svg {...trait}>
        <path d="M12 3 2.5 20h19z" />
        <path d="M12 10v4.5M12 17.2h.01" />
      </svg>
    ),
  },
  {
    id: 'Dans la journée',
    icone: (
      <svg {...trait}>
        <circle cx="12" cy="12" r="9" />
        <path className="lf-aiguille" d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    id: 'Cette semaine',
    icone: (
      <svg {...trait}>
        <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
        <path d="M3.5 10h17M8 3v4M16 3v4" />
      </svg>
    ),
  },
]

const TITRES: Record<Etape, { titre: string; aide: string }> = {
  1: { titre: 'Qu’est-ce qui est bouché ?', aide: 'Devis gratuit en 30 secondes.' },
  2: { titre: 'C’est pressé ?', aide: 'Le technicien s’organise en conséquence.' },
  3: { titre: 'Où vous rappeler ?', aide: 'Nous vous rappelons au plus vite.' },
}

type Manque = 'nom' | 'telephone' | 'lieu'
const NOM_DU_MANQUE: Record<Manque, string> = {
  nom: 'votre nom',
  telephone: 'un téléphone valide',
  lieu: 'votre code postal',
}

/** Évènement du premier choix (bloc 1 de l'accueil) : le film s'arrête pour de bon. */
export const EVENEMENT_TOUCHE = 'leadform:touche'

// Communes par code postal, rangées dans le site (public/cp/<2 chiffres>.json, tirées de
// geo.api.gouv.fr) : réponse immédiate, aucun service extérieur. Un fichier lu une seule fois.
const COMMUNES_DU_DEPARTEMENT = new Map<string, Promise<Record<string, string[]>>>()

function communesDuDepartement(deux: string): Promise<Record<string, string[]>> {
  let lu = COMMUNES_DU_DEPARTEMENT.get(deux)
  if (!lu) {
    lu = fetch(`/cp/${deux}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<Record<string, string[]>>) : {}))
      .catch(() => ({}))
    COMMUNES_DU_DEPARTEMENT.set(deux, lu)
  }
  return lu
}

/** Icônes du formulaire : l'eau goutte, le flux passe, l'aiguille tourne, en douceur. */
const CSS_FORM = `
@keyframes lf-goutte{0%,60%{opacity:0;transform:translateY(-2px)}75%{opacity:1}100%{opacity:0;transform:translateY(3px)}}
@keyframes lf-flux{0%,100%{opacity:.45}50%{opacity:1}}
@keyframes lf-aiguille{to{transform:rotate(360deg)}}
.lf-goutte{animation:lf-goutte 2.4s ease-in infinite}
.lf-flux{animation:lf-flux 1.8s ease-in-out infinite}
.lf-aiguille{animation:lf-aiguille 6s linear infinite;transform-origin:12px 12px}
@media (prefers-reduced-motion:reduce){.lf-goutte,.lf-flux,.lf-aiguille{animation:none}}`

export function LeadForm({
  idPrefix = '',
  ecran1 = false,
  memoire = false,
}: {
  /** Ancien réglage de taille, sans effet : un seul dessin partout. */
  variante?: 'standard' | 'hero'
  /** Évite les doublons d'`id` entre deux instances d'une même page. */
  idPrefix?: string
  /** Carte posée sur la photo du bloc 1 : translucide, puis noire au premier choix. */
  ecran1?: boolean
  /** Bloc 1 de l'accueil : premier choix signalé au film. */
  memoire?: boolean
} = {}) {
  const cle = idPrefix || 'formulaire'
  const [etape, setEtape] = useState<Etape>(1)
  const [probleme, setProbleme] = useState('')
  const [urgence, setUrgence] = useState('')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [lieu, setLieu] = useState('')
  const [precision, setPrecision] = useState('')
  const [commune, setCommune] = useState('')
  const [propositions, setPropositions] = useState<string[]>([])
  const [manques, setManques] = useState<Manque[]>([])
  const [statut, setStatut] = useState<'repos' | 'envoi' | 'erreur'>('repos')

  // À chaque étape : le titre reçoit le focus (lecteurs d'écran) sans faire défiler, l'étape
  // atteinte est comptée (`rr-etape`), et la carte revient entière à l'écran si elle en sort.
  const racineRef = useRef<HTMLDivElement>(null)
  const titreRef = useRef<HTMLHeadingElement>(null)
  const aBouge = useRef(false)
  useEffect(() => {
    if (!aBouge.current) return
    titreRef.current?.focus({ preventScroll: true })
    if (etape > 1) window.dispatchEvent(new CustomEvent('rr-etape', { detail: etape }))
    if (memoire && etape === 2) window.dispatchEvent(new CustomEvent(EVENEMENT_TOUCHE, { detail: cle }))
  }, [etape, memoire, cle])
  useEffect(() => {
    if (!aBouge.current) return
    const carte = racineRef.current
    if (!carte) return
    const r = carte.getBoundingClientRect()
    // La barre fixe du bas, au téléphone et à la tablette seulement (StickyCTA).
    const barreDuBas = window.innerWidth < 1024 ? 80 : 12
    if (r.top < 64 || r.bottom > window.innerHeight - barreDuBas) {
      carte.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'nearest' })
    }
  }, [etape, manques.length, propositions.length, commune])

  function allerA(n: Etape) {
    aBouge.current = true
    setEtape(n)
  }

  // Dès les deux premiers chiffres la liste du département se charge, au cinquième la commune
  // est trouvée (une seule : retenue ; plusieurs : proposées).
  useEffect(() => {
    if (lieu.length < 2) return
    let annule = false
    communesDuDepartement(lieu.slice(0, 2)).then((codes) => {
      if (annule || lieu.length !== 5 || commune) return
      const noms = codes[lieu] ?? []
      if (noms.length === 1) setCommune(`${noms[0]} ${lieu}`)
      else setPropositions(noms)
    })
    return () => {
      annule = true
    }
  }, [lieu, commune])

  const id = (c: string) => `${idPrefix}${c}`

  function saisirLieu(valeur: string) {
    setLieu(valeur.replace(/\D/g, '').slice(0, 5))
    setCommune('')
    setPropositions([])
    retirerManque('lieu')
  }

  function retenirCommune(nomCommune: string) {
    setCommune(`${nomCommune} ${lieu}`)
    setPropositions([])
  }

  function retirerManque(c: Manque) {
    setManques((prev) => (prev.includes(c) ? prev.filter((m) => m !== c) : prev))
  }

  async function envoyer() {
    const saisie = lieu.trim()
    const oublis: Manque[] = []
    if (!nom.trim()) oublis.push('nom')
    if (telephone.replace(/\D/g, '').length < 8) oublis.push('telephone')
    if (saisie.length !== 5) oublis.push('lieu')
    setManques(oublis)
    if (oublis.length > 0) {
      document.getElementById(id(oublis[0]))?.focus()
      return
    }
    if (!probleme) return allerA(1)
    if (!urgence) return allerA(2)

    const champs: Champs = {
      ...VIDE,
      probleme,
      ville: commune || saisie,
      urgence,
      nom: [prenom.trim(), nom.trim()].filter(Boolean).join(' '),
      telephone: telephone.trim(),
      // L'urgence voyage aussi dans `message` : le mail et le SMS ne lisent que ce champ.
      message: [`Urgence : ${urgence}`, precision.trim()].filter(Boolean).join('. '),
    }

    setStatut('envoi')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...champs, company: '' }),
      })
      if (!res.ok) throw new Error()
      window.location.href = '/merci'
    } catch {
      setStatut('erreur')
    }
  }

  // ── Habillage : un seul dessin sur tout le site ─────────────────────────────
  const carte = `rounded-[4px] border p-5 text-center text-white shadow-[0_30px_70px_-30px_rgb(0_0_0/0.8)] max-[359px]:px-3.5 max-[359px]:py-4 sm:p-7 lg:text-left ${
    ecran1
      ? `transition-colors duration-300 ${probleme ? 'border-white/15 bg-ink-950' : 'border-white/25 bg-ink-950/70 backdrop-blur-[3px]'}`
      : 'border-white/10 bg-ink-950'
  }`

  const champClasse = (c?: Manque) =>
    `w-full rounded-[4px] border bg-white/[0.07] px-3 py-2.5 text-[16px] text-white transition focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/25 ${
      c && manques.includes(c) ? 'border-red-400 ring-1 ring-red-400' : 'border-white/25'
    }`
  const labelClasse = 'mb-1.5 block text-left text-[13px] font-semibold text-white/80'

  // Tuile pleine (jamais transparente), icône au-dessus du libellé ; la tuile choisie prend le
  // vermillon. Survol réservé à la souris : au doigt, la tuile suivante ne paraît pas choisie.
  const tuile = (choisi: boolean) =>
    `flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-[4px] border px-1.5 py-2.5 text-center transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 max-[359px]:min-h-[62px] sm:min-h-[88px] sm:gap-2 sm:px-2 sm:py-3.5 lg:items-start lg:px-4 lg:text-left ${
      choisi
        ? 'border-accent-400 bg-accent-500 text-white [&_svg]:text-white'
        : 'border-brand-400/45 bg-ink-800 text-white [@media(hover:hover)]:hover:border-brand-300 [@media(hover:hover)]:hover:bg-ink-700'
    }`
  const libelleClasse = 'font-semibold leading-tight text-[clamp(12.5px,3.7vw,14.5px)] [text-wrap:balance]'
  const iconeClasse = 'block h-[26px] w-[26px] shrink-0 text-brand-300 sm:h-7 sm:w-7 [&_svg]:h-full [&_svg]:w-full'
  const titres = TITRES[etape]

  return (
    <div
      ref={racineRef}
      data-clic-formulaire
      data-lead-form={cle}
      className={`${carte} scroll-mb-24 scroll-mt-24`}
      role="region"
      aria-label="Formulaire de demande"
    >
      <style>{CSS_FORM}</style>
      {/* Piège à robots, invisible pour les humains */}
      <div className="hidden" aria-hidden="true">
        <input type="text" name="company" tabIndex={-1} autoComplete="off" readOnly />
      </div>

      {/* Progression, avec « Retour » dès l'étape 2 */}
      <div className="flex min-h-[20px] items-center gap-3">
        {etape > 1 && (
          <button
            type="button"
            onClick={() => allerA((etape - 1) as Etape)}
            className="-my-2 -ml-1 inline-flex shrink-0 items-center gap-1 rounded-[4px] py-2 pl-1 pr-1.5 text-[13px] font-semibold text-white/75 transition-colors hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Retour
          </button>
        )}
        <div className="flex flex-1 gap-1.5" aria-hidden="true">
          {([1, 2, 3] as Etape[]).map((n) => (
            <span
              key={n}
              className={`h-1 flex-1 rounded-[2px] transition-colors duration-300 ${
                n < etape ? 'bg-accent-600' : n === etape ? 'bg-accent-400' : 'bg-white/15'
              }`}
            />
          ))}
        </div>
        <span className="shrink-0 text-[11.5px] font-bold uppercase tracking-[0.14em] text-white/55">Étape {etape}/3</span>
      </div>

      <h3
        ref={titreRef}
        tabIndex={-1}
        className={`mt-4 font-display text-[clamp(1.3rem,6.4vw,1.75rem)] font-medium leading-tight lg:text-[1.55rem] tracking-tight text-white outline-none max-[359px]:mt-3 sm:mt-5 ${
          etape === 1 ? 'whitespace-nowrap' : '[text-wrap:balance]'
        }`}
      >
        {titres.titre}
      </h3>
      <p className="mt-1 text-[13.5px] text-white/70 [text-wrap:balance]">{titres.aide}</p>

      {/* ── Étape 1 : la situation, un clic avance ──────────────────────────── */}
      {etape === 1 && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-2.5" role="group" aria-label="Ce qui est bouché">
          {SITUATIONS.map((s) => {
            const choisi = probleme === s.id
            return (
              <button
                data-clic-formulaire
                key={s.id}
                type="button"
                onClick={() => {
                  setProbleme(s.id)
                  allerA(2)
                }}
                aria-pressed={choisi}
                className={tuile(choisi)}
              >
                <span className={iconeClasse}>{s.icone}</span>
                <span className={libelleClasse}>{s.label}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* ── Étape 2 : c'est pressé ?, un clic avance ────────────────────────── */}
      {etape === 2 && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-2.5" role="group" aria-label="Degré d’urgence">
          {URGENCES.map((u, i) => {
            const choisi = urgence === u.id
            return (
              <button
                data-clic-formulaire
                key={u.id}
                type="button"
                onClick={() => {
                  setUrgence(u.id)
                  allerA(3)
                }}
                aria-pressed={choisi}
                className={`${tuile(choisi)}${i === URGENCES.length - 1 ? ' col-span-2' : ''}`}
              >
                <span className={iconeClasse}>{u.icone}</span>
                <span className={libelleClasse}>{u.id}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* ── Étape 3 : deux champs par ligne, deux lignes, puis l'envoi ──────── */}
      {etape === 3 && (
        <div className="mt-4 sm:mt-5">
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-3">
            <div>
              <label htmlFor={id('nom')} className={labelClasse}>
                Nom
              </label>
              <input
                id={id('nom')}
                name="nom"
                type="text"
                autoComplete="family-name"
                autoCapitalize="words"
                aria-invalid={manques.includes('nom')}
                value={nom}
                onChange={(e) => {
                  setNom(e.target.value)
                  retirerManque('nom')
                }}
                className={champClasse('nom')}
              />
            </div>
            <div>
              <label htmlFor={id('prenom')} className={labelClasse}>
                Prénom
              </label>
              <input
                id={id('prenom')}
                name="prenom"
                type="text"
                autoComplete="given-name"
                autoCapitalize="words"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className={champClasse()}
              />
            </div>
            <div>
              <label htmlFor={id('telephone')} className={labelClasse}>
                Téléphone
              </label>
              <input
                id={id('telephone')}
                name="telephone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                aria-invalid={manques.includes('telephone')}
                value={telephone}
                onChange={(e) => {
                  setTelephone(e.target.value)
                  retirerManque('telephone')
                }}
                className={champClasse('telephone')}
              />
            </div>
            <div>
              <label htmlFor={id('lieu')} className={labelClasse}>
                Code postal
              </label>
              <input
                id={id('lieu')}
                name="ville"
                type="text"
                autoComplete="postal-code"
                inputMode="numeric"
                maxLength={5}
                aria-invalid={manques.includes('lieu')}
                value={lieu}
                onChange={(e) => saisirLieu(e.target.value)}
                className={champClasse('lieu')}
              />
            </div>
          </div>

          {/* La commune trouvée, ou les communes du code postal à toucher (une ligne qui défile). */}
          {commune && (
            <p className="mt-2 flex items-center justify-center gap-1.5 text-[13px] font-semibold text-brand-300 lg:justify-end">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
              {commune}
            </p>
          )}
          {!commune && propositions.length > 0 && (
            <div
              // w-0 + min-w-full : la ligne défile sans jamais élargir la carte ni la page.
              className="mt-2 flex w-0 min-w-full gap-1.5 overflow-x-auto pb-1"
              role="group"
              aria-label="Votre commune"
            >
              {propositions.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => retenirCommune(p)}
                  className="shrink-0 whitespace-nowrap rounded-[4px] border border-white/20 bg-white/[0.06] px-2.5 py-1.5 text-[13px] font-semibold text-white hover:border-accent-400"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          <div className="mt-3">
            <label htmlFor={id('precision')} className={labelClasse}>
              Précisions <span className="font-normal text-white/55">(facultatif)</span>
            </label>
            <input
              id={id('precision')}
              name="message"
              type="text"
              maxLength={300}
              value={precision}
              onChange={(e) => setPrecision(e.target.value)}
              className={champClasse()}
            />
          </div>

          {manques.length > 0 && (
            <p role="alert" className="mt-3 text-[13px] font-semibold text-red-300">
              Complétez les cases en rouge.
              <span className="sr-only"> Il nous manque {manques.map((m) => NOM_DU_MANQUE[m]).join(' et ')}.</span>
            </p>
          )}
          {statut === 'erreur' && (
            <p role="alert" className="mt-3 rounded-[4px] bg-red-500/15 px-4 py-3 text-[14px] font-medium text-red-200">
              L’envoi a échoué. Appelez-nous directement au {siteConfig.phoneDisplay}.
            </p>
          )}

          <button
            type="button"
            onClick={envoyer}
            disabled={statut === 'envoi'}
            className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center whitespace-nowrap rounded-[4px] bg-accent-500 px-6 font-semibold text-white transition-colors hover:bg-accent-400 disabled:opacity-70"
            data-cta={ecran1 ? 'devis-hero-carte' : 'devis-envoi'}
          >
            {statut === 'envoi' ? 'Envoi en cours…' : 'Demander mon rappel gratuit'}
          </button>
          <p className="mt-2.5 text-center text-[13px] text-white/70 lg:text-left">
            ou appelez le{' '}
            <a href={`tel:${siteConfig.phone}`} data-cta="phone" className="whitespace-nowrap font-semibold text-white underline underline-offset-2 hover:text-accent-300">
              {siteConfig.phoneDisplay}
            </a>
          </p>
          <p className="mt-1.5 text-[12px] text-white/55">
            Uniquement pour vous rappeler.{' '}
            <a href="/politique-confidentialite" className="underline underline-offset-2 hover:text-white/80">
              Confidentialité
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

export default LeadForm
