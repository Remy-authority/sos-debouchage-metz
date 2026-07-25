/**
 * Logo inline SVG, "SOS FUITE / ANGERS".
 * Variante lumineuse : textColor sombre sur fond blanc (Header).
 * Variante sombre   : textColor blanc sur fond noir (Footer, Hero, socials).
 * L'icône gouttelette s'éclaircit automatiquement en mode sombre via iconColor.
 */
export default function Logo({
  textColor = '#0F172A',
  accentColor = '#F97316',
  iconColor = '#0B4F8A',
  className = 'h-9 w-auto',
}: {
  textColor?: string
  accentColor?: string
  iconColor?: string
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 220 48"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {/* Gouttelette, pictogramme eau */}
      <path
        d="M24 4C24 4 10 18 10 28c0 9.4 6.3 16 14 16s14-6.6 14-16C38 18 24 4 24 4Z"
        fill={iconColor}
      />
      {/* Vague intérieure */}
      <path
        d="M14 28C17 24 20 31 24 27C28 23 31 30 34 26"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Reflet premium */}
      <circle cx="19" cy="20" r="3" fill="white" fillOpacity="0.25" />

      {/* SOS FUITE, majuscules, typographie resserrée */}
      <text
        x="48"
        y="22"
        fontFamily="system-ui,-apple-system,sans-serif"
        fontWeight="900"
        fontSize="15"
        fill={textColor}
        letterSpacing="-0.3"
      >
        SOS FUITE
      </text>

      {/* ANGERS, accent orange, agrandi, aligné sous « SOS FUITE » */}
      <text
        x="48"
        y="39"
        fontFamily="system-ui,-apple-system,sans-serif"
        fontWeight="800"
        fontSize="14"
        fill={accentColor}
        letterSpacing="4"
      >
        ANGERS
      </text>
    </svg>
  )
}
