# Phone snags: review notes (design system side)

Running record of what has been agreed in the design system project, for the product agent. Snags are numbered as in the phone review of 11 October 2026.

## 4. Pass chip edges (done, in the design system)

**Found.** The chip is `Tag kind="locked"`. It had a 1.5px dashed `--control-edge` border. On a phone, 1.5px dashes fall between the screen's pixels: the line renders faint, and on the 26px left and right sides the dashes drop out. Desktop looked fine because the pixels line up more cleanly there.

**Decided.** Joe chose option 1, "Outline", from `playground/pass-chip.html`. The dashed edge is gone.

**Built in the design system:**
- `components/components.css` `.mcp-tag-locked`: no fill, solid 1.5px `--control-edge` edge, the Secondary button's look. Optical spacing: 8px left padding, 5px right, lock raised 1px, chevron pulled 3px towards the word. That makes the edge-to-ink gaps (~10px) and the ink-to-text gaps (~8.5px) match.
- Hover (mouse only): the edge turns off-white. Press: 16% text fill and `scale(.97)`, the Secondary button press. Both are keyed on the button or link the tag sits in (`:is(button,a):hover/:active > .mcp-tag-locked`). Reduced motion: no transition, no scale.
- `Tag.jsx`: new `go` prop for a trailing `next` chevron. It defaults to true for `locked` and false for every other kind.
- `Tag.d.ts`, `Tag.prompt.md` and `guidelines/visual-foundations.md`: no dashed edges on components, with the reason. The locked tag always sits inside a button or link with a 44px hit area.

**For the product:**
- Pull the new design-system bundle.
- `GsPassTag` keeps its `.gs-tagbtn` wrapper (44px hit area).
- Remove `.gs-tagbtn:active { opacity: .55; }` from `index.html`. The tag now presses itself; with that rule kept it would fade and shrink at once.
- No markup change: `<DS.Tag kind="locked">Pass</DS.Tag>` now renders the lock and the chevron.

## 3. Row arrows not level with the heading (done, in the design system)

**Found.** All three scrolling rows use the build's `GsCardRow` (`app/gs-site.jsx`). `.gs-rowhead` is a wrapping flex row with `align-items: flex-end`.
- Home "Available games" and Discover "Just added": the 44px arrows line up with the bottom of a ~28px heading, so the heading sits about 7px below the arrows' centre.
- Discover "Free to play": the heading block includes the sentence, which takes the full width. The arrows wrap onto a line of their own below it.

Other heading-plus-control rows (`.gs-sec-head` "All games" + Clear, `.lb-sechead`) hold a text link and line up correctly.

**Decided.** The scrolling row is a system pattern, so it moved into the design system as `CardRow`. Joe approved the heading line in `playground/card-row.html`:
- The title sits on the left and Previous/Next on the right, centred on the title's first line.
- The sentence runs under both.
- A two-line title keeps the arrows level with its first line.

**Built in the design system:**
- `components/surfaces/CardRow.jsx` / `.d.ts` / `.prompt.md`, CSS `.mcp-crow-*` in `components/components.css`, and the card `components/surfaces/cardrow.card.html`.
- Props: `title`, `sub`, `label`, `as`, `children`.
- Behaviour carried over from `GsCardRow`:
  - The arrows show only while the row overflows, and each hides at its end.
  - Focus moves to the other arrow, never to the page.
  - Reduced motion makes the arrows jump instead of glide.
  - Cards share the width when they fit (`--n`, from 560px). Otherwise they are 280px wide (82% on a phone) and the row snaps.
- The title gets `padding-block: calc((44px - 1.15em) / 2)`, so its first line's centre is always 22px down, level with the arrows' centre.
- Guidance in `guidelines/layout-and-patterns.md`: any control that belongs to a heading sits on the heading's line, and a sentence goes under both.

**For the product:**
- Replace `GsCardRow` with `DS.CardRow`. Pass the heading as `title` and the sentence as `sub`, never a heading block as children:
  - `<DS.CardRow title="Available games">…</DS.CardRow>`
  - `<DS.CardRow title="Just added">…</DS.CardRow>`
  - `<DS.CardRow title="Free to play" sub="Casebook’s first case and Delve’s first scene are free.">…</DS.CardRow>`
- Delete `GsCardRow` from `gs-site.jsx` and its `window` export.
- In `index.html`, delete `.gs-rowhead`, `.gs-rownav`, `.gs-rownav-btn`, `.gs-feats` and its container query. Check nothing else uses `.gs-feats` first.
- The cards keep their own markup.

## 5. What a Library row shows (decided; guidance in the design system, build to change)

**Found.** The build's Library row (`GsLibrary` in `app/gs-discover.jsx`, `.dc-lrow`) shows a small cover, the game's name, and one line: genre, then a status from `gsLibMe`. That status answers four different questions depending on the row: when you last played ("Played today", "Last played 13 September"), what you haven't played ("Not played today"), how far you've got ("In progress", "First case played"), and whether you can play it ("Only with the Pass", "Free first edition"). The row is the build's own markup, not the system's `ListRow`.

**Decided.** Joe chose option A, "What's waiting", from `playground/library-row.html`. Every row answers one question: is there something for me to play now? Genre is dropped from the row (the Genre filter covers it). Streaks and "what you missed" stay on the game's page.

**Built in the design system:** guidance only, no new component. `ListRow.prompt.md` has a "A library of games" section and `guidelines/layout-and-patterns.md` has a matching line. `ListRow` already has the slots.

**For the product.** Replace the `.dc-lrow` button with `<DS.ListRow lead={<GpMini art={g.art} sm />} title={g.name} result=… tone=… when=… onClick=…/>` inside a `<DS.RowList label="Library">`, and delete `.dc-lrow*` CSS once nothing else uses it. Replace the status text from `gsLibMe`:
- **Not played in the current period:** result "Today's word is ready" (Daily Word), "Today's groups are ready" (Daily Groups), "Today's case is ready" (Daily Mystery), "This week's room is ready" (Escape Room), "Today's hunt is ready" (Hunter). No tone.
- **In progress** (the week switch's "in progress"): "In progress". No tone.
- **Done:** "Done today" (daily games) or "Done this week" (weekly games). `tone="ok"`.
- **Free player, a game's free first edition played:** "Free case done" (Casebook), "Free scene done" (Delve). `tone="ok"`.
- **Free player, game needs the Pass:** "Pass only". No tone.
- **When:** the last-played date: "Today", or a date such as "10 Oct". Leave it empty if the game has never been played (revised after review: "Not played" in `when` made long names wrap at 320px).
- **Sort:** "Last played" keeps working from the same rank. Add nothing new.
- Drop the genre from the row. Keep the Genre and Schedule filters.
- The game's own page and History keep the streak and the missed days.

## 2. Holding a finger down (decided; built in the design system, build to follow)

**Found.**
- **Word selection:** nothing in the build stops it. Cards, rows, chips and links all allow text selection, so a long press selects a word.
- **Chips disappearing:** the game card's pressed fill (`.mcp-card.gs-host:is(.is-on, :active)`) is 10% text into the card, which is `#3A3734`. A `daily` tag's fill is 14% text into the page, also `#3A3734`. While the card is pressed, the chip's box matches the card and vanishes; the words stay.
- **Links fading:** the press state for links was 55% opacity, held for as long as the finger is down. Faded text reads as disabled, not pressed. The build repeats this in its own link classes.
- **The pose lasting the whole hold:** this is the written guidance (the pose plays while a finger is down). A tap reads fine; a long hold looks stuck. Joe kept this as it is (option 1, "Stay" in `playground/press-and-hold.html`). A "Boop" version (pose settles after 0.7s of holding) was offered and not chosen; it can be added later as a small timer on top.

**Built in the design system** (`components/components.css`, `guidelines/visual-foundations.md`, `guidelines/game-art-motion.md`):
- `.mcp-lnk` pressed: text turns white (danger links stay red) and the underline moves to 6px with full colour. No fade.
- Not selectable, with the phone's selection callout off: `.mcp-card.is-link`, `.mcp-row.is-link`, `.mcp-btn`, `.mcp-lnk`, `.mcp-art-host`, `.mcp-disc-btn`, `.mcp-menu-item`. Body text stays selectable.
- A `daily` tag inside a pressed `.mcp-card.is-link`, `.mcp-row.is-link` or `.mcp-art-host` lifts to a 24% fill for the length of the press, so it keeps its box.
- The game-art touch guidance now says the above, and that a real `<a href>` keeps the phone's long-press menu.

**For the product:**
- **Game cards:** `.gs-host` is already `.mcp-art-host`, so selection and the chip fix come with the new bundle. Nothing to add, but check on a phone that the card text no longer selects.
- **Link presses:** replace `opacity: .55` on `:active` with the new look for the underlined text links: `.gs-inlink`, `.gs-ft-link`, `.gs-ft-mail`, `.gs-support`, `.dc-tile-name`, `.gs-small a`, `.gs-legal-col a`. The rule is `:active { text-decoration-color: currentColor; text-underline-offset: 6px; color: #fff; }` (no colour change on the footer links if they are muted; use `var(--text)`). Buttons without an underline (`.gs-navlink`, `.gs-brand`, `.gs-iconbtn`, the cover buttons) keep their press as it is.
- **Pass chip:** the earlier note about removing `.gs-tagbtn:active { opacity: .55; }` still stands.
- **Selection on the build's own pressable pieces** that are not system components (`.gs-pz-item`, `.gs-hrow`, `.lb-tile`, `.lb-achbtn`, `.dc-chips > button`, `.lb-choice > button`, `.gs-plan`): add `-webkit-user-select: none; user-select: none; -webkit-touch-callout: none;`.

## 1. Phone top bar, signed out (decided; guidance in the design system, build to change)

**Found.** Below 820px (`.gs-narrow-only`) the signed-out bar is the logo and a Secondary "Menu" button (`GsTopBar`, `app/gs-parts.jsx`). The menu lists Discover, How it works and Pricing, then "Sign in" as a plain `.gs-menu-item` row like the pages, then Start free as a block main button (`.gs-pop-cta`). Sign in does not read as an action.

**Decided.** Joe chose option D, "Menu holds both as buttons", from `playground/phone-top-bar.html`. The bar stays as it is. Rejected:
- Sign in or Start free in the bar (A, B).
- Both in the bar (C), which overflows at 390px.
- Sign in as a Secondary button beside Menu: two outlined buttons that look equal, and it does not fit beside the logo at 390px.

**Built in the design system:** guidance only, in `guidelines/layout-and-patterns.md`.

**For the product** (`GsTopBar`, signed-out branch of the narrow menu):
- After the page rows, add a divider (`.gs-menu-div`).
- Replace the "Sign in" `.gs-menu-item` row and the separate `.gs-pop-cta` with one block holding `<DS.Button variant="secondary" block>Sign in</DS.Button>` then `<DS.Button block>Start free</DS.Button>`, stacked, 8px apart, 8px 16px padding. Each closes the menu and goes where it goes today.
- The signed-in menu and the wide bar (Sign in and Start free as buttons from 820px) are unchanged.
- Check: the menu's minimum width is 200px today. With the buttons full width that is fine, but 240px gives the labels more room. Use 240px if it still clears the left edge at 320px.

## Follow-up after the build (11 October)

- **Library at 320px, long names wrap beside "Not played".** The cause was the guidance, not ListRow: "Not played" is a phrase in the `when` slot, and it takes width from the title. Fixed in `ListRow.prompt.md`: a never-played game leaves `when` empty. With a short date ("13 Sep") the names fit at 320px.
- **A free account with today not played still shows Daily Word as "Done today".** This is a build data bug, and it predates these changes. The Library status comes from the fixed `GS_LIB_ME` seed and ignores the demo bar's Today switch. It should come from the same today and this-week state the game's own page reads (`lbNow` / `lbWeekDone`), so the Library and the game page always agree.
