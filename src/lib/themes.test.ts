import { describe, expect, it } from 'vitest'
import { THEMES, applyTheme, clearTheme, themeById } from './themes'

describe('THEMES', () => {
  it('ships exactly ten', () => {
    expect(THEMES).toHaveLength(10)
  })

  it('has unique ids', () => {
    expect(new Set(THEMES.map((t) => t.id)).size).toBe(THEMES.length)
  })

  it('every colour token is a real hex colour', () => {
    for (const theme of THEMES) {
      for (const [key, value] of Object.entries(theme.tokens)) {
        if (key.startsWith('font') || key.startsWith('display')) continue
        expect(value, `${theme.id}.${key}`).toMatch(/^#[0-9a-f]{6}$/)
      }
    }
  })
})

describe('themeById', () => {
  it('finds a theme and falls back to the default', () => {
    expect(themeById('jazz').id).toBe('jazz')
    expect(themeById('polka').id).toBe(THEMES[0].id)
    expect(themeById(null).id).toBe(THEMES[0].id)
  })
})

describe('applyTheme', () => {
  it('writes every token and can take them all back off', () => {
    const root = document.createElement('div')
    const jazz = themeById('jazz')
    applyTheme(jazz, root)
    expect(root.style.getPropertyValue('--bg')).toBe(jazz.tokens.bg)
    expect(root.style.getPropertyValue('--font-display')).toBe(jazz.tokens.fontDisplay)
    expect(root.dataset.mixtapeTheme).toBe('jazz')
    clearTheme(root)
    expect(root.style.getPropertyValue('--bg')).toBe('')
    expect(root.dataset.mixtapeTheme).toBeUndefined()
  })
})

/*
 * Every theme is a real palette a guest reads on, so the pairings that carry
 * words are held to WCAG AA here rather than checked by eye. The pairs are the
 * ones the invite actually paints: body copy and the folio in --dim, the track
 * eyebrow in --accent on the sheet, and the play button's label in --ink on
 * --accent (and on its hover colour).
 */
function luminance(hex: string): number {
  const parts = hex.replace('#', '').match(/../g) ?? []
  const channels = parts.map((part) => {
    const value = parseInt(part, 16) / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * (channels[0] ?? 0) + 0.7152 * (channels[1] ?? 0) + 0.0722 * (channels[2] ?? 0)
}

function contrast(a: string, b: string): number {
  const x = luminance(a)
  const y = luminance(b)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

describe('theme contrast', () => {
  it('keeps every text pairing at AA in all ten themes', () => {
    for (const { id, tokens } of THEMES) {
      const pairs: [string, string, string][] = [
        [`${id}: dim on the sheet`, tokens.dim, tokens.surface],
        [`${id}: dim on the ground`, tokens.dim, tokens.bg],
        [`${id}: dim on a sunk panel`, tokens.dim, tokens.surfaceHi],
        [`${id}: text on the sheet`, tokens.text, tokens.surface],
        [`${id}: eyebrow on the sheet`, tokens.accent, tokens.surface],
        [`${id}: play label on the button`, tokens.ink, tokens.accent],
        [`${id}: play label on hover`, tokens.ink, tokens.accentHi],
      ]
      for (const [what, fg, bg] of pairs) {
        expect(contrast(fg, bg), what).toBeGreaterThanOrEqual(4.5)
      }
    }
  })
})
