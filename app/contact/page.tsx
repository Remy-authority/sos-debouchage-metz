import type { Metadata } from 'next'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { siteConfig } from '@/config/site.config'
import { buildMetadata } from '@/lib/seo'
import { PageHeader } from '@/components/layout/PageHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Button } from '@/components/ui/Button'
import { LeadForm } from '@/components/ui/LeadForm'
import { CtaBanner } from '@/components/ui/CtaBanner'

export const metadata: Metadata = buildMetadata({
  title: 'Contact et demande d’intervention',
  description: `Contactez ${siteConfig.businessName} pour un débouchage de canalisation à ${siteConfig.city} et dans l'agglomération. Ligne ouverte 7j/7, prix annoncé avant intervention.`,
  path: '/contact',
})

const infos = [
  { icon: Phone, label: 'Téléphone', value: siteConfig.phoneDisplay, href: `tel:${siteConfig.phone}` },
  { icon: Mail, label: 'Email', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: Clock, label: 'Disponibilité', value: siteConfig.availability },
  {
    icon: MapPin,
    label: 'Zone',
    value: `${siteConfig.city} et environ ${siteConfig.serviceArea.radiusKm} km autour`,
  },
]

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Dites-nous ce qui
            <span className="text-gradient-accent"> ne s&apos;écoule plus</span>
          </>
        }
        subtitle="Par téléphone pour une urgence, par le formulaire si ça peut attendre quelques heures."
      />

      <section className="bg-sand-50 py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-5">
            <AnimatedSection>
              <h2 className="text-3xl">Nous joindre</h2>
              <p className="mt-4 leading-relaxed text-sand-600">
                Une canalisation qui refoule ne se décrit pas bien par écrit. Si l&apos;eau monte,
                appelez : c&apos;est plus rapide et nous pouvons vous guider tout de suite sur les
                gestes à faire en attendant.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.1} className="mt-8 space-y-3">
              {infos.map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 rounded-card border border-sand-200 bg-white p-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600">
                    <Icon size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sand-500">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="mt-1 block break-all font-medium text-ink-950 transition-colors hover:text-brand-600"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 font-medium text-ink-950">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="mt-8">
              <Button href={`tel:${siteConfig.phone}`} variant="accent" size="lg" className="w-full">
                <Phone size={18} strokeWidth={2.5} />
                Appeler maintenant
              </Button>
            </AnimatedSection>
          </div>

          <div className="lg:col-span-7">
            <div id="formulaire" className="scroll-mt-28">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
