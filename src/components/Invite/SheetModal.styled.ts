import styled from 'styled-components'

/* Part of the sheet-modal experiment — see SheetModal.tsx. */
export const Dialog = styled.dialog`
  position: relative;
  margin: auto;
  width: min(92vw, 560px);
  max-height: 84dvh;
  border: none;
  border-radius: 10px;
  padding: 0;
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-deep);

  &::backdrop {
    background: rgb(0 0 0 / 0.55);
  }

  .modal-sheet {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 13px;
    padding: clamp(20px, 5vw, 32px);
    padding-right: clamp(52px, 9vw, 64px);
    overflow-y: auto;
    max-height: 84dvh;
  }

  .modal-close {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 1;
    background: color-mix(in srgb, var(--surface) 85%, transparent);
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    color: var(--dim);
    transition:
      color 0.2s ease,
      background 0.2s ease;
  }

  .modal-close:hover {
    color: var(--text);
    background: var(--surface-hi);
  }
`
