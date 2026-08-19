/**
 * Génère les visuels d'un article au moment de sa publication (autoblog).
 *
 * Appelé par le workflow publish-article APRÈS publish-next-draft.mjs, avec le slug de
 * l'article qui vient d'être déplacé dans content/conseils/.
 *
 *   node scripts/generate-article-images.mjs <slug>
 *
 * Produit, selon la recette portefeuille (docs/RECETTE-VISUELS-ARTICLES.md) :
 *  - la couverture, au chemin déjà déclaré dans le frontmatter `cover:`, décrite par `coverAlt:`
 *  - un visuel de corps `/conseils/<slug>-1.jpg`, inséré dans le texte après la 2e section
 *
 * En cas d'échec, sort en code 1 SANS rien committer : le workflow s'arrête, `main` reste
 * intact et le brouillon repart au prochain passage. Un article ne se publie jamais nu.
 *
 * Nécessite GEMINI_API_KEY dans l'environnement.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import matter from 'gray-matter'
import { imagePorteUnDocument } from './check-image-text.mjs'

const MODEL = 'gemini-3.1-flash-image-preview'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`
const ROOT = process.cwd()
const CONSEILS = path.join(ROOT, 'content', 'conseils')
const PUBLIC = path.join(ROOT, 'public')
const MAX_TENTATIVES = 3

const slug = process.argv[2]
if (!slug) {
  console.error('Usage : node scripts/generate-article-images.mjs <slug>')
  process.exit(1)
}

const provider = process.env.IMAGE_PROVIDER || 'flux'
const apiKey = provider === 'flux' ? process.env.FAL_KEY : process.env.GEMINI_API_KEY
if (!apiKey) {
  console.error(
    provider === 'flux'
      ? 'FAL_KEY absent de l\'environnement.'
      : 'GEMINI_API_KEY absent de l\'environnement.',
  )
  process.exit(1)
}

// Style visuel du site : ancre géographique et métier, pour que deux sites du portefeuille
// ne produisent jamais la même imagerie (anti-footprint).
const stylePath = path.join(ROOT, 'config', 'image-style.json')
if (!fs.existsSync(stylePath)) {
  console.error(`Style visuel manquant : ${stylePath}`)
  process.exit(1)
}
const style = JSON.parse(fs.readFileSync(stylePath, 'utf8'))

const articlePath = path.join(CONSEILS, `${slug}.mdx`)
if (!fs.existsSync(articlePath)) {
  console.error(`Article introuvable : ${articlePath}`)
  process.exit(1)
}

const raw = fs.readFileSync(articlePath, 'utf8')
const parsed = matter(raw)
const { data: fm } = parsed

// Le frontmatter est conservé TEL QUEL (texte brut) : on ne le réécrit jamais via
// matter.stringify, qui reformaterait les blocs YAML imbriqués (faq, listes) et
// produirait des diffs parasites sur tout l'article. Seul le corps est modifié.
const finFrontmatter = raw.indexOf('\n---', 3)
if (!raw.startsWith('---') || finFrontmatter === -1) {
  console.error('Article sans frontmatter exploitable.')
  process.exit(1)
}
let frontmatterBrut = raw.slice(0, finFrontmatter + 4)
let body = raw.slice(finFrontmatter + 4)

/** Prompt commun : ancrage local + consignes de rendu. */
function habillerPrompt(scene) {
  return [
    `Photographie documentaire professionnelle, réaliste, haute qualité.`,
    `Sujet : ${scene}`,
    `Lieu : ${style.contexte}. Décor, matériaux et architecture cohérents avec cette région française.`,
    `Métier illustré : ${style.metier}.`,
    `Ambiance : ${style.ambiance}`,
    `Lumière naturelle, cadrage soigné, profondeur de champ photographique.`,
    `Ne pas incruster de texte, de filigrane ni de mention en surimpression.`,
    `Éviter de montrer des personnes en pied ou des visages reconnaissables ; si une main apparaît, une seule main visible, anatomie correcte.`,
  ].join(' ')
}

const FLUX_ENDPOINT = 'https://fal.run/fal-ai/flux/dev'

/** Appelle l'API image et renvoie les octets de l'image. */
async function genererImage(prompt) {
  if (provider === 'flux') {
    const res = await fetch(FLUX_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Key ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        // JAMAIS 'landscape_16_9' (rend 1024x576) : docs/RECETTE-IMAGES-FLUX.md du
        // portefeuille, correction du 11/08.
        image_size: { width: 1280, height: 720 },
        num_images: 1,
        num_inference_steps: 28,
        enable_safety_checker: false,
      }),
    })
    if (!res.ok) throw new Error(`FLUX ${res.status} : ${(await res.text()).slice(0, 300)}`)
    const json = await res.json()
    const url = json?.images?.[0]?.url
    if (!url) throw new Error('Réponse FLUX sans image.')
    const bin = await fetch(url)
    if (!bin.ok) throw new Error(`Téléchargement image ${bin.status}`)
    return Buffer.from(await bin.arrayBuffer())
  }

  // Repli Gemini, conservé tel quel pour IMAGE_PROVIDER=gemini.
  const res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: { imageSize: '2K', aspectRatio: '16:9' },
      },
    }),
  })

  if (!res.ok) {
    throw new Error(`API ${res.status} : ${(await res.text()).slice(0, 300)}`)
  }

  const json = await res.json()
  const parts = json?.candidates?.[0]?.content?.parts ?? []
  const image = parts.find((p) => p.inlineData?.data)
  if (!image) {
    throw new Error('Réponse sans image (contenu probablement filtré).')
  }
  return Buffer.from(image.inlineData.data, 'base64')
}

/** Réessaie : l'API filtre parfois une génération sans raison durable. */
async function genererAvecReprises(prompt, etiquette) {
  let derniere
  for (let essai = 1; essai <= MAX_TENTATIVES; essai++) {
    try {
      const octets = await genererImage(prompt)

      // GARDE-FOU DU 11/08/2026 (docs/RECETTE-GARDE-FOU-IMAGES.md du portefeuille) :
      // le cron publie sans qu'aucun humain ne voie l'image. Une image portant un
      // document, un panneau ou un montant est refusée et régénérée. Le rejet
      // réutilise la boucle de reprises existante.
      const verdict = await imagePorteUnDocument(octets)
      if (verdict.rejet) throw new Error(`image refusée par le garde-fou : ${verdict.motif}`)

      console.log(`  ${etiquette} : image obtenue (essai ${essai}, ${Math.round(octets.length / 1024)} Ko bruts)`)
      return octets
    } catch (err) {
      derniere = err
      console.log(`  ${etiquette} : essai ${essai} échoué (${err.message})`)
      if (essai < MAX_TENTATIVES) await new Promise((r) => setTimeout(r, 4000 * essai))
    }
  }
  throw derniere
}

/**
 * Écrit l'image redimensionnée et compressée en JPEG.
 *
 * L'API rend un JPEG 2K d'environ 3 Mo : inexploitable tel quel sur le web, il faut le
 * ramener à 1600 px de large et le recompresser. `sharp` fait ça partout (macOS comme
 * runner Ubuntu, qui n'a ni sips ni ImageMagick). Repli sur les outils système si sharp
 * venait à manquer, et en dernier recours l'image brute plutôt qu'un article sans visuel.
 */
async function ecrireJpeg(octets, destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true })

  try {
    const { default: sharp } = await import('sharp')
    await sharp(octets)
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 72, mozjpeg: true })
      .toFile(destination)
    const ko = Math.round(fs.statSync(destination).size / 1024)
    console.log(`  -> ${path.relative(ROOT, destination)} (${ko} Ko, via sharp)`)
    return
  } catch (err) {
    console.log(`  sharp indisponible (${err.message}), repli sur les outils système`)
  }

  const tmp = destination.replace(/\.jpe?g$/i, '') + '.tmp.jpg'
  fs.writeFileSync(tmp, octets)
  const outils = [
    ['sips', ['-Z', '1600', '-s', 'format', 'jpeg', '-s', 'formatOptions', '72', tmp, '--out', destination]],
    ['magick', [tmp, '-resize', '1600x>', '-quality', '72', destination]],
    ['convert', [tmp, '-resize', '1600x>', '-quality', '72', destination]],
  ]
  for (const [bin, args] of outils) {
    try {
      execFileSync(bin, args, { stdio: 'ignore' })
      fs.unlinkSync(tmp)
      const ko = Math.round(fs.statSync(destination).size / 1024)
      console.log(`  -> ${path.relative(ROOT, destination)} (${ko} Ko, via ${bin})`)
      return
    } catch {
      /* outil absent : on tente le suivant */
    }
  }

  fs.renameSync(tmp, destination)
  const ko = Math.round(fs.statSync(destination).size / 1024)
  console.log(`  -> ${path.relative(ROOT, destination)} (${ko} Ko, NON COMPRESSÉ, aucun outil disponible)`)
}

/** Découpe le corps en sections de niveau 2. */
function sections(texte) {
  const lignes = texte.split('\n')
  const out = []
  lignes.forEach((ligne, i) => {
    if (/^##\s+/.test(ligne)) out.push({ index: i, titre: ligne.replace(/^##\s+/, '').trim() })
  })
  return out
}

/** Insère le visuel de corps après le premier paragraphe de la section choisie. */
function insererVisuel(texte, ligneSection, markdown) {
  const lignes = texte.split('\n')
  let i = ligneSection + 1
  while (i < lignes.length && lignes[i].trim() === '') i++
  while (i < lignes.length && lignes[i].trim() !== '') i++ // fin du 1er paragraphe
  lignes.splice(i, 0, '', markdown)
  return lignes.join('\n')
}

async function main() {
  console.log(`Visuels de l'article « ${fm.title ?? slug} »`)

  // 1. Couverture, décrite par coverAlt quand l'autoblog l'a rédigé.
  //
  // Beaucoup de brouillons n'ont aucun `cover:` (constat du 04/08 : 5 sites sur 17, dont
  // tous ceux de Besançon). On ne se bloque pas pour autant : on calcule le chemin selon la
  // convention déclarée du site et on insère la ligne dans le frontmatter, sans toucher au
  // reste du bloc.
  let coverRel = fm.cover
  let coverAAjouter = false
  if (!coverRel) {
    coverRel = style.convention === 'dossier'
      ? `/conseils/${slug}/cover.jpg`
      : `/conseils/${slug}.jpg`
    coverAAjouter = true
    console.log(`  aucun \`cover:\` déclaré, chemin retenu : ${coverRel}`)
  }
  const coverDest = path.join(PUBLIC, coverRel.replace(/^\//, ''))

  if (fs.existsSync(coverDest)) {
    // GARDE-FOU DU 11/08/2026, section « 3 bis » de docs/RECETTE-GARDE-FOU-IMAGES.md :
    // une image PRÉ-EXISTANTE (brouillon pré-illustré, asset déplacé par
    // publish-next-draft) ne passait par aucun contrôle. On la vérifie ici aussi.
    const verdict = await imagePorteUnDocument(fs.readFileSync(coverDest))
    if (verdict.rejet) {
      throw new Error(`couverture pré-existante refusée par le garde-fou (${coverRel}) : ${verdict.motif}`)
    }
    console.log(`  couverture déjà présente, conservée et contrôlée : ${coverRel}`)
  } else {
    // Sans coverAlt, le titre de l'article fait une description de scène acceptable.
    const sceneCover = fm.coverAlt || fm.title || slug
    const octets = await genererAvecReprises(habillerPrompt(sceneCover), 'couverture')
    await ecrireJpeg(octets, coverDest)
  }

  // Déclare la couverture dans le frontmatter si elle n'y était pas. Insertion d'une seule
  // ligne juste avant le `---` de fermeture : le reste du bloc n'est jamais reformaté.
  if (coverAAjouter) {
    const lignes = frontmatterBrut.split('\n')
    const fin = lignes.lastIndexOf('---')
    const alt = (fm.title || slug).replace(/"/g, "'")
    lignes.splice(fin, 0, `cover: "${coverRel}"`, `coverAlt: "${alt}"`)
    frontmatterBrut = lignes.join('\n')
    fs.writeFileSync(articlePath, frontmatterBrut + body)
    console.log('  `cover:` et `coverAlt:` ajoutés au frontmatter')
  }

  // 2. Visuel de corps, s'il n'y en a pas déjà un.
  const aDejaVisuel = /!\[[^\]]*\]\(|<Figure|<Image/.test(body)
  if (aDejaVisuel) {
    console.log('  visuel de corps déjà présent, rien à ajouter.')
  } else {
    const h2 = sections(body)
    if (h2.length === 0) throw new Error('Article sans section de niveau 2 : aucun point d\'insertion.')

    // 2e section de préférence : la 1re est souvent introductive.
    const cible = h2[Math.min(1, h2.length - 1)]

    // Contexte concret pour la scène : le début de la section visée.
    const suite = body.split('\n').slice(cible.index + 1).join(' ').replace(/\s+/g, ' ').trim()
    const extrait = suite.slice(0, 320)

    const scene = `${cible.titre}. Éléments concrets à représenter, tirés du texte : ${extrait}`
    const octets = await genererAvecReprises(habillerPrompt(scene), 'visuel de corps')

    // Le visuel suit la convention du site, déduite du chemin de la couverture :
    // dossier par article (/conseils/<slug>/cover.jpg) ou fichiers à plat.
    const coverParArticle = new RegExp(`/conseils/${slug}/`).test(coverRel || '')
    const cheminVisuel = coverParArticle ? `/conseils/${slug}/corps-1.jpg` : `/conseils/${slug}-1.jpg`
    await ecrireJpeg(octets, path.join(PUBLIC, cheminVisuel.replace(/^\//, '')))

    const alt = cible.titre.replace(/"/g, '')
    body = insererVisuel(body, cible.index, `![${alt}](${cheminVisuel})`)
    fs.writeFileSync(articlePath, frontmatterBrut + body)
    console.log(`  visuel inséré après la section « ${cible.titre} »`)
  }

  console.log('Visuels de l\'article prêts.')
}

main().catch((err) => {
  console.error(`\nÉCHEC de la génération des visuels : ${err.message}`)
  console.error('Publication annulée : rien ne sera committé, le brouillon repartira au prochain passage.')
  process.exit(1)
})
