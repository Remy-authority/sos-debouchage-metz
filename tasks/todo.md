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
- [ ] Builder : passe corrective (rayon 30 km + 3 micro-défauts) puis re-contrôle CEO rapide
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

## PROCHAINE SESSION BUILDER : passe corrective demandée par le CEO (26/07/2026)

Contrôle visuel CEO : verdict positif, transposition PROTEC-DARD réussie et validée par Rémy.
Quatre points à corriger avant merge, et rien d'autre : ne pas toucher à ce qui fonctionne.

- [ ] **1. Rayon d'intervention : 30 km (décision Rémy, et non 20).**
      Passer `radiusKm: 30` dans `config/site.config.ts` ET corriger les 17 occurrences de
      « 20 km » écrites en dur : `config/site.config.ts` (dont une réponse de la FAQ d'accueil),
      les 12 `content/zones/*.json` et `content/services/urgence-debouchage-canalisation.json`.
      Vérifier ensuite qu'il ne reste aucun « 20 km » dans le repo hors `docs/`.
      Les drafts ne sont pas concernés (vérifié par le CEO).
      ⚠️ Si une formulation devient fausse avec 30 km (une commune décrite comme « en limite
      de zone » par exemple), adapter la phrase, pas seulement le chiffre.
- [ ] **2. Header des pages intérieures** (services, zones, contact…) : avant tout scroll, le
      header reste en état « texte clair » au-dessus du bandeau clair du fil d'Ariane, le
      sous-titre du logo « METZ · MOSELLE » est illisible. Le header doit démarrer en état
      « fond clair / texte sombre » sur les pages dont le haut est clair, comme il le fait
      déjà après scroll. (Piste : la logique `solid` de `components/layout/Header.tsx` ne
      dépend que de `scrolled` et de `mobileOpen`, il lui manque le cas « page sans hero sombre ».)
- [ ] **3. Titre de la FAQ d'accueil** : l'espace entre « Questions » et « fréquentes » est
      visuellement écrasé par l'italique Fraunces, les deux mots semblent collés. Garantir un
      espace réel et visible entre les deux spans.
- [ ] **4. Bloc process de l'accueil, carte 3** : le badge « LE JOUR DE L'INTERVENTION » passe
      sur deux lignes avec la puce mal alignée. Raccourcir le libellé (par exemple « JOUR J »)
      ou aligner correctement puce et texte sur deux lignes.

Livrable attendu : push sur la même branche `builder/design-contenu-metz`, une URL de preview
fraîche avec lien de partage, et `docs/ETAT.md` mis à jour. Le CEO fera un re-contrôle ciblé
sur ces 4 points uniquement.

## En attente de Rémy

- Validation + achat du domaine `sos-debouchage-metz.fr`
- **Téléphone dédié** : le site affiche un numéro de la plage ARCEP réservée à la fiction
  (`03 53 01 24 24`, marqué `phoneIsDemo: true`), à remplacer avant toute mise en ligne
- Email de contact réel
- Nom commercial et identité réelle de l'artisan (le persona `Julien Kieffer` est en DEMO)
- ~~Validation du rayon d'intervention~~ TRANCHÉ le 26/07/2026 : 30 km (à appliquer par le Builder)
- Assurance de l'artisan (RC pro / décennale) pour compléter `content/legal.json`
