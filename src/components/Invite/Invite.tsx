import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { shareUrl } from '@/lib/codec'
import { useGenreTheme } from '@/hooks/useGenreTheme'
import { CoverArt } from './CoverArt'
import { Disc } from './Disc'
import { DatePage, FaqPage, PlayPage, TravelPage } from './pages'
import { Scene, ClosedWrap, ClosedCase, OpenCase, Footer } from './Invite.styled'
import type { PointerEvent as ReactPointerEvent, MouseEvent as ReactMouseEvent } from 'react'
import type { SaveTheDate } from '@/lib/types'
import type { ReactNode } from 'react'

export interface InviteProps {
  doc: SaveTheDate
}

interface Page {
  id: string
  label: string
  content: ReactNode
}

/** How long the lid takes to swing open. */
const OPEN_MS = 800

/** Drag past this many px and letting go turns the page. */
const SWIPE_DISTANCE = 60

/** Where a read sheet rests, folded at the binding. Matches .sheet.is-read in the CSS. */
const FLIPPED_DEG = -88

/*
 * The invite a guest opens: a closed jewel case, then the same case open — the
 * booklet on one side, the disc in its moulded tray on the other, a hinge
 * between them. It never stops being the album: on a phone the spread stacks
 * vertically instead of losing the tray. The booklet is a stack of stapled
 * sheets, and moving through it is turning them — a drag lifts the top sheet
 * over its binding, and chevrons beside a printed folio serve anyone who
 * would rather press than flip.
 */
export function Invite({ doc }: InviteProps) {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open'>('closed')
  const [pageIndex, setPageIndex] = useState(0)
  const reduced = useReducedMotion() ?? false

  useGenreTheme(doc.theme, document.documentElement)

  const url = useMemo(() => shareUrl(doc), [doc])

  const pages = useMemo<[Page, ...Page[]]>(() => {
    const list: Page[] = [
      // A booklet starts at its cover — the album art again, printed on paper —
      // so the first flip is opening the booklet itself.
      { id: 'cover', label: 'Cover', content: <CoverArt doc={doc} /> },
      { id: 'date', label: 'The date', content: <DatePage doc={doc} /> },
    ]
    if (doc.travel.length > 0)
      list.push({ id: 'travel', label: 'Getting there', content: <TravelPage doc={doc} /> })
    if (doc.faqs.length > 0)
      list.push({ id: 'faq', label: 'Good questions', content: <FaqPage doc={doc} url={url} /> })
    if (doc.playlist)
      list.push({ id: 'play', label: 'Press play', content: <PlayPage doc={doc} /> })
    return list as [Page, ...Page[]]
  }, [doc, url])

  const lastIndex = pages.length - 1
  const turnTo = (index: number) => setPageIndex(Math.max(0, Math.min(index, lastIndex)))

  useEffect(() => {
    if (phase !== 'open') return
    const handleArrows = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') setPageIndex((i) => Math.min(i + 1, lastIndex))
      if (event.key === 'ArrowLeft') setPageIndex((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', handleArrows)
    return () => window.removeEventListener('keydown', handleArrows)
  }, [phase, lastIndex])

  const open = () => setPhase(reduced ? 'open' : 'opening')

  // The lid swing runs for a fixed time, so a timer is the reliable end of it —
  // motion's onAnimationComplete is tied to one animation instance and a
  // re-render mid-swing (the button disabling) can orphan it.
  useEffect(() => {
    if (phase !== 'opening') return
    const timer = window.setTimeout(() => setPhase('open'), OPEN_MS + 50)
    return () => window.clearTimeout(timer)
  }, [phase])

  /*
   * The page turn is handled by hand with pointer events rather than motion's
   * drag gesture, which never engaged here (its pan session and an animated
   * transform target fight over the same property). Down/move/up on the
   * window is enough: the top sheet tilts with the finger, and release either
   * completes the flip or lets the sheet fall back.
   */
  const [drag, setDrag] = useState<{ dx: number; width: number } | null>(null)
  const dragFrom = useRef(0)
  const swallowClick = useRef(false)

  /** How far a held sheet has lifted, in degrees — null when the finger is not on it. */
  const sheetRotation = (index: number): number | null => {
    if (drag === null) return null
    // Dragging left lifts the current sheet toward its flipped position…
    if (drag.dx < 0 && index === pageIndex) return Math.max(-80, (drag.dx / drag.width) * 150)
    // …dragging right lowers the last-read sheet back down.
    if (drag.dx > 0 && index === pageIndex - 1)
      return Math.min(0, FLIPPED_DEG + (drag.dx / drag.width) * 150)
    return null
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    dragFrom.current = event.clientX
    setDrag({ dx: 0, width: event.currentTarget.getBoundingClientRect().width || 360 })
  }

  const handlePointerMove = (event: ReactPointerEvent) => {
    if (drag === null) return
    let dx = event.clientX - dragFrom.current
    // The covers resist past the first and last page, like real paper would.
    if ((pageIndex === 0 && dx > 0) || (pageIndex === lastIndex && dx < 0)) dx /= 3
    setDrag({ dx, width: drag.width })
  }

  const handlePointerEnd = () => {
    if (drag === null) return
    if (Math.abs(drag.dx) > 10) swallowClick.current = true
    setDrag(null)
    if (drag.dx < -SWIPE_DISTANCE) turnTo(pageIndex + 1)
    else if (drag.dx > SWIPE_DISTANCE) turnTo(pageIndex - 1)
  }

  // A release at the end of a swipe would otherwise also "click" whatever the
  // finger happened to be over — usually the play button.
  const handleClickCapture = (event: ReactMouseEvent) => {
    if (!swallowClick.current) return
    swallowClick.current = false
    event.preventDefault()
    event.stopPropagation()
  }

  /*
   * The two scenes swap on a plain conditional with enter-only animations.
   * AnimatePresence is deliberately absent: its exit choreography relies on
   * completion callbacks that React 19's StrictMode double-mount orphans, and
   * a swap that waits on one freezes the whole invite. An instant unmount
   * after the lid has already swung is not a visible loss.
   */
  return (
    <Scene>
      {phase !== 'open' ? (
        <ClosedWrap
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.5 }}
        >
          <ClosedCase
            type="button"
            onClick={open}
            aria-label="Open the case"
            disabled={phase === 'opening'}
          >
            <span className="case-spine" aria-hidden="true" />
            <motion.span
              className="case-face"
              animate={phase === 'opening' ? { rotateY: -104, opacity: 0.4 } : { rotateY: 0 }}
              transition={{ duration: OPEN_MS / 1000, ease: [0.6, 0, 0.2, 1] }}
            >
              <CoverArt doc={doc} />
              <span className="case-gloss" aria-hidden="true" />
            </motion.span>
            <span className="case-under" aria-hidden="true">
              <Disc names={doc.names} album={doc.album} spinning={false} />
            </span>
          </ClosedCase>
          <p className="case-hint">Press to open</p>
        </ClosedWrap>
      ) : (
        <OpenCase
          initial={reduced ? false : { opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.45, ease: 'easeOut' }}
          aria-label="Save-the-date booklet"
        >
          <div className="case-shell">
            {/* The case is only a case: an empty lid the booklet came out of,
                the hinge, and the tray holding the disc. The booklet is its
                own object, resting on the open case slightly askew. */}
            <div className="panel lid" aria-hidden="true">
              <span className="lid-recess" />
              <span className="lid-tab is-top" />
              <span className="lid-tab is-bottom" />
            </div>
            <div className="case-hinge" aria-hidden="true">
              <i />
              <i />
            </div>
            <div className="panel tray" aria-hidden="true">
              <div className="tray-recess">
                <Disc names={doc.names} album={doc.album} spinning />
              </div>
              <span className="tray-clip" />
            </div>
            <div className="booklet" aria-roledescription="carousel">
              <div
                className="booklet-window"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
                onPointerLeave={handlePointerEnd}
                onClickCapture={handleClickCapture}
              >
                {/* A stapled booklet: every page is a sheet in a stack, and a
                    turn lifts the top sheet over its binding. Read sheets sit
                    flipped at the spine; a class change is the whole turn, so
                    nothing waits on an animation callback. */}
                <div className="booklet-sheets">
                  {pages.map((page, index) => {
                    const held = sheetRotation(index)
                    const read = index < pageIndex
                    const depth = Math.max(0, Math.min(index - pageIndex, 3))
                    return (
                      <section
                        key={page.id}
                        className={[
                          'sheet',
                          page.id === 'cover' ? 'is-cover' : '',
                          read ? 'is-read' : '',
                          held !== null ? 'is-held' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        aria-label={page.label}
                        aria-hidden={index !== pageIndex}
                        style={{
                          zIndex: pages.length - index,
                          transform:
                            held !== null
                              ? `rotateY(${held}deg)`
                              : read
                                ? undefined
                                : `translateX(${depth * 2}px)`,
                          opacity: held !== null ? 1 : undefined,
                        }}
                      >
                        {page.id !== 'cover' && (
                          <p className="page-eyebrow">Track {String(index).padStart(2, '0')}</p>
                        )}
                        {page.content}
                      </section>
                    )
                  })}
                </div>
                <nav className="booklet-nav" aria-label="Booklet pages">
                  <button
                    type="button"
                    className="booklet-turn is-prev"
                    aria-label="Previous page"
                    disabled={pageIndex === 0}
                    onClick={() => turnTo(pageIndex - 1)}
                  >
                    <ChevronLeft size={16} aria-hidden="true" />
                  </button>
                  <span className="booklet-folio">
                    {String(pageIndex).padStart(2, '0')} / {String(lastIndex).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    className="booklet-turn is-next"
                    aria-label="Next page"
                    disabled={pageIndex === lastIndex}
                    onClick={() => turnTo(pageIndex + 1)}
                  >
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </OpenCase>
      )}
      <Footer>
        Made with Mixtape. <a href={import.meta.env.BASE_URL}>Make one for your own wedding</a>
      </Footer>
    </Scene>
  )
}
