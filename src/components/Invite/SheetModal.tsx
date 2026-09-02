import { useEffect, useRef } from 'react'
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

  useEffect(() => {
    ref.current?.showModal()
  }, [])

  return (
    <Dialog
      ref={ref}
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
      <div className="modal-sheet">{children}</div>
    </Dialog>
  )
}
