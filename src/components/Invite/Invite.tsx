import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { useGenreTheme } from '@/hooks/useGenreTheme'
import { CoverArt } from './CoverArt'
import { Disc } from './Disc'
import { DatePage, FaqPage, PlayPage, TravelPage } from './pages'
import { SheetModal } from './SheetModal'
import { Scene, OpenCase, Footer } from './Invite.styled'
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

/** Drag past this many px and letting go turns the page. */
const SWIPE_DISTANCE = 60

/** Where a read sheet rests, folded at the binding. Matches .sheet.is-read in the CSS. */
const FLIPPED_DEG = -88

/*
 * The invite a guest opens. There is only ever one case: the open spread —
 * lid, hinge, tray, disc — is mounted from the first frame, folded shut. Shut,
 * a clip shows just the tray half with the cover lying on it and the hinge
 * reading as the spine. Pressing it plays one continuous, class-driven CSS
 * choreography: the cover swings 180° over the hinge (showing its paper back
 * mid-flight) while the case unfolds to full width, and the booklet settles
 * onto the lid as the cover lands. No scene swap, no timers — just is-open.
 *
 * The booklet is a stack of stapled sheets, and moving through it is turning
 * them — a drag lifts the top sheet over its binding, and chevrons beside a
 * printed folio serve anyone who would rather press than flip.
 */
export function Invite({ doc }: InviteProps) {
  const [opened, setOpened] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const reduced = useReducedMotion() ?? false

  useGenreTheme(doc.theme, document.documentElement)

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
      list.push({ id: 'faq', label: 'Good questions', content: <FaqPage doc={doc} /> })
    if (doc.playlist)
      list.push({ id: 'play', label: 'Press play', content: <PlayPage doc={doc} /> })
    return list as [Page, ...Page[]]
  }, [doc])

  const lastIndex = pages.length - 1
  const current = pages[Math.min(pageIndex, lastIndex)] ?? pages[0]

  /*
   * EXPERIMENT (2026-09-02): a small window can cut a sheet off with only a
   * scrollbar to say so. When the open sheet overflows, a More chip appears
   * and opens the page full-height in SheetModal. Ships as one commit; revert
   * that commit to take the whole idea back out.
   */
  const [overflowing, setOverflowing] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const turnTo = (index: number) => {
    setExpanded(false)
    setPageIndex(Math.max(0, Math.min(index, lastIndex)))
  }

  useEffect(() => {
    // Deferred a frame so the measurement reads settled layout.
    const measure = () => {
      const sheet = document.querySelector<HTMLElement>('.sheet[aria-hidden="false"]')
      setOverflowing(sheet !== null && sheet.scrollHeight > sheet.clientHeight + 4)
    }
    const frame = requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', measure)
    }
  }, [opened, current])

  useEffect(() => {
    // Arrow keys page the booklet, but not underneath the expanded sheet.
    if (!opened || expanded) return
    const handleArrows = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') setPageIndex((i) => Math.min(i + 1, lastIndex))
      if (event.key === 'ArrowLeft') setPageIndex((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', handleArrows)
    return () => window.removeEventListener('keydown', handleArrows)
  }, [opened, expanded, lastIndex])

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
  return (
    <Scene>
      <OpenCase
        className={opened ? 'is-open' : ''}
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.5 }}
        aria-label="Save-the-date booklet"
      >
        {/* Everything plastic lives inside the clip, which is what folds and
            unfolds the case. The booklet sits outside it so its corners and
            shadow can overhang the shell. */}
        <div className="case-clip">
          <div className="case-shell">
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
                <Disc names={doc.names} album={doc.album} spinning={opened} />
              </div>
              <span className="tray-clip" />
            </div>
            {/* The front cover: art on one face, its paper back on the other.
                Opening swings it over the hinge into the lid. */}
            <button
              type="button"
              className="case-cover"
              aria-label="Open the case"
              disabled={opened}
              tabIndex={opened ? -1 : 0}
              onClick={() => setOpened(true)}
            >
              <span className="cover-front">
                <CoverArt doc={doc} />
                <span className="case-gloss" aria-hidden="true" />
              </span>
              <span className="cover-back" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="booklet" aria-roledescription="carousel" aria-hidden={!opened}>
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
          </div>
          {opened && overflowing && current.id !== 'cover' && (
            <button type="button" className="booklet-more" onClick={() => setExpanded(true)}>
              <Maximize2 size={13} aria-hidden="true" />
              <span>More</span>
            </button>
          )}
        </div>
        {expanded && (
          <SheetModal label={current.label} onClose={() => setExpanded(false)}>
            {current.content}
          </SheetModal>
        )}
        <nav className="booklet-nav" aria-label="Booklet pages" aria-hidden={!opened}>
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
      </OpenCase>
      <p className={opened ? 'case-hint is-open' : 'case-hint'}>Press to open</p>
      <Footer>
        Made with Mixtape. <a href={import.meta.env.BASE_URL}>Make one for your own wedding</a>
      </Footer>
    </Scene>
  )
}
