import { describe, expect, it } from 'vitest'
import { coverYear, daysUntil, formatLongDate, formatTime, parseDate } from './format'

describe('parseDate', () => {
  it('parses as a local date, not UTC', () => {
    const date = parseDate('2027-06-12')
    expect(date?.getFullYear()).toBe(2027)
    expect(date?.getMonth()).toBe(5)
    expect(date?.getDate()).toBe(12) // new Date('2027-06-12') would be the 11th west of Greenwich
  })

  it('rejects things that are not dates', () => {
    expect(parseDate('')).toBeNull()
    expect(parseDate('June 12')).toBeNull()
    expect(parseDate('2027-13-40')).toBeNull()
  })
})

describe('formatLongDate', () => {
  it('agrees with Intl for the runner, whatever its locale', () => {
    const expected = new Intl.DateTimeFormat(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(2027, 5, 12))
    expect(formatLongDate('2027-06-12')).toBe(expected)
  })

  it('is empty for an unset date', () => {
    expect(formatLongDate('')).toBe('')
  })
})

describe('formatTime', () => {
  it('agrees with Intl for the runner', () => {
    const expected = new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(2000, 0, 1, 16, 30))
    expect(formatTime('16:30')).toBe(expected)
  })

  it('rejects impossible clocks', () => {
    expect(formatTime('25:00')).toBe('')
    expect(formatTime('12:75')).toBe('')
    expect(formatTime('')).toBe('')
  })
})

describe('daysUntil', () => {
  it('counts whole days regardless of the hour', () => {
    expect(daysUntil('2027-06-12', new Date(2027, 5, 10, 23, 59))).toBe(2)
    expect(daysUntil('2027-06-12', new Date(2027, 5, 12, 0, 1))).toBe(0)
  })

  it('goes negative after the day', () => {
    expect(daysUntil('2027-06-12', new Date(2027, 5, 14))).toBe(-2)
  })

  it('is null when no date is set', () => {
    expect(daysUntil('', new Date())).toBeNull()
  })
})

describe('coverYear', () => {
  it('reads the year for the cover small print', () => {
    expect(coverYear('2027-06-12')).toBe('2027')
    expect(coverYear('')).toBe('')
  })
})
