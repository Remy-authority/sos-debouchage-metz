/**
 * lib/motion.ts, vocabulaire de mouvement du site.
 *
 * Transposé du code source de la référence PROTEC-DARD : même courbe d'accélération
 * (`[0.22, 1, 0.36, 1]`, un ease-out expressif), mêmes durées et mêmes distances de
 * translation. C'est ce fichier qui donne au site sa « patte » de motion : tout
 * composant animé doit consommer ces variants plutôt que d'inventer les siens.
 */
import type { Variants } from 'framer-motion'

/** Courbe maison, présente sur quasi toutes les transitions du site. */
export const EASE = [0.22, 1, 0.36, 1] as const

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

export const staggerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

/** Déclenchement au scroll : une seule fois, à 20 % de visibilité. */
export const viewportOnce = { once: true, amount: 0.2 } as const
