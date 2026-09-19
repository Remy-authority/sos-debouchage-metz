'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

/**
 * Colonne de liens du pied de page.
 *
 * Sur téléphone, la liste est repliée derrière son intitulé (accordéon) et tout
 * est centré : un pied de page de 8 prestations et 12 communes déroulé en entier
 * faisait cinq écrans de défilement sur mobile. À partir de `lg`, l'accordéon
 * n'existe plus : l'intitulé redevient un simple titre et la liste est toujours
 * ouverte, alignée à gauche, exactement comme avant.
 */
export function FooterLinks({
  title,
  items,
}: {
  title: string
  items: { href: string; label: string }[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent-400 lg:mb-5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-center gap-2 py-2 uppercase tracking-[0.18em] lg:pointer-events-none lg:justify-start lg:py-0"
        >
          {title}
          <ChevronDown
            size={14}
            aria-hidden="true"
            className={`transition-transform duration-300 lg:hidden ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </h2>

      <ul
        className={`space-y-3 text-center lg:block lg:text-left ${
          open ? 'mt-3' : 'hidden'
        }`}
      >
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="text-sm text-sand-300 transition-colors hover:text-accent-300"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
