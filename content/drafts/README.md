# content/drafts/

File d'attente des articles préparés en avance : ils sont **invisibles du site** (aucun loader ne lit ce dossier) jusqu'à ce que la GitHub Action `publish-article` en publie un (lun/mer/ven) en le déplaçant vers `content/conseils/`.

Convention : nommer chaque fichier `NNN-slug.mdx` (`001-…`, `002-…`) ; le plus petit numéro part en premier, le préfixe `NNN-` est retiré à la publication. Placez les images du draft directement dans `public/conseils/` (ou dans un sous-dossier `NNN-slug.assets/` ici, déplacé automatiquement vers `public/conseils/`).
