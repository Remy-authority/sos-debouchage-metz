/**
 * lib/theme.ts, traduit `siteConfig.palette` (hex) en CSS variables (canaux RGB)
 * pour injection sur <html>. C'est le seul pont entre la config et Tailwind :
 * changer la palette d'un site N+1 revient à éditer `site.config.ts`.
 *
 * Nommage des variables : `--c-<famille>-<niveau>` (ex. `--c-brand-600`), valeur
 * « r g b » pour rester compatible avec les modificateurs d'opacité Tailwind
 * (bg-brand-600/10, text-accent-500/80…).
 */
import type { CSSProperties } from 'react'
import { siteConfig } from '@/config/site.config'

export function hexToRgbChannels(hex: string): string {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((ch) => ch + ch).join('') : h
  const n = parseInt(full, 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

/** Style inline à poser sur <html>, pilote tous les tokens Tailwind. */
export function themeCssVars(): CSSProperties {
  const vars: Record<string, string> = {}
  for (const [family, levels] of Object.entries(siteConfig.palette)) {
    for (const [level, hex] of Object.entries(levels as Record<string, string>)) {
      vars[`--c-${family}-${level}`] = hexToRgbChannels(hex)
    }
  }
  return vars as CSSProperties
}
