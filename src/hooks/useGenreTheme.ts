import { useEffect } from 'react'
import { applyTheme, clearTheme, themeById } from '@/lib/themes'
import type { ThemeId } from '@/lib/types'

/*
 * Writes a genre palette onto an element as inline custom properties, which
 * outrank the neutral ground in index.css. The invite passes
 * document.documentElement so the whole page turns; the builder passes its
 * preview container so only the preview does.
 */
export function useGenreTheme(themeId: ThemeId, root: HTMLElement | null) {
  useEffect(() => {
    if (!root) return
    applyTheme(themeById(themeId), root)
    return () => clearTheme(root)
  }, [themeId, root])
}
