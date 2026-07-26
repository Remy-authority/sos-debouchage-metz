import type { Config } from 'tailwindcss'

/**
 * tailwind.config.ts, design tokens branchés sur les CSS variables émises par
 * lib/theme.ts depuis `siteConfig.palette`. Aucune couleur en dur ici : changer
 * les 4 échelles dans site.config.ts re-thème tout le site (clé du template N+1).
 *
 * Système de design transposé de la référence PROTEC-DARD :
 *  - deux familles de police, Inter (UI, corps) et Fraunces (display, titres)
 *  - rayons généreux (cartes 24px, panneaux 32px, blocs héros 40px, boutons ronds)
 *  - ombres douces à deux couches, halos animés, textures de bruit et de grille
 */
const c = (v: string) => `rgb(var(${v}) / <alpha-value>)`

const scale = (family: string, levels: number[]) =>
  Object.fromEntries(levels.map((l) => [l, c(`--c-${family}-${l}`)]))

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: scale('ink', [600, 700, 800, 900, 950]),
        sand: scale('sand', [50, 100, 200, 300, 400, 500, 600, 700]),
        brand: {
          ...scale('brand', [300, 400, 500, 600, 700]),
          DEFAULT: c('--c-brand-600'),
        },
        accent: {
          ...scale('accent', [300, 400, 500, 600]),
          DEFAULT: c('--c-accent-500'),
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'ui-serif', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '1.5rem',
        panel: '2rem',
        hero: '2.5rem',
      },
      boxShadow: {
        card: '0 1px 2px rgb(7 26 30 / 0.05), 0 8px 24px -8px rgb(7 26 30 / 0.12)',
        'card-hover': '0 4px 12px rgb(7 26 30 / 0.08), 0 24px 48px -12px rgb(7 26 30 / 0.2)',
        glow: '0 0 40px -10px rgb(var(--c-accent-500) / 0.55)',
        'glow-brand': '0 0 44px -12px rgb(var(--c-brand-400) / 0.5)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        /* Filet lumineux qui « descend » dans un tube : signature visuelle du métier. */
        'flow-down': {
          '0%': { transform: 'translateY(-120%)', opacity: '0' },
          '18%': { opacity: '1' },
          '82%': { opacity: '1' },
          '100%': { transform: 'translateY(340%)', opacity: '0' },
        },
      },
      animation: {
        shimmer: 'shimmer 8s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'flow-down': 'flow-down 3.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
