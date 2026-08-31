# Mixtape

A wedding save-the-date shaped like a CD. Everything about it is in the link.

Live at <https://portfolio-4b9fe.web.app/mixtape/>, as part of
[the portfolio](https://github.com/jakeflavin/portfolio).

## What it is

A couple fills in a form: their names, the date, the venue, how to get there, the questions
people will ask anyway, and a link to the playlist that is theirs. Out comes a link. A
guest who opens it sees a closed CD jewel case with the couple's names on the cover;
pressing it swings the lid open onto a booklet — the date, the travel notes, the FAQ with a
QR code of the invite itself, the disc spinning in its tray, and a play button that opens
the playlist.

Ten looks ship with it, one per genre — indie, rock, pop, hip-hop, country, jazz,
classical, electronic, punk, disco — each a full palette, display face and cover art of its
own.

It stores nothing. No account, no server, no database. The invite exists only as its URL:
the document is compressed with lz-string into the `m` query parameter, and the builder
hands out two links — the guest link, which is the invite, and the edit link, which is the
same document reopened in the form. The one concession to convenience is a localStorage
draft so a page reload does not eat a half-written FAQ.

## Why the link being the document is the right trade

A save-the-date has one job for one audience on one day, and then it is over. Nothing about
that deserves an account, a row in someone's database, or an invite that dies when a free
tier does. A URL can be texted to a hundred people, printed as a QR code, and will still
open years later; and because the edit link carries the whole document, it can be edited
from any device with no login to lose. The cost is a long URL — about a kilobyte — which
messaging apps and QR codes both take without complaint.

## Commands

```bash
npm run dev          # Vite dev server
npm test             # Vitest
npm run lint         # oxlint + the global-css guard
npm run typecheck    # tsc -b
npm run build        # production build (tsc first)
```

## Structure

```
src/
  App.tsx                     routes: ?m= → invite, ?m=&edit=1 or nothing → builder
  components/
    Invite/                   the jewel case, cover art, disc, booklet pages
    Builder/                  the form, theme picker, share panel
  hooks/                      draft persistence, theme application, QR rendering
  lib/                        codec (link ↔ document), themes, date formatting
```

See [FEATURES.md](FEATURES.md) for behavior and [DESIGN.md](DESIGN.md) for the look.
