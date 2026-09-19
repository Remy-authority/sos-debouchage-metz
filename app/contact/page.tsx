import type { Metadata } from 'next'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { siteConfig } from '@/config/site.config'
import { buildMetadata } from '@/lib/seo'
import { PageHeader } from '@/components/layout/PageHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { LeadForm } from '@/components/ui/LeadForm'
import { Faq } from '@/components/ui/Faq'
import { CtaBanner } from '@/components/ui/CtaBanner'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { getServices } from '@/lib/content'

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

/**
 * FAQ propre à la prise de contact : ce qu'on demande avant d'appeler, pas les
 * questions techniques de l'accueil (règle de navigation du portefeuille,
 * 03/09/2026 : une page contact n'est jamais un formulaire nu).
 */
const contactFaq = [
  {
    q: 'Vaut-il mieux appeler ou remplir le formulaire ?',
    a: "Si l'eau monte, si un regard déborde ou si plusieurs évacuations refoulent en même temps, appelez : nous vous guidons tout de suite sur les gestes à faire en attendant, et nous vous donnons un créneau. Le formulaire convient pour un écoulement qui ralentit, une odeur persistante ou un devis d'entretien, tout ce qui peut attendre quelques heures.",
  },
  {
    q: 'Que faut-il me dire au téléphone pour que le prix soit juste ?',
    a: "Quel appareil est touché (WC, évier, douche, regard, colonne), depuis quand, si une seule ou plusieurs évacuations sont concernées, si vous avez un regard de visite accessible, et si vous êtes locataire, propriétaire ou syndic. Avec ces cinq éléments, nous savons dans quelle prestation vous êtes et nous annonçons son tarif avant de nous déplacer.",
  },
  {
    q: 'Répondez-vous le soir, le week-end et les jours fériés ?',
    a: "Oui, la ligne est ouverte 7j/7 pour les urgences sur Metz et les communes de l'agglomération. Un refoulement d'eaux usées dans un logement occupé ne peut pas attendre le lundi.",
  },
  {
    q: 'Que se passe-t-il après l\u2019envoi du formulaire ?',
    a: "Votre demande arrive directement chez nous, sans passer par une plateforme. Nous vous rappelons pour préciser la situation, confirmer la prestation et son prix, puis fixer un créneau. Vous n'êtes engagé à rien tant que vous n'avez pas dit oui.",
  },
  {
    q: 'Intervenez-vous pour un syndic, un bailleur ou une entreprise ?',
    a: "Oui. Colonne d'immeuble, parties communes, bac à graisse de restaurant, réseau d'un local commercial : nous intervenons pour les professionnels comme pour les particuliers, avec un compte rendu d'intervention.",
  },
]

export default function ContactPage() {
  const services = getServices()
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

        <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-10">
          <AnimatedSection>
            <h2 className="text-center text-2xl lg:text-left">
              Pour quelle intervention nous écrivez-vous ?
            </h2>
            <p className="mt-3 text-center leading-relaxed text-sand-600 lg:text-left">
              Chaque prestation a sa page : ce qu&apos;elle traite, comment elle se déroule et ce
              qu&apos;elle coûte. Le détail des prix est réuni sur la{' '}
              <Link
                href="/tarifs"
                className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-600"
              >
                page des tarifs
              </Link>
              .
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex h-full items-center gap-3 rounded-card border border-sand-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400/40 hover:shadow-card"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600">
                      <ServiceIcon icon={s.icon} className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium text-ink-900 group-hover:text-brand-700">
                      {s.navTitle}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </section>

      <Faq
        items={contactFaq}
        eyebrow="Avant de nous écrire"
        subtitle="Ce qu'on nous demande le plus souvent au moment de prendre contact."
      />

      <CtaBanner />
    </>
  )
}
