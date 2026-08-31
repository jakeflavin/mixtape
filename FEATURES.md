# Features

What the app does, and the decisions behind each behavior. Update this file in the same
commit as any change to them.

## Routing

One page, two modes, decided once at load from the query string:

| Link                   | Renders                                         |
| ---------------------- | ----------------------------------------------- |
| `/mixtape/`            | the builder, seeded from the localStorage draft |
| `/mixtape/?m=…`        | the invite for the document in `m`              |
| `/mixtape/?m=…&edit=1` | the builder, seeded from the document in `m`    |

Moving between modes is a real navigation, not client routing — that is what lets the
parser-blocking script in `index.html` paint the right ground before React runs. A corrupt
or truncated `m` falls back to the builder rather than a broken invite.

## The document

`lib/types.ts` is the whole schema: names, date, time, venue, city, travel notes, FAQs,
playlist link, a note, an album title, a theme. `lib/codec.ts` compresses it (lz-string →
URL-safe blob) and treats everything read back as hostile — unknown fields dropped, sizes
clamped, malformed list entries discarded, unknown themes mapped to the default. Every
list entry carries an id so builder edits have stable keys.

The theme id also rides separately as `t`, purely so `index.html` can resolve the ground
without decompressing anything.

## The invite

- **Closed**: the jewel case front — spine, plastic gloss, cover art from the document.
  The disc waits underneath so the opening swing reveals it. "Press to open" under it.
- **Opening**: the lid swings 104° on a perspective hinge (0.8s). The end of the swing is
  a timer, not an animation callback — see the comment in `Invite.tsx`.
- **Open**: the same case, open — a plastic shell with a rim and a hinge, the booklet
  paper on one side and the disc spinning in its moulded tray on the other. It never
  stops being the album: under 900px the case stands upright (tray above the hinge,
  booklet below) instead of losing the tray.
- **The booklet flips.** Pages are a stack of stapled sheets; a drag lifts the top
  sheet over its binding and follows the finger, and release past 60px completes the
  flip (the covers resist past the first and last sheet). A printed folio ("02 / 04")
  sits between two chevrons for anyone who would rather press, and the left/right
  arrow keys turn pages too. A release at the end of a flip never also "clicks" what
  the finger was over.
- Pages: The date, Getting there, Good questions (with the QR), Press play. Pages with
  nothing in them disappear; the date always shows, and the record is always in the tray.
- The FAQ page carries a QR code of the invite's own URL, so a guest can hand it on.
- The footer links back to the builder ("Make one for your own wedding").
- Reduced motion collapses every entrance to a plain appearance and parks the disc.

## The builder

- Sections: the couple, the day, travel, questions, the playlist, the look, share.
- Travel notes and FAQs share one list editor (both are a short line plus a paragraph).
  Rows can be added and removed; removal is per-row with an icon button.
- The look is ten swatches, each painting its own cover gradient and accent dot. Picking
  one re-skins the live preview beside the form — the preview panel is the one element the
  genre palette is written onto, so the builder chrome stays neutral.
- The preview shows the closed cover exactly as a guest first sees it.
- Share hands out the guest link and the edit link, each with a copy button, plus a QR of
  the guest link for anything printed. The copy explains that the edit link IS the invite —
  there is nowhere else it lives.
- The working copy persists to `localStorage` under `mixtape.draft` on every change, so a
  reload keeps a half-written form. "Start over" confirms, then resets to the starter
  document.
- The starter document is a filled example, not an empty form — the live preview is the
  pitch, and an empty jewel case sells nothing.

## Formatting

Dates and times go through `Intl` with no locale passed. Date strings are parsed by hand
(`2027-06-12` as a _local_ date — `new Date(string)` would shift it a day west of
Greenwich) and impossible dates are rejected rather than rolled over. The days-away pill
counts whole days and hides once the date has passed.
