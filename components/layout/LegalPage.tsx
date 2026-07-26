import type { ReactNode } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'

/**
 * Coquille commune des pages légales : même bandeau sombre que le reste du site,
 * puis une colonne de lecture centrée (jamais de texte collé à gauche avec un
 * grand blanc à droite).
 */
export function LegalPage({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <>
      <PageHeader eyebrow="Informations légales" title={title} subtitle={subtitle} />
      <section className="bg-sand-50 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <div className="prose-content space-y-10">{children}</div>
        </div>
      </section>
    </>
  )
}
