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
