'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CircleAlert,
  Droplets,
  Shovel,
  ShowerHead,
  Toilet,
  TriangleAlert,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react'
import { EASE } from '@/lib/motion'
import { siteConfig } from '@/config/site.config'

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

/** Les huit situations qui couvrent la quasi-totalité des appels débouchage. */
const TYPES: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: 'WC ou toilettes bouchés', label: 'WC, toilettes', Icon: Toilet },
  { id: 'Évier ou lavabo bouché', label: 'Évier, lavabo', Icon: Droplets },
  { id: 'Douche ou baignoire bouchée', label: 'Douche, baignoire', Icon: ShowerHead },
  { id: 'Odeurs ou refoulement', label: 'Odeurs, refoulement', Icon: TriangleAlert },
  { id: 'Canalisation enterrée ou regard', label: 'Regard, enterré', Icon: Shovel },
  { id: "Colonne d'immeuble ou copropriété", label: "Colonne d'immeuble", Icon: Building2 },
  { id: 'Bac à graisse (professionnel)', label: 'Bac à graisse', Icon: UtensilsCrossed },
  { id: 'Autre', label: 'Autre situation', Icon: CircleAlert },
]

function ProgressBar({ step }: { step: Step }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-1 gap-2">
        {([1, 2, 3] as Step[]).map((s) => (
          <span
            key={s}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              s < step ? 'bg-accent-500/60' : s === step ? 'bg-accent-500' : 'bg-white/15'
            }`}
          />
        ))}
      </div>
      <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-sand-400">
        Étape {step} sur 3
      </span>
    </div>
  )
}

const inputClass =
  'w-full rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3.5 text-sand-50 placeholder:text-sand-500 transition-colors focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/25'
const labelClass = 'mb-1.5 block text-sm font-medium text-sand-200'

const stepVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
}

export function LeadForm() {
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

  function set<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  async function submit() {
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

  return (
    <div
      className="noise-overlay relative overflow-hidden rounded-panel border border-brand-400/20 bg-gradient-to-br from-ink-900 to-ink-950 p-6 md:p-9"
      role="region"
      aria-label="Formulaire de demande"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(var(--c-brand-500)/0.2),transparent_58%)]"
      />

      <div className="relative">
        {/* Piège à robots, invisible pour les humains. */}
        <div className="hidden" aria-hidden="true">
          <input type="text" name="company" tabIndex={-1} autoComplete="off" readOnly />
        </div>

        <ProgressBar step={step} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: EASE }}
            >
              <h2 className="mt-6 text-2xl text-sand-50 md:text-3xl">Qu&apos;est-ce qui est bouché ?</h2>
              <p className="mt-2 text-sm text-sand-400">
                Choisissez la situation la plus proche de la vôtre.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {TYPES.map(({ id, label, Icon }) => {
                  const selected = fields.probleme === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => set('probleme', id)}
                      aria-pressed={selected}
                      className={`flex min-h-[96px] flex-col items-center justify-center gap-2.5 rounded-2xl border p-3 text-center text-xs font-medium leading-tight transition-all duration-200 ${
                        selected
                          ? 'border-accent-400 bg-accent-500/20 text-sand-50'
                          : 'border-white/10 bg-white/[0.04] text-sand-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-sand-50'
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${selected ? 'text-accent-400' : 'text-brand-300'}`}
                        strokeWidth={1.9}
                        aria-hidden="true"
                      />
                      {label}
                    </button>
                  )
                })}
              </div>

              <div className="mt-7 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!fields.probleme}
                  className={`inline-flex min-h-[48px] items-center gap-2 rounded-full px-7 text-sm font-semibold transition-all ${
                    fields.probleme
                      ? 'bg-accent-500 text-white hover:bg-accent-400'
                      : 'cursor-not-allowed bg-white/10 text-sand-500'
                  }`}
                >
                  Continuer
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: EASE }}
            >
              <h2 className="mt-6 text-2xl text-sand-50 md:text-3xl">Où, et à quel point c&apos;est pressé ?</h2>
              <p className="mt-2 text-sm text-sand-400">
                Cela nous permet de vous situer dans notre planning.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label htmlFor="ville" className={labelClass}>
                    Commune ou code postal
                  </label>
                  <input
                    id="ville"
                    name="ville"
                    type="text"
                    autoComplete="postal-code"
                    placeholder="Metz, Montigny-lès-Metz, 57000…"
                    value={fields.ville}
                    onChange={(e) => set('ville', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <fieldset>
                  <legend className={labelClass}>Degré d&apos;urgence</legend>
                  <div className="flex flex-wrap gap-3">
                    {["C'est urgent", 'Dans la journée', 'Cette semaine'].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => set('urgence', value)}
                        aria-pressed={fields.urgence === value}
                        className={`min-h-[44px] rounded-full border px-5 text-sm font-semibold transition-all ${
                          fields.urgence === value
                            ? 'border-accent-400 bg-accent-500 text-white'
                            : 'border-white/20 text-sand-300 hover:border-white/40 hover:text-sand-50'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div className="mt-7 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-sand-400 transition-colors hover:text-sand-50"
                >
                  <ArrowLeft size={16} strokeWidth={2.5} />
                  Retour
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!fields.ville || !fields.urgence}
                  className={`inline-flex min-h-[48px] items-center gap-2 rounded-full px-7 text-sm font-semibold transition-all ${
                    fields.ville && fields.urgence
                      ? 'bg-accent-500 text-white hover:bg-accent-400'
                      : 'cursor-not-allowed bg-white/10 text-sand-500'
                  }`}
                >
                  Continuer
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: EASE }}
            >
              <h2 className="mt-6 text-2xl text-sand-50 md:text-3xl">Comment vous joindre ?</h2>
              <p className="mt-2 text-sm text-sand-400">
                Nous vous rappelons dès que possible. Pour une urgence, l&apos;appel reste le plus
                rapide.
              </p>

              <div className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nom" className={labelClass}>
                      Nom <span className="text-accent-400">*</span>
                    </label>
                    <input
                      id="nom"
                      name="nom"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Votre nom"
                      value={fields.nom}
                      onChange={(e) => set('nom', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="telephone" className={labelClass}>
                      Téléphone <span className="text-accent-400">*</span>
                    </label>
                    <input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="06 00 00 00 00"
                      value={fields.telephone}
                      onChange={(e) => set('telephone', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email <span className="text-xs font-normal text-sand-500">(optionnel)</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="vous@exemple.fr"
                    value={fields.email}
                    onChange={(e) => set('email', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>
                    Précisions <span className="text-xs font-normal text-sand-500">(optionnel)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Depuis quand, quels appareils sont touchés, maison ou appartement…"
                    value={fields.message}
                    onChange={(e) => set('message', e.target.value)}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-sand-500">
                En envoyant ce formulaire, vous acceptez d&apos;être recontacté au sujet de votre
                demande. Vos données ne sont pas revendues, voir notre{' '}
                <a
                  href="/politique-confidentialite"
                  className="underline transition-colors hover:text-sand-300"
                >
                  politique de confidentialité
                </a>
                .
              </p>

              {status === 'error' && (
                <p role="alert" className="mt-4 text-sm font-medium text-accent-300">
                  L&apos;envoi a échoué. Appelez-nous directement au {siteConfig.phoneDisplay}.
                </p>
              )}

              <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 text-sm text-sand-400 transition-colors hover:text-sand-50 sm:justify-start"
                >
                  <ArrowLeft size={16} strokeWidth={2.5} />
                  Retour
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={!fields.nom || !fields.telephone || status === 'sending'}
                  className={`inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full px-8 font-semibold transition-all sm:w-auto ${
                    !fields.nom || !fields.telephone || status === 'sending'
                      ? 'cursor-not-allowed bg-white/10 text-sand-500'
                      : 'bg-accent-500 text-white hover:bg-accent-400 hover:shadow-glow'
                  }`}
                >
                  {status === 'sending' ? 'Envoi en cours…' : 'Envoyer ma demande'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default LeadForm
