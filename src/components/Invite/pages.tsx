import { Play } from 'lucide-react'
import { formatLongDate, formatTime } from '@/lib/format'
import { useQr } from '@/hooks/useQr'
import type { SaveTheDate } from '@/lib/types'

/*
 * The booklet's pages. Each one is plain content — the booklet owns the frame,
 * the flips and the folio, so a page only says what it says. Nothing here is
 * generated copy: every line a guest reads was typed by the couple, and a
 * field left empty simply does not print.
 */

export interface PageProps {
  doc: SaveTheDate
}

export function DatePage({ doc }: PageProps) {
  const time = formatTime(doc.time)
  const place = [doc.venue, doc.city].filter(Boolean).join(' · ')
  return (
    <>
      <h2 className="page-title">{formatLongDate(doc.date) || 'The date is coming'}</h2>
      {time && <p className="page-caps">{time}</p>}
      {place && <p className="page-caps is-dim">{place}</p>}
      {doc.dateNote && <p className="page-note">{doc.dateNote}</p>}
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

export function FaqPage({ doc }: PageProps) {
  // With no website there is nothing to encode; the hook returns null and the
  // block below never prints.
  const { src: qr } = useQr(doc.website)
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
      {doc.website && qr && (
        <a className="page-qr" href={doc.website} target="_blank" rel="noreferrer">
          <img src={qr} alt={`QR code opening ${doc.website}`} width="112" height="112" />
          <span className="page-qr-caption">Everything else is on our website.</span>
        </a>
      )}
    </>
  )
}

export function PlayPage({ doc }: PageProps) {
  return (
    <>
      <h2 className="page-title">Press play</h2>
      {doc.note && <p className="page-note">{doc.note}</p>}
      <a className="page-play" href={doc.playlist} target="_blank" rel="noreferrer">
        <Play aria-hidden="true" size={18} />
        <span>Open the playlist</span>
      </a>
    </>
  )
}
