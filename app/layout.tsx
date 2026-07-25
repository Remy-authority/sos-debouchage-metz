import type { Metadata } from 'next'
import { Sora } from 'next/font/google'
import './globals.css'
import { siteConfig } from '@/config/site.config'
import { themeCssVars } from '@/lib/theme'
import { absUrl, buildMetadata, jsonLdScript, plumberJsonLd } from '@/lib/seo'
import Header from '@/components/sections/Header'
import Footer from '@/components/sections/Footer'
import MobileStickyBar from '@/components/ui/MobileStickyBar'
import FloatingCallButton from '@/components/ui/FloatingCallButton'

// next/font = polices self-hostées au build (pas de requête Google runtime, pas de FOUT).
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' })

const homeTitle = `${siteConfig.trade} à ${siteConfig.city}, ${siteConfig.businessName}`
const homeDesc = `${siteConfig.trade} à ${siteConfig.city} et environs. Méthode non destructive, intervention rapide.`

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.seo.canonicalBase),
  title: {
    default: homeTitle,
    template: `%s, ${siteConfig.businessName}`,
  },
  ...buildMetadata({ title: homeTitle, description: homeDesc, path: '/' }),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.seo.lang} className={sora.variable} style={themeCssVars()}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(plumberJsonLd()) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2"
        >
          Aller au contenu
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileStickyBar />
        <FloatingCallButton />
      </body>
    </html>
  )
}
