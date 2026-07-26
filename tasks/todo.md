# tasks/todo.md — SOS Débouchage Metz

> Suivi opérationnel des sessions. La checklist de référence long terme vit dans
> `docs/ETAT.md` (section 2). Ici : les tâches des sessions en cours.

## Session du 26/07/2026 (CEO)

- [x] Lire CLAUDE.md + docs/ETAT.md
- [x] Créer le repo GitHub `Remy-authority/sos-debouchage-metz` (public) + push de `main`
- [x] Créer le projet Vercel `sos-debouchage-metz` relié au repo (déploiement auto sur `main`)
- [x] Poser `SEO_NOINDEX=1` en environnement Production sur Vercel (noindex garanti tant que non validé)
- [x] Vérifier `app/robots.ts` : noindex OK (previews bloquées par `VERCEL_ENV`, prod bloquée par `SEO_NOINDEX`)
- [x] Vérifier que la GitHub Action `publish-article.yml` est active sur le nouveau repo
- [x] Vérifier que le build Vercel passe (déploiement `sos-debouchage-metz-2paiu0qmh` Ready, robots.txt = `Disallow: /`)
- [x] Audit CEO des livrables SEO (2 docs) et Autoblog (6 drafts) : conformes à la doctrine
- [x] Superviser les comptes-rendus SEO / Builder / Autoblog collés par Rémy
- [x] Audit des 26 drafts Autoblog finaux : conformes doctrine, slugs valides
- [x] Contrôle visuel CEO de la preview (desktop + mobile, ~35 captures) : verdict positif,
      patte PROTEC-DARD confirmée, 3 micro-défauts relevés → message Builder préparé
- [x] Builder : passe corrective (rayon 30 km + 3 micro-défauts) puis re-contrôle CEO rapide
- [x] Consolidation git : faite par le Builder sur la branche `builder/design-contenu-metz`
      (1er commit = travaux SEO + Autoblog, 2e commit = travaux Builder). `main` non touché.
- [x] Mettre à jour docs/ETAT.md (fait, à re-toucher si nouveaux comptes-rendus)
- [ ] Contrôle visuel CEO de la preview Builder, puis validation Rémy

## Session du 26/07/2026 (Builder, Opus) — TERMINÉE

Référence design : code source PROTEC-DARD (lecture seule).
Interdit : reproduire le rendu d'Angers ou d'Annecy. Interdit : tiret cadratin.

- [x] Étudier PROTEC-DARD (app, layout, sections, ui, motion, globals)
- [x] Auditer le template hérité (config, lib, app, components, content)
- [x] Dépendances : framer-motion 12 + lucide-react
- [x] Socle design : palette dans site.config, theme.ts, tailwind.config, globals.css, lib/motion.ts
- [x] Primitives UI : AnimatedSection, Button, Card, GradientBlob, SectionHeader, LiveDot, Faq, Breadcrumbs, LeadForm, Logo
- [x] Layout : Header (transformation au scroll, menu prestations, menu mobile animé), Footer, StickyCTA, PageHeader, LegalPage
- [x] Sections accueil : Hero, TrustBar, About, Services, Process, Stats, WhyUs, Gallery, ServiceArea, CtaBanner
- [x] Pages : accueil, prestation, commune, hub zones, conseils, article, contact, 4 pages légales, merci, 404
- [x] Contenu : 8 prestations, 12 communes, legal.json, lib/config.ts, llms.txt
- [x] SEO : schema Plumber désambiguïsé + hasOfferCatalog, robots.ts toujours en noindex
- [x] Visuels : logo, favicon, 36 images (hero, OG, persona, galerie, prestations, communes, articles)
- [x] Vérification : tsc propre, build vert (37 pages), captures Playwright desktop et mobile
- [x] Commit sur branche `builder/design-contenu-metz` + push (preview Vercel)

### Corrections faites pendant le contrôle visuel

- Blanc asymétrique au-dessus du bloc « qui sommes-nous » : grille passée en `items-start`.
- Nom du persona masqué par la carte de citation : marge basse augmentée.
- Panneau de menu mobile transparent : `bg-sand-50/97` n'existe pas dans l'échelle Tailwind.
- Header resté sombre au-dessus d'un panneau clair quand le menu mobile est ouvert.
- Les calques décoratifs du hero interceptaient le clic du bouton de menu mobile
  (règle globale `pointer-events: none` sur les calques `aria-hidden`).

## SESSION BUILDER : passe corrective demandée par le CEO (26/07/2026) — TERMINÉE

Contrôle visuel CEO : verdict positif, transposition PROTEC-DARD réussie et validée par Rémy.
Quatre points à corriger avant merge, et rien d'autre : ne pas toucher à ce qui fonctionne.

- [x] **1. Rayon d'intervention : 30 km (décision Rémy, et non 20).**
      `radiusKm: 30` posé dans `config/site.config.ts`, et les 17 occurrences de « 20 km »
      remplacées par « 30 km » (config + FAQ accueil + 12 `content/zones/*.json` +
      `content/services/urgence-debouchage-canalisation.json`). Vérifié : aucune formulation ne
      devenait fausse avec 30 km (aucune commune décrite comme « en limite de zone »), simple
      remplacement du chiffre. Vérifié : plus aucun « 20 km » dans le repo hors `docs/` (seule
      trace restante : la description de cette tâche elle-même dans `tasks/todo.md`).
- [x] **2. Header des pages intérieures** (zones/services/conseils en détail) : le header ne
      dépendait que de `scrolled` et `mobileOpen`. Ajout d'une détection `hasLightTop` basée sur
      le chemin (`/^\/(zones|services|conseils)\/[^/]+\/?$/`, les 3 routes qui utilisent
      `Breadcrumbs` au lieu d'un `PageHeader` sombre) dans `components/layout/Header.tsx`, qui
      force l'état solide (fond clair, texte sombre) dès le premier rendu sur ces pages. Vérifié
      visuellement en desktop et mobile sur une page zone et une page prestation : « METZ ·
      MOSELLE » lisible avant tout scroll. Note mineure hors périmètre : sur une page 404 dont
      l'URL ressemble à une de ces routes (slug d'article pas encore publié par exemple), le
      header s'affiche aussi en solide au lieu du hero sombre habituel des 404, ce qui reste
      parfaitement lisible et n'est pas un défaut de contraste, simplement une variation
      esthétique mineure sur un cas limite non demandé.
- [x] **3. Titre de la FAQ d'accueil** : le span italique « fréquentes » démarrait par un espace
      littéral, rendu quasi invisible par le slant de l'italique Fraunces. Remplacé par une marge
      explicite (`ml-3`) sur le span dans `components/ui/Faq.tsx`, espace net et visible en
      desktop, sans impact sur mobile où le titre passe déjà à la ligne.
- [x] **4. Bloc process de l'accueil, carte 3** : libellé raccourci de « Le jour de
      l'intervention » à « Jour J » dans `config/site.config.ts` (`process[2].duration`), le
      badge tient sur une ligne avec la puce correctement alignée, en desktop et mobile.

Livrable : `npm run build` vert (37 pages), contrôle visuel Playwright desktop + mobile sur les
4 points, push sur `builder/design-contenu-metz`, URL de preview transmise au CEO.

## En attente de Rémy

- Validation + achat du domaine `sos-debouchage-metz.fr`
- **Téléphone dédié** : le site affiche un numéro de la plage ARCEP réservée à la fiction
  (`03 53 01 24 24`, marqué `phoneIsDemo: true`), à remplacer avant toute mise en ligne
- Email de contact réel
- Nom commercial et identité réelle de l'artisan (le persona `Julien Kieffer` est en DEMO)
- ~~Validation du rayon d'intervention~~ TRANCHÉ le 26/07/2026 : 30 km (à appliquer par le Builder)
- Assurance de l'artisan (RC pro / décennale) pour compléter `content/legal.json`
