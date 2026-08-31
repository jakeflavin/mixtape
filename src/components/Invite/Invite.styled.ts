import styled, { keyframes } from 'styled-components'
import { motion } from 'motion/react'

export const Scene = styled.main`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 24px 16px calc(16px + env(safe-area-inset-bottom));
`

export const ClosedWrap = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;

  .case-hint {
    font-size: var(--font-small);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--dim);
  }
`

export const ClosedCase = styled.button`
  position: relative;
  width: min(84vw, 420px);
  aspect-ratio: 1.06;
  perspective: 1400px;
  border-radius: 6px;
  transition: transform 0.35s ease;

  &:hover {
    transform: translateY(-4px) rotateX(2deg) rotateY(-3deg);
  }

  &:disabled {
    cursor: default;
  }

  .case-spine {
    position: absolute;
    inset: 0 auto 0 0;
    width: 6.5%;
    border-radius: 6px 0 0 6px;
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--cover-b) 70%, #000 30%),
      var(--cover-b)
    );
    box-shadow: inset -2px 0 3px rgb(0 0 0 / 0.25);
  }

  /* The disc waits under the lid, so the open swing reveals it. */
  .case-under {
    position: absolute;
    inset: 5% 4% 5% 10%;
    display: grid;
    place-items: center;
    z-index: 1;
    border-radius: 0 6px 6px 0;
    background: color-mix(in srgb, var(--cover-b) 55%, #000 12%);
  }

  .case-under .disc-box {
    width: 86%;
  }

  .case-face {
    position: absolute;
    inset: 0 0 0 6.5%;
    z-index: 2;
    display: block;
    container-type: inline-size;
    transform-origin: left center;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    border-radius: 0 6px 6px 0;
    overflow: hidden;
    box-shadow: var(--shadow-deep);
  }

  /* The jewel case's plastic: a diagonal sheen and a hard little edge. */
  .case-gloss {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      115deg,
      rgb(255 255 255 / 0.28) 0%,
      rgb(255 255 255 / 0.06) 18%,
      transparent 32%,
      transparent 68%,
      rgb(255 255 255 / 0.1) 100%
    );
    box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.16);
    pointer-events: none;
  }
`

/*
 * The open album. The case is only a case — an empty lid with the tabs and
 * recess the booklet came out of, the hinge, and the tray holding the disc —
 * and the booklet is a separate paper object resting on it, slightly off
 * centre and slightly askew, the way one actually lands when you take it out.
 * Desktop lays the case flat (lid | hinge | tray); a phone holds it upright
 * (lid above, hinge, tray below) with the booklet lying across the middle.
 */
export const OpenCase = styled(motion.article)`
  width: min(96vw, 960px);

  .case-shell {
    position: relative;
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
    transform: rotate(-3.2deg);
    filter: drop-shadow(0 16px 26px rgb(0 0 0 / 0.38));
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
    padding-bottom: 58px; /* room for the printed turn chip */
    overflow-y: auto;
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
    font-size: var(--font-tiny);
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--accent);
    font-weight: 600;
  }

  .page-title {
    font-family: var(--font-display);
    letter-spacing: var(--display-tracking);
    text-transform: var(--display-transform);
    font-size: clamp(22px, 2.8vw, 30px);
    line-height: 1.15;
  }

  .page-lead {
    font-size: clamp(16px, 2vw, 19px);
  }

  .page-body {
    color: var(--text);
    max-width: 44ch;
  }

  .page-dim {
    color: var(--dim);
    font-size: var(--font-small);
    max-width: 44ch;
  }

  .page-pill {
    border: 1px solid var(--line);
    background: var(--surface-hi);
    border-radius: var(--radius-pill);
    padding: 6px 14px;
    font-size: var(--font-small);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .page-list {
    display: flex;
    flex-direction: column;
    gap: 13px;
  }

  .page-item-title {
    font-size: var(--font-body);
    font-weight: 700;
    margin-bottom: 2px;
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

  .page-eq {
    display: flex;
    align-items: flex-end;
    gap: 5px;
    height: 26px;
    margin-top: 4px;
  }

  .page-eq i {
    width: 5px;
    border-radius: 3px;
    background: var(--accent);
    animation: ${keyframes`
      from { height: 20%; }
      to { height: 100%; }
    `}
      0.6s ease-in-out infinite alternate;
  }

  .page-eq i:nth-child(2) {
    animation-delay: 0.15s;
  }
  .page-eq i:nth-child(3) {
    animation-delay: 0.3s;
  }
  .page-eq i:nth-child(4) {
    animation-delay: 0.45s;
  }
  .page-eq i:nth-child(5) {
    animation-delay: 0.6s;
  }

  /* The turn chip: a folio between two chevrons, printed low on whatever
   * sheet is up — a translucent paper chip so it reads on the cover too. */

  .booklet-nav {
    position: absolute;
    left: 50%;
    bottom: 12px;
    transform: translateX(-50%);
    z-index: 60;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 3px 8px;
    border-radius: var(--radius-pill);
    border: 1px solid var(--line);
    background: color-mix(in srgb, var(--surface) 85%, transparent);
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

  /* A phone holds the case upright — lid above the hinge, tray below — and
   * the booklet lies across the middle, still its own object. */
  @media (max-width: 899px) {
    width: min(94vw, 430px);

    .case-shell {
      grid-template-areas: 'lid' 'hinge' 'tray';
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 14px 1fr;
      padding: 10px;
    }

    .panel {
      min-height: 0;
      aspect-ratio: 1 / 1.1;
    }

    .tray {
      padding: 10%;
    }

    .tray-recess {
      width: min(100%, 300px);
    }

    .lid-tab {
      width: 44px;
    }

    .booklet {
      /* Across the lid and hinge, ending partway down the tray so the disc
       * still shows beneath it. */
      top: 4%;
      bottom: 33%;
      left: 5%;
      width: 90%;
      transform: rotate(-2.4deg);
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
