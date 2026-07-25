# ETAT.md — Journal de bord SOS Débouchage Metz

> Mémoire du projet. Chaque session lit ce fichier en arrivant et le met à jour avant de finir.
> Dernière mise à jour : 2026-07-26 (création du dossier, session CEO-portefeuille).

---

## 🔖 POINT DE REPRISE (état exact au 26/07/2026 — à lire en premier)

**Site n°3 du portefeuille** (métier : débouchage de canalisations, ville : Metz, 57). Rien n'est
en ligne : dossier créé par duplication du template `sos-fuite-angers.fr` (playbook Étapes 1-2
faites : copie complète, contenu Angers supprimé, git initialisé).

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

- Socle technique du pilote fonctionnel : Next.js, autoblog, GitHub Action `publish-article.yml`
  (à réactiver dans le nouveau repo).
- `content/services/*.json` et `content/zones/*.json` sont encore ceux d'Angers : MODÈLES de
  structure pour le Builder, à réécrire intégralement pour débouchage/Metz.
- `config/site.config.ts`, `content/legal.json`, `public/logo.svg`, portrait persona : encore
  ceux d'Angers, à remplacer.

## 2. RESTE À FAIRE (checklist playbook)

- [ ] Rémy : valider le domaine (8 candidats libres, voir conversation CEO-portefeuille) et l'acheter ; fournir téléphone dédié + email + nom commercial
- [ ] CEO : créer le repo GitHub + le projet Vercel (Étape 1.3-1.4)
- [ ] SEO : carte mots-clés débouchage Metz + `docs/SEO-GEO-PLAN.md` + `docs/CALENDRIER-EDITORIAL.md`
- [ ] Builder : `config/site.config.ts` (identité, couleurs propres au site, persona DEMO) + `content/legal.json`
- [ ] Builder : réécrire `content/services/*.json` et `content/zones/*.json` (communes agglo Metz) selon le plan SEO
- [ ] Builder sur Opus : COUCHE VISUELLE COMPLÈTE depuis le code PROTEC-DARD (voir section ⚠️ ci-dessus)
- [ ] Builder : logo, portrait persona, images (hero + 2-3 par page, aucun texte/logo/visage flou, décor lorrain)
- [ ] Autoblog : drafts T1 (préfixes 001-…)
- [ ] Vérifier `robots.ts` en noindex tant que non validé
- [ ] Contrôle visuel CEO → validation Rémy → mise en ligne (Étape 6 du playbook)

## 3. DÉCISIONS RÉMY

- 25/07/2026 : top 5 vague 2 validé ; Metz (débouchage) est le n°2 de la file de lancement.
- 26/07/2026 : nouvelle référence design pour les sites à partir du n°3 : PROTEC-DARD (motion,
  typographie, structure), adaptée en site complet multi-pages.

## 4. HISTORIQUE DES SESSIONS

- **26/07/2026 (CEO-portefeuille)** : création du dossier par duplication du pilote, nettoyage du
  contenu Angers, CLAUDE.md adapté (identité Metz + référence design PROTEC-DARD), journal neuf,
  git initialisé. Aucun contenu Metz encore écrit : travail du Builder et du SEO aux prochaines
  sessions.
