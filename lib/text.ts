/**
 * lib/text.ts, utilitaires de mise en forme de texte pour l'affichage.
 *
 * Ne modifie jamais le contenu (texte SEO inchangé) : détecte uniquement une
 * structure déjà présente dans la prose (ex. liste numérotée "1. ... 2. ...")
 * pour permettre un rendu visuel (checklist) plutôt qu'un mur de texte.
 */

export interface NumberedSteps {
  /** Phrase d'intro avant le premier numéro (peut être vide). */
  lead: string
  steps: string[]
}

const STEP_MARKER = /(?:^|\s)([1-9])\.\s+(?=[A-ZÀ-Ý])/g

/**
 * Détecte une liste "1. Xxx 2. Xxx 3. Xxx…" (numéros consécutifs à partir de 1,
 * au moins 3 étapes) dans un corps de bloc et la découpe. Retourne `null` si le
 * texte ne suit pas ce motif (reste alors un paragraphe classique).
 */
export function extractNumberedSteps(body: string): NumberedSteps | null {
  const matches = Array.from(body.matchAll(STEP_MARKER))
  if (matches.length < 3) return null

  const sequential = matches.every((m, i) => Number(m[1]) === i + 1)
  if (!sequential) return null

  const lead = body.slice(0, matches[0].index).trim()
  const steps = matches.map((m, i) => {
    const start = m.index! + m[0].length
    const end = i + 1 < matches.length ? matches[i + 1].index! : body.length
    return body.slice(start, end).trim()
  })

  return { lead, steps }
}
