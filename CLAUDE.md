# CLAUDE.md — SOS Débouchage Metz

> Fichier de règles du projet. Toute session (CEO, Builder, SEO) le lit AVANT de toucher au repo.
> Les règles ici priment sur tout comportement par défaut.

---

## 0. REQUÊTE D'ARGENT DU SITE (lue par tasks/check-fin-de-site.py)

- Requête d'argent du site : « débouchage canalisation Metz ».
  AUCUN volume de recherche n'est déclaré ici : nous n'avons pas de mesure
  DataForSEO sur cette requête, et une impression Search Console n'est pas un
  volume. Ce qui est mesuré, et seulement cela : 34 impressions sur 90 jours
  pour cette requête exacte dans la Search Console du site, relevées le
  20/09/2026 (24 sur 28 jours).
  Elle doit figurer dans le title et le H1 de l'accueil, et le mot « débouchage »
  dans le title de chaque page de commune.
- Requêtes secondaires, impressions Search Console sur 90 jours au 20/09/2026 :
  « débouchage canalisation marly » 83, « canalisations bouchées racines » 65,
  « sos canalisation bouchée » 58, « wc bouché marly » 39,
  « plombier marange-silvange » 37.

---

## 1. CONTEXTE DU PROJET

- **Modèle économique : rank & rent.** On construit un site local, on le classe en SEO
  (référencement naturel + citations par les IA), on capte des demandes de clients, puis on
  **loue** le site à un artisan de la zone. On ne vend pas de prestation nous-mêmes.
- **Ce site : débouchage de canalisations à Metz (57), site n°3 du portefeuille.** Domaine pressenti
  `sos-debouchage-metz.fr` (disponible, pas encore acheté). Dupliqué le 26/07/2026 depuis le site
  pilote `sos-fuite-angers.fr` (structure/config/autoblog). ATTENTION DESIGN : la référence
  visuelle de CE site n'est PLUS le rendu du pilote, voir section 2 et docs/ETAT.md.
- **Ce repo est un TEMPLATE.** Il servira de base aux prochains sites (autre métier / ville /
  locataire). Objectif : déployer un site N+1 en changeant surtout la **config** + le **contenu**,
  sans réécrire le code. Tout ce qu'on décide ici doit rester générique et réutilisable.

---

## 2. STANDARD DE DESIGN — NON NÉGOCIABLE

- **Référence unique et obligatoire : PROTEC-DARD** (landing créée par Rémy, réussie).
  Code source local : `/Users/zaouiremy/Desktop/Claude code/Template siteweb/Prospects/Deratisation/PROTEC-DARD/`
  (lecture seule). C'est LE mètre-étalon : typographie (Inter + Fraunces), motion design
  (Framer Motion : reprendre les variants, durées, easings et effets de scroll du code source),
  structure et rythme des sections. À ADAPTER en site multi-pages complet (pas une landing) et
  au métier débouchage. Le rendu ne doit PAS ressembler au template d'Angers/Annecy.
- Exigences : **direction artistique forte, rendu premium, ancrage local.** Le visiteur doit
  sentir un artisan sérieux et haut de gamme, pas un template acheté.
- **Interdits absolus :**
  - Design générique / « template » reconnaissable.
  - Pages 100 % texte, sans visuel, sans rythme, sans hiérarchie.
  - Sections plates copiées-collées d'une page à l'autre sans intention.
- Chaque page doit avoir : visuels de qualité, respiration, hiérarchie claire, CTA visibles,
  cohérence de la charte (palette à définir pour le métier débouchage + accent urgence,
  différente de celle d'Angers et d'Annecy).
- **Pas de vide/trou asymétrique** : une colonne de texte doit être centrée ou occuper une
  largeur cohérente, jamais collée à gauche avec un grand blanc à droite.
- **Images UNIQUES par page locale (règle permanente, décision Rémy 27/07/2026)** : chaque
  page de commune a SA propre image de tête (`public/zones/<slug>.jpg`), au décor réellement
  différencié par ville. Interdiction des pools d'images partagées entre communes (défaut
  récurrent des sites précédents). Le contrôle visuel CEO compare les pages communes entre
  elles avant toute validation. Vaut pour tout site N+1 issu de ce template.
- **Typographie — INTERDIT : le tiret cadratin « — ».** Nulle part dans le texte visible.
  On utilise une **virgule** ou un **point** à la place. Vaut pour tout agent (Builder, Autoblog).

---

## 3. DOCTRINE SEO

- **Pas de fiche Google Business, pas d'avis clients.** Tout repose sur le **SEO organique**
  et le **GEO** (être cité par les IA : ChatGPT, Perplexity, AI Overviews).
- **Structure du site :**
  - 1 page d'accueil
  - 1 page par **service**
  - 1 page par **commune voisine**
  - 1 **blog conseils**
  - **mentions légales** conformes (droit français)
- **FAQ sur chaque page** (utile utilisateur + données structurées + citabilité IA).
- **Interdits absolus :**
  - Bourrage de mots-clés.
  - Chiffres inventés (nombre d'interventions, années d'expérience…) non validés par Rémy.
  - Fausses certifications / faux labels.
  - Phrases creuses de remplissage.
- Contenu vrai, précis, local. Si une donnée n'est pas confirmée → on ne l'affiche pas.

---

## 4. RÈGLE DE MÉMOIRE & DÉPLOIEMENT

- **À chaque session : lire `docs/ETAT.md` en arrivant**, et **le mettre à jour avant de finir.**
  C'est le journal de bord unique du projet.
- **Rien ne se déploie (merge sur `main` / mise en prod) sans la validation explicite de Rémy.**
- Marquer les valeurs non confirmées comme `DEMO` tant que Rémy n'a pas tranché.

---

## 5. FONCTIONNEMENT DES RÔLES

> Mis à jour le 10/10/2026 : l'ancienne règle « le CEO ne code jamais, tout passe au Builder »
> est ABROGÉE (Rémy 09/10/2026, règle #R64 du portefeuille).

- **Le CEO du site fait le travail lui-même, dans sa conversation** : code, pages, photos,
  corrections et contrôles. Sous-agents : 3 au plus pour tout un chantier, relecture critique
  comprise, réservés aux gros lots indépendants lancés en parallèle (lot d'articles, collecte,
  relecture à froid) ; jamais un sous-agent neuf par correction. Tout tourne sur Opus 5.5.
- **Zéro fainéantise** : le CEO utilise ses propres accès (git, gh, Vercel, build, APIs) et ne
  demande à Rémy que ce que lui seul peut faire (validation, décision, paiement).
- **Rien sur `main` sans GO de Rémy** ; aperçus sur branche, montrés par lien Vercel.
- Réponses à Rémy : courtes, simples, en « je », une seule question à la fin.
