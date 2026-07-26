import Link from 'next/link'
import type { Metadata } from 'next'
import { Check, Phone } from 'lucide-react'
import { siteConfig } from '@/config/site.config'
import { buildMetadata } from '@/lib/seo'
import { Button } from '@/components/ui/Button'

// Page utilitaire post-soumission → noindex.
export const metadata: Metadata = buildMetadata({
  title: 'Demande reçue',
  description: 'Votre demande a bien été reçue.',
  path: '/merci',
  noindex: true,
})

export default function MerciPage() {
  return (
    <section className="noise-overlay relative flex min-h-[80vh] items-center overflow-hidden bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 px-6 pb-24 pt-32">
      <div aria-hidden="true" className="bg-grid absolute inset-0" />
      <div className="relative mx-auto max-w-lg text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-white">
          <Check size={30} strokeWidth={2.5} aria-hidden="true" />
        </span>
        <h1 className="mt-8 text-4xl text-sand-50 md:text-5xl">Demande reçue</h1>
        <p className="mt-5 leading-relaxed text-sand-300">
          Nous vous rappelons dès que possible. Si la situation s&apos;aggrave d&apos;ici là, ne
          patientez pas : appelez directement, la ligne est ouverte {siteConfig.availability}.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <Button href={`tel:${siteConfig.phone}`} variant="accent" size="lg">
            <Phone size={18} strokeWidth={2.5} />
            {siteConfig.phoneDisplay}
          </Button>
          <Link href="/" className="text-sm text-sand-400 transition-colors hover:text-accent-300">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </section>
  )
}
