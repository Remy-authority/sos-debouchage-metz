import type { ReactNode } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FaqAccordion } from '@/components/ui/FaqAccordion'
import { faqJsonLd, jsonLdScript } from '@/lib/seo'
import type { FaqItem } from '@/lib/content'

/**
 * Bloc FAQ : accordéon animé + données structurées FAQPage.
 *
 * Levier GEO central du site (cf. docs/SEO-GEO-PLAN.md §3) : chaque réponse doit
 * rester compréhensible citée seule, hors du contexte de la page.
 */
export function Faq({
  items,
  title,
  eyebrow = 'FAQ',
  subtitle,
}: {
  items: FaqItem[]
  title?: ReactNode
  eyebrow?: string
  subtitle?: string
}) {
  if (!items?.length) return null

  return (
    <section
      id="faq"
      className="relative bg-gradient-to-b from-sand-50 to-sand-100 py-24 lg:py-32"
      aria-labelledby="faq-title"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd(items)) }}
      />
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <SectionHeader
          id="faq-title"
          eyebrow={eyebrow}
          title={
            title ?? (
              <>
                Questions
                <span className="text-gradient-ink italic"> fréquentes</span>
              </>
            )
          }
          subtitle={subtitle}
        />
        <FaqAccordion items={items} />
      </div>
    </section>
  )
}

export default Faq
