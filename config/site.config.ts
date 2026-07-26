/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  site.config.ts, LE fichier unique qui pilote l'identité du site.
 * ─────────────────────────────────────────────────────────────────────────────
 *  Coeur du template « site local N+1 ». Pour déployer un nouveau site (autre
 *  métier / ville / locataire) : on édite CE fichier + le logo + content/*.json,
 *  SANS toucher aux composants ni au SEO.
 *
 *  ⚠️ Garde-fous :
 *   - `palette` est la SOURCE UNIQUE des couleurs. lib/theme.ts la convertit en
 *     CSS variables (canaux RGB) posées sur <html>, tailwind.config.ts les lit.
 *     Changer la palette d'un site N+1 = éditer ce bloc, rien d'autre.
 *   - `features.reviews=false` tant qu'il n'y a pas d'avis réels (aucun faux avis).
 *   - `legal` = gabarit paramétrable : NE PAS inventer SIREN / éditeur.
 *   - `showAddress=false` par défaut : pas d'`address` dans le schema tant que
 *     Rémy n'a pas tranché (artisan mobile vs adresse physique exposée).
 *   - Tout ce qui est marqué DEMO attend une donnée réelle de Rémy.
 */

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  /* ── Identité commerciale (louable / remplaçable par l'artisan locataire) ── */
  businessName: 'SOS Débouchage Metz',
  trade: 'Débouchage de canalisation',
  tradeShort: 'Débouchage',
  city: 'Metz',
  region: 'Grand Est',
  departmentName: 'Moselle',
  department: '57',

  /* ── Contact ── */
  // DEMO – numéro de la plage réservée à la fiction (ARCEP, zone 03), volontairement
  // non attribué. À remplacer par la ligne dédiée fournie par Rémy.
  phone: '+33353012424',
  phoneDisplay: '03 53 01 24 24',
  phoneIsDemo: true,
  // DEMO – domaine pas encore acheté.
  email: 'contact@sos-debouchage-metz.fr',

  /* ── Branding ── */
  logo: '/logo.svg',

  /**
   * Palette du site. Quatre familles, chacune avec ses échelles :
   *  - `ink`    : fonds sombres, bleu pétrole profond (sections sombres, footer)
   *  - `sand`   : neutres chauds, écho à la pierre de Jaumont messine (sections claires)
   *  - `brand`  : teal eau / canalisation (structure, icônes, liens, chrome)
   *  - `accent` : vermillon (URGENCE et action uniquement : CTA, eyebrow, point vivant)
   * Règle de composition : `brand` porte la structure, `accent` ne sert qu'à l'action.
   */
  palette: {
    ink: {
      600: '#1D5360',
      700: '#16404A',
      800: '#103138',
      900: '#0B2429',
      950: '#071A1E',
    },
    sand: {
      50: '#FBF9F4',
      100: '#F5F1E8',
      200: '#E9E2D4',
      300: '#D7CDB9',
      400: '#B3A892',
      500: '#8A8070',
      600: '#645C50',
      700: '#46403A',
    },
    brand: {
      300: '#6FCBCE',
      400: '#31A5AC',
      500: '#12838C',
      600: '#0C666E',
      700: '#094E56',
    },
    accent: {
      300: '#F58C7A',
      400: '#EA5C46',
      500: '#D93B28',
      600: '#B22B1B',
    },
  },

  /** Alias de compatibilité (manifest, thème navigateur, OG). */
  colors: {
    primary: '#0C666E',
    primaryDark: '#094E56',
    accent: '#D93B28',
    dark: '#071A1E',
    light: '#FBF9F4',
  },

  /* ── Réassurance / preuve ── */
  availability: '24h/24 · 7j/7',
  responseTime: 'Intervention rapide sur Metz et son agglomération',
  usps: ['Devis avant intervention', 'Sans casse', 'Artisan local', 'Urgence 7j/7'],
  methods: [
    'Furet électrique',
    'Hydrocurage haute pression',
    'Inspection vidéo par caméra',
    'Pompage et curage',
  ],

  /* ── Zone d'intervention (schema areaServed + bloc zones) ── */
  serviceArea: {
    base: 'Metz',
    radiusKm: 20,
    // Quartiers de Metz cités pour la couverture géo fine (maillage, pas de page dédiée).
    districts: [
      'Centre-ville', 'Sablon', 'Queuleu', 'Borny', 'Bellecroix',
      'Devant-les-Ponts', 'Nouvelle Ville', 'Plantières', 'Magny',
      'La Patrotte', 'Vallières', 'Les Îles',
    ],
  },

  /* ── Leads / formulaire ── */
  // Vide => l'API interne /api/contact gère le fallback (log + email tier gratuit).
  formEndpoint: '',

  /* ── SEO global ── */
  seo: {
    // NB : basculer sur le domaine final quand Rémy l'a acheté. Preview = URL Vercel.
    canonicalBase: 'https://www.sos-debouchage-metz.fr',
    defaultOgImage: '/og.jpg',
    locale: 'fr_FR',
    lang: 'fr',
  },

  /* ── Feature flags ── */
  features: {
    reviews: false, // ⛔ aucun avis affiché
    gallery: true,
    blog: true,
  },

  /* ── Persona artisan (DEMO, à remplacer par les infos du loueur) ── */
  persona: {
    // DEMO – à remplacer par les infos du loueur
    name: 'Julien Kieffer',
    // DEMO – portrait généré, remplaçable par une photo réelle
    photo: '/persona.jpg',
    // DEMO – à remplacer par les infos du loueur
    title: 'Responsable des interventions canalisation',
    // DEMO – à remplacer par les infos du loueur
    quote:
      'Un bouchon, ça se règle en une intervention quand on a le bon outil au bon endroit. On regarde avant de forcer.',
  },

  /* ── Bloc « à propos » ── */
  about: {
    eyebrow: 'Qui sommes-nous',
    title: 'Le débouchage,\nnotre seul métier',
    // DEMO – texte à valider avec le loueur
    body: [
      "SOS Débouchage Metz intervient sur les canalisations bouchées à Metz et dans les communes de l'agglomération. Évier qui refoule, WC bouché, colonne d'immeuble saturée, regard qui déborde : nous traitons l'urgence puis nous cherchons la cause.",
      "Nous ne faisons pas de plomberie générale. Nous faisons du débouchage, du curage et de l'inspection de réseau, avec le matériel correspondant : furet électrique, camion hydrocureur haute pression et caméra d'inspection. Le devis est annoncé avant l'intervention.",
    ],
    highlight: 'Un métier, un outillage dédié',
  },

  /* ── Étapes d'intervention ── */
  process: [
    {
      icon: 'phone',
      step: '01',
      title: 'Votre appel',
      desc: "Vous décrivez le symptôme : évier lent, WC qui refoule, odeurs, regard qui déborde. Nous identifions le type de bouchon et l'urgence.",
      duration: 'Immédiat',
    },
    {
      icon: 'search',
      step: '02',
      title: 'Diagnostic sur place',
      desc: "Nous repérons les regards et les accès, nous testons l'écoulement et nous déterminons où se situe le bouchon sur le réseau.",
      duration: 'Sur site',
    },
    {
      icon: 'tool',
      step: '03',
      title: 'Débouchage',
      desc: "Furet électrique pour un bouchon localisé, hydrocurage haute pression pour un réseau encrassé ou des racines. Sans casse.",
      duration: "Le jour de l'intervention",
    },
    {
      icon: 'check',
      step: '04',
      title: 'Contrôle et conseil',
      desc: "Nous vérifions l'écoulement, nous passons la caméra si la cause reste incertaine, et nous vous disons quoi faire pour éviter la récidive.",
      duration: 'Avant de partir',
    },
  ],

  /**
   * Chiffres affichés. Règle : uniquement des données vérifiables sur le site lui-même
   * (disponibilité annoncée, rayon d'intervention, nombre de prestations et de communes).
   * ⛔ Aucun chiffre d'activité inventé (interventions réalisées, années d'expérience).
   */
  stats: [
    { value: 24, suffix: 'h/24', label: 'Ligne urgence' },
    { value: 7, suffix: 'j/7', label: 'Week-ends et fériés' },
    { value: 20, suffix: ' km', label: 'Rayon autour de Metz' },
    { value: 8, suffix: '', label: 'Prestations canalisation' },
  ],

  whyUs: [
    {
      icon: 'shield',
      title: 'On regarde avant de forcer',
      desc: "Un bouchon mal identifié se déplace ou revient. Nous localisons la zone concernée avant de choisir la méthode, pour ne pas abîmer le réseau.",
    },
    {
      icon: 'clock',
      title: 'Une ligne ouverte 7j/7',
      desc: "Refoulement, WC bouché, odeurs : ces situations ne choisissent pas leur horaire. Vous nous joignez le week-end et les jours fériés.",
    },
    {
      icon: 'euro',
      title: 'Le prix annoncé avant',
      desc: "Vous savez ce que coûte l'intervention avant qu'elle commence. Pas de supplément découvert une fois le camion sur place.",
    },
    {
      icon: 'star',
      title: 'Artisan local, pas une plateforme',
      desc: "Vous parlez à la personne qui intervient. Pas de centrale d'appel qui revend votre demande au premier disponible.",
    },
  ],

  /* ── FAQ accueil ── */
  homeFaq: [
    {
      q: 'Combien coûte un débouchage de canalisation à Metz ?',
      a: "Le prix dépend de la prestation : un débouchage au furet sur un évier ou un WC n'a pas le même coût qu'un hydrocurage de colonne ou qu'une inspection caméra. Nous annonçons le tarif au téléphone en fonction de ce que vous décrivez, puis nous le confirmons sur place avant de commencer. Aucun travail n'est lancé sans votre accord.",
    },
    {
      q: 'Intervenez-vous en urgence le soir, le week-end et les jours fériés ?',
      a: "Oui. Un refoulement d'eaux usées ou des WC bouchés dans un logement occupé ne peuvent pas attendre le lundi. Notre ligne est ouverte 7j/7 pour les urgences sur Metz et les communes de l'agglomération dans un rayon d'environ 20 km.",
    },
    {
      q: 'Faut-il casser un mur ou creuser pour déboucher une canalisation ?',
      a: "Dans la très grande majorité des cas, non. Le débouchage se fait par les accès existants : siphon, regard de visite, tampon de dégorgement, WC. Le furet et l'hydrocureur passent par ces ouvertures. Nous ne proposons une ouverture du réseau que si l'inspection caméra montre une canalisation cassée ou effondrée, et jamais sans vous l'expliquer avant.",
    },
    {
      q: 'Les produits déboucheurs du commerce sont-ils une bonne solution ?',
      a: "Ils peuvent aider sur un ralentissement léger dû aux graisses ou aux cheveux. Sur un bouchon compact, ils restent stagnants au-dessus de l'obstacle et attaquent la canalisation, surtout sur du PVC ancien ou du plomb. Ils sont aussi dangereux pour l'intervenant qui ouvrira le siphon ensuite. Si l'eau ne s'écoule plus du tout, arrêtez les produits et appelez.",
    },
    {
      q: "Qui paie le débouchage en location, le locataire ou le propriétaire ?",
      a: "Le décret n° 87-712 place l'entretien courant des canalisations, dont le dégorgement, à la charge du locataire. En revanche, si le bouchon vient d'un défaut de la canalisation elle-même (vétusté, rupture, mauvaise pente, racines), la réparation revient au propriétaire. L'inspection caméra sert précisément à trancher : le rapport identifie la cause.",
    },
    {
      q: "Qui appeler quand c'est la colonne de l'immeuble qui est bouchée ?",
      a: "Quand plusieurs logements refoulent en même temps, le problème est sur la colonne ou le collecteur : c'est une partie commune, donc du ressort du syndic. Prévenez le syndic ou le gardien. Nous intervenons aussi bien pour un syndic ou un bailleur que pour un particulier, avec un compte rendu d'intervention.",
    },
  ],

  /* ── Légal (GABARIT, à compléter par Rémy avant prod) ── */
  legal: {
    showAddress: false, // false => schema SANS address
    address: { street: '', postalCode: '57000', city: 'Metz' },
  },
} as const
