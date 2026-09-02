import styled, { keyframes } from 'styled-components'

export interface DiscProps {
  names: [string, string]
  album: string
  /** A disc in the tray sits still until the case has opened. */
  spinning: boolean
  /** The couple's own disc print. Set, it replaces the label and its text. */
  image?: string
}

/*
 * The CD itself: a foil ring with a printed label. The rainbow is a conic
 * gradient at low alpha over the label gradient — enough sheen to read as a
 * disc without turning into a beach ball.
 */
export function Disc({ names, album, spinning, image }: DiscProps) {
  const [a, b] = names
  const both = a && b ? `${a} & ${b}` : a || b || 'Side A'
  return (
    <Box className="disc-box" aria-hidden="true">
      <Shell className="disc" $spinning={spinning}>
        {image ? (
          <img className="disc-print" src={image} alt="" />
        ) : (
          <span className="disc-label">
            <span className="disc-names">{both}</span>
            <span className="disc-album">{album || 'Save the date'}</span>
          </span>
        )}
      </Shell>
    </Box>
  )
}

/* cq units inside the disc resolve against this box, so the label scales with
 * whatever size the tray or page gives the disc. */
const Box = styled.span`
  display: block;
  width: 100%;
  container-type: inline-size;
`

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const Shell = styled.span<{ $spinning: boolean }>`
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    conic-gradient(
      from 40deg,
      rgb(255 120 120 / 0.16),
      rgb(255 220 120 / 0.16),
      rgb(140 255 160 / 0.16),
      rgb(120 200 255 / 0.16),
      rgb(200 140 255 / 0.16),
      rgb(255 120 120 / 0.16)
    ),
    radial-gradient(circle, var(--disc-a) 0 38%, var(--disc-b) 72%, var(--disc-a) 100%);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--cover-text) 22%, transparent),
    var(--shadow);
  animation: ${spin} 9s linear infinite;
  animation-play-state: ${({ $spinning }) => ($spinning ? 'running' : 'paused')};

  &::after {
    /* The hub: a clear ring and the hole, showing the ground through it. */
    content: '';
    position: absolute;
    width: 27%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: var(--bg);
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--cover-text) 25%, transparent),
      0 0 0 6px color-mix(in srgb, var(--bg) 45%, transparent);
  }

  /* A photo printed edge to edge, the hub punched out of it by ::after. */
  .disc-print {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .disc-label {
    position: absolute;
    inset: 18%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    text-align: center;
    justify-content: flex-start;
    padding-top: 9%;
    color: var(--disc-text);
    border-radius: 50%;
  }

  /* A printed label has one line for each thing and no more: long names wrap
   * into the album title otherwise, and the two print through each other. A
   * real CD label drops what will not fit. */
  .disc-names {
    font-family: var(--font-display);
    letter-spacing: var(--display-tracking);
    text-transform: var(--display-transform);
    font-weight: 700;
    font-size: clamp(11px, 5.5cqw, 22px);
    max-width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .disc-album {
    font-size: clamp(8px, 3cqw, 12px);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    opacity: 0.75;
    max-width: 78%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
