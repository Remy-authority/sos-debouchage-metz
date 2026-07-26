'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import { EASE } from '@/lib/motion'
import { siteConfig } from '@/config/site.config'

/**
 * Bande de chiffres, comptés à l'entrée dans le viewport.
 *
 * ⚠️ Règle éditoriale : ces chiffres décrivent uniquement le FONCTIONNEMENT du
 * service (disponibilité annoncée, rayon, nombre de prestations). Aucun chiffre
 * d'activité (interventions réalisées, années d'expérience) tant que Rémy n'a pas
 * fourni de données réelles.
 */
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [inView, value])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-16 lg:py-20">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(var(--c-accent-500)/0.12),transparent_58%)]"
      />
      <div className="rule-glow absolute inset-x-0 top-0" aria-hidden="true" />
      <div className="rule-glow absolute inset-x-0 bottom-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dd className="font-display text-5xl font-medium tracking-tight text-accent-400 lg:text-6xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="mt-3 text-sm uppercase tracking-[0.18em] text-sand-300">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
