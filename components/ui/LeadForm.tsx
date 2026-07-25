'use client'

import { useState } from 'react'
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

// ── Vignettes types de problème ─────────────────────────────────────────────

const TYPES = [
  {
    id: 'Recherche de fuite',
    label: 'Recherche de fuite',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m21 21-4-4" />
        <path d="M10.5 7.5c0 0-2.5 3-2.5 4.5a2.5 2.5 0 0 0 5 0c0-1.5-2.5-4.5-2.5-4.5z" />
      </svg>
    ),
  },
  {
    id: 'Fuite urgente',
    label: 'Fuite urgente',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">
        <path d="M12 2.5c0 0-6.5 7-6.5 11.5a6.5 6.5 0 0 0 13 0C18.5 9.5 12 2.5 12 2.5z" />
        <line x1="12" y1="10" x2="12" y2="14" />
        <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'Canalisation enterrée',
    label: 'Canalisation enterrée',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">
        <rect x="3" y="8" width="18" height="5" rx="2.5" />
        <path d="M7 13v3" strokeWidth="1.5" />
        <path d="M12 13v3" strokeWidth="1.5" />
        <path d="M17 13v3" strokeWidth="1.5" />
        <path d="M2 18h20" strokeWidth="1.25" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'Fuite encastrée (mur/sol)',
    label: 'Fuite encastrée (mur/sol)',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <path d="M3 9h18" />
        <path d="M3 15h18" />
        <path d="M9 3v6" />
        <path d="M15 9v6" />
        <path d="M9 15v6" />
        <path d="M13 6l1.5 3-1.5 1 1.5 3" strokeWidth="1.5" strokeDasharray="1.5 1" />
      </svg>
    ),
  },
  {
    id: 'Fuite de piscine',
    label: 'Fuite de piscine',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M2 14c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0" />
        <path d="M2 10c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0" />
      </svg>
    ),
  },
  {
    id: 'Dégât des eaux / assèchement',
    label: 'Dégât des eaux',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">
        <path d="M3 9.5l9-7 9 7V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
        <path d="M9 19c1.5-1 3-1 4.5 0" />
        <path d="M7.5 15.5c2-1.5 4-1.5 6 0" />
      </svg>
    ),
  },
  {
    id: 'Autre',
    label: 'Autre problème',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
] as const

// ── Barre de progression ─────────────────────────────────────────────────────

function ProgressBar({ step }: { step: Step }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-1 gap-2">
        {([1, 2, 3] as Step[]).map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              s < step ? 'bg-accent/60' : s === step ? 'bg-accent' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
      <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-white/50">
        Étape {step}/3
      </span>
    </div>
  )
}

// ── Composant principal ──────────────────────────────────────────────────────

export default function LeadForm() {
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
      className="rounded-card p-6 md:p-8"
      style={{ background: 'rgb(var(--color-dark-rgb))' }}
      role="region"
      aria-label="Formulaire de devis"
    >
      {/* Honeypot invisible */}
      <div className="hidden" aria-hidden="true">
        <input type="text" name="company" tabIndex={-1} autoComplete="off" readOnly />
      </div>

      <ProgressBar step={step} />

      {/* ── Étape 1, Sélection vignettes ── */}
      {step === 1 && (
        <div>
          <h2 className="mt-5 text-2xl font-bold text-white md:text-3xl">
            Quel est votre problème&nbsp;?
          </h2>
          <p className="mt-1 text-sm text-white/60">Sélectionnez le type d'intervention.</p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
            {TYPES.map(({ id, label, Icon }) => {
              const selected = fields.probleme === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => set('probleme', id)}
                  className={`flex min-h-[90px] flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center text-xs font-medium leading-tight transition-all duration-150 ${
                    selected
                      ? 'border-accent bg-accent/20 text-white'
                      : 'border-white/10 bg-white/[0.05] text-white/70 hover:border-white/30 hover:bg-white/[0.09] hover:text-white'
                  }`}
                  aria-pressed={selected}
                >
                  <span className={selected ? 'text-accent' : 'text-white/70'}>
                    <Icon />
                  </span>
                  <span>{label}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!fields.probleme}
              className={`inline-flex items-center gap-2 rounded-full px-7 py-3 font-semibold text-sm transition-all ${
                fields.probleme
                  ? 'bg-accent text-white hover:bg-accent/90'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              Continuer
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Étape 2, Localisation + urgence ── */}
      {step === 2 && (
        <div>
          <h2 className="mt-5 text-2xl font-bold text-white md:text-3xl">
            Où êtes-vous situé&nbsp;?
          </h2>
          <p className="mt-1 text-sm text-white/60">Et quelle est l'urgence de l'intervention&nbsp;?</p>

          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="ville" className="mb-1.5 block text-sm font-medium text-white/80">
                Ville ou code postal
              </label>
              <input
                id="ville"
                name="ville"
                type="text"
                autoComplete="postal-code"
                placeholder="Ex : Angers, 49100…"
                value={fields.ville}
                onChange={(e) => set('ville', e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/[0.07] px-4 py-3 text-white placeholder:text-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-white/80">Urgence</p>
              <div className="flex gap-3">
                {[
                  { value: 'Aujourd\'hui', label: 'Aujourd\'hui' },
                  { value: 'Cette semaine', label: 'Cette semaine' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set('urgence', value)}
                    className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all ${
                      fields.urgence === value
                        ? 'border-accent bg-accent text-white'
                        : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Retour
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!fields.ville || !fields.urgence}
              className={`inline-flex items-center gap-2 rounded-full px-7 py-3 font-semibold text-sm transition-all ${
                fields.ville && fields.urgence
                  ? 'bg-accent text-white hover:bg-accent/90'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              Continuer
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Étape 3, Coordonnées + RGPD ── */}
      {step === 3 && (
        <div>
          <h2 className="mt-5 text-2xl font-bold text-white md:text-3xl">
            Vos coordonnées
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Nous vous rappelons sous 30 minutes.
          </p>

          <div className="mt-5 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="nom" className="mb-1.5 block text-sm font-medium text-white/80">
                  Nom <span className="text-accent">*</span>
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
                  className="w-full rounded-xl border border-white/20 bg-white/[0.07] px-4 py-3 text-white placeholder:text-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
                />
              </div>
              <div>
                <label htmlFor="telephone" className="mb-1.5 block text-sm font-medium text-white/80">
                  Téléphone <span className="text-accent">*</span>
                </label>
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="06 xx xx xx xx"
                  value={fields.telephone}
                  onChange={(e) => set('telephone', e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-white/[0.07] px-4 py-3 text-white placeholder:text-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/80">
                Email <span className="text-white/40 text-xs font-normal">(optionnel)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="votre@email.fr"
                value={fields.email}
                onChange={(e) => set('email', e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/[0.07] px-4 py-3 text-white placeholder:text-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-white/80">
                Précisions <span className="text-white/40 text-xs font-normal">(optionnel)</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                placeholder="Décrivez brièvement la situation…"
                value={fields.message}
                onChange={(e) => set('message', e.target.value)}
                className="w-full resize-none rounded-xl border border-white/20 bg-white/[0.07] px-4 py-3 text-white placeholder:text-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
              />
            </div>
          </div>

          <p className="mt-3 text-xs text-white/40 leading-relaxed">
            En envoyant ce formulaire, vous acceptez d'être recontacté au sujet de votre demande. Vos données ne sont pas revendues (voir notre{' '}
            <a href="/politique-confidentialite" className="underline hover:text-white/70 transition">
              politique de confidentialité
            </a>
            ).
          </p>

          {status === 'error' && (
            <p role="alert" className="mt-3 text-sm font-medium text-red-400">
              L'envoi a échoué. Appelez-nous directement au {siteConfig.phoneDisplay}.
            </p>
          )}

          <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center justify-center gap-1.5 text-sm text-white/50 hover:text-white transition sm:justify-start"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Retour
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!fields.nom || !fields.telephone || status === 'sending'}
              className={`btn-accent w-full sm:w-auto ${
                (!fields.nom || !fields.telephone) ? 'opacity-40 cursor-not-allowed hover:bg-accent' : ''
              }`}
            >
              {status === 'sending' ? 'Envoi en cours…' : 'Être rappelé rapidement'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
