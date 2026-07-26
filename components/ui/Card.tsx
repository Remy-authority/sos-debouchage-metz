import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  variant?: 'light' | 'dark' | 'glass'
  interactive?: boolean
}

const variants = {
  light: 'border border-sand-200 bg-white shadow-card',
  dark: 'border border-ink-700/50 bg-ink-900/50 text-sand-50 backdrop-blur-md',
  glass: 'border border-white/40 bg-white/70 shadow-card backdrop-blur-lg',
}

export function Card({ children, className = '', variant = 'light', interactive = false }: Props) {
  const hover = interactive
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover'
    : ''
  return <div className={`rounded-card p-8 ${variants[variant]} ${hover} ${className}`}>{children}</div>
}
