'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Camera, Euro, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { GradientBlob } from '@/components/ui/GradientBlob'
import { LiveDot } from '@/components/ui/LiveDot'
import { EASE } from '@/lib/motion'
import { siteConfig } from '@/config/site.config'

const badges = [
  { icon: Euro, label: 'Prix annoncé avant' },
  { icon: ShieldCheck, label: 'Sans casse' },
  { icon: Camera, label: 'Inspection caméra' },
  { icon: MapPin, label: `${siteConfig.serviceArea.radiusKm} km autour de ${siteConfig.city}` },
]

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      ref={ref}
      id="top"
      className="noise-overlay relative isolate flex min-h-[92vh] items-center overflow-hidden bg-ink-950 pb-20 pt-28 lg:pt-36"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(var(--c-ink-800)/0.75),transparent_62%),radial-gradient(ellipse_at_bottom_right,rgb(var(--c-accent-500)/0.16),transparent_55%),linear-gradient(180deg,rgb(var(--c-ink-950))_0%,rgb(var(--c-ink-900))_52%,rgb(var(--c-ink-950))_100%)]"
      />

      {/* Photo d'ambiance, très en retrait. Fondue par le bas sur mobile (le texte
          occupe le haut), fondue par la droite à partir du desktop. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-full opacity-[0.12] [mask-image:linear-gradient(180deg,transparent_35%,black)] lg:w-[54%] lg:opacity-20 lg:[mask-image:linear-gradient(90deg,transparent,black_48%)]"
      >
        <Image src="/hero.jpg" alt="" fill priority sizes="(min-width: 1024px) 54vw, 100vw" className="object-cover" />
      </div>

      <div aria-hidden="true" className="bg-grid absolute inset-0" />

      <GradientBlob className="-left-40 top-4" color="deep" size={520} intensity="strong" duration={22} />
      <GradientBlob className="-right-48 bottom-0" color="brand" size={620} intensity="strong" duration={18} />
      <GradientBlob className="left-1/3 top-1/4" color="accent" size={440} intensity="strong" duration={15} />

      <motion.div
        style={{ y, opacity }}
        className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:px-10 xl:grid-cols-12"
      >
        <div className="xl:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <LiveDot>Ligne urgence ouverte, week-ends et jours fériés compris</LiveDot>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mt-7 text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] text-sand-50"
          >
            Canalisation
            <br />
            bouchée à {siteConfig.city},
            <br />
            <span className="text-gradient-accent">réglée sans casse.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-sand-200 md:text-xl"
          >
            Évier qui refoule, WC bouché, colonne d&apos;immeuble saturée, regard qui déborde.
            Nous débouchons au furet ou à l&apos;hydrocureur, nous passons la caméra quand la cause
            reste incertaine, et nous annonçons le prix avant de commencer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Button href={`tel:${siteConfig.phone}`} variant="accent" size="lg">
              <Phone size={18} strokeWidth={2.5} />
              {siteConfig.phoneDisplay}
            </Button>
            <Button href="/contact#formulaire" variant="ghost" size="lg">
              Décrire mon problème
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            {badges.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-sand-300">
                <Icon size={16} className="shrink-0 text-brand-300" strokeWidth={2.4} />
                {label}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          className="relative hidden xl:col-span-5 xl:block"
        >
          <div className="relative mx-auto max-w-md">
            <div
              aria-hidden="true"
              className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-brand-500/25 via-accent-500/10 to-transparent blur-3xl"
            />

            <div className="relative overflow-hidden rounded-hero border border-brand-400/25 bg-gradient-to-br from-ink-800/70 to-ink-950/85 p-8 backdrop-blur-xl">
              <span className="inline-flex rounded-full border border-brand-400/40 bg-brand-500/10 px-3 py-1 text-xs uppercase tracking-wider text-brand-300">
                Comment on travaille
              </span>

              <p className="mt-7 font-display text-2xl font-medium leading-snug text-sand-50">
                Le prix est annoncé avant qu&apos;on ouvre la mallette.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-sand-300">
                Vous décrivez le symptôme, nous annonçons la prestation et son tarif. Si ce qu&apos;on
                trouve sur place change la donne, vous le savez avant, pas après.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-ink-900/70 p-4">
                  <p className="font-display text-3xl font-medium text-accent-400">24h/24</p>
                  <p className="mt-1 text-xs text-sand-400">Ligne urgence</p>
                </div>
                <div className="rounded-2xl bg-ink-900/70 p-4">
                  <p className="font-display text-3xl font-medium text-accent-400">
                    {siteConfig.serviceArea.radiusKm} km
                  </p>
                  <p className="mt-1 text-xs text-sand-400">Autour de {siteConfig.city}</p>
                </div>
              </div>

              <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-sand-400">
                <ShieldCheck size={14} className="mt-0.5 shrink-0 text-brand-300" />
                Furet électrique, hydrocureur haute pression et caméra d&apos;inspection dans le camion.
              </p>
            </div>

            {/* Signature du métier : un filet qui descend dans un tube. */}
            <div
              aria-hidden="true"
              className="absolute -right-5 -top-7 h-24 w-11 overflow-hidden rounded-full border border-brand-400/30 bg-ink-950/70 backdrop-blur"
            >
              <span className="absolute left-1/2 top-0 h-8 w-1.5 -translate-x-1/2 animate-flow-down rounded-full bg-gradient-to-b from-transparent via-accent-400 to-transparent" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
