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

  @media print {
    display: block;
    min-height: 0;
    padding: 0;

    .case-hint {
      display: none;
    }
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
    text-decoration: none;
    transition: border-color 0.2s ease;
  }

  .page-qr:hover {
    border-color: var(--accent);
  }

  .page-qr:hover .page-qr-caption {
    color: var(--text);
  }

  .page-qr img {
    width: 88px;
    height: 88px;
    border-radius: 6px;
    /* The card behind the modules is part of the code's contrast, not the theme. */
    background: #ffffff;
    padding: 4px;
  }

  .page-qr-caption {
    color: var(--dim);
    font-size: var(--font-small);
    max-width: 18ch;
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-color: color-mix(in srgb, var(--dim) 55%, transparent);
    transition: color 0.2s ease;
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
  /* Below the paper's edge, on the plastic — never printed over the words it
   * exists to rescue. Same rule the folio and chevrons follow. */
  .booklet-more {
    position: absolute;
    right: 4px;
    top: 100%;
    margin-top: 10px;
    z-index: 70;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 44px;
    padding: 6px 14px;
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

  /* The visible chevron stays a 28px disc; the box around it is 44px, which
   * is what a finger needs. Padding does the growing, so nothing moves. */
  .booklet-turn {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 8px;
    border-radius: 50%;
    background-clip: content-box;
    color: var(--dim);
    transition:
      color 0.2s ease,
      background 0.2s ease;
  }

  .booklet-turn:hover:not(:disabled) {
    color: var(--text);
    background: var(--surface-hi);
    background-clip: content-box;
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
    /* Two panel-widths plus the hinge, capped so a tablet gets a jewel case
     * rather than a billboard. */
    width: min(calc(172vw + 34px), 1140px);

    .case-shell {
      grid-template-columns: min(86vw, 560px) 14px min(86vw, 560px);
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

    /* The record sits low in the tray here, so its lower arc stays out from
     * under the booklet that lies across the top of the case. */
    .tray {
      padding: 8%;
      align-items: end;
    }

    .tray-recess {
      width: min(100%, 320px);
    }

    .lid-tab {
      width: 44px;
    }

    .booklet {
      /* Square, riding high enough on the case that a real arc of the record
       * shows beneath it — not a sliver. Measured, not guessed: under 900px
       * the booklet used to cover the disc outright. */
      top: -7%;
      bottom: auto;
      left: 50%;
      width: min(76vw, 430px);
      aspect-ratio: 1 / 1.04;
      transform: translateX(-50%) rotate(-1deg) translateY(-18px) scale(1.05);
    }

    &.is-open .booklet {
      transform: translateX(-50%) rotate(-2.4deg);
    }

    /* A phone's sheet is small, so the page has to be set tighter to hold a
     * normal invite without being cut off. The scale is the same one, wound
     * down a notch; nothing is centred and nothing moves. */
    .sheet {
      gap: 9px;
      padding: 16px;
      padding-left: 24px;
    }

    .page-eyebrow {
      padding-bottom: 7px;
    }

    .page-list {
      gap: 10px;
    }

    .page-list li + li {
      padding-top: 10px;
    }

    .page-body {
      font-size: var(--font-small);
      line-height: 1.45;
    }

    .page-qr img {
      width: 72px;
      height: 72px;
    }
  }

  /* The floor. A 320px screen gives the sheet so little room that the booklet
   * takes a larger share of the case and the page is set smaller again — the
   * alternative is a normal invite arriving cut in half. */
  @media (max-width: 380px) {
    .booklet {
      top: -12%;
      width: 84vw;
    }

    .sheet {
      gap: 7px;
      padding: 13px;
      padding-left: 20px;
    }

    .page-title {
      font-size: 20px;
    }

    .page-body,
    .page-caps,
    .page-item-title {
      font-size: var(--font-tiny);
      line-height: 1.4;
    }
  }
  /*
   * On paper, the case is not the point — the words are. A save-the-date is
   * the most printable thing there is, so printing lays the booklet out as
   * what it always was: a stack of pages, in order, in ink. The plastic, the
   * chevrons and the album art all belong to the screen.
   */
  @media print {
    width: 100%;
    max-width: 100%;

    /* Print flips these properties, and a transition would carry the old
     * value onto the page — a booklet caught mid-rotation. */
    *,
    *::before,
    *::after {
      transition: none !important;
      animation: none !important;
    }

    .case-clip,
    .booklet-nav,
    .booklet-more,
    .case-gloss {
      display: none !important;
    }

    .booklet {
      position: static;
      width: 100%;
      max-width: 100%;
      top: auto;
      left: auto;
      aspect-ratio: auto;
      visibility: visible;
      opacity: 1;
      transform: none !important;
      filter: none;
    }

    .booklet-window {
      height: auto;
      cursor: auto;
    }

    .booklet-window::before,
    .booklet-window.is-truncated::after {
      display: none;
    }

    .booklet-sheets {
      position: static;
      height: auto;
      perspective: none;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    .sheet {
      position: static;
      inset: auto;
      padding: 0;
      overflow: visible;
      background: none;
      box-shadow: none;
      border-radius: 0;
      opacity: 1 !important;
      transform: none !important;
      break-inside: avoid;
    }

    /* Staples and the gutter are the object, not the page. */
    .sheet::before,
    .sheet::after {
      display: none;
    }

    /* The cover prints as a title page: its type, none of its artwork. */
    .sheet.is-cover .cover-photo,
    .sheet.is-cover .cover-scrim {
      display: none;
    }

    /* The cover's face is absolutely placed over the sleeve on screen. On
     * paper it is just the title block at the top of the first page. */
    .sheet.is-cover .cover-face {
      position: static;
      display: block;
      background: none;
      background-image: none;
      aspect-ratio: auto;
      padding: 0 0 6px;
    }

    .sheet.is-cover .cover-names {
      display: block;
      font-size: 34px;
      line-height: 1.1;
      margin: 2px 0 4px;
    }

    .sheet.is-cover .cover-eyebrow {
      display: block;
      font-size: 11px;
    }

    .sheet.is-cover .cover-foot {
      font-size: 11px;
    }

    .page-eyebrow,
    .page-body,
    .page-note,
    .page-caps.is-dim,
    .page-list .page-body,
    .page-qr-caption,
    .cover-eyebrow,
    .cover-names,
    .cover-foot {
      color: #000;
    }

    .page-eyebrow::after {
      background: #000;
    }

    /* A button is nothing on paper; the address is everything. */
    .page-play {
      background: none;
      color: #000;
      padding: 0;
      font-weight: 600;
    }

    .page-play::after {
      content: ' — ' attr(href);
      font-weight: 400;
      word-break: break-all;
    }

    .page-qr {
      border-color: #000;
      background: none;
    }
  }
`

export const Footer = styled.footer`
  font-size: var(--font-small);
  color: var(--dim);
  /* The negative margin keeps the sentence's own height while the link inside
   * it is tall enough to press. */
  margin: -14px 0;
  padding: 14px 0;

  a {
    display: inline-block;
    padding: 14px 2px;
    margin: -14px 0;
    color: inherit;
    text-underline-offset: 3px;
  }

  a:hover {
    color: var(--text);
  }

  /* A credit with a link in it is furniture on paper. */
  @media print {
    display: none;
  }
`
