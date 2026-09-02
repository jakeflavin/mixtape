import { useState } from 'react'
import { readRoute } from '@/lib/codec'
import { Builder } from '@/components/Builder'
import { Invite } from '@/components/Invite'

/*
 * Two modes, decided once from the link. `m` carries a document, so it renders
 * as an invite; `edit=1` reopens the same document in the builder; no blob at
 * all is a fresh builder. Moving between them is a real navigation, which is
 * what lets index.html paint the right ground before anything runs.
 */
export function App() {
  const [route] = useState(() => readRoute(window.location.search, window.location.hash))

  if (route.doc && !route.editing) return <Invite doc={route.doc} />
  return <Builder initial={route.doc} />
}
