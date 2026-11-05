# content/drafts/

File d'attente des articles préparés en avance : ils sont **invisibles du site** (aucun loader ne lit ce dossier) jusqu'à ce que la GitHub Action `publish-article` en publie un **chaque jour** (7 par semaine depuis le 05/11/2026) en le déplaçant vers `content/conseils/`.

Convention : nommer chaque fichier `NNN-slug.mdx` (`101-…`, `102-…`) ; le plus petit numéro **conforme** part en premier, le préfixe `NNN-` est retiré à la publication. L'ordre et les requêtes visées sont dans `docs/CALENDRIER-EDITORIAL.md`.

Règles d'un brouillon, contrôlées par `node scripts/verifier-brouillon.mjs content/drafts/*.mdx` (et à chaque publication, un brouillon refusé est sauté) : title 30-60 caractères, description 120-160, 3 questions de FAQ au moins, 600 mots au moins, aucun tiret cadratin, **aucune image**. Les images (couverture et image de corps) naissent le jour de la publication, générées par `scripts/generate-article-images.mjs` : jamais d'image créée pour un brouillon.
