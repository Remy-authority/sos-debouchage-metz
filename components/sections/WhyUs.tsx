import { siteConfig } from '@/config/site.config'

const ICONS: Record<string, React.ReactNode> = {
  shield: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  clock: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  star: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  doc: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
}

export default function WhyUs() {
  const reasons = siteConfig.whyUs

  return (
    <section className="section" aria-labelledby="why-title">
      <div className="container-site">
        <div className="mb-10 text-center md:mb-12 sm:text-left">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">Pourquoi nous choisir</p>
          <h2 id="why-title" className="text-2xl font-bold text-slate-900 md:text-3xl">
            La détection qui ne laisse pas de traces
          </h2>
        </div>

        <dl className="grid gap-6 sm:grid-cols-2">
          {reasons.map((r) => (
            <div key={r.title} className="flex flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm sm:flex-row sm:items-start sm:gap-5 sm:text-left">
              <dt className="shrink-0">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {ICONS[r.icon] ?? (
                    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  )}
                </span>
              </dt>
              <div>
                <dt className="font-bold text-slate-900">{r.title}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-slate-600">{r.desc}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
