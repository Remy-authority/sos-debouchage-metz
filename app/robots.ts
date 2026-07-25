import type { MetadataRoute } from 'next'
import { absUrl, IS_NOINDEX } from '@/lib/seo'

/**
 * robots.txt généré au build.
 * - Preview / non-prod (IS_NOINDEX) → tout bloqué (jamais indexer un site non validé).
 * - Prod (Gate C) → Allow /, avec exclusion des routes utilitaires + référence sitemap.
 *
 * GEO (NOU-29) : les crawlers des IA (ChatGPT, Claude, Perplexity, AI Overviews) sont
 * autorisés EXPLICITEMENT en prod, en plus du `*`, pour qu'aucun ne soit bloqué et que le
 * site puisse être cité dans les réponses génératives. Voir aussi /llms.txt.
 */
const AI_CRAWLERS = [
  'GPTBot',        // OpenAI (ChatGPT)
  'OAI-SearchBot', // OpenAI (ChatGPT Search)
  'ChatGPT-User',  // OpenAI (navigation à la demande)
  'ClaudeBot',     // Anthropic (Claude)
  'Claude-Web',    // Anthropic
  'PerplexityBot', // Perplexity
  'Google-Extended', // Google (Gemini / AI Overviews)
  'Applebot-Extended', // Apple Intelligence
]

export default function robots(): MetadataRoute.Robots {
  if (IS_NOINDEX) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }
  const utilityDisallow = ['/api/', '/merci', '/politique-confidentialite', '/cgu', '/politique-cookies']
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: utilityDisallow },
      // Autorisation explicite des crawlers IA (citabilité GEO).
      { userAgent: AI_CRAWLERS, allow: '/', disallow: utilityDisallow },
    ],
    sitemap: absUrl('/sitemap.xml'),
    host: absUrl('/'),
  }
}
