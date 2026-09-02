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
    top: 8px;
    right: 8px;
    z-index: 2;
    background: color-mix(in srgb, var(--surface) 85%, transparent);
    background-clip: content-box;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 5px;
    border-radius: 50%;
    color: var(--dim);
    transition:
      color 0.2s ease,
      background 0.2s ease;
  }

  .modal-close:hover {
    color: var(--text);
    background: var(--surface-hi);
    background-clip: content-box;
  }

  /* The same printed fade the sheet uses, so a page that goes on saying so
   * looks the same in here as it did out there. Set by the component, which
   * knows whether there is anything below the fold. */
  &.has-more::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 54px;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(180deg, transparent, var(--surface) 82%);
  }

  /* On a phone the sheet takes the whole screen. */
  @media (max-width: 899px) {
    width: 100vw;
    max-width: 100vw;
    height: 100dvh;
    max-height: 100dvh;
    margin: 0;
    border-radius: 0;

    .modal-sheet {
      height: 100%;
      max-height: 100dvh;
      padding-top: clamp(28px, 8vw, 44px);
    }
  }
`
