/**
 * lib/content.ts, Loaders `content/` (fs + typage) pour le SSG.
 *
 * Tout est lu au BUILD (Server Components / generateStaticParams) → zéro runtime.
 * Sources : content/services/*.json, content/zones/*.json, content/conseils/*.mdx.
 *
 * ⚠️ Les TEXTES définitifs (h1, meta, blocs, faq) viennent du SEO (ST-2) puis du
 * Rédacteur (ST-5). Ici on ne définit que la STRUCTURE + des placeholders.
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content')

/* ───────────────────────────── Types ───────────────────────────── */

export interface FaqItem {
  q: string
  a: string
}

/** Un bloc de contenu structuré (H2 + corps), rempli par le Rédacteur (ST-5). */
export interface ContentBlock {
  heading: string
  /** Corps du bloc. Placeholder tant que ST-5 n'a pas rédigé. */
  body: string
  /** Visuel explicatif optionnel intégré au bloc (chemin public/). */
  image?: string
  imageAlt?: string
  imageCaption?: string
}

export interface Service {
  slug: string
  /** Intitulé court (nav / carte). */
  navTitle: string
  h1: string
  metaTitle: string
  metaDescription: string
  /** Icône logique (mappée côté UI par ST-3). */
  icon: string
  /** Réponse courte GEO « En bref ». */
  intro: string
  /** Puces de la carte service. */
  bullets: string[]
  /** Corps structuré (H2). Placeholders jusqu'à ST-5. */
  blocks: ContentBlock[]
  faq: FaqItem[]
  /** Maillage interne → slugs de services liés. */
  relatedServices: string[]
  /** Ordre d'affichage dans la grille d'accueil. */
  order: number
  /** Image hero de la page service (chemin public). */
  image?: string
}

export interface Zone {
  slug: string
  name: string
  postalCode: string
  /** Phrase de contexte courte (carte du hub /zones). Optionnel. */
  context?: string
  metaTitle: string
  metaDescription: string
  h1: string
  intro: string
  blocks: ContentBlock[]
  /** Communes limitrophes (maillage / contenu unique). */
  neighbours: string[]
  faq: FaqItem[]
}

export interface Article {
  slug: string
  title: string
  description: string
  date: string
  category: string
  cover?: string
  /** Maillage interne automatique → slugs de services. */
  relatedServices: string[]
  /** FAQ de l'article (frontmatter `faq:`), affichée + FAQPage JSON-LD (GEO). */
  faq: FaqItem[]
  /** Corps MDX brut (compilé côté page). */
  content: string
}

/* ─────────────────────── Helpers fs + validation ─────────────────────── */

function readJsonDir<T>(dir: string, required: (keyof T)[]): T[] {
  const full = path.join(CONTENT_DIR, dir)
  if (!fs.existsSync(full)) return []
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(full, f), 'utf8')
      let data: T
      try {
        data = JSON.parse(raw)
      } catch (e) {
        throw new Error(`content/${dir}/${f} : JSON invalide, ${(e as Error).message}`)
      }
      for (const key of required) {
        if (data[key] === undefined || data[key] === null) {
          throw new Error(`content/${dir}/${f} : champ requis manquant « ${String(key)} »`)
        }
      }
      return data
    })
}

/* ───────────────────────────── Services ───────────────────────────── */

export function getServices(): Service[] {
  const items = readJsonDir<Service>('services', [
    'slug', 'navTitle', 'h1', 'metaTitle', 'metaDescription',
  ])
  return items.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
}

export function getService(slug: string): Service | undefined {
  return getServices().find((s) => s.slug === slug)
}

/* ───────────────────────────── Zones ───────────────────────────── */

export function getZones(): Zone[] {
  return readJsonDir<Zone>('zones', [
    'slug', 'name', 'postalCode', 'metaTitle', 'metaDescription',
  ]).sort((a, b) => a.name.localeCompare(b.name, 'fr'))
}

export function getZone(slug: string): Zone | undefined {
  return getZones().find((z) => z.slug === slug)
}

/* ───────────────────────── Conseils (MDX) ───────────────────────── */

/**
 * Un article peut déclarer un `cover:` dont le fichier n'a pas encore été produit
 * (l'Autoblog écrit les textes, les visuels arrivent ensuite). On vérifie donc au
 * build que l'image existe vraiment : sinon la carte et l'en-tête d'article
 * s'affichent proprement sans visuel, au lieu d'une image cassée.
 */
function coverIfExists(cover: unknown): string | undefined {
  if (typeof cover !== 'string' || !cover.startsWith('/')) return undefined
  return fs.existsSync(path.join(process.cwd(), 'public', cover)) ? cover : undefined
}

export function getArticles(): Article[] {
  const dir = path.join(CONTENT_DIR, 'conseils')
  if (!fs.existsSync(dir)) return []
  const articles = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf8')
      const { data, content } = matter(raw)
      return {
        slug: (data.slug as string) || f.replace(/\.mdx$/, ''),
        title: (data.title as string) || '',
        description: (data.description as string) || '',
        date: (data.date as string) || '1970-01-01',
        category: (data.category as string) || 'Conseils',
        cover: coverIfExists(data.cover),
        relatedServices: (data.relatedServices as string[]) || [],
        faq: (data.faq as FaqItem[]) || [],
        content,
      } satisfies Article
    })
  // Tri antéchronologique (le plus récent d'abord).
  return articles.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getArticle(slug: string): Article | undefined {
  return getArticles().find((a) => a.slug === slug)
}

/** Derniers articles d'un cluster (maillage service ⇄ blog). */
export function getRelatedArticles(serviceSlug: string, limit = 2): Article[] {
  return getArticles()
    .filter((a) => a.relatedServices.includes(serviceSlug))
    .slice(0, limit)
}

/**
 * « À lire aussi » : autres articles proches du courant. Score = services liés
 * en commun (poids 2) + même catégorie (poids 1) ; complété par les plus récents
 * si le quota n'est pas atteint. Exclut l'article courant.
 */
export function getRelatedConseils(current: Article, limit = 3): Article[] {
  const others = getArticles().filter((a) => a.slug !== current.slug)
  const scored = others
    .map((a) => {
      const shared = a.relatedServices.filter((s) => current.relatedServices.includes(s)).length
      const sameCat = a.category === current.category ? 1 : 0
      return { a, score: shared * 2 + sameCat }
    })
    .sort((x, y) => y.score - x.score) // tri stable : conserve l'ordre antéchronologique à score égal

  const picked = scored.filter((s) => s.score > 0).map((s) => s.a)
  if (picked.length < limit) {
    for (const s of scored) {
      if (!picked.includes(s.a)) picked.push(s.a)
      if (picked.length >= limit) break
    }
  }
  return picked.slice(0, limit)
}

/** Temps de lecture estimé (minutes), ~200 mots/min. Minimum 1 min. */
export function readingTimeMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
