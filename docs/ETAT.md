# ETAT.md — Journal de bord SOS Débouchage Metz

> Mémoire du projet. Chaque session lit ce fichier en arrivant et le met à jour avant de finir.
> Dernière mise à jour : 2026-07-27 (session Autoblog lot T3 : 30 nouveaux drafts, réserve à 80 articles ≈ 6 mois).

---

## 🔖 POINT DE REPRISE (état exact au 26/07/2026 — à lire en premier)

**Site n°3 du portefeuille** (métier : débouchage de canalisations, ville : Metz, 57). Rien n'est
public : dossier créé par duplication du template `sos-fuite-angers.fr`, playbook Étapes 1-2
TERMINÉES : repo GitHub `Remy-authority/sos-debouchage-metz` (public, main poussé), projet Vercel
`sos-debouchage-metz` relié (déploiement auto sur main), Action autoblog active. **Verrous en
place** : `SEO_NOINDEX=1` en env Production Vercel (robots.txt vérifié servi en `Disallow: /`)
+ protection par authentification Vercel sur les URLs de déploiement (le CEO génère des liens
de partage temporaires pour les contrôles visuels).

**Opportunité validée** par le benchmark vague 2 (détail : `RENT & RANK/docs/BENCHMARK.md`) :
verdict 🟢 Boulevard, n°2 du top 5. Marché fragmenté, aucun acteur local tout-service dominant.
Concurrent le plus sérieux : Compagnie des Déboucheurs (avis vérifiés, 21 zones, prix transparents)
mais MONO-SERVICE, un site premium débouchage + urgences canalisations le contourne. CPC estimé
5-15 €, saisonnalité nulle. NOTE : on a volontairement écarté « plombier urgence Metz » pour ne pas
nous concurrencer nous-mêmes ; ce site couvre le débouchage et les urgences canalisations, pas la
plomberie générale.

**Domaine pressenti : `sos-debouchage-metz.fr`** (vérifié DISPONIBLE à l'AFNIC le 26/07/2026,
PAS ENCORE ACHETÉ, en attente validation Rémy).

---

## ⚠️ DESIGN : LEÇON DU SITE N°2 (ANNECY), RÈGLE POUR CE SITE

Sur Annecy, le Builder avait pour référence une URL de site en ligne : il n'a pas pu percevoir le
motion design et a reproduit quasi à l'identique le rendu du template d'Angers. **Correction pour
ce site :**

- **Référence design = PROTEC-DARD**, dont le CODE SOURCE est lisible en local :
  `/Users/zaouiremy/Desktop/Claude code/Template siteweb/Prospects/Deratisation/PROTEC-DARD/`
  (lecture seule, ne JAMAIS y écrire). Stack : Next.js + Framer Motion 12, polices Inter + Fraunces,
  composants dans `components/layout|sections|ui`.
- Le Builder doit EXTRAIRE le système de design du code (typographie, échelles, variants
  Framer Motion, durées, easings, effets au scroll, rythme des sections) et le TRANSPOSER en site
  multi-pages (accueil, services, zones, blog, légal), adapté au métier débouchage.
- Interdit : réutiliser le rendu visuel d'Angers/Annecy. La structure technique (config, contenu
  JSON, autoblog) reste celle du template ; c'est la COUCHE VISUELLE qui doit venir de PROTEC-DARD.
- Anti-empreinte Google : chaque site du portefeuille doit avoir un rendu distinct (palette,
  images, textes réellement différents).

---

## 1. CE QU'ON SAIT (acquis)

- Socle technique du pilote fonctionnel : Next.js, autoblog, GitHub Action `publish-article.yml`.
- Couche visuelle Metz LIVRÉE par le Builder (voir §4, session Builder du 26/07/2026) :
  système de design transposé du code source PROTEC-DARD, palette propre au site,
  Inter + Fraunces, Framer Motion.
- Contenu Metz LIVRÉ : 8 pages services + 12 pages communes + légal + visuels.
- **Codes postaux des 12 communes vérifiés** sur `geo.api.gouv.fr` (source INSEE / La Poste)
  le 26/07/2026. Une correction par rapport au plan SEO : **Marange-Silvange = 57535**
  (le plan indiquait 57157). Les 11 autres sont confirmés.

## 2. RESTE À FAIRE (checklist playbook)

- [ ] Rémy : valider le domaine (8 candidats libres, voir conversation CEO-portefeuille) et l'acheter ; fournir téléphone dédié + email + nom commercial
- [x] CEO : créer le repo GitHub + le projet Vercel (Étape 1.3-1.4) (fait 26/07/2026)
- [x] SEO : carte mots-clés débouchage Metz + `docs/SEO-GEO-PLAN.md` + `docs/CALENDRIER-EDITORIAL.md` (fait 26/07/2026)
- [x] Builder : `config/site.config.ts` (identité, palette propre au site, persona DEMO) + `content/legal.json` (fait 26/07/2026)
- [x] Builder : réécrire `content/services/*.json` (8) et `content/zones/*.json` (12) selon le plan SEO (fait 26/07/2026)
- [x] Builder sur Opus : COUCHE VISUELLE COMPLÈTE depuis le code PROTEC-DARD (fait 26/07/2026)
- [x] Builder : logo, portrait persona, images (36 visuels générés, aucun texte/logo, décors lorrains) (fait 26/07/2026)
- [x] Autoblog : drafts T1+T2+T3, réserve à **80 drafts** dans `content/drafts/` (11 publiés
      depuis le lancement, cadence lun/mer/ven ≈ 3/semaine, soit environ 26-27 semaines ≈ 6 mois
      de contenu d'avance, objectif Rémy du 27/07/2026 atteint). Les 90 sujets du calendrier (24
      d'origine + 66 complémentaires dont les lots T2 et T3) sont tous couverts et marqués ✅ dans
      `docs/CALENDRIER-EDITORIAL.md` (fait 27/07/2026, voir historique).
- [x] Vérifier `robots.ts` en noindex tant que non validé (fait 26/07/2026 : `SEO_NOINDEX=1` posé en Production Vercel, robots.txt servi vérifié `Disallow: /` ; retirer la variable uniquement à l'Étape 6 sur validation Rémy)
- [x] Builder : passe corrective post-contrôle CEO (rayon 30 km + 3 micro-défauts visuels) (fait 26/07/2026)
- [ ] Contrôle visuel CEO → validation Rémy → mise en ligne (Étape 6 du playbook)

## 3. DÉCISIONS RÉMY

- 25/07/2026 : top 5 vague 2 validé ; Metz (débouchage) est le n°2 de la file de lancement.
- 26/07/2026 : nouvelle référence design pour les sites à partir du n°3 : PROTEC-DARD (motion,
  typographie, structure), adaptée en site complet multi-pages.
- 26/07/2026 : arbitrage éditorial validé par Rémy : 1) sujet 4 ⭐ du calendrier (désambiguïsation
  débouchage/curage/caméra) à réécrire entièrement par l'Autoblog ; 2) les 5 autres sujets
  partiellement couverts (2, 5, 7, 10, 17) sont considérés comme couverts, angles manquants en
  articles complémentaires de fin de calendrier ; 3) drafts 005 et 009 conservés, le 009
  (refoulement d'égout) est à intégrer officiellement au calendrier, le 005 (calcaire) passe en
  fin de file de publication.
- 26/07/2026 : Rémy valide le site livré par le Builder (preview branche `builder/design-contenu-metz`)
  sur le plan visuel. Décision : rayon d'intervention porté à 30 km (et non 20 proposé par le SEO
  ni 25 comme Angers). Corrections mineures Builder avant merge, listées en historique.

## 4. HISTORIQUE DES SESSIONS

- **26/07/2026 (CEO-portefeuille)** : création du dossier par duplication du pilote, nettoyage du
  contenu Angers, CLAUDE.md adapté (identité Metz + référence design PROTEC-DARD), journal neuf,
  git initialisé. Aucun contenu Metz encore écrit : travail du Builder et du SEO aux prochaines
  sessions.
- **26/07/2026 (SEO)** : rédaction de `docs/SEO-GEO-PLAN.md` (carte mots-clés urgence/service/GEO/
  zones, architecture 8 pages services + 12 pages zones agglo Metz, stratégie GEO/citabilité IA,
  maillage interne) et `docs/CALENDRIER-EDITORIAL.md` (24 sujets blog sur 12 mois, 2/mois, priorités
  ⭐ si resserrement). Périmètre respecté : docs/ uniquement, aucun fichier content/ ou config/
  touché. Points en attente de vérification par le Builder avant publication : les 12 codes
  postaux zones (indiqués de mémoire, à confirmer source officielle) et le rayon d'intervention
  proposé (20 km, à valider par Rémy dans `serviceArea.radiusKm`).
- **26/07/2026 (CEO site)** : Étape 1 du playbook terminée. Repo GitHub `Remy-authority/sos-debouchage-metz`
  créé (public) et `main` poussé ; projet Vercel `sos-debouchage-metz` créé et relié au repo
  (déploiement auto sur `main`) ; `SEO_NOINDEX=1` posé en env Production AVANT tout déploiement ;
  Action `publish-article.yml` vérifiée active. Build Vercel vérifié : passe (déploiement
  `sos-debouchage-metz-2paiu0qmh`, robots.txt servi = `Disallow: /`). Note : le CLI a envoyé ce
  premier déploiement en target production au lieu de preview ; sans conséquence (noindex actif +
  URL protégée par authentification Vercel, aucun domaine public relié), mais les prochains
  contrôles visuels se feront sur des previews de branche. `tasks/todo.md` et `tasks/lessons.md`
  créés (leçon Annecy + leçon SEO_NOINDEX consignées). Audit CEO des livraisons parallèles :
  docs SEO conformes (tirets « — » uniquement dans des titres internes, tolérés hors texte site) ;
  6 drafts Autoblog (001-006) contrôlés : zéro tiret cadratin, zéro chiffre inventé, zéro fausse
  certification. Travaux SEO/Autoblog laissés NON COMMITÉS (session Autoblog possiblement encore
  active) : consolidation git par le CEO une fois les comptes-rendus agents reçus. Rappel : tout
  push sur `main` déclenche un déploiement production Vercel (protégé noindex + auth).
- **26/07/2026 (CEO site, supervision)** : compte-rendu SEO reçu et conforme à l'audit. Autoblog
  arrêté par Rémy à 12 drafts (001-012) : contenu propre (audit OK) mais écrit AVANT/PENDANT le
  travail SEO, donc les drafts recoupent les thèmes du calendrier éditorial sans suivre ses titres
  ni son séquencement. DÉCISION À APPLIQUER à la prochaine session Autoblog : conserver les 12
  drafts, les rapprocher des 24 sujets du calendrier (sujets déjà couverts à marquer), et suivre
  strictement le calendrier pour les lots suivants (éviter les doublons). Builder EN COURS et sur
  la bonne voie, vérifié par le CEO : `lib/motion.ts` transpose fidèlement le motion de
  PROTEC-DARD (ease `[0.22,1,0.36,1]`, durées 0.5-0.7, stagger), palette nouvelle sarcelle
  profond + crème (distincte d'Angers bleu/orange), `site.config.ts` en identité Metz avec
  téléphone marqué `phoneIsDemo: true`. L'échec d'installation framer-motion/lucide-react signalé
  en notification a été rattrapé : les deux paquets sont installés et présents dans package.json.
- **26/07/2026 (Autoblog, réconciliation)** : mission du CEO exécutée. 1) Les `relatedServices` des
  12 drafts existants (001-012) ont été corrigés pour pointer vers les vrais slugs de pages
  services du `SEO-GEO-PLAN.md` (`urgence-debouchage-canalisation`, `debouchage-wc-toilettes-bouchees`,
  `debouchage-evier-lavabo-douche`, `curage-canalisation-haute-pression`, `inspection-camera-canalisation`,
  `debouchage-canalisation-enterree-regard`, `debouchage-bac-a-graisse`,
  `debouchage-colonne-immeuble-copropriete`), qui pointaient auparavant vers des slugs inventés
  avant l'existence du plan SEO. 2) Correspondance établie entre les 12 drafts et les 24 sujets du
  `CALENDRIER-EDITORIAL.md`, marquée directement dans ce fichier (✅ couvert / ⚠️ partiellement
  couvert, avec numéro de draft) : 5 sujets bien couverts (8, 11, 14, 18, 22), 6 partiellement
  couverts avec angle différent de la consigne calendrier (2, 4, 5, 7, 10, 17, détail des écarts
  dans le fichier), 13 sujets restent à écrire dans l'ordre. 3) Deux drafts sans correspondance
  calendrier signalés pour arbitrage Rémy/CEO : `005-calcaire-eau-dure-metz-canalisations.mdx`
  (hors carte mots-clés) et `009-refoulement-egout-que-faire-urgence.mdx` (hors calendrier mais
  couvre la requête prioritaire « eau qui remonte évacuation » du plan SEO, signalé au SEO comme
  angle manquant à considérer pour un ajout au calendrier). Zéro tiret cadratin, zéro chiffre
  inventé vérifiés sur les fichiers touchés. Périmètre respecté : uniquement `content/drafts/` et
  `docs/CALENDRIER-EDITORIAL.md` modifiés (+ ce journal). DÉCISION ATTENDUE DE RÉMY/CEO : arbitrer
  les 6 sujets ⚠️ (réécrire avec l'angle exact du calendrier, ou considérer les drafts existants
  comme suffisants) et le sort des drafts 005/009.
- **26/07/2026 (Builder, Opus)** : LIVRAISON COMPLÈTE de la couche visuelle et du contenu.
  1) **Design** : étude du code source PROTEC-DARD puis transposition en site multi-pages.
  `lib/motion.ts` reprend ses variants (ease `[0.22,1,0.36,1]`, fadeInUp y:24 / 0.6 s, stagger
  0.1, viewport `once amount:0.2`), plus parallaxe de hero (`useScroll`/`useTransform`),
  compteurs animés, accordéons `AnimatePresence`, halos de gradient animés 14 à 22 s.
  Typographie Inter + Fraunces comme la référence. Primitives dans `components/ui/`
  (Button, Card, SectionHeader, AnimatedSection, GradientBlob, LiveDot) et
  `components/layout/` (Header à menu déroulant prestations, Footer, StickyCTA, PageHeader,
  LegalPage). Rythme de sections en alternance sombre/clair, `py-24 lg:py-32`,
  conteneur `max-w-7xl px-6 lg:px-10`.
  2) **Palette NOUVELLE, propre au site** : 4 échelles dans `siteConfig.palette`, `ink`
  (bleu pétrole profond, fonds), `sand` (neutres chauds, écho pierre de Jaumont), `brand`
  (teal eau, structure), `accent` (vermillon, réservé à l'action urgente). Aucune reprise
  du bleu/orange d'Angers ni du zinc/ambre de PROTEC-DARD. Source unique : la config,
  convertie en CSS variables par `lib/theme.ts`, consommées par `tailwind.config.ts`
  (aucune couleur en dur dans le code).
  3) **Contenu** : 8 pages services et 12 pages communes conformes au `SEO-GEO-PLAN.md`,
  `content/legal.json`, `homeFaq`, `whyUs`, `process`, `llms.txt` régénéré dynamiquement.
  Schema `Plumber` conservé (rien de plus spécifique chez schema.org) mais désambiguïsé
  par `additionalType` Wikidata « débouchage de canalisation » et enrichi d'un
  `hasOfferCatalog` construit depuis `content/services`.
  4) **Visuels** : 36 images générées (hero, OG, portrait persona, 6 galerie, 9 prestations,
  6 communes, 12 couvertures d'articles, 12 visuels intégrés aux articles), sans texte ni
  logo, portrait net, décors cohérents. `public/` optimisé à environ 12 Mo.
  5) **Vérifications** : `tsc --noEmit` propre, `next build` vert (37 pages statiques),
  contrôle visuel par captures Playwright sur accueil, prestation, commune, hub zones,
  contact, légales, article et mobile. Trois défauts trouvés et corrigés : blanc asymétrique
  au-dessus du bloc « qui sommes-nous », nom du persona masqué par la carte de citation,
  panneau de menu mobile transparent (classe d'opacité Tailwind inexistante).
  Audit final : zéro tiret cadratin, zéro occurrence de « plombier », zéro chiffre d'activité
  inventé, `robots.txt` servi en `Disallow: /`.
  EN ATTENTE DE RÉMY : téléphone réel (le site affiche un numéro de la plage ARCEP réservée
  à la fiction, marqué `phoneIsDemo: true`), email, nom du persona et de l'artisan,
  validation du rayon de 20 km, achat du domaine.
- **26/07/2026 (CEO site, contrôle Autoblog)** : compte-rendu Autoblog vérifié par le CEO,
  exact sur tous les points : les `relatedServices` des 12 drafts utilisent bien uniquement les
  8 slugs services du plan SEO (vérifié par extraction), le marquage ✅/⚠️ est présent inline et
  en résumé dans `CALENDRIER-EDITORIAL.md`, zéro tiret cadratin dans les drafts. Recommandations
  d'arbitrage transmises à Rémy (sujet 4 ⭐ à réécrire, fusion 5+7 à conserver, drafts 005/009 à
  garder dont 009 à intégrer au calendrier), en attente de sa décision.
- **26/07/2026 (Autoblog, arbitrage appliqué + lot suivant)** : arbitrage Rémy du 26/07/2026 exécuté
  intégralement. 1) Sujet 4 ⭐ réécrit à neuf (`013-debouchage-curage-inspection-camera-differences.mdx`,
  périmètre complet des 3 interventions, réponse directe en ouverture, lien vers les 3 pages
  services concernées) ; le draft `010` (comparaison furet/haute pression, angle plus étroit) reste
  en place tel quel comme article distinct. 2) Draft `009` intégré officiellement au calendrier
  comme sujet complémentaire 25 (✅ couvert, rattaché à `urgence-debouchage-canalisation`, note sur
  la requête prioritaire « eau qui remonte évacuation » du plan SEO). 3) Sujets 2, 5, 7, 10, 17
  repassés de ⚠️ à ✅ dans `CALENDRIER-EDITORIAL.md` (drafts existants jugés suffisants) ; les angles
  manquants (WC sans ventouse, lingettes/cheveux) transformés en 2 nouveaux sujets complémentaires
  non encore écrits (26, 27) en fin de calendrier. 4) Draft `005` conservé et renommé
  `990-calcaire-eau-dure-metz-canalisations.mdx` pour publier en dernier dans la file
  `content/drafts/` (tri alphabétique du script de publication), note ajoutée dans le calendrier.
  5) Lot suivant rédigé dans l'ordre strict du calendrier : les 13 sujets restants (1, 3, 6, 9, 12,
  13, 15, 16, 19, 20, 21, 23, 24) ont été écrits en drafts `014` à `026`, chacun rattaché à sa page
  service prévue par le calendrier, réponse directe en ouverture, FAQ, CTA final. Total : 26 drafts
  en attente de publication dans `content/drafts/`. Vérifications faites sur l'ensemble des
  fichiers touchés : zéro tiret cadratin, zéro chiffre inventé (seuls chiffres présents : dates,
  numéros de liste à puces, et le délai légal de 5 jours ouvrés pour une déclaration de sinistre),
  zéro occurrence de « plombier ». Périmètre respecté : uniquement `content/drafts/` et
  `docs/CALENDRIER-EDITORIAL.md` modifiés (+ ce journal). Restent à écrire, sans urgence, les 2
  sujets complémentaires 26 et 27. Prochaine étape naturelle : contrôle CEO des 14 nouveaux drafts
  avant que l'Action `publish-article.yml` ne commence à les publier (lun/mer/ven, file actuelle de
  26 drafts, plusieurs mois de contenu déjà en réserve).
- **26/07/2026 (CEO site, contrôle visuel)** : audit des 26 drafts Autoblog finaux : conformes
  (zéro tiret cadratin, zéro chiffre inventé, zéro « plombier », zéro tarif chiffré dans l'article
  prix, slugs relatedServices tous valides). Contrôle visuel CEO de la preview Builder au
  navigateur (desktop 1440 + mobile 390, défilement lent, ~35 captures : accueil, service urgence,
  zone Montigny, blog, contact, légal, 404, menu mobile) : VERDICT POSITIF. La patte PROTEC-DARD
  est là (Fraunces display, ease [0.22,1,0.36,1], alternance pétrole/sable, vermillon réservé à
  l'urgence), aucune ressemblance avec Angers/Annecy. Menu mobile opaque OK. Compteurs animés OK
  (les valeurs intermédiaires sur captures sont l'animation de comptage). Le « header au milieu de
  page » sur captures pleine page est un artefact de capture du header sticky, pas un défaut.
  Micro-défauts relevés pour le Builder : 1) header en haut des pages intérieures : texte clair
  (logo « METZ · MOSELLE », nav) sur bandeau clair translucide au-dessus du fil d'Ariane, contraste
  insuffisant avant le premier scroll ; 2) espace visuellement écrasé entre « Questions » et
  « fréquentes » (titre FAQ, italique Fraunces) ; 3) badge « LE JOUR DE L'INTERVENTION » du bloc
  process passe sur deux lignes avec puce mal alignée. Et la décision 30 km : `radiusKm: 30` +
  17 occurrences de « 20 km » en dur (config/site.config.ts + 12 zones + 1 service), drafts non
  concernés (vérifié). Le slug service testé en 404 était une erreur de test du CEO (la route
  réelle est `/services/`, cohérente partout).
- **26/07/2026 (Builder, passe corrective)** : les 4 points demandés par le CEO sont traités,
  rien d'autre touché. 1) **Rayon 30 km** : `radiusKm: 30` dans `config/site.config.ts`, et les
  17 occurrences de « 20 km » en dur remplacées par « 30 km » (config + FAQ accueil + 12
  `content/zones/*.json` + `content/services/urgence-debouchage-canalisation.json`) ; aucune
  formulation ne devenait fausse avec 30 km (pas de commune décrite « en limite de zone »), donc
  simple remplacement du chiffre partout ; vérifié qu'il ne reste plus de « 20 km » dans le repo
  hors `docs/`. 2) **Header pages intérieures** : ajout d'une détection `hasLightTop` dans
  `components/layout/Header.tsx` basée sur le chemin (`/zones/:slug`, `/services/:slug`,
  `/conseils/:slug`, les 3 routes qui posent un `Breadcrumbs` clair au lieu d'un `PageHeader`
  sombre), qui force le header en état solide dès le premier rendu sur ces pages. « METZ ·
  MOSELLE » vérifié lisible avant tout scroll, desktop et mobile. Note mineure hors périmètre :
  sur une page 404 dont l'URL ressemble à une de ces routes, le header s'affiche aussi en solide
  au lieu du hero sombre habituel des 404, toujours lisible, simple variation esthétique sur un
  cas limite non demandé. 3) **Titre FAQ accueil** : le span italique démarrait par un espace
  littéral quasi invisible avec le slant de l'italique Fraunces, remplacé par une marge explicite
  (`ml-3`) dans `components/ui/Faq.tsx`. 4) **Badge process carte 3** : libellé raccourci de
  « Le jour de l'intervention » à « Jour J » dans `config/site.config.ts`, tient sur une ligne,
  puce alignée. Vérifications : `next build` vert (37 pages), contrôle visuel Playwright desktop
  (1440) + mobile (390) ciblé sur les 4 points. Commit et push sur `builder/design-contenu-metz`.
  EN ATTENTE : re-contrôle CEO ciblé sur ces 4 points, puis validation Rémy avant tout merge.
- **26/07/2026 (CEO site, re-contrôle et clôture)** : re-contrôle CEO ciblé sur la preview
  corrigée (`sos-debouchage-metz-b1ke6v4c2`) : les 4 corrections sont VÉRIFIÉES (rayon 30 km
  partout, zéro « 20 km » résiduel sur accueil/service/zone ; header clair et lisible dès le
  premier rendu des pages intérieures ; espace net dans « Questions fréquentes » ; badge « JOUR J »
  sur une ligne). Le site est prêt sur le plan design et contenu, branche
  `builder/design-contenu-metz` poussée, `main` intact, noindex actif partout.

  **PROCHAINE SESSION, reprise ici** : tout ce qui reste dépend de Rémy (voir checklist section 2) :
  1) achat du domaine `sos-debouchage-metz.fr`, 2) téléphone dédié réel (l'actuel est un numéro
  fictif ARCEP marqué DEMO), 3) email réel, 4) nom commercial + identité artisan (persona
  « Julien Kieffer » en DEMO), 5) assurance pour `content/legal.json`. Après réception : Builder
  injecte les vraies valeurs, puis validation finale Rémy sur preview, puis merge `main`
  (= déploiement production, toujours noindex tant que `SEO_NOINDEX=1` est en place), puis
  Étape 6 du playbook (domaine, canonicalBase, Search Console, retrait du noindex sur ordre de
  Rémy uniquement). Les liens de partage Vercel expirent le 27/07 : le CEO en régénère à la
  demande via l'outil Vercel.
- **27/07/2026 (CEO site, MISE EN PRODUCTION)** : décisions Rémy : passage en public immédiat,
  numéro de téléphone réel via Twilio. Faits : 1) TÉLÉPHONE : réutilisation du 09 déjà payé du
  compte Twilio (+33 9 39 03 05 13, ex « Voltapro Pool », inventaire Twilio sans aucun 09 neuf
  disponible ce jour) ; renommé « SOS Debouchage Metz - NE PAS REATTRIBUER », VoiceUrl = twimlets
  forward vers le 07 56 85 31 25 de Rémy, journal d'appels Twilio = compteur de leads ; note
  d'avertissement posée dans le projet RépondeurIA/leadcatch (son pool de numéros ne doit jamais
  le réimporter). 2) Builder (sous-agent) : vrai numéro injecté dans config/site.config.ts +
  content/legal.json, phoneIsDemo=false, build vert, commit 7f10332. 3) MERGE sur main (validation
  explicite Rémy) : production Vercel déployée et Ready, toujours noindex (SEO_NOINDEX=1 encore en
  place). 4) Domaine sos-debouchage-metz.fr livré par OVH (NS ovh.ca actifs) et rattaché au projet
  Vercel (www + apex). RESTE : enregistrements DNS chez OVH (geste Rémy : A @ -> 76.76.21.21,
  CNAME www -> cname.vercel-dns.com.), puis CEO : vérifier apex->www, retirer SEO_NOINDEX,
  redéployer, vérifier robots.txt public, puis Search Console (propriété Domaine, TXT DNS par
  Rémy) et test de l'Action autoblog. L'assurance reste absente des mentions légales tant que
  le site n'est pas loué (décision Rémy, aucune donnée inventée).
- **27/07/2026 (CEO site, SITE PUBLIC)** : lancement public terminé. DNS OVH posés par Rémy
  (A @ 76.76.21.21 unique après suppression du parking, CNAME www, MX + TXT ForwardEmail vers
  remy@remyzaoui.com, TXT google-site-verification). Certificat SSL émis, site servi sur
  https://www.sos-debouchage-metz.fr, redirection 308 apex -> www posée par le CEO via l'API
  Vercel. `SEO_NOINDEX` RETIRÉ de l'env Production + redéploiement : robots.txt public en
  Allow avec crawlers IA autorisés, sitemap 25 URLs en canonique www. Search Console : propriété
  Domaine validée par Rémy, sitemap à soumettre : https://www.sos-debouchage-metz.fr/sitemap.xml.
  Test manuel de l'Action autoblog RÉUSSI : article 001 (WC bouché) publié dans content/conseils/
  et en ligne ; 25 drafts restent en réserve (cadence lun/mer/ven automatique). Le site n°3 est
  EN LIGNE ET INDEXABLE. Prochains jalons : suivi indexation GSC, premiers leads via le journal
  d'appels Twilio (09 39 03 05 13), démarchage locataire quand le trafic monte.
- **26/07/2026 (Autoblog, lot T2 : extension de la réserve)** : mission CEO exécutée suite au
  constat d'une réserve trop courte (19 drafts restants au moment de la mission, ≈ 6 semaines à
  3 publications/semaine, contre 11 déjà publiées au lancement). 1) Calendrier étendu de 27 à 60
  sujets dans `docs/CALENDRIER-EDITORIAL.md` : les 2 sujets complémentaires déjà identifiés (26 WC
  sans ventouse, 27 lingettes/cheveux) plus 33 nouveaux sujets (28 à 60), tous rattachés à l'une
  des 8 pages services, puisés dans la longue traîne locale du `SEO-GEO-PLAN.md`, les questions
  copropriété messine / maisons anciennes (dont un angle patrimoine « pierre de Jaumont », rédigé
  en prenant soin de ne pas inventer d'effet technique de la pierre sur les canalisations, seul
  l'âge du bâti est en cause), la saisonnalité automne/hiver/dégel (formulée avec la même prudence
  que le sujet 21 : facteur ponctuel, pas une saisonnalité forte du métier), et des variantes
  symptôme (glouglou, eau qui stagne, mousse/eau colorée). Chacun vérifié un par un contre les 26
  titres existants : zéro doublon d'angle. 2) 35 drafts rédigés (`027` à `061`), mêmes règles que
  les lots précédents (réponse directe en ouverture, FAQ, CTA vers 1-2 pages services). 3)
  Vérification automatisée sur les 35 fichiers (script Node avec `gray-matter`) : frontmatter
  complet, slugs uniques et cohérents avec le nom de fichier, `relatedServices` tous valides
  (vérifiés contre les 8 `content/services/*.json` réels), FAQ ≥ 3 questions, corps substantiel.
  Zéro tiret cadratin, zéro chiffre inventé, zéro occurrence de « plombier », zéro tarif chiffré.
  Zéro doublon de slug sur l'ensemble des 61 articles (publiés + drafts). 4) Réserve finale :
  **50 drafts** dans `content/drafts/` (011 déjà publiés), soit environ 4 mois de publication
  automatique d'avance au rythme lun/mer/ven, objectif de Rémy (comme le pilote d'Angers) atteint.
  Note en cours de session : synchronisation nécessaire au démarrage (dépôt local en retard de 6
  commits sur `origin/main`, l'Action autoblog ayant publié plusieurs articles en tâche de fond),
  et présence de modifications non commitées d'une autre session (Builder : `CLAUDE.md`,
  `config/site.config.ts`, `tasks/lessons.md`, visuels `public/zones/`) constatées mais non
  touchées, hors périmètre de cette mission. Périmètre respecté : uniquement `content/drafts/` et
  `docs/CALENDRIER-EDITORIAL.md` modifiés (+ ce journal).
- **27/07/2026 (Autoblog, lot T3 : réserve portée à 6 mois)** : mission Rémy exécutée, objectif
  porté de 50 à environ 80 drafts en réserve (6 mois pleins à 3 publications/semaine). Départ de
  session : resynchronisation avec `origin/main` (aucun commit en retard cette fois, lot T2 déjà
  committé par une autre session : commit `881950e`). 1) Calendrier étendu de 60 à 90 sujets dans
  `docs/CALENDRIER-EDITORIAL.md` : 30 nouveaux sujets (61 à 90), tous rattachés à l'une des 8 pages
  services, creusant des angles pas encore utilisés (type de logement : maison mitoyenne,
  appartement années 1960-1970, pavillon récent, local commercial ; pièce : cave, buanderie, WC
  suspendus, cuisine professionnelle au-delà du bac à graisse ; cas pratiques locataire /
  propriétaire bailleur / syndic ; idées reçues au format « vrai ou faux » ; préparation avant
  événement (extension, héritage/enchères) ; et été, chaleur/sécheresse, piscine, barbecue,
  arrosage/racines, réceptions, rentrée, la réserve couvrant désormais cette saison). Chaque sujet
  vérifié un par un contre les 61 articles existants et les 60 sujets précédents : zéro doublon
  d'angle (différenciations volontaires documentées en note sous chaque sujet proche d'un thème
  déjà traité, ex. sujet 65 cave humide vs sujet 85 sous-sol aménagé, ou sujet 66 buanderie privée
  vs sujet 89 buanderie commune copropriété). 2) 30 drafts rédigés (`062` à `091`), mêmes règles
  que les lots précédents. 3) Script de vérification automatisée (Node + `gray-matter`) relancé
  sur l'ensemble du dossier `content/drafts/` (pas seulement le nouveau lot) : **80 drafts, zéro
  erreur** (frontmatter complet, slugs uniques, `relatedServices` tous valides contre les 8
  `content/services/*.json` réels, FAQ ≥ 3 questions, corps substantiel) ; zéro doublon de slug
  sur les 91 articles au total (11 publiés + 80 drafts). Contrôles manuels complémentaires : zéro
  tiret cadratin, zéro chiffre inventé, zéro occurrence de « plombier », zéro tarif chiffré sur les
  30 nouveaux fichiers. 4) Réserve finale : **80 drafts** (11 publiés), soit environ 6 mois de
  publication automatique d'avance au rythme lun/mer/ven, objectif de Rémy atteint. Périmètre
  respecté : uniquement `content/drafts/` et `docs/CALENDRIER-EDITORIAL.md` modifiés (+ ce
  journal). Consigne de cette mission (contrairement aux précédentes) : commit et push du travail
  par l'agent Autoblog lui-même, voir commit associé à cette entrée.
