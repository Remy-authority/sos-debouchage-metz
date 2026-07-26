import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { siteConfig } from '@/config/site.config'

export function WhyUs() {
  return (
    <section
      className="relative bg-gradient-to-b from-sand-50 to-sand-100 py-24 lg:py-32"
      aria-labelledby="whyus-title"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeader
          id="whyus-title"
          eyebrow="Pourquoi nous"
          title={
            <>
              Quatre engagements,
              <br />
              <span className="text-gradient-ink italic">tenus à chaque appel</span>
            </>
          }
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {siteConfig.whyUs.map((item, idx) => (
            <AnimatedSection
              key={item.title}
              delay={(idx % 2) * 0.1}
              className="group relative overflow-hidden rounded-card border border-sand-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/40 hover:shadow-card-hover"
            >
              <span
                aria-hidden="true"
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/6 blur-2xl transition-opacity duration-500 group-hover:bg-accent-500/10"
              />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-950 text-brand-300">
                <ServiceIcon icon={item.icon} className="h-6 w-6" />
              </span>
              <h3 className="relative mt-6 text-2xl leading-snug">{item.title}</h3>
              <p className="relative mt-3 leading-relaxed text-sand-600">{item.desc}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
