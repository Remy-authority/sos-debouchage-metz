import { NextRequest, NextResponse } from 'next/server'
import { siteConfig } from '@/config/site.config'

/**
 * POST /api/contact, traitement du formulaire de lead (Lot 5).
 *
 *  1. Parse JSON (fetch) ou formData (fallback sans JS).
 *  2. Honeypot `company` : si rempli → bot → on renvoie « ok » silencieux (pas d'envoi).
 *  3. Validation minimale : nom + téléphone requis.
 *  4. Envoi email via un tier GRATUIT / fallback SANS COÛT :
 *       - si RESEND_API_KEY est défini (tier gratuit Resend) → envoi API.
 *       - sinon → log serveur uniquement (aucune dépense engagée).
 *     ⚠️ Aucun provider payant activé par défaut (garde-fou NOU-33).
 *  5. Réponse : JSON { ok } pour fetch, redirection 303 → /merci pour un POST natif.
 *
 *  Route dynamique (runtime) volontairement isolée : le reste du site est 100% SSG.
 */
export const dynamic = 'force-dynamic'

type Lead = {
  nom?: string
  telephone?: string
  ville?: string
  probleme?: string
  message?: string
  company?: string // honeypot
}

function isFormPost(req: NextRequest) {
  const ct = req.headers.get('content-type') || ''
  return ct.includes('form-urlencoded') || ct.includes('multipart/form-data')
}

async function parseBody(req: NextRequest): Promise<Lead> {
  const ct = req.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    return (await req.json()) as Lead
  }
  const fd = await req.formData()
  const get = (k: string) => (fd.get(k)?.toString() ?? '').trim()
  return {
    nom: get('nom'),
    telephone: get('telephone'),
    ville: get('ville'),
    probleme: get('probleme'),
    message: get('message'),
    company: get('company'),
  }
}

async function deliver(lead: Lead): Promise<void> {
  const to = siteConfig.email
  const subject = `Nouveau lead, ${siteConfig.businessName}`
  const text = [
    `Nom       : ${lead.nom}`,
    `Téléphone : ${lead.telephone}`,
    `Ville/CP  : ${lead.ville || 'non renseigné'}`,
    `Problème  : ${lead.probleme || 'non renseigné'}`,
    `Message   : ${lead.message || 'non renseigné'}`,
  ].join('\n')

  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    // Resend : tier gratuit (3 000 emails/mois). Aucune carte requise.
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'onboarding@resend.dev',
        to: [to],
        subject,
        text,
      }),
    })
    return
  }

  // Fallback SANS COÛT : trace serveur (visible dans les logs Vercel).
  console.log('[LEAD]', subject, '\n' + text)
}

export async function POST(request: NextRequest) {
  const formPost = isFormPost(request)
  try {
    const lead = await parseBody(request)

    // Honeypot : bot détecté → succès silencieux, pas d'envoi.
    if (lead.company && lead.company.length > 0) {
      return formPost
        ? NextResponse.redirect(new URL('/merci', request.url), 303)
        : NextResponse.json({ ok: true })
    }

    // Validation minimale.
    if (!lead.nom || !lead.telephone) {
      if (formPost) return NextResponse.redirect(new URL('/contact?error=1', request.url), 303)
      return NextResponse.json({ ok: false, error: 'Nom et téléphone requis.' }, { status: 400 })
    }

    await deliver(lead)

    return formPost
      ? NextResponse.redirect(new URL('/merci', request.url), 303)
      : NextResponse.json({ ok: true })
  } catch {
    if (formPost) return NextResponse.redirect(new URL('/contact?error=1', request.url), 303)
    return NextResponse.json({ ok: false, error: 'Erreur serveur.' }, { status: 500 })
  }
}
