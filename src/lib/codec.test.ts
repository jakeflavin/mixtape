import { describe, expect, it } from 'vitest'
import { decode, encode, readRoute, sanitize, shareUrl, editUrl } from './codec'
import { starterDoc } from './starter'

describe('encode/decode', () => {
  it('round-trips a full document', () => {
    const doc = starterDoc()
    expect(decode(encode(doc))).toEqual(doc)
  })

  it('round-trips unicode names and emoji', () => {
    const doc = { ...starterDoc(), names: ['Zoë', 'André 🎸'] as [string, string] }
    expect(decode(encode(doc))?.names).toEqual(['Zoë', 'André 🎸'])
  })

  it('returns null for an empty blob', () => {
    expect(decode('')).toBeNull()
  })

  it('returns null for garbage', () => {
    expect(decode('not-a-real-blob-%%%')).toBeNull()
    expect(decode('AAAAAAAAAA')).toBeNull()
  })

  it('survives a truncated blob without throwing', () => {
    const blob = encode(starterDoc())
    // Every prefix must either decode to a document or come back null.
    for (const cut of [1, 5, blob.length / 2, blob.length - 1]) {
      expect(() => decode(blob.slice(0, cut))).not.toThrow()
    }
  })
})

describe('sanitize', () => {
  it('fills a hollow object with safe empties', () => {
    const doc = sanitize({})
    expect(doc.names).toEqual(['', ''])
    expect(doc.travel).toEqual([])
    expect(doc.faqs).toEqual([])
    expect(doc.theme).toBe('indie')
  })

  it('drops unknown fields', () => {
    const doc = sanitize({ ...starterDoc(), evil: 'payload' })
    expect('evil' in doc).toBe(false)
  })

  it('falls back to the default theme for an unknown one', () => {
    expect(sanitize({ theme: 'polka' }).theme).toBe('indie')
  })

  it('discards malformed list entries and keeps good ones', () => {
    const doc = sanitize({ travel: [null, 42, { heading: 'Fly', body: 'Albany' }] })
    expect(doc.travel).toHaveLength(1)
    expect(doc.travel[0]?.heading).toBe('Fly')
  })

  it('gives list entries stable ids when the blob lacks them', () => {
    const doc = sanitize({ faqs: [{ q: 'Kids?', a: 'Sure' }] })
    expect(doc.faqs[0]?.id).toBeTruthy()
  })

  it('clamps oversized text', () => {
    const doc = sanitize({ venue: 'x'.repeat(9000) })
    expect(doc.venue.length).toBeLessThanOrEqual(200)
  })
})

describe('urls', () => {
  it('builds a share url carrying theme and blob', () => {
    const doc = { ...starterDoc(), theme: 'jazz' as const }
    const url = new URL(shareUrl(doc, 'https://example.test'))
    expect(url.searchParams.get('t')).toBe('jazz')
    expect(decode(url.searchParams.get('m') ?? '')).toEqual(doc)
  })

  it('edit url reopens the same document in the builder', () => {
    const doc = starterDoc()
    const url = new URL(editUrl(doc, 'https://example.test'))
    const route = readRoute(url.search)
    expect(route.editing).toBe(true)
    expect(route.doc).toEqual(doc)
  })

  it('readRoute treats a corrupt blob as no document', () => {
    expect(readRoute('?m=garbage')).toEqual({ doc: null, editing: false })
  })

  it('readRoute with no params is the builder', () => {
    expect(readRoute('')).toEqual({ doc: null, editing: false })
  })
})
