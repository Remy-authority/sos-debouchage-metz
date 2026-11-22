import type { ReactNode } from 'react'
import { Phone } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { LeadForm } from '@/components/ui/LeadForm'
import { NoteGoogle } from '@/components/ui/Atelier'
import { siteConfig } from '@/config/site.config'

/**
 * Dernier bloc de chaque page, juste au-dessus du pied de page : le formulaire (Rémy 22/11/2026,
 * « le deuxième formulaire, il est tout en bas du site, juste au-dessus du footer » ; #R71).
 * Peu de texte : un titre, une phrase, le numéro. Ordinateur : texte à gauche, formulaire à
 * droite, centrés l'un sur l'autre. Téléphone : tout centré, le formulaire dessous.
 */
export function CtaBanner({
  title,
  subtitle,
}: {
  title?: ReactNode
  subtitle?: ReactNode
}) {
  return (
    <section id="appel" aria-labelledby="appel-titre" className="bg-sand-100 py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-16 lg:px-10">
        <AnimatedSection className="text-center lg:text-left">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-accent-600">
            Devis gratuit · {siteConfig.availability}
          </p>
          <h2
            id="appel-titre"
            className="mt-4 text-[clamp(1.9rem,4.4vw,3.25rem)] leading-[1.08] text-ink-950 [text-wrap:balance]"
          >
            {title ?? (
              <>
                Canalisation bouchée&nbsp;?
                <br />
                <span className="text-gradient-ink italic">On vous rappelle.</span>
              </>
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-[26rem] text-[16px] leading-snug text-ink-900/75 [text-wrap:balance] lg:mx-0 lg:text-[17px]">
            {subtitle ?? 'Trois questions, une minute. Le prix est annoncé avant de venir.'}
          </p>
          <a
            href={`tel:${siteConfig.phone}`}
            className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-ink-950 underline-offset-4 hover:underline"
          >
            <Phone size={17} strokeWidth={2.5} className="text-accent-600" />
            Ou appelez le {siteConfig.phoneDisplay}
          </a>
          <NoteGoogle className="mt-6" />
        </AnimatedSection>

        <div className="mx-auto w-full max-w-[28rem] lg:mx-0">
          <LeadForm idPrefix="f-" />
        </div>
      </div>
    </section>
  )
}

export default CtaBanner
