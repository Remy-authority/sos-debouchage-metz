'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

/**
 * Colonne du pied de page.
 *
 * Téléphone (Rémy 22/11/2026, « tout sur une seule ligne ») : les intitulés Prestations, Zones et
 * Contact tiennent sur UNE ligne de trois ; le parent est une grille de 3 colonnes et ce bloc s'y
 * fond (`contents`) : l'intitulé va sur la ligne du haut (order-1), la liste dépliée passe dessous,
 * en pleine largeur (order-2, col-span-3), sur deux colonnes centrées.
 * Ordinateur (`lg`) : plus d'accordéon, l'intitulé redevient un titre, la liste est toujours
 * ouverte, alignée à gauche, comme avant (#R69).
 */
export function FooterLinks({
  title,
  items,
  children,
}: {
  title: string
  items?: { href: string; label: string }[]
  /** Contenu libre à la place des liens (colonne Contact). */
  children?: ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="contents lg:block">
      <h2 className="order-1 border-y border-ink-800 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-400 lg:mb-5 lg:border-0 lg:text-xs lg:tracking-[0.18em]">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-center gap-1.5 py-3 uppercase lg:pointer-events-none lg:justify-start lg:py-0"
        >
          {title}
          <ChevronDown
            size={13}
            aria-hidden="true"
            className={`transition-transform duration-300 lg:hidden ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </h2>

      <div className={`order-2 col-span-3 pb-4 pt-1 lg:block lg:p-0 ${open ? '' : 'hidden'}`}>
        {items ? (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-center lg:block lg:space-y-3 lg:text-left">
            {items.map((it) => (
              <li key={it.href}>
                <Link href={it.href} className="text-[13px] text-sand-300 transition-colors hover:text-accent-300 lg:text-sm">
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
