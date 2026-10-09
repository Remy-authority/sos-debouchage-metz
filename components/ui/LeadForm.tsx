'use client'

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { siteConfig } from '@/config/site.config'

/**
 * Formulaire de demande, refait en octobre 2026 (mise à jour du site, GO Rémy le 10/10/2026).
 *
 * 1. Il AVANCE AU CLIC : étape 1 = un clic sur ce qui est bouché ; étape 2 = la commune puis le
 *    degré d'urgence, un clic sur l'urgence ouvre l'étape 3. Aucun bouton « Continuer ».
 *    « Retour » visible dès l'étape 2. Commune non saisie : elle est redemandée à l'étape 3.
 * 2. NOIR OPAQUE (encre 950 de la palette), angles de 3 px, aucune pilule.
 * 3. Grilles sans case orpheline : 8 situations en 2 x 4 ou 4 x 2, 3 urgences en 3 x 1.
 * 4. Téléphone tout centré, ordinateur aligné à gauche.
 *
 * Ce qui part à /api/contact NE CHANGE PAS (chaîne de M. Akin et Rank OS) :
 * { probleme, ville, urgence, nom, telephone, email, message, company: '' }, mêmes libellés de
 * `probleme` et `urgence` qu'avant, puis redirection vers /merci.
 */

type Step = 1 | 2 | 3

interface Fields {
  probleme: string
  ville: string
  urgence: string
  nom: string
  telephone: string
  email: string
  message: string
}

const AVANCE_MS = 280

const svg = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'lf-ico h-6 w-6',
  'aria-hidden': true,
}

/** Les huit situations : `id` part tel quel dans le mail, `label` est affiché. */
const TYPES: { id: string; label: string; Icon: () => JSX.Element }[] = [
  {
    id: 'WC ou toilettes bouchés',
    label: 'WC, toilettes',
    Icon: () => (
      <svg {...svg}>
        <path d="M6 3h6v7H6z" />
        <path d="M4 10h16c0 3.9-3.1 7-7 7h-2a6 6 0 0 1-6-6z" />
        <path d="M9.5 17 9 21h6l-.5-4" />
      </svg>
    ),
  },
  {
    id: 'Évier ou lavabo bouché',
    label: 'Évier, lavabo',
    Icon: () => (
      <svg {...svg}>
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
    Icon: () => (
      <svg {...svg}>
        <path d="M6 21V7a4 4 0 0 1 8 0" />
        <path d="M10 10h8l-1.5-3h-5z" />
        <path className="lf-goutte" d="M11.5 13v1.5M14 13v1.5M16.5 13v1.5" />
        <path d="M3 21h18" />
      </svg>
    ),
  },
  {
    id: 'Odeurs ou refoulement',
    label: 'Odeurs, refoulement',
    Icon: () => (
      <svg {...svg}>
        <path d="M3 21h18" />
        <path d="M9 21v-5h6v5" />
        <path className="lf-odeur" d="M8 12c-1.2-1.8 1.2-3 0-5s1.2-2.6 0-4M12 12c-1.2-1.8 1.2-3 0-5s1.2-2.6 0-4M16 12c-1.2-1.8 1.2-3 0-5s1.2-2.6 0-4" />
      </svg>
    ),
  },
  {
    id: 'Canalisation enterrée ou regard',
    label: 'Regard, enterré',
    Icon: () => (
      <svg {...svg}>
        <path d="M3 8h18" />
        <path d="M8 8v13h8V8" />
        <path d="M7 5h10" />
        <path d="M3 16h5M16 16h5" />
      </svg>
    ),
  },
  {
    id: "Colonne d'immeuble ou copropriété",
    label: "Colonne d'immeuble",
    Icon: () => (
      <svg {...svg}>
        <path d="M6 21V3h12v18" />
        <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
        <path d="M3 21h18" />
      </svg>
    ),
  },
  {
    id: 'Bac à graisse (professionnel)',
    label: 'Bac à graisse',
    Icon: () => (
      <svg {...svg}>
        <path d="M3 8h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M3 13h18" />
        <path d="M8 8V4M16 8V4" />
      </svg>
    ),
  },
  {
    id: 'Autre',
    label: 'Autre situation',
    Icon: () => (
      <svg {...svg}>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.4" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
]

const URGENCES = ["C'est urgent", 'Dans la journée', 'Cette semaine'] as const

const equilibre = '[text-wrap:balance]'

/** Case de choix : vrai bouton radio dans un label. Un clic, Espace ou Entrée choisit ET avance. */
function Choix({
  name,
  value,
  label,
  checked,
  onChoose,
  icone,
  compacte = false,
}: {
  name: string
  value: string
  label: string
  checked: boolean
  onChoose: () => void
  icone?: ReactNode
  compacte?: boolean
}) {
  return (
    <label className="group relative block h-full cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChoose}
        onClick={onChoose}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onChoose()
          }
        }}
        className="peer sr-only"
      />
      <span
        className={`flex h-full w-full items-center rounded-[3px] border font-medium leading-snug transition-colors duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-accent-300 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ink-950 ${
          compacte ? 'min-h-[48px] justify-center px-2 py-2 text-center text-[13.5px]' : 'min-h-[52px] justify-start gap-2.5 px-3 py-2 text-left text-[13px]'
        } ${
          checked
            ? 'border-accent-400 bg-accent-500 text-white'
            : 'border-white/15 bg-white/[0.06] text-white/85 group-hover:border-white/40 group-hover:bg-white/[0.1] group-hover:text-white'
        }`}
      >
        {icone && <span className={`shrink-0 ${checked ? 'text-white' : 'text-brand-300'}`}>{icone}</span>}
        <span className={equilibre}>{label}</span>
      </span>
    </label>
  )
}

function Retour({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-ml-1 inline-flex min-h-[40px] items-center gap-1.5 rounded-[3px] px-1 text-sm font-medium text-white/75 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4" aria-hidden="true">
        <path d="m15 18-6-6 6-6" />
      </svg>
      Retour
    </button>
  )
}

function Etapes({ step, onRetour }: { step: Step; onRetour: () => void }) {
  return (
    <div>
      <div className="flex gap-1.5" aria-hidden="true">
        {([1, 2, 3] as Step[]).map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-[1px] transition-colors duration-300 ${s <= step ? 'bg-accent-400' : 'bg-white/15'}`} />
        ))}
      </div>
      <div className="mt-2 flex min-h-[40px] items-center justify-between">
        {step > 1 ? <Retour onClick={onRetour} /> : <span />}
        <span className="text-xs font-semibold uppercase tracking-widest text-white/60">Étape {step} sur 3</span>
      </div>
    </div>
  )
}

const champ =
  'w-full rounded-[3px] border border-white/20 bg-white/[0.07] px-4 py-3 text-base text-white placeholder:text-white/40 transition focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30'
const etiquette = `mb-1.5 block text-sm font-medium text-white/85 ${equilibre}`
const facultatif = <span className="font-normal text-white/55">facultatif</span>

/** Icônes du formulaire : l'eau goutte, l'odeur ondule, en continu et en douceur. */
const CSS_FORM = `
@keyframes lf-goutte{0%,60%{opacity:0;transform:translateY(-2px)}75%{opacity:1}100%{opacity:0;transform:translateY(3px)}}
@keyframes lf-odeur{0%,100%{transform:translateY(0);opacity:.55}50%{transform:translateY(-1.5px);opacity:1}}
.lf-goutte{animation:lf-goutte 2.4s ease-in infinite}
.lf-odeur{animation:lf-odeur 2.2s ease-in-out infinite}
@keyframes lf-in{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:none}}
.lf-etape{animation:lf-in .3s cubic-bezier(.22,1,.36,1)}
@media (prefers-reduced-motion:reduce){.lf-goutte,.lf-odeur,.lf-etape{animation:none}}`

export interface LeadFormProps {
  /**
   * `hero` : formulaire du bloc 1 (colonne étroite, 2 colonnes de choix).
   * `standard` : accueil (bas de page), contact et tarifs (4 colonnes dès la tablette).
   */
  variante?: 'standard' | 'hero'
}

export function LeadForm({ variante = 'standard' }: LeadFormProps) {
  const hero = variante === 'hero'
  const [step, setStep] = useState<Step>(1)
  const [fields, setFields] = useState<Fields>({
    probleme: '',
    ville: '',
    urgence: '',
    nom: '',
    telephone: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [manque, setManque] = useState(false)
  const [communeEtape3, setCommuneEtape3] = useState(false)
  const titreRef = useRef<HTMLHeadingElement>(null)
  const premierRendu = useRef(true)
  const minuteur = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const fieldsRef = useRef(fields)
  fieldsRef.current = fields

  useEffect(() => () => clearTimeout(minuteur.current), [])

  // Focus sur le titre de chaque nouvelle étape (jamais au chargement de la page).
  useEffect(() => {
    if (premierRendu.current) {
      premierRendu.current = false
      return
    }
    titreRef.current?.focus({ preventScroll: true })
  }, [step])

  function set<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  function aller(vers: Step) {
    clearTimeout(minuteur.current)
    if (vers === 3) setCommuneEtape3(!fieldsRef.current.ville.trim())
    setManque(false)
    setStep(vers)
  }

  function avancerBientot(vers: Step) {
    clearTimeout(minuteur.current)
    minuteur.current = setTimeout(() => aller(vers), AVANCE_MS)
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!fields.nom.trim() || !fields.telephone.trim() || !fields.ville.trim()) {
      setManque(true)
      if (!fields.ville.trim()) setCommuneEtape3(true)
      return
    }
    setManque(false)
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, company: '' }),
      })
      if (!res.ok) throw new Error()
      window.location.href = '/merci'
    } catch {
      setStatus('error')
    }
  }

  const Titre = hero ? 'h2' : 'h3'
  const titreClasses = `mt-3 font-display font-medium leading-tight text-white outline-none ${equilibre} ${hero ? 'text-[1.3rem]' : 'text-xl md:text-2xl'}`

  return (
    <div
      className={`relative rounded-[3px] bg-ink-950 text-center text-white shadow-[0_24px_60px_-20px_rgb(0_0_0/0.55)] lg:text-left ${hero ? 'p-5 md:p-6' : 'p-6 md:p-8'}`}
      role="region"
      aria-label="Formulaire de demande"
    >
      <style>{CSS_FORM}</style>
      <form onSubmit={submit} noValidate>
        {/* Piège à robots, invisible pour les humains. */}
        <div className="hidden" aria-hidden="true">
          <input type="text" name="company" tabIndex={-1} autoComplete="off" readOnly />
        </div>

        <Etapes step={step} onRetour={() => aller((step - 1) as Step)} />

        <div key={step} className="lf-etape">
          {step === 1 && (
            <fieldset>
              <legend className="w-full">
                <Titre ref={titreRef} tabIndex={-1} className={titreClasses}>
                  Qu&apos;est-ce qui est bouché ?
                </Titre>
              </legend>
              <div className={`mt-4 grid grid-cols-2 gap-2 ${hero ? '' : 'md:grid-cols-4'}`}>
                {TYPES.map(({ id, label, Icon }) => (
                  <Choix
                    key={id}
                    name="probleme"
                    value={id}
                    label={label}
                    checked={fields.probleme === id}
                    onChoose={() => {
                      set('probleme', id)
                      avancerBientot(2)
                    }}
                    icone={<Icon />}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <div>
              <Titre ref={titreRef} tabIndex={-1} className={titreClasses}>
                Où, et c&apos;est pressé ?
              </Titre>
              <div className="mt-4">
                <label htmlFor={`ville-${variante}`} className={etiquette}>
                  Commune ou code postal
                </label>
                <input
                  id={`ville-${variante}`}
                  name="ville"
                  type="text"
                  autoComplete="postal-code"
                  placeholder="Metz, Marly, 57000"
                  value={fields.ville}
                  onChange={(e) => set('ville', e.target.value)}
                  className={champ}
                />
              </div>
              <fieldset className="mt-4">
                <legend className={etiquette}>Degré d&apos;urgence</legend>
                <div className="grid grid-cols-3 gap-2">
                  {URGENCES.map((u) => (
                    <Choix
                      key={u}
                      name="urgence"
                      value={u}
                      label={u}
                      compacte
                      checked={fields.urgence === u}
                      onChoose={() => {
                        set('urgence', u)
                        avancerBientot(3)
                      }}
                    />
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {step === 3 && (
            <div>
              <Titre ref={titreRef} tabIndex={-1} className={titreClasses}>
                Comment vous joindre ?
              </Titre>
              <div className="mt-4 space-y-3">
                {communeEtape3 && (
                  <div>
                    <label htmlFor={`ville3-${variante}`} className={etiquette}>
                      Commune ou code postal
                    </label>
                    <input
                      id={`ville3-${variante}`}
                      name="ville"
                      type="text"
                      autoComplete="postal-code"
                      required
                      value={fields.ville}
                      onChange={(e) => set('ville', e.target.value)}
                      className={champ}
                    />
                  </div>
                )}
                <div className={`grid gap-3 ${hero ? '' : 'sm:grid-cols-2'}`}>
                  <div>
                    <label htmlFor={`nom-${variante}`} className={etiquette}>
                      Nom
                    </label>
                    <input
                      id={`nom-${variante}`}
                      name="nom"
                      type="text"
                      required
                      autoComplete="name"
                      value={fields.nom}
                      onChange={(e) => set('nom', e.target.value)}
                      className={champ}
                    />
                  </div>
                  <div>
                    <label htmlFor={`telephone-${variante}`} className={etiquette}>
                      Téléphone
                    </label>
                    <input
                      id={`telephone-${variante}`}
                      name="telephone"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      value={fields.telephone}
                      onChange={(e) => set('telephone', e.target.value)}
                      className={champ}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor={`email-${variante}`} className={etiquette}>
                    Email {facultatif}
                  </label>
                  <input
                    id={`email-${variante}`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={fields.email}
                    onChange={(e) => set('email', e.target.value)}
                    className={champ}
                  />
                </div>
                {!hero && (
                  <div>
                    <label htmlFor={`message-${variante}`} className={etiquette}>
                      Précisions {facultatif}
                    </label>
                    <textarea
                      id={`message-${variante}`}
                      name="message"
                      rows={3}
                      value={fields.message}
                      onChange={(e) => set('message', e.target.value)}
                      className={`${champ} resize-none`}
                    />
                  </div>
                )}
              </div>

              {manque && (
                <p role="alert" className="mt-3 text-sm font-medium text-accent-300">
                  Il manque {!fields.ville.trim() ? 'la commune, ' : ''}votre nom ou votre téléphone.
                </p>
              )}
              {status === 'error' && (
                <p role="alert" className="mt-3 text-sm font-medium text-accent-300">
                  L&apos;envoi a échoué. Appelez-nous au {siteConfig.phoneDisplay}.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center rounded-[3px] bg-accent-500 px-6 text-[15px] font-semibold text-white transition hover:bg-accent-400 disabled:cursor-wait disabled:opacity-70"
              >
                {status === 'sending' ? 'Envoi en cours' : 'Être rappelé'}
              </button>
              <p className={`mt-3 text-xs leading-relaxed text-white/55 ${equilibre}`}>
                Vos données servent à vous rappeler, jamais revendues.{' '}
                <a href="/politique-confidentialite" className="underline hover:text-white/80">
                  Confidentialité
                </a>
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default LeadForm
