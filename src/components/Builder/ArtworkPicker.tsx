import { useRef, useState } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'
import { shrinkImage } from '@/lib/image'
import { Wrap } from './ArtworkPicker.styled'
import type { ChangeEvent } from 'react'

export interface ArtworkPickerProps {
  /** What this slot prints on — "Album cover" or "The disc". */
  label: string
  /** The slot's current artwork; empty when the theme is drawing it. */
  value: string
  /** The disc slot shows its preview clipped round, like the print itself. */
  round?: boolean
  onChange: (dataUrl: string) => void
}

/*
 * One artwork slot. A picked photo is shrunk on a canvas until it fits inside
 * the link — the link is the document, so there is nowhere else for it to
 * live — and stored as a data URL on the document.
 */
export function ArtworkPicker({ label, value, round = false, onChange }: ArtworkPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  const handlePick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setBusy(true)
    shrinkImage(file).then(
      (dataUrl) => {
        setBusy(false)
        onChange(dataUrl)
      },
      () => {
        // Not an image the browser can decode: leave the slot as it was.
        setBusy(false)
      },
    )
  }

  return (
    <Wrap className={round ? 'is-round' : ''}>
      <span className="art-label">{label}</span>
      {value ? (
        <span className="art-preview">
          <img src={value} alt={`${label} artwork`} />
          <button
            type="button"
            className="art-remove"
            aria-label={`Remove ${label.toLowerCase()} artwork`}
            onClick={() => onChange('')}
          >
            <Trash2 size={14} aria-hidden="true" />
          </button>
        </span>
      ) : (
        <button
          type="button"
          className="art-add"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus size={16} aria-hidden="true" />
          <span>{busy ? 'Shrinking…' : 'Add a photo'}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="art-input"
        aria-label={`Choose ${label.toLowerCase()} artwork`}
        onChange={handlePick}
      />
    </Wrap>
  )
}
