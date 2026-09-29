# Card titles — Edit title, then the removal playground

Handoff, 2026-09-29. Two steps from the delta prompt: Edit title built into canon, then a
playground beside it for how a custom title is removed. Nothing here is ratified beyond what
the prompt marked Ratified.

## What was built, and where

**Canon**
- `app/card-title.jsx` (new, droppable). `circHeadline`, `circTitleMark`, `circRetitle`,
  `circUntitle`, `circCanRetitle`, `CardTitleMenuItem`, `CardTitleDialog`, `CARD_TITLE_CAP`.
  Drop the file and the menu item, editor and marker go; a stored custom title is ignored.
- `app/feed.jsx`. The headline reads `circHeadline`; the menu renders `CardTitleMenuItem`
  after Share and Save; the time line carries the marker. New optional `onEditTitle` prop on
  `FeedCard` and `FeedCardActions`.
- `app/main.jsx`. `retitling` state, the editor in the overlay chain, `requestEditTitle` on the
  candidate API. `STATE_KEY` → `circ_state_v16`.
- `app/talk-surface.jsx`, `app/talk-card.jsx`. Pass `onEditTitle` so the Overview's head card
  and a Read card's thought face carry the same menu.
- `app/talk-parts.jsx` (`candTitleOf`), `app/feed-search.jsx` (`circSearchHeadline`). Read the
  headline through `circHeadline`, so the thought face and search see the custom title.
- `app/seed-data.jsx`. Three Backend Pod fixtures. `circlists.html` loads the module.

**Data.** `item.customTitle` holds the contributor's title; `item.title` keeps the fetched one,
untouched. `item.fetchFailed` marks a failed unfurl so the seed does not derive a title from the
path (GOTCHA 4). The reset is `circUntitle`: it deletes `customTitle` and nothing else. No
refetch anywhere.

**Playground**
- `docs/specs/card-title-editing/playground/card-title-removal.html` + `pg-title-removal.jsx`.
  Mounts the whole real app with its own state key and swaps `window.CardTitleMenuItem` and
  `window.CardTitleDialog` on that page only. Canon's files are not edited for it. Listed in
  `playgrounds.json`.

## Mock data (Backend Pod, Active, top of the feed)

1. Fetched, someone else's: Rust Blog, Priya N. (existing).
2. Fetched, yours: The Pragmatic Engineer (existing).
3. Failed fetch, yours: headline `claude.ai/artifact/9Kd2mQxV7wTn4BhRpYc3Lf` in mono under
   `claude.ai`.
4. Custom title, yours: "The blameless reviews talk" over the USENIX fetched title.
5. Custom title, Marcus T.'s: "The queue rant, properly argued" over InfoQ; no Edit title
   in your menu.

**Staged states: none registered.** Every case sits on the landing circle's first screen, so
none is hard to reach, which is the register's bar (`ARCHITECTURE.md`). Config → Reset to
seeded data restores them.

## Yours to decide — what I chose

- **Form: the house edit dialog** (`EditCircleDialog`'s shell and single-line field). A title
  is communal and changes what everyone sees, so it earns a deliberate surface rather than an
  inline edit on a card that is also a link. One field, Enter saves, Esc/scrim/Cancel dismiss.
- **Menu placement: after Share and Save, above the divider, `edit` glyph, same weight.** The
  items every member has keep their position on every card; this one's presence moves nothing
  above it. Delete stays last and red.
- **Copy.** Menu and dialog title: "Edit title". Field label (aria): "Title". Placeholder:
  "Give it a title" (shows on a failed fetch, which opens empty). Help line: "Everyone in the
  circle sees this title." Empty-save statement: "Give it a title."
- **Cap: 80,** enforced by `maxLength`, no counter. A headline, not a sentence; two lines on
  a 320 card.
- **Marker: removed 2026-09-29.** It was "edited" after the time (`11h · edited`).
  `circTitleMark` now returns `null`; a retitled card carries no marker anywhere. The
  thought's and comments' own "edited" are unchanged.
- **While resolving: no Edit title.** A pending card has no menu at all, so nothing was needed.
- **The editor opens holding** the custom title, else the fetched title; on a failed fetch it
  opens empty because the address is not a title.
- **Empty save:** stays open with "Give it a title." under the field, writes nothing. Save is
  not disabled (ui-design.md, prefer a statement to a disabled control). Canon has no way to
  remove a title.
- **Save equal to the opening headline:** closes, writes nothing, no marker. Typing the fetched
  title over a custom one stores it as a custom title (marker stays). Open edge below.

## The playground's three options

- **01 In the editor.** "Use original title" (tertiary) sits left of Cancel when the card has a
  custom title. One tap resets and closes. No confirm. Cost: a second act inside a one-field
  dialog.
- **02 In the menu.** "Remove title" below Edit title on your retitled cards only. A confirm
  names what the card goes back to (the fetched title, or the address in mono). Cost: a menu
  item and a confirm for a reversible act.
- **03 Empty the field.** No named act. The placeholder shows the original; the help line adds
  "Clear it to go back to the original."; empty Save resets. Cost: discoverable only by reading
  the help line.

Bar: the three options (name on the face, line under the bar), and Card: *Over a fetched
title* / *Over a failed fetch*. Restage puts the custom title back. The bar enters Backend Pod
by pressing its home row, the way a member does.

## Not built, or unresolved

- **Options 01 and 03 fork the editor** (`PgTitleEditor`) because canon's editor may not be
  edited for Step 2. It copies the shell and field; it will drift if canon's editor changes.
- **Typing the fetched title exactly** over a custom one: kept as custom. Arguably a reset.
- **Home's Conversations rows and the Returns bar** read the headline through
  `candTitleOf` → `circHeadline`, so they show the custom title. Since 2026-09-29 a custom
  title also sets the title face there (`candBarSnap`'s `titled`), so a retitled
  failed-fetch card no longer shows in mono.
- **Share** hands the platform sheet the headline (`circHeadline`): the custom title, else
  the fetched title, else as before (2026-09-29).
- Overlay screenshots are unreliable here (GOTCHA 2); menu and dialogs need a look in a real
  browser.

## Next

1. Pick a removal route in the playground; merge it into `card-title.jsx` only.
2. Decide on the old help line ("Everyone in the circle sees this title.").

## Round two — the editor route (2026-09-29)

Joe leaned to option 01: reverting is an edit, so it belongs in Edit title, and the menu
label cannot be both clear and short. Not ratified. The open part is the control's form, now
in `playground/card-title-restore.html` (+ `pg-title-restore.jsx`), same rig:

- **01 Beside Cancel.** Round one's button, as the baseline.
- **02 Original, under the field.** "Original: <title>" with Restore at its end; one tap
  resets and closes. The address shows in mono on a failed fetch.
- **03 Original, as a fill.** The original is a row to tap; it fills the field and Save
  commits, so the reset can be seen before it lands. On a failed fetch the field shows the
  address read-only in mono; typing drops the fill.

## Round three — clearing the field restores (2026-09-29)

Round two's three read as furniture on a one-field dialog. Joe asked to look at clearing as
the reset, with no invented affordance. `playground/card-title-clear.html` (+
`pg-title-clear.jsx`). In every option the empty field shows the original as its
placeholder (mono for an address) and Save restores it. The canon help line is left out here;
dropping it from canon is pending.

First cut failed: all three explained themselves only once the field was empty, so nothing
told the member, before acting, how to go back. Rebuilt so the line is there on open:

- **01 Under the field.** "Clear it to go back to the original title."
- **02 Under, naming it.** "Clear it to go back to <original>." (address in mono on a failed fetch)
- **03 Above, naming it.** The 02 line under the dialog title, above the field.

**Ratified by Joe, 2026-09-29:** removal is clearing the field and saving. The editor says so
from the moment it opens, when the card has a custom title, with one line under the field:
"Clear to restore." The same string on fetched and failed cards. Playground option 01 now
carries it. **Merged into canon 2026-09-29** (`app/card-title.jsx`, `main.jsx` passes
`onRestore`, `circlists.html` styles the mono placeholder). The emptied field shows the
original as its placeholder, no full stop; on a failed fetch that is the address in mono. On
a card with no custom title the editor is unchanged, old help line included (pending).

