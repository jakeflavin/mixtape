import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Check, Copy, ExternalLink } from 'lucide-react'
import { editUrl, shareUrl } from '@/lib/codec'
import { formatLongDate } from '@/lib/format'
import { useQr } from '@/hooks/useQr'
import { Panel } from './SharePanel.styled'
import type { SaveTheDate } from '@/lib/types'

export interface SharePanelProps {
  doc: SaveTheDate
}

type CopyTarget = 'guest' | 'edit' | null

/** A QR code at error-correction level M holds 2,331 bytes; stop short of it. */
const QR_LIMIT = 2300

/** The link's weight in the terms a person shares it in. */
function linkSize(length: number): string {
  return length < 1500 ? `${length} characters` : `${Math.round(length / 1024)} KB`
}

/*
 * The moment the app exists for. Two links come out: the guest link, which is
 * the invite, and the edit link, which is the same document reopened in this
 * builder. There is nothing else to save — losing both links is losing the
 * invite, and the panel says so out loud.
 */
export function SharePanel({ doc }: SharePanelProps) {
  const guest = useMemo(() => shareUrl(doc), [doc])
  const edit = useMemo(() => editUrl(doc), [doc])
  // The largest a QR code can hold at error-correction level M is 2,331
  // characters — past that the encoder throws and nothing renders. Gate on
  // the real ceiling, not a round number above it, or the code disappears
  // with nothing said in the window between the two.
  const fitsQr = guest.length <= QR_LIMIT
  const { src: qr, failed: qrFailed } = useQr(fitsQr ? guest : '')
  const noQr = !fitsQr || qrFailed
  const [copied, setCopied] = useState<CopyTarget>(null)
  // The one thing a guest cannot do without. An invite can ship without it —
  // the couple may not know it yet — but not without being told.
  const hasDate = formatLongDate(doc.date) !== ''

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(null), 1600)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copy = (target: Exclude<CopyTarget, null>, value: string) => {
    navigator.clipboard.writeText(value).then(
      () => setCopied(target),
      () => {
        // Clipboard refused (http, permissions): the input is selectable instead.
      },
    )
  }

  return (
    <Panel aria-label="Share">
      <h2>Share it</h2>
      <div className="share-row">
        <label htmlFor="share-guest">Guest link</label>
        <div className="share-line">
          <input
            id="share-guest"
            type="text"
            readOnly
            value={guest}
            onFocus={(e) => e.target.select()}
          />
          <button type="button" onClick={() => copy('guest', guest)}>
            {copied === 'guest' ? (
              <Check size={16} aria-hidden="true" />
            ) : (
              <Copy size={16} aria-hidden="true" />
            )}
            <span>{copied === 'guest' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <p className="share-hint">
          Send this one to everyone. It opens the invite.{' '}
          <span className="share-size">
            {linkSize(guest.length)}
            {guest.length > 4000 ? ' — fine to paste anywhere, too long for a text message.' : '.'}
          </span>
        </p>
      </div>
      <div className="share-row">
        <label htmlFor="share-edit">Edit link</label>
        <div className="share-line">
          <input
            id="share-edit"
            type="text"
            readOnly
            value={edit}
            onFocus={(e) => e.target.select()}
          />
          <button type="button" onClick={() => copy('edit', edit)}>
            {copied === 'edit' ? (
              <Check size={16} aria-hidden="true" />
            ) : (
              <Copy size={16} aria-hidden="true" />
            )}
            <span>{copied === 'edit' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <p className="share-hint">
          Keep this one. The link is the whole invite — nothing is stored anywhere else, so this is
          how you change it later.
        </p>
      </div>
      {!hasDate && (
        <p className="share-warning">
          <AlertTriangle size={15} aria-hidden="true" />
          <span>
            There is no date in this one yet, so the booklet a guest opens will be almost empty.
            Fill in the day before you send it.
          </span>
        </p>
      )}
      <div className="share-foot">
        {qr && (
          <figure className="share-qr">
            <img src={qr} alt="QR code opening the guest link" width="176" height="176" />
            <figcaption>
              The same guest link, for anything printed. Print it 60mm or wider.
            </figcaption>
          </figure>
        )}
        {noQr && (
          <p className="share-hint">
            This link is too long for a QR code — that is what carrying your own photos costs. It
            still works everywhere a link can be pasted.
          </p>
        )}
        <a className="share-open" href={guest} target="_blank" rel="noreferrer">
          <ExternalLink size={16} aria-hidden="true" />
          <span>Open the invite</span>
        </a>
      </div>
    </Panel>
  )
}
