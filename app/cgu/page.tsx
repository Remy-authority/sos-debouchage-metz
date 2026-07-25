import Link from 'next/link'
import { SITE } from '@/lib/config'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: "Conditions Generales d'Utilisation", robots: { index: false } }

export default function CGU() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16 section-cream min-h-screen">
      <Link href="/" className="font-medium mb-8 inline-block text-teal-500 hover:text-teal-400 transition-colors">← Retour a l'accueil</Link>
      <h1 className="text-3xl font-black text-ink-900 mb-8">Conditions Generales d'Utilisation</h1>
      <div className="space-y-8 text-ink-700">
        <section><h2 className="text-xl font-bold text-ink-900 mb-3">1. Acceptation</h2><p>En naviguant sur {SITE.name}, vous acceptez les presentes CGU.</p></section>
        <section><h2 className="text-xl font-bold text-ink-900 mb-3">2. Services</h2><p>Ce site presente les services de recherche de fuite d'eau et d'assechement a {SITE.commune} ({SITE.communeCode}). Devis gratuit avant toute intervention.</p></section>
        <section><h2 className="text-xl font-bold text-ink-900 mb-3">3. Responsabilite</h2><p>L'editeur ne peut etre tenu responsable des dommages indirects resultant de l'utilisation du site.</p></section>
        <section><h2 className="text-xl font-bold text-ink-900 mb-3">4. Droit applicable</h2><p>CGU regies par le droit francais. Tout litige releve des tribunaux francais.</p></section>
      </div>
    </main>
  )
}
