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
 * The open album. The shell is the plastic — a rim all the way round, a hinge
 * between the halves — so what a guest is looking at is still the object they
 * just opened, with the details printed inside it. Desktop lays the spread
 * flat (booklet | hinge | tray); a phone holds the case upright instead
 * (tray above, hinge, booklet below). The tray never disappears.
 */
export const OpenCase = styled(motion.article)`
  width: min(96vw, 960px);

  .case-shell {
    display: grid;
    grid-template-areas: 'booklet hinge tray';
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

  /* ---------------------------------------------------------- the booklet */

  .booklet {
    grid-area: booklet;
    position: relative;
    /* The inside of the lid: dark plastic the paper booklet sits against. */
    background: color-mix(in srgb, var(--bg) 80%, #000 12%);
    box-shadow: inset 0 0 24px rgb(0 0 0 / 0.25);
    padding: 14px 14px 48px;
  }

  .booklet-window {
    height: 100%;
    /* Horizontal gestures are ours; the browser keeps vertical scrolling. */
    touch-action: pan-y;
    cursor: grab;
  }

  .booklet-window:active {
    cursor: grabbing;
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
    gap: 14px;
    padding: clamp(22px, 4vw, 40px);
    padding-left: clamp(30px, 4.4vw, 48px); /* the binding gutter */
    overflow-y: auto;
    background: var(--surface);
    border-radius: 2px 8px 8px 2px;
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
    font-size: clamp(24px, 3.4vw, 34px);
    line-height: 1.15;
  }

  .page-lead {
    font-size: clamp(17px, 2.2vw, 20px);
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
    gap: 14px;
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
    margin-top: 6px;
    padding: 10px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface-hi);
  }

  .page-qr img {
    width: 96px;
    height: 96px;
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
    padding: 12px 22px;
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

  /* The turn bar: a printed folio between two quiet chevrons, set into the
   * lid below the paper rather than floating over it. */

  .booklet-nav {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .booklet-folio {
    font-family: var(--font-mono);
    font-size: var(--font-tiny);
    letter-spacing: 0.24em;
    color: var(--dim);
  }

  .booklet-turn {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: var(--dim);
    transition:
      color 0.2s ease,
      background 0.2s ease;
  }

  .booklet-turn:hover:not(:disabled) {
    color: var(--text);
    background: rgb(255 255 255 / 0.06);
  }

  .booklet-turn:disabled {
    opacity: 0.3;
    cursor: default;
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

  /* The moulded circle the disc snaps into. */
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

  /* The thumb notch cut into the tray's lower rim. */
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

  /* A phone holds the case upright: disc above the hinge, booklet below. */
  @media (max-width: 899px) {
    .case-shell {
      grid-template-areas: 'tray' 'hinge' 'booklet';
      grid-template-columns: 1fr;
      grid-template-rows: auto 16px 1fr;
      padding: 10px;
    }

    .panel {
      min-height: 0;
    }

    .booklet {
      min-height: 460px;
    }

    .tray {
      padding: 18px;
    }

    .tray-recess {
      width: min(52vw, 230px);
    }

    .tray-clip {
      display: none;
    }

    .case-hinge {
      flex-direction: row;
      justify-content: space-around;
      background: linear-gradient(
        180deg,
        rgb(0 0 0 / 0.35),
        rgb(255 255 255 / 0.08) 50%,
        rgb(0 0 0 / 0.35)
      );
    }

    .case-hinge i {
      width: 34px;
      height: 100%;
      background: linear-gradient(
        180deg,
        rgb(0 0 0 / 0.45),
        rgb(255 255 255 / 0.1),
        rgb(0 0 0 / 0.45)
      );
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
