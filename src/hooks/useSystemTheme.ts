import { useEffect } from 'react'

/*
 * The builder follows the device: index.html already set data-theme before
 * first paint, and this keeps it honest if the device flips while the tab is
 * open. Invites ignore this entirely — a genre palette is one look.
 */
export function useSystemTheme(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      if (query.matches) document.documentElement.dataset.theme = 'dark'
      else delete document.documentElement.dataset.theme
    }
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [enabled])
}
