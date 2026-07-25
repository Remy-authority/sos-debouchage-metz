import Link from 'next/link'
import PhoneButton from './PhoneButton'
import { siteConfig } from '@/config/site.config'

export default function CtaBanner({
  title = `Une fuite d'eau à ${siteConfig.city} ? On intervient vite.`,
  subtitle = siteConfig.responseTime,
}: {
  title?: string
  subtitle?: string
}) {
  return (
    <section className="section" aria-label="Nous contacter">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-2xl bg-dark px-6 py-12 text-center text-white md:px-14">
          {/* Halo décoratif */}
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative">
            <p className="mb-3 inline-block rounded-full bg-accent/20 px-4 py-1 text-sm font-semibold text-accent">
              {siteConfig.availability}
            </p>
            <h2 className="text-2xl font-bold text-white md:text-3xl">{title}</h2>
            <p className="mt-2 text-slate-300">{subtitle}</p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <PhoneButton label={`Appeler le ${siteConfig.phoneDisplay}`} className="btn-accent shadow-lg shadow-accent/30" />
              <Link
                href="/contact"
                className="btn-outline !border-white/30 !bg-transparent !text-white hover:!bg-white/10"
              >
                Devis gratuit en ligne
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
