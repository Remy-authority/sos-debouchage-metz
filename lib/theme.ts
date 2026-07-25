/**
 * lib/theme.ts, Traduit siteConfig.colors (hex) en CSS variables (canaux RGB)
 * pour injection dans <html>. Un changement de 3 hex re-thème tout le site.
 */
import type { CSSProperties } from 'react'
import { siteConfig } from '@/config/site.config'

function hexToRgbChannels(hex: string): string {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `${r} ${g} ${b}`
}

/** Style inline à poser sur <html>, pilote les tokens Tailwind via CSS vars. */
export function themeCssVars(): CSSProperties {
  const c = siteConfig.colors
  return {
    '--color-primary-rgb': hexToRgbChannels(c.primary),
    '--color-primary-dark-rgb': hexToRgbChannels(c.primaryDark),
    '--color-accent-rgb': hexToRgbChannels(c.accent),
    '--color-dark-rgb': hexToRgbChannels(c.dark),
    '--color-light-rgb': hexToRgbChannels(c.light),
  } as CSSProperties
}
