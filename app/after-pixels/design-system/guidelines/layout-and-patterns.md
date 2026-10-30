# Layout and adaptive patterns

## Page layout

Principles first. These hold for every screen; the components below are one proven answer, not the only shape a page can take. A new problem can call for a new layout, as long as it passes these.

- **Space is spent, not filled.** Every block earns its room by what it tells the player. Empty space inside a block is waste; space between groups is structure. Size follows importance, within limits: the most important thing gets the most room, never the whole screen.
- **Group by meaning.** Related information sits together in one clear compartment; unrelated information is visibly apart. Fewer, larger, well-grouped pieces read better than many small ones. Lots of small text with little grouping reads as flicker.
- **Highest value first, everywhere.** Order content by what the player most needs now. On a phone that order is the scroll, so it matters most there.
- **Keep the phone short.** Every block added is scrolling on a phone. Show a summary on the page and move the full set one tap away (its own page, a Disclosure, a panel). If a phone page needs a long scroll to reach the second important thing, cut or move content rather than shrinking it.
- **Use wide screens by arranging.** On desktop, place things side by side rather than stretching one column or leaving it stranded. From 640px nothing runs full width by default; under 640px buttons do (visual-foundations.md, Layout).
- **States change content, not shape.** A block with several states keeps one layout and about one height, so the page doesn't jump and no state looks emptier than another.
- **Clickable reads as clickable at rest.** Whole target, visible signal (chevron, underline, button shape), hover only as a bonus.

### Proven answers

Reach for these when they fit; don't bend a problem to fit them.

- `PageGrid`: one column on a phone, two from 900px (`2fr / minmax(320px,1fr)` or `split="even"`). Cards written in phone order; desktop pairs them row by row. Paired cards start at the same top, match height, share padding, and both carry a title or neither does.
- Text inside one card: usually a heading, body 16px and muted 14px; one bold weight (600 in text, 700 in headings); nothing under 13px.
- Lists that grow without end: the page shows a summary as `ListRow`s (as many as fit the place) with an "All…" link; "All…" opens its own page with search, order, a filter and numbered pages, not an endless "Show more".
- `CardRow`: a short set of cards under a section heading that scrolls sideways when it doesn't fit. Previous and Next show only while it overflows. Any control that belongs to a heading sits on the heading's line, centred on its first line; a sentence under the heading runs below both, never between the heading and its controls. Its game cards are `GameCard`s, whatever the section is called. A game is shown four ways only: GameCard in a row, GamePick for a pair featured by hand, GameTile in the all-games wall, ListRow in a list of games or plays; Coming soon has its own card. In a CardRow, the row shares four lines (picture, name, blurb, tags) and every card's parts sit on them, so they start level and the cards are one height. Pictures never stretch to fill. A shorter part leaves the rest of its line blank. Blurbs are written to two lines and tags to one at 220px.
- A list of games the player owns or can open: one row per game, the same question on every row (is there something to play now?), answered in the result slot. See ListRow.
- A game's page head: the cover beside the title and its links, sharing a top and a bottom edge (`Cover fill` in `.mcp-cover-head`). See Cover.
- `ListRow`: whole row one target, chevron at rest, no inline actions, fixed slots that don't move between widths. See ListRow for what earns a place in a row.
- **The footer stays at the foot of the window.** On a page shorter than the window, the extra height goes above the footer, never below it: the page is a column at least the window's height and the footer takes `margin-top:auto`.
- **Coming soon is a pair of `SoonCard`s** under a row of games, two columns from 720px. Every card carries the Coming soon chip. A game that is out with a chapter coming keeps the pair's shape: a CHAPTER label and one "Play chapter 1" chip as its only way in.
- **Needs the Pass takes the play control's place** when the player cannot play without the Pass: `NeedsPass`, "What stays, what returns". Two halves split by one ruled line; side by side from 640px, stacked under it. One size and one grid place in both variants (had the Pass, never had it). Every line is filled by rule from platform facts, never per game
- **A row of games ends with "All games".** Every `CardRow` of games is followed by an "All games" `TextLink` to the store, on its own line under the row, and under the Coming soon cards when they follow the row.
- **A now card ends in one action row.** A main `Button` at the left (Play before a play; "Go to session" while one is under way and once it is done) and one slot line at the right (the next-time line, or the free player's "Keep playing with the Pass."). No rule or band above it: 24px of space (`--space-5`), the card's 16px gap plus 8px. The row is pinned to the card's foot with `margin-top: auto`, so a card stretched beside a taller one opens its extra space above the row. Under 640px the button runs full width and the line sits centred under it. Share is not on the card.

## Adaptive patterns (from ui-design.md)

- **Only a panel changes shape on a phone.** An overlay that takes focus is one of three kinds. Ask in this order; the first that fits is the kind.
  - **Dialog** (`Popup`, the default kind): one question or one short edit, nothing behind it usable until answered (delete confirm, disconnect, rename). Centred 380px window at every width. Content never scrolls; if it would outgrow the space above the on-screen keyboard it becomes a page or a panel.
  - **Menu** (`Menu`): a short list of commands opened from a control. Opens at its control at every width, no dim. A list long enough to scroll is a panel.
  - **Panel** (`Popup kind="panel"`): anything else the user stays in and works with (a picker, a list that grows). Bottom sheet under 640px, centred 480px window at 640px and up (`breakpoint` per surface). Body scrolls.
  - Tooltips and status messages take no focus, are none of these and never swap.
  - Same title, text and buttons in the same order at every width.
  - A pop-up with one action lets that button fill the row. Don't add Close just to fill the space; Escape and the dim already close it.
- **Every action that changes state shows it is working.** From the press until the result, the pressed button (usually the submit button) shows a spinner beside its label and can't be pressed again: `Button loading`, or return a promise from `onClick`. The spinner shows at once and holds at least 400ms. A dialog whose main action is working passes `busy` so it can't be dismissed mid-way.
- Hover becomes tap on touch.
- Phone top bar, signed out: the logo and the Menu button only. The menu lists the pages, then a divider, then Sign in (Secondary) and Start free (main) as full-width buttons, stacked in that order. Sign in is never a plain row among the pages. Two outlined buttons side by side in the bar (Sign in beside Menu) do not fit at 390px with the logo, and look equal when they are not.
- Destructive actions look different before the press: red link for light actions, filled red for heavy ones.
- Prefer a plain statement to a disabled control.
- Errors inline, after the first submit, then live; a refused submit moves focus to the first invalid field.
- Focus returns to the opener when a dialog, panel or menu closes. Escape and the dim (or a press outside a menu) close it.
- No toasts: the changed state is the acknowledgement (e.g. "Add to Claude" → "Added").
- Confirm only serious, hard-to-undo actions, naming the consequence.
- **Scrolling card row.** One row that scrolls sideways whenever its cards don't fit the width, at any viewport. Cards keep a set width (220–280px) and the next one always peeks in. Light snap: `scroll-snap-type: x proximity`, cards `scroll-snap-align: center`. The row sits still only when every card fits; that depends on the number of cards, never on a fixed screen width. The row is focusable (`tabIndex=0`, `role="region"`, `aria-label`) and takes the standard focus outline. Browser default scroll bar.
