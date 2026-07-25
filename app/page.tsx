import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site.config'
import { getServices } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import CtaBanner from '@/components/ui/CtaBanner'
import Faq from '@/components/ui/Faq'
import LeadForm from '@/components/ui/LeadForm'
import Hero from '@/components/sections/Hero'
import TrustBadges from '@/components/sections/TrustBadges'
import About from '@/components/sections/About'
import Process from '@/components/sections/Process'
import Stats from '@/components/sections/Stats'
import WhyUs from '@/components/sections/WhyUs'
import ServiceAreaMap from '@/components/sections/ServiceAreaMap'
import Realisations from '@/components/sections/Realisations'
import { ServiceIcon } from '@/components/ui/ServiceIcon'

const TITLE = "Recherche de fuite d'eau à Angers, détection non destructive"
const DESC =
  "Recherche et détection de fuite d'eau à Angers et environs. Méthode non destructive, intervention rapide. Devis et prise de contact en ligne."

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESC, path: '/' })

export default function HomePage() {
  const services = getServices()
  // DEMO – contenu imaginé persona Thomas Mercier, à affiner par ST-5
  const homeFaq = siteConfig.homeFaq as unknown as { q: string; a: string }[]

  return (
    <>
      <Hero />
      <TrustBadges />

      {/* Services */}
      <section className="section" aria-labelledby="services-title">
        <div className="container-site">
          <div className="mb-8 text-center sm:text-left">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">Ce que nous faisons</p>
            <h2 id="services-title" className="text-2xl font-bold text-slate-900 md:text-3xl">Nos prestations</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group card block text-center transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-md sm:text-left"
              >
                <div className="mb-3 mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:mx-0">
                  <ServiceIcon icon={s.icon} className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-primary">{s.navTitle}</h3>
                <ul className="mt-3 mx-auto w-fit space-y-1 text-sm text-slate-600 sm:mx-0">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  En savoir plus
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Stats />
      <About />
      <Process />
      {siteConfig.features.gallery && <Realisations />}

      {/* Formulaire devis, section dédiée (recommandation CEO, form hors hero) */}
      <section id="devis" className="section bg-slate-100" aria-labelledby="devis-title">
        <div className="container-site">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">Devis gratuit</p>
              <h2 id="devis-title" className="text-2xl font-bold text-slate-900 md:text-3xl">
                Décrivez votre problème en 3 étapes
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Nous vous rappelons sous 30 minutes, sans engagement.
              </p>
            </div>
            <LeadForm />
          </div>
        </div>
      </section>

      <WhyUs />

      <CtaBanner />

      <ServiceAreaMap />

      <Faq items={homeFaq} />
    </>
  )
}
