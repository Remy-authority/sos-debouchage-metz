'use client'

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type Ref } from 'react'
import * as ReactDOM from 'react-dom'
import { LeadForm } from '@/components/ui/LeadForm'
import { AXE, CADRE, CSS_COUPE, CoupeMetz, HAUTEUR_PHOTO, LARGEUR, PIED_WC, P_COUPE_COMPLETE, ajusterCoupe, poserCoupe } from '@/components/ui/CoupeMetz'
import { siteConfig } from '@/config/site.config'

/**
 * HeroPlongee, le « bloc 1 qui plonge » de sos-debouchage-metz.fr (octobre 2026, scénario
 * revu avec Rémy le 10/10/2026). Ce que le client paie sans jamais le voir : la canalisation
 * sous son carrelage. Cinq temps, pilotés par le défilement :
 *
 *  1. ÉCRAN 1   une salle de bain claire, le WC suspendu, la mallette de la caméra d'inspection
 *               ouverte sur une bâche ; le titre sur le mur, deux boutons, le formulaire noir.
 *               Téléphone : la photo calée en bas, son mur prolongé jusqu'en haut de l'écran.
 *  2. AVANCÉE   texte et formulaire s'effacent, la caméra s'approche du pied du WC.
 *  3. PLONGÉE   le sol s'ouvre au pied du mur, couche après couche ; le tuyau du WC descend,
 *               file sous la façade en pierre de Jaumont et sous la pelouse.
 *  4. LA CAUSE  un bouchon de lingettes, l'eau bloquée ; la caméra entre par le regard, puis
 *               le jet haute pression dégage le bouchon ; l'eau repart.
 *  5. RETOUR    la caméra recule jusqu'à la salle de bain, le sol se referme, « Sans casser le
 *               carrelage », puis le titre, les boutons et le formulaire reviennent : l'écran 1.
 *
 * Moteur repris de forage-puits-poitou.fr : une piste haute (380 vh) porte une scène collée sous
 * l'en-tête ; un seul requestAnimationFrame par défilement ; transform et opacité posés dans le
 * DOM, jamais un rendu React. La photo de l'écran 1 est le premier rendu du serveur (LCP).
 * Repli (« réduire les animations », économie de données, réseau lent) : l'écran 1 fixe, puis la
 * coupe complète, fixe, juste dessous.
 */

/* ---------- Photo ---------- */
const BASE = '/accueil/salle-de-bain-camera'
const LARGEURS = [900, 1600, 2752, 3840]
const SRCSET_AVIF = LARGEURS.map((l) => `${BASE}-${l}.avif ${l}w`).join(', ')
const SRCSET_WEBP = LARGEURS.map((l) => `${BASE}-${l}.webp ${l}w`).join(', ')
const ALT = "Salle de bain claire à Metz, WC suspendu et mallette de caméra d'inspection ouverte sur une bâche"
/** Premier affichage : la largeur de l'écran ; sur téléphone la photo, calée en hauteur, déborde
 *  l'écran, d'où 240vw. La copie zoomée passe au grand tirage ensuite. */
const TAILLES_ECRAN1 = '(max-width: 1023px) 240vw, 100vw'
/** Après le chargement : la caméra zoome jusqu'à 3 fois, on demande le tirage le plus fin. */
const TAILLES_ZOOM = '(max-width: 1023px) 1400px, 200vw'
const PRIORITE = { fetchpriority: 'high' } as Record<string, string>
const precharger = (ReactDOM as unknown as { preload?: (href: string, options: Record<string, string>) => void }).preload

const H = HAUTEUR_PHOTO
/** Mur prolongé au-dessus de la photo (téléphone) : couleurs relevées sur sa première ligne. */
const MUR =
  'linear-gradient(90deg,#D7D4C9 0%,#D2C9C0 6.25%,#D0C8BD 12.5%,#D0C6BA 18.75%,#C5BDAB 25%,#C2B7A5 31.25%,#D0C8BD 37.5%,#D9D1C4 43.75%,#DED7C7 50%,#DED6C1 56.25%,#DBD3BE 62.5%,#DACFB7 68.75%,#DBCCB2 75%,#DED4BA 81.25%,#E2DBC8 87.5%,#CFC9AD 93.75%,#D6D0B8 100%)'
const MUR_H = 1600
const PHOTO_MOBILE = '68%'
const GRILLE =
  'lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-[minmax(0,27rem)_minmax(0,1fr)_21rem] lg:items-center lg:gap-6 lg:px-10 xl:grid-cols-[minmax(0,29rem)_minmax(0,1fr)_22rem]'

/* ---------- Séquence ---------- */
type Format = 'ordi' | 'mobile'
type Camera = { s: number; vx: number; vy: number }
type Rect = { x: number; y: number; w: number; h: number }
/** Point visé, repère de toutes les positions de caméra : le pied du WC. */
const VISE = { x: AXE, y: PIED_WC }
/** Les cadrages successifs, dans le repère de la photo (1600 x 893). */
/** `fin` ne sert qu'au repli sans animation : la coupe complète, fixe. */
const CADRES: Record<Format, { plonge: Rect; tuyau: Rect; cause: Rect; fin: Rect }> = {
  ordi: {
    plonge: { x: 500, y: 437, w: 740, h: 500 },
    tuyau: { x: 1420, y: 357, w: 860, h: 600 },
    cause: { x: 1600, y: 697, w: 580, h: 290 },
    fin: { x: 480, y: 380, w: 1940, h: 640 },
  },
  mobile: {
    plonge: { x: 640, y: 437, w: 380, h: 560 },
    tuyau: { x: 1630, y: 337, w: 540, h: 700 },
    cause: { x: 1650, y: 717, w: 520, h: 300 },
    fin: { x: 640, y: 440, w: 1540, h: 900 },
  },
}
/** Bornes des temps, en fraction de la piste (mêmes repères que les attributs de CoupeMetz). */
const T = { avance: 0.14, plonge: 0.27, tuyau: 0.38, cause: 0.44, action: 0.62, retour: 0.8, texte0: 0.91, texte1: 0.97 }

const effetAvantPeinture = typeof window !== 'undefined' ? useLayoutEffect : useEffect
const borne = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const doux = (t: number) => t * t * (3 - 2 * t)
const elan = (u: number, v0: number, v1: number) => (u ** 3 - 2 * u ** 2 + u) * v0 + (-2 * u ** 3 + 3 * u ** 2) + (u ** 3 - u ** 2) * v1

function connexionLente() {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  return !!c && (c.saveData === true || ['slow-2g', '2g', '3g'].includes(c.effectiveType ?? ''))
}
/** Caméra qui remplit le cadre comme object-cover, à la position (ox, oy). */
function remplir(c: Rect, ox: number, oy: number): Camera {
  const s = Math.max(c.w / LARGEUR, c.h / H)
  return { s, vx: c.x + (c.w - LARGEUR * s) * ox + VISE.x * s, vy: c.y + (c.h - H * s) * oy + VISE.y * s }
}
/** Caméra qui fait tenir le rectangle r (repère photo) dans la zone a (écran), centré. */
function cadrer(r: Rect, a: Rect): Camera {
  const s = Math.min(a.w / r.w, a.h / r.h)
  return { s, vx: a.x + a.w / 2 + (VISE.x - (r.x + r.w / 2)) * s, vy: a.y + a.h / 2 + (VISE.y - (r.y + r.h / 2)) * s }
}
const vers = (a: Camera, b: Camera, e: number): Camera => ({ s: a.s * (b.s / a.s) ** e, vx: a.vx + (b.vx - a.vx) * e, vy: a.vy + (b.vy - a.vy) * e })
/** Recul : le point du dessin au centre de l'écran voyage en ligne droite, sans détour par la rue. */
const versCentre = (a: Camera, b: Camera, e: number, cx: number, cy: number): Camera => {
  const s = a.s * (b.s / a.s) ** e
  const mx = VISE.x + (cx - a.vx) / a.s + ((VISE.x + (cx - b.vx) / b.s) - (VISE.x + (cx - a.vx) / a.s)) * e
  const my = VISE.y + (cy - a.vy) / a.s + ((VISE.y + (cy - b.vy) / b.s) - (VISE.y + (cy - a.vy) / a.s)) * e
  return { s, vx: cx - (mx - VISE.x) * s, vy: cy - (my - VISE.y) * s }
}
const aLEcran = (c: Camera, x: number, y: number) => [(x - VISE.x) * c.s + c.vx, (y - VISE.y) * c.s + c.vy]

const CSS = `
.bp{--haut:68px;padding-top:var(--haut)}
.bp-piste{position:relative}
.bp-scene{position:relative;overflow:hidden;height:0}
.bp-ecran{min-height:max(calc(100svh - var(--haut)),560px)}
.bp[data-seq] .bp-piste{height:380svh}
@media (max-width:1023px){.bp:not([data-seq]) .bp-form{padding-top:48px}.bp[data-seq] .bp-form{margin-top:-48px;padding-top:0}}
.bp[data-seq] .bp-scene{position:sticky;top:var(--haut);height:max(calc(100svh - var(--haut)),560px)}
.bp[data-seq] .bp-texte{position:sticky;top:var(--haut);height:0;z-index:10;pointer-events:none}
@media (min-width:1024px){
.bp-scene,.bp-cadre{height:max(calc(100vh - var(--haut)),640px)}
.bp-calque{position:absolute;left:0;right:0;top:0;z-index:10;pointer-events:none;height:max(calc(100vh - var(--haut)),640px)}
.bp-colle{height:0}
.bp-ecran{min-height:0}
.bp[data-seq] .bp-piste{height:380vh}
.bp[data-seq] .bp-calque{height:calc(380vh - max(calc(100vh - var(--haut)),640px))}
.bp[data-seq] .bp-colle{position:sticky;top:var(--haut)}
.bp[data-seq] .bp-texte{position:relative;top:auto;height:auto;pointer-events:auto}
}
@keyframes bp-appel{0%,100%{transform:rotate(0)}8%{transform:rotate(-14deg)}16%{transform:rotate(12deg)}24%{transform:rotate(-8deg)}32%{transform:rotate(0)}}
.bp-appel{animation:bp-appel 3.2s ease-in-out infinite;transform-origin:50% 60%}
@keyframes bp-rappel{0%,55%,100%{transform:translate(0,0)}70%{transform:translate(-2px,2px)}85%{transform:translate(0,0)}}
.bp-rappel{animation:bp-rappel 2.6s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.bp-appel,.bp-rappel{animation:none}}
${CSS_COUPE}`

export function HeroPlongee() {
  const [mode, setMode] = useState<'fixe' | 'sequence' | 'repli'>('fixe')
  precharger?.(`${BASE}-1600.avif`, { as: 'image', imageSrcSet: SRCSET_AVIF, imageSizes: TAILLES_ECRAN1, fetchPriority: 'high', type: 'image/avif' })

  const sectionRef = useRef<HTMLElement>(null)
  const pisteRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const texteRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLImageElement>(null)
  const sourceRef = useRef<HTMLSourceElement>(null)
  const planRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const contenuRef = useRef<HTMLDivElement>(null)
  const fondMobileRef = useRef<HTMLDivElement>(null)
  const murRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const choisir = () => setMode(mq.matches || connexionLente() ? 'repli' : 'sequence')
    choisir()
    mq.addEventListener('change', choisir)
    return () => mq.removeEventListener('change', choisir)
  }, [])

  // L'en-tête est fixe : le bloc 1 commence sous lui, à la hauteur mesurée.
  effetAvantPeinture(() => {
    const section = sectionRef.current
    const entete = document.querySelector('header')
    if (!section || !entete) return
    const poser = () => section.style.setProperty('--haut', `${entete.offsetHeight}px`)
    poser()
    const ro = new ResizeObserver(poser)
    ro.observe(entete)
    return () => ro.disconnect()
  }, [])

  effetAvantPeinture(() => {
    if (mode !== 'sequence') return
    const section = sectionRef.current!
    const piste = pisteRef.current!
    const scene = sceneRef.current!
    const grand = window.matchMedia('(min-width: 1024px)')
    let format: Format = grand.matches ? 'ordi' : 'mobile'

    let haut = 68
    let W = 0
    let Hs = 0
    let c0: Camera = { s: 1, vx: 0, vy: 0 }
    let c1 = c0
    let cPlonge = c0
    let cTuyau = c0
    let cCause = c0
    let zoomPose = 0

    const mesurer = () => {
      format = grand.matches ? 'ordi' : 'mobile'
      haut = parseFloat(getComputedStyle(section).getPropertyValue('--haut')) || haut
      W = scene.offsetWidth
      Hs = scene.offsetHeight
      const rs = scene.getBoundingClientRect()

      // Départ : exactement le cadre de l'écran 1 fixe.
      if (format === 'ordi') c0 = remplir({ x: 0, y: 0, w: W, h: Hs }, 0.5, 0.5)
      else {
        const t = texteRef.current
        const zone = t?.querySelector<HTMLElement>('[data-photo-ecran1]')
        if (t && zone) {
          const avant = t.style.transform
          t.style.transform = ''
          const r = zone.getBoundingClientRect()
          const rt = t.getBoundingClientRect()
          t.style.transform = avant
          c0 = remplir({ x: r.left - rs.left, y: r.top - rt.top, w: r.width, h: r.height }, 0.5, 1)
        } else c0 = remplir({ x: 0, y: 0, w: W, h: Hs }, 0.5, 1)
      }

      // Fin de l'avancée : le WC au milieu, la photo couvre encore toute la scène.
      {
        const s = Math.max(c0.s * (format === 'ordi' ? 1.6 : 1.5), Hs / H, W / LARGEUR)
        c1 = { s, vx: W / 2, vy: Math.max(Hs * 0.5, Hs - (H - VISE.y) * s) }
      }

      // Zone utile de l'écran ; au téléphone, au-dessus de la barre d'appel du bas.
      const plein: Rect = format === 'ordi' ? { x: 32, y: 24, w: W - 64, h: Hs - 48 } : { x: 10, y: 14, w: W - 20, h: Hs - (W < 768 ? 92 : 40) }
      const k = CADRES[format]
      cPlonge = cadrer(k.plonge, plein)
      cTuyau = cadrer(k.tuyau, plein)
      cCause = cadrer(k.cause, plein)
      zoomPose = 0
    }

    const placer = (el: HTMLElement | null, c: Camera) => {
      if (!el) return
      const [x, y] = aLEcran(c, 0, 0)
      el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${c.s.toFixed(5)})`
    }

    let raf = 0
    let derniere = -1
    let derniereFuite = 0
    let pPose = -1
    let planVisible = false
    const peindre = () => {
      raf = 0
      const rp = piste.getBoundingClientRect()
      const p = borne((haut - rp.top) / Math.max(1, rp.height - Hs))
      // Téléphone : le texte revenu à la fin est collé à l'écran ; il repart avec la scène.
      const fuite = format === 'mobile' ? Math.min(0, rp.bottom - haut - Hs) : 0
      if (p === derniere && fuite === derniereFuite) return
      derniere = p
      derniereFuite = fuite

      // Texte (et formulaire sur ordinateur) : effacés sur les 7 premiers pour cent, revenus à la
      // fin, à leur place de l'écran 1.
      const f = doux(borne(p / 0.07))
      const g = doux(borne((p - T.texte0) / (T.texte1 - T.texte0)))
      const visible = p < 0.5 ? 1 - f : g
      const decale = p < 0.5 ? (format === 'ordi' ? -22 : -60) * f : 14 * (1 - g)
      const aEffacer = format === 'ordi' ? [texteRef.current, formRef.current] : [contenuRef.current]
      if (fondMobileRef.current) fondMobileRef.current.style.visibility = format === 'mobile' && p > 0 ? 'hidden' : ''
      for (const el of aEffacer) {
        if (!el) continue
        el.style.opacity = visible.toFixed(3)
        el.style.transform = decale || fuite ? `translateY(${(decale + fuite).toFixed(1)}px)` : ''
        el.style.visibility = visible < 0.02 ? 'hidden' : ''
        el.style.pointerEvents = visible < 0.6 ? 'none' : ''
      }
      if (format === 'mobile' && formRef.current) formRef.current.removeAttribute('style')

      // Caméra.
      let c: Camera
      if (p <= T.avance) {
        c = vers(c0, c1, elan(p / T.avance, 0.5, 0.3))
        c = { ...c, vy: Math.max(c.vy, Hs - (H - VISE.y) * c.s) }
      } else if (p <= T.plonge) c = vers(c1, cPlonge, elan((p - T.avance) / (T.plonge - T.avance), 0.3, 0.2))
      else if (p <= T.tuyau) c = vers(cPlonge, cTuyau, elan((p - T.plonge) / (T.tuyau - T.plonge), 0.2, 0.2))
      else if (p <= T.cause) c = vers(cTuyau, cCause, elan((p - T.tuyau) / (T.cause - T.tuyau), 0.2, 0))
      else if (p <= T.action) c = cCause
      else if (p <= T.retour) c = versCentre(cCause, c0, elan((p - T.action) / (T.retour - T.action), 0, 0), W / 2, Hs / 2)
      else c = c0
      placer(photoRef.current, c)
      placer(planRef.current, c)
      if (murRef.current) {
        const [cx, cy] = aLEcran(c, 0, 0)
        murRef.current.style.transform = `translate3d(${cx.toFixed(2)}px,${(cy - MUR_H * c.s).toFixed(2)}px,0) scale(${c.s.toFixed(5)})`
      }
      if (photoRef.current) photoRef.current.style.visibility = format === 'mobile' && p === 0 ? 'hidden' : ''
      const montrer = p > T.avance * 0.6 && p < T.texte1
      if (montrer !== planVisible && planRef.current) {
        planVisible = montrer
        planRef.current.style.visibility = montrer ? 'visible' : 'hidden'
      }
      if (!zoomPose || c.s / zoomPose > 1.015 || c.s / zoomPose < 0.985) {
        zoomPose = c.s
        if (svgRef.current) ajusterCoupe(svgRef.current, c.s)
      }
      const pp = Math.round(p * 800) / 800
      if (svgRef.current && pp !== pPose) {
        pPose = pp
        poserCoupe(svgRef.current, pp)
      }
    }
    const planifier = () => {
      if (!raf) raf = requestAnimationFrame(peindre)
    }
    const retailler = () => {
      mesurer()
      derniere = -1
      planifier()
    }

    // La photo quitte son cadrage object-cover : elle devient une planche de 1600 px que la
    // caméra déplace.
    const photo = photoRef.current
    if (photo) Object.assign(photo.style, { inset: 'auto', left: '0px', top: '0px', width: `${LARGEUR}px`, height: `${H}px`, objectFit: 'fill', willChange: 'transform' })
    mesurer()
    if (svgRef.current) poserCoupe(svgRef.current, 0)
    const GESTES = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown'] as const
    const grandTirage = () => {
      if (photoRef.current && photoRef.current.sizes !== TAILLES_ZOOM) photoRef.current.sizes = TAILLES_ZOOM
      if (sourceRef.current && sourceRef.current.sizes !== TAILLES_ZOOM) sourceRef.current.sizes = TAILLES_ZOOM
    }
    const auGeste = () => {
      grandTirage()
      for (const g of GESTES) window.removeEventListener(g, auGeste)
    }
    for (const g of GESTES) window.addEventListener(g, auGeste, { passive: true })
    let tirage = 0
    const apresChargement = () => {
      tirage = window.setTimeout(grandTirage, 2500)
    }
    if (document.readyState === 'complete') apresChargement()
    else window.addEventListener('load', apresChargement, { once: true })
    const ro = new ResizeObserver(retailler)
    ro.observe(scene)
    window.addEventListener('scroll', planifier, { passive: true })
    grand.addEventListener('change', retailler)
    document.fonts?.ready.then(retailler)
    peindre()
    return () => {
      window.clearTimeout(tirage)
      window.removeEventListener('load', apresChargement)
      for (const g of GESTES) window.removeEventListener(g, auGeste)
      ro.disconnect()
      window.removeEventListener('scroll', planifier)
      grand.removeEventListener('change', retailler)
      if (raf) cancelAnimationFrame(raf)
      for (const el of [photoRef.current, texteRef.current, contenuRef.current, fondMobileRef.current, formRef.current]) el?.removeAttribute('style')
    }
  }, [mode])

  // « Être rappelé » : sur ordinateur, le formulaire est déjà là, on y met le focus.
  const versFormulaire = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!window.matchMedia('(min-width: 1024px)').matches) return
    const cible = formRef.current?.querySelector<HTMLInputElement>('input[type="radio"]')
    if (!cible) return
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    cible.focus({ preventScroll: true })
  }

  const photo = (classe: string, alt = '', style?: CSSProperties, ref?: Ref<HTMLImageElement>, refSource?: Ref<HTMLSourceElement>) => (
    <picture>
      <source ref={refSource} type="image/avif" srcSet={SRCSET_AVIF} sizes={TAILLES_ECRAN1} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={ref} src={`${BASE}-1600.webp`} srcSet={SRCSET_WEBP} sizes={TAILLES_ECRAN1} alt={alt} width={LARGEUR} height={H} {...PRIORITE} className={classe} style={style} />
    </picture>
  )

  const texte = (
    <div className="bp-ecran relative flex w-full flex-col lg:block">
      {/* Téléphone et tablette : le mur prolongé puis la photo calée en bas, en plein écran
          derrière le texte. Ils cèdent la place à leur copie de la scène au premier défilement. */}
      <div ref={fondMobileRef} aria-hidden="true" className="absolute inset-0 overflow-hidden lg:hidden">
        <div data-photo-ecran1="" className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ height: PHOTO_MOBILE, aspectRatio: `${LARGEUR} / ${H}` }}>
          <div className="absolute inset-x-0 bottom-full h-[200vh]" style={{ backgroundImage: MUR }} />
          {photo('absolute inset-0 h-full w-full')}
          <div className="absolute inset-x-0 top-0 h-[10%]" style={{ backgroundImage: MUR, maskImage: 'linear-gradient(180deg,#000,transparent)', WebkitMaskImage: 'linear-gradient(180deg,#000,transparent)' }} />
        </div>
      </div>
      <div ref={contenuRef} className="relative mx-auto w-full max-w-xl px-5 pb-6 pt-[calc(2rem+9svh)] text-center sm:px-8 sm:pt-12 lg:max-w-none lg:px-0 lg:pb-0 lg:pt-0 lg:text-left">
        <p className="flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-700 lg:justify-start lg:text-[12px]">
          <span className="hidden h-px w-8 bg-brand-700/60 lg:block" aria-hidden="true" />
          SOS canalisation bouchée à {siteConfig.city}
        </p>
        <h1 id="titre-hero" className="mt-3 font-display text-[clamp(1.7rem,8.2vw,3.3rem)] font-medium leading-[1.06] tracking-tight text-ink-950 lg:mt-4 lg:text-[2.6rem] xl:text-[3rem]">
          <span className="block whitespace-nowrap">Débouchage canalisation </span>
          <span className="block whitespace-nowrap text-brand-700">{siteConfig.city}, sans casse</span>
        </h1>
        <p className="mx-auto mt-3 max-w-[30rem] text-[15px] leading-relaxed text-ink-900/80 sm:text-base lg:mx-0 lg:mt-5 lg:text-[17.5px]">
          <span className="block text-balance">WC, évier ou regard bouché, {siteConfig.availability}.{' '}</span>
          <span className="block text-balance">La caméra trouve la cause, puis nous débouchons.</span>
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:mx-auto sm:max-w-md lg:mx-0 lg:mt-8 lg:flex lg:max-w-none lg:gap-2.5">
          <a
            href={`tel:${siteConfig.phone}`}
            className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[3px] bg-accent-500 px-3 text-[14px] font-semibold text-white transition hover:bg-accent-400 sm:px-6 sm:text-[15px]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bp-appel h-[18px] w-[18px] shrink-0" aria-hidden="true">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
            </svg>
            <span className="lg:hidden">Appeler</span>
            <span className="hidden lg:inline">{siteConfig.phoneDisplay}</span>
          </a>
          <a
            href="#formulaire"
            onClick={versFormulaire}
            className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[3px] bg-ink-950 px-3 text-[14px] font-semibold text-white transition hover:bg-ink-800 sm:px-6 sm:text-[15px]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
              <path className="bp-rappel" d="M22 2l-6 6M16 3v5h5" />
            </svg>
            Être rappelé
          </a>
        </div>
      </div>
    </div>
  )

  const sequence = mode === 'sequence'
  return (
    <>
      <section
        ref={sectionRef}
        id="top"
        aria-labelledby="titre-hero"
        data-seq={sequence ? '' : undefined}
        className="bp relative isolate bg-ink-950 [overflow-x:clip]"
      >
        <style>{CSS}</style>
        <div className="relative flex flex-col lg:block">
          <div className="bp-calque contents lg:block">
            <div className="bp-colle contents lg:block">
              <div className="bp-cadre contents lg:flex lg:items-center">
                <div className={`contents ${GRILLE}`}>
                  <div className="bp-texte relative order-1 lg:col-start-1">
                    <div ref={texteRef} className="pointer-events-auto">
                      {texte}
                    </div>
                  </div>
                  <div
                    ref={formRef}
                    id="formulaire"
                    className="bp-form relative z-10 order-3 w-full scroll-mt-24 bg-ink-950 pb-12 pt-8 lg:pointer-events-auto lg:col-start-3 lg:bg-transparent lg:p-0"
                  >
                    <div className="mx-auto w-full max-w-md px-5 sm:px-8 lg:max-w-none lg:px-0">
                      <LeadForm variante="hero" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ref={pisteRef} className="bp-piste order-2">
            <div ref={sceneRef} className="bp-scene bg-[#2A2420]">
              <div aria-hidden="true" className="absolute inset-0">
                {photo(
                  'pointer-events-none absolute inset-0 h-full w-full max-w-none origin-top-left select-none object-cover',
                  ALT,
                  undefined,
                  photoRef,
                  sourceRef,
                )}
                {/* Le mur prolongé au-dessus de la photo, déplacé avec elle ; il mord en fondu sur le haut
                    de la photo pour qu'aucune ligne ne trahisse la jonction quand la caméra recule. */}
                <div ref={murRef} className="pointer-events-none absolute left-0 top-0 origin-top-left" style={{ width: LARGEUR, height: MUR_H, backgroundImage: MUR }}>
                  <div className="absolute inset-x-0" style={{ top: MUR_H - 3, height: H * 0.1 + 3, backgroundImage: MUR, maskImage: 'linear-gradient(180deg,#000,transparent)', WebkitMaskImage: 'linear-gradient(180deg,#000,transparent)' }} />
                </div>
              </div>
              {/* La coupe, dans le repère de la photo (montée avec la séquence). */}
              <div ref={planRef} className="pointer-events-none absolute left-0 top-0 origin-top-left" style={{ width: LARGEUR, height: H, visibility: 'hidden' }}>
                {sequence && (
                  <CoupeMetz
                    svgRef={svgRef}
                    className="absolute"
                    style={{ left: CADRE.x0, top: CADRE.y0, width: CADRE.x1 - CADRE.x0, height: CADRE.y1 - CADRE.y0 }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {mode === 'repli' && <CoupeFixe />}
    </>
  )
}

/** Repli : la coupe COMPLÈTE et fixe sous l'écran 1. Deux cadrages, large et serré. */
function CoupeFixe() {
  return (
    <section aria-label="Coupe de principe sous une salle de bain à Metz" className="bg-[#2A2420] py-8 lg:py-12">
      <style>{CSS_COUPE}</style>
      <div className="mx-auto max-w-6xl px-4 lg:px-10">
        <Planche r={CADRES.ordi.fin} classe="hidden lg:block" />
        <Planche r={CADRES.mobile.fin} classe="mx-auto max-w-[560px] lg:hidden" />
      </div>
    </section>
  )
}

function Planche({ r, classe }: { r: Rect; classe: string }) {
  const boite = useRef<HTMLDivElement>(null)
  const pc = (v: number, t: number) => `${((v / t) * 100).toFixed(4)}%`
  useEffect(() => {
    const el = boite.current
    const svg = el?.querySelector('svg')
    if (!el || !svg) return
    poserCoupe(svg, P_COUPE_COMPLETE)
    const ro = new ResizeObserver(() => {
      if (el.offsetWidth > 0) ajusterCoupe(svg, el.offsetWidth / r.w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [r.w])
  return (
    <div ref={boite} className={`relative w-full overflow-hidden ${classe}`} style={{ aspectRatio: `${r.w} / ${r.h}` }}>
      <div className="absolute" style={{ left: pc(-r.x, r.w), top: pc(-r.y - MUR_H, r.h), width: pc(LARGEUR, r.w), height: pc(MUR_H, r.h), backgroundImage: MUR }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${BASE}-1600.webp`} alt="" loading="lazy" decoding="async" className="absolute max-w-none" style={{ left: pc(-r.x, r.w), top: pc(-r.y, r.h), width: pc(LARGEUR, r.w), height: pc(H, r.h) }} />
      <div className="absolute" style={{ left: pc(CADRE.x0 - r.x, r.w), top: pc(CADRE.y0 - r.y, r.h), width: pc(CADRE.x1 - CADRE.x0, r.w), height: pc(CADRE.y1 - CADRE.y0, r.h) }}>
        <CoupeMetz className="absolute inset-0 h-full w-full" />
      </div>
    </div>
  )
}

export default HeroPlongee
