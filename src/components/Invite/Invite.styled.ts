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

export const OpenCase = styled(motion.article)`
  width: min(96vw, 940px);
  display: flex;
  flex-direction: column;
  gap: 18px;

  .case-open-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: var(--shadow-deep);
  }

  .panel {
    min-height: 460px;
  }

  .booklet {
    background: var(--surface);
    padding: clamp(20px, 4vw, 40px);
    display: flex;
  }

  .page {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    width: 100%;
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

  .page-disc {
    display: none;
    width: min(62vw, 260px);
    align-self: center;
    margin-top: 8px;
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

  .tray {
    background:
      radial-gradient(
        circle at 50% 46%,
        color-mix(in srgb, var(--bg) 70%, #000 10%) 0 34%,
        transparent 35%
      ),
      linear-gradient(160deg, var(--surface-hi), color-mix(in srgb, var(--bg) 80%, #000 12%));
    display: grid;
    place-items: center;
    padding: 9%;
    box-shadow: inset 0 0 40px rgb(0 0 0 / 0.14);
  }

  .tray .disc-box {
    width: min(100%, 340px);
  }

  @media (max-width: 899px) {
    .case-open-body {
      grid-template-columns: 1fr;
    }

    .panel {
      min-height: 0;
    }

    .booklet {
      min-height: 420px;
    }

    .tray {
      display: none;
    }

    .page-disc {
      display: block;
    }
  }
`

export const Tracklist = styled.nav`
  ol {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
  }

  .track {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border-radius: var(--radius-pill);
    border: 1px solid var(--line);
    color: var(--dim);
    font-size: var(--font-small);
    letter-spacing: 0.04em;
    transition:
      color 0.2s ease,
      border-color 0.2s ease,
      background 0.2s ease;
  }

  .track:hover {
    color: var(--text);
    border-color: var(--dim);
  }

  .track.is-active {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--ink);
  }

  .track-number {
    font-family: var(--font-mono);
    font-size: var(--font-tiny);
    opacity: 0.8;
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
