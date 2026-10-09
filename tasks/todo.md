# tasks/todo.md — SOS Débouchage Metz

## Session du 10/10/2026 : MISE À JOUR COMPLÈTE (GO Rémy 10/10, niveau forage Poitou et Lorraine)

Objectif : aperçu complet pour le 13/10 au soir (bilan d'essai Eco Assainissement le 14/10).
Rien sur `main` sans GO. Branche à créer : `maj/scrollytelling-2026-10`.

### État des lieux (§0), mesuré le 10/10/2026
- Search Console relevée le 09/10 (cockpit/data/gsc) + requête page × requête 90 j (tasks/.maj-metz/gsc-page-query-90j.txt).
- 4 listes :
  1. Pages vues 10 fois ou plus sans clic (28 j) : zones/marly 97, zones/woippy 60, conseils/racines 28,
     conseils/bruit-glouglou 27, zones/montigny 24, zones/moulins 21, conseils/curage-copropriété 20,
     zones/marange 20, contact 17, /zones 14, conseils/mousse-eau 12, zones/saint-julien 12,
     services/urgence 11, zones/ars 11, zones/augny 11, zones/longeville 10.
  2. Gains rapides (position 8 à 30) : « débouchage marly » 11,5 (28 j), « débouchage canalisation woippy » 20,
     « débouchage canalisation marly » 25, « inspection canalisation camera » 28.
  3. Requêtes de prix : aucune (0 vue sur 90 j).
  4. Page pilier : /zones/marly (260 vues sur 90 j).
- Note AVANT : 3/10 (1 ❌ H1 sans la requête et avec deux-points · 2 ✅ · 3 ❌ Marly sans H2 sur ses requêtes ·
  4 ✅ · 5 ❌ · 6 ✅ · 7 ❌ bloc 1 téléphone voilé, 4 lignes de titre · 8 ❌ aucun schéma sur l'accueil ·
  9 ❌ 47 brouillons = 9 semaines · 10 ❌).
- Contrôles production (3cee4d5) : footprint ECHEC 51 phrases (gabarit commun), design 4 défauts, blocs-pages OK
  (sur l'alias vercel.app), visuels-articles OK, navigation OK ; check-texte ECHEC 1 255 mots, plus long 59.
- Vitesse mobile production : 87 / 90 / 90, médiane 90, LCP 3,4 s.

### Expressions à garder (§1 quater A, 5 vues ou un clic sur 90 j, page par page)
- Accueil : « sos canalisation bouchée » (67, mots séparés aujourd'hui), « débouchage canalisation metz » (21),
  « sos debouchage » (6, 1 clic).
- /zones/marly : « débouchage canalisation marly » (115), « débouchage marly » (65), « wc bouché marly » (53),
  « débouchage wc marly » (21) : aujourd'hui en mots séparés, à poser en clair (title, H1, H2).
- /zones/woippy : « débouchage canalisation woippy » (29).
- /zones/montigny-les-metz : « débouchage canalisation montigny-lès-metz » (42), présente.
- Écartées : « plombier … », « debarras … » (hors métier), « débouchage canalisation rémilly/talange » (communes non couvertes).

### Chantiers (après GO des scénarios et du budget)
- [x] Bloc 1 scrollytelling : VALIDÉ par Rémy le 10/10 (0d6f782), bouchon de lingettes, retour sur la salle de bain
- [ ] Bloc 3 scrollytelling (coupe couleur d'une maison messine, 5 étapes)
- [x] Formulaire noir (mêmes champs, JSON comparé avant/après, route et destinataires inchangés), icônes alignées
- [ ] Accueil à 750 mots, 25 mots par paragraphe, icônes du métier animées en continu, angles 2 à 4 px
- [ ] Zones : carte de l'agglomération messine, communes cliquables, bloc 7 ou 8
- [x] H1 accueil « Débouchage canalisation Metz, sans casse »
- [ ] Pilier Marly + Woippy : title, H1, H2 sur les requêtes réelles, paragraphes à 45 mots
- [ ] Titres et descriptions des 16 pages vues sans clic
- [ ] Autoblog : +18 brouillons (65 = 3 mois à 5/semaine)
- [x] Promesse « 24h/24 · 7j/7 » : GARDÉE (Rémy 10/10)
- [ ] Contrôles ×2, check-texte, check-lignes, vitesse ×3 alternée, relecture à froid, Rank OS, ETAT

## Session du 20/09/2026 (CEO du site, branche `optim/tarifs-zones-mobile`)

Commande de Rémy : 6 chantiers, une branche de travail, rien sur `main` sans GO.

- [x] 1. Page `/tarifs` : titre visé, H1 grand, photo de couverture, 16 fourchettes de prix
      TOUTES sourcées (source + date affichées, chaque URL rouverte et vérifiée par le CEO),
      majoration nuit et week-end, ce qui fait varier le prix, FAQ, formulaire en bas.
      Reliée depuis le PIED DE PAGE, les pages prestation et un paragraphe de corps. Jamais
      au menu, jamais dans le bloc 1. Aucun prix au JSON-LD.
- [x] 2. 12 pages communes : bloc « repères » (population, superficie, intercommunalité)
      relevé à geo.api.gouv.fr et recontrôlé à l'API par le CEO, un bloc de contenu
      « Le réseau d'assainissement à X », un bloc prix qui renvoie à /tarifs.
- [x] 3. Accueil : bloc des communes placé en 8e position (jamais en bloc 2). Le reste de la
      structure de l'accueil n'est pas touché.
- [x] 4. Titres et descriptions réécrits : accueil, hub zones, 12 communes, 4 prestations,
      2 articles très vus sans clic. Format « Débouchage canalisation + commune (57) »,
      30 à 60 caractères, descriptions 120 à 160, 5 gabarits de titre (anti-copie).
- [x] 5. Mobile SEULEMENT : photo du métier visible en fond du bloc 1 (elle était voilée à
      12 %), textes et titres centrés, pied de page court et dépliant. Ordinateur et tablette
      prouvés inchangés par captures avant/après.
- [x] 6. Autoblog à 5 par semaine (cron lundi au vendredi) + 5 brouillons de plus (65 au
      total), sujets choisis sur ce qui rentre en Search Console.
- [x] 7. Fiche Rank OS : notes réécrites, `dates.autoblogEndsAt` au 15/12/2026 (62 brouillons
      à 5 par semaine), entrée `travaux` du 20/09, cadence relevée. Poussée sur le cockpit.
- [x] Retours de Rémy sur l'aperçu : 6 photos de galerie refaites en premium, photo du bloc 1
      mobile remplacée par une cuisine (la rue ne disait pas le métier), titre du bloc 1
      agrandi sur téléphone, bandeau de réassurance sur deux colonnes, texte « qui sommes-nous »
      moins haut, page Tarifs (H1, bouton, photo après le titre sur téléphone).
- [x] GO de Rémy, merge sur `main`, site public vérifié en 200 avec le vrai titre.
- [x] Protection des aperçus Vercel remise en `all_except_custom_domains`.

## Ce qui reste, et qui dépend de Rémy (au 20/09/2026)

- [x] **Test du formulaire : ABANDONNÉ, décision de Rémy du 20/09/2026.** Motif : la chaîne
      est bien branchée, et c'est justement le problème. `contact@sos-debouchage-metz.fr`
      est livré EN MÊME TEMPS à Rémy, à `eco_assainissement@yahoo.fr` (M. Akin) et au
      webhook Rank OS ; le 09 39 20 03 10 renvoie sur le 06 51 79 24 20 de M. Akin et chaque
      appel compte comme une demande facturable à 10 €. Un test de recette dérangerait donc
      un partenaire payant. La coupure temporaire a été écartée : la règle Forward Email a
      une durée de vie d'une heure, « 5 minutes » n'existe pas.
      CONSÉQUENCE ASSUMÉE : `check-fin-de-site.py` gardera le défaut « Resend : aucun email
      tracé » tant qu'un VRAI client n'aura pas rempli le formulaire. Ce n'est pas une
      panne : les clés Resend sont bien posées en production sur le projet Vercel (vérifié
      le 20/09), et deux vraies demandes sont déjà entrées dans Rank OS, arrivées par mail
      direct sur contact@. Seul le chemin « formulaire du site » n'a jamais été emprunté.
- [ ] **H1 de l'accueil** : le contrôle de ciblage demande le mot « débouchage » dans le H1,
      qui dit aujourd'hui « Canalisation bouchée à Metz, réglée sans casse. ». Proposition
      soumise à Rémy : « Canalisation bouchée à Metz : débouchage sans casse. ». Rien n'est
      changé tant qu'il n'a pas tranché : ce H1 fait partie du design qu'il a validé.
- [ ] **Indexation** : Rémy demande l'indexation des pages dans sa Search Console.


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
- [x] Contrôle visuel CEO de la preview Builder : fait, verdict positif
- [x] Re-contrôle CEO des 4 corrections (30 km, header, FAQ, Jour J) : tout vérifié conforme
- [ ] SESSION SUIVANTE : attendre les vraies valeurs de Rémy (domaine, téléphone, email,
      identité artisan, assurance) → Builder les injecte → validation finale Rémy → merge `main`

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
