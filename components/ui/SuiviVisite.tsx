'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * MODÈLE du compteur de visites, SANS DOUBLON (Rémy 13/11/2026). Chaque site le
 * copie tel quel dans `components/ui/SuiviVisite.tsx` à sa mise à jour du
 * formulaire (`tasks/regle-formulaire.md` §8), puis le CEO du site écrit la date
 * du jour dans `compteurSansDoublonLe` de sa fiche Rank OS (`cockpit/data/sites.json`) :
 * avant cette date, Rank OS affiche « environ ».
 *
 * Ce que font les visiteurs (Rémy 18/10/2026) : pour chaque page vue, UNE liste
 * de clés « origine:page:mesure » part vers Rank OS quand le visiteur quitte la
 * page (cockpit `lib/visites.ts`, volet « Visiteurs » et « Formulaire » de la
 * fiche du site). Aucun cookie, aucun identifiant, aucune donnée personnelle,
 * rien de bloquant (`sendBeacon`).
 *
 * SANS DOUBLON : les mesures du formulaire (debut, fh, fb, e2, e3, envoi) partent
 * UNE fois par navigateur et par jour de Paris. Une marque locale du jour
 * (`localStorage`, clé `rr-formulaire-jour`, seulement la date et les mesures
 * déjà parties) l'empêche de recompter la même personne qui change de page,
 * recharge ou revient. Lecture ou écriture refusée (navigation privée, stockage
 * bloqué) : on compte comme avant, par page. Les mesures de lecture (visite,
 * s30, d50, d100, tel) restent comptées par page, comme avant.
 *
 * Origines : pub (gclid, gbraid, wbraid, src=gads ou utm_source=google, retenue
 * pour tout l'onglet), google, bing, ia (ChatGPT, Perplexity, Gemini, Claude,
 * Copilot, Mistral), direct, autre.
 * Pages : accueil, prestation (/services), zone (/zones), conseil (/conseils),
 * contact (/contact, /devis), autre.
 * Mesures : visite, s30 (30 s d'attention, onglet visible), d50 (moitié de la
 * page), d100 (bas de la page), debut (formulaire commencé :
 * `data-clic-formulaire` ou <form>), fh ou fb (le formulaire commencé est dans
 * la moitié HAUTE ou BASSE de la page, envoyé seulement avec un debut), e2 et e3
 * (étape 2 puis 3 atteinte : évènement `rr-etape` de detail 2 ou 3), envoi
 * (demande acceptée par /api/contact), tel (appel).
 *
 * Visite de test (`sessionStorage.visite-test = '1'`) : RIEN ne part. Les clés
 * sont gardées dans `window.__visites` et `sessionStorage['visite-test-cles']`
 * (d'une page à l'autre) pour être lues à la main. Navigateur piloté par un
 * robot (`navigator.webdriver`) hors test : rien ne part non plus.
 * Fichier identique sur tous les sites du portefeuille.
 */

const ADRESSE = 'https://cockpit-psi-three.vercel.app/api/alertes/visite'
const FORMULAIRE = '[data-clic-formulaire], form'
const CLE_ORIGINE = 'rr-visite-origine'
const CLE_JOUR = 'rr-formulaire-jour'
const CLE_TEST = 'visite-test-cles'
const IA = /(^|\.)(chatgpt\.com|openai\.com|perplexity\.ai|gemini\.google\.com|claude\.ai|copilot\.microsoft\.com|mistral\.ai|you\.com)$/
const ORIGINES = ['pub', 'google', 'bing', 'ia', 'direct', 'autre']
/** Mesures du formulaire : une fois par navigateur et par jour de Paris. */
const UNE_FOIS_PAR_JOUR = ['debut', 'fh', 'fb', 'e2', 'e3', 'envoi']

let surEnvoi: (() => void) | null = null

function enTest(): boolean {
  try {
    return sessionStorage.getItem('visite-test') === '1'
  } catch {
    return false
  }
}

/** Le jour de Paris, « AAAA-MM-JJ ». */
function jourParis(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}

/** Mesures du formulaire déjà parties aujourd'hui ; `null` si la marque est illisible (on compte alors comme avant). */
function dejaParties(): Set<string> | null {
  try {
    const brut = localStorage.getItem(CLE_JOUR)
    if (!brut) return new Set()
    const marque = JSON.parse(brut) as { j?: unknown; m?: unknown }
    if (marque.j !== jourParis() || !Array.isArray(marque.m)) return new Set()
    return new Set(marque.m.filter((x): x is string => typeof x === 'string'))
  } catch {
    return null
  }
}

function marquer(mesures: Set<string>) {
  try {
    localStorage.setItem(CLE_JOUR, JSON.stringify({ j: jourParis(), m: Array.from(mesures) }))
  } catch {}
}

function envoyer(cles: string[]) {
  if (cles.length === 0) return
  if (enTest()) {
    const w = window as unknown as { __visites?: string[] }
    ;(w.__visites ??= []).push(...cles)
    try {
      const avant = JSON.parse(sessionStorage.getItem(CLE_TEST) ?? '[]') as string[]
      sessionStorage.setItem(CLE_TEST, JSON.stringify([...avant, ...cles]))
    } catch {}
    return
  }
  if (navigator.webdriver) return
  const corps = JSON.stringify({ v: cles })
  try {
    if (navigator.sendBeacon?.(ADRESSE, corps)) return
  } catch {}
  fetch(ADRESSE, { method: 'POST', body: corps, keepalive: true, mode: 'no-cors' }).catch(() => {})
}

/** D'où vient la visite : lue sur la première page, puis retenue pour tout l'onglet. */
function origine(): string {
  try {
    const p = new URLSearchParams(location.search)
    const pub =
      ['gclid', 'gbraid', 'wbraid'].some((k) => p.get(k)) || p.get('src') === 'gads' || /^google$/i.test(p.get('utm_source') ?? '')
    if (pub) {
      sessionStorage.setItem(CLE_ORIGINE, 'pub')
      return 'pub'
    }
    const retenue = sessionStorage.getItem(CLE_ORIGINE)
    if (retenue && ORIGINES.includes(retenue)) return retenue
    let hote = ''
    try {
      hote = new URL(document.referrer).hostname
    } catch {}
    let o = 'autre'
    if (!hote || hote === location.hostname) o = 'direct'
    else if (IA.test(hote)) o = 'ia'
    else if (/(^|\.)google\.[a-z.]+$/.test(hote)) o = 'google'
    else if (/(^|\.)bing\.com$/.test(hote)) o = 'bing'
    sessionStorage.setItem(CLE_ORIGINE, o)
    return o
  } catch {
    return 'autre'
  }
}

function typePage(chemin: string): string {
  if (chemin === '/') return 'accueil'
  const premier = chemin.split('/')[1]
  if (premier === 'services') return 'prestation'
  if (premier === 'zones') return 'zone'
  if (premier === 'conseils') return 'conseil'
  if (premier === 'contact' || premier === 'devis') return 'contact'
  return 'autre'
}

/**
 * Le formulaire commencé est-il dans la moitié haute (fh) ou basse (fb) de la
 * page ? Un bloc épinglé (scrollytelling du bloc 1) bouge avec le défilement :
 * on mesure alors la place de la section qui le contient, jamais l'écran.
 */
function cotePage(el: Element): 'fh' | 'fb' {
  try {
    let repere: Element = el.closest(FORMULAIRE) ?? el
    for (let x: Element | null = repere; x && x !== document.body; x = x.parentElement) {
      const pos = getComputedStyle(x).position
      if (pos === 'sticky' || pos === 'fixed') repere = x.parentElement ?? x
    }
    const haut = repere.getBoundingClientRect().top + window.scrollY
    return haut < document.documentElement.scrollHeight / 2 ? 'fh' : 'fb'
  } catch {
    return 'fh'
  }
}

export default function SuiviVisite() {
  const chemin = usePathname()

  useEffect(() => {
    const w = window as unknown as { __suiviVisiteFetch?: boolean }
    if (w.__suiviVisiteFetch) return
    w.__suiviVisiteFetch = true
    const fetchOrigine = window.fetch
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const reponse = await fetchOrigine(...args)
      try {
        const a = args[0]
        const url = typeof a === 'string' ? a : a instanceof URL ? a.href : a.url
        if (reponse.ok && /\/api\/contact\b/.test(url)) surEnvoi?.()
      } catch {}
      return reponse
    }
  }, [])

  useEffect(() => {
    if (!chemin) return
    const prefixe = `${origine()}:${typePage(chemin)}:`
    const acquises = new Set<string>(['visite'])
    const envoyees = new Set<string>()
    const vider = () => {
      const nouvelles = Array.from(acquises).filter((m) => !envoyees.has(m))
      nouvelles.forEach((m) => envoyees.add(m))
      // Sans doublon : une mesure du formulaire déjà partie aujourd'hui de ce navigateur ne repart pas.
      const parties = dejaParties()
      const aEnvoyer = nouvelles.filter((m) => {
        if (!UNE_FOIS_PAR_JOUR.includes(m) || parties === null) return true
        // Haut ou bas : seulement avec un « debut » qui part lui aussi.
        if (m === 'fh' || m === 'fb') return nouvelles.includes('debut') && !parties.has('debut')
        return !parties.has(m)
      })
      if (parties !== null) {
        const avant = parties.size
        aEnvoyer.forEach((m) => UNE_FOIS_PAR_JOUR.includes(m) && parties.add(m))
        if (parties.size !== avant) marquer(parties)
      }
      envoyer(aEnvoyer.map((m) => prefixe + m))
    }

    // Attention : secondes passées avec l'onglet visible.
    let secondes = 0
    const tic = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return
      secondes += 1
      if (secondes >= 30) {
        acquises.add('s30')
        window.clearInterval(tic)
      }
    }, 1000)

    // Défilement : profondeur maximale atteinte (une page courte est déjà « en bas »).
    const auDefilement = () => {
      const hauteur = document.documentElement.scrollHeight
      const bas = window.scrollY + window.innerHeight
      if (bas >= hauteur * 0.5) acquises.add('d50')
      if (bas >= hauteur - 40) acquises.add('d100')
    }
    auDefilement()

    // Formulaire commencé (et où sur la page), appel.
    const commence = (el: Element) => {
      if (acquises.has('debut')) return
      acquises.add('debut')
      acquises.add(cotePage(el))
    }
    const auClic = (ev: Event) => {
      const el = ev.target instanceof Element ? ev.target : null
      if (!el) return
      if (el.closest('a[href^="tel:"]')) acquises.add('tel')
      if (el.closest(FORMULAIRE) && el.closest('button, [role=button], [role=radio], [role=option], label, input, textarea, select')) commence(el)
    }
    const aLaSaisie = (ev: Event) => {
      const el = ev.target instanceof Element ? ev.target : null
      if (el?.matches('input, textarea, select') && el.closest(FORMULAIRE)) commence(el)
    }
    surEnvoi = () => acquises.add('envoi')
    const aLEtape = (ev: Event) => {
      const n = (ev as CustomEvent<number>).detail
      if (n === 2 || n === 3) acquises.add(`e${n}`)
    }

    const auMasquage = () => {
      if (document.visibilityState === 'hidden') vider()
    }
    window.addEventListener('scroll', auDefilement, { passive: true })
    window.addEventListener('resize', auDefilement)
    document.addEventListener('click', auClic, true)
    document.addEventListener('focusin', aLaSaisie, true)
    document.addEventListener('visibilitychange', auMasquage)
    window.addEventListener('pagehide', vider)
    window.addEventListener('rr-etape', aLEtape)

    return () => {
      window.clearInterval(tic)
      window.removeEventListener('scroll', auDefilement)
      window.removeEventListener('resize', auDefilement)
      document.removeEventListener('click', auClic, true)
      document.removeEventListener('focusin', aLaSaisie, true)
      document.removeEventListener('visibilitychange', auMasquage)
      window.removeEventListener('pagehide', vider)
      window.removeEventListener('rr-etape', aLEtape)
      surEnvoi = null
      vider()
    }
  }, [chemin])

  return null
}
