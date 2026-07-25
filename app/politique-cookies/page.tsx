import Link from 'next/link'
import { SITE } from '@/lib/config'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Politique de cookies', robots: { index: false } }

export default function PolitiqueCookies() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16 section-cream min-h-screen">
      <Link href="/" className="font-medium mb-8 inline-block text-teal-500 hover:text-teal-400 transition-colors">← Retour a l'accueil</Link>
      <h1 className="text-3xl font-black text-ink-900 mb-8">Politique de cookies</h1>
      <div className="space-y-8 text-ink-700">
        <section><h2 className="text-xl font-bold text-ink-900 mb-3">Qu'est-ce qu'un cookie ?</h2><p>Un petit fichier texte depose sur votre appareil lors de la visite d'un site web.</p></section>
        <section><h2 className="text-xl font-bold text-ink-900 mb-3">Cookies utilises</h2><p>Uniquement des cookies techniques strictement necessaires. <strong>Aucun cookie publicitaire ou tracking tiers.</strong></p></section>
        <section><h2 className="text-xl font-bold text-ink-900 mb-3">Gestion</h2><p>Configurez votre navigateur pour refuser les cookies. La navigation reste possible.</p></section>
        <section><h2 className="text-xl font-bold text-ink-900 mb-3">Contact</h2><p>{SITE.email}</p></section>
      </div>
    </main>
  )
}
