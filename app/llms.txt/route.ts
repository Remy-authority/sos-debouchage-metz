import { siteConfig } from '@/config/site.config'
import { absUrl } from '@/lib/seo'
import { getServices, getZones } from '@/lib/content'

/**
 * /llms.txt : résumé du business pour les IA (GEO).
 * Format texte lisible par un LLM : activité, zone, services, méthodes, contact, URLs.
 * Généré au build depuis la config + le contenu (template N+1 : rien à maintenir à la main).
 */
export const dynamic = 'force-static'

export function GET() {
  const { businessName, trade, city, region, department, phoneDisplay, availability } = siteConfig
  const radius = siteConfig.serviceArea.radiusKm
  const base = absUrl('/').replace(/\/$/, '')

  const services = getServices()
  const zones = getZones()

  const lines: string[] = [
    `# ${businessName}`,
    '',
    `> ${trade} à ${city} (${region}, ${department}) et dans un rayon de ${radius} km. Détection non destructive, sans casse. Disponible ${availability}.`,
    '',
    '## Activité',
    `${businessName} est un service de ${trade.toLowerCase()} à ${city} et dans son agglomération. Nous localisons précisément les fuites d'eau avant toute intervention, sans casser murs, sols ni revêtements, puis remettons un rapport de localisation utilisable auprès des assurances. Nous ne réalisons pas nous-mêmes la réparation de plomberie : nous localisons la fuite pour que l'artisan intervienne au bon endroit.`,
    '',
    '## Méthodes de détection',
    ...siteConfig.methods.map((m) => `- ${m}`),
    '',
    '## Services',
    ...services.map((s) => `- ${s.navTitle} : ${absUrl(`/services/${s.slug}`)}`),
    '',
    '## Zone d’intervention',
    `Basés à ${city}, nous couvrons un rayon d'environ ${radius} km. Communes avec page dédiée :`,
    ...zones.map((z) => `- ${z.name} (${z.postalCode}) : ${absUrl(`/zones/${z.slug}`)}`),
    '',
    '## Contact',
    `- Téléphone : ${phoneDisplay}`,
    `- Site : ${base}`,
    `- Devis : ${absUrl('/contact')}`,
    `- Conseils : ${absUrl('/conseils')}`,
    '',
    '## Bon à savoir',
    "- Devis et diagnostic de base gratuits, sans engagement.",
    '- Intervention 7j/7, y compris week-ends et jours fériés pour les urgences.',
    "- Rapport de localisation reconnu par les assurances (dont convention IRSI en copropriété).",
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
