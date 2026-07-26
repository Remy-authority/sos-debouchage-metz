import type { ReactNode } from 'react'
import { AnimatedSection } from './AnimatedSection'

/**
 * En-tête de section : eyebrow en capitales espacées, titre display en Fraunces,
 * sous-titre en corps large. Toutes les sections du site passent par ici, c'est ce
 * qui donne au rythme éditorial sa régularité.
 */
type Props = {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  align?: 'left' | 'center'
  variant?: 'light' | 'dark'
  as?: 'h1' | 'h2'
  id?: string
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  variant = 'light',
  as: Tag = 'h2',
  id,
}: Props) {
  const dark = variant === 'dark'
  return (
    <AnimatedSection className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`}>
      {eyebrow && (
        <p
          className={`mb-4 text-sm font-semibold uppercase tracking-[0.2em] ${
            dark ? 'text-accent-400' : 'text-accent-600'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        id={id}
        className={`text-4xl leading-[1.1] md:text-5xl lg:text-[3.5rem] ${
          dark ? 'text-sand-50' : 'text-ink-950'
        }`}
      >
        {title}
      </Tag>
      {subtitle && (
        <p
          className={`mt-6 text-lg leading-relaxed md:text-xl ${
            dark ? 'text-sand-200' : 'text-sand-600'
          }`}
        >
          {subtitle}
        </p>
      )}
    </AnimatedSection>
  )
}
