import Link from 'next/link'
import { Phone } from 'lucide-react'
import { siteConfig } from '@/config/site.config'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="noise-overlay relative flex min-h-[80vh] items-center overflow-hidden bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 px-6 pb-24 pt-32">
      <div aria-hidden="true" className="bg-grid absolute inset-0" />
      <div className="relative mx-auto max-w-lg text-center">
        <p className="font-display text-7xl font-medium text-accent-400">404</p>
        <h1 className="mt-6 text-3xl text-sand-50 md:text-4xl">Cette page n&apos;existe pas</h1>
        <p className="mt-4 leading-relaxed text-sand-300">
          Le lien est peut-être ancien ou mal recopié. Repartez de l&apos;accueil, ou appelez-nous si
          c&apos;est urgent.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/" variant="brand" size="lg">
            Retour à l&apos;accueil
          </Button>
          <Button href={`tel:${siteConfig.phone}`} variant="ghost" size="lg">
            <Phone size={18} strokeWidth={2.5} />
            {siteConfig.phoneDisplay}
          </Button>
        </div>
        <Link
          href="/zones"
          className="mt-8 inline-block text-sm text-sand-400 transition-colors hover:text-accent-300"
        >
          Voir nos zones d&apos;intervention
        </Link>
      </div>
    </section>
  )
}
