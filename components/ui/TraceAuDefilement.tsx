'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Enveloppe qui pose `data-etat` sur son bloc : « fixe » au rendu serveur (tout
 * visible, robots et sans JavaScript), « cache » au montage si le bloc est encore
 * sous l'écran, puis « vu » quand il y entre. Le CSS du bloc fait le reste
 * (traits qui se tracent, aplats qui se posent). « Réduire les animations » :
 * on reste en « fixe ».
 */
export function TraceAuDefilement({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [etat, setEtat] = useState<'fixe' | 'cache' | 'vu'>('fixe')

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return
    setEtat('cache')
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setEtat('vu')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -18% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} data-etat={etat} className={className}>
      {children}
    </div>
  )
}
