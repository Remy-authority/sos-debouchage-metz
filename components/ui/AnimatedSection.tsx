'use client'

import { motion, type Variants } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'
import { fadeInUp, viewportOnce } from '@/lib/motion'

type Props = {
  children: ReactNode
  className?: string
  variants?: Variants
  delay?: number
  as?: ElementType
  id?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

/**
 * Enveloppe d'apparition au scroll. Une seule primitive pour tout le site : c'est
 * elle qui garantit que chaque bloc entre avec le même timing et la même courbe.
 */
export function AnimatedSection({
  children,
  className = '',
  variants = fadeInUp,
  delay = 0,
  as = 'div',
  id,
  ...rest
}: Props) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div

  return (
    <MotionTag
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={variants}
      transition={{ delay }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
