/**
 * GARDE-FOU « PAS DE DOCUMENT LISIBLE DANS UNE IMAGE » — outil de référence du portefeuille.
 *
 * Origine (décision Rémy du 11/08/2026). Les 29 sites publient trois fois par semaine, à 5 h,
 * par un cron qui rédige, GÉNÈRE LES IMAGES, commite et met en ligne sans qu'aucun humain ne
 * voie l'image. Le garde-fou « contrôle CEO en zoom » ne couvre que les livraisons manuelles.
 * Déclencheur : sur le site 28, un faux devis de 23 000 € au nom de « M. & Mme DUBOIS » et
 * une fausse attestation d'assurance décennale portant un SIRET inventé, c'est-à-dire les
 * trois interdits les plus lourds du portefeuille (chiffre inventé, fausse certification,
 * personne fictive), en image — donc invisibles à `check-footprint.py` qui lit du texte et à
 * `audit-visuels-articles.py` qui compte des fichiers.
 *
 * ⚠️ CORRECTION DU 11/08, remontée par le CEO du site 28 et VÉRIFIÉE SUR PIÈCES GIT.
 * Cette docstring affirmait « la bascule FLUX a rendu le risque concret : Gemini floutait les
 * textes, FLUX les ÉCRIT », et le portefeuille en avait conclu que le risque n'était pas
 * rétroactif. C'EST FAUX. Chronologie du dépôt du site 28 :
 *   · bascule FLUX = commit b7b8838, le 11/08 à 02:42 ;
 *   · le script d'avant (3dde445) ne contient AUCUNE référence à fal.ai — l'unique
 *     correspondance d'un grep « flux|fal » est le mot `false` ;
 *   · 19 des 22 images d'articles ont un mtime ANTÉRIEUR à 02:42, donc produites par Gemini.
 * Le faux devis et la fausse attestation viennent donc de GEMINI. Le risque n'est pas né avec
 * FLUX : il court sur TOUT le corpus, soit ~2 900 images du portefeuille, très majoritairement
 * générées à l'époque Gemini. Les trois images de production ouvertes le 11/08 (Pau, drainage
 * Normandie, eau de pluie Loiret) étaient une bonne nouvelle, pas une preuve d'innocuité sur
 * un millier d'articles.
 *
 * Usage en contrôle manuel (code 1 si au moins une image est rejetée) :
 *   node tasks/check-image-text.mjs <image> [image...]
 *
 * Usage dans le générateur d'un site (scripts/generate-article-images.mjs) :
 *   import { imagePorteUnDocument } from './check-image-text.mjs'
 *   const verdict = await imagePorteUnDocument(octets)
 *   if (verdict.rejet) { ... régénérer ... }
 *
 * ─────────────────────────────────────────────────────────────────────────────────────────
 * POURQUOI PAS TESSERACT, qui était la solution proposée à Rémy
 *
 * Mesuré le 11/08 sur trois images pièges générées exprès (devis, attestation, panneau de
 * chantier) : tesseract.js ne voit NI le devis NI l'attestation, alors que les deux sont
 * parfaitement lisibles à l'œil. Deux causes, toutes deux rédhibitoires :
 *   1. les générateurs écrivent du CHARABIA (« Devisé de renvation de toiture »,
 *      « ÁTTETATION D'ÉRCILE DÉTAUMITE », « COVEREUR ») : aucun filtre par mot-clé
 *      (DEVIS, ATTESTATION, SIRET) ne peut fonctionner, et aucun dictionnaire non plus ;
 *   2. le texte est en perspective et en faible profondeur de champ, là où tesseract attend
 *      un scan à plat. Ni le prétraitement (gris + normalisation + netteté), ni le mode
 *      « texte épars », ni la découpe en tuiles agrandies n'ont changé le verdict.
 * Un garde-fou aveugle aux deux cas qui l'ont motivé aurait été un contrôle qui rend VERT
 * sans avoir mesuré la bonne chose (méta-leçon du 10/08).
 *
 * CE QUI MARCHE : un détecteur de RÉGIONS de texte (Florence-2 via fal.ai), qui repère du
 * texte sans avoir besoin de le comprendre. Il utilise `FAL_KEY`, déjà posée sur les 29
 * dépôts pour la génération : aucun secret ni paquet npm supplémentaire à distribuer.
 *
 * ─────────────────────────────────────────────────────────────────────────────────────────
 * LE SEUIL, ET COMMENT IL A ÉTÉ MESURÉ (34 images, 11/08/2026)
 *
 * Le critère retenu est le NOMBRE DE RÉGIONS de texte, pas la surface. La surface a été
 * écartée sur pièce : une couverture légitime du site 16 (un mètre ruban déroulé en travers
 * d'une porte) affiche une grande surface graduée, mais Florence n'y voit qu'UNE région.
 *
 *   3 images pièges  ..............................  4, 14 et 18 régions
 *   31 images légitimes  ..........................  1 région au maximum
 *     · 6 du banc d'essai FLUX (tasks/test-flux-sorties)
 *     · 15 de production Gemini, 9 sites différents
 *     · 10 de production FLUX du site 28, déjà validées en zoom par son CEO
 *
 * Seuil à 3 : marge nette des deux côtés, aucun faux positif sur les 31. Un logo ou une
 * marque sur du matériel reste donc ACCEPTÉ (décision Rémy du 04/08 : les marques visibles
 * ne sont pas un défaut, et le zèle inverse avait coûté des régénérations inutiles).
 */

const ENDPOINT = 'https://fal.run/fal-ai/florence-2-large/ocr-with-region'

/** Au-delà, l'image porte un document, un panneau ou une pancarte : elle est rejetée. */
const MAX_REGIONS = 3

/**
 * Largeur d'envoi au détecteur. Mesuré le 11/08 : à 800 px le coût tombe de 0,0134 $ à
 * 0,00063 $ par image (le service est facturé au temps GPU), soit 21 fois moins, SANS rien
 * perdre — les trois pièges restent détectés (16, 14 et 4 régions) et les images saines
 * descendent même de 1 région à 0. Le garde-fou coûte donc 2,5 % du prix de la génération
 * qu'il protège.
 */
const LARGEUR_ANALYSE = 800

/** Une « région » de moins de 2 caractères est du bruit de texture (tuiles, feuillage). */
const MIN_CARACTERES = 2

/** Reprises sur le détecteur lui-même : un hoquet réseau ne doit pas geler un article. */
const MAX_TENTATIVES = 3

/**
 * Motifs d'interdit lourd qui suffisent à eux seuls, même sur une région isolée.
 * Volontairement TRÈS restreint : le charabia des générateurs rend tout filtre lexical
 * peu fiable, et un filtre trop large rejetterait des images saines (le mètre ruban du
 * site 16 aurait été rejeté par un motif « longue suite de chiffres »).
 */
const INTERDITS = [
  { motif: /\d\s*(?:€|EUR\b)|(?:€|EUR\b)\s*\d/i, nom: 'montant en euros' },
]

/** Extension d'un fichier vers son type MIME, pour l'encodage en data: URI. */
function mime(chemin) {
  if (/\.png$/i.test(chemin)) return 'image/png'
  if (/\.webp$/i.test(chemin)) return 'image/webp'
  return 'image/jpeg'
}

/**
 * Analyse une image et dit si elle porte un document, un panneau ou une pancarte lisible.
 *
 * @param {Buffer|string} image  octets de l'image, ou chemin vers un fichier
 * @param {{cle?: string}} [options]  clé fal ; par défaut `process.env.FAL_KEY`
 * @returns {Promise<{rejet: boolean, motif: string|null, regions: number, textes: string[]}>}
 */
export async function imagePorteUnDocument(image, options = {}) {
  const cle = options.cle || process.env.FAL_KEY
  if (!cle) throw new Error('FAL_KEY absent de l\'environnement : garde-fou impossible.')

  let octets = image
  let typeMime = 'image/jpeg'
  if (typeof image === 'string') {
    const fs = await import('node:fs')
    octets = fs.readFileSync(image)
    typeMime = mime(image)
  }

  // Réduction avant envoi : 21 fois moins cher, détection inchangée (cf. LARGEUR_ANALYSE).
  // `sharp` est déjà une dépendance du générateur d'images de chaque site. S'il manque, on
  // envoie l'image entière : le contrôle reste juste, il coûte seulement plus cher — jamais
  // de dégradation silencieuse du verdict.
  const SHARP_COCKPIT = '/Users/zaouiremy/Desktop/Claude code/RENT & RANK/cockpit/node_modules/sharp/lib/index.js'
  for (const source of ['sharp', SHARP_COCKPIT]) {
    try {
      const { default: sharp } = await import(source)
      octets = await sharp(octets)
        .resize({ width: LARGEUR_ANALYSE, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer()
      typeMime = 'image/jpeg'
      break
    } catch {
      /* source suivante ; si aucune n'aboutit, analyse en pleine taille */
    }
  }

  const dataUri = `data:${typeMime};base64,${octets.toString('base64')}`

  let derniere
  for (let essai = 1; essai <= MAX_TENTATIVES; essai++) {
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Authorization: `Key ${cle}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: dataUri }),
      })
      if (!res.ok) throw new Error(`détecteur ${res.status} : ${(await res.text()).slice(0, 200)}`)
      const json = await res.json()

      const textes = (json?.results?.quad_boxes ?? [])
        .map((b) => String(b.label ?? '').replace(/<\/?s>/g, '').trim())
        .filter((t) => t.length >= MIN_CARACTERES)

      for (const { motif, nom } of INTERDITS) {
        const trouve = textes.find((t) => motif.test(t))
        if (trouve) {
          return { rejet: true, motif: `${nom} lisible dans l'image (« ${trouve} »)`, regions: textes.length, textes }
        }
      }
      if (textes.length >= MAX_REGIONS) {
        return {
          rejet: true,
          motif: `${textes.length} zones de texte lisibles : l'image porte un document, un panneau ou une pancarte`,
          regions: textes.length,
          textes,
        }
      }
      return { rejet: false, motif: null, regions: textes.length, textes }
    } catch (err) {
      derniere = err
      if (essai < MAX_TENTATIVES) await new Promise((r) => setTimeout(r, 3000 * essai))
    }
  }

  // Le détecteur est injoignable. On échoue FERMÉ : une image non contrôlée ne se publie
  // pas, exactement comme une image non générée (garde-fou du 04/08). L'article repart en
  // brouillon et sera repris au prochain passage du cron, rien n'est perdu.
  throw new Error(`garde-fou indisponible après ${MAX_TENTATIVES} tentatives : ${derniere?.message}`)
}

/* ─────────────────────────── Utilisation en ligne de commande ─────────────────────────── */

const estAppelDirect = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())
if (estAppelDirect) {
  const fichiers = process.argv.slice(2)
  if (fichiers.length === 0) {
    console.error('usage : node tasks/check-image-text.mjs <image> [image...]')
    process.exit(2)
  }

  let rejets = 0
  let erreurs = 0
  for (const f of fichiers) {
    const nom = f.split('/').slice(-2).join('/')
    try {
      const v = await imagePorteUnDocument(f)
      if (v.rejet) {
        rejets++
        console.log(`REJET   ${nom}`)
        console.log(`        ${v.motif}`)
        console.log(`        lu : ${v.textes.slice(0, 8).map((t) => `« ${t} »`).join(', ')}`)
      } else {
        console.log(`ok      ${nom}  (${v.regions} zone${v.regions > 1 ? 's' : ''} de texte)`)
      }
    } catch (err) {
      erreurs++
      console.log(`ERREUR  ${nom} : ${err.message}`)
    }
  }

  console.log()
  if (rejets === 0 && erreurs === 0) {
    console.log(`OK : aucune image ne porte de document lisible (${fichiers.length} analysée${fichiers.length > 1 ? 's' : ''}).`)
    process.exit(0)
  }
  console.log(`ECHEC : ${rejets} image(s) rejetée(s), ${erreurs} non analysable(s) sur ${fichiers.length}.`)
  process.exit(1)
}
