import styled from 'styled-components'

export const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface);
  padding: 20px;

  h2 {
    font-size: 18px;
  }

  .share-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  label {
    font-weight: 600;
    font-size: var(--font-small);
  }

  .share-line {
    display: flex;
    gap: 8px;
  }

  .share-line input {
    flex: 1;
    min-width: 0;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface-hi);
    padding: 9px 12px;
    font-family: var(--font-mono);
    /* 16px or iOS zooms in the moment the field is focused to copy from. */
    font-size: max(16px, var(--font-tiny));
    color: var(--dim);
  }

  .share-line button {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 44px;
    padding: 0 14px;
    border-radius: var(--radius);
    background: var(--accent);
    color: var(--ink);
    font-weight: 600;
    font-size: var(--font-small);
    transition: background 0.2s ease;
  }

  .share-line button:hover {
    background: var(--accent-hi);
  }

  .share-hint {
    color: var(--dim);
    font-size: var(--font-small);
  }

  .share-size {
    color: var(--text);
    font-variant-numeric: tabular-nums;
  }

  /* The only warning the panel gives, because it is the only field a guest
   * cannot do without. */
  .share-warning {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    padding: 10px 12px;
    border: 1px solid var(--danger);
    border-radius: var(--radius);
    background: color-mix(in srgb, var(--danger) 8%, var(--surface));
    font-size: var(--font-small);

    svg {
      flex: none;
      margin-top: 2px;
      color: var(--danger);
    }
  }

  .share-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
  }

  .share-qr {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* Big enough to actually scan. A guest link needs a version-26 code — 121
   * modules — and at 84px each module was under 0.7px: a camera cannot read
   * that, on screen or printed small. */
  .share-qr img {
    width: 176px;
    height: 176px;
    border-radius: 8px;
    /* Contrast for a camera, not a palette choice. */
    background: #ffffff;
    padding: 4px;
    border: 1px solid var(--line);
  }

  .share-qr figcaption {
    color: var(--dim);
    font-size: var(--font-tiny);
    max-width: 20ch;
  }

  .share-open {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    font-weight: 600;
    color: var(--accent);
    text-decoration: none;
  }

  .share-open:hover {
    color: var(--accent-hi);
  }
`
