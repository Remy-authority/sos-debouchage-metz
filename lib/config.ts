/**
 * lib/config.ts, raccourcis hérités du template.
 *
 * ⚠️ La source de vérité de l'identité du site est `config/site.config.ts`.
 * Ce module ne fait que ré-exposer quelques valeurs pour les modules qui l'importaient
 * historiquement. Ne rien y redéfinir en dur.
 */
import { siteConfig } from '@/config/site.config'

export const SITE = {
  commune: siteConfig.city,
  communeCode: siteConfig.department,
  postalCode: siteConfig.legal.address.postalCode,
  name: siteConfig.businessName,
  phone: siteConfig.phoneDisplay,
  phoneHref: `tel:${siteConfig.phone}`,
  email: siteConfig.email,
}
