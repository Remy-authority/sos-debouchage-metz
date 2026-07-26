# Template « Site Local » — SOS Débouchage Metz

Site **Next.js (App Router, 100 % SSG)** + **Tailwind** + **Framer Motion**, déployé
sur **Vercel**. Conçu comme un **template de site local paramétrable** : un site N+1
(autre métier / ville / nom commercial / locataire) est déployable **en moins d'un
jour** en changeant la **config**, le **contenu** et les **visuels**, sans toucher au
code ni au SEO.

Instance actuelle : **SOS Débouchage Metz** (débouchage de canalisations à Metz, 57).
Site n°3 du portefeuille, dupliqué du pilote `sos-fuite-angers.fr`.

---

## 1. Démarrage

```bash
npm install          # inclut les devDependencies (tailwind, typescript…)
npm run dev          # http://localhost:3000
npm run build        # build SSG de production
```

> ⚠️ En environnement `NODE_ENV=production`, utiliser `npm install --include=dev`
> pour récupérer les outils de build (tailwindcss, postcss, typescript).

---

## 2. Système de design

La couche visuelle est transposée de la landing de référence **PROTEC-DARD**
(cf. `CLAUDE.md` §2) et non du rendu du pilote d'Angers. Ses composantes :

| Élément | Où c'est défini |
|---|---|
| Palette (4 échelles : `ink`, `sand`, `brand`, `accent`) | `config/site.config.ts` → `palette` |
| Injection des tokens en CSS variables | `lib/theme.ts` → `<html style>` |
| Mapping vers Tailwind | `tailwind.config.ts` (aucune couleur en dur) |
| Typographie (Inter + Fraunces) | `app/layout.tsx` (next/font) |
| Vocabulaire de motion (variants, easing, stagger) | `lib/motion.ts` |
| Fonds, grilles, dégradés de titre, prose | `app/globals.css` (`@layer components`) |
| Primitives | `components/ui/` (Button, Card, SectionHeader, AnimatedSection, GradientBlob…) |

**Règle de couleur :** `brand` (teal) porte la structure et les surfaces,
`accent` (vermillon) est réservé à l'ACTION urgente (appel, devis, eyebrow).

**Changer la palette d'un site N+1 = éditer le bloc `palette` de la config.**

---

## 3. Déployer un NOUVEAU site local

1. **Fork / clone** ce dépôt.
2. Éditer **`config/site.config.ts`** : identité, contact, `palette`, `serviceArea`,
   `methods`, `process`, `stats`, `whyUs`, `homeFaq`.
3. Remplacer **`public/logo.svg`**, `app/icon.svg` et le composant `components/ui/Logo.tsx`.
4. Remplir **`content/services/*.json`** et **`content/zones/*.json`**, puis les
   articles **`content/conseils/*.mdx`**.
5. Compléter **`content/legal.json`** (éditeur, immatriculation, assurance, obligatoire en droit FR).
6. Produire les visuels de `public/` (voir §6).
7. `git push` → **Vercel** construit une preview par branche. Merge sur `main` = prod,
   uniquement après validation explicite.
8. Vérifier : `npm run build` vert, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/mentions-legales`.

**Changer de locataire** (sans impact SEO) : éditer seulement nom, logo, téléphone,
email, palette et `legal`. Les URLs, la structure et les textes SEO restent inchangés.

---

## 4. Architecture

```
config/site.config.ts      # ⭐ LE fichier à éditer (identité, contact, palette, contenus transverses)
content/
  services/*.json          # 1 fichier = 1 page /services/{slug}
  zones/*.json             # 1 fichier = 1 page /zones/{slug}
  conseils/*.mdx           # articles publiés (autoblog)
  drafts/*.mdx             # file d'attente de l'autoblog
  legal.json               # gabarit mentions légales / RGPD
lib/
  content.ts               # loaders fs + typage (services, zones, articles)
  seo.ts                   # Metadata API + JSON-LD
  theme.ts                 # palette (hex) → CSS variables → tailwind
  motion.ts                # variants Framer Motion partagés
components/
  layout/                  # Header, Footer, StickyCTA, PageHeader, LegalPage
  sections/                # Hero, TrustBar, About, Services, Process, Stats, WhyUs, Gallery, ServiceArea
  ui/                      # Button, Card, SectionHeader, AnimatedSection, GradientBlob, Faq, LeadForm…
app/
  page.tsx                 # accueil (page pilier)
  services/[slug]/page.tsx # generateStaticParams sur content/services
  zones/[slug]/page.tsx    # + /zones (hub)
  conseils/[slug]/page.tsx # + /conseils (listing), MDX
  contact/ merci/ mentions-legales/ politique-confidentialite/ politique-cookies/ cgu/
  api/contact/route.ts     # back-end formulaire (validation + honeypot + email)
  sitemap.ts robots.ts manifest.ts llms.txt/ icon.svg
```

---

## 5. SEO et GEO

- **Metadata API** sur toutes les pages : title, description, canonical absolu, OpenGraph, robots.
- **JSON-LD** : `Plumber` (global, avec `additionalType` Wikidata « débouchage »,
  `areaServed` et `hasOfferCatalog` généré depuis `content/services`, **sans `address`**
  par défaut, **sans avis**), `Service`, `FAQPage`, `BreadcrumbList`, `Article`.
- **`/llms.txt`** régénéré au build depuis la config et le contenu (levier GEO).
- **FAQ sur chaque page**, réponses rédigées pour rester compréhensibles citées seules.
- **`sitemap.xml`** (pages indexables uniquement), **`robots.txt`** (crawlers IA autorisés
  explicitement en prod), **manifest**.
- **Preview et prod non validée = noindex** (`VERCEL_ENV !== 'production'` ou `SEO_NOINDEX=1`).
- **Perf / a11y** : `next/font` self-hosté, mobile-first, cibles tap ≥ 48 px, landmarks,
  skip-link, focus visibles, `prefers-reduced-motion` respecté.

---

## 6. Visuels attendus dans `public/`

| Chemin | Usage |
|---|---|
| `logo.svg`, `app/icon.svg` | marque et favicon |
| `hero.jpg` | fond d'ambiance du hero d'accueil |
| `og.png` | image OpenGraph par défaut |
| `persona.jpg` | portrait de l'intervenant (bloc « qui sommes-nous ») |
| `gallery/01…06-*.jpg` | section « sur le terrain » de l'accueil |
| `services/<slug>.jpg` | en-tête de chaque page prestation |
| `zones/zone-*.jpg` | pool partagé des pages communes (assignation déterministe) |
| `conseils/*.jpg` | couvertures d'articles (`cover:` du front-matter) |

Règles de production : **aucun texte, logo ou filigrane dans l'image**, aucun visage
flou, décors réalistes et cohérents avec la région.

---

## 7. Formulaire de leads

`app/api/contact/route.ts` : validation (nom + téléphone requis), **honeypot**
anti-spam, envoi email. **Aucune dépense par défaut** : sans `RESEND_API_KEY`, la
soumission est journalisée. Pour activer l'email : définir `RESEND_API_KEY` et
`RESEND_FROM`. Post-soumission → `/merci`.

---

## 8. Garde-fous

- **Rien ne part en prod sans validation explicite de Rémy.**
- **Aucun faux avis, aucune fausse certification, aucune donnée légale inventée.**
  `features.reviews=false` ; `content/legal.json` est un gabarit à compléter.
- **Aucun chiffre d'activité inventé** : les `stats` affichées ne décrivent que le
  fonctionnement du service (disponibilité, rayon, nombre de prestations).
- **Aucun tiret cadratin** dans les textes visibles (règle typographique du projet).
- **Aucun texte métier en dur** dans les composants : tout vient de `config/` et `content/`.

## 9. Dette / à suivre

- Résidu `npm audit` : advisories **high** sur Next.js corrigées seulement en Next 15
  (migration majeure, hors périmètre). Impact faible pour un site 100 % SSG sur Vercel.
- `icon-192.png` et `icon-512.png` référencés par `app/manifest.ts` restent à produire.
