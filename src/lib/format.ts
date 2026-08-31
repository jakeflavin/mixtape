/*
 * Everything a guest reads goes through Intl with no locale passed, so the
 * date reads the way their own device writes dates. Formatters are built once
 * at module scope; constructing one costs far more than using one.
 */

const longDate = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const shortDate = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const clock = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })

/** `2027-06-12` parsed as a local date. Date-only strings parse as UTC, which shifts the day west of Greenwich — so the parts are read out by hand. */
export function parseDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return null
  const [, year, month, day] = match
  if (year === undefined || month === undefined || day === undefined) return null
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  // new Date rolls an impossible date over (month 13 becomes January), so the
  // parts have to survive the round trip to count.
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  )
    return null
  return date
}

export function formatLongDate(iso: string): string {
  const date = parseDate(iso)
  return date ? longDate.format(date) : ''
}

export function formatShortDate(iso: string): string {
  const date = parseDate(iso)
  return date ? shortDate.format(date) : ''
}

/** `16:30` in the reader's own clock convention. */
export function formatTime(time: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time)
  if (!match) return ''
  const [, hours, minutes] = match
  if (hours === undefined || minutes === undefined) return ''
  const h = Number(hours)
  const m = Number(minutes)
  if (h > 23 || m > 59) return ''
  return clock.format(new Date(2000, 0, 1, h, m))
}

/** Whole days from `now` until the date, negative once it has passed. */
export function daysUntil(iso: string, now: Date): number | null {
  const date = parseDate(iso)
  if (!date) return null
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((date.getTime() - start.getTime()) / 86_400_000)
}

/** The year alone, for the album cover's small print. */
export function coverYear(iso: string): string {
  const date = parseDate(iso)
  return date ? String(date.getFullYear()) : ''
}
