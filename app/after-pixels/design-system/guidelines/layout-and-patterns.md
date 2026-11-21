# Layout and adaptive patterns

## Page layout

This design system follows the monorepo's `specs/governance/standards/ui-design.md`, which holds the rules for how any screen behaves. The principles below hold for every After Pixels screen on top of it; the components are one proven answer, not the only shape a page can take. A new problem can call for a new layout, as long as it passes both.

- **Group by meaning.** Related information sits together in one clear compartment; unrelated information is visibly apart. Fewer, larger, well-grouped pieces read better than many small ones. Lots of small text with little grouping reads as flicker.
- **Keep the phone short.** Every block added is scrolling on a phone. Show a summary on the page and move the full set one tap away (its own page, a Disclosure, a panel). If a phone page needs a long scroll to reach the second important thing, cut or move content rather than shrinking it.
- **Full width by exception.** From 640px nothing runs full width by default; under 640px buttons do (visual-foundations.md, Layout).
- **States change content, not shape.** A block with several states keeps one layout and about one height, so the page doesn't jump and no state looks emptier than another.
- **Clickable reads as clickable at rest.** Whole target, visible signal (chevron, underline, button shape), hover only as a bonus.

### Proven answers

Reach for these when they fit; don't bend a problem to fit them.

- `PageGrid`: one column on a phone, two from 900px (`2fr / minmax(320px,1fr)` or `split="even"`). Cards written in phone order; desktop pairs them row by row. Paired cards start at the same top, match height, share padding, and both carry a title or neither does.
- Text inside one card: usually a heading, body 16px and muted 14px; one bold weight (600 in text, 700 in headings).
- Lists that grow without end: the page shows a summary as `ListRow`s (as many as fit the place) with an "All…" link; "All…" opens its own page with search, order, a filter and numbered pages, not an endless "Show more".
- `CardRow`: a short set of cards under a section heading that scrolls sideways when it doesn't fit. Previous and Next show only while it overflows, on the line just above the cards: beside the sentence under the heading if there is one, else on the heading's line. They move the cards, so they stay next to them. Its game cards are `GameCard`s, whatever the section is called. A game is shown four ways only: GameCard in a row, GamePick for a pair featured by hand, GameTile in the all-games wall, ListRow in a list of games or plays; a game not out yet has its own card (SoonCard), and a game out for now stays a GameCard in its row with `soon`. In a CardRow, the row shares four lines (picture, name, blurb, tags) and every card's parts sit on them, so they start level and the cards are one height. Pictures never stretch to fill. A shorter part leaves the rest of its line blank. Tags run to one line at 220px.
- A list of games the player owns or can open: one row per game, the same question on every row (is there something to play now?), answered in the result slot. See ListRow.
- **Pages written for each game.** The product page, the game page in the Library and the session page have named patterns of their own, with their values, in [page-patterns.md](page-patterns.md): the product page head, the library card grid, the now card, the session card and the rest.
- `ListRow`: whole row one target, chevron at rest, no inline actions, fixed slots that don't move between widths. See ListRow for what earns a place in a row.
- **The footer stays at the foot of the window.** On a page shorter than the window, the extra height goes above the footer, never below it: the page is a column at least the window's height and the footer takes `margin-top:auto`.
- **Coming soon is a pair of `SoonCard`s** under a row of games, two columns from 720px. Every card carries the Coming soon chip. A game that is out for now, and coming back, is not a SoonCard: it keeps its place in its row as a GameCard, GamePick or GameTile with `soon`, dimmed, with no way in. A game that is out with a chapter coming keeps the pair's shape: a CHAPTER label and one "Play chapter 1" chip as its only way in.
- **Needs the Pass takes the play control's place** when the player cannot play without the Pass: `NeedsPass`, "What stays, what returns". Two halves split by one ruled line; side by side from 640px, stacked under it. One size and one grid place in both variants (had the Pass, never had it). Every line is filled by rule from platform facts, never per game
- **A row of games ends with "All games".** Every `CardRow` of games is followed by an "All games" `TextLink` to the store, on its own line under the row, and under the Coming soon cards when they follow the row.

## Adaptive patterns

The standard sets the three kinds of overlay and which one swaps on a phone. This system builds them as follows.

- **Overlays.**
  - **Dialog** (`Popup`, the default kind): a delete confirm, a disconnect, a rename. Centred 380px window at every width.
  - **Menu** (`Menu`): opens at its control at every width, no dim.
  - **Panel** (`Popup kind="panel"`): a picker, a list that grows. Bottom sheet under 640px, centred 480px window at 640px and up (`breakpoint` per surface). Body scrolls.
  - A pop-up with one action lets that button fill the row. Don't add Close just to fill the space; Escape and the dim already close it.
- **Working state.** From the press until the result, the pressed button (usually the submit button) shows a spinner beside its label and can't be pressed again: `Button loading`, or return a promise from `onClick`. The spinner shows at once and holds at least 400ms. A dialog whose main action is working passes `busy` so it can't be dismissed mid-way.
- Phone top bar, signed out: the logo and the Menu button only. The menu lists the pages, then a divider, then Sign in (Secondary) and Start free (main) as full-width buttons, stacked in that order. Sign in is never a plain row among the pages. Two outlined buttons side by side in the bar (Sign in beside Menu) do not fit at 390px with the logo, and look equal when they are not.
- Destructive actions: a red link for light actions, filled red for heavy ones.
- Escape and the dim (or a press outside a menu) close a dialog, panel or menu.
- No toasts: the changed state is the acknowledgement (e.g. "Add to Claude" → "Added").
- **Scrolling card row.** One row that scrolls sideways whenever its cards don't fit the width, at any viewport. Cards keep a set width (220–280px) and the next one always peeks in. Light snap: `scroll-snap-type: x proximity`, cards `scroll-snap-align: center`. The row sits still only when every card fits; that depends on the number of cards, never on a fixed screen width. The row is focusable (`tabIndex=0`, `role="region"`, `aria-label`) and takes the standard focus outline. Browser default scroll bar.
