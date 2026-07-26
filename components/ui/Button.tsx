import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

/**
 * Bouton unique du site. Boutons pleinement arrondis, micro-échelle au survol et
 * halo coloré : la signature d'action reprise de la référence PROTEC-DARD.
 *
 * Règle de couleur du site : `accent` (vermillon) est réservé à l'ACTION urgente
 * (appel, devis). `brand` (teal) porte les actions secondaires et la structure.
 */
type Variant = 'accent' | 'brand' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50 disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  accent:
    'bg-accent-500 text-white hover:bg-accent-400 hover:scale-[1.02] hover:shadow-glow active:scale-100',
  brand:
    'bg-brand-600 text-white hover:bg-brand-500 hover:scale-[1.02] hover:shadow-glow-brand active:scale-100',
  ghost:
    'border border-white/20 bg-white/10 text-sand-50 backdrop-blur-md hover:border-white/35 hover:bg-white/20',
  outline:
    'border-2 border-ink-950 bg-transparent text-ink-950 hover:bg-ink-950 hover:text-sand-50',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-5 text-sm',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-14 px-8 text-base',
}

type Common = {
  variant?: Variant
  size?: Size
  children: ReactNode
  className?: string
}

type AnchorProps = Common & ComponentProps<'a'> & { href: string }
type ButtonProps = Common & ComponentProps<'button'> & { href?: undefined }

export function Button(props: AnchorProps | ButtonProps) {
  const { variant = 'accent', size = 'md', children, className = '', ...rest } = props
  const styles = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if ('href' in props && props.href) {
    const external = /^(https?:|tel:|mailto:)/.test(props.href)
    if (external) {
      return (
        <a className={styles} {...(rest as ComponentProps<'a'>)}>
          {children}
        </a>
      )
    }
    const { href, ...anchorRest } = rest as ComponentProps<'a'>
    void href
    return (
      <Link href={props.href} className={styles} {...anchorRest}>
        {children}
      </Link>
    )
  }

  return (
    <button className={styles} {...(rest as ComponentProps<'button'>)}>
      {children}
    </button>
  )
}
