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
    font-size: var(--font-tiny);
    color: var(--dim);
  }

  .share-line button {
    display: inline-flex;
    align-items: center;
    gap: 7px;
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

  .share-qr img {
    width: 84px;
    height: 84px;
    border-radius: 8px;
    /* Contrast for a camera, not a palette choice. */
    background: #ffffff;
    padding: 4px;
    border: 1px solid var(--line);
  }

  .share-qr figcaption {
    color: var(--dim);
    font-size: var(--font-tiny);
    max-width: 16ch;
  }

  .share-open {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: var(--accent);
    text-decoration: none;
  }

  .share-open:hover {
    color: var(--accent-hi);
  }
`
