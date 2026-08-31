import type { ThemeId } from './types'

/*
 * Ten palettes, one per genre. Like hat and countdown these are named palettes
 * rather than a light/dark pair, so they are written onto `:root` from here —
 * no attribute can stand in for ten looks. index.html carries a tiny copy of
 * each theme's ground so the first frame paints the right colour; that copy and
 * this table are the same numbers, and changing either changes both.
 *
 * Every colour a component uses comes out of this table as a CSS custom
 * property. The hex literals below are the token source, not an exception to
 * the tokens-only rule.
 */

export interface Theme {
  id: ThemeId
  label: string
  /** One line in the picker: the wedding this look belongs to. */
  vibe: string
  /** Drives `color-scheme`, selection colours and shadows. */
  dark: boolean
  /** The decorative figure drawn behind the cover names. */
  motif: 'rings' | 'burst' | 'bars' | 'grid' | 'wave'
  tokens: ThemeTokens
}

export interface ThemeTokens {
  bg: string
  surface: string
  surfaceHi: string
  line: string
  text: string
  dim: string
  accent: string
  accentHi: string
  /** Text sitting on top of the accent. */
  ink: string
  /** The cover gradient, top to bottom. */
  coverA: string
  coverB: string
  coverText: string
  coverDim: string
  /** The printed label on the disc. */
  discA: string
  discB: string
  discText: string
  fontDisplay: string
  /** Extra letterspacing themes with shouty display faces want on headings. */
  displayTracking: string
  displayTransform: string
}

const SERIF = "'Didot', 'Bodoni MT', 'Playfair Display', Georgia, 'Times New Roman', serif"
const SLAB = "'Rockwell', 'Courier New', 'American Typewriter', Georgia, serif"
const CONDENSED = "'Arial Narrow', 'Helvetica Neue', Impact, sans-serif"
const ROUNDED = "ui-rounded, 'SF Pro Rounded', 'Arial Rounded MT Bold', 'Trebuchet MS', sans-serif"
const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
const GROTESK = "'Helvetica Neue', Helvetica, Arial, sans-serif"

export const THEMES: [Theme, ...Theme[]] = [
  {
    id: 'indie',
    label: 'Indie',
    vibe: 'A barn, string lights, someone brought a film camera',
    dark: false,
    motif: 'wave',
    tokens: {
      bg: '#f4f1e8',
      surface: '#fdfbf4',
      surfaceHi: '#ece8da',
      line: '#ddd7c4',
      text: '#2d2a22',
      dim: '#7a7462',
      accent: '#c05f33',
      accentHi: '#a34d26',
      ink: '#fdfbf4',
      coverA: '#e9e2cf',
      coverB: '#cfc5a6',
      coverText: '#33301f',
      coverDim: '#6d6750',
      discA: '#e0d8bf',
      discB: '#b3a983',
      discText: '#33301f',
      fontDisplay: SERIF,
      displayTracking: '0.01em',
      displayTransform: 'none',
    },
  },
  {
    id: 'rock',
    label: 'Rock',
    vibe: 'Leather jackets over the wedding clothes',
    dark: true,
    motif: 'burst',
    tokens: {
      bg: '#141212',
      surface: '#1f1c1c',
      surfaceHi: '#2a2626',
      line: '#3a3434',
      text: '#f2eeea',
      dim: '#a49c96',
      accent: '#e03a2f',
      accentHi: '#ff5a4d',
      ink: '#fdf9f5',
      coverA: '#221e1e',
      coverB: '#0c0a0a',
      coverText: '#f2eeea',
      coverDim: '#8f8781',
      discA: '#2b2727',
      discB: '#161313',
      discText: '#f2eeea',
      fontDisplay: CONDENSED,
      displayTracking: '0.06em',
      displayTransform: 'uppercase',
    },
  },
  {
    id: 'pop',
    label: 'Pop',
    vibe: 'Glitter cannons at the first dance',
    dark: false,
    motif: 'rings',
    tokens: {
      bg: '#fdeef4',
      surface: '#fffafc',
      surfaceHi: '#fbdde9',
      line: '#f3c8da',
      text: '#3b1226',
      dim: '#96607b',
      accent: '#e0157a',
      accentHi: '#b90f63',
      ink: '#fffafc',
      coverA: '#ff9ec6',
      coverB: '#ffd166',
      coverText: '#471031',
      coverDim: '#7c3c5c',
      discA: '#ffb3d2',
      discB: '#ff7ab0',
      discText: '#471031',
      fontDisplay: ROUNDED,
      displayTracking: '0.01em',
      displayTransform: 'none',
    },
  },
  {
    id: 'hiphop',
    label: 'Hip-hop',
    vibe: 'Gold rings, gold hour, golden couple',
    dark: true,
    motif: 'grid',
    tokens: {
      bg: '#101010',
      surface: '#1b1a18',
      surfaceHi: '#262420',
      line: '#38352e',
      text: '#f5f1e6',
      dim: '#a89f8a',
      accent: '#d4a72c',
      accentHi: '#e9c34f',
      ink: '#171512',
      coverA: '#1d1b17',
      coverB: '#060605',
      coverText: '#e9c34f',
      coverDim: '#9a8a6f',
      discA: '#caa32f',
      discB: '#8a6c14',
      discText: '#171512',
      fontDisplay: GROTESK,
      displayTracking: '0.12em',
      displayTransform: 'uppercase',
    },
  },
  {
    id: 'country',
    label: 'Country',
    vibe: 'Boots, a field, somebody cries during the vows',
    dark: false,
    motif: 'bars',
    tokens: {
      bg: '#f5ecdd',
      surface: '#fdf7ec',
      surfaceHi: '#ecdfc8',
      line: '#dccdaf',
      text: '#3a2b1a',
      dim: '#8a7458',
      accent: '#a3552a',
      accentHi: '#8a4520',
      ink: '#fdf7ec',
      coverA: '#d9c39a',
      coverB: '#a98a5d',
      coverText: '#3a2b1a',
      coverDim: '#64513a',
      discA: '#c9b088',
      discB: '#997b4e',
      discText: '#3a2b1a',
      fontDisplay: SLAB,
      displayTracking: '0.02em',
      displayTransform: 'none',
    },
  },
  {
    id: 'jazz',
    label: 'Jazz',
    vibe: 'Late set, low light, a very good band',
    dark: true,
    motif: 'bars',
    tokens: {
      bg: '#101623',
      surface: '#19202f',
      surfaceHi: '#232b3d',
      line: '#323b50',
      text: '#eef0ea',
      dim: '#96a0ae',
      accent: '#c8963e',
      accentHi: '#dcae58',
      ink: '#141a26',
      coverA: '#16203a',
      coverB: '#090d18',
      coverText: '#eef0ea',
      coverDim: '#8b95a6',
      discA: '#1d2842',
      discB: '#0d1322',
      discText: '#dcae58',
      fontDisplay: SERIF,
      displayTracking: '0.03em',
      displayTransform: 'none',
    },
  },
  {
    id: 'classical',
    label: 'Classical',
    vibe: 'A quartet in the corner and candles everywhere',
    dark: false,
    motif: 'rings',
    tokens: {
      bg: '#f8f5ee',
      surface: '#fffdf8',
      surfaceHi: '#efe9db',
      line: '#e0d8c5',
      text: '#2c2418',
      dim: '#7d7260',
      accent: '#8c2f39',
      accentHi: '#72242d',
      ink: '#fffdf8',
      coverA: '#f3eee1',
      coverB: '#ddd2b8',
      coverText: '#2c2418',
      coverDim: '#6f6450',
      discA: '#e8e0cb',
      discB: '#c4b795',
      discText: '#2c2418',
      fontDisplay: SERIF,
      displayTracking: '0.02em',
      displayTransform: 'none',
    },
  },
  {
    id: 'electronic',
    label: 'Electronic',
    vibe: 'The dance floor is the whole point',
    dark: true,
    motif: 'grid',
    tokens: {
      bg: '#0b0e14',
      surface: '#141926',
      surfaceHi: '#1d2436',
      line: '#2b3450',
      text: '#e8f4ff',
      dim: '#8ba0bd',
      accent: '#28d7c4',
      accentHi: '#5aeadb',
      ink: '#08211d',
      coverA: '#101a33',
      coverB: '#05070d',
      coverText: '#5aeadb',
      coverDim: '#6e84a8',
      discA: '#152a4a',
      discB: '#0a1122',
      discText: '#5aeadb',
      fontDisplay: MONO,
      displayTracking: '0.08em',
      displayTransform: 'uppercase',
    },
  },
  {
    id: 'punk',
    label: 'Punk',
    vibe: 'Eloping, but everyone is invited',
    dark: false,
    motif: 'burst',
    tokens: {
      bg: '#f4f2ef',
      surface: '#ffffff',
      surfaceHi: '#e9e6e1',
      line: '#d4d0c9',
      text: '#151312',
      dim: '#6b6660',
      accent: '#e5177b',
      accentHi: '#c01064',
      ink: '#ffffff',
      coverA: '#f5f2ec',
      coverB: '#dcd7ce',
      coverText: '#151312',
      coverDim: '#5c5751',
      discA: '#efece6',
      discB: '#c9c4bb',
      discText: '#151312',
      fontDisplay: CONDENSED,
      displayTracking: '0.04em',
      displayTransform: 'uppercase',
    },
  },
  {
    id: 'disco',
    label: 'Disco',
    vibe: 'A mirror ball over the aisle',
    dark: true,
    motif: 'rings',
    tokens: {
      bg: '#170f22',
      surface: '#221833',
      surfaceHi: '#2e2144',
      line: '#443259',
      text: '#f6effc',
      dim: '#ab9bc2',
      accent: '#e8b8ff',
      accentHi: '#f3d3ff',
      ink: '#241335',
      coverA: '#3a1f5c',
      coverB: '#150b26',
      coverText: '#f6effc',
      coverDim: '#a993c4',
      discA: '#4d2c78',
      discB: '#241239',
      discText: '#f3d3ff',
      fontDisplay: SERIF,
      displayTracking: '0.05em',
      displayTransform: 'uppercase',
    },
  },
]

export const DEFAULT_THEME: ThemeId = 'indie'

export function themeById(id: string | null | undefined): Theme {
  const found = THEMES.find((t) => t.id === id)
  return found ?? THEMES[0]
}

/** The custom property each token writes. Shared vocabulary first, cover tokens after. */
const TOKEN_VARS: Record<keyof ThemeTokens, string> = {
  bg: '--bg',
  surface: '--surface',
  surfaceHi: '--surface-hi',
  line: '--line',
  text: '--text',
  dim: '--dim',
  accent: '--accent',
  accentHi: '--accent-hi',
  ink: '--ink',
  coverA: '--cover-a',
  coverB: '--cover-b',
  coverText: '--cover-text',
  coverDim: '--cover-dim',
  discA: '--disc-a',
  discB: '--disc-b',
  discText: '--disc-text',
  fontDisplay: '--font-display',
  displayTracking: '--display-tracking',
  displayTransform: '--display-transform',
}

/** Writes a theme onto an element (in practice `:root`). Pure DOM, no React. */
export function applyTheme(theme: Theme, root: HTMLElement) {
  for (const key of Object.keys(TOKEN_VARS) as (keyof ThemeTokens)[]) {
    root.style.setProperty(TOKEN_VARS[key], theme.tokens[key])
  }
  root.style.colorScheme = theme.dark ? 'dark' : 'light'
  root.dataset.mixtapeTheme = theme.id
}

export function clearTheme(root: HTMLElement) {
  for (const key of Object.keys(TOKEN_VARS) as (keyof ThemeTokens)[]) {
    root.style.removeProperty(TOKEN_VARS[key])
  }
  root.style.removeProperty('color-scheme')
  delete root.dataset.mixtapeTheme
}
