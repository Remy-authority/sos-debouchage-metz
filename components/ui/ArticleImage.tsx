'use client'

import { useState } from 'react'

/**
 * Image insérée dans le corps d'un article Markdown.
 *
 * Les textes de l'autoblog sont écrits avant que leurs visuels soient produits :
 * si le fichier n'existe pas encore, on masque simplement la figure plutôt que
 * d'afficher une icône d'image cassée au milieu de l'article.
 */
export function ArticleImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img loading="lazy" decoding="async" alt="" {...props} onError={() => setFailed(true)} />
}
