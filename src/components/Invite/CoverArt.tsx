import styled, { css } from 'styled-components'
import { coverYear } from '@/lib/format'
import { themeById } from '@/lib/themes'
import type { SaveTheDate } from '@/lib/types'

export interface CoverArtProps {
  doc: SaveTheDate
}

/*
 * The front of the jewel case: an album cover built from the document. All of
 * it is CSS on cover tokens, so it re-skins with the theme — the motif is the
 * one thing the theme picks directly, because a palette alone was not enough
 * to make ten looks read as ten records.
 */
export function CoverArt({ doc }: CoverArtProps) {
  const [a, b] = doc.names
  const both = a && b ? `${a} & ${b}` : a || b || 'Two people'
  const year = coverYear(doc.date)
  return (
    <Face className="cover-face" $motif={themeById(doc.theme).motif}>
      <span className="cover-eyebrow">{doc.album || 'Save the date'}</span>
      <span className="cover-names">{both}</span>
      <span className="cover-foot">
        <span>a wedding mixtape</span>
        {year && <span>{year}</span>}
      </span>
    </Face>
  )
}

const MOTIFS = {
  rings: css`
    background-image:
      repeating-radial-gradient(
        circle at 50% 42%,
        transparent 0 26px,
        color-mix(in srgb, var(--cover-text) 9%, transparent) 26px 28px
      ),
      linear-gradient(170deg, var(--cover-a), var(--cover-b));
  `,
  burst: css`
    background-image:
      repeating-conic-gradient(
        from 0deg at 50% 44%,
        transparent 0deg 9deg,
        color-mix(in srgb, var(--cover-text) 8%, transparent) 9deg 12deg
      ),
      linear-gradient(170deg, var(--cover-a), var(--cover-b));
  `,
  bars: css`
    background-image:
      repeating-linear-gradient(
        0deg,
        transparent 0 30px,
        color-mix(in srgb, var(--cover-text) 8%, transparent) 30px 34px
      ),
      linear-gradient(170deg, var(--cover-a), var(--cover-b));
  `,
  grid: css`
    background-image:
      repeating-linear-gradient(
        0deg,
        transparent 0 34px,
        color-mix(in srgb, var(--cover-text) 7%, transparent) 34px 35px
      ),
      repeating-linear-gradient(
        90deg,
        transparent 0 34px,
        color-mix(in srgb, var(--cover-text) 7%, transparent) 34px 35px
      ),
      linear-gradient(170deg, var(--cover-a), var(--cover-b));
  `,
  wave: css`
    background-image:
      repeating-radial-gradient(
        circle at 50% 130%,
        transparent 0 34px,
        color-mix(in srgb, var(--cover-text) 8%, transparent) 34px 37px
      ),
      linear-gradient(170deg, var(--cover-a), var(--cover-b));
  `,
}

const Face = styled.div<{ $motif: keyof typeof MOTIFS }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 7% 8%;
  color: var(--cover-text);
  ${({ $motif }) => MOTIFS[$motif]}

  .cover-eyebrow {
    font-size: clamp(10px, 2.4cqw, 14px);
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--cover-dim);
  }

  .cover-names {
    font-family: var(--font-display);
    letter-spacing: var(--display-tracking);
    text-transform: var(--display-transform);
    font-size: clamp(22px, 11cqw, 58px);
    line-height: 1.05;
    font-weight: 700;
    overflow-wrap: anywhere;
  }

  .cover-foot {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: clamp(9px, 2.2cqw, 13px);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--cover-dim);
  }
`
