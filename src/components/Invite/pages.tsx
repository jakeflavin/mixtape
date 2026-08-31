import { Play } from 'lucide-react'
import { daysUntil, formatLongDate, formatTime } from '@/lib/format'
import { useQr } from '@/hooks/useQr'
import type { SaveTheDate } from '@/lib/types'

/*
 * The booklet's pages. Each one is plain content — the booklet owns the frame,
 * the carousel and the dots, so a page only says what it says.
 */

export interface PageProps {
  doc: SaveTheDate
}

export function DatePage({ doc }: PageProps) {
  const days = doc.date ? daysUntil(doc.date, new Date()) : null
  const time = formatTime(doc.time)
  const place = [doc.venue, doc.city].filter(Boolean).join(' · ')
  return (
    <>
      <h2 className="page-title">{formatLongDate(doc.date) || 'The date is coming'}</h2>
      {time && <p className="page-lead">{time}</p>}
      {place && <p className="page-body">{place}</p>}
      {days !== null && days >= 0 && (
        <p className="page-pill" role="status">
          {days === 0 ? 'Today. Go get dressed.' : `${days.toLocaleString()} days away`}
        </p>
      )}
      <p className="page-dim">Formal invitation to follow. This is the one that saves the date.</p>
    </>
  )
}

export function TravelPage({ doc }: PageProps) {
  return (
    <>
      <h2 className="page-title">Getting there</h2>
      <ul className="page-list">
        {doc.travel.map((item) => (
          <li key={item.id}>
            <h3 className="page-item-title">{item.heading}</h3>
            <p className="page-body">{item.body}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

export interface FaqPageProps extends PageProps {
  /** The invite's own link, so a guest can hand it to the next guest. */
  url: string
}

export function FaqPage({ doc, url }: FaqPageProps) {
  const qr = useQr(url)
  return (
    <>
      <h2 className="page-title">Good questions</h2>
      <ul className="page-list">
        {doc.faqs.map((item) => (
          <li key={item.id}>
            <h3 className="page-item-title">{item.q}</h3>
            <p className="page-body">{item.a}</p>
          </li>
        ))}
      </ul>
      <figure className="page-qr">
        {qr && <img src={qr} alt="QR code opening this save-the-date" width="112" height="112" />}
        <figcaption>Pass it on — this code opens this invite.</figcaption>
      </figure>
    </>
  )
}

export function PlayPage({ doc }: PageProps) {
  const [a, b] = doc.names
  const both = a && b ? `${a} & ${b}` : a || b || 'the two of us'
  return (
    <>
      <h2 className="page-title">Press play</h2>
      <p className="page-body">
        The record in the tray was burned by {both} — track for track, the story so far.
      </p>
      {doc.note && <p className="page-body">{doc.note}</p>}
      <a className="page-play" href={doc.playlist} target="_blank" rel="noreferrer">
        <Play aria-hidden="true" size={18} />
        <span>Open the playlist</span>
      </a>
      <span className="page-eq" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
    </>
  )
}
