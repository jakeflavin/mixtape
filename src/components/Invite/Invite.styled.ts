import styled from 'styled-components'
import { motion } from 'motion/react'

export const Scene = styled.main`
  min-height: 100dvh;
  /* The open case's far half is allowed to run off screen on phones; clipping
   * here keeps that from becoming a horizontal scrollbar. */
  overflow-x: clip;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 24px 16px calc(16px + env(safe-area-inset-bottom));

  .case-hint {
    font-size: var(--font-small);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--dim);
    transition: opacity 0.3s ease;
  }

  .case-hint.is-open {
    opacity: 0;
  }
`

/*
 * The album. One element tree serves both states: the open spread — lid,
 * hinge, tray, disc — is mounted from the first frame, and `is-open` is the
 * whole transition. Shut, .case-clip crops the shell to the tray half (the
 * hinge showing as the spine) and re-centres it; the front cover lies on the
 * tray. Opening is one CSS choreography: the clip unfolds the case to full
 * width while the cover swings 180° over the hinge — its paper back showing
 * mid-flight — and the booklet settles onto the lid as the cover lands.
 * Desktop lays the case flat (lid | hinge | tray); a phone holds it upright
 * (lid above, hinge, tray below) with the booklet lying across the middle.
 */
export const OpenCase = styled(motion.article)`
  /* The booklet positions itself against this box, not the viewport. */
  position: relative;
  width: min(96vw, 960px);

  /* Folded shut: only the tray half and a sliver of hinge-as-spine show,
   * shifted so the visible half sits centred in the scene. */
  .case-clip {
    clip-path: inset(0 0 0 calc(50% - 22px) round 14px);
    transform: translateX(-24%);
    transition:
      clip-path 0.95s cubic-bezier(0.6, 0, 0.25, 1),
      transform 0.95s cubic-bezier(0.6, 0, 0.25, 1);
  }

  &.is-open .case-clip {
    clip-path: inset(0 0 0 0 round 14px);
    transform: none;
  }

  .case-shell {
    position: relative;
    perspective: 1700px;
    display: grid;
    grid-template-areas: 'lid hinge tray';
    grid-template-columns: 1fr 16px 1fr;
    padding: 12px;
    border-radius: 14px;
    background: linear-gradient(
      160deg,
      color-mix(in srgb, var(--cover-b) 72%, #000 14%),
      color-mix(in srgb, var(--cover-b) 55%, #000 30%)
    );
    box-shadow:
      inset 0 0 0 1px rgb(255 255 255 / 0.14),
      var(--shadow-deep);
  }

  .panel {
    border-radius: 6px;
    overflow: hidden;
    min-height: 500px;
  }

  /* -------------------------------------------------------------- the lid */

  .lid {
    grid-area: lid;
    position: relative;
    background: color-mix(in srgb, var(--bg) 80%, #000 12%);
    box-shadow: inset 0 0 24px rgb(0 0 0 / 0.25);
  }

  /* The shallow moulding the booklet clips into, sitting empty behind it. */
  .lid-recess {
    position: absolute;
    inset: 6%;
    border-radius: 4px;
    background: color-mix(in srgb, var(--bg) 84%, #000 8%);
    box-shadow:
      inset 0 2px 8px rgb(0 0 0 / 0.24),
      0 1px 0 rgb(255 255 255 / 0.06);
  }

  /* The little tabs that held it. */
  .lid-tab {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 9px;
    border-radius: 0 0 5px 5px;
    background: linear-gradient(180deg, rgb(0 0 0 / 0.3), rgb(255 255 255 / 0.06));
  }

  .lid-tab.is-top {
    top: 6%;
  }

  .lid-tab.is-bottom {
    bottom: 6%;
    border-radius: 5px 5px 0 0;
    background: linear-gradient(0deg, rgb(0 0 0 / 0.3), rgb(255 255 255 / 0.06));
  }

  /* ------------------------------------------------------------ the hinge */

  .case-hinge {
    grid-area: hinge;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    background: linear-gradient(
      90deg,
      rgb(0 0 0 / 0.35),
      rgb(255 255 255 / 0.08) 50%,
      rgb(0 0 0 / 0.35)
    );
  }

  .case-hinge i {
    display: block;
    width: 100%;
    height: 34px;
    border-radius: 3px;
    background: linear-gradient(
      90deg,
      rgb(0 0 0 / 0.45),
      rgb(255 255 255 / 0.1),
      rgb(0 0 0 / 0.45)
    );
  }

  /* ------------------------------------------------------------- the tray */

  .tray {
    grid-area: tray;
    position: relative;
    display: grid;
    place-items: center;
    padding: 7%;
    background: linear-gradient(
      160deg,
      color-mix(in srgb, var(--surface-hi) 60%, var(--bg) 40%),
      color-mix(in srgb, var(--bg) 78%, #000 14%)
    );
    box-shadow: inset 0 0 34px rgb(0 0 0 / 0.16);
  }

  .tray-recess {
    width: min(100%, 380px);
    aspect-ratio: 1;
    border-radius: 50%;
    display: grid;
    place-items: center;
    padding: 5%;
    background: color-mix(in srgb, var(--bg) 82%, #000 10%);
    box-shadow:
      inset 0 2px 10px rgb(0 0 0 / 0.3),
      0 1px 0 rgb(255 255 255 / 0.08);
  }

  .tray-recess .disc-box {
    width: 100%;
  }

  .tray-clip {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 64px;
    height: 10px;
    border-radius: var(--radius-pill);
    background: rgb(0 0 0 / 0.28);
    box-shadow: inset 0 1px 3px rgb(0 0 0 / 0.4);
  }

  /* ------------------------------------------------------------ the cover
   * The front cover starts lying on the tray and swings over the hinge into
   * the lid. Two faces: the art, and the paper back that shows mid-flight.
   * Once landed it fades away over the identical real lid beneath. */

  .case-cover {
    position: absolute;
    z-index: 5;
    top: 12px;
    bottom: 12px;
    right: 12px;
    left: calc(50% + 8px);
    transform-origin: left center;
    transform-style: preserve-3d;
    border-radius: 6px;
    transition:
      transform 0.95s cubic-bezier(0.6, 0, 0.25, 1),
      opacity 0.3s ease 0.95s;
  }

  &.is-open .case-cover {
    transform: rotateY(-180deg);
    opacity: 0;
    pointer-events: none;
  }

  /* The two faces swap the instant the cover passes edge-on. Backface
   * culling would be the obvious tool, but the front face's container query
   * and overflow clipping make browsers flatten it out of the 3D context —
   * so the swap is an instant opacity flip timed to the swing instead. */
  .cover-front,
  .cover-back {
    position: absolute;
    inset: 0;
    border-radius: 6px;
    overflow: hidden;
    transition: opacity 0s linear 0.42s;
  }

  .cover-front {
    container-type: inline-size;
    box-shadow: var(--shadow);
  }

  .cover-back {
    opacity: 0;
    transform: rotateY(180deg);
    /* A touch lighter than the lid it lands on, so the second half of the
     * swing stays visible, then the whole cover fades out over the lid. */
    background: linear-gradient(
      160deg,
      color-mix(in srgb, var(--surface-hi) 45%, var(--bg) 55%),
      color-mix(in srgb, var(--bg) 88%, #000 8%)
    );
    box-shadow: inset 0 0 24px rgb(0 0 0 / 0.2);
  }

  &.is-open .cover-front {
    opacity: 0;
  }

  &.is-open .cover-back {
    opacity: 1;
  }

  /* ----------------------------------------------------------- the booklet
   * A separate object lying on the open case: off centre, a few degrees
   * askew, throwing its own shadow onto the plastic. */

  .booklet {
    position: absolute;
    z-index: 3;
    top: 4.5%;
    bottom: 8%;
    left: 4.5%;
    width: 52%;
    filter: drop-shadow(0 16px 26px rgb(0 0 0 / 0.38));
    /* Shut, the booklet waits inside the case: invisible, lifted a touch. */
    visibility: hidden;
    opacity: 0;
    transform: rotate(-1deg) translateY(-18px) scale(1.05);
    transition:
      opacity 0.45s ease,
      transform 0.55s cubic-bezier(0.2, 0.7, 0.25, 1),
      visibility 0s;
  }

  &.is-open .booklet {
    visibility: visible;
    opacity: 1;
    transform: rotate(-3.2deg);
    /* It lands just as the cover finishes its swing. */
    transition-delay: 0.7s;
  }

  .booklet-window {
    position: relative;
    height: 100%;
    /* Horizontal gestures are ours; the browser keeps vertical scrolling. */
    touch-action: pan-y;
    cursor: grab;
  }

  .booklet-window:active {
    cursor: grabbing;
  }

  /* The printed fade over a clipped sheet's last lines. */
  .booklet-window.is-truncated::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 56px;
    z-index: 50;
    pointer-events: none;
    border-radius: 0 0 10px 3px;
    background: linear-gradient(180deg, transparent, var(--surface) 78%);
  }

  /* The back cover, peeking out beneath the whole stack. */
  .booklet-window::before {
    content: '';
    position: absolute;
    inset: 0;
    transform: translate(4px, 5px) rotate(0.6deg);
    border-radius: 3px 10px 10px 3px;
    background: color-mix(in srgb, var(--surface) 88%, #000 6%);
  }

  .booklet-sheets {
    position: relative;
    height: 100%;
    perspective: 1600px;
  }

  /*
   * One sheet of the stapled booklet. Turning is nothing but the is-read
   * class: the sheet lifts over its binding (the left edge) and fades as it
   * passes vertical, and taking the class off lowers it back. Mid-drag the
   * component holds the sheet at the finger's angle with an inline transform
   * and is-held silences the transition, so release animates from wherever
   * the finger left it.
   */
  .sheet {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 13px;
    padding: clamp(20px, 3.4vw, 34px);
    padding-left: clamp(28px, 3.8vw, 42px); /* the binding gutter */
    /* A sheet of paper does not scroll: what does not fit is clipped under
     * the fade below, and the More chip opens the full page. */
    overflow: hidden;
    background: var(--surface);
    border-radius: 3px 10px 10px 3px;
    box-shadow:
      /* the gutter's shadow, where the paper folds into the staples */
      inset 14px 0 16px -12px rgb(0 0 0 / 0.28),
      2px 2px 6px rgb(0 0 0 / 0.22);
    transform-origin: left center;
    backface-visibility: hidden;
    transition:
      transform 0.55s cubic-bezier(0.2, 0.7, 0.25, 1),
      opacity 0.3s ease 0.18s;
  }

  .sheet.is-cover {
    padding: 0;
    overflow: hidden;
    container-type: inline-size;
  }

  .sheet.is-read {
    transform: rotateY(-88deg);
    opacity: 0;
    pointer-events: none;
  }

  .sheet.is-held {
    transition: none;
    user-select: none;
  }

  /* The staples at the fold, the way every CD booklet is bound. */
  .sheet::before,
  .sheet::after {
    content: '';
    position: absolute;
    left: 9px;
    width: 3px;
    height: 16px;
    border-radius: 2px;
    background: linear-gradient(180deg, rgb(0 0 0 / 0.35), rgb(0 0 0 / 0.15));
    z-index: 1;
  }

  .sheet::before {
    top: 26%;
  }

  .sheet::after {
    bottom: 26%;
  }

  .page-eyebrow {
    position: relative;
    font-size: var(--font-tiny);
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--accent);
    font-weight: 600;
    padding-bottom: 10px;
  }

  .page-eyebrow::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 34px;
    height: 2px;
    background: var(--accent);
  }

  .page-title {
    font-family: var(--font-display);
    letter-spacing: var(--display-tracking);
    text-transform: var(--display-transform);
    font-size: clamp(22px, 2.8vw, 30px);
    line-height: 1.15;
  }

  .page-caps {
    font-size: var(--font-small);
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  .page-caps.is-dim {
    color: var(--dim);
  }

  .page-note {
    font-family: var(--font-display);
    letter-spacing: var(--display-tracking);
    font-style: italic;
    font-size: clamp(15px, 1.8vw, 18px);
    color: var(--dim);
    max-width: 34ch;
    line-height: 1.6;
  }

  .page-flourish {
    display: block;
    width: 44px;
    height: 2px;
    background: var(--accent);
    margin: 2px 0;
  }

  .page-body {
    color: var(--text);
    max-width: 44ch;
  }

  .page-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    align-self: stretch;
  }

  .page-list li + li {
    border-top: 1px solid var(--line);
    padding-top: 14px;
  }

  .page-item-title {
    font-size: var(--font-small);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 3px;
  }

  .page-list .page-body {
    color: var(--dim);
  }

  .page-qr {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 4px;
    padding: 10px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface-hi);
  }

  .page-qr img {
    width: 88px;
    height: 88px;
    border-radius: 6px;
    /* The card behind the modules is part of the code's contrast, not the theme. */
    background: #ffffff;
    padding: 4px;
  }

  .page-qr figcaption {
    color: var(--dim);
    font-size: var(--font-small);
    max-width: 18ch;
  }

  .page-play {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--accent);
    color: var(--ink);
    border-radius: var(--radius-pill);
    padding: 11px 20px;
    font-weight: 700;
    text-decoration: none;
    transition:
      background 0.2s ease,
      transform 0.2s ease;
  }

  .page-play:hover {
    background: var(--accent-hi);
    transform: translateY(-1px);
  }

  /* Part of the sheet-modal experiment (see SheetModal.tsx): a paper chip on
   * the booklet's corner, shown only when the open sheet has more to say than
   * its window can show. */
  .booklet-more {
    position: absolute;
    right: 10px;
    bottom: 10px;
    z-index: 70;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: var(--radius-pill);
    border: 1px solid var(--line);
    background: color-mix(in srgb, var(--surface) 92%, transparent);
    color: var(--dim);
    font-size: var(--font-tiny);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    box-shadow: var(--shadow);
    transition:
      color 0.2s ease,
      background 0.2s ease;
  }

  .booklet-more:hover {
    color: var(--text);
    background: var(--surface);
  }

  /* The page turns: a folio between two chevrons, set on the ground under
   * the album case so they never cover what the booklet says. They arrive
   * with the booklet. */

  .booklet-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 14px;
    visibility: hidden;
    opacity: 0;
    transition:
      opacity 0.45s ease,
      visibility 0s;
  }

  &.is-open .booklet-nav {
    visibility: visible;
    opacity: 1;
    transition-delay: 0.7s;
  }

  .booklet-folio {
    font-family: var(--font-mono);
    font-size: var(--font-tiny);
    letter-spacing: 0.24em;
    color: var(--dim);
    white-space: nowrap;
  }

  .booklet-turn {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    color: var(--dim);
    transition:
      color 0.2s ease,
      background 0.2s ease;
  }

  .booklet-turn:hover:not(:disabled) {
    color: var(--text);
    background: var(--surface-hi);
  }

  .booklet-turn:disabled {
    opacity: 0.3;
    cursor: default;
  }

  @media (prefers-reduced-motion: reduce) {
    .case-clip,
    .case-cover,
    .cover-front,
    .cover-back,
    .booklet {
      transition: none;
    }

    &.is-open .booklet,
    &.is-open .booklet-nav {
      transition-delay: 0s;
    }

    .booklet-nav {
      transition: none;
    }
  }

  /* A phone opens the case exactly the way desktop does — the cover swings
   * left over the hinge — but zoomed in on the tray half: the shell is two
   * phone-widths wide, held so the tray fills the screen, and the lid swings
   * out past the left edge and is simply cut off. The booklet stays square,
   * the shape of the thing that actually comes out of a jewel case. */
  @media (max-width: 899px) {
    width: calc(172vw + 34px);

    .case-shell {
      grid-template-columns: 86vw 14px 86vw;
      padding: 10px;
    }

    .panel {
      min-height: 0;
      aspect-ratio: 1 / 1.06;
    }

    /* Centres the tray half in the viewport — and stays put when the case
     * opens, so the lid unfolds off screen instead of pulling the disc away. */
    .case-clip,
    &.is-open .case-clip {
      transform: translateX(-25%);
    }

    /* Shut, show the spine and nothing of the lid behind it. */
    .case-clip {
      clip-path: inset(0 0 0 calc(50% - 16px) round 14px);
    }

    &.is-open .case-clip {
      clip-path: inset(0 0 0 0 round 14px);
    }

    .case-cover {
      top: 10px;
      bottom: 10px;
      right: 10px;
      left: calc(50% + 7px);
    }

    .tray {
      padding: 8%;
    }

    .tray-recess {
      width: min(100%, 320px);
    }

    .lid-tab {
      width: 44px;
    }

    .booklet {
      /* Square, riding a little high on the case so the disc's lower arc
       * stays in view beneath it. */
      top: -3%;
      bottom: auto;
      left: 50%;
      width: 78vw;
      aspect-ratio: 1 / 1.04;
      transform: translateX(-50%) rotate(-1deg) translateY(-18px) scale(1.05);
    }

    &.is-open .booklet {
      transform: translateX(-50%) rotate(-2.4deg);
    }
  }
`

export const Footer = styled.footer`
  font-size: var(--font-small);
  color: var(--dim);

  a {
    color: inherit;
    text-underline-offset: 3px;
  }

  a:hover {
    color: var(--text);
  }
`
