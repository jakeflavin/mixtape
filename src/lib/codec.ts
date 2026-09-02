import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import type { FaqItem, SaveTheDate, ThemeId, TravelItem } from './types'
import { THEMES, DEFAULT_THEME } from './themes'

/*
 * The link is the document. A save-the-date is JSON, compressed with lz-string
 * into a URL-safe blob, carried in the `m` query parameter. The theme id rides
 * separately as `t` so index.html can paint the right ground before any of
 * this code runs.
 *
 * Everything read back out of a link is treated as hostile: a truncated paste,
 * an old version, or someone editing the blob by hand must come back as null
 * or as a well-formed document, never as a crash mid-render.
 */

const MAX_TEXT = 4000

function cleanString(value: unknown, max = MAX_TEXT): string {
  return typeof value === 'string' ? value.slice(0, max) : ''
}

/*
 * Artwork is either a data URL the builder shrank, or an https URL. Anything
 * else — javascript:, blob:, http:, or an image too big to be a sane link —
 * is dropped whole: clamping mid-base64 would keep a broken image.
 */
const MAX_DATA_IMAGE = 160_000

function cleanImage(value: unknown): string {
  if (typeof value !== 'string') return ''
  if (value.startsWith('data:image/')) return value.length <= MAX_DATA_IMAGE ? value : ''
  if (value.startsWith('https://')) return value.length <= 2000 ? value : ''
  return ''
}

function cleanTheme(value: unknown): ThemeId {
  return THEMES.some((t) => t.id === value) ? (value as ThemeId) : DEFAULT_THEME
}

function cleanTravel(value: unknown): TravelItem[] {
  if (!Array.isArray(value)) return []
  return value.slice(0, 20).flatMap((item, index) => {
    if (typeof item !== 'object' || item === null) return []
    const record = item as Record<string, unknown>
    return [
      {
        id: cleanString(record.id, 40) || `travel-${index}`,
        heading: cleanString(record.heading, 200),
        body: cleanString(record.body),
      },
    ]
  })
}

function cleanFaqs(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return []
  return value.slice(0, 30).flatMap((item, index) => {
    if (typeof item !== 'object' || item === null) return []
    const record = item as Record<string, unknown>
    return [
      {
        id: cleanString(record.id, 40) || `faq-${index}`,
        q: cleanString(record.q, 300),
        a: cleanString(record.a),
      },
    ]
  })
}

function cleanNames(value: unknown): [string, string] {
  const pair = Array.isArray(value) ? value : []
  return [cleanString(pair[0], 80), cleanString(pair[1], 80)]
}

/** Coerces anything into a well-formed document. Unknown fields are dropped. */
export function sanitize(value: unknown): SaveTheDate {
  const record =
    typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {}
  return {
    v: 1,
    names: cleanNames(record.names),
    date: cleanString(record.date, 10),
    time: cleanString(record.time, 5),
    venue: cleanString(record.venue, 200),
    city: cleanString(record.city, 200),
    dateNote: cleanString(record.dateNote, 300),
    travel: cleanTravel(record.travel),
    faqs: cleanFaqs(record.faqs),
    playlist: cleanString(record.playlist, 500),
    note: cleanString(record.note, 500),
    website: cleanString(record.website, 500),
    album: cleanString(record.album, 120),
    theme: cleanTheme(record.theme),
    coverImage: cleanImage(record.coverImage),
    discImage: cleanImage(record.discImage),
  }
}

export function encode(doc: SaveTheDate): string {
  return compressToEncodedURIComponent(JSON.stringify(doc))
}

export function decode(blob: string): SaveTheDate | null {
  if (!blob) return null
  let json: string | null
  try {
    json = decompressFromEncodedURIComponent(blob)
  } catch {
    return null
  }
  if (!json) return null
  try {
    return sanitize(JSON.parse(json))
  } catch {
    return null
  }
}

/**
 * The invite link for a document, absolute so it can be copied or QR'd.
 *
 * The document rides in the URL fragment, not the query string: fragments
 * never reach a server, and a document carrying artwork is tens of kilobytes
 * — far past the request-line limits that answer a long query with a 431.
 */
export function shareUrl(doc: SaveTheDate, origin = window.location.origin): string {
  const base = import.meta.env.BASE_URL
  return `${origin}${base}#t=${doc.theme}&m=${encode(doc)}`
}

/** The same document reopened in the builder. */
export function editUrl(doc: SaveTheDate, origin = window.location.origin): string {
  return `${shareUrl(doc, origin)}&edit=1`
}

export interface RouteState {
  doc: SaveTheDate | null
  editing: boolean
}

/** Fragment first; the query string still reads for links shared before the move. */
export function readRoute(search: string, hash = ''): RouteState {
  const query = new URLSearchParams(search)
  const fragment = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash)
  const blob = fragment.get('m') ?? query.get('m')
  return {
    doc: blob ? decode(blob) : null,
    editing: (fragment.get('edit') ?? query.get('edit')) === '1',
  }
}
