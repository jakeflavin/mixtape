import { useEffect, useState } from 'react'
import { sanitize } from '@/lib/codec'
import { starterDoc } from '@/lib/starter'
import type { SaveTheDate } from '@/lib/types'

/*
 * The builder's working copy. It survives a reload through localStorage —
 * losing a half-written FAQ to an accidental refresh would be brutal — but the
 * saved link is still the only real document. All the apps share one origin,
 * so the key carries the app's name.
 */
const KEY = 'mixtape.draft'

function load(initial: SaveTheDate | null): SaveTheDate {
  if (initial) return initial
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return sanitize(JSON.parse(raw))
  } catch {
    // Broken storage or a corrupt draft both mean the same thing: start fresh.
  }
  return starterDoc()
}

export function useDraft(initial: SaveTheDate | null) {
  const [doc, setDoc] = useState<SaveTheDate>(() => load(initial))

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(doc))
    } catch {
      // Private mode with a full quota: the draft just does not persist.
    }
  }, [doc])

  const update = (patch: Partial<SaveTheDate>) => setDoc((current) => ({ ...current, ...patch }))

  return { doc, update, reset: () => setDoc(starterDoc()) }
}
