# tasks/todo.md — SOS Débouchage Metz

> Suivi opérationnel de la session CEO. La checklist de référence long terme vit dans
> `docs/ETAT.md` (section 2). Ici : les tâches de la session en cours.

## Session du 26/07/2026 (CEO)

- [x] Lire CLAUDE.md + docs/ETAT.md
- [x] Créer le repo GitHub `Remy-authority/sos-debouchage-metz` (public) + push de `main`
- [x] Créer le projet Vercel `sos-debouchage-metz` relié au repo (déploiement auto sur `main`)
- [x] Poser `SEO_NOINDEX=1` en environnement Production sur Vercel (noindex garanti tant que non validé)
- [x] Vérifier `app/robots.ts` : noindex OK (previews bloquées par `VERCEL_ENV`, prod bloquée par `SEO_NOINDEX`)
- [x] Vérifier que la GitHub Action `publish-article.yml` est active sur le nouveau repo
- [x] Vérifier que le build Vercel passe (déploiement `sos-debouchage-metz-2paiu0qmh` Ready, robots.txt = `Disallow: /`)
- [x] Audit CEO des livrables SEO (2 docs) et Autoblog (6 drafts) : conformes à la doctrine
- [ ] Superviser les comptes-rendus SEO / Builder / Autoblog collés par Rémy
- [ ] Consolidation git (commit docs SEO + drafts + tasks + ETAT) une fois les sessions agents terminées
- [x] Mettre à jour docs/ETAT.md (fait, à re-toucher si nouveaux comptes-rendus)

## En attente de Rémy

- Validation + achat du domaine `sos-debouchage-metz.fr`
- Téléphone dédié, email, nom commercial
