# ETAT.md — Journal de bord SOS Débouchage Metz

> Mémoire du projet. Chaque session lit ce fichier en arrivant et le met à jour avant de finir.
> Dernière mise à jour : 2026-07-26 (session Autoblog : arbitrage appliqué, sujet 4 réécrit, 13 articles du calendrier rédigés).

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
- [x] Autoblog : drafts T1+T2, 26 drafts au total dans `content/drafts/` (001-004, 006-026, plus
      `990-` en fin de file). Les 24 sujets d'origine du calendrier + les 3 sujets complémentaires
      (25 couvert, 26 et 27 à écrire) sont soit couverts soit rédigés (fait 26/07/2026, voir
      historique). Restent à écrire, sans urgence : sujets complémentaires 26 (WC sans ventouse) et
      27 (lingettes/cheveux).
- [x] Vérifier `robots.ts` en noindex tant que non validé (fait 26/07/2026 : `SEO_NOINDEX=1` posé en Production Vercel, robots.txt servi vérifié `Disallow: /` ; retirer la variable uniquement à l'Étape 6 sur validation Rémy)
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
