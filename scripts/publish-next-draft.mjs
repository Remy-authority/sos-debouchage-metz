/**
 * publish-next-draft.mjs — publie le plus ancien article en attente.
 *
 * Appelé par .github/workflows/publish-article.yml (lun/mer/ven).
 * Logique :
 *  1. Liste content/drafts/*.mdx, tri alphabétique (préfixes 001-, 002-… => le plus petit d'abord).
 *  2. Si vide : log un avertissement clair et sort en succès (exit 0), sans rien publier.
 *  3. Sinon : déplace le 1er draft vers content/conseils/ en retirant le préfixe numérique,
 *     met `date:` du frontmatter à la date du jour (Europe/Paris), déplace un éventuel dossier
 *     d'assets « <nom-du-draft>.assets/ » vers public/conseils/.
 *  4. Écrit les sorties (published / file / slug) dans $GITHUB_OUTPUT pour l'étape commit.
 *
 * Ne fait AUCUN commit/push : c'est le workflow qui s'en charge (traçabilité + secrets).
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const DRAFTS = path.join(ROOT, 'content', 'drafts')
const CONSEILS = path.join(ROOT, 'content', 'conseils')
const PUBLIC_CONSEILS = path.join(ROOT, 'public', 'conseils')

/** Écrit une sortie GitHub Actions (no-op en local si $GITHUB_OUTPUT absent). */
function setOutput(key, value) {
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`)
  }
}

/** Date du jour au format YYYY-MM-DD dans le fuseau Europe/Paris. */
function todayParis() {
  // en-CA donne directement YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date())
}

const drafts = fs.existsSync(DRAFTS)
  ? fs.readdirSync(DRAFTS).filter((f) => f.endsWith('.mdx')).sort()
  : []

if (drafts.length === 0) {
  console.warn('::warning::content/drafts/ est vide — aucun article à publier aujourd\'hui. Fin sans erreur.')
  setOutput('published', 'false')
  process.exit(0)
}

const draftFile = drafts[0]
const draftBase = draftFile.replace(/\.mdx$/, '')
const targetFile = draftFile.replace(/^\d+[-_]/, '') // retire le préfixe 001- / 002_
const srcPath = path.join(DRAFTS, draftFile)
const destPath = path.join(CONSEILS, targetFile)

if (fs.existsSync(destPath)) {
  console.error(`::error::${targetFile} existe déjà dans content/conseils/ (collision de slug). Publication annulée, corrigez le nom du draft.`)
  process.exit(1)
}

const today = todayParis()

// Lecture + remplacement ciblé de la ligne `date:` dans le frontmatter (1re occurrence),
// sans re-sérialiser tout le YAML (préserve le fichier à l'identique ailleurs).
let raw = fs.readFileSync(srcPath, 'utf8')
const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
if (!fmMatch) {
  console.error(`::error::${draftFile} n'a pas de frontmatter YAML (--- … ---). Publication annulée.`)
  process.exit(1)
}
let fm = fmMatch[1]
if (/^date:.*$/m.test(fm)) {
  fm = fm.replace(/^date:.*$/m, `date: "${today}"`)
} else {
  fm = `date: "${today}"\n${fm}`
}
raw = raw.replace(fmMatch[0], `---\n${fm}\n---`)

fs.mkdirSync(CONSEILS, { recursive: true })
fs.writeFileSync(destPath, raw)
fs.unlinkSync(srcPath)

// Assets optionnels : content/drafts/<draftBase>.assets/* -> public/conseils/*
const assetsDir = path.join(DRAFTS, `${draftBase}.assets`)
let movedAssets = 0
if (fs.existsSync(assetsDir) && fs.statSync(assetsDir).isDirectory()) {
  fs.mkdirSync(PUBLIC_CONSEILS, { recursive: true })
  for (const asset of fs.readdirSync(assetsDir)) {
    fs.renameSync(path.join(assetsDir, asset), path.join(PUBLIC_CONSEILS, asset))
    movedAssets++
  }
  fs.rmdirSync(assetsDir)
}

const slug = targetFile.replace(/\.mdx$/, '')
console.log(`Publié : content/drafts/${draftFile} -> content/conseils/${targetFile} (date: ${today}, ${movedAssets} asset(s) déplacé(s), ${drafts.length - 1} draft(s) restant(s)).`)
setOutput('published', 'true')
setOutput('file', targetFile)
setOutput('slug', slug)
