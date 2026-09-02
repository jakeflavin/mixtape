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
or truncated `m` falls back to the builder rather than a broken invite, **and says so**:
the guest holding a link that lost its tail gets a line telling them to ask for it again,
because the same screen otherwise reads as a form they came to fill in. `readRoute`
therefore reports three states, not two — a document, no link, or a link that failed.

**A link pasted into a tab that already has Mixtape open reloads the page.** The document
rides in the fragment, so that navigation is same-document: React would keep the mode it
booted in and the address bar would be the only thing that changed. A `hashchange`
listener reloads, which is what `index.html` needs anyway to paint the new ground.

## The document

`lib/types.ts` is the whole schema: names, date, time, venue, city, a line for the date
page, travel notes, FAQs, playlist link, a note, a wedding website, an album title, a
theme, and the couple's own artwork for the cover and the disc. `lib/codec.ts` compresses it (lz-string →
URL-safe blob) and treats everything read back as hostile — unknown fields dropped, sizes
clamped, malformed list entries discarded, unknown themes mapped to the default. Every
list entry carries an id so builder edits have stable keys.

The theme id also rides separately as `t`, purely so `index.html` can resolve the ground
without decompressing anything.

**The document rides in the URL fragment** (`#t=…&m=…`), not the query string: fragments
never reach a server, and a document carrying artwork is tens of kilobytes — far past the
request-line limits that answer a long query with a 431. Links shared before the move
(`?t=…&m=…`) still read.

The share panel prints the guest link's length in the terms a person shares it in, so a
long one is a decision rather than a surprise.

**Custom artwork** (`coverImage`, `discImage`): the couple can print their own photos
over any theme — full bleed on the cover under a contrast scrim with the type gone
white, and edge to edge on the disc with the hub punched out. The builder shrinks a
picked photo on a canvas (JPEG, descending size/quality steps) until it fits the link;
sanitize accepts only `data:image/` under 160KB or an `https://` URL, and drops
anything else whole — a clamped image is a broken image. With artwork aboard the guest
link no longer fits in a QR code; the share panel says so instead of printing one.

**The QR gate is the encoder's real ceiling, not a round number.** A code at
error-correction level M holds 2,331 bytes, so the panel stops at 2,300; above the old
2,500 the encoder threw, the failure was swallowed, and the code vanished with nothing
said. `useQr` now reports _refused_ separately from _still rendering_, so the panel can
tell the difference. The code is drawn at 176px because 84px was 0.69px per module — a
camera cannot read that on screen or printed small, and the caption says to print it
60mm or wider.

## The invite

- **One case, one animation.** The open spread — lid, hinge, tray, disc — is mounted
  from the first frame, folded shut: a clip shows only the tray half with the cover
  lying on it and the hinge reading as the spine. Pressing it plays one continuous CSS
  choreography (`is-open` is the entire state): the cover swings 180° over the hinge,
  its paper back showing past edge-on, while the case unfolds to full width, and the
  booklet settles onto the lid as the cover lands (~0.7s in). No scene swap, no timers.
- **Open**: the case is only a case — an empty lid with the recess and tabs the booklet
  came out of, the hinge, and the disc spinning in its moulded tray. The booklet is a
  separate paper object resting on the open case, slightly off centre and a few degrees
  askew. Desktop lays the case flat (lid | hinge | tray); under 900px the same flat case
  is simply zoomed in on the tray half — the spine sits at the left edge, opening swings
  the cover left exactly as on desktop, and the lid unfolds off screen and is cut off.
  The booklet stays square, the shape of the thing that comes out of a jewel case, with
  the disc's lower arc showing beneath it.
- **The booklet opens like a booklet.** Its first sheet is the cover — the album art
  printed on paper — so the first flip is opening the booklet itself; the folio counts
  it as page 00. Pages are a stack of stapled sheets over a back cover; a drag lifts
  the top sheet over its binding and follows the finger, and release past 60px
  completes the flip (the covers resist past the first and last sheet). A folio chip
  ("02 / 04") between two chevrons serves anyone who would rather press, and the
  left/right arrow keys turn pages too. A release at the end of a flip never also
  "clicks" what the finger was over.
- Pages: The date, Getting there, Good questions, Press play. Pages with nothing in
  them disappear; the date always shows, and the record is always in the tray — under
  900px the booklet rides high enough, and the disc sits low enough in its moulding,
  that a real arc of it stays in view rather than a sliver.
- **Opening the case moves focus into the booklet.** The cover is a button that disables
  itself when pressed, so a keyboard would otherwise be left standing on nothing; focus
  goes to the Next chevron once the booklet has landed. Sheets that are not the open one
  are `inert`, and so is the whole booklet before the case is opened: a link on page four
  used to be the first thing Tab reached from the cover.
- **Nothing a guest reads is generated.** Every line was typed by the couple, and an
  empty field simply does not print — there is no days-away counter and no boilerplate.
  Every page shares one grid — the track eyebrow, the title and the content sit in the
  same place on every sheet, all set left like printed liner notes. The couple's own
  lines (`dateNote`, `note`) print in italics; travel notes and questions set as
  credits with hairlines between entries.
- The questions page prints a QR code of the couple's wedding website (`website`),
  when one is provided — and the whole card is a link to that website, for the guest
  reading on the very phone that cannot scan itself. No website, no code. (The guest-link QR for printing lives in
  the builder's share panel, not the invite.)
- **EXPERIMENT (2026-09-02, may be reverted):** sheets never scroll. When a page has
  more content than its sheet can show, the last lines fade out under a printed
  gradient and a "More" chip on the booklet's corner opens the page in full in a
  native dialog (SheetModal) — full-screen on a phone, a card on desktop. Overflow is
  measured on the live sheet, so the fade and chip only exist when content is actually
  clipped. The chip sits below the paper's edge, on the plastic, never over the words it
  exists to rescue; the dialog carries the same printed fade when there is more below the
  fold, and closing it puts focus back on the chip. On a phone the page is set tighter so
  a normal invite is not clipped at all. The feature is the commit range starting at 995abe2; revert those commits
  together to remove it.
- The footer links back to the builder ("Make one for your own wedding").
- **Printing gives you the words, not the object.** There is no plastic on paper: the
  print stylesheet lays the booklet out as what it always was — a title block and then
  every page in order, in ink — with the playlist's address spelled out after its button
  and the case, chevrons and credit line dropped.
- Reduced motion collapses every entrance to a plain appearance and parks the disc.

## The builder

- Sections: the couple, the day, travel, questions, the playlist, the look, share.
- Travel notes and FAQs share one list editor (both are a short line plus a paragraph).
  Rows can be added and removed; removal is per-row with an icon button.
- The look is ten swatches, each painting its own cover gradient and accent dot. Picking
  one re-skins the live preview beside the form — the preview panel is the one element the
  genre palette is written onto, so the builder chrome stays neutral.
- The preview shows the closed cover exactly as a guest first sees it, and links out to
  the whole invite — the booklet is a different shape and size, so the panel cannot show
  it and says where to look instead.
- The share panel warns when there is no date in the document. It still hands out the
  links: an invite that is not finished is the couple's business, but not knowing is not.
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
Greenwich) and impossible dates are rejected rather than rolled over.
