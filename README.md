# Template « Site Local » — SOS Fuite d'Eau Angers

Site **Next.js (App Router, 100% SSG)** + **Tailwind**, déployé sur **Vercel**.
Conçu comme un **template de site local paramétrable** : un site N+1 (autre métier /
ville / nom commercial / locataire) est déployable **en < 1 jour** en changeant
uniquement la **config** et le **contenu**, sans toucher au code ni au SEO.

Pilote : SOS Fuite d'Eau Angers (recherche de fuite d'eau à Angers).

---

## 1. Démarrage

```bash
npm install          # (inclut les devDependencies : tailwind, typescript…)
npm run dev          # http://localhost:3000
npm run build        # build SSG de production
```

> ⚠️ En environnement `NODE_ENV=production`, utiliser `npm install --include=dev`
> pour récupérer les outils de build (tailwindcss, postcss, typescript).

---

## 2. Déployer un NOUVEAU site local en < 1 jour

1. **Fork / clone** ce dépôt.
2. Éditer **`config/site.config.ts`** : `businessName`, `trade`, `city`, `phone`,
   `email`, `colors` (3 hex re-thèment tout le site), `usps`, `serviceArea`, etc.
3. Remplacer le **logo** (`public/logo.svg`) et les icônes.
4. Remplir **`content/services/*.json`** et **`content/zones/*.json`** (structure +
   textes SEO), puis **`content/conseils/*.mdx`** (articles).
5. Compléter **`content/legal.json`** (éditeur, SIREN, assurance — **obligatoire FR**).
6. `git push` → **Vercel** construit une **preview** par branche. Merge sur `main`
   = prod (uniquement après validation).
7. Vérifier : `npm run build` vert, Lighthouse ≥ 90 (mobile), `/sitemap.xml`,
   `/robots.txt`, `/mentions-legales`.

**Changer de locataire** (personnalisation sans impact SEO) : on édite seulement
`nom`, `logo`, `phone`, `email`, `colors`, `legal` dans la config. Les URLs, la
structure et les textes SEO restent inchangés.

---

## 3. Architecture

```
config/site.config.ts      # ⭐ LE fichier à éditer (identité, contact, couleurs, flags)
content/
  services/*.json          # 1 fichier = 1 page /services/{slug}
  zones/*.json             # 1 fichier = 1 page /zones/{slug}
  conseils/*.mdx           # autoblog (front-matter + corps MDX)
  legal.json               # gabarit mentions légales / RGPD
lib/
  content.ts               # loaders fs + typage (services, zones, articles)
  seo.ts                   # Metadata API + JSON-LD (Plumber, Service, FAQPage, Breadcrumb, Article)
  theme.ts                 # config.colors (hex) → CSS variables → tailwind
components/
  ui/                      # PhoneButton, CtaBanner, LeadForm, Faq, Breadcrumbs
  sections/                # Header, Footer (config/content-driven)
app/
  page.tsx                 # ACCUEIL (page pilier)
  services/[slug]/page.tsx # generateStaticParams sur content/services
  zones/[slug]/page.tsx    # + /zones (hub)
  conseils/[slug]/page.tsx # + /conseils (listing) — MDX
  contact/ merci/ mentions-legales/ politique-confidentialite/
  api/contact/route.ts     # back-end formulaire (validation + honeypot + email)
  sitemap.ts robots.ts manifest.ts icon.svg
```

**Thème (clé du N+1) :** `siteConfig.colors` (hex) est injecté en **CSS variables**
sur `<html>` (`lib/theme.ts`), et `tailwind.config.ts` mappe ces variables sur des
tokens (`bg-primary`, `text-accent`, `bg-dark`…). **Changer 3 hex re-thème tout le site.**

---

## 4. Ajouter du contenu

- **Un service** : créer `content/services/mon-slug.json` (voir un fichier existant
  pour la structure : `slug, navTitle, h1, metaTitle, metaDescription, intro, bullets,
  blocks[], faq[], relatedServices[], order`). La page `/services/mon-slug` est générée
  au build.
- **Une ville** : créer `content/zones/ma-commune.json` (`slug, name, postalCode,
  h1, metaTitle, metaDescription, intro, blocks[], neighbours[], faq[]`).
  ⚠️ **Uniquement si l'intervention y est réelle** (pas de page « doorway »).
- **Un article** : ajouter `content/conseils/mon-article.mdx` avec front-matter
  (`title, slug, description, date, category, cover?, relatedServices[]`). Le
  **maillage interne** vers les pages services est automatique (`relatedServices`).

Les **textes SEO** (titles, metas, H1, corps, FAQ) sont fournis par le Spécialiste
SEO / Rédacteur : les fichiers livrés ici contiennent la **structure** + des
**placeholders `[À rédiger — ST-5/Rédacteur]`**.

---

## 5. SEO technique

- **Metadata API** (`generateMetadata`) sur toutes les pages : title, description,
  canonical absolu, OpenGraph, robots.
- **JSON-LD** : `Plumber` (global, layout, avec `areaServed`, **sans `address`** par
  défaut, **sans avis**), `Service`, `FAQPage`, `BreadcrumbList`, `Article`.
- **`sitemap.xml`** (pages indexables uniquement), **`robots.txt`**, **`manifest`**.
- **Preview = noindex** automatique (`VERCEL_ENV !== 'production'` ou `SEO_NOINDEX=1`).
- **Perf / a11y** : `next/font` self-hosté, mobile-first, cibles tap ≥ 48px, landmarks,
  skip-link, focus visibles. Cible **Lighthouse ≥ 90**.

---

## 6. Formulaire de leads (back-end)

`app/api/contact/route.ts` : validation (nom + téléphone requis), **honeypot**
anti-spam, envoi email. **Aucune dépense par défaut** : sans `RESEND_API_KEY`, la
soumission est journalisée (logs Vercel). Pour activer l'email : définir
`RESEND_API_KEY` (tier gratuit Resend) + `RESEND_FROM`. Post-soumission → `/merci`.

---

## 7. Garde-fous

- **Preview Vercel uniquement** — pas de déploiement prod sans validation.
- **Aucun faux avis / faux certif / donnée légale inventée.** `features.reviews=false`
  tant qu'il n'y a pas d'avis Google réels ; `content/legal.json` = gabarit à compléter.
- **Aucun texte métier en dur** dans les composants : tout vient de `config/` + `content/`.

## 8. Dette / à suivre

- Résidu `npm audit` : 2 advisories **high** sur Next.js corrigées seulement en
  **Next 15** (migration majeure, hors périmètre). Impact faible pour un site **100%
  SSG sur Vercel** (pas de middleware, pas d'`images.remotePatterns`). À planifier.
- Assets `public/` à fournir par le Web Designer : `logo.svg`, `og.png`,
  `icon-192.png`, `icon-512.png`.
