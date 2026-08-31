/*
 * The whole document a save-the-date is. There is no database: this object is
 * compressed into the share link, and the link is the only place it exists.
 */

export type ThemeId =
  | 'indie'
  | 'rock'
  | 'pop'
  | 'hiphop'
  | 'country'
  | 'jazz'
  | 'classical'
  | 'electronic'
  | 'punk'
  | 'disco'

export interface TravelItem {
  id: string
  heading: string
  body: string
}

export interface FaqItem {
  id: string
  q: string
  a: string
}

export interface SaveTheDate {
  v: 1
  /** The two people getting married, in the order they want to read. */
  names: [string, string]
  /** ISO date, `2027-06-12`. Empty until chosen. */
  date: string
  /** 24h clock, `16:30`, or empty when the time is not set yet. */
  time: string
  venue: string
  city: string
  travel: TravelItem[]
  faqs: FaqItem[]
  /** A link to the playlist, usually Spotify. Empty hides the press-play track. */
  playlist: string
  /** A line under the play button — why this playlist, or what to add to it. */
  note: string
  /** The album title printed on the cover. */
  album: string
  theme: ThemeId
}
