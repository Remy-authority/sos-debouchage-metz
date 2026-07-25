# PLAYBOOK — Créer le site rank & rent N+1 à partir de ce repo

> Mode d'emploi pour dupliquer SOS Fuite Angers vers un nouveau site (autre métier / ville).
> Prérequis : l'opportunité est validée (voir `RENT & RANK/CLAUDE.md`, CEO-portefeuille)
> et le nom de domaine choisi (pas forcément encore acheté).

## Étape 0 — Décisions à avoir AVANT de commencer
- Métier + ville validés (benchmark fait, pas de doublon avec un site existant du portefeuille).
- Nom de domaine choisi (vérifier la disponibilité ; achat possible plus tard, ne bloque pas le dev).
- Nom commercial, téléphone dédié au site, email.

## Étape 1 — Créer le dossier et le repo
1. Copier ce dossier vers `RENT & RANK/<nouveau-domaine>/` (copie complète).
2. Dans la copie : **supprimer le dossier caché `.git`** (sinon il reste relié au repo d'Angers).
3. `git init` + créer un **nouveau repo GitHub** (ex. `Remy-authority/<nouveau-domaine>`) + push.
4. Créer un **nouveau projet Vercel** relié à ce repo (déploiement auto sur `main`).

## Étape 2 — Nettoyage du contenu spécifique Angers (checklist stricte)
Supprimer / remplacer TOUT le contenu métier-ville :
- `content/services/*.json` → réécrire pour le nouveau métier (garder la structure JSON exacte).
- `content/zones/*.json` → réécrire pour les communes de la nouvelle ville.
- `content/conseils/*.mdx` → **tout supprimer** (articles fuite d'eau).
- `content/drafts/*` → tout supprimer (garder `.gitkeep` + `README.md`).
- `public/services/`, `public/zones/`, `public/conseils/`, `public/realisations/` → vider (nouvelles images à générer).
- `public/logo.svg`, portrait persona → remplacer.
- `content/legal.json` → adapter (l'éditeur DYONISOS LTD reste si même structure juridique).
- `docs/ETAT.md` → repartir d'un journal neuf (garder le squelette de sections).
- `docs/SEO-GEO-PLAN.md`, `docs/CALENDRIER-EDITORIAL.md` → supprimer (seront refaits par l'agent SEO).
- `CLAUDE.md` → garder tel quel (les règles sont génériques), adapter juste la ligne du site pilote.

## Étape 3 — La config (le cœur du template)
Éditer `config/site.config.ts` : businessName, trade, city, region, department, phone,
phoneDisplay, email, colors (3 hex re-thèment tout), usps, methods, serviceArea, persona (DEMO),
about, process, stats (DEMO), whyUs, homeFaq, seo.canonicalBase (URL Vercel d'abord, domaine
final avant prod). Vérifier `robots.ts` (noindex tant que non validé).

## Étape 4 — Design
- Le socle (composants, pages, animations) est déjà premium : le garder.
- Passe design **Builder sur Opus** : adapter la direction artistique au nouveau métier
  (couleurs, hero, iconographie). Référence qualité : https://sniperpestcontrol3dservices.fr.
- Images : hero + 2-3 images de corps PAR page (services, zones), règles strictes :
  aucun texte/logo/marque, aucun visage flou, cohérence physique, décor français local.

## Étape 5 — Contenu & SEO/GEO (mêmes agents, mêmes rôles)
1. **Agent SEO** : carte mots-clés + plan (services/zones à créer) + calendrier éditorial 12 mois.
2. **Builder** : pages, llms.txt, robots IA, schema JSON-LD (adapter le type Plumber au métier).
3. **Autoblog** : articles par lots trimestriels dans `content/drafts/` (préfixes 001-, 002-…).
4. La GitHub Action `publish-article.yml` est déjà dans le repo → elle marche telle quelle
   (vérifier qu'elle est activée dans l'onglet Actions du nouveau repo).

## Étape 6 — Mise en ligne
1. Validation visuelle Rémy sur preview → merge `main`.
2. Domaine : registrar → A `76.76.21.21` (apex) + CNAME `www` → `cname.vercel-dns.com.`
   (⚠️ supprimer d'abord tout TXT/A existant sur `www`). Ajouter le domaine dans Vercel (Production).
3. `seo.canonicalBase` → domaine final (version www si l'apex redirige vers www).
4. Google Search Console : propriété « Domaine » + TXT de validation + soumettre le sitemap.
5. Test manuel de l'Action de publication (Run workflow) → vérifier l'article en ligne.

## Règles transverses (rappel CLAUDE.md)
- Le CEO ne code jamais ; contrôle visuel CEO obligatoire avant toute validation Rémy.
- Zéro tiret « — », zéro chiffre inventé, zéro fausse certification, FAQ partout.
- Un agent = un périmètre de fichiers. Rien ne se déploie sans validation Rémy.
