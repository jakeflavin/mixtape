import { useEffect, useState } from 'react'
import { readRoute } from '@/lib/codec'
import { Builder } from '@/components/Builder'
import { Invite } from '@/components/Invite'

/*
 * Two modes, decided from the link. `m` carries a document, so it renders as
 * an invite; `edit=1` reopens the same document in the builder; no blob at all
 * is a fresh builder. Moving between them is a real navigation, which is what
 * lets index.html paint the right ground before anything runs.
 *
 * The document rides in the fragment, and a fragment-only change is a
 * same-document navigation: a link pasted into a tab that already has Mixtape
 * open would otherwise move the address bar and nothing else. Reloading is the
 * honest answer, because index.html has to run again to paint that link's
 * ground before React sees it.
 */
export function App() {
  const [route] = useState(() => readRoute(window.location.search, window.location.hash))

  useEffect(() => {
    const reload = () => window.location.reload()
    window.addEventListener('hashchange', reload)
    return () => window.removeEventListener('hashchange', reload)
  }, [])

  if (route.doc && !route.editing) return <Invite doc={route.doc} />
  return <Builder initial={route.doc} brokenLink={route.failed} />
}
