import '@testing-library/jest-dom'

/*
 * jsdom has no media queries at all, and this app reads two — the builder falls back to
 * prefers-color-scheme, and the invite asks whether motion is wanted before it animates.
 *
 * Reduced motion matches on purpose: a headless DOM has no frames, so the honest answer
 * to "should this animate" is no. It also keeps the tests deterministic — the case opens
 * on the click itself rather than after an animation jsdom may or may not finish timing.
 */
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

/*
 * Motion measures elements as it animates them. jsdom has no layout, so a stub that
 * never reports keeps the components mountable and leaves the geometry to a browser
 * check, where it is real.
 */
if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
