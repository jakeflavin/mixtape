# Design

Read this before any UI change.

## The object is the interface

The reference is a physical CD in a jewel case, and every screen keeps faith with it: the
closed case has a spine, a plastic gloss and a hinge; opening it is a lid swinging on a
perspective hinge that reveals the disc sitting in the tray; the content pages are the
booklet, navigated by a tracklist. Nothing on the invite looks like a website — no header,
no cards, no nav bar. The one exception is the small "Made with Mixtape" footer.

The builder, by contrast, IS a website — a plain form in the set's neutral style — because
the couple is working, not receiving.

## Two theme systems, on purpose

- **The builder** uses the shared light/dark pair on `data-theme`, following the device.
  Its tokens live in `src/index.css` like every other app in the set.
- **An invite** uses one of ten _genre palettes_. Like hat and countdown these are named
  looks, not light/dark pairs — jazz is navy, classical is ivory, and neither has a
  counterpart. `lib/themes.ts` writes the whole token set onto `:root` as inline custom
  properties, which outrank the neutral defaults. `index.html` carries a small table of
  each theme's ground (`--bg`, `--text`, `color-scheme`) keyed by the `t` query parameter,
  so the first frame is the right colour; that table and `themes.ts` are the same numbers,
  and changing either changes both.
- **The builder's preview panel** is the one element inside the builder that gets the
  genre palette (written onto the `aside`, not `:root`), so picking a theme re-skins the
  preview while the form stays neutral.

Every colour a component uses is a token (`--bg`, `--text`, `--dim`, `--line`,
`--surface`, `--accent`, plus the cover/disc set). The hex literals in `themes.ts`,
`index.css` and `index.html` are the token _sources_. The two deliberate exceptions are
QR modules and their white card (contrast for a camera, commented as such) and the theme
picker swatches (each paints a palette that is by definition not the active one).

## Theme anatomy

A theme is: a palette, a display face (`--font-display`, with tracking and case), and a
cover motif (rings, burst, bars, grid, wave) drawn in CSS at low alpha behind the names.
Ten palettes share five motifs; the pairing of palette + face + motif is what makes ten
looks read as ten records. Display faces are system stacks — Didot for jazz/classical,
condensed caps for rock/punk, mono for electronic, rounded for pop — no webfonts.

Dark themes: rock, hip-hop, jazz, electronic, disco. Light: indie, pop, country,
classical, punk. `color-scheme` follows, so form controls and scrollbars match.

## Motion

The `motion` library runs every entrance; CSS keyframes run the loops (disc spin,
equalizer). Timings: lid swing 0.8s with a hard-in ease, scene entrances ~0.45s, page
swaps 0.28s. Loops are slow and quiet — the disc takes 9s per revolution.

Two hard-learned rules, both commented in `Invite.tsx`:

- **No AnimatePresence.** Exit choreography waits on completion callbacks that React 19's
  StrictMode double-mount orphans, and a swap that waits on one freezes the invite. Scene
  and page changes are plain conditionals/remounts with enter-only animations.
- **Timers end phases, not animation callbacks**, for the same reason.

`prefers-reduced-motion` collapses everything: entrances become plain appearances (the
global reset also floors CSS animation durations), and the disc is rendered parked.

## Layout

- Closed case: `min(84vw, 420px)`, aspect 1.06 — the near-square of a real jewel case,
  spine at 6.5%.
- Open case: two equal panels to 940px wide; under 900px the tray hides and the booklet
  stands alone. Cover and disc type scale with container queries (`cqw`), so the same
  components serve the invite, the builder preview, and any size between.
- The booklet page is left-aligned prose with an eyebrow ("Track 03"), a display-face
  title, and body copy capped at 44ch.

## Copy

Sentence case everywhere. The voice is the couple's, warm and a little dry — "Today. Go
get dressed.", "We love your kids. We are also throwing a party until two in the
morning. You decide." Labels say what the control does. The share panel says out loud that
losing the edit link is losing the invite.
