'use client'

import { useState } from 'react'

import type { Dictionary } from '@/i18n/dictionaries'
import type { UsesPage } from '@/payload-types'

import Category from './Category'

type Props = {
  categories: NonNullable<UsesPage['categories']>
  labels: Dictionary['uses']
}

/** All categories start open; each header toggles its own and also expands or collapses them all. */
export default function Categories({ categories, labels }: Props) {
  const keys = categories.map((category, index) => category.id ?? String(index))
  const [closed, setClosed] = useState<string[]>([])
  const allOpen = closed.length === 0

  return categories.map((category, index) => {
    const key = keys[index]
    const open = !closed.includes(key)

    return (
      <Category
        key={key}
        {...category}
        open={open}
        onToggle={() => setClosed((current) => (open ? [...current, key] : current.filter((item) => item !== key)))}
        allOpen={allOpen}
        onToggleAll={() => setClosed(allOpen ? keys : [])}
        labels={labels}
      />
    )
  })
}
