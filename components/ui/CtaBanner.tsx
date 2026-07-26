import { Clock, Phone } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Button } from '@/components/ui/Button'
import { LiveDot } from '@/components/ui/LiveDot'
import { siteConfig } from '@/config/site.config'

/**
 * Bandeau d'appel à l'action, présent en fin de chaque page. Transition de fond
 * du crème vers le pétrole : c'est lui qui prépare l'entrée dans le footer sombre.
 */
export function CtaBanner({
  title,
  subtitle,
}: {
  title?: string
  subtitle?: string
}) {
  return (
    <section
      id="appel"
      className="relative overflow-hidden bg-gradient-to-b from-sand-100 to-ink-950 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <AnimatedSection className="relative overflow-hidden rounded-hero border border-brand-400/25 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-950 p-10 text-center lg:p-16">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(var(--c-accent-500)/0.2),transparent_58%)]"
          />
          <div aria-hidden="true" className="bg-grid absolute inset-0" />

          <div className="relative">
            <LiveDot>Ligne ouverte {siteConfig.availability}</LiveDot>

            <h2 className="mt-7 text-[clamp(2rem,5vw,3.75rem)] leading-[1.06] text-sand-50">
              {title ?? (
                <>
                  Ça déborde chez vous ?
                  <br />
                  <span className="text-gradient-accent">Appelez, on décroche.</span>
                </>
              )}
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-sand-300">
              {subtitle ??
                "Décrivez le symptôme en deux phrases. Nous vous disons quelle prestation s'impose, ce qu'elle coûte et sous quel délai nous pouvons passer."}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href={`tel:${siteConfig.phone}`} variant="accent" size="lg">
                <Phone size={20} strokeWidth={2.5} />
                {siteConfig.phoneDisplay}
              </Button>
              <Button href="/contact#formulaire" variant="ghost" size="lg">
                Écrire ma demande
              </Button>
            </div>

            <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-sand-400">
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-accent-400" />
                {siteConfig.availability}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-sand-500" aria-hidden="true" />
                Sans engagement
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-sand-500" aria-hidden="true" />
                Prix annoncé avant
              </li>
            </ul>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

export default CtaBanner
