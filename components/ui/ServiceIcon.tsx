import {
  BadgeCheck,
  Building2,
  Camera,
  Clock,
  Euro,
  Gauge,
  Phone,
  Search,
  ShieldCheck,
  ShowerHead,
  Shovel,
  Star,
  Toilet,
  TriangleAlert,
  UtensilsCrossed,
  Waves,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

/**
 * Table de correspondance entre les clés `icon` du contenu JSON / de la config et
 * les pictogrammes. Le contenu ne connaît jamais lucide-react : un site N+1 change
 * de métier en changeant cette table, pas les fichiers de contenu.
 */
const ICONS: Record<string, LucideIcon> = {
  // Services
  alert: TriangleAlert,
  wc: Toilet,
  shower: ShowerHead,
  pressure: Gauge,
  camera: Camera,
  buried: Shovel,
  grease: UtensilsCrossed,
  building: Building2,
  // Étapes et arguments
  phone: Phone,
  search: Search,
  tool: Wrench,
  check: BadgeCheck,
  shield: ShieldCheck,
  clock: Clock,
  euro: Euro,
  star: Star,
}

export function resolveIcon(icon: string): LucideIcon {
  return ICONS[icon] ?? Waves
}

export function ServiceIcon({
  icon,
  className = 'h-6 w-6',
  strokeWidth = 1.9,
}: {
  icon: string
  className?: string
  strokeWidth?: number
}) {
  const Icon = resolveIcon(icon)
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden="true" />
}
