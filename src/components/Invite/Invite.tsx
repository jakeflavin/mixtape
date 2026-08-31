import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { shareUrl } from '@/lib/codec'
import { useGenreTheme } from '@/hooks/useGenreTheme'
import { CoverArt } from './CoverArt'
import { Disc } from './Disc'
import { DatePage, FaqPage, PlayPage, RecordPage, TravelPage } from './pages'
import { Scene, ClosedWrap, ClosedCase, OpenCase, Tracklist, Footer } from './Invite.styled'
import type { SaveTheDate } from '@/lib/types'
import type { ReactNode } from 'react'

export interface InviteProps {
  doc: SaveTheDate
}

interface Track {
  id: string
  title: string
  page: ReactNode
}

/** How long the lid takes to swing open. */
const OPEN_MS = 800

/*
 * The invite a guest opens: a closed jewel case, then an open one — booklet on
 * the left, disc in the tray on the right, pages picked from a tracklist. On a
 * phone the tray folds away and the record becomes one of the pages instead.
 */
export function Invite({ doc }: InviteProps) {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open'>('closed')
  const [trackIndex, setTrackIndex] = useState(0)
  const reduced = useReducedMotion() ?? false

  useGenreTheme(doc.theme, document.documentElement)

  const url = useMemo(() => shareUrl(doc), [doc])

  const tracks = useMemo<[Track, ...Track[]]>(() => {
    const list: Track[] = [{ id: 'date', title: 'The date', page: <DatePage doc={doc} /> }]
    if (doc.travel.length > 0)
      list.push({ id: 'travel', title: 'Getting there', page: <TravelPage doc={doc} /> })
    if (doc.faqs.length > 0)
      list.push({ id: 'faq', title: 'Good questions', page: <FaqPage doc={doc} url={url} /> })
    list.push({ id: 'record', title: 'The record', page: <RecordPage doc={doc} /> })
    if (doc.playlist) list.push({ id: 'play', title: 'Press play', page: <PlayPage doc={doc} /> })
    return list as [Track, ...Track[]]
  }, [doc, url])

  const current = tracks[trackIndex] ?? tracks[0]

  useEffect(() => {
    if (phase !== 'open') return
    const handleArrows = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight')
        setTrackIndex((index) => Math.min(index + 1, tracks.length - 1))
      if (event.key === 'ArrowLeft') setTrackIndex((index) => Math.max(index - 1, 0))
    }
    window.addEventListener('keydown', handleArrows)
    return () => window.removeEventListener('keydown', handleArrows)
  }, [phase, tracks.length])

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
          <div className="case-open-body">
            <div className="panel booklet">
              {/* The key remounts the page, so switching tracks replays the
                  enter animation — the old page just leaves. */}
              <motion.div
                key={current.id}
                className="page"
                initial={reduced ? false : { opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: reduced ? 0 : 0.28, ease: 'easeOut' }}
              >
                <p className="page-eyebrow">Track {String(trackIndex + 1).padStart(2, '0')}</p>
                {current.page}
              </motion.div>
            </div>
            <div className="panel tray" aria-hidden="true">
              <Disc names={doc.names} album={doc.album} spinning />
            </div>
          </div>
          <Tracklist aria-label="Booklet pages">
            <ol>
              {tracks.map((track, index) => (
                <li key={track.id}>
                  <button
                    type="button"
                    className={index === trackIndex ? 'track is-active' : 'track'}
                    aria-current={index === trackIndex ? 'page' : undefined}
                    onClick={() => setTrackIndex(index)}
                  >
                    <span className="track-number">{String(index + 1).padStart(2, '0')}</span>
                    <span>{track.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </Tracklist>
        </OpenCase>
      )}
      <Footer>
        Made with Mixtape. <a href={import.meta.env.BASE_URL}>Make one for your own wedding</a>
      </Footer>
    </Scene>
  )
}
