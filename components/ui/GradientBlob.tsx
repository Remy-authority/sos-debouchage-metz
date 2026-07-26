'use client'

import { motion } from 'framer-motion'

/**
 * Halo coloré flou et animé, posé derrière les sections sombres. Reprend le
 * principe du GradientBlob de PROTEC-DARD (dérive lente sur 14 à 22 s, rotation
 * légère, échelle qui respire), avec les teintes du site.
 */
type Props = {
  className?: string
  color?: 'brand' | 'accent' | 'deep' | 'mixed'
  size?: number
  duration?: number
  intensity?: 'subtle' | 'normal' | 'strong'
}

const gradients: Record<NonNullable<Props['color']>, string> = {
  brand:
    'radial-gradient(circle at 30% 30%, rgb(var(--c-brand-400) / 0.5), rgb(var(--c-brand-600) / 0.2) 40%, transparent 70%)',
  accent:
    'radial-gradient(circle at 30% 30%, rgb(var(--c-accent-400) / 0.45), rgb(var(--c-accent-600) / 0.18) 40%, transparent 70%)',
  deep:
    'radial-gradient(circle at 30% 30%, rgb(var(--c-ink-600) / 0.55), rgb(var(--c-ink-900) / 0.15) 40%, transparent 70%)',
  mixed:
    'radial-gradient(circle at 30% 30%, rgb(var(--c-brand-300) / 0.38), rgb(var(--c-accent-500) / 0.18) 45%, transparent 72%)',
}

const ranges = {
  subtle: { x: 60, y: 50, scale: 0.08 },
  normal: { x: 140, y: 110, scale: 0.18 },
  strong: { x: 220, y: 180, scale: 0.3 },
}

export function GradientBlob({
  className = '',
  color = 'brand',
  size = 560,
  duration = 18,
  intensity = 'normal',
}: Props) {
  const r = ranges[intensity]

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-3xl mix-blend-screen ${className}`}
      style={{ width: size, height: size, background: gradients[color], willChange: 'transform' }}
      animate={{
        x: [0, r.x, -r.x * 0.7, r.x * 0.4, 0],
        y: [0, -r.y * 0.6, r.y, -r.y * 0.4, 0],
        scale: [1, 1 + r.scale, 1 - r.scale * 0.5, 1 + r.scale * 0.7, 1],
        rotate: [0, 30, -20, 15, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        times: [0, 0.25, 0.5, 0.75, 1],
      }}
    />
  )
}
