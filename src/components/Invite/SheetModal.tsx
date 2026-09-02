import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Dialog } from './SheetModal.styled'
import type { ReactNode } from 'react'

export interface SheetModalProps {
  /** The page's name, printed where the track eyebrow would be. */
  label: string
  onClose: () => void
  children: ReactNode
}

/*
 * EXPERIMENT (2026-09-02): a sheet whose content overflows its little window
 * can be opened full-height here. The whole feature — this component, its
 * styles, and the More chip in Invite.tsx — ships as one commit so it can be
 * reverted in one.
 *
 * A native dialog: focus trapping, ::backdrop and the top layer come free.
 * Escape arrives as `cancel`, default prevented, and the parent's state
 * decides whether this is mounted.
 */
export function SheetModal({ label, onClose, children }: SheetModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  // Nothing in a dialog says it scrolls until you try. The same printed fade
  // the booklet uses says it here, and goes when the end is reached.
  const [more, setMore] = useState(false)

  useEffect(() => {
    ref.current?.showModal()
  }, [])

  useEffect(() => {
    const sheet = sheetRef.current
    if (!sheet) return
    const measure = () => {
      const left = sheet.scrollHeight - sheet.clientHeight - sheet.scrollTop
      setMore(left > 8)
    }
    // A timer rather than rAF: embedded webviews starve rAF, and a starved
    // frame here means the fade never appears.
    const timer = window.setTimeout(measure, 60)
    sheet.addEventListener('scroll', measure)
    window.addEventListener('resize', measure)
    return () => {
      window.clearTimeout(timer)
      sheet.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [children])

  return (
    <Dialog
      ref={ref}
      className={more ? 'has-more' : ''}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        // Only the backdrop is the dialog element itself.
        if (event.target === ref.current) onClose()
      }}
    >
      {/* The page brings its own title, so the chrome is just the close —
          anchored to the frame, clear of the scrolling paper. */}
      <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
        <X size={18} aria-hidden="true" />
      </button>
      <div className="modal-sheet" ref={sheetRef}>
        {children}
      </div>
    </Dialog>
  )
}
