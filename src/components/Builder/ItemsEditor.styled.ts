import styled from 'styled-components'

export const Rows = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;

  .row {
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }

  .row-fields {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  input,
  textarea {
    width: 100%;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface);
    padding: 9px 12px;
    resize: vertical;
    /* 16px or iOS zooms the page in on focus — see Builder.styled. */
    font-size: max(16px, var(--font-body));
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--dim);
  }

  .row-remove {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: var(--radius);
    color: var(--dim);
    transition:
      color 0.2s ease,
      background 0.2s ease;
  }

  .row-remove:hover {
    color: var(--danger);
    background: var(--surface-hi);
  }

  .row-add {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    color: var(--accent);
    font-weight: 600;
    padding: 6px 2px;
  }

  .row-add:hover {
    color: var(--accent-hi);
  }
`
