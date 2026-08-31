import styled from 'styled-components'

export const Swatches = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;

  .swatch {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 8px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface);
    text-align: left;
    transition:
      border-color 0.2s ease,
      transform 0.2s ease;
  }

  .swatch:hover {
    transform: translateY(-2px);
  }

  .swatch.is-active {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent);
  }

  .swatch-cover {
    width: 100%;
    aspect-ratio: 1.6;
    border-radius: 8px;
    display: grid;
    place-items: end start;
    padding: 8px;
  }

  .swatch-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .swatch-name {
    font-weight: 700;
    font-size: var(--font-small);
  }

  .swatch-vibe {
    color: var(--dim);
    font-size: var(--font-tiny);
    line-height: 1.35;
  }
`
