import styled from 'styled-components'

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  .art-label {
    font-weight: 600;
    font-size: var(--font-small);
  }

  .art-add {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 128px;
    height: 128px;
    border: 1px dashed var(--line);
    border-radius: var(--radius);
    color: var(--dim);
    font-size: var(--font-small);
    flex-direction: column;
    transition:
      color 0.2s ease,
      border-color 0.2s ease;
  }

  .art-add:hover:not(:disabled) {
    color: var(--accent);
    border-color: var(--accent);
  }

  .art-preview {
    position: relative;
    width: 128px;
    height: 128px;
  }

  .art-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--radius);
    border: 1px solid var(--line);
  }

  &.is-round .art-preview img,
  &.is-round .art-add {
    border-radius: 50%;
  }

  .art-remove {
    position: absolute;
    top: 6px;
    right: 6px;
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--surface);
    border: 1px solid var(--line);
    color: var(--dim);
    transition:
      color 0.2s ease,
      border-color 0.2s ease;
  }

  .art-remove:hover {
    color: var(--danger);
    border-color: var(--danger);
  }

  /* The real input stays for assistive tech; the button drives it. */
  .art-input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }
`
