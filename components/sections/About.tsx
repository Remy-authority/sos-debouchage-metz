import Image from 'next/image'
import { siteConfig } from '@/config/site.config'

export default function About() {
  return (
    <section className="section" aria-labelledby="about-title">
      <div className="container-site grid gap-10 md:grid-cols-2 md:items-center lg:gap-16">
        {/* Visuel, photo persona (DEMO – à remplacer par les infos du loueur) */}
        <div className="relative order-2 md:order-1">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
            {/* DEMO – photo IA placeholder. Vraie photo fournie par Rémy → public/thomas-mercier.jpg */}
            <Image
              src={siteConfig.persona.photo}
              alt={`${siteConfig.persona.name}, artisan détection fuite d'eau Angers`}
              width={560}
              height={420}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Badge flottant, DEMO – à remplacer par les infos du loueur */}
          <div className="absolute -bottom-4 -right-4 hidden rounded-xl bg-primary px-5 py-3 text-center text-white shadow-lg sm:block">
            {/* DEMO – à remplacer par les infos du loueur */}
            <p className="text-2xl font-extrabold leading-none">+500</p>
            <p className="mt-0.5 text-xs font-medium text-white/90">fuites résolues</p>
          </div>
        </div>

        {/* Texte */}
        <div className="order-1 md:order-2">
          {/* DEMO – nom persona à remplacer par les infos du loueur */}
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
            {siteConfig.persona.name}
          </p>
          <h2 id="about-title" className="text-2xl font-bold text-slate-900 md:text-3xl">
            {siteConfig.about.title}
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">{siteConfig.about.body}</p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5">
            <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span className="text-sm font-semibold text-primary">{siteConfig.about.highlight}</span>
          </div>

          <ul className="mt-6 space-y-3" role="list">
            {siteConfig.methods.map((m) => (
              <li key={m} className="flex items-center gap-3 text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
