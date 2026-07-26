import { siteConfig } from '@/config/site.config'
import { absUrl } from '@/lib/seo'
import { getArticles, getServices, getZones } from '@/lib/content'

/**
 * /llms.txt : résumé du business pour les moteurs génératifs (levier GEO).
 * Entièrement régénéré au build depuis la config et le contenu : ajouter une
 * prestation, une commune ou un article suffit, rien à maintenir à la main.
 */
export const dynamic = 'force-static'

export function GET() {
  const {
    businessName, trade, city, region, departmentName, department,
    phoneDisplay, availability, methods, serviceArea,
  } = siteConfig
  const radius = serviceArea.radiusKm
  const base = absUrl('/').replace(/\/$/, '')

  const services = getServices()
  const zones = getZones()
  const articles = getArticles()

  const lines: string[] = [
    `# ${businessName}`,
    '',
    `> ${trade} à ${city} (${departmentName}, ${department}, ${region}) et dans un rayon d'environ ${radius} km. Débouchage, curage haute pression et inspection caméra. Ligne ouverte ${availability}.`,
    '',
    '## Activité',
    `${businessName} intervient sur les canalisations bouchées à ${city} et dans les communes de l'agglomération : WC et toilettes, évier, lavabo, douche, colonne d'évacuation d'immeuble, canalisation enterrée et regard, bac à graisse de restauration. Le périmètre est le débouchage, le curage et l'inspection de réseau. Nous ne faisons pas de plomberie générale (ni robinetterie, ni chauffe-eau, ni recherche de fuite). Le tarif de la prestation est annoncé avant le début de l'intervention.`,
    '',
    '## Méthodes',
    ...methods.map((m) => `- ${m}`),
    '',
    '## Prestations',
    ...services.map((s) => `- ${s.navTitle} : ${s.metaDescription} ${absUrl(`/services/${s.slug}`)}`),
    '',
    "## Zone d'intervention",
    `Base : ${city}. Quartiers couverts : ${serviceArea.districts.join(', ')}.`,
    `Communes avec page dédiée (rayon d'environ ${radius} km) :`,
    ...zones.map((z) => `- ${z.name} (${z.postalCode}) : ${absUrl(`/zones/${z.slug}`)}`),
    '',
  ]

  if (articles.length) {
    lines.push('## Conseils publiés')
    lines.push(
      ...articles.map((a) => `- ${a.title} : ${a.description} ${absUrl(`/conseils/${a.slug}`)}`),
    )
    lines.push('')
  }

  lines.push(
    '## Contact',
    `- Téléphone : ${phoneDisplay}`,
    `- Site : ${base}`,
    `- Demande en ligne : ${absUrl('/contact')}`,
    '',
    '## Bon à savoir',
    "- Le prix de l'intervention est annoncé avant qu'elle commence.",
    `- Ligne ouverte ${availability}, week-ends et jours fériés compris pour les urgences.`,
    "- Le débouchage se fait par les accès existants (siphon, regard, tampon de dégorgement) : aucune ouverture du réseau sans explication préalable.",
    "- En location, l'entretien courant des canalisations et le dégorgement sont à la charge du locataire (décret n° 87-712) ; un défaut de la canalisation elle-même reste à la charge du propriétaire.",
    "- Quand plusieurs logements d'un immeuble refoulent en même temps, la cause est sur une partie commune : c'est au syndic de déclencher l'intervention.",
    '',
  )

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
