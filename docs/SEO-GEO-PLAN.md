# SEO-GEO-PLAN.md — SOS Débouchage Metz

> Plan mots-clés + architecture de pages, rédigé par l'agent SEO le 26/07/2026.
> Périmètre de ce document : stratégie et structure. Le Builder écrit les pages
> (`content/services/*.json`, `content/zones/*.json`, `config/site.config.ts`) à
> partir de ce plan. Rien n'est encore codé au moment de la rédaction.

---

## 0. Cadrage métier (rappel, ne pas dévier)

Le site couvre le **débouchage de canalisations et les urgences canalisations** :
WC bouché, évier/lavabo/douche bouchés, curage haute pression, inspection caméra,
bac à graisse, canalisation enterrée/regard, colonne d'immeuble. **Le site NE
couvre PAS la plomberie générale** (pas de fuite, pas de chauffe-eau, pas de
robinetterie, pas de recherche de fuite, déjà pris par `sos-fuite-angers.fr`
ailleurs dans le portefeuille). Ne jamais cibler ou faire dériver le contenu vers
« plombier Metz » en tant que requête générique : ça dilue le positionnement et
crée un chevauchement stratégique avec un futur site plomberie du portefeuille.

Doctrine SEO/GEO du CLAUDE.md : pas de fiche Google Business, pas d'avis, SEO
organique + citabilité IA uniquement. Aucun chiffre inventé, aucune fausse
certification, pas de tiret cadratin dans les textes visibles.

---

## 1. Carte des mots-clés

### 1.1 Requêtes d'urgence (intention transactionnelle forte, priorité absolue)

Ce sont les requêtes qui convertissent le mieux : l'utilisateur a un problème
actif et appelle le premier résultat pertinent.

- déboucheur Metz / déboucheur canalisation Metz
- débouchage canalisation Metz
- débouchage urgence Metz / débouchage canalisation urgence
- wc bouché Metz / toilettes bouchées que faire
- évier bouché Metz / lavabo bouché
- canalisation bouchée que faire
- déboucheur 24h/24 Metz / débouchage nuit week-end Metz
- odeur égout maison Metz (signal de canalisation bouchée, très citable en GEO)
- eau qui remonte évacuation

### 1.2 Requêtes par service (intention transactionnelle, decision-stage)

- débouchage wc / débouchage toilettes
- débouchage évier cuisine / débouchage lavabo salle de bain
- débouchage douche bouchée / siphon bouché
- curage canalisation haute pression / curage canalisation prix
- inspection caméra canalisation / passage caméra canalisation Metz
- débouchage canalisation enterrée / débouchage regard
- débouchage bac à graisse restaurant Metz / entretien bac à graisse
- débouchage colonne immeuble / débouchage évacuation copropriété

### 1.3 Requêtes informationnelles (haut de funnel, blog + FAQ, forte valeur GEO)

Ces requêtes sont posées telles quelles à ChatGPT/Perplexity/AI Overviews :
c'est le terrain de jeu du GEO. Contenu factuel, structuré en questions/réponses,
sans besoin d'invoquer d'avis ou de fiche Google.

- comment déboucher des toilettes sans ventouse
- comment déboucher un évier naturellement
- pourquoi mes toilettes se rebouchent souvent
- combien coûte un débouchage de canalisation
- déboucheur chimique dangereux, vrai ou faux
- différence entre débouchage et curage
- quand faire une inspection caméra canalisation
- entretien préventif canalisation, à quelle fréquence
- signes d'une canalisation bouchée avant qu'elle déborde
- assurance et débouchage, qui paie quoi (copropriété vs locataire vs propriétaire)

### 1.4 Requêtes locales longue traîne (pages zones)

Motif = `[service ou "débouchage canalisation"] + [commune]`, ex. « débouchage
canalisation Woippy », « déboucheur Montigny-lès-Metz ». Volume unitaire faible
mais conversion très élevée (recherche géolocalisée = besoin immédiat).

### 1.5 Négatif / à ne jamais cibler

- plombier Metz, plomberie générale, chauffagiste, recherche de fuite, robinetterie
  (hors périmètre du site, cf. cadrage ci-dessus)
- toute requête impliquant avis Google, note, classement (doctrine sans avis)

---

## 2. Architecture de pages

### 2.1 Pages SERVICES (8) — `content/services/*.json`

Ordre = ordre `order` recommandé (urgence en premier, cohérent avec le modèle
Angers où `urgence-fuite-eau` a la priorité de navigation).

| order | slug | H1 cible | Mot-clé principal |
|---|---|---|---|
| 1 | `urgence-debouchage-canalisation` | Urgence débouchage canalisation à Metz | déboucheur urgence Metz, 24h/24 |
| 2 | `debouchage-wc-toilettes-bouchees` | Débouchage WC et toilettes bouchées à Metz | wc bouché Metz |
| 3 | `debouchage-evier-lavabo-douche` | Débouchage évier, lavabo et douche à Metz | évier bouché Metz, douche bouchée |
| 4 | `curage-canalisation-haute-pression` | Curage de canalisation haute pression à Metz | curage canalisation Metz |
| 5 | `inspection-camera-canalisation` | Inspection caméra de canalisation à Metz | passage caméra canalisation Metz |
| 6 | `debouchage-canalisation-enterree-regard` | Débouchage canalisation enterrée et regard à Metz | débouchage regard, canalisation enterrée |
| 7 | `debouchage-bac-a-graisse` | Débouchage bac à graisse à Metz (professionnels) | bac à graisse Metz, restaurant |
| 8 | `debouchage-colonne-immeuble-copropriete` | Débouchage colonne d'immeuble et copropriété | débouchage copropriété Metz, syndic |

Notes de construction (à suivre par le Builder, structure identique au modèle
`urgence-fuite-eau.json` d'Angers) :

- Chaque page : `intro`, `bullets` (3), `blocks` (2-3 dont un bloc « zones
  couvertes » citant les communes de la section 2.2), `relatedServices` (2),
  `faq` (3-4 questions), `image`.
- Page 1 (urgence) : bloc « que faire en attendant » avec gestes concrets et
  sûrs (ex. ne pas utiliser de déboucheur chimique sur une cuvette pleine,
  couper l'arrivée si débordement, protéger le sol) — pas de gestes techniques
  dangereux.
- Page 7 (bac à graisse) et page 8 (colonne immeuble) ciblent une audience B2B
  (restaurateurs, syndics) : ton légèrement plus technique, mention de la
  périodicité d'entretien recommandée par la réglementation (sans inventer de
  chiffre si non confirmé, formuler « selon la réglementation en vigueur » à
  défaut de source précise).
- Le mot-clé « plombier » ne doit apparaître nulle part dans ces pages.

### 2.2 Pages ZONES (12) — `content/zones/*.json`

Communes de l'Eurométropole de Metz retenues par population et proximité
directe (rayon d'intervention proposé : **20 km autour de Metz**, à trancher
par Rémy dans `config/site.config.ts` → `serviceArea.radiusKm`). Metz elle-même
n'a **pas** de page zone dédiée (elle est la ville de base, comme Angers dans
le template) : ses quartiers sont listés dans `serviceArea.districts` et cités
dans le maillage des pages services/accueil, pas en pages séparées.

| slug | Commune | Code postal (à vérifier avant publication) | Note de contexte |
|---|---|---|---|
| `montigny-les-metz` | Montigny-lès-Metz | 57950 | Grande commune limitrophe sud, dense, beaucoup de collectifs |
| `woippy` | Woippy | 57140 | Grande commune nord, mix pavillonnaire/collectif |
| `marly` | Marly | 57155 | Commune sud, résidentiel |
| `le-ban-saint-martin` | Le Ban-Saint-Martin | 57050 | Rive gauche, résidentiel dense |
| `longeville-les-metz` | Longeville-lès-Metz | 57050 | Rive gauche, pavillonnaire |
| `moulins-les-metz` | Moulins-lès-Metz | 57160 | Ouest, mix habitat ancien/récent |
| `saint-julien-les-metz` | Saint-Julien-lès-Metz | 57070 | Est, pavillonnaire |
| `ars-sur-moselle` | Ars-sur-Moselle | 57130 | Sud-ouest, vallée de la Moselle |
| `marange-silvange` | Marange-Silvange | 57157 | Sud-ouest, ancien bassin minier |
| `scy-chazelles` | Scy-Chazelles | 57160 | Coteaux ouest, pavillonnaire |
| `plappeville` | Plappeville | 57050 | Coteaux ouest, maisons individuelles |
| `augny` | Augny | 57685 | Sud, proche aéroport, pavillonnaire récent |

**⚠️ Action Builder avant publication** : vérifier chaque code postal auprès
d'une source officielle (La Poste / INSEE) avant mise en ligne — je les indique
de mémoire avec un niveau de confiance correct mais pas garanti à 100 %, et le
CLAUDE.md interdit d'afficher une donnée non confirmée.

Structure de page (identique au modèle `avrille.json`) : `context` (1 phrase
factuelle et neutre sur la commune, pas de superlatif creux), `intro`, `blocks`
(prestations dans la commune + urgence + communes limitrophes desservies),
`neighbours` (2-3), `faq` (3-4). Insister sur le type d'habitat (collectif vs
pavillonnaire) quand c'est pertinent : ça justifie naturellement des contenus
différenciés entre communes plutôt que du duplicate géolocalisé.

### 2.3 Page listing zones

`app/zones/page.tsx` existe déjà (structure template) : lister les 12 communes
+ Metz, avec lien vers chaque page zone. Pas de contenu à écrire ici (page
générée depuis `content/zones/*.json`), juste s'assurer que le Builder couvre
les 12 zones ci-dessus.

### 2.4 Page d'accueil

H1 recommandé : « Débouchage de canalisations à Metz, intervention rapide ».
Reprend la liste des 8 services en aperçu + zone de couverture (Metz + 12
communes) + FAQ homepage (5-6 questions transversales, mix urgence/prix/process,
à écrire par le Builder à partir de la section 1.3).

---

## 3. Stratégie GEO (citabilité IA)

Le GEO récompense le contenu factuel, structuré, répondant directement à une
question, sans avoir besoin de preuve sociale (avis) que ce site n'a pas le
droit d'afficher. Leviers spécifiques à activer :

1. **FAQ systématique** sur chaque page (déjà dans la structure `faq[]`) avec
   des réponses autonomes : une réponse doit avoir du sens citée seule, hors
   contexte de la page, car c'est ainsi que les moteurs IA l'extraient.
2. **Réponses courtes en tête de bloc** : première phrase = réponse directe à
   la question du H2/FAQ, développement ensuite. Format « question → réponse
   → nuance/exception ».
3. **`llms.txt`** (`app/llms.txt/route.ts` existe déjà dans le template) : à
   tenir à jour avec la liste des 8 services + 12 zones + articles publiés,
   description en une ligne par page. Vérifier avec le Builder que la route
   régénère bien la liste dynamiquement plutôt qu'un texte figé.
4. **Distinction claire débouchage vs curage vs inspection caméra vs plomberie
   générale** dans au moins un article de blog dédié (section 1.3) : ce type de
   contenu « désambiguïsation métier » est très repris tel quel par les IA
   génératives dans leurs réponses de type « quelle différence entre X et Y ».
5. **Données structurées** : le template gère déjà un schema `Plumber` via
   `lib/seo.ts`. Suggestion pour le Builder à valider avec Rémy : évaluer si
   `HomeAndConstructionBusiness` ou un sous-type plus proche du débouchage est
   disponible dans schema.org (Plumber reste acceptable si rien de plus
   spécifique n'existe) ; ajouter le balisage `FAQPage` sur les blocs `faq[]`
   s'il n'est pas déjà généré automatiquement par `lib/seo.ts`, et `HowTo` sur
   les articles de blog « comment déboucher… » de la section 1.3 (contenu
   réellement actionnable, pas un prétexte à bourrage de mots-clés).
6. **Pas de contenu dupliqué entre zones** : chaque page zone doit avoir un
   angle propre (type d'habitat, situation géographique) pour rester citable
   individuellement et ne pas se cannibaliser en SEO classique.

---

## 4. Maillage interne

- Chaque page service renvoie vers les 2 pages zones les plus proches du cœur
  de cible (déjà prévu via `relatedServices`, à compléter par des liens zones
  dans les blocs texte, comme dans le modèle Angers).
- Chaque page zone renvoie vers la page service la plus probable pour cette
  commune (ex. Woippy/Montigny, plus denses en collectif → mettre en avant
  `debouchage-colonne-immeuble-copropriete` et `debouchage-wc-toilettes-bouchees`
  en premier lien).
- Chaque article de blog (section GEO) renvoie vers 1-2 pages services
  pertinentes en fin d'article (CTA contextuel, pas un bloc générique répété).

---

## 5. Ce qui reste à trancher par Rémy

- Rayon d'intervention exact (`serviceArea.radiusKm`) : je propose 20 km,
  cohérent avec la densité de l'agglomération messine (plus dense qu'Angers,
  pas besoin de 25 km pour couvrir un bassin de population comparable).
- Vérification des 12 codes postaux zones avant publication (voir tableau 2.2).
- Validation du domaine `sos-debouchage-metz.fr` (statut : disponible au
  26/07/2026, pas encore acheté, cf. `docs/ETAT.md`).

---

## 6. Résumé pour le Builder

1. Créer les 8 fichiers `content/services/*.json` listés en 2.1 (structure
   calquée sur `urgence-fuite-eau.json`).
2. Créer les 12 fichiers `content/zones/*.json` listés en 2.2 (structure
   calquée sur `avrille.json`), en vérifiant les codes postaux avant mise en
   ligne.
3. Mettre à jour `config/site.config.ts` : `trade`, `city`, `serviceArea`
   (base Metz, radiusKm 20, districts = quartiers de Metz), `usps`/`methods`
   adaptés au débouchage (pas de « gaz traceur »/« caméra thermique » copiés
   d'Angers, remplacer par équivalents débouchage : caméra d'inspection,
   furet électrique, curage haute pression), `homeFaq` à partir de la section
   1.3, palette couleurs propre à ce site (ne pas réutiliser le bleu/orange
   d'Angers, cf. CLAUDE.md anti-empreinte Google).
4. Ne jamais utiliser « plombier » comme mot-clé cible.
5. Ne jamais afficher les codes postaux du tableau 2.2 sans les avoir
   revérifiés.
