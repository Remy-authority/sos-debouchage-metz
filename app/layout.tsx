import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import { siteConfig } from '@/config/site.config'
import { themeCssVars } from '@/lib/theme'
import { buildMetadata, jsonLdScript, localBusinessJsonLd } from '@/lib/seo'
import { getServices } from '@/lib/content'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyCTA } from '@/components/layout/StickyCTA'

/**
 * Deux familles, comme la référence PROTEC-DARD : Inter pour l'interface et le
 * corps de texte, Fraunces pour tous les titres. Les deux sont auto-hébergées au
 * build par next/font (aucune requête Google au runtime, pas de FOUT).
 */
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz', 'SOFT'],
})

const homeTitle = `${siteConfig.trade} à ${siteConfig.city}, intervention rapide`
const homeDesc = `Débouchage et curage de canalisations à ${siteConfig.city} et dans l'agglomération. WC, évier, douche, colonne d'immeuble, regard. Prix annoncé avant intervention.`

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.seo.canonicalBase),
  title: {
    default: homeTitle,
    template: `%s, ${siteConfig.businessName}`,
  },
  ...buildMetadata({ title: homeTitle, description: homeDesc, path: '/' }),
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: siteConfig.colors.light },
    { media: '(prefers-color-scheme: dark)', color: siteConfig.colors.dark },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const services = getServices().map((s) => ({ slug: s.slug, navTitle: s.navTitle }))

  return (
    <html
      lang={siteConfig.seo.lang}
      className={`${inter.variable} ${fraunces.variable}`}
      style={themeCssVars()}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(localBusinessJsonLd()) }}
        />
      </head>
      <body className="bg-sand-50">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink-950 focus:px-5 focus:py-3 focus:text-sand-50"
        >
          Aller au contenu
        </a>
        <Header services={services} />
        <main id="main">{children}</main>
        <Footer />
        <StickyCTA />
      </body>
    </html>
  )
}
