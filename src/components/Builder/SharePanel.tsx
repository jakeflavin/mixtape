import { useEffect, useMemo, useState } from 'react'
import { Check, Copy, ExternalLink } from 'lucide-react'
import { editUrl, shareUrl } from '@/lib/codec'
import { useQr } from '@/hooks/useQr'
import { Panel } from './SharePanel.styled'
import type { SaveTheDate } from '@/lib/types'

export interface SharePanelProps {
  doc: SaveTheDate
}

type CopyTarget = 'guest' | 'edit' | null

/*
 * The moment the app exists for. Two links come out: the guest link, which is
 * the invite, and the edit link, which is the same document reopened in this
 * builder. There is nothing else to save — losing both links is losing the
 * invite, and the panel says so out loud.
 */
export function SharePanel({ doc }: SharePanelProps) {
  const guest = useMemo(() => shareUrl(doc), [doc])
  const edit = useMemo(() => editUrl(doc), [doc])
  // A QR code tops out around 3KB, and links carrying artwork are far past
  // that — the hook is only fed a link a code can actually hold.
  const fitsQr = guest.length <= 2500
  const qr = useQr(fitsQr ? guest : '')
  const [copied, setCopied] = useState<CopyTarget>(null)

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
        <p className="share-hint">Send this one to everyone. It opens the invite.</p>
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
      <div className="share-foot">
        {fitsQr && qr && (
          <figure className="share-qr">
            <img src={qr} alt="QR code opening the guest link" width="120" height="120" />
            <figcaption>The same guest link, for anything printed.</figcaption>
          </figure>
        )}
        {!fitsQr && (
          <p className="share-hint">
            With your own photos aboard, the link is too long for a QR code. It still works
            everywhere a link can be pasted.
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
