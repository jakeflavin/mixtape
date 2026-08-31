# mixtape

A wedding save-the-date shaped like a CD: a builder writes the whole invite into the
link, a guest opens the link into a jewel case. React 19 + Vite SPA, no backend of any
kind. Overview and commands: [README.md](README.md).

## Rules (must follow)

- Never assume anything — your knowledge may be out of date. Use the context7 MCP for
  current docs whenever a question involves a library, framework, or CLI (React, Vite,
  motion, lz-string, qrcode, …).
- Read [DESIGN.md](DESIGN.md) before making any UI change. Verify the builder in both
  light and dark, and any invite change in at least one light theme (indie) and one dark
  one (jazz).
- Read [FEATURES.md](FEATURES.md) when planning or touching an existing feature. Update
  it when behavior changes.
- The link is the only storage. Do not add a database, an account, or any server call.
  The localStorage draft (`mixtape.draft`) is a convenience copy, never the document.
- Everything read out of a link goes through `sanitize()` in `lib/codec.ts`. New document
  fields are added there, in `lib/types.ts`, and to the tests, together.
- The theme grounds in `index.html` and the palettes in `lib/themes.ts` are the same
  numbers. Changing either changes both.
- No `AnimatePresence`, and no animation-completion callbacks driving state — React 19
  StrictMode orphans them and the UI freezes. Enter-only animations; timers end phases.
  The comments in `Invite.tsx` explain.
- Tokens only in CSS. The allowed hex literals outside the token sources are the QR
  card's machine colours and the theme-picker swatches, both commented.
- Never remove functionality.

## Workflow

1. Follow all rules and pull in context before writing anything.
2. Write tests alongside the change.
3. Always visually verify as a real user — closed case, open case, every track, the
   builder — at 375/1000/1400px when layout is touched.
4. Run lint, typecheck, and tests before pushing.
5. Make small commits with detailed messages.
6. Unless specified otherwise, work in and push directly to `main`.
