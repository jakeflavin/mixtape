import styled from 'styled-components'

export const Page = styled.main`
  max-width: 1120px;
  margin: 0 auto;
  padding: 28px 20px calc(48px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  h1 {
    font-size: 26px;
    letter-spacing: -0.01em;
  }

  p {
    color: var(--dim);
    max-width: 52ch;
  }

  .header-reset {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 14px;
    border-radius: var(--radius-pill);
    border: 1px solid var(--line);
    color: var(--dim);
    font-size: var(--font-small);
    white-space: nowrap;
    transition:
      color 0.2s ease,
      border-color 0.2s ease;
  }

  .header-reset:hover {
    color: var(--danger);
    border-color: var(--danger);
  }
`

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 24px;
  align-items: start;

  @media (max-width: 999px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface);
  padding: 20px;

  h2 {
    font-size: 18px;
  }

  .section-hint {
    color: var(--dim);
    font-size: var(--font-small);
    margin-top: -6px;
  }

  .section-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;

    @media (max-width: 560px) {
      grid-template-columns: 1fr;
    }
  }
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  &.is-wide {
    grid-column: 1 / -1;
  }

  label {
    font-weight: 600;
    font-size: var(--font-small);
  }

  input {
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface);
    padding: 9px 12px;
    width: 100%;
  }

  input::placeholder {
    color: var(--dim);
  }
`

export const Preview = styled.aside`
  position: sticky;
  top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  /* The genre palette is written onto this element, so the panel shows the
   * invite's own ground rather than the builder's. */
  background: var(--bg);
  padding: 26px 22px;

  .preview-case {
    position: relative;
    width: 100%;
    max-width: 300px;
    aspect-ratio: 1.06;
  }

  .preview-spine {
    position: absolute;
    inset: 0 auto 0 0;
    width: 6.5%;
    border-radius: 6px 0 0 6px;
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--cover-b) 70%, #000 30%),
      var(--cover-b)
    );
  }

  .preview-face {
    position: absolute;
    inset: 0 0 0 6.5%;
    display: block;
    container-type: inline-size;
    border-radius: 0 6px 6px 0;
    overflow: hidden;
    box-shadow: var(--shadow);
  }

  .preview-gloss {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      115deg,
      rgb(255 255 255 / 0.24) 0%,
      rgb(255 255 255 / 0.05) 18%,
      transparent 32%
    );
    box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.14);
    pointer-events: none;
  }

  .preview-note {
    color: var(--dim);
    font-size: var(--font-small);
  }

  @media (max-width: 999px) {
    position: static;
    order: -1;
  }
`
