'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { EASE } from '@/lib/motion'
import type { FaqItem } from '@/lib/content'

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <AnimatedSection className="mt-14 space-y-3">
      {items.map((item, idx) => {
        const isOpen = open === idx
        return (
          <div
            key={item.q}
            className={`overflow-hidden rounded-card border transition-all duration-300 ${
              isOpen
                ? 'border-accent-300 bg-white shadow-card'
                : 'border-sand-200 bg-white/70 hover:border-sand-300'
            }`}
          >
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left lg:px-8 lg:py-6"
              >
                <span
                  className={`font-display text-lg font-medium leading-snug transition-colors lg:text-xl ${
                    isOpen ? 'text-ink-950' : 'text-ink-900'
                  }`}
                >
                  {item.q}
                </span>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    isOpen ? 'rotate-180 bg-accent-500 text-white' : 'bg-brand-600/10 text-brand-700'
                  }`}
                  aria-hidden="true"
                >
                  {isOpen ? <Minus size={16} strokeWidth={2.5} /> : <Plus size={16} strokeWidth={2.5} />}
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <p className="px-6 pb-6 leading-relaxed text-sand-600 lg:px-8 lg:pb-8">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </AnimatedSection>
  )
}
